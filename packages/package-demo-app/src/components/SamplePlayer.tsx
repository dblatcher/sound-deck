
import { useEffect, useState } from "react"
import { useSoundDeck } from "./SoundDeckProvider"
import { SoundControl } from "sound-deck";
import { VolumeSymbol } from "./VolumeSymbol";

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
    }, [soundDeck, src])

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
    const handleStopButton = () => {
        soundPlaying?.stop()
    }

    const readyMessage = typeof isReady === 'undefined' ? 'loading' : isReady ? 'loaded' : 'error'

    return (
        <div>
            <h3>{attemptAutoEnable && 'auto enabling '}SamplePlayer <VolumeSymbol on={!!soundPlaying} /></h3>
            <div><em>{src}</em></div>
            <div>{readyMessage}</div>
            <div>
                <button onClick={handlePlayButton}>play sample</button>
                <button disabled={!soundPlaying} onClick={handleStopButton}>stop sample</button>
            </div>
        </div >
    )
}