
import { useState } from "react"
import { NoiseConfig, presetNoises, presetTones, SoundControl, ToneConfig } from "sound-deck"
import { useSoundDeck } from "./SoundDeckProvider"
import { VolumeSymbol } from "./VolumeSymbol"

export const PresetPlayer = () => {
    const soundDeck = useSoundDeck()
    const [sound, setSound] = useState<SoundControl | null>(null)

    const playNoise = (config: NoiseConfig) => {
        if (sound) {
            return
        }
        const newNoise = soundDeck.playNoise(config)
        setSound(newNoise)
        if (newNoise) {
            newNoise.whenEnded.then(() => {
                setSound(null)
            })
        }
    }
    const playTone = (config: ToneConfig) => {
        if (sound) {
            return
        }
        const newNoise = soundDeck.playTone(config)
        setSound(newNoise)
        if (newNoise) {
            newNoise.whenEnded.then(() => {
                setSound(null)
            })
        }
    }

    return (
        <div>
            <h3>Presets <VolumeSymbol on={!!sound} /> </h3>


            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button onClick={() => playNoise(presetNoises.TAP)} disabled={!!sound}>TAP</button>
                    <button onClick={() => playNoise(presetNoises.SNAP)} disabled={!!sound}>SNAP</button>
                    <button onClick={() => playNoise(presetNoises.HISS)} disabled={!!sound}>HISS</button>
                    <button onClick={() => playNoise(presetNoises.WHOOSH)} disabled={!!sound}>WHOOSH</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button onClick={() => playTone(presetTones.NEGATIVE_BEEP)} disabled={!!sound}>NEGATIVE_BEEP</button>
                    <button onClick={() => playTone(presetTones.NEUTRAL_BELL)} disabled={!!sound}>NEUTRAL_BELL</button>
                    <button onClick={() => playTone(presetTones.SPRINGY_BOUNCE)} disabled={!!sound}>SPRINGY_BOUNCE</button>
                    <button onClick={() => playTone(presetTones.SLOW_PULSE)} disabled={!!sound}>SLOW_PULSE</button>
                </div>
            </div>
        </div >
    )
}