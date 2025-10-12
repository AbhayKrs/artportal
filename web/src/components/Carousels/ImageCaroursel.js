import React, { useState, useRef, useEffect } from "react";
import { api_artworkImages } from "../../utils/api_routes";

import { ReactComponent as RightIcon } from '../../assets/icons/right.svg';
import { ReactComponent as LeftIcon } from '../../assets/icons/left.svg';

const ImageCarousel = ({ size, fit = "contain", images = [] }) => {
    const [current, setCurrent] = useState(0);
    const startX = useRef(0);
    const currentTranslate = useRef(0);
    const containerRef = useRef(null);

    const [imgSize, setImgSize] = useState(32);
    const [imgCover, setImgCover] = useState("object-contain");

    const handlePrev = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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

    useEffect(() => {
        setImgSize(size);
    }, [size])

    useEffect(() => {
        let a = "object-" + fit;
        setImgCover(a);
    }, [fit])

    return (
        <div className="relative w-full mx-auto overflow-hidden rounded-xl">
            <div
                ref={containerRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((src, i) => (
                    <div key={i} className={`bg-gray-100/50 dark:bg-black/15 flex-shrink-0 max-h-[${imgSize}rem] w-full flex justify-center`}>
                        <img
                            key={i}
                            src={`${api_artworkImages(src)}`}
                            alt={`slide-${i}`}
                            className={`w-full h-auto ${imgCover} rounded-lg`}
                        />
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2  hover:bg-black/30 text-white p-1.5 rounded-full"
                    >
                        <LeftIcon className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2  hover:bg-black/30 text-white p-1.5 rounded-full"
                    >
                        <RightIcon className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 w-full flex justify-center space-x-1">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-1.5 rounded-full bg-blend-normal ${i === current ? "bg-white" : "bg-white/40"}`}
                            ></div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;
