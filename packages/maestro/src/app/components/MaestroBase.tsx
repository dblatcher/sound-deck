import { css } from "@emotion/react";
import { ChangeEventHandler, useState } from "react";
import { EnhancedStave, Instrument, MusicControl, parseStaveNotes, playMusic } from "sound-deck";
import { useSoundDeck } from "../context/SoundDeckProvider";
import { Clef, clefs, COMMON_TIME, TREBLE_CLEF } from "../lib/notation-utils";
import { pieces } from "../lib/songs";
import { StaveDisplay } from "./StaveDisplay";


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

const styles = {
    section: css({
        marginBottom: 10,
        display: 'flex',
        gap: 10,
    }),
    sideScroll: css({
        maxWidth: '100%',
        display: 'relative',
        overflowX: 'auto',
    }),
    textArea: css({
        display: 'block',
        width: 600,
        height: 100,
    }),
}

export const MaestroBase = () => {
    const soundDeck = useSoundDeck()
    const [staveText, setStaveText] = useState(pieces[0]?.staveText ?? '');
    const [clef, setClef] = useState<Clef>(TREBLE_CLEF);
    const [timeSignatureBeats, setTimeSignatureBeats] = useState(4);
    const [timeSignatureBeatValue, setTimeSignatureBeatValue] = useState(4);
    const [musicControl, setMusicControl] = useState<MusicControl>();
    const [beatNumber, setBeatNumber] = useState<number>();
    const [barsPerLine, setBarsPerLine] = useState<number>();

    const handleBeat = (beat: number) => {
        setBeatNumber(beat)
    }

    const handleTimeSignatureBeatsChange: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: { valueAsNumber } }) => {
        setTimeSignatureBeats(valueAsNumber)
    }
    const handleTimeSignatureBeatValueChange: ChangeEventHandler<HTMLSelectElement> = ({ currentTarget: { value } }) => {
        setTimeSignatureBeatValue(Number(value))
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

            <section css={styles.section}>
                <label>
                    <span>song</span>
                    <select onChange={({ target: { value: indexString } }) => {
                        const index = Number(indexString)
                        const piece = pieces[index];
                        if (!piece) {
                            return
                        }
                        const { timeSignature = COMMON_TIME, staveText } = piece;
                        setStaveText(staveText);
                        setTimeSignatureBeats(timeSignature.beats);
                        setTimeSignatureBeatValue(timeSignatureBeatValue)
                        setClef(piece.clef ?? clef)
                    }}>
                        {pieces.map((piece, index) => <option key={index} value={index} >{piece.title}</option>)}
                    </select>
                </label>

                <button disabled={!!musicControl} onClick={play}>play</button>
                <button disabled={!musicControl} onClick={stop}>stop</button>
                <div>Beat: {beatNumber}</div>
            </section>
            <section css={styles.section}>
                <textarea
                    onChange={({ target: { value } }) => {
                        setStaveText(value)
                    }}
                    css={styles.textArea}
                    value={staveText}
                />
            </section>
            <section css={styles.section}>
                <label>
                    <span>bars per line</span>
                    <input type="number"
                        value={barsPerLine}
                        min={2} max={16} onChange={({ currentTarget: { valueAsNumber } }) => setBarsPerLine(valueAsNumber)} />
                </label>
                <label>
                    <span>clef</span>
                    <select value={clefs.findIndex(i => i === clef)} onChange={({ target: { value: indexString } }) => {
                        const index = Number(indexString)
                        setClef(clefs[index] ?? TREBLE_CLEF)
                    }}>
                        {clefs.map((clef, index) => <option key={index} value={index} >{clef.name}</option>)}
                    </select>
                </label>
            </section>
            <section css={styles.section}>
                <label>
                    <span>beats per bar</span>
                    <input type="number"
                        value={timeSignatureBeats}
                        min={2} max={8} onChange={handleTimeSignatureBeatsChange} />
                </label>
                <label>
                    <span>beat type</span>
                    <select value={timeSignatureBeatValue} onChange={handleTimeSignatureBeatValueChange}>
                        <option value={2}>2</option>
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                    </select>
                </label>
            </section>


            <div css={styles.sideScroll}>
                <StaveDisplay
                    clef={clef}
                    barsPerLine={barsPerLine}
                    staveText={staveText}
                    beatNumber={beatNumber}
                    timeSignature={{
                        beats: timeSignatureBeats,
                        beatValue: timeSignatureBeatValue,
                    }}
                />
            </div>
        </main>
    </div>

}
