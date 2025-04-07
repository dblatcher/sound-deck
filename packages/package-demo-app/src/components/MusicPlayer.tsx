
import { useState } from "react"
import { Instrument, MusicControl, playMusic } from "sound-deck"
import { beat, drunkenSailorBase, drunkenSailorBaseHigher, drunkenSailorTreble, odeToJoy, odeToJoy5 } from "../data/songs"
import { useSoundDeck } from "./SoundDeckProvider"
import { VolumeSymbol } from "./VolumeSymbol"
import { SNARE, ORGAN, BELL, BOING } from "../data/instruments"


export const MusicPlayer = () => {
    const soundDeck = useSoundDeck()
    const [musicControl, setMusicControl] = useState<MusicControl | undefined>();
    const [currentBeat, setCurrentBeat] = useState(0)
    const [tempo, setTempo] = useState(4)
    const [loop, setLoop] = useState(false)

    const playOdeToJoy = (instrument: Instrument) => {
        const musicControl = playMusic(soundDeck)([
            { instrument, notes: odeToJoy },
            { instrument, notes: odeToJoy5 },
            { instrument: SNARE, notes: beat, volume: 1.75 }
        ], tempo, loop)
        setMusicControl(musicControl)
        musicControl.onBeat(setCurrentBeat)
        musicControl.whenEnded.then((success) => {
            console.log({ success })
            setMusicControl(undefined)
        })
    }

    const playDrunkenSailor = () => {
        const musicControl = playMusic(soundDeck)([
            { instrument: BELL, notes: drunkenSailorTreble },
            { instrument: BOING, notes: drunkenSailorBase, volume: .25 },
            { instrument: BOING, notes: drunkenSailorBaseHigher, volume: .25 },
        ], tempo, loop)
        setMusicControl(musicControl)
        musicControl.onBeat(setCurrentBeat)
        musicControl.whenEnded.then((success) => {
            console.log({ success })
            setMusicControl(undefined)
        })
    }
    const playBgm = () => {
        const musicControl = playMusic(soundDeck)([
            { instrument: BOING, notes: drunkenSailorBase, volume: .25 },
            { instrument: BOING, notes: drunkenSailorBaseHigher, volume: .25 },
            { instrument: SNARE, notes: beat, volume: 1 }
        ], tempo, loop)
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
                    tempo= {tempo.toFixed(1)}
                    <input
                        type="range"
                        value={tempo}
                        step={.5}
                        min={1}
                        max={12}
                        onChange={({ target: { valueAsNumber } }) => {
                            setTempo(valueAsNumber)
                            if (musicControl) {
                                musicControl.tempo = valueAsNumber
                            }
                        }} />
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
                <button disabled={!musicControl || musicControl?.isFading} onClick={() => musicControl?.fadeOut(5)}>fade 5s</button>
                <button disabled={!musicControl || musicControl?.isFading} onClick={() => musicControl?.fadeOut(2)}>fade 2s</button>
                <button disabled={!musicControl} onClick={musicControl?.pause}>pause</button>
                <button disabled={!musicControl} onClick={musicControl?.resume}>resume</button>
            </div>
            <div>
                <h4>ode To Joy</h4>
                <button disabled={!!musicControl} onClick={() => playOdeToJoy(ORGAN)}>play ORGAN</button>
                <button disabled={!!musicControl} onClick={() => playOdeToJoy(BELL)}>play bell</button>
                <button disabled={!!musicControl} onClick={() => playOdeToJoy(BOING)}>play BOING</button>
            </div>
            <div>
                <h4>drunken sailor</h4>
                <button disabled={!!musicControl} onClick={() => playDrunkenSailor()}>play</button>
            </div>
            <div>
                <h4>BGM</h4>
                <button disabled={!!musicControl} onClick={() => playBgm()}>play</button>
            </div>

            {musicControl && <div>
                <input readOnly type="range" min={0} max={musicControl.musicDuration} value={currentBeat} />
                <span>{currentBeat} / </span>
                <span>{musicControl.musicDuration}</span>
            </div>}
        </div >
    )
}