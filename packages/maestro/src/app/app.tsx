import styled from '@emotion/styled';
import { MaestroBase } from './components/MaestroBase';
import { AutoEnableSoundDeckProvider } from './context/SoundDeckProvider';


const StyledApp = styled.div`
  font-family: Verdana, Geneva, Tahoma, sans-serif;

  header, footer, main {
    padding-left: 12px;
    padding-right: 12px;
  }
  header {
    background: repeating-linear-gradient(120deg, antiquewhite 00% 40%, transparent 100%);
    padding-top: 12px;
    padding-bottom: 12px;
    margin-bottom:8px;
    }
    footer {
      background-color: antiquewhite;
      padding-top: 24px;
      padding-bottom: 24px;
      margin-top:8px;
  }
  
  h1 {
    margin: 0;
  }
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
