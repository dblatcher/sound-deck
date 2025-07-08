import { useEffect, useState } from "react";
import { parseStaveNotes, StaveNote } from "sound-deck";
import { NotationItem, staveNotesToNotationItems } from "../lib/notation-items";
import { MusicalNote } from "./MusicalNote";
import { MusicalRest } from "./MusicalRest";
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

        {items.map((item, index) => {
            switch (item.type) {
                case "Note":
                    return <MusicalNote key={index}
                        staveNote={item.staveNote}
                        isCurrentNote={isCurrentNote(item.staveNote)}
                        cx={LEFT_SPACE + item.x}
                    />
                case "Rest":
                    return <MusicalRest key={index}
                        staveNote={item.staveNote}
                        isCurrentNote={isCurrentNote(item.staveNote)}
                        cx={LEFT_SPACE + item.x}
                    />
                case "Bar":
                    return <g key={index} data-bar-beat={item.beats}>
                        <text x={item.x - 5} y={15} >{item.beats}</text>
                        <line
                            x1={item.x}
                            x2={item.x}
                            y1={20}
                            y2={60}
                            stroke="grey"
                            strokeWidth={2}
                        ></line>
                    </g>
                // TO DO - use the notes property of the tie to set the correct Y coord
                case "Tie":
                    return <path key={index}
                        stroke="black"
                        fill="none"
                        d={`M ${item.x} ${60} Q ${(item.x + item.endX) / 2} 80 ${item.endX} ${60} `}
                    ></path>
            }
            return null
        })}
    </StaveFrame>

}