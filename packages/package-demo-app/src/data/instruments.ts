
import { Instrument, presetNoises, presetTones } from "sound-deck"

export const BELL: Instrument = {
    soundType: 'tone',
    type: 'triangle',
    playPattern: [
        { time: 0, vol: .1 },
        { time: .2, vol: 1 },
        { time: .25, vol: 1 },
        { time: 1, vol: 0.01 },
    ]
}

export const ORGAN: Instrument = {
    soundType: 'tone',
    type: 'triangle',
    customWaveName: 'organ',
    playPattern: [
        { time: 0, vol: .1 },
        { time: .1, vol: 1 },
        { time: .8, vol: 1 },
        { time: 1, vol: 0.01 },
    ]
}

export const BOING: Instrument = {
    soundType: 'tone',
    ...presetTones.SPRINGY_BOUNCE
}

export const SNARE: Instrument = {
    soundType: 'noise',
    ...presetNoises.TAP,
}

