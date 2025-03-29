export const VolumeSymbol = ({ on }: { on: boolean }) => (
    <span style={{ width: '1.5rem', display:'inline-block' }}>{on ? "🔊" : "🔈"}</span>
)