
export type PlayPatternStep = {
    time: number,
    vol: number
}

export type PlayPattern = PlayPatternStep[] 

export type PlayOptions = {
    volume?: number
    loop?: boolean
    playPattern?: PlayPattern
}

export type NoiseConfig = PlayOptions & {
    duration?: number
    frequency?: number
    endFrequency?: number
}

export type ToneConfig = NoiseConfig & {
    type?: OscillatorType
    periodicWave?: PeriodicWave
    customWaveName?: string
}
