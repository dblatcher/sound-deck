import { FunctionComponent } from "react"
import { PlayPattern, PlayPatternStep } from "sound-deck"


interface Props {
    pattern: PlayPattern
    setPattern: { (pattern: PlayPattern): void }
}

const nextTime = (pattern: PlayPattern) => pattern.length === 0 ? 0 : pattern.reduce<number>((prev, current) => { return Math.max(prev, current.time) }, 0) + 0.1

export const PlayPatternControl: FunctionComponent<Props> = ({ pattern, setPattern }) => {

    const addNewStep = () => setPattern([...pattern, { time: nextTime(pattern), vol: 1 }])
    const deleteStep = (index: number) => () => { setPattern([...pattern.slice(0, index), ...pattern.slice(index + 1)]) }

    const changeStep = (index: number, mod: Partial<PlayPatternStep>) => {
        const newStep = { ...pattern[index], ...mod }
        setPattern([...pattern.slice(0, index), newStep, ...pattern.slice(index + 1)])
    }

    const sortSteps = () => setPattern([...pattern].sort((a, b) => a.time - b.time))

    return <fieldset>
        <legend>Pattern</legend>
        <ul>
            {pattern.map((step, index) => (
                <li key={index}
                    style={{
                        display: 'flex',
                        gap: 5
                    }}
                >
                    <label>
                        <span>T: </span>
                        <input onChange={event => changeStep(index, { time: Number(event.target.value) })} value={step.time} type="number" min={0} max={1} step={.1} />
                    </label>
                    <label>
                        <span>vol: </span>
                        <input onChange={event => changeStep(index, { vol: Number(event.target.value) })} value={step.vol} type="number" min={0} max={1} step={.1} />
                    </label>
                    <button onClick={deleteStep(index)}>x</button>
                </li>
            ))}
        </ul>
        <button onClick={addNewStep}>+</button>
        <button onClick={sortSteps}>sort</button>
    </fieldset>

}