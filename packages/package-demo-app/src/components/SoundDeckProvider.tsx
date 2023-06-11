import { ReactNode, createContext, useContext } from 'react'
import { SoundDeck } from 'sound-deck'

const SoundDeckContext = createContext(new SoundDeck())

export const AutoEnableSoundDeckProvider = ({ value, children }: { value?: SoundDeck, children: ReactNode }) => {
    const soundDeck = value || new SoundDeck()
    soundDeck.enable()
    if (window) {
        if (!soundDeck.isEnabled) {
            window.addEventListener('click', () => {
                soundDeck.enable()
            }, { once: true })
        }
    }
    return (
        <SoundDeckContext.Provider value={soundDeck} >
            {children}
        </SoundDeckContext.Provider>
    )
}

export const SoundDeckProvider = ({ value, children }: { value?: SoundDeck, children: ReactNode }) => {
    const soundDeck = value || new SoundDeck()
    return (
        <SoundDeckContext.Provider value={soundDeck} >
            {children}
        </SoundDeckContext.Provider>
    )
}

export const useSoundDeck = () => {
    return useContext(SoundDeckContext)
}