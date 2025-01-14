import React, { useState } from "react";
import {
    XYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    VerticalRectSeries,
    DiscreteColorLegend,
} from "react-vis";
import "react-vis/dist/style.css";

const ReactVis = () => {
    const [data] = useState([
        {
            name: "Task A",
            startDate: "2025-01-01",
            endDate: "2025-01-10",
            color: "#071d49",
        },
        {
            name: "Task B",
            startDate: "2025-01-05",
            endDate: "2025-01-15",
            color: "#0a3e75",
        },
        {
            name: "Task C",
            startDate: "2025-01-07",
            endDate: "2025-01-20",
            color: "#144aa5",
        },
    ]);

    // Format data for react-vis
    const formattedData = data.map((task, index) => {
        const start = new Date(task.startDate).getTime();
        const end = new Date(task.endDate).getTime();
        return {
            x0: start,
            x: end,
            y0: index - 0.4,
            y: index + 0.4,
            color: task.color,
        };
    });

    // Map task names for the legend
    const legendItems = data.map((task) => ({
        title: task.name,
        color: task.color,
    }));

    // Ensure no empty data array
    if (!data || data.length === 0) {
        return <div>No data available for the chart</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Task Timeline</h2>
            <XYPlot
                width={600}
                height={300}
                xType="time"
                yDomain={[-1, data.length]} // Ensure tasks are properly spaced
                margin={{ left: 100 }}
            >
                <HorizontalGridLines />
                <XAxis title="Date" />
                <YAxis
                    tickFormat={(value) => {
                        // Safely access data[value]
                        return data[value]?.name || "";
                    }}
                />
                <VerticalRectSeries
                    data={formattedData}
                    colorType="literal" // Use individual colors for bars
                    style={{ stroke: "white", strokeWidth: 1 }}
                />
            </XYPlot>
            <DiscreteColorLegend orientation="horizontal" items={legendItems} />
        </div>
    );
};

export default ReactVis;
