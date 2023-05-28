
import { useState } from "react"
import { SoundControl } from "sound-deck"
import { DurationControl } from "./DurationControl"
import { FrequencyRange } from "./FrequencyRange"
import { useSoundDeck } from "./SoundDeckProvider"

export const NoisePlayer = () => {
    const soundDeck = useSoundDeck()
    const [noise, setNoise] = useState<SoundControl | null>(null)
    const [frequency, setFrequency] = useState(500)
    const [duration, setDuration] = useState(2)

    const playNoise = () => {
        if (noise) {
            return
        }
        const newNoise = soundDeck.playNoise({ frequency, duration })
        setNoise(newNoise)
        if (newNoise) {
            newNoise.whenEnded.then(() => {
                setNoise(null)
            })
        }
    }

    return (
        <div>
            <h3>NoisePlayer</h3>
            <DurationControl value={duration} change={setDuration} />
            <FrequencyRange label="start frequency" value={frequency} change={setFrequency} />
            <div>
                <button onClick={playNoise} disabled={!!noise}>play noise</button>
                {noise && (
                    <span>noise is playing</span>
                )}
            </div>
        </div >
    )
}