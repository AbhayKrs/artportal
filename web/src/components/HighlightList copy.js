import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ImageCard from './Cards/ImageCard';

import { ReactComponent as LeftIcon } from '../assets/icons/left.svg';
import { ReactComponent as RightIcon } from '../assets/icons/right.svg';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const HighlightList = ({ title, list }) => {
    let defaultTransform = 0;
    let navigate = useNavigate();

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 1920 },
            items: 8
        },
        desktop: {
            breakpoint: { max: 1920, min: 1024 },
            items: 7
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
        }
    };

    return (
        <div className='flex flex-col p-4 rounded-md w-full'>
            <div className='relative w-fit justify-between mb-2'>
                <h2 className='font-bold text-3xl text-gray-300'>{title}</h2>
                <div className='absolute h-1 w-8 bottom-0 left-0 text-2xl bg-gray-300'></div>
            </div>
            <Carousel
                responsive={responsive}
                removeArrowOnDeviceType={['mobile']}
                customLeftArrow={
                    <button
                        className='absolute z-10 transition-all opacity-75 hover:opacity-100 left-0'>
                        <LeftIcon className='h-8 w-8 text-gray-300' />
                    </button>}
                customRightArrow={
                    <button
                        className='absolute z-10 transition-all opacity-75 hover:opacity-100 right-0'>
                        <RightIcon className='h-8 w-8 text-gray-300' />
                    </button>
                }>
                {list.map((item, index) => {
                    return <ImageCard size="l" key={index} artwork={item} artist={item.artist} />
                })}
            </Carousel>

        </div >
    )
}

export default HighlightList;