import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const DraggableBar = ({
    name,
    index,
    moveItem,
    handleLabelChange,
    handleColorChange,
    color,
    handleDateChange,
    startDate,
    endDate,
}) => {
    const inputRef = useRef(); // Create a ref to the input element

    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", index);
    };

    const handleDrop = (e) => {
        const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
        const toIndex = index;
        if (fromIndex !== toIndex) {
            moveItem(fromIndex, toIndex);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow drop
    };

    const handleInputChange = (e) => {
        handleLabelChange(index, e.target.value);
    };

    const handleColorInputChange = (e) => {
        handleColorChange(index, e.target.value);
    };

    const handleStartDateChange = (e) => {
        handleDateChange(index, "start", e.target.value);
    };

    const handleEndDateChange = (e) => {
        handleDateChange(index, "end", e.target.value);
    };

    // Focus the input when it is mounted or updated
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [name]); // Focus when the name changes

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
                cursor: "grab",
                backgroundColor: "#071d49",
                color: "white",
                padding: "8px",
                margin: "4px 0",
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <DragIndicatorIcon />
            <input
                ref={inputRef} // Attach the ref to the input
                value={name}
                onChange={handleInputChange}
                style={{
                    border: "none",
                    backgroundColor: "transparent",
                    color: "white",
                }}
            />
            <input
                type="color"
                value={color}
                onChange={handleColorInputChange}
                style={{ marginLeft: "8px" }}
            />
            <div style={{ marginTop: "8px" }}>
                <label>Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    style={{ marginLeft: "8px" }}
                />
                <label style={{ marginLeft: "8px" }}>End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    style={{ marginLeft: "8px" }}
                />
            </div>
        </div>
    );
};

const D3LabelReorder = () => {
    const chartRef = useRef();
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

    const moveItem = (fromIndex, toIndex) => {
        const updatedData = [...data];
        const [movedItem] = updatedData.splice(fromIndex, 1);
        updatedData.splice(toIndex, 0, movedItem);
        setData(updatedData);
    };

    const handleLabelChange = (index, newName) => {
        const updatedData = [...data];
        updatedData[index].name = newName;
        setData(updatedData);
    };

    const handleColorChange = (index, newColor) => {
        const updatedData = [...data];
        updatedData[index].color = newColor;
        setData(updatedData);
    };

    const handleDateChange = (index, type, newDate) => {
        const updatedData = [...data];
        updatedData[index][type === "start" ? "startDate" : "endDate"] =
            newDate;
        setData(updatedData);
    };

    useEffect(() => {
        // Clear the chart area
        d3.select(chartRef.current).selectAll("*").remove();

        // Set dimensions and margins
        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 60 };

        // Create SVG
        const svg = d3
            .select(chartRef.current)
            .attr("width", width)
            .attr("height", height);

        // Calculate the x-axis scale
        const x = d3
            .scaleTime()
            .domain([
                d3.min(data, (d) => new Date(d.startDate)),
                d3.max(data, (d) => new Date(d.endDate)),
            ])
            .range([margin.left, width - margin.right]);

        // Calculate the y-axis scale
        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([margin.top, height - margin.bottom])
            .padding(0.1);

        // Determine the tick interval dynamically
        const dateRange = x.domain();
        const diffInDays =
            (dateRange[1] - dateRange[0]) / (1000 * 60 * 60 * 24); // Difference in days

        let tickInterval;
        if (diffInDays <= 10) {
            tickInterval = d3.timeDay.every(1); // Daily ticks
        } else if (diffInDays <= 30) {
            tickInterval = d3.timeDay.every(5); // Every 5 days
        } else if (diffInDays <= 365) {
            tickInterval = d3.timeMonth.every(1); // Monthly ticks
        } else {
            tickInterval = d3.timeYear.every(1); // Yearly ticks
        }

        // Draw bars
        svg.append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", (d) => x(new Date(d.startDate)))
            .attr("y", (d) => y(d.name))
            .attr(
                "width",
                (d) => x(new Date(d.endDate)) - x(new Date(d.startDate))
            )
            .attr("height", y.bandwidth())
            .attr("fill", (d) => d.color);

        // Add or update X axis with a dynamic tick interval
        const xAxis = d3.axisBottom(x).ticks(tickInterval);

        const xAxisGroup = svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`);

        xAxisGroup
            .transition()
            .duration(750) // Smooth transition
            .call(xAxis);

        // Add Y axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
    }, [data]);

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Drag-and-Drop List */}
            <div>
                {data.map((item, index) => (
                    <DraggableBar
                        key={item.name}
                        name={item.name}
                        index={index}
                        moveItem={moveItem}
                        handleLabelChange={handleLabelChange}
                        handleColorChange={handleColorChange}
                        color={item.color}
                        startDate={item.startDate}
                        endDate={item.endDate}
                        handleDateChange={handleDateChange}
                    />
                ))}
            </div>

            {/* D3 Timeline Chart */}
            <svg ref={chartRef}></svg>
        </div>
    );
};

export default D3LabelReorder;
