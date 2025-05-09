import { NoiseConfig, ToneConfig } from "./input-types";

class PresetTones {
    get NEUTRAL_BELL(): ToneConfig {
        return {
            "frequency": 640,
            "endFrequency": 640,
            "duration": 0.5,
            "type": "square",
            "playPattern": [{ "time": 0, "vol": 0.3 }, { "time": 0.1, "vol": 1 }, { "time": 0.3, "vol": 1 }, { "time": 1, "vol": 0.1 }]
        }
    }
    get SPRINGY_BOUNCE(): ToneConfig {
        return {
            "frequency": 600, "endFrequency": 1040, "duration": 0.5, "type": "sawtooth", "playPattern": [{ "time": 0, "vol": 0.3 }, { "time": 0.1, "vol": 1 }, { "time": 0.3, "vol": 1 }, { "time": 1, "vol": 0.1 }]
        }
    }
    get NEGATIVE_BEEP(): ToneConfig {
        return {
            "frequency": 520, "endFrequency": 380, "duration": 0.7, "type": "triangle", "playPattern": [{ "time": 0, "vol": 0.3 }, { "time": 0.3, "vol": 1 }, { "time": 0.4, "vol": 1 }, { "time": 1, "vol": 0.1 }]
        }
    }
    get SLOW_PULSE(): ToneConfig {
        return { "frequency": 440, "endFrequency": 440, "duration": 2, "type": "sine", "playPattern": [{ "time": 0, "vol": 0.1 }, { "time": 0.25, "vol": 1 }, { "time": 0.5, "vol": 0.1 }, { "time": 0.75, "vol": 1 }, { "time": 1, "vol": 0.1 }] };
    }
}

export const presetTones = new PresetTones()

class PresetNoises {
    get SNAP(): NoiseConfig {
        return {
            "frequency": 900,
            "duration": 0.3,
            "endFrequency": 1280,
            "playPattern": [{ "time": 0, "vol": 0.5 }, { "time": 0.05, "vol": 1 }, { "time": 1, "vol": 0.1 }]
        }
    }
    get TAP(): NoiseConfig {
        return {
            "frequency": 1540, "duration": 0.1, "endFrequency": 1980, "playPattern": [{ "time": 0, "vol": 0.5 }, { "time": 0.05, "vol": 1 }, { "time": 1, "vol": 0.01 }]
        }
    }
    get HISS(): NoiseConfig {
        return {
            "frequency": 1200, "duration": 1, "endFrequency": 1200, "playPattern": [{ "time": 0, "vol": 1 }, { "time": 0.6, "vol": 1 }, { "time": 1, "vol": 0.01 }]
        }
    }
    get WHOOSH(): NoiseConfig {
        return { "frequency": 320, "duration": 0.7, "endFrequency": 740, "playPattern": [{ "time": 0, "vol": 0.1 }, { "time": 0.1, "vol": 1 }, { "time": 0.125, "vol": 0.9 }, { "time": 0.15, "vol": 1 }, { "time": 0.175, "vol": 0.9 }, { "time": 0.2, "vol": 1 }, { "time": 1, "vol": 0.1 }] }
    }
}

export const presetNoises = new PresetNoises()

