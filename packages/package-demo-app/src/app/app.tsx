import styled from '@emotion/styled';
import { TonePlayer } from '../components/TonePlayer';
import { SoundDeck } from 'sound-deck';
import { NoisePlayer } from '../components/NoisePlayer';
import { MasterGain } from '../components/MasterGain';
import { useState } from 'react';
import { SoundDeckProvider } from '../components/SoundDeckProvider';


const StyledApp = styled.div`
  // Your style here
  section {
   padding : .5rem;
   border: 1px solid black;
   display:flex;
   > div {
    margin-right: 2rem;
   }
  }
`;

export function App() {
  const [sharedSoundDeck] = useState(new SoundDeck())
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
          <MasterGain />
          <NoisePlayer />
        </SoundDeckProvider>

      </section>
    </StyledApp>
  );
}

export default App;
