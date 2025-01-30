import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import Menu from "./Menu";

const DraggableBar = ({
    name,
    index,
    moveItem,
    handleLabelChange,

    color,
    handleDateChange,
    startDate,
    endDate,
}) => {
    const inputRef = useRef();

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

    const handleDragOver = (e) => e.preventDefault();

    const handleStartDateChange = (e) =>
        handleDateChange(index, "start", e.target.value);

    const handleEndDateChange = (e) =>
        handleDateChange(index, "end", e.target.value);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [name]);

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
            }}
        >
            <DragIndicatorIcon />
            <h6>{name}</h6>
        </div>
    );
};

const D3LabelNumeric = () => {
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
            startDate: "2015-01-05",
            endDate: "2025-01-15",
            color: "#071d49",
        },
        {
            name: "Task C",
            startDate: "2010-01-07",
            endDate: "2020-01-20",
            color: "#071d49",
        },
    ]);

    const allYears = data.flatMap((task) => [
        new Date(task.startDate).getFullYear(),
        new Date(task.endDate).getFullYear(),
    ]);
    const minYear = Math.min(...allYears);
    const maxYear = Math.max(...allYears);

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

    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        selectedBar: null,
    });

    // const handleRightClick = (event, d) => {
    //     event.preventDefault(); // Prevent the default context menu

    //     setContextMenu({
    //         visible: true,
    //         x: event.clientX,
    //         y: event.clientY,
    //         selectedBar: d,
    //     });
    // };

    // const handleCloseMenu = () => {
    //     setContextMenu(null);
    // };

    useEffect(() => {
        d3.select(chartRef.current).selectAll("*").remove();

        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 30, bottom: 40, left: 60 };

        const svg = d3
            .select(chartRef.current)
            .attr("width", width)
            .attr("height", height);

        const x = d3
            .scaleLinear()
            .domain([minYear, maxYear])
            .range([margin.left, width - margin.right]);

        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([margin.top, height - margin.bottom])
            .padding(0.1);

        // Add zoom functionality
        const zoom = d3
            .zoom()
            .scaleExtent([1, 10])
            .translateExtent([
                [margin.left, 0],
                [width - margin.right, height],
            ])
            .on("zoom", (event) => {
                const transform = event.transform;
                const newX = transform.rescaleX(x);

                xAxisGroup.call(xAxis.scale(newX));

                bars.attr("x", (d) =>
                    Math.max(
                        margin.left,
                        newX(new Date(d.startDate).getFullYear())
                    )
                ).attr("width", (d) =>
                    Math.max(
                        0,
                        newX(new Date(d.endDate).getFullYear()) -
                            newX(new Date(d.startDate).getFullYear())
                    )
                );

                labels
                    .attr("x", (d) =>
                        Math.max(
                            margin.left,
                            (newX(new Date(d.startDate).getFullYear()) +
                                newX(new Date(d.endDate).getFullYear())) /
                                2
                        )
                    )
                    .text((d) => d.name);

                // Update start handles
                d3.selectAll("circle.start-handle").attr("cx", (d) =>
                    Math.max(
                        margin.left,
                        newX(new Date(d.startDate).getFullYear())
                    )
                );

                // Update end handles
                d3.selectAll("circle.end-handle").attr("cx", (d) =>
                    Math.max(
                        margin.left,
                        newX(new Date(d.endDate).getFullYear())
                    )
                );
            });

        svg.call(zoom);

        const bars = svg
            .append("g")
            .attr("clip-path", "url(#clip)")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", (d) => x(new Date(d.startDate).getFullYear()))
            .attr("y", (d) => y(d.name))
            .attr("id", (d) => d.name)
            .attr(
                "width",
                (d) =>
                    x(new Date(d.endDate).getFullYear()) -
                    x(new Date(d.startDate).getFullYear())
            )
            .attr("height", y.bandwidth())
            .on("contextmenu", (event, d) => {
                event.preventDefault(); // Prevent the default right-click menu
                setMenu({
                    visible: true,
                    x: event.clientX,
                    y: event.clientY,
                    selectedBar: d,
                });
            })
            .attr("fill", (d) => d.color)
            .style("transition", "x 0.5s, width 0.5s");

        const dragHandleRadius = 6;

        const dragStartHandle = d3
            .drag()
            .on("start", (event, d) => {
                event.sourceEvent.stopPropagation(); // Prevent zooming while dragging
            })
            .on("drag", (event, d) => {
                const [mouseX] = d3.pointer(event, svg.node()); // Get correct X in SVG space
                const newStartYear = Math.floor(x.invert(mouseX)); // Convert back to data space

                console.log({
                    mouseX,
                    mouseXAdjusted: mouseX - dragHandleRadius,
                    invertedYear: x.invert(mouseX),
                    roundedYear: Math.round(x.invert(mouseX)),
                });

                // TODO: Mouse is moving slightly ahead of drag dots. The newStartYear is getting logged as where the mouse is, whereas the visual is sometimes a year or two off
                console.log("newyear", newStartYear);

                if (newStartYear < new Date(d.endDate).getFullYear()) {
                    d.startDate = `${newStartYear}-01-01`;
                    updateChart();
                }
            });

        const dragEndHandle = d3
            .drag()
            .on("start", (event, d) => {
                event.sourceEvent.stopPropagation(); // Prevent zooming while dragging
            })
            .on("drag", (event, d) => {
                const [mouseX] = d3.pointer(event, svg.node()); // Get correct X in SVG space
                const newEndYear = Math.round(x.invert(mouseX)); // Convert back to data space

                if (newEndYear > new Date(d.startDate).getFullYear()) {
                    d.endDate = `${newEndYear}-01-01`;
                    updateChart();
                }
            });

        // Add drag handles at the start of the bars
        svg.append("g")
            .selectAll("circle.start-handle")
            .data(data)
            .join("circle")
            .attr("class", "start-handle")
            .attr("cx", (d) => x(new Date(d.startDate).getFullYear()))
            .attr("cy", (d) => y(d.name) + y.bandwidth() / 2)
            .attr("r", dragHandleRadius)
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("cursor", "ew-resize")
            .style("transition", "x 0.5s, width 0.5s")
            .call(dragStartHandle);

        // Add drag handles at the end of the bars
        svg.append("g")
            .selectAll("circle.end-handle")
            .data(data)
            .join("circle")
            .attr("class", "end-handle")
            .attr("cx", (d) => x(new Date(d.endDate).getFullYear()))
            .attr("cy", (d) => y(d.name) + y.bandwidth() / 2)
            .attr("r", dragHandleRadius)
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("cursor", "ew-resize")
            .style("transition", "x 0.5s, width 0.5s")
            .call(dragEndHandle);

        const labels = svg
            .append("g")
            .attr("clip-path", "url(#clip)")
            .selectAll("text")
            .data(data)
            .join("text")
            .attr(
                "x",
                (d) =>
                    (x(new Date(d.startDate).getFullYear()) +
                        x(new Date(d.endDate).getFullYear())) /
                    2
            )
            .attr("y", (d) => y(d.name) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text((d) => d.name);

        const xAxis = d3.axisBottom(x).ticks(10).tickFormat(d3.format("d"));
        const xAxisGroup = svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        // Needed to make rerender on drag and drop
        const updateChart = () => {
            setData([...data]); // Trigger a re-render
        };
    }, [data]);

    // document.addEventListener("contextmenu", (e) => {
    //     // if e.target.id is one of the names in the data array, show custom modal instead to edit that element in the array
    //     const entry = data.find((entry) => entry.name === e.target.id);

    //     console.log("entry", entry);
    //     if (entry) {
    //         e.preventDefault();
    //     }

    //     // else do nothing
    // });
    const handleColorInputChange = (e, selectedBar) => {
        const newColor = e.target.value;

        const selectedBarIndex = data.findIndex(
            (d) => d.name === selectedBar.name
        );

        handleColorChange(selectedBarIndex, newColor);
    };

    const handleTitleInputChange = (e, selectedBar) => {
        const newValue = e.target.value;

        const selectedBarIndex = data.findIndex(
            (d) => d.name === selectedBar.name
        );

        handleLabelChange(selectedBarIndex, newValue);
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
            <svg ref={chartRef}></svg>

            {/* Right click menu */}
            {menu.visible && (
                <Menu
                    menu={menu}
                    setMenu={setMenu}
                    handleTitleInputChange={handleTitleInputChange}
                    handleColorInputChange={handleColorInputChange}
                />
            )}
        </div>
    );
};

export default D3LabelNumeric;
