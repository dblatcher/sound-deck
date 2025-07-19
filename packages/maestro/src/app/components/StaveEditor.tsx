import { css } from "@emotion/react";
import { Clef, clefs, TREBLE_CLEF } from "../lib/notation-utils";
import { Dispatch } from "react";
import { StavesUpdate } from "../lib/songs";


type Props = {
    index: number
    staveText: string,
    clef: Clef,
    dispatchStavesUpdate: Dispatch<StavesUpdate>
}

const styles = {
    textArea: css({
        display: 'block',
        fontSize: 'small',
        width: 600,
        height: 80,
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

    return <div>
        <textarea
            onChange={({ target: { value } }) => {
                setStaveText(value)
            }}
            css={styles.textArea}
            value={staveText}
        />
        <label>
            <span>clef</span>
            <select value={clefs.findIndex(i => i.name === clef.name)} onChange={({ target: { value: indexString } }) => {
                const index = Number(indexString)
                setClef(clefs[index] ?? TREBLE_CLEF)
            }}>
                {clefs.map((clef, index) => <option key={index} value={index} >{clef.name}</option>)}
            </select>
        </label>
        <button onClick={()=> dispatchStavesUpdate({type:'delete', index})}>delete</button>
    </div>
}
