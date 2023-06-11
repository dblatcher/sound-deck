
import { useEffect, useState } from "react"
import { useSoundDeck } from "./SoundDeckProvider"
import { SoundControl } from "sound-deck";

interface Props {
    src: string;
    attemptAutoEnable?: boolean
}

export const SamplePlayer = ({ src, attemptAutoEnable }: Props) => {
    const soundDeck = useSoundDeck()
    const [isReady, setIsReady] = useState<boolean | undefined>(undefined)
    const [soundPlaying, setSoundPlaying] = useState<SoundControl | null>(null)

    useEffect(() => {
        soundDeck.defineSampleBuffer(src, src).then(wasSuccess => {
            setIsReady(wasSuccess)
        })
    },[soundDeck, src])

    const play = () => {
        const newSound = soundDeck.playSample(src)
        setSoundPlaying(newSound)
        if (newSound) {
            newSound.whenEnded.then(() => {
                setSoundPlaying(null)
            })
        }
    }

    const handlePlayButton = () => {
        if (!isReady || soundPlaying) {
            return
        }
        if (attemptAutoEnable && !soundDeck.isEnabled) {
            return soundDeck.enable().then(() => { play() })
        }
        play()
    }

    const readyMessage = typeof isReady === 'undefined' ? 'loading' : isReady ? 'loaded' : 'error'

    return (
        <div>
            <h3>{attemptAutoEnable && 'auto enabling '}SamplePlayer: {src}</h3>
            <div>
                <span>{readyMessage}</span>
                <span>{soundPlaying && 'playing'}</span>
            </div>
            <div>
                <button onClick={handlePlayButton}>play sample</button>
            </div>
        </div >
    )
}