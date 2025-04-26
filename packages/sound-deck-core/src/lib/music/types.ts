import { NoiseConfig, ToneConfig } from "../input-types";
import { PitchedNote } from "../notes";

export type TonalInstrument = { soundType: 'tone' } & Omit<ToneConfig, 'duration' | 'frequency' | 'endFrequency'>
export type PercussiveInstrument = { soundType: 'noise' } & Omit<NoiseConfig, 'duration' | 'frequency' | 'endFrequency'>
export type Instrument = PercussiveInstrument | TonalInstrument;

export type StaveNote = {
    note?: PitchedNote,
    beats: number,
    atBeat: number,
}

export type Stave = {
    instrument: Instrument,
    notes: StaveNote[],
    volume?: number
}
