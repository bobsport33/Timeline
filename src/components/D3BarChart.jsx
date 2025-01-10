import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const D3BarChart = () => {
    const chartRef = useRef();
    const [data, setData] = useState([
        { name: "A", value: 10 },
        { name: "B", value: 20 },
        { name: "C", value: 15 },
    ]);

    useEffect(() => {
        // Clear the chart area
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        // Set dimensions and margins
        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        // Create scales
        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Create SVG container
        svg.attr("width", width).attr("height", height);

        // Add bars
        const bars = svg
            .append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", (d) => x(d.name))
            .attr("y", (d) => y(d.value))
            .attr("height", (d) => y(0) - y(d.value))
            .attr("width", x.bandwidth())
            .attr("fill", "#8884d8")
            .attr("cursor", "grab");

        let initialX = null;

        // Add drag behavior
        bars.call(
            d3
                .drag()
                .on("start", (event, d) => {
                    initialX = x(d.name);
                    d3.select(event.sourceEvent.target)
                        .raise()
                        .attr("fill", "#4444d8");
                })
                .on("drag", (event, d) => {
                    if (!initialX) return;

                    const currentX = initialX + event.x;
                    const draggedIndex = data.findIndex(
                        (item) => item.name === d.name
                    );

                    const newIndex = Math.floor(
                        (currentX - margin.left) / x.step()
                    );

                    if (
                        newIndex !== draggedIndex &&
                        newIndex >= 0 &&
                        newIndex < data.length
                    ) {
                        const updatedData = [...data];
                        const [moved] = updatedData.splice(draggedIndex, 1);
                        updatedData.splice(newIndex, 0, moved);
                        setData(updatedData);

                        // Update the scales
                        x.domain(updatedData.map((item) => item.name));
                        initialX = x(d.name); // Recalculate the initial X position
                    }
                })
                .on("end", (event) => {
                    initialX = null;
                    d3.select(event.sourceEvent.target).attr("fill", "#8884d8");
                })
        );

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
    }, [data]);

    return <svg ref={chartRef}></svg>;
};

export default D3BarChart;
