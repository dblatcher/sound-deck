import { parseStaveNotes } from "./parse-stave-notes"

describe(parseStaveNotes.name, () => {

    test('parses simple notes, defaulting to octive 4', () => {
        const result = parseStaveNotes("CDEF");
        expect(result.length).toBe(4);
        result.forEach(staveNote => {
            expect(staveNote.note).toBeDefined();
            expect(staveNote.note?.octive).toBe(4);
        });
    })
    test('handles sharps and flats', () => {
        const result = parseStaveNotes("C#DEbF");
        expect(result.length).toBe(4);
        const [n1, n2, n3, n4] = result;
        expect(n1.note?.name).toBe('C#4')
        expect(n2.note?.name).toBe('D4')
        expect(n3.note?.name).toBe('Eb4')
        expect(n4.note?.name).toBe('F4')
    })
    test('parses rests and notes', () => {
        const result = parseStaveNotes("C-EF");
        expect(result.length).toBe(4);
        const [c, rest, e, f] = result;
        [c, e, f].forEach(staveNote => {
            expect(staveNote.note).toBeDefined();
            expect(staveNote.note?.octive).toBe(4);
        });
        expect(rest.note).toBeUndefined();
    })
    test('notes have 1/4 beat duration by default, with each dot adding and extra 1/4 beat', () => {
        const result = parseStaveNotes("C C. C.. C...");
        const [n1, n2, n3, n4] = result;
        expect(n1.beats).toBe(.25)
        expect(n1.atBeat).toBe(0)
        expect(n2.beats).toBe(.5)
        expect(n2.atBeat).toBe(n1.beats)
        expect(n3.beats).toBe(.75)
        expect(n3.atBeat).toBe(n1.beats + n2.beats)
        expect(n4.beats).toBe(1)
        expect(n4.atBeat).toBe(n1.beats + n2.beats + n3.beats)
    })
    test('adding a number the changes the octive until the next time an octive is set', () => {
        const result = parseStaveNotes("C5 - C  C3. C");
        const [n1, rest, n2, n3, n4] = result;
        expect(n1.note?.octive).toBe(5);
        expect(rest.note).toBeUndefined();
        expect(n2.note?.octive).toBe(5);
        expect(n3.note?.octive).toBe(3);
        expect(n4.note?.octive).toBe(3);
    })
    test('the up and down symbols will raise of lower the octive', () => {
        const baseOctive = 3
        const result = parseStaveNotes(`C${baseOctive} C^ C C^ C C Cv Cv`);

        const [n1, n2, n3, n4, n5, n6, n7, n8] = result;
        expect(n1.note?.octive).toBe(baseOctive);
        expect(n2.note?.octive).toBe(baseOctive + 1);
        expect(n3.note?.octive).toBe(baseOctive + 1);
        expect(n4.note?.octive).toBe(baseOctive + 2);
        expect(n5.note?.octive).toBe(baseOctive + 2);
        expect(n6.note?.octive).toBe(baseOctive + 2);
        expect(n7.note?.octive).toBe(baseOctive + 1);
        expect(n8.note?.octive).toBe(baseOctive);
    });
    test('can use multiple up and down symbols after on note', () => {
        const baseOctive = 3
        const result = parseStaveNotes(`C${baseOctive} C^^^ C Cvv`);

        const [n1, n2, n3, n4] = result;
        expect(n1.note?.octive).toBe(baseOctive);
        expect(n2.note?.octive).toBe(baseOctive + 3);
        expect(n3.note?.octive).toBe(baseOctive + 3);
        expect(n4.note?.octive).toBe(baseOctive + 1);
    });
})