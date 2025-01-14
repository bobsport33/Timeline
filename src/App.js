import styled from "styled-components";

import D3BarChart from "./components/D3BarChart";
import VisXBarChart from "./components/VisXBarChart";
import D3LabelReorder from "./components/D3LabelReorder";
import D3Label2 from "./components/D3Label2";
import ReactVis from "./components/ReactVis";
import Recharts from "./components/Recharts";
import MuiCharts from "./components/MuiCharts";
import ChartJs from "./components/ChartJs";

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
            {/* <h1>D3</h1> */}
            <D3BarChart />
            <D3Label2 />
            <D3LabelReorder />
            {/* <h1>VisX</h1>
            <VisXBarChart />
            <ReactVis />
            <h1>Recharts</h1>
            <Recharts />
            <h1>Chart.Js</h1>
            <ChartJs /> */}
            {/* <MuiCharts /> */}
        </AppContainer>
    );
}

export default App;
