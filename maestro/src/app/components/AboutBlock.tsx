import { controlBorder } from "../lib/styles"


export const AboutBlock = () => {

    return (
        <details css={controlBorder}> 
            <summary css={{ cursor: 'pointer' }}>About Maestro</summary>
            <div>
                <p>Maestro is a utility for writing strings describing musical notes, seeing them rendered as sheet music and listening to them live.</p>
                <p>The strings can be used in your javascript projects and played on demand using the sound-deck library as a low-space alternative to audio files.</p>
            </div>
        </details>
    )
}