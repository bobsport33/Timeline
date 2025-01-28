import React, { useState, useRef } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dragDataPlugin from "chartjs-plugin-dragdata";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    zoomPlugin,
    dragDataPlugin,
    ChartDataLabels
);

const ChartJsNumeric = () => {
    const chartRef = useRef(null);
    const [data] = useState([
        {
            name: "Task A",
            startDate: "2010-01-01",
            endDate: "2025-01-10",
            color: "#071d49",
        },
        {
            name: "Task B",
            startDate: "2015-01-05",
            endDate: "2025-01-15",
            color: "#1a73e8",
        },
        {
            name: "Task C",
            startDate: "2020-01-07",
            endDate: "2030-01-20",
            color: "#34a853",
        },
    ]);

    // Extract years for min and max
    const allYears = data.flatMap((task) => [
        new Date(task.startDate).getFullYear(),
        new Date(task.endDate).getFullYear(),
    ]);
    const minYear = Math.min(...allYears); // Earliest year
    const maxYear = Math.max(...allYears); // Latest year

    // Prepare the dataset with start and end year positions
    const chartData = {
        labels: data.map((task) => task.name),
        datasets: [
            {
                label: "Tasks",
                data: data.map((task) => ({
                    x: [
                        new Date(task.startDate).getFullYear(),
                        new Date(task.endDate).getFullYear(),
                    ], // Year range
                    y: task.name,
                })),
                backgroundColor: data.map((task) => task.color),
                borderColor: "black",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        indexAxis: "y", // Horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "linear", // Use linear scale for numeric years
                title: {
                    display: true,
                    text: "Year",
                },
                min: minYear, // Dynamically set min based on years
                max: maxYear, // Dynamically set max based on years
                ticks: {
                    stepSize: 1, // Ensure ticks increment by 1 year
                    callback: (value) => Math.floor(value), // Display only whole numbers
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
            datalabels: {
                align: "center", // Center align the labels on the bar
                anchor: "center", // Anchor the label in the middle of the bar
                color: "white", // Adjust text color for readability
                formatter: (value, context) =>
                    context.chart.data.labels[context.dataIndex],
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: "x", // Pan only on the x-axis
                },
                zoom: {
                    wheel: {
                        enabled: true, // Enable zooming with the mouse wheel
                    },
                    mode: "x", // Zoom only on the x-axis
                },
            },
            dragData: {
                dragX: true,
                showTooltip: true,
                onDragStart: (event, dataset, index, value) => {
                    console.log("Drag started", event, dataset, index, value);
                    console.log("data value", data[dataset]);
                    // Temporarily disable zoom/pan
                    chartOptions.plugins.zoom.pan.enabled = false;
                    chartOptions.plugins.zoom.zoom.wheel.enabled = false;
                },
                onDrag: (event, dataset, index, value) => {
                    // console.log("Dragging", event, dataset, index, value);
                },
                onDragEnd: (event, dataset, index, value) => {
                    // console.log("Drag ended", event, dataset, index, value);
                    const chart = chartRef.current;

                    if (!chart) return;

                    // Convert the x-coordinate (in pixels) to a date value
                    const draggedYear = Math.floor(value.x);

                    // Log the dragged date and year
                    console.log("Dragged date:", draggedYear);

                    // Re-enable zoom/pan
                    chartOptions.plugins.zoom.pan.enabled = true;
                    chartOptions.plugins.zoom.zoom.wheel.enabled = true;
                },
            },
        },
    };

    return (
        <div style={{ height: "400px", width: "600px" }}>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
        </div>
    );
};

export default ChartJsNumeric;
