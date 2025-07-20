import { Instrument, presetTones, presetNoises } from "sound-deck"

const BOING: Instrument = {
    soundType: 'tone',
    ...presetTones.SPRINGY_BOUNCE
}

const SNARE: Instrument = {
    soundType: 'noise',
    ...presetNoises.TAP,
}

const DRONE: Instrument = {
    soundType: 'tone',
    type: 'triangle',
    playPattern: [
        { time: 0, vol: .1 },
        { time: .1, vol: 1 },
        { time: 1, vol: 1 },
    ]
}

const BELL: Instrument = {
    soundType: 'tone',
    type: 'sine',
    playPattern: [
        { time: 0, vol: .1 },
        { time: .2, vol: 1 },
        { time: .25, vol: 1 },
        { time: 1, vol: 0.01 },
    ]
}

export const instruments = {
    SNARE, BELL, BOING, DRONE
}
export type InstrumentName = keyof typeof instruments;
export const instrumentNames = Object.keys(instruments) as InstrumentName[];