
import { useState } from "react"
import { PlayPattern, SoundControl } from "sound-deck"
import { CustomWaveOptions } from "./CustomWaveOptions"
import { DurationControl } from "./DurationControl"
import { FrequencyRange } from "./FrequencyRange"
import { PlayPatternControl } from "./PlayPatternControl"
import { useSoundDeck } from "./SoundDeckProvider"
import { ToneTypeOptions } from "./ToneTypeOptions"
import { VolumeSymbol } from "./VolumeSymbol"

export const TonePlayer = () => {
    const soundDeck = useSoundDeck()
    const [radioNamePrefix] = useState(Math.floor(Math.random() * (10 ** 8)))
    const [tone, setTone] = useState<SoundControl | null>(null)
    const [frequency, setFrequency] = useState(500)
    const [endFrequency, setEndFrequency] = useState(500)
    const [duration, setDuration] = useState(1)
    const [toneType, setToneType] = useState<OscillatorType>('sawtooth')
    const [customWave, setCustomWave] = useState<string | undefined>(undefined)
    const [playPattern, setPlayPattern] = useState<PlayPattern>([])

    const playTone = () => {
        if (tone) {
            return
        }

        const newTone = soundDeck.playTone(
            {
                frequency,
                endFrequency,
                duration,
                type: toneType,
                customWaveName: customWave,
                playPattern,
            },
        )
        setTone(newTone)
        if (newTone) {
            newTone.whenEnded.then(() => {
                setTone(null)
            })
        }
    }

    const copyConfg = () => {
        const json = JSON.stringify({
            frequency,
            endFrequency,
            duration,
            type: toneType,
            customWaveName: customWave,
            playPattern,
        })
        navigator.clipboard.writeText(json)
    }

    return (
        <div>
            <h3>TonePlayer <VolumeSymbol on={!!tone} /></h3>
            <DurationControl value={duration} change={setDuration} />
            <FrequencyRange label="start frequency" value={frequency} change={setFrequency} />
            <FrequencyRange label="end frequency" value={endFrequency} change={setEndFrequency} />
            <PlayPatternControl pattern={playPattern} setPattern={setPlayPattern} />
            <div style={{ display: 'flex' }}>
                <ToneTypeOptions value={toneType} change={setToneType} radioName={`${radioNamePrefix}-tone-type`} />
                <CustomWaveOptions value={customWave} change={setCustomWave} radioName={`${radioNamePrefix}-wave-name`} />
            </div>

            <div>
                <button onClick={copyConfg}>copy</button>
                <button onClick={playTone} disabled={!!tone}>play tone</button>
            </div>
        </div >
    )
}