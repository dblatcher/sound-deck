import { useSoundDeck } from "./SoundDeckProvider"

interface Props {
    value: string | undefined
    change: { (newValue: string | undefined): void }
    radioName: string
}



export const CustomWaveOptions = ({ value, change, radioName }: Props) => {
    const soundDeck = useSoundDeck()

    const options: string[] = [];
    soundDeck.customWaveforms.forEach((_, key) => options.push(key))

    return (
        <fieldset>
            <legend>Custom Waves</legend>
            <div key={'undefined'}>
                <label htmlFor={`${radioName}-input-undefined`}>none</label>
                <input id={`${radioName}-input-undefined`} type="radio" checked={value === undefined} name={radioName} onChange={() => { change(undefined) }} />
            </div>
            {options.map((name) => (
                <div key={name}>
                    <label htmlFor={`${radioName}-input-${name}`}>{name}</label>
                    <input id={`${radioName}-input-${name}`} type="radio" checked={value === name} name={radioName} onChange={() => { change(name) }} />
                </div>
            ))}
        </fieldset>
    )
}