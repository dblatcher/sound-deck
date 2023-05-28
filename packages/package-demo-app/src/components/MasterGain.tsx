
import { useState, useContext } from "react"
import { SoundDeckContext } from "../SoundDeckContext"

export const MasterGain = () => {
    const soundDeck = useContext(SoundDeckContext)
    const [volume, setVolume] = useState(soundDeck.masterVolume)
    const [isMuted, setIsMuted] = useState(soundDeck.isMuted)

    const changeGain = (newValue: number) => {
        soundDeck.masterVolume = Math.max(0, Math.min(newValue, 1))
        setVolume(soundDeck.masterVolumnIfNotMuted)
        setIsMuted(soundDeck.isMuted)
    }

    const changeMuted = (value: boolean) => {
        console.log(value)
        if (value) {
            soundDeck.mute()
        } else {
            soundDeck.unmute()
        }
        setVolume(soundDeck.masterVolumnIfNotMuted)
        setIsMuted(soundDeck.isMuted)
    }

    return (
        <div>
            <h3>master gain</h3>
            <div>
                <span>{volume.toFixed(2)}</span>
                <input type="range" min={0} max={1} step={.05} value={volume} onChange={(e) => {
                    const value = e.target.valueAsNumber
                    changeGain(value)
                }} />
            </div>
            <div>
                <label>mute</label>
                <input type="checkbox" checked={isMuted} onChange={(e) => {
                    changeMuted(e.target.checked)
                }} />
            </div>
        </div >
    )
}