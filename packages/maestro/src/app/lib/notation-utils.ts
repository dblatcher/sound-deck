import { StaveNote } from "sound-deck";


// TO DO - this will vary with clef
export const MIDDLE_C = 70


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