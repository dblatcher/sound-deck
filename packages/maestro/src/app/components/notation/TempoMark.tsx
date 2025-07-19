interface Props {
    tempo: number
}

export const TempoMark = ({ tempo }: Props) => {

    return (
        <svg viewBox="0 0 80 30" css={{ width: 80, height:30 }} stroke="black" preserveAspectRatio="none">
            <ellipse
                rx={5}
                ry={3}
                cx={12}
                cy={24}
                fill='black'
            ></ellipse>
            <line
                x1={12 + 5}
                y1={24}
                x2={12 + 5}
                y2={24 - 22}
            ></line>
            <text fontSize={10} x={25} y={24} >= {tempo * 15}</text>
        </svg>
    )
}