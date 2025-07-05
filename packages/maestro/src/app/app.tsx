import styled from '@emotion/styled';
import { MaestroBase } from './components/MaestroBase';
import { AutoEnableSoundDeckProvider } from './context/SoundDeckProvider';


const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <AutoEnableSoundDeckProvider >
        <MaestroBase />
      </AutoEnableSoundDeckProvider>
    </StyledApp>
  );
}

export default App;
