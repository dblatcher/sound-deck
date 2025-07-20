import { css } from "@emotion/react";
import { Fragment, Reducer, useReducer, useState } from "react";
import { EnhancedStave, MusicControl, parseStaveNotes, playMusic } from "sound-deck";
import { useSoundDeck } from "../context/SoundDeckProvider";
import { COMMON_TIME, TREBLE_CLEF } from "../lib/notation-utils";
import { Piece, pieces, PieceStave, StavesUpdate } from "../lib/songs";
import { PageTemplate } from "./PageTemplate";
import { PieceDropDown } from "./PieceDropDown";
import { PlayControls } from "./PlayControls";
import { SheetMusic } from "./SheetMusic";
import { StaveEditor } from "./StaveEditor";
import { TimeSignatureControls } from "./TimeSignatureControls";
import { instruments } from "../lib/instruments";


const styles = {
    section: css({
        marginBottom: 10,
        display: 'flex',
        gap: 10,
    }),
    sideScroll: css({
        maxWidth: '100%',
        overflowX: 'auto',
    }),
    textArea: css({
        display: 'block',
        width: 600,
        height: 100,
    }),
}

const [firstPiece] = pieces;

const makeNewStave = (): PieceStave => ({ staveText: '', clef: structuredClone(TREBLE_CLEF) });

const stavesReducer: Reducer<PieceStave[], StavesUpdate> = (current, action) => {
    const newStaves = structuredClone(current);
    switch (action.type) {
        case 'set': {
            newStaves[action.index] = action.value
            return newStaves
        }
        case "set-all": {
            return action.value
        }
        case "delete": {
            newStaves.splice(action.index, 1)
            return newStaves
        }
        case "insert-new": {
            if (typeof action.index === 'number') {
                return [...newStaves.slice(0, action.index), makeNewStave(), ...newStaves.slice(action.index)]
            } else {
                newStaves.push(makeNewStave())
            }
            return newStaves
        }
    }
}


export const MaestroBase = () => {
    const soundDeck = useSoundDeck()

    const [staves, dispatchStavesUpdate] = useReducer(stavesReducer, [...structuredClone(firstPiece.staves)])
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
            const enhancedStaves = staves.map(({ staveText, instrument }) => new EnhancedStave(instrument ? instruments[instrument] : instruments.BELL, parseStaveNotes(staveText)));
            setDuration(Math.max(...enhancedStaves.map(s => s.duration)))
            const control = playMusic(soundDeck)(enhancedStaves, tempo)
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
        setTimeSignature({ ...timeSignature })
        dispatchStavesUpdate({ type: 'set-all', value: piece.staves })
    }

    return <PageTemplate>
        <section css={styles.section}>
            <PieceDropDown setPiece={setPiece} />
            <TimeSignatureControls timeSignature={timeSignature} setTimeSignature={setTimeSignature} />
            <PlayControls play={play} musicControl={musicControl} beatNumber={beatNumber} duration={duration} />
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
                    min={2} max={12}
                    onChange={({ currentTarget: { valueAsNumber } }) => setTempo(valueAsNumber)} />
            </label>
            <span>{15 * (tempo)} beats/min </span>
        </section>
        <section css={[styles.section, { flexDirection: 'column', alignItems: 'flex-start' }]}>
            {staves.map((stave, index) =>
                <Fragment key={index}>
                    <button onClick={() => dispatchStavesUpdate({ type: 'insert-new', index })}>add new stave</button>
                    <StaveEditor
                        index={index}
                        dispatchStavesUpdate={dispatchStavesUpdate}
                        stave={stave}
                    />
                </Fragment>
            )}
            <button onClick={() => dispatchStavesUpdate({ type: 'insert-new' })}>add new stave</button>
        </section>

        <div css={styles.sideScroll}>
            <SheetMusic
                tempo={tempo}
                staves={staves}
                barsPerLine={barsPerLine}
                beatNumber={beatNumber}
                timeSignature={timeSignature}
            />
        </div>
    </PageTemplate>

}
