import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";

const ReactVis = () => {
    const [data, setData] = useState([
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
            color: "#071d49",
        },
        {
            name: "Task C",
            startDate: "2025-01-07",
            endDate: "2025-01-20",
            color: "#071d49",
        },
    ]);

    // Calculate the duration for each task
    const formattedData = data.map((task) => {
        const start = new Date(task.startDate).getTime();
        const end = new Date(task.endDate).getTime();
        return {
            name: task.name,
            duration: (end - start) / (1000 * 60 * 60 * 24), // Duration in days
            color: task.color,
        };
    });

    return (
        <div style={{ padding: "20px" }}>
            <h2>Task Timeline</h2>
            <BarChart
                width={600}
                height={300}
                data={formattedData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    label={{
                        value: "Duration (Days)",
                        position: "insideBottomRight",
                        offset: -5,
                    }}
                />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#8884d8">
                    {formattedData.map((entry, index) => (
                        <cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </div>
    );
};

export default ReactVis;
