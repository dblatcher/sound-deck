
import { useState } from "react"
import { Instrument, PitchedNote, playStave, presetNoises, presetTones, StaveNote } from "sound-deck"
import { useSoundDeck } from "./SoundDeckProvider"
import { VolumeSymbol } from "./VolumeSymbol"


const BELL: Instrument = {
    soundType: 'tone',
    type: 'triangle',
    playPattern: [
        { time: 0, vol: .1 },
        { time: .2, vol: 1 },
        { time: .25, vol: 1 },
        { time: 1, vol: 0.01 },
    ]
}

const BOING: Instrument = {
    soundType: 'tone',
    ...presetTones.SPRINGY_BOUNCE
}

const SNARE: Instrument = {
    soundType: 'noise',
    ...presetNoises.TAP,
}




const melody: StaveNote[] = [
    { pitch: new PitchedNote('C', 4).pitch, beats: 1 },
    { pitch: new PitchedNote('G', 4).pitch, beats: .5 },
    { pitch: new PitchedNote('E', 4).pitch, beats: .5 },

    { pitch: new PitchedNote('C', 4).pitch, beats: .5 },
    { pitch: new PitchedNote('G', 4).pitch, beats: 1 },
    { pitch: new PitchedNote('C', 4).pitch, beats: .5 },

    { pitch: new PitchedNote('C', 4).pitch, beats: 1 },
    { pitch: new PitchedNote('G', 4).pitch, beats: .5 },
    { pitch: new PitchedNote('E', 4).pitch, beats: .5 },

    { pitch: new PitchedNote('C', 4).pitch, beats: .5 },
    { pitch: new PitchedNote('G', 4).pitch, beats: 1 },
    { pitch: new PitchedNote('C', 4).pitch, beats: .5 },
]

const beat: StaveNote[] = [
    { pitch: new PitchedNote('C', 6).pitch, beats: 1 },
    { beats: 1 },
    { pitch: new PitchedNote('C', 6).pitch, beats: .5 },
    { pitch: new PitchedNote('C', 7).pitch, beats: .5 },
    { beats: 1 },
    { pitch: new PitchedNote('C', 6).pitch, beats: 1 },
    { beats: 1 },
    { pitch: new PitchedNote('C', 6).pitch, beats: .5 },
    { pitch: new PitchedNote('C', 6).pitch, beats: .5 },
    { beats: 1 },
    { pitch: new PitchedNote('C', 6).pitch, beats: 1 },
    { beats: 1 },
    { pitch: new PitchedNote('C', 6).pitch, beats: .5 },
    { pitch: new PitchedNote('C', 6).pitch, beats: .5 },
    { beats: 1 },
]

const TEMPO = 3;



export const MusicPlayer = () => {
    const soundDeck = useSoundDeck()
    const [isPlaying, setIsPlaying] = useState(false)

    const play = (instrument: Instrument) => {
        setIsPlaying(true)
        Promise.all([
            playStave(soundDeck)(instrument, melody, TEMPO),
            playStave(soundDeck)(SNARE, beat, TEMPO, .5),
        ]).then((success) => {
            console.log({ success })
            setIsPlaying(false)
        })
    }

    return (
        <div>
            <h3>Music player <VolumeSymbol on={isPlaying} /> </h3>
            <button onClick={() => play(BELL)}>play bell</button>
            <button onClick={() => play(BOING)}>play BOING</button>
        </div >
    )
}