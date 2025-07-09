import { useEffect, useState } from "react";
import { parseStaveNotes, StaveNote } from "sound-deck";
import { NotationItem, staveNotesToNotationItems } from "../lib/notation-items";
import { NotationSymbol } from "./notation/NotationSymbol";
import { StaveFrame } from "./StaveFrame";

interface Props {
    staveText: string;
    beatNumber?: number;
    beatsPerBar: number;
}

const LEFT_SPACE = 50


export const StaveDisplay = ({ staveText, beatNumber, beatsPerBar }: Props) => {

    const [items, setItems] = useState<NotationItem[]>([])

    useEffect(() => {
        setItems(staveNotesToNotationItems(parseStaveNotes(staveText), beatsPerBar))
    }, [staveText, beatsPerBar])

    const isCurrentNote = (staveNote: StaveNote) => {
        if (typeof beatNumber === 'undefined') { return false }
        return beatNumber >= staveNote.atBeat && beatNumber < staveNote.atBeat + staveNote.beats
    }

    const staveWidth = (LEFT_SPACE * 2) + (items.length * 25);

    return <StaveFrame staveWidth={staveWidth} clef="treble">
        {items.map((item, index) => <NotationSymbol key={index} item={item} isCurrentNote={isCurrentNote} leftSpace={LEFT_SPACE} />)}
    </StaveFrame>

}