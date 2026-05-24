import type { StaveNote } from "sound-deck";
import type { NotationItem } from "../../lib/notation-items";
import { MusicalNote } from "./MusicalNote";
import { MusicalRest } from "./MusicalRest";
import { MusicalTie } from "./MusicalTie";

interface Props {
    item: NotationItem;
    isCurrentNote: { (staveNote: StaveNote): boolean }
    leftSpace: number
    middleC: number;
}


export const NotationSymbol = ({ item, isCurrentNote, leftSpace, middleC }: Props) => {
    switch (item.type) {
        case "Note":
            return <MusicalNote
                middleC={middleC}
                staveNote={item.staveNote}
                isCurrentNote={isCurrentNote(item.staveNote)}
                cx={leftSpace + item.x}
            />
        case "Rest":
            return <MusicalRest
                staveNote={item.staveNote}
                isCurrentNote={isCurrentNote(item.staveNote)}
                cx={leftSpace + item.x}
            />
        case "Bar":
            return <g data-bar-beat={item.beats}>
                <text x={leftSpace + item.x - 5} y={35} >{item.bar + 1}</text>
                <line
                    x1={leftSpace + item.x}
                    x2={leftSpace + item.x}
                    y1={40}
                    y2={80}
                    stroke="grey"
                    strokeWidth={2}
                ></line>
            </g>
        case "Tie":
            return <MusicalTie
                middleC={middleC}
                tie={item}
                leftSpace={leftSpace}
            />
    }
}