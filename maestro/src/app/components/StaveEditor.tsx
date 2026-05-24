import { css } from "@emotion/react";
import type { Dispatch } from "react";
import { clefs, TREBLE_CLEF } from "../lib/notation-utils";
import type { PieceStave, StavesUpdate } from "../lib/songs";
import { controlBorder } from "../lib/styles";
import { instrumentNames, type InstrumentName } from "../lib/instruments";


type Props = {
    index: number;
    stave: PieceStave;
    dispatchStavesUpdate: Dispatch<StavesUpdate>
}

const styles = {
    container: css(controlBorder, {
        display: 'flex',
        gap: 5,
        paddingBottom: 5,

    }),
    stack: css({
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
    }),
    textArea: css({
        display: 'block',
        fontSize: 'small',
        width: 600,
        height: 75,
        resize: 'vertical',
    }),
}

export const StaveEditor = ({ dispatchStavesUpdate, index, stave }: Props) => {

    const update = (mod: Partial<PieceStave>) => dispatchStavesUpdate({
        type: 'set',
        index,
        value: { ...stave, ...mod }
    })

    return <>
        {index === 0 && <button onClick={() => dispatchStavesUpdate({ type: 'insert-new', index })}>add new stave</button>}
        <div css={styles.container}>
            <div css={styles.stack}>
                <label>
                    <span>clef</span>
                    <select
                        value={clefs.findIndex(i => i.name === stave.clef.name)}
                        onChange={({ target: { value: indexString } }) => {
                            const index = Number(indexString)
                            update({ clef: clefs[index] ?? TREBLE_CLEF })
                        }}
                    >
                        {clefs.map((clef, index) => <option key={index} value={index} >{clef.name}</option>)}
                    </select>
                </label>
                <label>
                    <span>instrument</span>
                    <select
                        value={stave.instrument ?? 'BELL'}
                        onChange={({ target: { value: instrumentName } }) => {
                            update({ instrument: instrumentName as InstrumentName })
                        }}
                    >
                        {(instrumentNames).map((instrumentName) =>
                            <option key={instrumentName} value={instrumentName}>{instrumentName}</option>
                        )}
                    </select>
                </label>
                <button onClick={() => dispatchStavesUpdate({ type: 'delete', index })}>delete</button>
            </div>
            <textarea
                onChange={({ target: { value: staveText } }) => {
                    update({ staveText })
                }}
                css={styles.textArea}
                value={stave.staveText}
            />
        </div>
        <button onClick={() => dispatchStavesUpdate({ type: 'insert-new', index: index + 1 })}>add new stave</button>
    </>
}
