
import { useState } from "react"
import { Note, Octive, PitchedNote, SoundControl } from "sound-deck"
import { ToneTypeOptions } from "./ToneTypeOptions"
import { useSoundDeck } from "./SoundDeckProvider"

interface Props {
    note: Note
    octive: Octive
}

export const NotePlayer = ({note, octive}:Props) => {
    const soundDeck = useSoundDeck()
    const [radioNamePrefix] = useState(Math.floor(Math.random() * (10 ** 8)))
    const [tone, setTone] = useState<SoundControl | null>(null)
    const [toneType, setToneType] = useState<OscillatorType>('sawtooth')

    const pitchedNote = new PitchedNote(note,octive)

    const playTone = () => {
        if (tone) {
            return
        }
        const newTone = soundDeck.playTone({ frequency:pitchedNote.pitch, duration:.5, type: toneType })
        setTone(newTone)
        if (newTone) {
            newTone.whenEnded.then(() => {
                setTone(null)
            })
        }
    }

    return (
        <div>
            <h3>NotePlayer: {pitchedNote.name}</h3>

            <ToneTypeOptions value={toneType} change={setToneType} radioName={`${radioNamePrefix}-tone-type`} />

            <div>
                <button onClick={playTone} disabled={!!tone}>play {pitchedNote.name}</button>
                {tone && (
                    <span>tone is playing</span>
                )}
            </div>
        </div >
    )
}