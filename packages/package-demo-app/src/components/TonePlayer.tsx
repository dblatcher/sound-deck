
import { useState } from "react"
import { SoundControl, makeOrganWave } from "sound-deck"
import { DurationControl } from "./DurationControl"
import { FrequencyRange } from "./FrequencyRange"
import { ToneTypeOptions } from "./ToneTypeOptions"
import { useSoundDeck } from "./SoundDeckProvider"

export const TonePlayer = () => {
    const soundDeck = useSoundDeck()
    const [radioNamePrefix] = useState(Math.floor(Math.random() * (10 ** 8)))
    const [tone, setTone] = useState<SoundControl | null>(null)
    const [frequency, setFrequency] = useState(500)
    const [endFrequency, setEndFrequency] = useState(600)
    const [duration, setDuration] = useState(2)
    const [toneType, setToneType] = useState<OscillatorType>('sawtooth')

    const playTone = () => {
        if (tone) {
            return
        }
        const customWaveform = (toneType === 'custom' && soundDeck.audioCtx) ? makeOrganWave (soundDeck.audioCtx) : undefined
        const newTone = soundDeck.playTone({ frequency, endFrequency, duration, type: toneType, periodicWave: customWaveform })
        setTone(newTone)
        if (newTone) {
            newTone.whenEnded.then(() => {
                setTone(null)
            })
        }
    }

    return (
        <div>
            <h3>TonePlayer</h3>
            <DurationControl value={duration} change={setDuration} />
            <FrequencyRange label="start frequency" value={frequency} change={setFrequency} />
            <FrequencyRange label="end frequency" value={endFrequency} change={setEndFrequency} />
            <ToneTypeOptions value={toneType} change={setToneType} radioName={`${radioNamePrefix}-tone-type`} />

            <div>
                <button onClick={playTone} disabled={!!tone}>play tone</button>
                {tone && (
                    <span>tone is playing</span>
                )}
            </div>
        </div >
    )
}