import React from 'react';
import { fetchArtworkImages, fetchUserImages } from '../api';

import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const ExploreShowCarousel = (props) => {
    return (
        <div className="flex relative lg:col-span-7 w-full justify-center bg-gray-300 dark:bg-[#101010] ">
            <div className="flex flex-col m-3 space-y-3 w-full justify-center">
                <div className='flex max-h-[44rem] w-fit self-center items-center'>
                    {props.prevTrue ? <button onClick={props.prev} aria-label="slide backward" className="absolute z-30 ml-3 left-0 cursor-pointer">
                        <FaChevronLeft className='text-5xl text-neutral-800 dark:text-gray-300' />
                    </button> : ''}
                    <img src={`${fetchArtworkImages(props.currentImage)}`} alt="black chair and white table" className="h-full object-cover object-center rounded-lg md:max-h-screen" />
                    {props.nextTrue ? <button onClick={props.next} aria-label="slide forward" className="absolute mr-3 z-30 right-0">
                        <FaChevronRight className='text-5xl text-neutral-800 dark:text-gray-300' />
                    </button> : ''}
                </div>
                <div className='flex space-x-3 justify-center'>
                    {props.secondaryImages.map((image, index) => (
                        <img key={index} src={`${fetchArtworkImages(image)}`} alt="black chair and white table" className="h-60 w-auto max-w-xs object-cover object-center rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export const MultipleCarouselWithHeaders = (props) => {
    return (
        <div className="w-full relative flex items-center justify-center">
            <GoChevronLeft onClick={props.prev} className='h-8 w-8 text-neutral-600' />
            <div className="w-full h-full overflow-x-hidden overflow-y-hidden">
                <div id="slider" className="h-full flex space-x-2 items-center justify-start transition ease-out duration-700">
                    {props.data.map((item, index) => {
                        return <div key={index} className="flex h-56 w-56 flex-shrink-0 relative">
                            <img src={item.image} alt="black chair and white table" className="object-cover object-center w-full rounded-lg" />
                            <div className="bg-gray-800 bg-gradient-to-t from-black rounded-lg bg-opacity-30 absolute w-full h-full p-2">
                                <div className="flex flex-col h-full justify-end">
                                    <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-neutral-200">{item.title}</h3>
                                    <span className='text-sm text-white dark:text-neutral-400'>secondary description</span>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <GoChevronRight onClick={props.next} className='h-8 w-8 text-neutral-600' />
        </div>
    )
}