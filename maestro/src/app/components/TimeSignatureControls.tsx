import type { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import type { TimeSignature } from "../lib/notation-utils";
import { css } from "@emotion/react";
import { controlBorder } from "../lib/styles";

interface Props {
    timeSignature: TimeSignature,
    setTimeSignature: Dispatch<SetStateAction<TimeSignature>>
}

export const TimeSignatureControls = ({ timeSignature, setTimeSignature }: Props) => {

    const handleTimeSignatureBeatsChange: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: { valueAsNumber } }) => {
        setTimeSignature((current) => ({ ...current, beats: valueAsNumber }))
    }
    const handleTimeSignatureBeatValueChange: ChangeEventHandler<HTMLSelectElement> = ({ currentTarget: { value } }) => {
        setTimeSignature((current) => ({ ...current, beatValue: Number(value) }))
    }

    return (
        <div css={css(controlBorder, { display: 'flex' })}>
            <div css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 'small',
                padding: 2,
            }}>
                <span>time</span>
                <span>signature</span>
            </div>
            <div css={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <input
                    name="beats"
                    css={{ fontSize: 'larger' }}
                    type="number"
                    aria-label="beats per bar"
                    value={timeSignature.beats}
                    min={2} max={8}
                    onChange={handleTimeSignatureBeatsChange} />
                <select
                    name="beat type"
                    css={{ fontSize: 'larger' }}
                    aria-label="beat type"
                    value={timeSignature.beatValue}
                    onChange={handleTimeSignatureBeatValueChange}>
                    <option value={2}>2</option>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                </select>
            </div>
        </div>
    )
}