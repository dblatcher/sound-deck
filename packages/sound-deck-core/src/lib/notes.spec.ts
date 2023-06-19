import { PitchedNote } from "./notes"

describe('PitchedNote',() => {

    it ('can transpose whole octives', ()=> {
        const middleC = new PitchedNote('C',4)
        const upOctive = middleC.transpose(12)
        const downOctive = middleC.transpose(-12)
        expect(upOctive.name).toBe('C5')
        expect(downOctive.name).toBe('C3')
    })

    it ('can transpose up', ()=> {
        const middleC = new PitchedNote('C',4)
        const fourth = middleC.transpose(4)
        const sixteenth = middleC.transpose(16)
        expect(fourth.name).toBe('E4')
        expect(sixteenth.name).toBe('E5')
    })
    it ('can transpose down', ()=> {
        const middleC = new PitchedNote('C',4)
        const bFlat = middleC.transpose(-2)
        expect(bFlat.name).toBe('Bb3')
    })

})