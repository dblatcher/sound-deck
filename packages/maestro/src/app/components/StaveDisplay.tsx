import { useEffect, useState } from "react";
import { parseStaveNotes, StaveNote } from "sound-deck";
import { NotationItem, NotationItemBar, staveNotesToNotationItems } from "../lib/notation-items";
import { NotationSymbol } from "./notation/NotationSymbol";
import { StaveFrame } from "./StaveFrame";

interface Props {
    staveText: string;
    beatNumber?: number;
    beatsPerBar: number;
    barsPerLine?: number;
}

const LEFT_SPACE = 50

// TO DO - account for ties across bars!
const splitByBars = (items: NotationItem[], barsPerLine: number): NotationItem[][] => {

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


export const StaveDisplay = ({ staveText, beatNumber, beatsPerBar, barsPerLine }: Props) => {

    const [items, setItems] = useState<NotationItem[]>([])
    useEffect(() => {
        setItems(staveNotesToNotationItems(parseStaveNotes(staveText), beatsPerBar))
    }, [staveText, beatsPerBar])

    const isCurrentNote = (staveNote: StaveNote) => {
        if (typeof beatNumber === 'undefined') { return false }
        return beatNumber >= staveNote.atBeat && beatNumber < staveNote.atBeat + staveNote.beats
    }

    if (!barsPerLine) {
        return (
            <StaveFrame
                staveWidth={(LEFT_SPACE * 2) + (items.length * 25)}
                clef="treble">
                {items.map((item, index) => <NotationSymbol key={index} item={item} isCurrentNote={isCurrentNote} leftSpace={LEFT_SPACE} />)}
            </StaveFrame>
        )

    }

    const lines = splitByBars(items, barsPerLine);

    return <>
        {lines.map((items, index) => (
            <StaveFrame key={index}
                staveWidth={(LEFT_SPACE * 2) + (items.length * 25)}
                clef="treble">
                {items.map((item, index) => <NotationSymbol key={index} item={item} isCurrentNote={isCurrentNote} leftSpace={LEFT_SPACE} />)}
            </StaveFrame>
        ))}
    </>

}