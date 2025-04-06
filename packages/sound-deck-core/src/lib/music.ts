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

type BeatCallback = { (beat: number): void }
type VoidCallback = { (): void }


export type MusicControl = {
    stop: { (): void },
    whenEnded: Promise<boolean>,
    pause: { (): number },
    resume: { (): void },
    musicDuration: number,
    currentBeat: number,
    isPaused: boolean,
    onBeat: { (callback: BeatCallback): void }
    onFinish: { (callback: VoidCallback): void }
}

const wait = async (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

const playNote = (soundDeck: AbstractSoundDeck, { pitch, beats }: StaveNote, instrument: Instrument, volume = 1, tempo = 2): SoundControl | null => {
    if (typeof pitch !== 'number') {
        return null
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


export const playMusic = (soundDeck: AbstractSoundDeck) => (staves: Stave[], tempo = 2, loop = false): MusicControl => {

    const playState = { aborted: false, currentBeat: 0, paused: false };
    const enhancedStaves = staves.map(stave => new EnhancedStave(stave))
    const musicDuration = Math.max(...enhancedStaves.map(s => s.duration))

    const quarterBeatDuration = .25 / tempo;
    const eventTarget = new EventTarget()


    const stop = () => {
        playState.aborted = true
        eventTarget.dispatchEvent(new Event('stopped'))
    }

    const pause = () => {
        playState.paused = true
        return playState.currentBeat
    }

    const resume = () => {
        if (!playState.paused) {
            return
        }
        playState.paused = false
        eventTarget.dispatchEvent(new Event('resumed'))
    }

    // TO DO - keep a proper array of callbacks
    const subscribeToBeat = ((callback: BeatCallback) => {
        eventTarget.addEventListener('metronome', (event) => {
            if (!(event instanceof MessageEvent)) {
                return
            }
            const { data } = event
            if (typeof data !== 'number') {
                return
            }
            callback(data)
        })

    })

    const subscribeToFinish = ((callback: VoidCallback) => {
        eventTarget.addEventListener('finished', () => {
            callback()
        })
    })

    const playUntil = new Promise<boolean>((resolve) => {
        const nextQuarterBeat = async (time: number): Promise<void> => {
            if (playState.paused || playState.aborted) {
                return
            }
            if (playState.currentBeat % 1 === 0) {
                eventTarget.dispatchEvent(new MessageEvent<number>('metronome', { data: playState.currentBeat }))
            }
            if (playState.currentBeat >= musicDuration) {
                if (loop) {
                    await wait(quarterBeatDuration)
                    playState.currentBeat = 0
                    return nextQuarterBeat(playState.currentBeat)
                }
                eventTarget.dispatchEvent(new Event('finished'))
                resolve(true)
                return
            }

            enhancedStaves
                .flatMap(stave => [stave.indexedNotes.get(time)]
                    .map(note => note ? playNote(soundDeck, note, stave.instrument, stave.volume, tempo) : null)
                )

            await wait(quarterBeatDuration)
            playState.currentBeat = time + .25
            return nextQuarterBeat(playState.currentBeat)
        }

        eventTarget.addEventListener('stopped', () => {
            resolve(false)
        }, { once: true })

        eventTarget.addEventListener('resumed', () => {
            nextQuarterBeat(playState.currentBeat)
        })

        nextQuarterBeat(0)
    })

    return {
        whenEnded: playUntil,
        stop,
        pause,
        resume,
        get musicDuration() { return musicDuration },
        get currentBeat() { return playState.currentBeat },
        get isPaused() { return playState.paused },
        onBeat: subscribeToBeat,
        onFinish: subscribeToFinish
    }
}
