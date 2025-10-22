// ImageProtected.jsx
import React from "react";

const Image = ({ src, alt = "", className = "", style = {}, pointer = false, rounded = false }) => {
    const dragBlock = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    return (
        <div
            className={`relative select-none ${className}`}
            style={style}
            onContextMenu={dragBlock}
        >
            <img
                loading='lazy'
                src={src}
                alt={alt}
                draggable={false}
                onDragStart={dragBlock}
                className={`block pointer-events-none select-none object-cover w-full h-full ${rounded && "rounded-lg"}`}
            />

            <div
                className={`absolute inset-0 bg-transparent ${pointer ? 'cursor-pointer' : 'cursor-default'} select-none touch-none`}
                onContextMenu={dragBlock}
                onMouseDown={dragBlock}
                onDragStart={dragBlock}
                onTouchStart={dragBlock}
                aria-hidden="true"
            />
        </div>
    );
}


export default Image;