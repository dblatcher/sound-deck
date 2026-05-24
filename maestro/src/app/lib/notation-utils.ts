import type { StaveNote } from "sound-deck";


export type Clef = {
    name: string;
    symbol: string;
    middleC: number;
    transform?: string;
}

export const TREBLE_CLEF: Clef = {
    name: 'treble',
    symbol: "𝄞",
    middleC: 90,
    transform: 'scaleY(1.5) translateY(-15px)',
};

export const BASE_CLEF: Clef = {
    name: 'base',
    symbol: '𝄢',
    middleC: 30
}

export const clefs: Clef[] = [
    TREBLE_CLEF,
    BASE_CLEF
]

export type TimeSignature = {
    beats: number,
    beatValue: number,
}

export const COMMON_TIME: TimeSignature = {
    beats: 4,
    beatValue: 4,
}

export const THREE_FOUR: TimeSignature = {
    beats: 3,
    beatValue: 4,
}


export const placesFromMiddleC = (staveNote: StaveNote) => {
    const { note } = staveNote;
    if (!note) {
        return 0
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