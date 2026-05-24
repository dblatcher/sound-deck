import { type FunctionComponent, type ReactNode, useEffect, useState } from "react";
import { parseStaveNotes, type StaveNote } from "sound-deck";
import { type ArrangedLines, arrangeLines } from "../lib/arrange-lines";
import { lastNoteOrRest, splitByBars, staveNotesToNotationItems } from "../lib/notation-items";
import type { TimeSignature } from "../lib/notation-utils";
import type { PieceStave } from "../lib/songs";
import { DEFAULT_NOTE_SPACE, LEFT_SPACE } from "../lib/stave-positions";
import { NotationSymbol } from "./notation/NotationSymbol";
import { StaveFrame } from "./StaveFrame";
import { TempoMark } from "./notation/TempoMark";


interface Props {
    staves: PieceStave[]
    beatNumber?: number;
    barsPerLine?: number;
    timeSignature: TimeSignature;
    tempo: number;
}


const SystemFrame: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
    <div css={{
        paddingBottom: 15,
        paddingLeft: 20,
        position: 'relative',
        backgroundColor: 'antiquewhite',
        display: 'inline-block',
    }} >
        <div css={{
            width: 20,
            height: '100%',
            position: 'absolute',
            left: 15,
            top: 0,
            paddingTop: 10,
            paddingBottom: 25,
            boxSizing: 'border-box',
        }}>
            <div css={{
                borderLeft: '3px solid black',
                borderRadius: 60,
                width: '100%',
                height: '100%',
            }}>
            </div>
        </div>
        {children}
    </div>
)


export const SheetMusic = ({ staves, beatNumber, barsPerLine, timeSignature, tempo }: Props) => {
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

    return <article css={{
        display: 'inline-flex',
        backgroundColor: 'antiquewhite',
        flexDirection: 'column',
    }}>

        <TempoMark tempo={tempo} />

        {sheet.map((line) => {
            return <SystemFrame key={line.lineIndex}>
                {line.linesFromEachStave.map(({ clef, items }, index) => {

                    const last = lastNoteOrRest(items);
                    const lastX = last?.x ?? 0;
                    const lastBeats = last?.staveNote?.beats ?? 1;
                    const staveWidth = LEFT_SPACE + lastX + DEFAULT_NOTE_SPACE * (lastBeats + .5);

                    return (
                        <div  key={index}  css={{
                            width: staveWidth,
                            height: 120,
                            position: 'relative',
                        }}>
                            <StaveFrame
                                timeSignature={line.lineIndex === 0 ? timeSignature : undefined}
                                staveWidth={staveWidth}
                                clef={clef}>
                                {items.map((item, notationIndex) =>
                                    <NotationSymbol key={notationIndex}
                                        middleC={clef.middleC}
                                        item={item}
                                        isCurrentNote={isCurrentNote}
                                        leftSpace={LEFT_SPACE} />
                                )}
                            </StaveFrame>
                        </div>
                    )
                })}
            </SystemFrame>
        })}
    </article>

}