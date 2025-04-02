import { AbstractSoundDeck } from "./AbstractSoundDeck"
import { ToneConfig, NoiseConfig } from "./input-types"
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

