import { EnhancedStave, Instrument, MusicControl, parseStaveNotes, playMusic } from "sound-deck"
import { useSoundDeck } from "../context/SoundDeckProvider"
import { useState } from "react"
import { css } from "@emotion/react"
import { StaveDisplay } from "./StaveDisplay";


const songs = {
    odeToJoy: `
E4...E...F...G...|G...F...E...D...|C...C...D...E...|E...D...D.......|
 E...E...F...G...|G...F...E...D...|C...C...D...E...|D...C...C.......|
`,

    restTest: `
-
-.
-..
-...
-.....
-.......
-...........
-...............
-.......................
`,
    chromaticScale: `
CC#DD#EFF#GG#AA#B
C.C#.D.D#.E.F.F#.G.G#.A.A#.B.`,
};



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
    const [staveText, setStaveText] = useState(songs.odeToJoy);
    const [musicControl, setMusicControl] = useState<MusicControl>();
    const [beatNumber, setBeatNumber] = useState<number>();

    const handleBeat = (beat: number) => {
        setBeatNumber(beat)
    }

    const play = () => {
        const control = playMusic(soundDeck)([
            new EnhancedStave(BELL, parseStaveNotes(staveText))
        ], 5)
        setMusicControl(control);
        control.onQuarterBeat(handleBeat)
        control.whenEnded.then(() => {
            setBeatNumber(undefined)
            setMusicControl(undefined)
        })
    }

    const stop = () => {
        if (!musicControl) {
            return
        }
        musicControl.stop()
    }

    return <div>
        <header>
            <h1>maestro</h1>
        </header>
        <main>
            <div>
                <textarea
                    onChange={({ target: { value } }) => {
                        setStaveText(value)
                    }}
                    css={css({
                        display: 'block',
                        width: 600,
                        height: 100,
                    })}
                    value={staveText}
                />
            </div>
            <StaveDisplay staveText={staveText} beatNumber={beatNumber} />
            <div>Beat: {beatNumber}</div>
            <button disabled={!!musicControl} onClick={play}>play</button>
            <button disabled={!musicControl} onClick={stop}>stop</button>
        </main>
    </div>

}
