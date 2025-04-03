import { AbstractSoundDeck } from "./AbstractSoundDeck"
import { ToneConfig, NoiseConfig } from "./input-types"
import { isNote, isOctive, Note, Octive, PitchedNote } from "./notes"
import { SoundControl } from "./SoundControl"


export type StaveNote = {
    pitch?: number,
    beats: number,
}

export type TonalInstrument = { soundType: 'tone' } & Omit<ToneConfig, 'duration' | 'frequency' | 'endFrequency'>
export type PercussiveInstrument = { soundType: 'noise' } & Omit<NoiseConfig, 'duration' | 'frequency' | 'endFrequency'>
export type Instrument = PercussiveInstrument | TonalInstrument;

class Silence {
    whenEnded: Promise<Silence>
    constructor(duration: number) {
        this.whenEnded = new Promise(resolve => {
            setTimeout(() => {
                resolve(this)}, duration*1000
            )
        })
    }
}


export const playStave = (soundDeck: AbstractSoundDeck) => async (instrument: Instrument, notes: StaveNote[], tempo = 2, volume = 1) => {

    const noteToControl = ({ pitch, beats }: StaveNote): Silence | SoundControl | null => {
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

    return new Promise<boolean>(resolve => {
        const playNext = async (noteIndex = 0) => {

            const control = noteToControl(notes[noteIndex])
            if (!control) {
                resolve(false)
                return
            }

            await control.whenEnded;
            if (noteIndex < notes.length - 1) {
                playNext(noteIndex + 1)
            } else {
                resolve(true)
            }
        }
        playNext()
    })
}


export const parseStaveNotes = (input: string): StaveNote[] => {
    const notesStrings = Array.from(input.matchAll(/[A,B,C,D,E,F,G,-][b,#]?[0-8]?\.*/gm)).map(match => match[0])
    let currentOctive: Octive = 4
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
        }

        return staveNote
    })
    return notes
}
