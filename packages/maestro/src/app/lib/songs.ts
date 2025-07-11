import { BASE_CLEF, Clef, TREBLE_CLEF } from "./notation-utils";

type Piece = {
    staveText: string;
    timeSignature: number;
    title: string;
    clef?: Clef;
}

export const pieces: Piece[] = [
    {
        title: 'Ode to Joy',
        timeSignature: 4,
        clef: TREBLE_CLEF,
        staveText: `
E4...E...F...G...|G...F...E...D...|C...C...D...E...|E...D...D.......|
 E...E...F...G...|G...F...E...D...|C...C...D...E...|D...C...C.......|
`
    },
    {
        title: 'Chromatic scale',
        timeSignature: 4,
        staveText: `CC#DD#EFF#GG#AA#B C.C#.D.D#.E.F.F#.G.G#.A.A#.B.`,
    },
    {
        title: 'Blow the man down',
        timeSignature: 3,
        staveText: `
G.....A.G...|E...C...E...|G...A...G...|E...........|G...........|A...........|F.....E.F...|D...........|
F.....E.F...|D...D...D...|F...G...F...|D...........|G...G...G...|G.......F...|E.....D.E...|C...........|
`
    },
    {
        title: 'mario theme',
        timeSignature: 4,
        clef: BASE_CLEF,
        staveText: `
E3.E...E...C.E...|G.......G2.......|C3.....G2.....E.....A...B...Bb.A...|
G..C3..E.A...E.G...
E...C.D.B2.....|C3.....G2.....E.....|A...B...Bb.A...|G..C3..D.A...E.G...|E...C.
D.B2.....`
    },
];
