import { BASE_CLEF, Clef, COMMON_TIME, THREE_FOUR, TimeSignature, TREBLE_CLEF } from "./notation-utils";

export type PieceStave = {
    staveText: string;
    clef: Clef
}

export type Piece = {
    timeSignature: TimeSignature;
    title: string;
    staves: [PieceStave, ...PieceStave[]]
}

export type StavesUpdate =
    { type: 'set', index: number, value: PieceStave } |
    { type: 'set-all', value: PieceStave[] } |
    { type: 'delete', index: number } |
    { type: 'insert-new', index?: number };

export const pieces: Piece[] = [
    {
        title: 'Ode to Joy',
        timeSignature: COMMON_TIME,
        staves: [
            {
                staveText: `
E4...E...F...G...|G...F...E...D...|C...C...D...E...|E...D...D.......|
 E...E...F...G...|G...F...E...D...|C...C...D...E...|D...C...C.......|
D...D...E...C... |D...E.F.E...C...|D...E.F.E...D...|C...D...-.......|
E...E...F...G... |G...F...E...D...|C...C...D...E...|D.....C.C.......|`,
                clef: TREBLE_CLEF
            },
            {
                staveText: `
C3............... |B2............... |E3.......D...C...  |G............... |
C3............... |B2............... |E3.......D...C...  |F.....E.E....... |
B2.......C3.......|B2.......C3.......|B2.......G#3.......|A...F#...G.......|
C3............... |B2............... |E3.......D...C...  |F.....E. E.......`,
                clef: BASE_CLEF
            }
        ],
    },
    {
        title: 'Chromatic scale',
        timeSignature: COMMON_TIME,
        staves: [
            {
                staveText: `CC#DD#EFF#GG#AA#B C.C#.D.D#.E.F.F#.G.G#.A.A#.B.`,
                clef: TREBLE_CLEF
            }
        ],
    },
    {
        title: 'Blow the man down',
        timeSignature: THREE_FOUR,
        staves: [
            {
                staveText: `
G.....A.G...|E...C...E...|G...A...G...|E...........|G...........|A...........|F.....E.F...|D...........|
F.....E.F...|D...D...D...|F...G...F...|D...........|G...G...G...|G.......F...|E.....D.E...|C...........|
`,
                clef: TREBLE_CLEF
            }
        ],
    },
    {
        title: 'mario theme',
        timeSignature: COMMON_TIME,
        staves: [
            {
                staveText: `
E3.E...E...C.E...|G.......G2.......|C3.....G2.....E.....A...B...Bb.A...|
G..C3..E.A...E.G...
E...C.D.B2.....|C3.....G2.....E.....|A...B...Bb.A...   |G..C3..D.A...E.G...|
E...C.D.B2.....|-.G3.Gb.F.Eb...E...G2.A.C3...A2.C3.D...|-.G.Gb.F.Eb...E... |
C4...C.C.......-.|-.G3.Gb.F.Eb...E...|G2.F.C3...A2.C3.D...|-...Eb.....D.....|
C.......-.......
`,
                clef: BASE_CLEF
            }
        ],
    },
];
