import { css } from "@emotion/react";
import { Clef, clefs, TREBLE_CLEF } from "../lib/notation-utils";
import { Dispatch } from "react";
import { StavesUpdate } from "../lib/songs";
import { controlBorder } from "../lib/styles";


type Props = {
    index: number
    staveText: string,
    clef: Clef,
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

export const StaveEditor = ({ staveText, clef, dispatchStavesUpdate, index }: Props) => {

    const setClef = (clef: Clef) =>
        dispatchStavesUpdate({
            type: 'set',
            index,
            value: { staveText, clef }
        })
    const setStaveText = (staveText: string) =>
        dispatchStavesUpdate({
            type: 'set',
            index,
            value: { staveText, clef }
        })

    return <div css={styles.container}>
        <div css={styles.stack}>
            <label>
                <span>clef</span>
                <select value={clefs.findIndex(i => i.name === clef.name)} onChange={({ target: { value: indexString } }) => {
                    const index = Number(indexString)
                    setClef(clefs[index] ?? TREBLE_CLEF)
                }}>
                    {clefs.map((clef, index) => <option key={index} value={index} >{clef.name}</option>)}
                </select>
            </label>
            <button onClick={() => dispatchStavesUpdate({ type: 'delete', index })}>delete</button>
        </div>
        <textarea
            onChange={({ target: { value } }) => {
                setStaveText(value)
            }}
            css={styles.textArea}
            value={staveText}
        />
    </div>
}
