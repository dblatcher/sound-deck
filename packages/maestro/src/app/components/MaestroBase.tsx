import { css } from "@emotion/react";
import { useState } from "react";
import { EnhancedStave, Instrument, MusicControl, parseStaveNotes, playMusic } from "sound-deck";
import { useSoundDeck } from "../context/SoundDeckProvider";
import { BASE_CLEF, Clef, COMMON_TIME, TREBLE_CLEF } from "../lib/notation-utils";
import { Piece, pieces } from "../lib/songs";
import { PageTemplate } from "./PageTemplate";
import { PieceDropDown } from "./PieceDropDown";
import { PlayControls } from "./PlayControls";
import { StaveDisplay } from "./StaveDisplay";
import { StaveEditor } from "./StaveEditor";
import { TimeSignatureControls } from "./TimeSignatureControls";


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
    const [timeSignature, setTimeSignature] = useState(COMMON_TIME)
    const [musicControl, setMusicControl] = useState<MusicControl>();
    const [beatNumber, setBeatNumber] = useState<number>();
    const [barsPerLine, setBarsPerLine] = useState(4);
    const [tempo, setTempo] = useState(5);
    const [duration, setDuration] = useState<number>();

    const handleBeat = (beat: number) => {
        setBeatNumber(beat)
    }

    const play = () => {
        soundDeck.enable().then((soundDeck) => {
            const staves = [
                new EnhancedStave(BELL, parseStaveNotes(firstStaveText)),
                new EnhancedStave(BELL, parseStaveNotes(secondStaveText)),
            ];
            setDuration(Math.max(...staves.map(s => s.duration)))

            const control = playMusic(soundDeck)(staves, tempo)
            setMusicControl(control);
            control.onQuarterBeat(handleBeat)
            control.whenEnded.then(() => {
                setBeatNumber(undefined)
                setMusicControl(undefined)
            })
        })
    }

    const setPiece = (piece: Piece) => {
        const { timeSignature = COMMON_TIME } = piece;
        const [firstStave, secondStave] = piece.staves;
        setFirstStaveText(firstStave.text);
        setTimeSignature({ ...timeSignature })
        setSecondStaveText(secondStave?.text ?? '')
        setSecondClef(secondStave?.clef ?? BASE_CLEF)
        setFirstClef(firstStave.clef)
    }

    return <PageTemplate>
        <section css={styles.section}>
            <PieceDropDown setPiece={setPiece} />
            <PlayControls play={play} musicControl={musicControl} beatNumber={beatNumber} duration={duration} />
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
            <label>
                <span>tempo</span>
                <input type="number"
                    value={tempo}
                    min={2} max={8} onChange={({ currentTarget: { valueAsNumber } }) => setTempo(valueAsNumber)} />
            </label>
            <TimeSignatureControls timeSignature={timeSignature} setTimeSignature={setTimeSignature} />
        </section>

        <div css={styles.sideScroll}>
            <StaveDisplay
                textAndClefList={[
                    { clef: firstClef, staveText: firstStaveText },
                    { clef: secondClef, staveText: secondStaveText },
                ]}
                barsPerLine={barsPerLine}
                beatNumber={beatNumber}
                timeSignature={timeSignature}
            />
        </div>
    </PageTemplate>

}
