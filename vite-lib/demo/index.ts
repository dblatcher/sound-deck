import { EnhancedStave, MusicControl, parseStaveNotes, PitchedNote, playMusic, SoundControl, SoundDeck } from "../src";


const mySoundDeck = new SoundDeck(undefined, true);

const makePlayButton = (
    label: string,
    produceSound: { (): SoundControl | null | MusicControl }
) => {
    const playButton = document.createElement('button')
    playButton.innerText = label
    const play = () => {
        playButton.setAttribute('disabled', 'true')
        return mySoundDeck.enable().then(() => {
            const tone = produceSound();
            if (!tone) {
                playButton.removeAttribute('disabled')
                return
            }
            tone.whenEnded.then(() => {
                playButton.removeAttribute('disabled')
            });
        })
    }

    playButton.addEventListener('click', play)
    return playButton
}

const odeToJoy = parseStaveNotes(`
E4...E...F...G...|G...F...E...D...|C...C...D...E...|E...D...D.......|
 E...E...F...G...|G...F...E...D...|C...C...D...E...|D...C...C.......|
`)


document.body.appendChild(makePlayButton('tone 1', () => mySoundDeck.playTone({
    type: 'sawtooth',
    frequency: 600,
    endFrequency: 800,
    duration: 1,
    volume: 0.05,
})))

document.body.appendChild(makePlayButton('tone2', () => mySoundDeck.playTone({
    type: 'square',
    frequency: 200,
    endFrequency: 800,
    duration: .5,
    volume: 0.05,
})))
document.body.appendChild(makePlayButton('noise', () => mySoundDeck.playNoise({
    frequency: 1800,
    endFrequency: 800,
    duration: 2,
    volume: 0.4,
})))
document.body.appendChild(makePlayButton('ode to joy', () =>
    playMusic(mySoundDeck)(
        [
            new EnhancedStave({
                soundType: 'tone',

            }, odeToJoy)
        ]
        , 6, false)));

document.body.appendChild(makePlayButton('test chord', () => {

    const cNote = new PitchedNote('C', 4);
    const eNote = new PitchedNote('Eb', 4);
    const gNote = new PitchedNote('G', 4);
    const bFlatNote = new PitchedNote('Bb', 4);
    const betweenBeats = 1

    return playMusic(mySoundDeck)(
        [
            new EnhancedStave({
                soundType: 'tone',
                type: 'triangle',
            }, [
                {
                    beats: 2,
                    atBeat: betweenBeats*0,
                    note: cNote
                },
                ...([cNote, eNote].map(note => ({
                    beats: 2,
                    atBeat: betweenBeats*1,
                    note
                }))),
                ...([cNote, eNote, gNote].map(note => ({
                    beats: 2,
                    atBeat: betweenBeats*2,
                    note
                }))),
                ...([cNote, eNote, gNote, bFlatNote].map(note => ({
                    beats: 8,
                    atBeat: betweenBeats*3,
                    note
                }))),

            ])
        ]
        , 6, false)
}));


