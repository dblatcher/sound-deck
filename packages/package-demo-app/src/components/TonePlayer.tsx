
import { useState } from "react"
import { SoundControl, SoundDeck } from "sound-deck"

export const TonePlayer = () => {
    const [soundDeck] = useState(new SoundDeck())
    const [tone, setTone] = useState<SoundControl | null>(null)
    const [frequency, setFrequency] = useState(500)
    const [endFrequency, setEndFrequency] = useState(600)
    const [duration, setDuration] = useState(2)
    const [toneType, setToneType] = useState<OscillatorType>('sawtooth')

    const playTone = () => {
        if (tone) {
            return
        }
        const newTone = soundDeck.playTone({ frequency, endFrequency, duration, type: toneType })
        setTone(newTone)
        if (newTone) {
            newTone.whenEnded.then(() => {
                setTone(null)
            })
        }
    }

    return (
        <div>
            <h2>TonePlayer</h2>
            <div>
                <label>duration</label>
                <input type="number" value={duration}
                    step={.1}
                    onChange={e => {
                        setDuration(Number(e.target.value))
                    }} />
            </div>
            <div>
                <label>start frequency</label>
                <input type="range"
                    value={frequency}
                    step={20}
                    min={100}
                    max={3000}
                    onChange={e => {
                        setFrequency(Number(e.target.value))
                    }} />
                <label>{frequency}</label>
            </div>
            <div>
                <label>end frequency</label>
                <input type="range"
                    value={endFrequency}
                    step={20}
                    min={100}
                    max={3000}
                    onChange={e => {
                        setEndFrequency(Number(e.target.value))
                    }} />
                <label>{endFrequency}</label>
            </div>

            <fieldset>
                <legend>tone type</legend>
                <label>sawtooth</label>
                <input type="radio" checked={toneType === 'sawtooth'} name="toneType" onChange={() => { setToneType('sawtooth') }} />
                <label>sine</label>
                <input type="radio" checked={toneType === 'sine'} name="toneType" onChange={() => { setToneType('sine') }}/>
                <label>square</label>
                <input type="radio" checked={toneType === 'square'} name="toneType" onChange={() => { setToneType('square') }}/>
                <label>triangle</label>
                <input type="radio" checked={toneType === 'triangle'} name="toneType" onChange={() => { setToneType('triangle') }}/>
            </fieldset>

            <div>
                <button onClick={playTone} disabled={!!tone}>play tone</button>
                {tone && (
                    <span>tone is playing</span>
                )}
            </div>
        </div >
    )
}