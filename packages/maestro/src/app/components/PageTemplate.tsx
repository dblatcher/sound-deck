import { FunctionComponent, ReactNode } from "react";

const GITHUB_LINK = "https://github.com/dblatcher/sound-deck/tree/main/packages/sound-deck-core"


export const PageTemplate: FunctionComponent<{ children: ReactNode }> = ({ children }) => {


    return <>
        <header>
            <h1>Maestro</h1>
            <div>
                <em>programmatic music generator using <a href={GITHUB_LINK}>sound-deck</a></em>
            </div>
        </header>

        <main>
            {children}
        </main>

        <footer>
            <span>
                Interested in using programmatic music in your project? See {' '}
                <a href={GITHUB_LINK}>the SoundDeck library on github</a>
            </span>
        </footer>
    </>

}