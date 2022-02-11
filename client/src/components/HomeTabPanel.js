import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTags } from '../store/actions/common.actions';
import ImageCard from './ImageCard';

const HomeTabPanel = (props) => {
    useEffect(() => {
        props.getTags();
    }, [])
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
        <div className="p-2 h-fit bg-gray-200 dark:bg-zinc-900">
            <div className='flex'>
                <button onClick={() => goPrev()} aria-label="slide backward" className="px-1.5 z-30 left-0 cursor-pointer bg-gray-400/50 dark:bg-neutral-700 rounded-tl-md">
                    <svg className="dark:text-gray-200 h-3 w-3" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 1L1 7L7 13" stroke="currentColor" />
                    </svg>
                </button>
                <div className='flex overflow-hidden bg-gray-300 dark:bg-neutral-800'>
                    <ul id='tabSlider' className="flex ">
                        {props.common.tags.map((tag, index) => {
                            return <li key={index} onClick={() => setActiveStatus(index)} className={index === activeStatus ? "text-sm text-gray-600 dark:bg-violet-300 mr-1" : "text-sm text-gray-600 dark:text-gray-400 flex items-center mr-1 hover:text-indigo-700 cursor-pointer"}>
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
                {props.common.tags.map((tag, index) => {
                    return <>
                        {index === activeStatus && props.explore.artworkList.filter(item => item.tags.includes(tag) === true).map((artwork, index) => (
                            <ImageCard artwork={artwork} author={artwork.author} />
                        ))}
                    </>
                })}
            </div>
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    explore: state.explore,
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getTags
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabPanel);
