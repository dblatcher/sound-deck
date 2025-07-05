import { EnhancedStave, StaveNote } from "sound-deck";
import { MusicalNote } from "./MusicalNote";
import { MusicalRest } from "./MusicalRest";

interface Props {
    stave: EnhancedStave;
    beatNumber?: number;
    spaceNotesByDuration?: boolean;
}

const LEFT_SPACE = 40

export const StaveDisplay = ({ stave, beatNumber, spaceNotesByDuration }: Props) => {

    const isCurrentNote = (staveNote: StaveNote) => {
        if (typeof beatNumber === 'undefined') { return false }
        return beatNumber >= staveNote.atBeat && beatNumber < staveNote.atBeat + staveNote.beats
    }

    const staveWidth = (LEFT_SPACE * 2) + (stave.duration * 40);

    return <div css={{
        width: staveWidth,
        height: 100,
        marginBottom: '2rem',
        position: 'relative',
        background: 'whitesmoke',
    }}>
        <svg
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

            {stave.notes.map((staveNote, index) =>
                staveNote.note ?
                    <MusicalNote key={index}
                        staveNote={staveNote}
                        isCurrentNote={isCurrentNote(staveNote)}
                        cx={LEFT_SPACE + ((spaceNotesByDuration ? staveNote.atBeat : index) * 25)}
                    />
                    : <MusicalRest key={index}
                        staveNote={staveNote}
                        isCurrentNote={isCurrentNote(staveNote)}
                        cx={LEFT_SPACE + ((spaceNotesByDuration ? staveNote.atBeat : index) * 25)}
                    />
            )}
        </svg>
    </div>

}