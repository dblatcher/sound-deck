import { EnhancedStave, StaveNote } from "sound-deck";
import { MusicalNote } from "./MusicalNote";
import { MusicalRest } from "./MusicalRest";

interface Props {
    stave: EnhancedStave;
    beatNumber?: number;
}

const LEFT_SPACE = 40

type NotationItemBase = {
    x: number,
}

type NotationItemNote = NotationItemBase & {
    type: 'Note'
    staveNote: StaveNote
}
type NotationItemRest = NotationItemBase & {
    type: 'Rest'
    staveNote: StaveNote
}
type NotationItemBar = NotationItemBase & {
    type: 'Bar'
    beats: number
}

type NotationItem = NotationItemNote | NotationItemRest | NotationItemBar

const staveToNotationItems = (stave: EnhancedStave): NotationItem[] => {

    const items: NotationItem[] = [];

    let x = 0;
    let beat = 0

    const beatToBar = (beat: number) => Math.ceil((beat) / 4);

    // TO DO - ties!
    // TO DO - split the notes and rests to fit in bars!
    stave.notes.forEach((staveNote) => {
        if (staveNote.note) {
            items.push({
                staveNote,
                type: 'Note',
                x: x,
            })
        } else {
            items.push({
                staveNote,
                type: 'Rest',
                x: x,
            })
        }
        x += 25;
        const inNewBar = beat > 0 && beatToBar(beat) !== beatToBar(beat + staveNote.beats)
        beat = beat + staveNote.beats;
        if (inNewBar) {
            items.push({
                type: 'Bar',
                x: x + 5,
                beats: beat
            })
        }
    })

    return items
}

export const StaveDisplay = ({ stave, beatNumber }: Props) => {

    const isCurrentNote = (staveNote: StaveNote) => {
        if (typeof beatNumber === 'undefined') { return false }
        return beatNumber >= staveNote.atBeat && beatNumber < staveNote.atBeat + staveNote.beats
    }

    const items = staveToNotationItems(stave)
    console.log(items);


    const staveWidth = (LEFT_SPACE * 2) + (items.filter(i => i.type !== 'Bar').length * 25);

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
                        return <line key={index}
                            x1={item.x}
                            x2={item.x}
                            y1={20}
                            y2={60}
                            stroke="grey"
                            strokeWidth={2}
                        ></line>
                }
                return null
            })}
        </svg>
    </div>

}