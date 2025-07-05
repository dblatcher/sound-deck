import { EnhancedStave, Instrument, parseStaveNotes, playMusic } from "sound-deck"
import { useSoundDeck } from "../context/SoundDeckProvider"


const odeToJoy = parseStaveNotes(`
E4...E...F...G...|G...F...E...D...|C...C...D...E...|E...D...D.......|
 E...E...F...G...|G...F...E...D...|C...C...D...E...|D...C...C.......|
`)

export const BELL: Instrument = {
    soundType: 'tone',
    type: 'triangle',
    playPattern: [
        { time: 0, vol: .1 },
        { time: .2, vol: 1 },
        { time: .25, vol: 1 },
        { time: 1, vol: 0.01 },
    ]
}

export const MaestroBase = () => {

    const soundDeck = useSoundDeck()

    const play = () => {
        playMusic(soundDeck)([
           new EnhancedStave(BELL, odeToJoy)
        ],5)
    }

    return <div>
        <main>

            <h1>maestro</h1>

            <button onClick={play}>play</button>

        </main>
    </div>

}
