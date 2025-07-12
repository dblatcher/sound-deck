import { css } from "@emotion/react";
import { ChangeEventHandler, useState } from "react";
import { EnhancedStave, Instrument, MusicControl, parseStaveNotes, playMusic } from "sound-deck";
import { useSoundDeck } from "../context/SoundDeckProvider";
import { Clef, clefs, TREBLE_CLEF } from "../lib/notation-utils";
import { pieces } from "../lib/songs";
import { StaveDisplay } from "./StaveDisplay";


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
    const [staveText, setStaveText] = useState(pieces[0]?.staveText ?? '');
    const [clef, setClef] = useState<Clef>(TREBLE_CLEF);
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
        soundDeck.enable().then(() => {
            const control = playMusic(soundDeck)([
                new EnhancedStave(BELL, parseStaveNotes(staveText))
            ], 5)
            setMusicControl(control);
            control.onQuarterBeat(handleBeat)
            control.whenEnded.then(() => {
                setBeatNumber(undefined)
                setMusicControl(undefined)
            })
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
            <div css={{ marginBottom: 10 }}>
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
            <div css={{ marginBottom: 10 }}>
                <label>
                    <span>beats per bar</span>
                    <input type="number"
                        value={timeSignature}
                        min={2} max={8} onChange={handleTimeSignatureChange} />
                </label>
                <label>
                    <span>clef</span>
                    <select onChange={({ target: { value: indexString } }) => {
                        const index = Number(indexString)
                        setClef(clefs[index] ?? TREBLE_CLEF)
                    }}>
                        {clefs.map((clef, index) => <option key={index} value={index} >{clef.name}</option>)}
                    </select>
                </label>

                <label>
                    <span>song</span>
                    <select onChange={({ target: { value: indexString } }) => {
                        const index = Number(indexString)
                        const piece = pieces[index];
                        setStaveText(piece?.staveText ?? '');
                        setTimeSignature(piece?.timeSignature ?? 4);
                        setClef(piece.clef ?? clef)
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
                    clef={clef}
                    barsPerLine={8}
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
