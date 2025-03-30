import styled from '@emotion/styled';
import { TonePlayer } from '../components/TonePlayer';
import { LegacySoundDeck, SoundDeck } from 'sound-deck';
import { NoisePlayer } from '../components/NoisePlayer';
import { MasterGain } from '../components/MasterGain';
import { useState } from 'react';
import { AutoEnableSoundDeckProvider, SoundDeckProvider } from '../components/SoundDeckProvider';
import { SamplePlayer } from '../components/SamplePlayer';
import { EnableToggle } from '../components/EnableToggle';
import { NotePlayer } from '../components/NotePlayer';
import { PresetPlayer } from '../components/PresetPlayer';
import { waveTables } from '../customWaves';


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

  fieldset {
    > ul {
      margin: 0;
      list-style: none;
      padding-inline-start: 10px;
    }
  }

`;

export function App() {
  const [sharedSoundDeck] = useState(new SoundDeck())
  const [autoEnabledSharedDeck] = useState(new SoundDeck())
  const [legacyDeck] = useState(new LegacySoundDeck())

  sharedSoundDeck.defineCustomWaveForm('organ', waveTables.organ.real, waveTables.organ.imag)
  sharedSoundDeck.defineCustomWaveForm('airhorn', waveTables.airHorn.real, waveTables.airHorn.imag)

  return (
    <StyledApp>
      <h1>sound-deck demo app</h1>

      <h2>default contexts</h2>
      <section>
        <EnableToggle />
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
          <SamplePlayer src='/assets/birds-short.mp3' />
          <SamplePlayer src='/assets/beep.mp3' attemptAutoEnable />
          <NotePlayer octive={4} note='C' />
          <NotePlayer octive={5} note='E' />
          <NotePlayer octive={5} note='G' />
          <PresetPlayer />
        </SoundDeckProvider>
      </section>

      <h2>using an auto-enabling context </h2>
      <section>
        <AutoEnableSoundDeckProvider value={autoEnabledSharedDeck}>
          <EnableToggle />
          <MasterGain />
          <NoisePlayer />
          <TonePlayer />
          <SamplePlayer src='/assets/beep.mp3' />
        </AutoEnableSoundDeckProvider>
      </section>
      <h2>Legacy sound deck </h2>
      <section>
        <SoundDeckProvider value={legacyDeck}>
          <EnableToggle />
          <MasterGain />
          <NoisePlayer />
          <TonePlayer />
          <SamplePlayer src='/assets/beep.mp3' />
          <SamplePlayer src='/assets/beep.mp3' attemptAutoEnable />
        </SoundDeckProvider>
      </section>
    </StyledApp>
  );
}

export default App;
