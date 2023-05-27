
import { useState } from "react"
import { SoundControl, SoundDeck } from "sound-deck"
import { FrequencyRange } from "./FrequencyRange"
import { ToneTypeOptions } from "./ToneTypeOptions"

export const TonePlayer = () => {
    const [soundDeck] = useState(new SoundDeck())
    const [tone, setTone] = useState<SoundControl | null>(null)
    const [frequency, setFrequency] = useState(500)
    const [endFrequency, setEndFrequency] = useState(600)
    const [duration, setDuration] = useState(2)
    const [toneType, setToneType] = useState<OscillatorType>('sawtooth')

    const playTone = () => {
        if (tone) {
            return
        }
        const newTone = soundDeck.playTone({ frequency, endFrequency, duration, type: toneType })
        setTone(newTone)
        if (newTone) {
            newTone.whenEnded.then(() => {
                setTone(null)
            })
        }
    }

    return (
        <div>
            <h2>TonePlayer</h2>
            <div>
                <label>duration</label>
                <input type="number" value={duration}
                    step={.1}
                    onChange={e => {
                        setDuration(Number(e.target.value))
                    }} />
            </div>
            <FrequencyRange label="start frequency" value={frequency} change={setFrequency} />
            <FrequencyRange label="end frequency" value={endFrequency} change={setEndFrequency} />
            <ToneTypeOptions value={toneType} change={setToneType} radioName="tone-type" />

            <div>
                <button onClick={playTone} disabled={!!tone}>play tone</button>
                {tone && (
                    <span>tone is playing</span>
                )}
            </div>
        </div >
    )
}