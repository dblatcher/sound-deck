
import { useEffect, useState } from "react"
import { SoundDeck } from "sound-deck"

export const TonePlayer = () => {

    const [soundDeck] = useState(new SoundDeck())

    useEffect(()=> {
        soundDeck.playTone({frequency:500,endFrequency:600, duration:100})
    })

    return (
        <div>
            <h2>TonePlayer</h2>
        </div>
    )
}