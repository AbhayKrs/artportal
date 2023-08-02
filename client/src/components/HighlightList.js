import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ImageCard } from './Card';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { fetchExploreImages } from '../api';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const HighlightList = (props) => {
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
            items: 6
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
                <h2 className='font-josefinlight font-bold text-3xl text-gray-300'>{props.title}</h2>
                <div className='absolute h-1 w-8 bottom-0 left-0 text-2xl bg-gray-300'></div>
            </div>

            <Carousel
                responsive={responsive}
                removeArrowOnDeviceType={['mobile']}
                customLeftArrow={
                    <button className='absolute z-10 transition-all opacity-50 hover:opacity-100 bg-neutral-800 dark:bg-gray-300 p-3 rounded-full left-0'>
                        <FaChevronLeft className='h-6 w-6 text-gray-300 dark:text-neutral-700' />
                    </button>}
                customRightArrow={
                    <button
                        className='absolute z-10 transition-all opacity-50 hover:opacity-100 bg-neutral-800 dark:bg-gray-300 p-3 rounded-full right-0'>
                        <FaChevronRight className='h-6 w-6 text-gray-300 dark:text-neutral-700' />
                    </button>
                }>
                {props.list.map((item, index) => {
                    return <ImageCard size="l" key={index} explore={item} author={item.author} />
                })}
            </Carousel>
        </div >
    )
}

export default HighlightList;