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


export { odeToJoy, beat, odeToJoy5 }