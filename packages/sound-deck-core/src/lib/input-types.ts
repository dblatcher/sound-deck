
type PlayPatternStep = {
    time: number,
    vol: number
}

export type PlayOptions = {
    volume?: number
    loop?: boolean
    playPattern?: PlayPatternStep[]
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
