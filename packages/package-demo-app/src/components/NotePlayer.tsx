
import { useState } from "react"
import { Note, Octive, PitchedNote, SoundControl } from "sound-deck"
import { ToneTypeOptions } from "./ToneTypeOptions"
import { useSoundDeck } from "./SoundDeckProvider"

interface Props {
    note: Note
    octive: Octive
}

export const NotePlayer = ({ note, octive }: Props) => {
    const soundDeck = useSoundDeck()
    const [radioNamePrefix] = useState(Math.floor(Math.random() * (10 ** 8)))
    const [toneType, setToneType] = useState<OscillatorType>('sawtooth')
    const [chordTones, setChordTones] = useState<(SoundControl | null)[]>([])
    const pitchedNote = new PitchedNote(note, octive)

    const playChord = (type: 'single' | 'major' | 'minor') => {
        if (chordTones.length !== 0) {
            return
        }

        const chord = []
        switch (type) {
            case "single":
                chord.push(new PitchedNote(note, octive))
                break
            case "major":
                chord.push(...PitchedNote.majorTriad(note, octive))
                break
            case "minor":
                chord.push(...PitchedNote.minorTriad(note, octive))
                break
        }

        const tones = chord.map(note => soundDeck.playTone({ frequency: note.pitch, duration: .5, type: toneType }))
        setChordTones(tones)
        const [firstTone] = tones
        if (firstTone) {
            firstTone.whenEnded.then(() => {
                setChordTones([])
            })
        }
    }

    return (
        <div>
            <h3>NotePlayer: {pitchedNote.name}</h3>
            <ToneTypeOptions value={toneType} change={setToneType} radioName={`${radioNamePrefix}-tone-type`} />
            <div>
                <button onClick={() => playChord('single')} disabled={!!chordTones.length}>play {pitchedNote.name}</button>
                <button onClick={() => playChord('major')} disabled={!!chordTones.length}>play {pitchedNote.name} major</button>
                <button onClick={() => playChord('minor')} disabled={!!chordTones.length}>play {pitchedNote.name} minor</button>
            </div>
            <div>
                {chordTones.length > 0 && (
                    <span>playing</span>
                )}
            </div>
        </div >
    )
}