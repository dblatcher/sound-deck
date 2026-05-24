import type { NotationItem } from "./notation-items";
import type { Clef } from "./notation-utils";



export type ProcessedStave = {
    clef: Clef;
    lines: NotationItem[][];
}

export type ArrangedLines = {
    lineIndex: number
    linesFromEachStave: {
        clef: Clef;
        items: NotationItem[];
    }[]
}[]

export const arrangeLines = (staves: ProcessedStave[]): ArrangedLines => {
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
