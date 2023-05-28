import { createContext } from 'react'
import { SoundDeck } from 'sound-deck'

export const SoundDeckContext = createContext(new SoundDeck())