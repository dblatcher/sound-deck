import { Dispatch, SetStateAction } from "react"
import { controlBorder } from "../lib/styles"


interface Props {
    tempo: number
    setTempo: Dispatch<SetStateAction<number>>
    barsPerLine: number
    setBarsPerLine: Dispatch<SetStateAction<number>>
}

export const TimingControls = ({ barsPerLine, setBarsPerLine, tempo, setTempo }: Props) => {

    return <div css={controlBorder}>
        <label>
            <span>bars per line</span>
            <input type="number"
                value={barsPerLine}
                min={2} max={16}
                onChange={({ currentTarget: { valueAsNumber } }) => setBarsPerLine(valueAsNumber)}
            />
        </label>
        <div>
            <label>
                <span>tempo</span>
                <input type="number"
                    value={tempo}
                    min={2} max={12}
                    onChange={({ currentTarget: { valueAsNumber } }) => setTempo(valueAsNumber)} />
            </label>
            <span>{15 * tempo} beats/min </span>
        </div>
    </div>
}