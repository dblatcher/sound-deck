import { EnhancedStave, Instrument, MusicControl, parseStaveNotes, playMusic } from "sound-deck"
import { useSoundDeck } from "../context/SoundDeckProvider"
import { ChangeEventHandler, useState } from "react"
import { css } from "@emotion/react"
import { StaveDisplay } from "./StaveDisplay";
import { pieces } from "../lib/songs";


export const BELL: Instrument = {
    soundType: 'tone',
    type: 'sawtooth',
    playPattern: [
        { time: 0, vol: .1 },
        { time: .2, vol: 1 },
        { time: .25, vol: 1 },
        { time: 1, vol: 0.01 },
    ]
}


export const MaestroBase = () => {
    const soundDeck = useSoundDeck()
    const [staveText, setStaveText] = useState(pieces[0]?.staveText ?? '');
    const [timeSignature, setTimeSignature] = useState(4);
    const [musicControl, setMusicControl] = useState<MusicControl>();
    const [beatNumber, setBeatNumber] = useState<number>();

    const handleBeat = (beat: number) => {
        setBeatNumber(beat)
    }

    const handleTimeSignatureChange: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: { valueAsNumber } }) => {
        setTimeSignature(valueAsNumber)
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
            <div>
                <label>
                    <span>beats per bar</span>
                    <input type="number"
                        value={timeSignature}
                        min={2} max={8} onChange={handleTimeSignatureChange} />
                </label>

                <label>
                    <span>song</span>
                    <select onChange={({ target: { value: indexString } }) => {
                        const index = Number(indexString)
                        setStaveText(pieces[index]?.staveText ?? '');
                        setTimeSignature(pieces[index]?.timeSignature ?? 4);
                    }}>
                        {pieces.map((piece, index) => <option key={index} value={index} >{piece.title}</option>)}
                    </select>
                </label>
            </div>
            <div css={{
                maxWidth: '100%',
                display: 'relative',
                overflowX: 'scroll',
            }}>
                <StaveDisplay 
                    staveText={staveText} 
                    beatNumber={beatNumber} 
                    beatsPerBar={timeSignature} />
            </div>
            <div>Beat: {beatNumber}</div>
            <button disabled={!!musicControl} onClick={play}>play</button>
            <button disabled={!musicControl} onClick={stop}>stop</button>
        </main>
    </div>

}
