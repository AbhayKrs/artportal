import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ImageCard } from './Card';

import { ReactComponent as LeftIcon } from '../assets/icons/left.svg';
import { ReactComponent as RightIcon } from '../assets/icons/right.svg';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const HighlightList = ({ title, list }) => {
    let defaultTransform = 0;

    const responsive = {
        superLargeDesktop: {
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
        <div className='flex flex-col gap-1 p-4 rounded-md w-full'>
            {title.length === 0 ? null : <div className='relative w-fit justify-between mb-2'>
                <h2 className='font-medium text-2xl text-neutral-800 dark:text-gray-300'>{title}</h2>
                <div className='absolute h-1 w-8 bottom-[-2px] left-0 text-2xl bg-gray-300 rounded-md'></div>
            </div>}
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
                    return <ImageCard size="l" key={index} explore={item} artist={item.artist} />
                })}
            </Carousel>

        </div >
    )
}

export default HighlightList;