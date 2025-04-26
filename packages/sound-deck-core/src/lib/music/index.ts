import { AbstractSoundDeck } from "../AbstractSoundDeck"
import { SoundControl } from "../SoundControl"
import { Instrument, PercussiveInstrument, Stave, StaveNote, TonalInstrument } from "./types"
import { parseStaveNotes } from "./parse-stave-notes"
import { EnhancedStave } from "./staves"

export type {
    Instrument, PercussiveInstrument, TonalInstrument
}


export {
    parseStaveNotes
}



type BeatCallback = { (beat: number): void }
type VoidCallback = { (): void }


export type MusicControl = {
    stop: { (): void },
    whenEnded: Promise<boolean>,
    pause: { (): number },
    resume: { (): void },
    fadeOut: { (seconds: number): void }
    musicDuration: number,
    currentBeat: number,
    isPaused: boolean,
    tempo: number,
    onBeat: { (callback: BeatCallback): void }
    onFinish: { (callback: VoidCallback): void }
    isFading: boolean,
}

const wait = async (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

const playNote = (soundDeck: AbstractSoundDeck, { note: pitch, beats }: StaveNote, instrument: Instrument, volume = 1, tempo = 2): SoundControl | null => {
    if (!pitch) {
        return null
    }

    if (instrument.soundType === 'noise') {
        return soundDeck.playNoise({
            ...instrument,
            volume: (instrument.volume ?? 1) * volume,
            endFrequency: undefined,
            frequency: pitch.pitch,
            duration: beats / tempo,
        })
    }

    return soundDeck.playTone({
        ...instrument,
        volume: (instrument.volume ?? 1) * volume,
        endFrequency: undefined,
        frequency: pitch.pitch,
        duration: beats / tempo,
    })
}


type PlayState = {
    aborted: boolean;
    currentBeat: number;
    paused: boolean;
    tempo: number;
    volume: number;
    fadeRate?: number;
}

const getQuarterBeatInSeconds = (tempo: number) => .25 / tempo

export const playMusic = (soundDeck: AbstractSoundDeck) => (staves: Stave[], tempo = 2, loop = false): MusicControl => {
    const playState: PlayState = { aborted: false, currentBeat: 0, paused: false, tempo, volume: 1, fadeRate: undefined };
    const enhancedStaves = staves.map(stave => new EnhancedStave(stave.instrument, stave.notes, stave.volume))
    const musicDuration = Math.max(...enhancedStaves.map(s => s.duration))
    const eventTarget = new EventTarget()

    const stop = () => {
        playState.aborted = true
        eventTarget.dispatchEvent(new Event('stopped'))
    }

    const pause = () => {
        playState.paused = true
        return playState.currentBeat
    }

    const resume = () => {
        if (!playState.paused) {
            return
        }
        playState.paused = false
        eventTarget.dispatchEvent(new Event('resumed'))
    }

    const fadeOut = (seconds: number) => {
        const validatedSeconds = Math.max(0.1, seconds);
        const quarterBeatDuration = getQuarterBeatInSeconds(playState.tempo)
        const quartsBeatsToFadeOutOver = Math.ceil( validatedSeconds / quarterBeatDuration)
        playState.fadeRate = 1 / quartsBeatsToFadeOutOver
    }

    // TO DO - keep a proper array of callbacks
    const subscribeToBeat = ((callback: BeatCallback) => {
        eventTarget.addEventListener('metronome', (event) => {
            if (!(event instanceof MessageEvent)) {
                return
            }
            const { data } = event
            if (typeof data !== 'number') {
                return
            }
            callback(data)
        })

    })

    const subscribeToFinish = ((callback: VoidCallback) => {
        eventTarget.addEventListener('finished', () => {
            callback()
        })
    })

    const playUntil = new Promise<boolean>((resolve) => {
        const nextQuarterBeat = async (time: number): Promise<void> => {
            if (playState.paused || playState.aborted) {
                return
            }
            if (playState.currentBeat % 1 === 0) {
                eventTarget.dispatchEvent(new MessageEvent<number>('metronome', { data: playState.currentBeat }))
            }

            if (playState.volume <= 0) {
                eventTarget.dispatchEvent(new Event('finished'))
                resolve(true)
                return
            }

            if (playState.currentBeat >= musicDuration) {
                if (loop) {
                    playState.currentBeat = 0
                    return nextQuarterBeat(playState.currentBeat)
                }
                eventTarget.dispatchEvent(new Event('finished'))
                resolve(true)
                return
            }

            enhancedStaves
                .flatMap(stave => [stave.indexedNotes.get(time)]
                    .map(note => note ? playNote(soundDeck, note, stave.instrument, (stave.volume ?? 1) * playState.volume, tempo) : null)
                )

            if (playState.fadeRate) {
                playState.volume -= playState.fadeRate
            }
            await wait(getQuarterBeatInSeconds(playState.tempo))
            playState.currentBeat = time + .25
            return nextQuarterBeat(playState.currentBeat)
        }

        eventTarget.addEventListener('stopped', () => {
            resolve(false)
        }, { once: true })

        eventTarget.addEventListener('resumed', () => {
            nextQuarterBeat(playState.currentBeat)
        })

        nextQuarterBeat(0)
    })

    return {
        whenEnded: playUntil,
        stop,
        pause,
        resume,
        fadeOut,
        get musicDuration() { return musicDuration },
        get currentBeat() { return playState.currentBeat },
        get isPaused() { return playState.paused },
        get isFading() { return !!playState.fadeRate },
        onBeat: subscribeToBeat,
        onFinish: subscribeToFinish,
        get tempo() {
            return playState.tempo
        },
        set tempo(value: number) {
            playState.tempo = Math.max(1, value)
        }
    }
}
