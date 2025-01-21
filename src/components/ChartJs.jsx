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
import zoomPlugin from "chartjs-plugin-zoom";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dragDataPlugin from "chartjs-plugin-dragdata";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    TimeScale,
    Tooltip,
    zoomPlugin,
    dragDataPlugin,
    ChartDataLabels
);

const ChartJs = () => {
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

    // Get min and max dates
    const allDates = data.flatMap((task) => [
        new Date(task.startDate),
        new Date(task.endDate),
    ]);
    const minDate = Math.min(...allDates); // Earliest date in the dataset
    const maxDate = Math.max(...allDates); // Latest date in the dataset

    console.log(
        "calc data",
        data.map((task) => ({
            x: [new Date(task.startDate), new Date(task.endDate)], // Define range
            y: task.name,
        }))
    );
    // Prepare the dataset with start and end date positions
    const chartData = {
        labels: data.map((task) => task.name),
        datasets: [
            {
                label: "Tasks",
                data: data.map((task) => ({
                    x: [new Date(task.startDate), new Date(task.endDate)], // Define range
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
                type: "time", // Use time scale for the x-axis
                time: {
                    unit: "year",
                },
                title: {
                    display: true,
                    text: "Date",
                },
                min: minDate, // Dynamically set min based on data
                max: maxDate, // Dynamically set max based on data
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
                    onPan: () => {
                        console.log("Panning...");
                    },
                },
                zoom: {
                    wheel: {
                        enabled: true, // Enable zooming with the mouse wheel
                    },
                    mode: "x", // Zoom only on the x-axis
                    onZoom: () => {
                        console.log("Zooming...");
                    },
                },
            },
            dragData: {
                dragX: true,
                showTooltip: true,
                onDragStart: (event, dataset, index, value) => {
                    console.log("Drag started", event, dataset, index, value);
                    // Temporarily disable zoom/pan
                    chartOptions.plugins.zoom.pan.enabled = false;
                    chartOptions.plugins.zoom.zoom.wheel.enabled = false;
                },
                onDrag: (event, dataset, index, value) => {
                    console.log("Dragging", event, dataset, index, value);
                },
                onDragEnd: (event, dataset, index, value) => {
                    console.log("Drag ended", event, dataset, index, value);
                    // Re-enable zoom/pan
                    chartOptions.plugins.zoom.pan.enabled = true;
                    chartOptions.plugins.zoom.zoom.wheel.enabled = true;
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
