import { StaveNote } from "sound-deck";
import { STAVE_MIDDLE } from "../../lib/stave-positions";

interface Props {
    staveNote: StaveNote;
    isCurrentNote: boolean;
    cx: number;
}


const getRestColor = (isCurrentNote: boolean) => isCurrentNote ? 'red' : 'black';

const MarkOnSideOfRest = ({ x, y, color, onRight }: { x: number, y: number, color: string, onRight?: boolean }) => {
    const lineProps = onRight ? { x1: x, y1: y + 2, x2: x - 8, y2: y } : { x1: x, y1: y, x2: x - 8, y2: y + 2 }
    const circleProps = onRight ? { cx: x, cy: y + 1 } : { cx: x - 6, cy: y + 1 }

    return <>
        <line
            {...lineProps}
            stroke={color}
        ></line>
        <circle
            {...circleProps}
            r={3}
            fill={color}
        ></circle>
    </>
}

const Dot = ({ x, isCurrentNote, y = STAVE_MIDDLE + 5 }: { x: number, y?: number, isCurrentNote: boolean }) => {
    const color = getRestColor(isCurrentNote);
    return <circle
        r={2}
        cx={x}
        cy={y}
        fill={color}
    ></circle>
}

type RestMarkProps = {
    isCurrentNote: boolean;
    cx: number;
    dotted?: boolean;
}

const SemiQuaverRest = ({ isCurrentNote, cx }: RestMarkProps) => {
    const color = getRestColor(isCurrentNote);
    return <g>
        <line
            x1={cx - 4}
            y1={STAVE_MIDDLE + 8}
            x2={cx + 10}
            y2={STAVE_MIDDLE - 18}
            stroke={color}
        ></line>
        <MarkOnSideOfRest color={color} x={cx + 8} y={STAVE_MIDDLE - 16} />
        <MarkOnSideOfRest color={color} x={cx + 4} y={STAVE_MIDDLE - 6} />
    </g>
}
const QuaverRest = ({ isCurrentNote, cx, dotted }: RestMarkProps) => {
    const color = getRestColor(isCurrentNote);
    return <g>
        <line
            x1={cx - 4}
            y1={68}
            x2={cx + 5}
            y2={STAVE_MIDDLE - 8}
            stroke={color}
        ></line>
        <MarkOnSideOfRest color={color} x={cx + 4} y={STAVE_MIDDLE - 6} />
        {dotted && <Dot isCurrentNote={isCurrentNote} x={cx + 5} />}
    </g>
}
const CrotchetRest = ({ isCurrentNote, cx, dotted }: RestMarkProps) => {
    const color = getRestColor(isCurrentNote);
    return <g>
        <line
            x1={cx + 4}
            y1={STAVE_MIDDLE + 8}
            x2={cx - 4}
            y2={STAVE_MIDDLE - 8}
            stroke={color}
        ></line>
        <MarkOnSideOfRest color={color} x={cx + 4} y={STAVE_MIDDLE - 6} onRight />
        {dotted && <Dot isCurrentNote={isCurrentNote} x={cx + 8} />}
    </g>
}

const MinimRest = ({ isCurrentNote, cx, dotted }: RestMarkProps) => {
    return <g>
        <rect
            fill={getRestColor(isCurrentNote)}
            stroke={getRestColor(isCurrentNote)}
            x={cx - 5} y={STAVE_MIDDLE - 4}
            width={10} height={4}
        ></rect>
        {dotted && <Dot isCurrentNote={isCurrentNote} x={cx + 8} />}
    </g>
}

const SemiBreveRest = ({ isCurrentNote, cx, dotted }: RestMarkProps) => {
    return <g>
        <rect
            fill={getRestColor(isCurrentNote)}
            stroke={getRestColor(isCurrentNote)}
            x={cx - 5} y={STAVE_MIDDLE - 10}
            width={10} height={4}
        ></rect>
        {dotted && <Dot isCurrentNote={isCurrentNote} x={cx + 8} y={STAVE_MIDDLE - 4} />}
    </g>
}

export const MusicalRest = ({ staveNote, isCurrentNote, cx }: Props) => {

    const color = getRestColor(isCurrentNote);

    if (staveNote.beats === .25) {
        return <SemiQuaverRest {...{ isCurrentNote, cx }} />
    }

    if (staveNote.beats === .5) {
        return <QuaverRest {...{ isCurrentNote, cx }} />
    }

    if (staveNote.beats === .75) {
        return <QuaverRest dotted {...{ isCurrentNote, cx }} />
    }

    if (staveNote.beats === 1) {
        return <CrotchetRest {...{ isCurrentNote, cx }} />
    }
    if (staveNote.beats === 1.5) {
        return <CrotchetRest dotted {...{ isCurrentNote, cx }} />
    }
    if (staveNote.beats === 2) {
        return <MinimRest {...{ isCurrentNote, cx }} />
    }
    if (staveNote.beats === 3) {
        return <MinimRest dotted {...{ isCurrentNote, cx }} />
    }
    if (staveNote.beats === 4) {
        return <SemiBreveRest {...{ isCurrentNote, cx }} />
    }
    if (staveNote.beats === 6) {
        return <SemiBreveRest dotted {...{ isCurrentNote, cx }} />
    }

    return <g>
        <ellipse
            rx={3}
            ry={4 * staveNote.beats}
            cx={cx}
            cy={STAVE_MIDDLE}
            fill={isCurrentNote ? 'red' : 'none'}
            stroke={color}
        ></ellipse>
    </g>
}