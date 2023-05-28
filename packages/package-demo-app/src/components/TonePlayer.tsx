
import { useContext, useState } from "react"
import { SoundControl } from "sound-deck"
import { FrequencyRange } from "./FrequencyRange"
import { ToneTypeOptions } from "./ToneTypeOptions"
import { DurationControl } from "./DurationControl"
import { SoundDeckContext } from "../SoundDeckContext"

export const TonePlayer = () => {
    const soundDeck = useContext(SoundDeckContext)
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