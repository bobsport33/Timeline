import styled from "styled-components";

import ChartJs from "./components/ChartJs";
import ChartJsNumeric from "./components/ChartJsNumeric";

import D3Timeline from "./components/D3/D3Timeline";

const AppContainer = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
`;

function App() {
    return (
        <AppContainer className="App">
            <h1>Timeline</h1>

            <D3Timeline />
            <ChartJs />
            <ChartJsNumeric />
        </AppContainer>
    );
}

export default App;
