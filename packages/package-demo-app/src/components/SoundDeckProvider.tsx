import { ReactNode, createContext, useContext } from 'react'
import { SoundDeck } from 'sound-deck'

const SoundDeckContext = createContext(new SoundDeck())

export const SoundDeckProvider = ({ value, children }: { value?: SoundDeck, children: ReactNode }) => {

    const soundDeck = value || new SoundDeck()

    if (window) {
        if (!soundDeck.isEnabled) {
            window.addEventListener('click', () => {
                soundDeck.enable().then(() => {
                    console.log('enabled')
                })
            }, { once: true })
        }
    }

    return (
        <SoundDeckContext.Provider value={value || new SoundDeck()} >
            {children}
        </SoundDeckContext.Provider>
    )
}

export const useSoundDeck = () => {
    return useContext(SoundDeckContext)
}