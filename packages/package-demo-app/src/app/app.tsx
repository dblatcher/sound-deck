import styled from '@emotion/styled';
import { TonePlayer } from '../components/TonePlayer';
import { SoundDeck, waveTables } from 'sound-deck';
import { NoisePlayer } from '../components/NoisePlayer';
import { MasterGain } from '../components/MasterGain';
import { useState } from 'react';
import { AutoEnableSoundDeckProvider, SoundDeckProvider } from '../components/SoundDeckProvider';
import { SamplePlayer } from '../components/SamplePlayer';
import { EnableToggle } from '../components/EnableToggle';
import { NotePlayer } from '../components/NotePlayer';


const StyledApp = styled.div`
  // Your style here
  section {
   padding : .5rem;
   border: 1px solid black;
   display:flex;
   flex-wrap: wrap;
   > div {
    margin-right: 2rem;
   }
  }
`;

export function App() {
  const [sharedSoundDeck] = useState(new SoundDeck())
  const [sharedSoundDeck2] = useState(new SoundDeck())

  sharedSoundDeck.defineCustomWaveForm('organ', waveTables.organ.real, waveTables.organ.imag)
  sharedSoundDeck.defineCustomWaveForm('airhorn', waveTables.airHorn.real, waveTables.airHorn.imag)

  return (
    <StyledApp>
      <h1>sound-deck demo app</h1>

      <h2>Private contexts</h2>
      <section>
        <TonePlayer />
        <TonePlayer />
        <NoisePlayer />
      </section>

      <h2>using context to share a sound deck</h2>
      <section>
        <SoundDeckProvider value={sharedSoundDeck}>
          <EnableToggle />
          <MasterGain />
          <NoisePlayer />
          <TonePlayer />
          <SamplePlayer src='/assets/beep.mp3' />
          <SamplePlayer src='/assets/beep.mp3' attemptAutoEnable />
        </SoundDeckProvider>
      </section>

      <h2>using an auto-enabling context to share a sound deck </h2>
      <section>
        <AutoEnableSoundDeckProvider value={sharedSoundDeck2}>
          <EnableToggle />
          <MasterGain />
          <NoisePlayer />
          <TonePlayer />
          <SamplePlayer src='/assets/beep.mp3' />
          <SamplePlayer src='/assets/beep.mp3' attemptAutoEnable />

          <NotePlayer octive={4} note='C' />
          <NotePlayer octive={5} note='E' />
          <NotePlayer octive={5} note='G' />
        </AutoEnableSoundDeckProvider>
      </section>
    </StyledApp>
  );
}

export default App;
