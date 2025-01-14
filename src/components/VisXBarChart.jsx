import React, { useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { useDrag } from "@visx/drag";

const BarWithDrag = ({ data, index, xScale, yScale, onDragMove }) => {
    const { dragX, isDragging, dragStart, dragEnd } = useDrag({
        x: 0,
        onDragMove: ({ dx }) => onDragMove(index, dx),
        onDragStart: ({ event }) => dragStart(event),
        onDragEnd: () => dragEnd(),
    });

    return (
        <Bar
            x={xScale(data.name)}
            y={yScale(data.value)}
            width={xScale.bandwidth()}
            height={yScale(0) - yScale(data.value)}
            fill={isDragging ? "#4444d8" : "#8884d8"}
            cursor="grab"
            onMouseDown={dragStart}
            style={{
                transform: `translateX(${dragX}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease",
            }}
        />
    );
};

const VisXBarChart = () => {
    const [data, setData] = useState([
        { name: "A", value: 10 },
        { name: "B", value: 20 },
        { name: "C", value: 15 },
    ]);

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Set up scales
    const x = scaleBand({
        domain: data.map((d) => d.name),
        range: [margin.left, width - margin.right],
        padding: 0.1,
    });

    const y = scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.value))],
        range: [height - margin.bottom, margin.top],
    });

    // Handle dragging and swapping items
    const handleDrag = (index, deltaX) => {
        const targetIndex = Math.round(
            (x(data[index].name) + deltaX - margin.left) / x.bandwidth()
        );
        if (
            targetIndex !== index &&
            targetIndex >= 0 &&
            targetIndex < data.length
        ) {
            const updatedData = [...data];
            const [moved] = updatedData.splice(index, 1);
            updatedData.splice(targetIndex, 0, moved);
            setData(updatedData);
        }
    };

    return (
        <svg width={width} height={height}>
            <Group>
                {data.map((d, i) => (
                    <BarWithDrag
                        key={d.name}
                        data={d}
                        index={i}
                        xScale={x}
                        yScale={y}
                        onDragMove={handleDrag}
                    />
                ))}
            </Group>

            {/* X and Y axes */}
            <AxisBottom top={height - margin.bottom} scale={x} />
            <AxisLeft left={margin.left} scale={y} />
        </svg>
    );
};

export default VisXBarChart;
