import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import ImageCard from './Cards/ImageCard';

import { ReactComponent as LeftIcon } from '../assets/icons/left.svg';
import { ReactComponent as RightIcon } from '../assets/icons/right.svg';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Title from './Title';

const HighlightList = ({ title, list, visibleItems = { desktop: 7, tablet: 4, mobile: 2 } }) => {
    const [responsive, setResponsive] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef();

    useEffect(() => {
        const updateResponsive = () => {
            setResponsive({
                superLargeDesktop: {
                    breakpoint: { max: 4000, min: 1920 },
                    items: visibleItems.desktop + 1 // a little extra space for big screens
                },
                desktop: {
                    breakpoint: { max: 1920, min: 1024 },
                    items: visibleItems.desktop
                },
                tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: visibleItems.tablet
                },
                mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: visibleItems.mobile
                }
            });
        };

        updateResponsive();
        window.addEventListener('resize', updateResponsive);
        return () => window.removeEventListener('resize', updateResponsive);
    }, [visibleItems]);

    return (
        <div className='flex flex-col gap-1 rounded-md w-full'>
            {title?.length > 0 && (
                <Title text={title} />
            )}
            <div className='relative flex flex-row gap-0.5 items-center w-full'>
                <button
                    disabled={currentSlide === 0}
                    onClick={() => carouselRef.current.previous()}
                    className='z-10 opacity-75 hover:opacity-100 left-0 mr-1 disabled:opacity-30'
                >
                    <LeftIcon className='h-8 w-8 text-neutral-800 dark:text-gray-300' />
                </button>
                <Carousel
                    containerClass='w-full pb-4'
                    ref={carouselRef}
                    responsive={responsive}
                    arrows={false} // hide default arrows
                    // showDots={true}
                    beforeChange={(currentSlide) => setCurrentSlide(currentSlide)}
                >
                    {list.map((item, index) => (
                        <ImageCard size="m" key={index} artwork={item} artist={item.artist} />
                    ))}
                </Carousel>
                <button
                    disabled={currentSlide === list.length - visibleItems.desktop}
                    onClick={() => carouselRef.current.next()}
                    className='z-10 opacity-75 hover:opacity-100 right-0 ml-1 disabled:opacity-30'
                >
                    <RightIcon className='h-8 w-8 text-neutral-800 dark:text-gray-300' />
                </button>
            </div>
        </div >
    )
}

export default HighlightList;