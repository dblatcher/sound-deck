import styled from '@emotion/styled';
import { TonePlayer } from '../components/TonePlayer';
import { NoisePlayer } from '../components/NoisePlayer';


const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <h1>sound-deck demo app</h1>
      <TonePlayer/>
      <TonePlayer/>
      <NoisePlayer/>
    </StyledApp>
  );
}

export default App;
