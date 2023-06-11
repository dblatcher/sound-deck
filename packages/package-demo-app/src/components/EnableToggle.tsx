
import { ChangeEventHandler, useState } from "react"
import { useSoundDeck } from "./SoundDeckProvider"


export const EnableToggle = () => {
    const soundDeck = useSoundDeck()
    const [enableState, setEnabledState] = useState(soundDeck.isEnabled)

    const listener: EventListener = (ev: Event) => {
        setEnabledState(soundDeck.isEnabled)
    }
    soundDeck.audioCtx?.addEventListener('statechange', listener)

    const handleChange:ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.currentTarget.checked) {
            soundDeck.enable()
        } else {
            soundDeck.disable()
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