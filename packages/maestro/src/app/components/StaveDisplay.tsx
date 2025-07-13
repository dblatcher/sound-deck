import { useEffect, useState } from "react";
import { parseStaveNotes, StaveNote } from "sound-deck";
import { NotationItem, splitByBars, staveNotesToNotationItems } from "../lib/notation-items";
import { Clef, TimeSignature } from "../lib/notation-utils";
import { NotationSymbol } from "./notation/NotationSymbol";
import { StaveFrame } from "./StaveFrame";
import { DEFAULT_NOTE_SPACE, LEFT_SPACE } from "../lib/stave-positions";

interface Props {
    staveText: string;
    beatNumber?: number;
    barsPerLine?: number;
    clef: Clef;
    timeSignature: TimeSignature;
}

const lastNoteOrRest = (items: NotationItem[]) => [...items].reverse().find(item => item.type === 'Note' || item.type === 'Rest')

export const StaveDisplay = ({ clef, staveText, beatNumber, barsPerLine, timeSignature }: Props) => {

    const [linesOfMusic, setLinesOfMusic] = useState<NotationItem[][]>([])
    useEffect(() => {
        const crotchetsPerBar = timeSignature.beats * (4 / timeSignature.beatValue);
        const allItems = staveNotesToNotationItems(parseStaveNotes(staveText), crotchetsPerBar, DEFAULT_NOTE_SPACE);
        const lines = splitByBars(allItems, barsPerLine ?? Infinity);
        setLinesOfMusic(lines)
    }, [staveText, timeSignature, barsPerLine, clef])

    const isCurrentNote = (staveNote: StaveNote) => {
        if (typeof beatNumber === 'undefined') { return false }
        return beatNumber >= staveNote.atBeat && beatNumber < staveNote.atBeat + staveNote.beats
    }


    return <>
        {linesOfMusic.map((items, index) => (
            <StaveFrame key={index}
                timeSignature={index === 0 ? timeSignature : undefined}
                staveWidth={LEFT_SPACE + (lastNoteOrRest(items)?.x ?? 0) + DEFAULT_NOTE_SPACE * 1.5}
                clef={clef}>
                {items.map((item, index) =>
                    <NotationSymbol key={index}
                        middleC={clef.middleC}
                        item={item}
                        isCurrentNote={isCurrentNote}
                        leftSpace={LEFT_SPACE} />
                )}
            </StaveFrame>
        ))}
    </>

}