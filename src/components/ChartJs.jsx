import React, { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    TimeScale,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, TimeScale, Tooltip);

const ChartJs = () => {
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
            color: "#1a73e8",
        },
        {
            name: "Task C",
            startDate: "2025-01-07",
            endDate: "2025-01-20",
            color: "#34a853",
        },
    ]);

    // Prepare the dataset with start and end date positions
    const chartData = {
        labels: data.map((task) => task.name),
        datasets: [
            {
                label: "Tasks",
                data: data.map((task) => ({
                    x: new Date(task.startDate).getTime(),
                    x2: new Date(task.endDate).getTime(),
                    y: task.name,
                })),
                backgroundColor: data.map((task) => task.color),
                barThickness: 20,
            },
        ],
    };

    const chartOptions = {
        indexAxis: "y", // Horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "month",
                },
                title: {
                    display: true,
                    text: "Date",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Tasks",
                },
                ticks: {
                    autoSkip: false,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const { x, x2 } = context.raw;
                        const startDate = new Date(x).toLocaleDateString();
                        const endDate = new Date(x2).toLocaleDateString();
                        return `From: ${startDate} To: ${endDate}`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ height: "400px", width: "600px" }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default ChartJs;
