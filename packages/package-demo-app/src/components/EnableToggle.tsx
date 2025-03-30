
import { ChangeEventHandler, useState } from "react"
import { useSoundDeck } from "./SoundDeckProvider"
import { SoundDeck } from "sound-deck"


export const EnableToggle = () => {
    const soundDeck = useSoundDeck()
    const [enableState, setEnabledState] = useState(soundDeck.isEnabled)

    const listener: EventListener = (ev: Event) => {
        setEnabledState(soundDeck.isEnabled)
    }
    if (soundDeck instanceof SoundDeck) {
        soundDeck.audioCtx?.addEventListener('statechange', listener)
    }

    const handleChange:ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.currentTarget.checked) {
            soundDeck.enable().then(() => setEnabledState(true))
        } else {
            soundDeck.disable().then(() => setEnabledState(false))
        }
    }

    return (
        <div>
            <h3>Enabled?</h3>
            <div>
                <input type="checkbox" 
                    checked={enableState} 
                    onChange={handleChange} />
            </div>
        </div >
    )
}