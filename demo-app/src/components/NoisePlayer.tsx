
import { useState } from "react"
import { PlayPattern, SoundControl } from "sound-deck"
import { DurationControl } from "./DurationControl"
import { FrequencyRange } from "./FrequencyRange"
import { useSoundDeck } from "./SoundDeckProvider"
import { PlayPatternControl } from "./PlayPatternControl"
import { VolumeSymbol } from "./VolumeSymbol"

export const NoisePlayer = () => {
    const soundDeck = useSoundDeck()
    const [noise, setNoise] = useState<SoundControl | null>(null)
    const [frequency, setFrequency] = useState(500)
    const [endFrequency, setEndFrequency] = useState(500)
    const [duration, setDuration] = useState(2)
    const [playPattern, setPlayPattern] = useState<PlayPattern>([])

    const playNoise = () => {
        if (noise) {
            return
        }
        const newNoise = soundDeck.playNoise({ frequency, duration, endFrequency, playPattern })
        setNoise(newNoise)
        if (newNoise) {
            newNoise.whenEnded.then(() => {
                setNoise(null)
            })
        }
    }

    const copyConfg = () => {
        const json = JSON.stringify({ frequency, duration, endFrequency, playPattern })
        navigator.clipboard.writeText(json)
    }

    return (
        <div>
            <h3>NoisePlayer <VolumeSymbol on={!!noise}/></h3>
            <DurationControl value={duration} change={setDuration} />
            <FrequencyRange label="start frequency" value={frequency} change={setFrequency} />
            <FrequencyRange label="end frequency" value={endFrequency} change={setEndFrequency} />
            <PlayPatternControl pattern={playPattern} setPattern={setPlayPattern} />
            <div>
                <button onClick={copyConfg}>copy</button>
                <button onClick={playNoise} disabled={!!noise}>play noise</button>
            </div>
        </div >
    )
}