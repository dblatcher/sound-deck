import { NotationItemTie } from "../lib/notation-items"
import { MIDDLE_C, placesFromMiddleC } from "../lib/notation-utils"

interface Props {
    item: NotationItemTie;
    leftSpace: number;
}

export const MusicalTie = ({ item, leftSpace }: Props) => {
    const [firstNote] = item.notes
    const y = firstNote ? MIDDLE_C + placesFromMiddleC(firstNote) * 5 : 60;

    return <path
        stroke="black"
        fill="none"
        d={`M ${leftSpace + item.x} ${y} Q ${leftSpace + (item.x + item.endX) / 2} ${y + 20} ${leftSpace + item.endX} ${y} `}
    ></path>
}
