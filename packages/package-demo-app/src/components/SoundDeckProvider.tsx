import { AbstractSoundDeck } from 'packages/sound-deck-core/src/lib/AbstractSoundDeck'
import { ReactNode, createContext, useContext } from 'react'
import { SoundDeck } from 'sound-deck'

const SoundDeckContext = createContext<AbstractSoundDeck>(new SoundDeck())

export const AutoEnableSoundDeckProvider = ({ value, children }: { value?: AbstractSoundDeck, children: ReactNode }) => {
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

export const SoundDeckProvider = ({ value, children }: { value?: AbstractSoundDeck, children: ReactNode }) => {
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