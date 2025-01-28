import styled from "styled-components";

import D3BarChart from "./components/D3BarChart";

import D3LabelReorder from "./components/D3LabelReorder";
import D3Label2 from "./components/D3Label2";

import ChartJs from "./components/ChartJs";
import ChartJsNumeric from "./components/ChartJsNumeric";
import D3LabelNumeric from "./components/D3LabelNumeric";

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
            {/* 
            <D3BarChart />
            <D3Label2 />
            <D3LabelReorder /> */}
            <D3LabelNumeric />
            <ChartJs />
            <ChartJsNumeric />
        </AppContainer>
    );
}

export default App;
