
import { useEffect, useState } from "react"
import { useSoundDeck } from "./SoundDeckProvider"
import { SoundControl } from "sound-deck";

interface Props {
    src: string;
}

export const SamplePlayer = ({ src }: Props) => {
    const soundDeck = useSoundDeck()
    const [isReady, setIsReady] = useState<boolean | undefined>(undefined)
    const [soundPlaying, setSoundPlaying] = useState<SoundControl | null>(null)

    useEffect(() => {
        soundDeck.defineSampleBuffer(src, src).then(wasSuccess => {
            setIsReady(wasSuccess)
        })
    })


    const playSample = () => {
        if (!isReady || soundPlaying) {
            return
        }

        soundDeck.enable().then(() => {
            const newSound = soundDeck.playSample(src)
            setSoundPlaying(newSound)

            if (newSound) {
                newSound.whenEnded.then(() => {
                    setSoundPlaying(null)
                })
            }
        })

    }

    const readyMessage = typeof isReady === 'undefined' ? 'loading' : isReady ? 'loaded' : 'error'

    return (
        <div>
            <h3>SamplePlayer: {src}</h3>
            <div>
                <span>{readyMessage}</span>
                <span>{soundPlaying && 'playing'}</span>
            </div>
            <div>
                <button onClick={playSample}>play sample</button>
            </div>
        </div >
    )
}