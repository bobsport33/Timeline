// import React, { useState } from "react";
// import { scaleBand, scaleLinear } from "@visx/scale";
// import { Group } from "@visx/group";
// import { Bar } from "@visx/shape";
// import { AxisBottom, AxisLeft } from "@visx/axis";
// import { useDrag } from "@visx/drag";

// const VisXBarChart = () => {
//     const [data, setData] = useState([
//         { name: "A", value: 10 },
//         { name: "B", value: 20 },
//         { name: "C", value: 15 },
//     ]);

//     const width = 600;
//     const height = 300;
//     const margin = { top: 20, right: 30, bottom: 40, left: 40 };

//     // Set up scales
//     const x = scaleBand({
//         domain: data.map((d) => d.name),
//         range: [margin.left, width - margin.right],
//         padding: 0.1,
//     });

//     const y = scaleLinear({
//         domain: [0, Math.max(...data.map((d) => d.value))],
//         range: [height - margin.bottom, margin.top],
//     });

//     // Handle dragging and swapping items
//     const handleDragMove = (draggedIndex, deltaX) => {
//         const targetIndex = Math.round(
//             (x(data[draggedIndex].name) + deltaX - margin.left) / x.bandwidth()
//         );

//         // Swap items if the target index changes and is within bounds
//         if (
//             targetIndex !== draggedIndex &&
//             targetIndex >= 0 &&
//             targetIndex < data.length
//         ) {
//             const updatedData = [...data];
//             const [moved] = updatedData.splice(draggedIndex, 1);
//             updatedData.splice(targetIndex, 0, moved);
//             setData(updatedData);
//         }
//     };

//     // Handle drag end
//     const handleDragEnd = () => {
//         setData([...data]); // Ensure the data reflects the new order after drag ends
//     };

//     return (
//         <svg width={width} height={height}>
//             <Group>
//                 {data.map((d, i) => {
//                     const { dragX, isDragging, dragStart } = useDrag({
//                         x: 0,
//                         onDragMove: ({ dx }) => handleDragMove(i, dx),
//                         onDragEnd: handleDragEnd,
//                         onDragStart: ({ event }) => dragStart(event),
//                     });

//                     return (
//                         <Bar
//                             key={d.name}
//                             x={x(d.name)}
//                             y={y(d.value)}
//                             width={x.bandwidth()}
//                             height={y(0) - y(d.value)}
//                             fill={isDragging ? "#4444d8" : "#8884d8"}
//                             cursor="grab"
//                             onMouseDown={dragStart}
//                             style={{
//                                 transform: `translateX(${dragX}px)`,
//                                 transition: isDragging
//                                     ? "none"
//                                     : "transform 0.2s ease",
//                             }}
//                         />
//                     );
//                 })}
//             </Group>

//             {/* X and Y axes */}
//             <AxisBottom top={height - margin.bottom} scale={x} />
//             <AxisLeft left={margin.left} scale={y} />
//         </svg>
//     );
// };

// export default VisXBarChart;
