import { parseStaveNotes } from "sound-deck"


// const melody2 = parseStaveNotes("C... G. E. C. G... C5.. C... G. E. C4. G... C.")


const odeToJoy = parseStaveNotes(`
E4...E...F...G...|G...F...E...D...|C...C...D...E...|E...D...D.......|
 E...E...F...G...|G...F...E...D...|C...C...D...E...|D...C...C.......|
`)
const odeToJoy5 = parseStaveNotes(`
E5...E...F...G...|G...F...E...D...|C...C...D...E...|E...D...D.......|
 E...E...F...G...|G...F...E...D...|C...C...D...E...|D...C...C.......|
`)
const beat = parseStaveNotes("C6...-...F...C...".repeat(8))

const drunkenSailorTrebleString = `
    A4.AA A.AA|A.D. F. A.  |G.GG  G.GG |G.C. E.G.|
    A4.AA A.AA|A.B. C5.D.  |C.A4. G.E. |D... D...|
     A... A..A|A.D. F. A.  |G...  G..G |G.C. E.G.|
     A... A..A|A.B. C5.D.  |C.A4. G.E. |D... D...|
`
const drunkenSailorBaseString = `
D2.D3.A2.D3.|D2.D3.A2.D3.|C2.C3.G2.C3.|C2.C3.G2.C3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|F2.F3.C2.C3.|D2.D3.A2.D3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|C2.C3.G2.C3.|C2.C3.G2.C3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|F2.F3.C2.C3.|D2.D3.A2...|
`

const trebleBars = drunkenSailorTrebleString.split("|").map(parseStaveNotes)
const trebleBarsDurations = trebleBars.map(notes => {
    const last = [...notes].pop()
    return last ? last?.atBeat + last?.beats : 0
})
console.log({ trebleBars, trebleBarsDurations })

const bassBars = drunkenSailorBaseString.split("|").map(parseStaveNotes)
const baseBarsDurations = bassBars.map(notes => {
    const last = [...notes].pop()
    return last ? last?.atBeat + last?.beats : 0
})
console.log({ bassBars, baseBarsDurations })


const drunkenSailorTreble = parseStaveNotes(drunkenSailorTrebleString)
const drunkenSailorBase = parseStaveNotes(drunkenSailorBaseString)
const drunkenSailorBaseHigher = parseStaveNotes(drunkenSailorBaseString.replace(/3/g, "4").replace(/2/g, "3"))

export { odeToJoy, beat, odeToJoy5, drunkenSailorBase, drunkenSailorTreble, drunkenSailorBaseHigher }