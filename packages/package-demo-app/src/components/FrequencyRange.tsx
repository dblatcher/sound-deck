
interface Props {
    value: number;
    change: { (newValue: number): void };
    label: string;
}

export const FrequencyRange = ({ value, change, label }: Props) => (
    <div>
        <label>{label}</label>
        <input type="range"
            value={value}
            step={20}
            min={100}
            max={3000}
            onChange={e => {
                change(Number(e.target.value))
            }} />
        <label>{value}</label>
    </div>
)