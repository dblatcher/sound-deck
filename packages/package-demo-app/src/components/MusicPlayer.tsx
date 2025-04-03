
import { useState } from "react"
import { Instrument, parseStaveNotes, PitchedNote, playStave, presetNoises, presetTones, StaveNote } from "sound-deck"
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



// const melody2 = parseStaveNotes("C... G. E. C. G... C5.. C... G. E. C4. G... C.")

const odeToJoy = parseStaveNotes(`
    E4...E...F...G...|G...F...E...D...|C...C...D...E...|E...D...D.......|
     E...E...F...G...|G...F...E...D...|C...C...D...E...|D...C...C.......|
    `)

const beat = parseStaveNotes("C6.-.F.C.".repeat(18))

console.log({ odeToJoy, beat })

const TEMPO = 3;



export const MusicPlayer = () => {
    const soundDeck = useSoundDeck()
    const [isPlaying, setIsPlaying] = useState(false)

    const play = (instrument: Instrument) => {
        setIsPlaying(true)
        Promise.all([
            playStave(soundDeck)(instrument, odeToJoy, TEMPO),
            playStave(soundDeck)(SNARE, beat, TEMPO, .5),
        ]).then((success) => {
            console.log({ success })
            setIsPlaying(false)
        })
    }

    return (
        <div>
            <h3>Music player <VolumeSymbol on={isPlaying} /> </h3>
            <button disabled={isPlaying} onClick={() => play(BELL)}>play bell</button>
            <button disabled={isPlaying} onClick={() => play(BOING)}>play BOING</button>
        </div >
    )
}