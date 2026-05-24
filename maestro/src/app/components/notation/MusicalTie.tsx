import { type NotationItemTie } from "../../lib/notation-items";
import { placesFromMiddleC } from "../../lib/notation-utils";
import { LOWER_STAVE_BAR, UPPER_STAVE_BAR } from "../../lib/stave-positions";

interface Props {
    tie: NotationItemTie;
    leftSpace: number;
    middleC: number
}

export const MusicalTie = ({ tie, leftSpace, middleC }: Props) => {
    const [firstNote] = tie.notes
    const y = firstNote ? middleC + placesFromMiddleC(firstNote) * 5 : (UPPER_STAVE_BAR + LOWER_STAVE_BAR) / 2;

    const xStart = leftSpace + tie.x;
    const xMiddle = xStart + (tie.length / 2);
    const xEnd = xStart + tie.length;

    if (tie.lineBreak === 'before') {
        return <path
            stroke="black"
            fill="none"
            d={`M ${xStart} ${y} Q ${xStart} ${y + 10} ${xMiddle} ${y + 10} `}
        ></path>
    }
    if (tie.lineBreak === 'after') {
        return <path
            stroke="black"
            fill="none"
            d={`M ${xMiddle} ${y + 10} Q ${xMiddle + 20} ${y + 10} ${xEnd} ${y} `}
        ></path>
    }

    return <path
        stroke="black"
        fill="none"
        d={`M ${xStart} ${y} Q ${xMiddle} ${y + 20} ${xEnd} ${y} `}
    ></path>
}
