
import { useState } from "react"
import { Instrument, MusicControl, parseStaveNotes, playMusic, presetNoises, presetTones } from "sound-deck"
import { useSoundDeck } from "./SoundDeckProvider"
import { VolumeSymbol } from "./VolumeSymbol"

const BELL: Instrument = {
    soundType: 'tone',
    type: 'triangle',
    playPattern: [
        { time: 0, vol: .1 },
        { time: .2, vol: 1 },
        { time: .25, vol: 1 },
        { time: 1, vol: 0.01 },
    ]
}

const ORGAN: Instrument = {
    soundType: 'tone',
    type: 'triangle',
    customWaveName: 'organ',
    playPattern: [
        { time: 0, vol: .1 },
        { time: .1, vol: 1 },
        { time: .8, vol: 1 },
        { time: 1, vol: 0.01 },
    ]
}

const BOING: Instrument = {
    soundType: 'tone',
    ...presetTones.SPRINGY_BOUNCE
}

const SNARE: Instrument = {
    soundType: 'noise',
    ...presetNoises.TAP,
}

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


export const MusicPlayer = () => {
    const soundDeck = useSoundDeck()
    const [musicControl, setMusicControl] = useState<MusicControl | undefined>();
    const [currentBeat, setCurrentBeat] = useState(0)
    const [tempo, setTempo] = useState(4)
    const [loop, setLoop] = useState(false)

    const play = (instrument: Instrument) => {
        const musicControl = playMusic(soundDeck)([
            { instrument, notes: odeToJoy },
            { instrument, notes: odeToJoy5 },
            { instrument: SNARE, notes: beat, volume: 1.75 }
        ], tempo, true)
        setMusicControl(musicControl)

        musicControl.onBeat(setCurrentBeat)

        musicControl.whenEnded.then((success) => {
            console.log({ success })
            setMusicControl(undefined)
        })
    }

    return (
        <div>
            <h3>Music player <VolumeSymbol on={!!musicControl} /> </h3>
            <div>
                <label>
                    tempo= {tempo}
                    <input
                        disabled={!!musicControl}
                        type="range"
                        value={tempo}
                        min={1}
                        max={12}
                        onChange={({ target: { valueAsNumber } }) => setTempo(valueAsNumber)} />
                </label>
                <label>
                    loop
                    <input
                        disabled={!!musicControl}
                        type="checkbox"
                        checked={loop}
                        onChange={({ target }) => setLoop(target.checked)}
                    />
                </label>
            </div>
            <div>
                <button disabled={!musicControl} onClick={musicControl?.stop}>stop</button>
                <button disabled={!musicControl} onClick={musicControl?.pause}>pause</button>
                <button disabled={!musicControl} onClick={musicControl?.resume}>resume</button>
            </div>
            <div>
                <button disabled={!!musicControl} onClick={() => play(ORGAN)}>play ORGAN</button>
                <button disabled={!!musicControl} onClick={() => play(BELL)}>play bell</button>
                <button disabled={!!musicControl} onClick={() => play(BOING)}>play BOING</button>
            </div>

            {musicControl && <div>
                <input readOnly type="range" min={0} max={musicControl.musicDuration} value={currentBeat} />
                <span>{currentBeat} / </span>
                <span>{musicControl.musicDuration}</span>
            </div>}
        </div >
    )
}