import { StaveNote } from "sound-deck";
import { placesFromMiddleC } from "../../lib/notation-utils";

interface Props {
    staveNote: StaveNote;
    isCurrentNote: boolean;
    cx: number;
    middleC: number;
}


type NoteShape = {
    line?: boolean;
    firstMark?: boolean;
    secondMark?: boolean;
    dot?: boolean;
    fill?: boolean;
}

const noteShapes = {
    semiQuaver: {
        line: true,
        firstMark: true,
        secondMark: true,
        fill: true
    },
    quaver: {
        line: true,
        firstMark: true,
        secondMark: false,
        fill: true
    },
    crotchet: {
        line: true,
        firstMark: false,
        secondMark: false,
        fill: true
    },
    minim: {
        line: true,
        firstMark: false,
        secondMark: false,
        fill: false
    },
    semiBreve: {

    }

} satisfies Record<string, NoteShape>

const dotted = (shape: NoteShape): NoteShape => ({ ...shape, dot: true })

const getNoteShape = (durationInCrotchets: number): NoteShape => {

    const { semiQuaver, quaver, crotchet, minim, semiBreve } = noteShapes;

    if (durationInCrotchets === .25) {
        return semiQuaver
    }
    if (durationInCrotchets === .5) {
        return quaver;
    }
    if (durationInCrotchets === .75) {
        return dotted(quaver)
    }
    if (durationInCrotchets === 1) {
        return crotchet
    }
    if (durationInCrotchets === 1.5) {
        return dotted(crotchet)
    }
    if (durationInCrotchets === 2) {
        return minim
    }
    if (durationInCrotchets === 3) {
        return dotted(minim)
    }

    if (durationInCrotchets === 4) {
        return semiBreve
    }

    // TODO - need to use multiple notes with ties for
    // inbetween durations
    return semiBreve;

}

const LOWER_STAVE_BAR = 60;
const getLowerLines = (noteY: number): number[] => {
    if (noteY <= LOWER_STAVE_BAR) {
        return []
    }

    return [
        (noteY > 65) ? 70 : [],
        (noteY > 70) ? 80 : [],
        (noteY > 80) ? 90 : [],
    ].flat()
}

const UPPER_STAVE_BAR = 20;
const getUpperLines = (noteY: number): number[] => {
    if (noteY >= UPPER_STAVE_BAR) {
        return []
    }

    return [
        (noteY < 15) ? 10 : [],
        (noteY < 10) ? 0 : [],
    ].flat()
}

export const MusicalNote = ({ staveNote, isCurrentNote, cx, middleC }: Props) => {
    const noteY = middleC + (placesFromMiddleC(staveNote) * 5);
    const isAboveCenter = noteY < 40;
    const noteShape = getNoteShape(staveNote.beats);

    return <g>

        {[...getLowerLines(noteY), ...getUpperLines(noteY)].map((lineY, index) => (
            <line key={index} y1={lineY} y2={lineY} x1={cx - 10} x2={cx + 10} ></line>
        ))}

        <ellipse
            rx={5}
            ry={3}
            cx={cx}
            cy={noteY}
            fill={isCurrentNote ? 'red' : noteShape.fill ? 'black' : 'none'}
            stroke="black"
        ></ellipse>

        {noteShape.dot && (
            <circle
                r={2}
                cx={cx + 9}
                cy={noteY}
                fill="black"
            ></circle>
        )}

        {noteShape.line &&
            <line
                x1={isAboveCenter ? cx - 5 : cx + 5}
                y1={noteY}
                x2={isAboveCenter ? cx - 5 : cx + 5}
                y2={isAboveCenter ? noteY + 22 : noteY - 22}
                stroke="black"
            ></line>
        }

        {noteShape.firstMark &&
            <line
                strokeWidth={2}
                x1={isAboveCenter ? cx - 5 : cx + 5}
                y1={isAboveCenter ? noteY + 22 : noteY - 22}
                x2={isAboveCenter ? cx - 12 : cx + 12}
                y2={isAboveCenter ? noteY + 22 : noteY - 22}
                stroke="black"></line>
        }
        {noteShape.secondMark &&
            <line
                strokeWidth={2}
                x1={isAboveCenter ? cx - 5 : cx + 5}
                y1={isAboveCenter ? noteY + 18 : noteY - 18}
                x2={isAboveCenter ? cx - 12 : cx + 12}
                y2={isAboveCenter ? noteY + 18 : noteY - 18}
                stroke="black"></line>
        }
        {staveNote.note?.name.includes('#') && (
            <text stroke="black" x={cx - 14} y={noteY + 4}>#</text>
        )}
        {staveNote.note?.name.includes('b') && (
            <text stroke="black" x={cx - 14} y={noteY + 4}>b</text>
        )}
    </g>
}