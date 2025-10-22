import React, { useState, useRef, useEffect } from "react";
import { api_artworkImages } from "../../utils/api_routes";

import { ReactComponent as RightIcon } from '../../assets/icons/right.svg';
import { ReactComponent as LeftIcon } from '../../assets/icons/left.svg';
import Image from "../Image";

const MultiImageCarousel = ({ size = 12, fit = "contain", images = [], perView = 2 }) => {
    const [current, setCurrent] = useState(0);
    const startX = useRef(0);
    const containerRef = useRef(null);

    const [imgSize, setImgSize] = useState(size);
    const [imgCover, setImgCover] = useState("object-contain");

    const handlePrev = () => {
        setCurrent((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrent((prev) => Math.min(prev + 1, images.length - perView));
    };

    // Swipe handlers
    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX.current - endX;
        if (diff > 50) handleNext(); // swipe left
        if (diff < -50) handlePrev(); // swipe right
    };

    useEffect(() => setImgSize(size), [size]);
    useEffect(() => setImgCover("object-" + fit), [fit]);

    const slideWidth = 100 / perView; // width of each image

    const dragBlock = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    return (
        <div className="relative w-full mx-auto overflow-hidden rounded-xl">
            <div
                ref={containerRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${current * slideWidth}%)` }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((image, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 flex justify-center"
                        style={{ width: `${slideWidth}%`, maxHeight: `${imgSize}rem` }}
                    >
                        <Image
                            id={index}
                            src={`${URL.createObjectURL(image.content)}`}
                            alt={`slide-${i}`}
                            pointer={false}
                            className={`w-full h-auto ${imgCover} rounded-lg`}
                        />
                    </div>
                ))}
            </div>

            {images.length > perView && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 hover:bg-black/30 text-white p-1.5 rounded-full"
                    >
                        <LeftIcon className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-black/30 text-white p-1.5 rounded-full"
                    >
                        <RightIcon className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 w-full flex justify-center space-x-1">
                        {Array.from({ length: images.length - perView + 1 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-1.5 rounded-full ${i === current ? "bg-white" : "bg-white/40"}`}
                            ></div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MultiImageCarousel;
