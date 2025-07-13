import { css } from "@emotion/react";
import { Clef, clefs, TREBLE_CLEF } from "../lib/notation-utils";
import { Dispatch, SetStateAction } from "react";


type Props = {
    setStaveText: Dispatch<SetStateAction<string>>,
    staveText: string,
    clef: Clef,
    setClef: Dispatch<SetStateAction<Clef>>
}


const styles = {

    textArea: css({
        display: 'block',
        width: 600,
        height: 100,
    }),
}

export const StaveEditor = ({ setStaveText, staveText, clef, setClef }: Props) => {


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
            <select value={clefs.findIndex(i => i === clef)} onChange={({ target: { value: indexString } }) => {
                const index = Number(indexString)
                setClef(clefs[index] ?? TREBLE_CLEF)
            }}>
                {clefs.map((clef, index) => <option key={index} value={index} >{clef.name}</option>)}
            </select>
        </label>
    </div>
}
