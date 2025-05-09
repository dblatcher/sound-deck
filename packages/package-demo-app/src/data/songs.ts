import { parseStaveNotes } from "sound-deck"


// const melody2 = parseStaveNotes("C... G. E. C. G... C5.. C... G. E. C4. G... C.")


const odeToJoy = parseStaveNotes(`
E4...E...F...G...|G...F...E...D...|C...C...D...E...|E...D...D.......|
 E...E...F...G...|G...F...E...D...|C...C...D...E...|D...C...C.......|
`)
const beat = parseStaveNotes("C6...-...F...C...".repeat(8))

const drunkenSailorTrebleString = `
A4.AA A.AA | A.D. F. A. | G.GG  G.GG | G.C. E.G.|
A4.AA A.AA | A.B. C5.D. | C.A4. G.E. | D... D...|
 A... A..A | A.D. F. A. | G...  G..G | G.C. E.G.|
 A... A..A | A.B. C5.D. | C.A4. G.E. | D... D...|
`
const drunkenSailorBaseString = `
D2.D3.A2.D3.|D2.D3.A2.D3.|C2.C3.G2.C3.|C2.C3.G2.C3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|F2.F3.C2.C3.|D2.D3.A2.D3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|C2.C3.G2.C3.|C2.C3.G2.C3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|F2.F3.C2.C3.|D2.D3.A2...|
`

const drunkenSailorTreble = parseStaveNotes(drunkenSailorTrebleString)
const drunkenSailorBase = parseStaveNotes(drunkenSailorBaseString)

export { odeToJoy, beat, drunkenSailorBase, drunkenSailorTreble }