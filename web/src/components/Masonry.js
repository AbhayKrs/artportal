import React, { useState, useEffect } from 'react';
// import ImageCard from './ImageCard';

const Masonry = ({ cols, children }) => {
    const columnWrapper = {};
    const gap = 5;
    const result = [];

    const [columns, setColumns] = useState(cols);

    useEffect(() => {
        if (window.innerWidth < 640) {
            setColumns(1);
        } else if (window.innerWidth <= 925) {
            setColumns(3);
        }
        const handleResize = () => {
            if (window.innerWidth <= 925) {
                setColumns(3);
            } else if (window.innerWidth < 376) {
                setColumns(1);
            } else {
                setColumns(5);
            }
        }
        window.addEventListener("resize", handleResize);
    })

    // create columns
    for (let i = 0; i < columns; i++) {
        columnWrapper[`column${i}`] = [];
    }
    // divide children into columns
    for (let i = 0; i < children.length; i++) {
        const columnIndex = i % columns;
        columnWrapper[`column${columnIndex}`].push(
            <div key={i} style={{ marginBottom: `${gap}px` }}>
                {children[i]}
            </div>
        );
    }

    // wrap children in each column with a div
    for (let i = 0; i < columns; i++) {
        result.push(
            <div key={i} style={{ marginLeft: `${i > 0 ? gap : 0}px`, flex: 1 }}>
                {columnWrapper[`column${i}`]}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
            {result}
        </div>
    )
}

export default Masonry;

