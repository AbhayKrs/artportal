import React, { useState } from 'react';
import ImageCard from './ImageCard';
import { AwardConfirmModal } from './SubModal';

import { fetchUserImages } from '../api';

export const HomeTabPanel = (props) => {
    const [activeStatus, setActiveStatus] = useState(0);
    let defaultTransform = 0;

    const goNext = () => {
        defaultTransform = defaultTransform - 600;
        var tabSlider = document.getElementById("tabSlider");
        if (Math.abs(defaultTransform) >= tabSlider.scrollWidth / 1.05)
            defaultTransform = 0;
        tabSlider.style.transform = "translateX(" + defaultTransform + "px)";
    }
    const goPrev = () => {
        var tabSlider = document.getElementById("tabSlider");
        if (Math.abs(defaultTransform) === 0) defaultTransform = 0;
        else defaultTransform = defaultTransform + 600;
        tabSlider.style.transform = "translateX(" + defaultTransform + "px)";
    }

    return (
        <div className="p-2 h-fit bg-gray-200 dark:bg-darkNavBg">
            <div className='flex'>
                <button onClick={() => goPrev()} aria-label="slide backward" className="px-1.5 z-30 left-0 cursor-pointer bg-gray-400/50 dark:bg-neutral-700 rounded-tl-md">
                    <svg className="dark:text-gray-200 h-3 w-3" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 1L1 7L7 13" stroke="currentColor" />
                    </svg>
                </button>
                <div className='flex overflow-hidden bg-gray-300 dark:bg-neutral-800'>
                    <ul id='tabSlider' className="flex ">
                        {props.tags.map((tag, index) => {
                            return <li key={index} onClick={() => setActiveStatus(index)} className={index === activeStatus ? "text-sm text-gray-600 bg-violet-300 mr-1" : "text-sm text-gray-600 dark:text-gray-400 flex items-center mr-1 hover:text-indigo-700 cursor-pointer"}>
                                <div className="flex items-center">
                                    <span className="p-2 font-normal">{tag}</span>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
                <button onClick={() => goNext()} aria-label="slide forward" className="px-1.5 z-30 right-0 cursor-pointer bg-gray-400/50 dark:bg-neutral-700 rounded-tr-md">
                    <svg className="dark:text-gray-200 h-3 w-3" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L1 13" stroke="currentColor" />
                    </svg>
                </button>
            </div>
            <div className="grid bg-gray-300 dark:bg-neutral-800 overflow-hidden rounded-b-md lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2">
                {props.tags.map((tag, index) => {
                    return <>
                        {index === activeStatus && props.artworkList.filter(item => item.tags.includes(tag) === true).map(artwork => (
                            <ImageCard artwork={artwork} author={artwork.author} />
                        ))}
                    </>
                })}
            </div>
        </div>
    )
}

export const AwardTabPanel = (props) => {
    const [activeStatus, setActiveStatus] = useState(0);
    const [confirmData, setConfirmData] = useState({ open: false, award: {} });

    return (
        <div className="p-2 h-fit bg-slate-100 dark:bg-neutral-800">
            <div className='flex'>
                <div className='flex w-full overflow-hidden bg-gray-100 dark:bg-neutral-800'>
                    <ul id='tabSlider' className="flex ">
                        {['Artyst Specials', 'Community Made', 'Premium'].map((awardType, index) => {
                            return <li key={index} onClick={() => setActiveStatus(index)} className={index === activeStatus ? "text-sm text-gray-900 dark:font-medium bg-violet-400 mr-1 rounded-t-md" : "text-sm text-gray-600 rounded-t-md dark:text-gray-400 dark:bg-neutral-700 flex items-center mr-1 hover:text-indigo-700 cursor-pointer"}>
                                <div className="font-josefinregular flex items-center uppercase">
                                    <span className="p-2 pb-1">{awardType}</span>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
            <div className="scrollbar grid max-h-96 gap-6 bg-gray-300 dark:bg-neutral-900 p-5 overflow-x-hidden rounded-b-md lg:grid-cols-6 md:grid-cols-6 sm:grid-cols-7 xs:grid-cols-2" >
                {props.awards.map((award, index) => {
                    return <>
                        {index === activeStatus && props.awards.map(award => (
                            <button onClick={() => setConfirmData({ open: true, award })}>
                                <img style={{ width: '3em', height: '3em' }} src={fetchUserImages(award.icon)} />
                                <p class="font-bold font-serif text-right text-neutral-700 dark:text-gray-300 text-sm">500</p>
                            </button>
                        ))}
                    </>
                })}
                {props.awards.map((award, index) => {
                    return <>
                        {index === activeStatus && props.awards.map(award => (
                            <button onClick={() => setConfirmData({ open: true, award })}>
                                <img style={{ width: '3em', height: '3em' }} src={fetchUserImages(award.icon)} />
                                <p class="font-bold font-serif text-right text-neutral-700 dark:text-gray-300 text-sm">500</p>
                            </button>
                        ))}
                    </>
                })}
            </div>
            <AwardConfirmModal
                open={confirmData.open}
                awardData={confirmData.award}
                onClose={() => setConfirmData({ open: false, award: {} })}
                handleAwardArtwork={props.handleAwardArtwork}
            />
        </div >
    )
}