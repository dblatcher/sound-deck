import { useEffect, useState } from "react";
import { parseStaveNotes, StaveNote } from "sound-deck";
import { NotationItem, NotationItemNote, NotationItemRest, splitByBars, staveNotesToNotationItems } from "../lib/notation-items";
import { Clef, TimeSignature } from "../lib/notation-utils";
import { DEFAULT_NOTE_SPACE, LEFT_SPACE } from "../lib/stave-positions";
import { NotationSymbol } from "./notation/NotationSymbol";
import { StaveFrame } from "./StaveFrame";
import { PieceStave } from "../lib/songs";


interface Props {
    staves: PieceStave[]
    beatNumber?: number;
    barsPerLine?: number;
    timeSignature: TimeSignature;
}


type ProcessedStave = {
    clef: Clef;
    lines: NotationItem[][];
}

type ArrangedLines = {
    lineIndex: number
    linesFromEachStave: {
        clef: Clef;
        items: NotationItem[];
    }[]
}[]

const arrangeLines = (staves: ProcessedStave[]): ArrangedLines => {
    const arrangedLines: ArrangedLines = []
    const addLine = (lineIndex = 0) => {
        if (!staves.some(stave => stave.lines.length > lineIndex)) {
            return
        }
        arrangedLines.push({
            lineIndex,
            linesFromEachStave: staves.map(staveAndClef => ({
                clef: staveAndClef.clef,
                items: staveAndClef.lines[lineIndex] ?? []
            }))
        })
        addLine(lineIndex + 1)
    }
    addLine()
    return arrangedLines;
}


const lastNoteOrRest = (items: NotationItem[]) => [...items].reverse().find(item => item.type === 'Note' || item.type === 'Rest') as NotationItemNote | NotationItemRest | undefined;

export const SheetMusic = ({ staves, beatNumber, barsPerLine, timeSignature }: Props) => {
    const [sheet, setSheet] = useState<ArrangedLines>([]);

    useEffect(() => {
        const crotchetsPerBar = timeSignature.beats * (4 / timeSignature.beatValue);
        const allItemsEveryStave = staves.map(({ staveText, clef }) => {
            const items = staveNotesToNotationItems(parseStaveNotes(staveText), crotchetsPerBar, DEFAULT_NOTE_SPACE);
            const lines = splitByBars(items, barsPerLine ?? Infinity);
            return { clef, lines }
        });
        setSheet(arrangeLines(allItemsEveryStave))
    }, [staves, timeSignature, barsPerLine])

    const isCurrentNote = (staveNote: StaveNote) => {
        if (typeof beatNumber === 'undefined') { return false }
        return beatNumber >= staveNote.atBeat && beatNumber < staveNote.atBeat + staveNote.beats
    }


    return <>
        {sheet.map((line) => {
            return <div css={{
                marginBottom: 15,
                paddingLeft: 5,
                borderLeft: '3px double black',
                borderRadius: 30,
            }} key={line.lineIndex}>
                {line.linesFromEachStave.map(({ clef, items }, index) => {

                    const last = lastNoteOrRest(items);
                    const lastX = last?.x ?? 0;
                    const lastBeats = last?.staveNote?.beats ?? 1;


                    return <StaveFrame key={index}
                        timeSignature={line.lineIndex === 0 ? timeSignature : undefined}
                        staveWidth={LEFT_SPACE + lastX + DEFAULT_NOTE_SPACE * (lastBeats + .5)}
                        clef={clef}>
                        {items.map((item, index) =>
                            <NotationSymbol key={index}
                                middleC={clef.middleC}
                                item={item}
                                isCurrentNote={isCurrentNote}
                                leftSpace={LEFT_SPACE} />
                        )}
                    </StaveFrame>
                })}
            </div>
        })}
    </>

}