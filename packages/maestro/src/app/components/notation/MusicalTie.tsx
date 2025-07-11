import { NotationItemTie } from "../../lib/notation-items";
import { placesFromMiddleC } from "../../lib/notation-utils";

interface Props {
    tie: NotationItemTie;
    leftSpace: number;
    middleC: number
}

export const MusicalTie = ({ tie, leftSpace, middleC }: Props) => {
    const [firstNote] = tie.notes
    const y = firstNote ? middleC + placesFromMiddleC(firstNote) * 5 : 60;

    return <path
        stroke="black"
        fill="none"
        d={`M ${leftSpace + tie.x} ${y} Q ${leftSpace + (tie.x*2 + tie.length) / 2} ${y + 20} ${leftSpace + tie.x + tie.length} ${y} `}
    ></path>
}
