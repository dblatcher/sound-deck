import { useEffect, useState } from "react";
import { parseStaveNotes, StaveNote } from "sound-deck";
import { NotationItem, splitByBars, staveNotesToNotationItems } from "../lib/notation-items";
import { Clef } from "../lib/notation-utils";
import { NotationSymbol } from "./notation/NotationSymbol";
import { StaveFrame } from "./StaveFrame";
import { DEFAULT_NOTE_SPACE, LEFT_SPACE } from "../lib/stave-positions";

interface Props {
    staveText: string;
    beatNumber?: number;
    beatsPerBar: number;
    barsPerLine?: number;
    clef: Clef;
}



export const StaveDisplay = ({ clef, staveText, beatNumber, beatsPerBar, barsPerLine }: Props) => {

    const [linesOfMusic, setLinesOfMusic] = useState<NotationItem[][]>([])
    useEffect(() => {

        const allItems = staveNotesToNotationItems(parseStaveNotes(staveText), beatsPerBar, DEFAULT_NOTE_SPACE); 

        const lines = splitByBars(allItems, barsPerLine ?? Infinity);

        setLinesOfMusic(lines)
    }, [staveText, beatsPerBar, barsPerLine])

    const isCurrentNote = (staveNote: StaveNote) => {
        if (typeof beatNumber === 'undefined') { return false }
        return beatNumber >= staveNote.atBeat && beatNumber < staveNote.atBeat + staveNote.beats
    }


    return <>
        {linesOfMusic.map((items, index) => (
            <StaveFrame key={index}
                staveWidth={(LEFT_SPACE * 1) + (items.length * 25)}
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