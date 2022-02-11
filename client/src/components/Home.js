import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HomeTabPanel from './HomeTabPanel';

const Home = (props) => {
    let defaultTransform = 0;

    const goNext = () => {
        defaultTransform = defaultTransform - 398;
        var slider = document.getElementById("slider");
        if (Math.abs(defaultTransform) >= slider.scrollWidth / 1.7)
            defaultTransform = 0;
        slider.style.transform = "translateX(" + defaultTransform + "px)";
    }
    const goPrev = () => {
        var slider = document.getElementById("slider");
        if (Math.abs(defaultTransform) === 0) defaultTransform = 0;
        else defaultTransform = defaultTransform + 398;
        slider.style.transform = "translateX(" + defaultTransform + "px)";
    }

    const carouselData = [{
        id: 1,
        image: 'https://images.unsplash.com/photo-1644416598043-11c2816eec28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80',
        title: 'Minimal Interior'
    }, {
        id: 2,
        image: 'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        title: 'Minimal Interior'
    }, {
        id: 3,
        image: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 4,
        image: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 5,
        image: 'https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 6,
        image: 'https://images.pexels.com/photos/587958/pexels-photo-587958.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }]

    return (
        <div className='bg-slate-100'>
            <div className="flex items-center justify-center w-full h-full">
                <div className="w-full relative flex items-center justify-center">
                    <button onClick={() => goPrev()} aria-label="slide backward" className="absolute z-30 ml-0.5 left-0 cursor-pointer">
                        <svg className="dark:text-gray-900 h-6 w-6" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 1L1 7L7 13" stroke="currentColor" />
                        </svg>
                    </button>
                    <div className="w-full h-full mx-7 overflow-x-hidden overflow-y-hidden">
                        <div id="slider" className="h-full flex space-x-2 items-center justify-start transition ease-out duration-700">
                            {carouselData.map(item => {
                                return <div className="flex h-52 w-52 flex-shrink-0 relative">
                                    <img src={item.image} alt="black chair and white table" className="object-cover object-center w-full rounded-lg" />
                                    <div className="bg-gray-800 rounded-lg bg-opacity-30 absolute w-full h-full p-3">
                                        <div className="flex h-full items-end">
                                            <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white dark:text-gray-900">{item.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                    <button onClick={() => goNext()} aria-label="slide forward" className="absolute mr-0.5 z-30 right-0">
                        <svg className="dark:text-gray-900 h-6 w-6" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7L1 13" stroke="currentColor" />
                        </svg>
                    </button>
                </div>
            </div>
            <HomeTabPanel />
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    explore: state.explore,
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
