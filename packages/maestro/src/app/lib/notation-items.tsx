import { EnhancedStave, StaveNote } from "sound-deck";

type NotationItemBase = {
    x: number,
}

type NotationItemNote = NotationItemBase & {
    type: 'Note'
    staveNote: StaveNote
}
type NotationItemRest = NotationItemBase & {
    type: 'Rest'
    staveNote: StaveNote
}
type NotationItemBar = NotationItemBase & {
    type: 'Bar'
    beats: number
}
type NotationItemTie = NotationItemBase & {
    type: 'Tie'
    endX: number
    notes: StaveNote[]
}

const periodsWithSymbols = [
    4,
    3,
    2,
    1.5,
    1,
    .75,
    .5,
    .25,
];
const hasSymbol = (originalNote: StaveNote) => (periodsWithSymbols.includes(originalNote.beats));

const splitNote = (originalNote: StaveNote): StaveNote[] => {
    if (hasSymbol(originalNote)) {
        return [originalNote]
    }
    const biggest = periodsWithSymbols.find(period => period <= originalNote.beats) ?? 0;
    if (biggest === 0) {
        return []
    }
    return [
        { ...originalNote, beats: biggest },
        ...splitNote({ ...originalNote, beats: originalNote.beats - biggest })
    ]
}

export type NotationItem = NotationItemNote | NotationItemRest | NotationItemBar | NotationItemTie

export const staveToNotationItems = (stave: EnhancedStave, space = 25): NotationItem[] => {

    const items: NotationItem[] = [];

    let x = 0;
    let beat = 0

    const beatToBar = (beat: number) => Math.ceil((beat + 1) / 4);

    const addNote = (staveNote: StaveNote) => {
        const beatsLeftInBar = (beat: number) => {
            const currentBar = beatToBar(beat);
            const endsAt = currentBar * 4;
            console.log(`in bar ${currentBar}, ending at ${endsAt} at beat ${beat}, there are ${endsAt - beat} left, and this note is ${staveNote.beats} long`)
            return endsAt - beat
        }
        beatsLeftInBar(beat)
        if (staveNote.note) {
            items.push({
                staveNote,
                type: 'Note',
                x: x,
            })
        } else {
            items.push({
                staveNote,
                type: 'Rest',
                x: x,
            })
        }
        x += space;
        const inNewBar = beatToBar(beat) !== beatToBar(beat + staveNote.beats)
        beat = beat + staveNote.beats;
        if (inNewBar) {
            console.log('bar', { beat })
            x += space
            items.push({
                type: 'Bar',
                x: x + space / 2,
                beats: beat
            })
        }
    }

    console.clear()
    // TO DO - split the notes and rests to fit in bars!
    stave.notes.forEach((staveNote) => {

        if (hasSymbol(staveNote)) {
            addNote(staveNote);
        } else {
            const splitNotes = splitNote(staveNote);
            const atStart = x + 25 + 10;
            splitNotes.forEach(addNote)
            items.push({
                type: 'Tie',
                x: atStart,
                endX: x,
                notes: splitNotes,
            })
        }
    })

    return items
}