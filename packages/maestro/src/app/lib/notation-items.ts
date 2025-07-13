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
export type NotationItemBar = NotationItemBase & {
    type: 'Bar'
    beats: number
    bar: number
}
export type NotationItemTie = NotationItemBase & {
    type: 'Tie'
    length: number
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

export const staveNotesToNotationItems = (staveNotes: StaveNote[], crotchetsPerBar = 4, space = 25): NotationItem[] => {
    const items: NotationItem[] = [];
    let x = 0;
    let beat = 0

    const beatToBar = (beat: number) => 1 + Math.floor(beat / crotchetsPerBar);

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
        const inNewBar = beatToBar(beat + staveNote.beats) > beatToBar(beat);
        const isLastNote = staveNotes.length-1 === staveNotes.indexOf(staveNote);
        beat = beat + staveNote.beats;
        if (inNewBar && !isLastNote ) {
            x += space
            items.push({
                type: 'Bar',
                x: x + space / 2,
                beats: beat,
                bar: beatToBar(beat) - 1
            })
        }
    }

    const addNotesAndTie = (tiedNotes: StaveNote[]) => {
        const tieStart = x;
        tiedNotes.forEach(addNote)
        items.push({
            type: 'Tie',
            x: tieStart,
            length: x - space - tieStart,
            notes: tiedNotes,
        })
    }

    staveNotes.forEach((staveNote) => {
        const countBeatsLeftInBar = (beat: number) => {
            const currentBar = beatToBar(beat);
            const endsAt = currentBar * crotchetsPerBar;
            return endsAt - beat
        }
        const beatsLeftInBar = countBeatsLeftInBar(beat);

        if (staveNote.beats > beatsLeftInBar) {
            const before = splitNote({ ...staveNote, beats: beatsLeftInBar })
            const after = splitNote({ ...staveNote, beats: staveNote.beats - beatsLeftInBar })
            addNotesAndTie([...before, ...after])

        } else if (hasSymbol(staveNote)) {
            addNote(staveNote);
        } else {
            addNotesAndTie(splitNote(staveNote))
        }
    })

    return items
}



// TO DO - account for ties across bars!
// replace the original ties with one at the end of the line and one at the begining of the next line
// need new property to say if the tie is start/end to control the curve shape
export const splitByBars = (items: NotationItem[], barsPerLine: number): NotationItem[][] => {

    const source = [...items];
    const lines: NotationItem[][] = [];

    const takeNextSet = () => {
        if (source.length === 0) {
            return
        }
        const nextSplitIndex = source.findIndex(i => i.type === 'Bar' && i.bar % barsPerLine === 0);
        const xOffset = source[0]?.x ?? 0;
        const shiftToStart = (itemSet: NotationItem[]) => itemSet.map(i => ({ ...i, x: i.x - xOffset }))
        if (nextSplitIndex === -1) {
            lines.push(shiftToStart(source));
            return
        }
        const nextSet = source.splice(0, nextSplitIndex + 1);
        lines.push(shiftToStart(nextSet))
        takeNextSet()
    }
    takeNextSet()

    return lines
}