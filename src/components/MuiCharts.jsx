import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const MuiCharts = () => {
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
            color: "#071d49",
        },
        {
            name: "Task C",
            startDate: "2025-01-07",
            endDate: "2025-01-20",
            color: "#071d49",
        },
    ]);

    // Format dates into a time range and calculate the duration in days
    const chartData = data.map((task) => ({
        label: task.name,
        startTime: new Date(task.startDate).getTime(), // Convert startDate to timestamp
        endTime: new Date(task.endDate).getTime(), // Convert endDate to timestamp
        color: task.color,
    }));

    const minDate = Math.min(...chartData.map((item) => item.startTime));
    const maxDate = Math.max(...chartData.map((item) => item.endTime));

    return (
        <div style={{ height: 400, width: "100%" }}>
            <BarChart
                xAxis={[
                    {
                        id: "time",
                        scaleType: "time", // Time scale for x-axis
                        label: "Timeline",
                        domain: [minDate, maxDate], // Set domain to fit the range of all dates
                    },
                ]}
                yAxis={[
                    {
                        id: "tasks",
                        scaleType: "band",
                        label: "Tasks",
                    },
                ]}
                series={[
                    {
                        id: "tasks",
                        data: chartData.map((item) => ({
                            x0: item.startTime,
                            x1: item.endTime, // The bar will stretch from startTime to endTime
                            label: item.label,
                        })),
                        label: "Tasks",
                        color: chartData[0].color, // Set bar color (if desired)
                    },
                ]}
                yLabels={chartData.map((item) => item.label)} // Task labels on the y-axis
                horizontal
            />
        </div>
    );
};

export default MuiCharts;
