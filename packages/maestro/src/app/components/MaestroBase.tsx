import { css } from "@emotion/react";
import { ChangeEventHandler, useState } from "react";
import { EnhancedStave, Instrument, MusicControl, parseStaveNotes, playMusic } from "sound-deck";
import { useSoundDeck } from "../context/SoundDeckProvider";
import { BASE_CLEF, Clef, COMMON_TIME, TREBLE_CLEF } from "../lib/notation-utils";
import { pieces } from "../lib/songs";
import { StaveDisplay } from "./StaveDisplay";
import { StaveEditor } from "./StaveEditor";


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

const [firstPiece] = pieces;


export const MaestroBase = () => {
    const soundDeck = useSoundDeck()
    const [firstStaveText, setFirstStaveText] = useState(firstPiece.staves[0].text ?? '');
    const [firstClef, setFirstClef] = useState<Clef>(firstPiece.staves[0].clef ?? TREBLE_CLEF);
    const [secondStaveText, setSecondStaveText] = useState(firstPiece.staves[1]?.text ?? '');
    const [secondClef, setSecondClef] = useState<Clef>(firstPiece.staves[1]?.clef ?? TREBLE_CLEF);
    const [timeSignatureBeats, setTimeSignatureBeats] = useState(4);
    const [timeSignatureBeatValue, setTimeSignatureBeatValue] = useState(4);
    const [musicControl, setMusicControl] = useState<MusicControl>();
    const [beatNumber, setBeatNumber] = useState<number>();
    const [barsPerLine, setBarsPerLine] = useState<number>(6);
    const [tempo, setTempo] = useState<number>(5);

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
                new EnhancedStave(BELL, parseStaveNotes(firstStaveText)),
                new EnhancedStave(BELL, parseStaveNotes(secondStaveText)),
            ], tempo)
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
                        const { timeSignature = COMMON_TIME } = piece;
                        const [firstStave, secondStave] = piece.staves;
                        setFirstStaveText(firstStave.text);
                        setTimeSignatureBeats(timeSignature.beats);

                        setSecondStaveText(secondStave?.text ?? '')
                        setSecondClef(secondStave?.clef ?? BASE_CLEF)

                        setTimeSignatureBeatValue(timeSignatureBeatValue)
                        setFirstClef(firstStave.clef)
                    }}>
                        {pieces.map((piece, index) => <option key={index} value={index} >{piece.title}</option>)}
                    </select>
                </label>

                <button disabled={!!musicControl} onClick={play}>play</button>
                <button disabled={!musicControl} onClick={stop}>stop</button>
                <div>Beat: {beatNumber}</div>
            </section>
            <section css={styles.section}>
                <StaveEditor
                    setClef={setFirstClef}
                    setStaveText={setFirstStaveText}
                    staveText={firstStaveText}
                    clef={firstClef}
                />
                <StaveEditor
                    setClef={setSecondClef}
                    setStaveText={setSecondStaveText}
                    staveText={secondStaveText}
                    clef={secondClef}
                />
            </section>
            <section css={styles.section}>
                <label>
                    <span>bars per line</span>
                    <input type="number"
                        value={barsPerLine}
                        min={2} max={16} onChange={({ currentTarget: { valueAsNumber } }) => setBarsPerLine(valueAsNumber)} />
                </label>
            </section>
            <section css={styles.section}>
                <label>
                    <span>tempo</span>
                    <input type="number"
                        value={tempo}
                        min={2} max={8} onChange={({ currentTarget: { valueAsNumber } }) => setTempo(valueAsNumber)} />
                </label>
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
                    textAndClefList={[
                        { clef: firstClef, staveText: firstStaveText },
                        { clef: secondClef, staveText: secondStaveText },
                    ]}
                    barsPerLine={barsPerLine}
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
