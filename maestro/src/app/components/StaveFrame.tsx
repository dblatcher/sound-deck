import type { ReactNode } from "react";
import type { Clef, TimeSignature } from "../lib/notation-utils";

interface Props {
    staveWidth: number,
    children: ReactNode,
    clef: Clef,
    timeSignature?: TimeSignature;
}


export const StaveFrame = ({ staveWidth, children, clef, timeSignature }: Props) => {

    return <svg
        stroke="grey"
        viewBox={`0 0 ${staveWidth} 120`}
        preserveAspectRatio="none"
        css={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            inset: 0,
        }}>
        <line x1={0} x2={staveWidth} y1={40} y2={40}></line>
        <line x1={0} x2={staveWidth} y1={50} y2={50}></line>
        <line x1={0} x2={staveWidth} y1={60} y2={60}></line>
        <line x1={0} x2={staveWidth} y1={70} y2={70}></line>
        <line x1={0} x2={staveWidth} y1={80} y2={80}></line>

        <text style={{ transform: clef.transform }} x={5} y={70} fontSize={40} >{clef.symbol}</text>

        {timeSignature && (
            <>
                <text x={35} y={55} fontSize={20} >{timeSignature.beats}</text>
                <text x={35} y={75} fontSize={20}>{timeSignature.beatValue}</text>
            </>
        )}

        {children}
    </svg>
}