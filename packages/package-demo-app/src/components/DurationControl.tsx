interface Props {
    value: number
    change: { (newValue: number): void }
}


export const DurationControl = ({ value, change }: Props) => (
    <div>
        <label>duration</label>
        <input type="number" value={value}
            step={.1}
            onChange={e => {
                change(Number(e.target.value))
            }} />
    </div>
)