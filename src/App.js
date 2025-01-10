import styled from "styled-components";

import D3BarChart from "./components/D3BarChart";
import VisXBarChart from "./components/VisXBarChart";
import D3LabelReorder from "./components/D3LabelReorder";

const AppContainer = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

function App() {
    return (
        <AppContainer className="App">
            <D3BarChart />
            <D3LabelReorder />
            {/* <VisXBarChart /> */}
        </AppContainer>
    );
}

export default App;
