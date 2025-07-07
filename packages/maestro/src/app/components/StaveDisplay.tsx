import { useEffect, useState } from "react";
import { parseStaveNotes, StaveNote } from "sound-deck";
import { NotationItem, staveNotesToNotationItems } from "../lib/notation-items";
import { MusicalNote } from "./MusicalNote";
import { MusicalRest } from "./MusicalRest";

interface Props {
    staveText: string;
    beatNumber?: number;
    beatsPerBar: number;
}

const LEFT_SPACE = 40


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

    return <div css={{
        width: staveWidth,
        height: 100,
        marginBottom: '2rem',
        position: 'relative',
        background: 'whitesmoke',
    }}>
        <svg
            stroke="grey"
            viewBox={`0 0 ${staveWidth} 100`}
            preserveAspectRatio="none"
            css={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                inset: 0,
            }}>
            <line x1={0} x2={staveWidth} y1={20} y2={20} stroke="gray"></line>
            <line x1={0} x2={staveWidth} y1={30} y2={30} stroke="gray"></line>
            <line x1={0} x2={staveWidth} y1={40} y2={40} stroke="gray"></line>
            <line x1={0} x2={staveWidth} y1={50} y2={50} stroke="gray"></line>
            <line x1={0} x2={staveWidth} y1={60} y2={60} stroke="gray"></line>

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
        </svg>
    </div>

}