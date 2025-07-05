import { StaveNote } from "sound-deck";

interface Props {
    staveNote: StaveNote;
    isCurrentNote: boolean;
    cx: number;
}


// TO DO - rest symbols!

export const MusicalRest = ({ staveNote, isCurrentNote, cx }: Props) => {
    return <g>
        <ellipse
            rx={3}
            ry={4* staveNote.beats}
            cx={cx}
            cy={40}
            fill={isCurrentNote ? 'red' : 'none'}
            stroke="black"
        ></ellipse>
    </g>
}