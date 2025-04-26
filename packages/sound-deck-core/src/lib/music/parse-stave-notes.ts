import { isNote, isOctive, Note, Octive, PitchedNote } from "../notes"
import { StaveNote } from "./types"


const NOTE_OR_REST_PATTERN = /[A,B,C,D,E,F,G,-][b,#]?[0-8]?\.*/gm;

export const parseStaveNotes = (input: string): StaveNote[] => {
    const notesStrings = Array.from(input.matchAll(NOTE_OR_REST_PATTERN)).map(match => match[0])
    let currentOctive: Octive = 4
    let atBeat = 0

    const notes = notesStrings.map<StaveNote>(noteString => {
        const chars = noteString.split('')
        const noteOrRestSymbol = (chars[1] === 'b' || chars[1] === '#' ? chars.splice(0, 2).join('') : chars.splice(0, 1).join('')) as Note;
        const nextCharAsNumber = Number(chars[0])

        if (isOctive(nextCharAsNumber)) {
            currentOctive = nextCharAsNumber
            chars.shift()
        }
        const beats = (1 + chars.length) * .25

        const pitch = isNote(noteOrRestSymbol) ? new PitchedNote(noteOrRestSymbol, currentOctive) : undefined;

        const staveNote: StaveNote = {
            note: pitch,
            beats,
            atBeat: atBeat,
        }

        atBeat += beats
        return staveNote
    })
    return notes
}
