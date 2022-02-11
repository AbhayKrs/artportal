import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTags } from '../store/actions/common.actions';

const HomeTabPanel = (props) => {
    useEffect(() => {
        props.getTags();
    }, [])
    const [activeStatus, setActiveStatus] = useState(1);
    let defaultTransform = 0;

    const goNext = () => {
        defaultTransform = defaultTransform - 400;
        var tabSlider = document.getElementById("tabSlider");
        if (Math.abs(defaultTransform) >= tabSlider.scrollWidth / 1.7)
            defaultTransform = 0;
        tabSlider.style.transform = "translateX(" + defaultTransform + "px)";
    }
    const goPrev = () => {
        var tabSlider = document.getElementById("tabSlider");
        if (Math.abs(defaultTransform) === 0) defaultTransform = 0;
        else defaultTransform = defaultTransform + 400;
        tabSlider.style.transform = "translateX(" + defaultTransform + "px)";
    }

    return <div className="m-1 flex xl:w-full xl:mx-0 h-fit bg-gray-200 shadow rounded">
        <button onClick={() => goPrev()} aria-label="slide backward" className="ml-1 z-30 left-0 cursor-pointer">
            <svg className="dark:text-gray-900 h-3 w-3" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1L1 7L7 13" stroke="currentColor" />
            </svg>
        </button>
        <div className='flex px-2 border-b overflow-hidden'>
            <ul id='tabSlider' className="flex ">
                {props.common.tags.map((tag, index) => {
                    return <li key={index} onClick={() => setActiveStatus(index)} className={index === activeStatus ? "text-sm border-indigo-700 rounded-t text-indigo-700 mr-1" : "text-sm text-gray-600 flex items-center mr-1 hover:text-indigo-700 cursor-pointer"}>
                        <div className="flex items-center">
                            <span className="p-2 font-normal">{tag}</span>
                        </div>
                        {index === activeStatus && <div className="w-full h-1 bg-indigo-700 rounded-t-md" />}
                    </li>
                })}
            </ul>
        </div>
        <button onClick={() => goNext()} aria-label="slide forward" className="mr-1 z-30 right-0 cursor-pointer">
            <svg className="dark:text-gray-900 h-3 w-3" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="currentColor" />
            </svg>
        </button>
        {/* {activeStatus == 1 && <div className='p-2'>Automatically comments, labels, and closes GitHub issues according to a configurable set of filters.</div>}
    {activeStatus == 2 && <div className='p-2'>Director of Research @github Next, data/datavis geek, calligrapher. Maker of delightful products. Ex-@heroku and @django core</div>}
    {activeStatus == 3 && <div className='p-2'>SVG masks for Age of Empires II: Definitive Edition unique units</div>} */}
    </div>
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
