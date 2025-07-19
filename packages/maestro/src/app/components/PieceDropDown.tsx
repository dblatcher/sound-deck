import { ChangeEventHandler } from "react"
import { Piece, pieces } from "../lib/songs"
import { controlBorder } from "../lib/styles"

interface Props {
    setPiece: { (piece: Piece): void }
}

export const PieceDropDown = ({ setPiece }: Props) => {

    const pickNewPiece: ChangeEventHandler<HTMLSelectElement> = ({ target: { value: indexString } }) => {
        const index = Number(indexString)
        const piece = pieces[index];
        if (!piece) {
            return
        }
        setPiece(piece)
    }

    return (
        <label css={controlBorder}>
            <span>song</span>
            <select onChange={pickNewPiece}>
                {pieces.map((piece, index) => <option key={index} value={index} >{piece.title}</option>)}
            </select>
        </label>
    )
}