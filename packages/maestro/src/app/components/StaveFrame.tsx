import { ReactNode } from "react";
import { Clef } from "../lib/notation-utils";

interface Props {
    staveWidth: number,
    children: ReactNode,
    clef: Clef
}


export const StaveFrame = ({ staveWidth, children, clef }: Props) => {

    return <div css={{
        width: staveWidth,
        height: 100,
        marginBottom: '2rem',
        position: 'relative',
        background: 'whitesmoke',
    }}>
        <svg
            stroke="grey"
            viewBox={`0 0 ${staveWidth} 100`}
            preserveAspectRatio="none"
            css={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                inset: 0,
            }}>
            <line x1={0} x2={staveWidth} y1={20} y2={20}></line>
            <line x1={0} x2={staveWidth} y1={30} y2={30}></line>
            <line x1={0} x2={staveWidth} y1={40} y2={40}></line>
            <line x1={0} x2={staveWidth} y1={50} y2={50}></line>
            <line x1={0} x2={staveWidth} y1={60} y2={60}></line>

            {!!clef && <text x={5} y={60} fontSize={40}>{clef.symbol}</text>}

            {children}
        </svg>
    </div>
}