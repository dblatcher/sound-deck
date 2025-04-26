import { Instrument, Stave, StaveNote } from "./types"



export class EnhancedStave implements Stave {
    indexedNotes: Map<number, StaveNote>
    instrument: Instrument
    notes: StaveNote[]
    volume?: number
    constructor(
        instrument: Instrument,
        notes: StaveNote[],
        volume?: number
    ) {
        this.instrument = instrument
        this.notes = notes
        this.volume = volume
        this.indexedNotes = EnhancedStave.indexNotes(this.notes)
    }
    get duration() {
        const lastNote = this.notes[this.notes.length - 1];
        return lastNote.atBeat + lastNote.beats;
    }
    static indexNotes(notes: StaveNote[]): Map<number, StaveNote> {
        const map = new Map<number, StaveNote>()
        notes.forEach(note => {
            map.set(note.atBeat, note)
        })
        return map
    }
}
