interface Props {
    value: OscillatorType
    change: { (newValue: OscillatorType): void }
    radioName: string
}

const ocsillatorTypes: OscillatorType[] = [
    'sawtooth', 'sine', 'square', 'triangle', 'custom'
]

export const ToneTypeOptions = ({ value, change, radioName }: Props) => (

    <fieldset>
        <legend>tone type</legend>
        {ocsillatorTypes.map((name) => (
            <div key={name}>
                <label htmlFor={`${radioName}-input-${name}`}>{name}</label>
                <input id={`${radioName}-input-${name}`} type="radio" checked={value === name} name={radioName} onChange={() => { change(name) }} />
            </div>
        ))}
    </fieldset>
)