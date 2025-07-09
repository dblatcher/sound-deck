import { StaveNote } from "sound-deck";

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
export type NotationItemTie = NotationItemBase & {
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

export const staveNotesToNotationItems = (staveNotes: StaveNote[], beatPerBar = 4, space = 25): NotationItem[] => {
    const items: NotationItem[] = [];
    let x = 0;
    let beat = 0

    const beatToBar = (beat: number) => 1 + Math.floor(beat / beatPerBar);

    const addNote = (staveNote: StaveNote) => {
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
        beat = beat + staveNote.beats;
        const inNewBar = staveNote.atBeat + staveNote.beats >= beatToBar(staveNote.atBeat) * beatPerBar;
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

    const addNotesAndTie = (tiedNotes: StaveNote[]) => {
        const tieStart = x;
        tiedNotes.forEach(addNote)
        items.push({
            type: 'Tie',
            x: tieStart,
            endX: x - space,
            notes: tiedNotes,
        })
    }

    staveNotes.forEach((staveNote) => {
        const beatsLeftInBar = (beat: number) => {
            const currentBar = beatToBar(beat);
            const endsAt = currentBar * beatPerBar;
            return endsAt - beat
        }
        const beatsLeft = beatsLeftInBar(beat);

        if (staveNote.beats > beatsLeft) {
            const before = splitNote({ ...staveNote, beats: beatsLeft })
            const after = splitNote({ ...staveNote, beats: staveNote.beats - beatsLeft })
            addNotesAndTie([...before, ...after])

        } else if (hasSymbol(staveNote)) {
            addNote(staveNote);
        } else {
            addNotesAndTie(splitNote(staveNote))
        }
    })

    return items
}