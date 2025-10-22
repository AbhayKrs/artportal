import React, { useState, useRef, useEffect } from "react";
import { api_artworkImages, api_postImages } from "../../utils/api_routes";

import Image from "../Image";

import { ReactComponent as RightIcon } from '../../assets/icons/right.svg';
import { ReactComponent as LeftIcon } from '../../assets/icons/left.svg';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';


const FullImageCarousel = ({ onClose, source, images }) => {
    const [current, setCurrent] = useState(0);
    const startX = useRef(0);
    const containerRef = useRef(null);

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


    return (
        <div className="absolute z-50 inset-0 h-screen w-screen mx-auto content-center overflow-hidden bg-black/90">
            <div
                ref={containerRef}
                className="flex transition-transform duration-500 ease-in-out items-center"
                style={{ transform: `translateX(-${current * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((img, i) => (
                    <div
                        key={i}
                        className={`bg-gray-100/50 dark:bg-black/15 flex-shrink-0 h-full w-full flex justify-center`}
                    >
                        <Image
                            src={api_artworkImages(img)}
                            alt={`slide-${i}`}
                            pointer={false}
                            className={`w-full items-center h-auto rounded-lg`}
                        />
                    </div>
                ))}
            </div>

            <IoCloseSharp onClick={() => { onClose() }} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-300' />

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

export default FullImageCarousel;
