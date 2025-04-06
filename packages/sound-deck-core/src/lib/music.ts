import { AbstractSoundDeck } from "./AbstractSoundDeck"
import { ToneConfig, NoiseConfig } from "./input-types"
import { isNote, isOctive, Note, Octive, PitchedNote } from "./notes"
import { SoundControl } from "./SoundControl"


export type StaveNote = {
    pitch?: number,
    beats: number,
    atBeat: number,
}

export type TonalInstrument = { soundType: 'tone' } & Omit<ToneConfig, 'duration' | 'frequency' | 'endFrequency'>
export type PercussiveInstrument = { soundType: 'noise' } & Omit<NoiseConfig, 'duration' | 'frequency' | 'endFrequency'>
export type Instrument = PercussiveInstrument | TonalInstrument;

export const parseStaveNotes = (input: string): StaveNote[] => {
    const notesStrings = Array.from(input.matchAll(/[A,B,C,D,E,F,G,-][b,#]?[0-8]?\.*/gm)).map(match => match[0])
    let currentOctive: Octive = 4
    let atBeat = 0

    const notes = notesStrings.map<StaveNote>(noteString => {
        const chars = noteString.split('')
        const noteOrRestSymbol = (chars[1] === 'b' || chars[1] === '#' ? chars.splice(0, 2).join('') : chars.splice(0, 1).join('')) as Note;
        const nextCharAsNumber = Number(chars[0])

        if (isOctive(nextCharAsNumber)) {
            currentOctive = nextCharAsNumber
            chars.shift()
        }
        const beats = (1 + chars.length) * .25

        const pitch = isNote(noteOrRestSymbol) ? new PitchedNote(noteOrRestSymbol, currentOctive).pitch : undefined;

        const staveNote: StaveNote = {
            pitch,
            beats,
            atBeat: atBeat,
        }

        atBeat += beats
        return staveNote
    })
    return notes
}


class Silence {
    whenEnded: Promise<Silence>
    constructor(duration: number) {
        this.whenEnded = new Promise(resolve => {
            setTimeout(() => {
                resolve(this)
            }, duration * 1000
            )
        })
    }
}

type Stave = {
    instrument: Instrument,
    notes: StaveNote[],
    volume?: number
}

class EnhancedStave implements Stave {
    indexedNotes: Map<number, StaveNote>
    instrument: Instrument
    notes: StaveNote[]
    volume?: number
    constructor(stave: Stave) {
        this.instrument = stave.instrument
        this.notes = stave.notes
        this.volume = stave.volume
        this.indexedNotes = EnhancedStave.indexNotes(stave.notes)
    }
    get duration() {
        const lastNote = this.notes[this.notes.length - 1];
        return lastNote.atBeat + lastNote.beats;
    }
    static indexNotes(notes: StaveNote[]): Map<number, StaveNote> {
        const map = new Map<number, StaveNote>()
        notes.forEach(note => {
            map.set(note.atBeat, note)
        })
        return map
    }
}


export type MusicControl = {
    stop: { (): void },
    whenEnded: Promise<boolean>
}

const wait = async (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

const playNote = (soundDeck: AbstractSoundDeck, { pitch, beats }: StaveNote, instrument: Instrument, volume = 1, tempo = 2): Silence | SoundControl | null => {
    if (typeof pitch !== 'number') {
        return new Silence(beats / tempo)
    }

    if (instrument.soundType === 'noise') {
        return soundDeck.playNoise({
            ...instrument,
            volume: (instrument.volume ?? 1) * volume,
            endFrequency: undefined,
            frequency: pitch,
            duration: beats / tempo,
        })
    }

    return soundDeck.playTone({
        ...instrument,
        volume: (instrument.volume ?? 1) * volume,
        endFrequency: undefined,
        frequency: pitch,
        duration: beats / tempo,
    })
}


export const playMusic = (soundDeck: AbstractSoundDeck) => (staves: Stave[], tempo = 2): MusicControl => {

    const abortSignal = { aborted: false, currentBeat: 0 };
    const stop = () => abortSignal.aborted = true

    const enhancedStaves = staves.map(stave => new EnhancedStave(stave))
    const musicDuration = Math.max(...enhancedStaves.map(s => s.duration))

    const quarterBeatDuration = .25 / tempo;

    const eventTarget = new EventTarget()

    const tick = (event: Event) => {
        if (!(event instanceof MessageEvent)) {
            return
        }
        console.log(event.data)
    }
    eventTarget.addEventListener('metronome', tick)

    const nextQuarterBeat = async (time: number): Promise<boolean> => {
        if (abortSignal.currentBeat % 1 === 0) {
            eventTarget.dispatchEvent(new MessageEvent<number>('metronome', { data: abortSignal.currentBeat }))
        }
        if (abortSignal.currentBeat >= musicDuration) {
            console.log('finished')
            eventTarget.removeEventListener('metronome', tick)
            return true
        } else if (abortSignal.aborted) {
            console.log('stopped')
            eventTarget.removeEventListener('metronome', tick)
            return false
        }

        enhancedStaves
            .flatMap(stave => [stave.indexedNotes.get(time)]
                .map(note => note ? playNote(soundDeck, note, stave.instrument, stave.volume, tempo) : null)
            )

        await wait(quarterBeatDuration)
        abortSignal.currentBeat = time + .25
        return nextQuarterBeat(abortSignal.currentBeat)
    }


    return {
        whenEnded: nextQuarterBeat(0),
        stop,
    }
}
