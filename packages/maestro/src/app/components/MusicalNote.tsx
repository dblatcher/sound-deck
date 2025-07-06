import { StaveNote } from "sound-deck";

interface Props {
    staveNote: StaveNote;
    isCurrentNote: boolean;
    cx: number;
}

// TO DO - this will vary with clef
const MIDDLE_C = 70



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

const placesFromMiddleC = (staveNote: StaveNote) => {
    const { note } = staveNote;
    if (!note) {
        return -2.5
    }
    const { octive, note: noteLetter } = note;
    const octiveShift = -(octive - 4) * 7;
    let noteShift = 0;
    switch (noteLetter) {
        case "C":
            noteShift = 0; break;
        case "C#":
            noteShift = 0; break;
        case "Db":
            noteShift = 1; break;
        case "D":
            noteShift = 1; break;
        case "D#":
            noteShift = 1; break;
        case "Eb":
            noteShift = 2; break;
        case "E":
            noteShift = 2; break;
        case "F":
            noteShift = 3; break;
        case "F#":
            noteShift = 3; break;
        case "Gb":
            noteShift = 4; break;
        case "G":
            noteShift = 4; break;
        case "G#":
            noteShift = 4; break;
        case "Ab":
            noteShift = 5; break;
        case "A":
            noteShift = 5; break;
        case "A#":
            noteShift = 5; break;
        case "Bb":
            noteShift = 6; break;
        case "B":
            noteShift = 6; break;
    }
    return octiveShift - noteShift;
}

export const MusicalNote = ({ staveNote, isCurrentNote, cx }: Props) => {
    const cy = MIDDLE_C + (placesFromMiddleC(staveNote) * 5);
    const isAboveCenter = cy < 40;
    const noteShape = getNoteShape(staveNote.beats);

    return <g>
        <ellipse
            rx={5}
            ry={3}
            cx={cx}
            cy={cy}
            fill={isCurrentNote ? 'red' : noteShape.fill ? 'black' : 'none'}
            stroke="black"
        ></ellipse>

        {noteShape.dot && (
            <circle
                r={2}
                cx={cx + 9}
                cy={cy}
                fill="black"
            ></circle>
        )}

        {noteShape.line &&
            <line
                x1={isAboveCenter ? cx - 5 : cx + 5}
                y1={cy}
                x2={isAboveCenter ? cx - 5 : cx + 5}
                y2={isAboveCenter ? cy + 22 : cy - 22}
                stroke="black"
            ></line>
        }

        {noteShape.firstMark &&
            <line
                strokeWidth={2}
                x1={isAboveCenter ? cx - 5 : cx + 5}
                y1={isAboveCenter ? cy + 22 : cy - 22}
                x2={isAboveCenter ? cx - 12 : cx + 12}
                y2={isAboveCenter ? cy + 22 : cy - 22}
                stroke="black"></line>
        }
        {noteShape.secondMark &&
            <line
                strokeWidth={2}
                x1={isAboveCenter ? cx - 5 : cx + 5}
                y1={isAboveCenter ? cy + 18 : cy - 18}
                x2={isAboveCenter ? cx - 12 : cx + 12}
                y2={isAboveCenter ? cy + 18 : cy - 18}
                stroke="black"></line>
        }
        {staveNote.note?.name.includes('#') && (
            <text x={cx - 14} y={cy + 4}>#</text>
        )}
        {staveNote.note?.name.includes('b') && (
            <text x={cx - 14} y={cy + 4}>b</text>
        )}
    </g>
}