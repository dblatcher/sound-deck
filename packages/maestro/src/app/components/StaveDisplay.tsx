import { EnhancedStave, StaveNote } from "sound-deck";

interface Props {
    stave: EnhancedStave
    beatNumber?: number
}

const quarterNoteWidth = 6;

export const StaveDisplay = ({ stave, beatNumber }: Props) => {


    const isCurrentNote = (staveNote: StaveNote) => {
        if (typeof beatNumber === 'undefined') { return false }
        return beatNumber >= staveNote.atBeat && beatNumber < staveNote.atBeat + staveNote.beats
    }


    return <div css={{
        width: `${quarterNoteWidth * 4}em`
    }}>
        {stave.notes.map((staveNote, index) => {
            return <div key={index} css={{
                display: 'inline-block',
                boxSizing: 'border-box',
                border: '1px solid black',
                padding: 2,
                width: `${staveNote.beats * quarterNoteWidth}em`,
                backgroundColor: isCurrentNote(staveNote) ? 'pink' : 'lime',
            }}>
                {staveNote.note?.name} </div>

        })}
    </div>

}