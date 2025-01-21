import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const D3HorizontalBarChart = () => {
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
        const margin = { top: 20, right: 30, bottom: 40, left: 80 };

        // Create scales
        const x = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .nice()
            .range([margin.left, width - margin.right]);

        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([margin.top, height - margin.bottom])
            .padding(0.1);

        // Create SVG container
        svg.attr("width", width).attr("height", height);

        // Add bars
        const bars = svg
            .append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", margin.left)
            .attr("y", (d) => y(d.name))
            .attr("height", y.bandwidth())
            .attr("width", (d) => x(d.value) - margin.left)
            .attr("fill", "#8884d8")
            .attr("cursor", "grab");

        // Add text inside the bars
        svg.append("g")
            .selectAll("text")
            .data(data)
            .join("text")
            .attr("x", (d) => margin.left + x(d.value) / 2) // Position at the center of the bar
            .attr("y", (d) => y(d.name) + y.bandwidth() / 2) // Position vertically at the center of the bar
            .attr("dy", ".35em") // Vertically align the text at the center
            .attr("text-anchor", "middle")
            .attr("fill", "white") // Text color inside the bars
            .text((d) => d.value); // Display the value inside the bar

        let draggedIndex = null;

        // Add drag behavior
        bars.call(
            d3
                .drag()
                .on("start", (event, d) => {
                    draggedIndex = data.findIndex(
                        (item) => item.name === d.name
                    );
                    d3.select(event.sourceEvent.target)
                        .raise()
                        .attr("fill", "#4444d8");
                })
                .on("drag", (event, d) => {
                    if (!draggedIndex) return;

                    const currentY = event.y;

                    // Check for overlap with other bars
                    let targetIndex = null;
                    bars.each(function (e, i) {
                        if (i !== draggedIndex) {
                            const rect = this.getBoundingClientRect();
                            const rectY = rect.top;

                            // If dragged bar is over the other bar, update the targetIndex
                            if (
                                currentY > rectY &&
                                currentY < rectY + y.bandwidth()
                            ) {
                                targetIndex = i;
                            }
                        }
                    });

                    if (targetIndex !== null && targetIndex !== draggedIndex) {
                        // Swap the data positions
                        const updatedData = [...data];
                        const draggedBar = updatedData.splice(
                            draggedIndex,
                            1
                        )[0];
                        updatedData.splice(targetIndex, 0, draggedBar);
                        setData(updatedData);

                        // Update the scale after swap
                        y.domain(updatedData.map((item) => item.name));
                        draggedIndex = targetIndex; // Recalculate the draggedIndex
                    }
                })
                .on("end", (event) => {
                    draggedIndex = null;
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

export default D3HorizontalBarChart;
