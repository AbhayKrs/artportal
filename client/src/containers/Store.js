import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';

import { fetchExploreImages } from '../api';
import { StoreMultiCarousel } from '../components/Carousel';

import LazyPanda from '../assets/images/lazyPanda2.png';

const Store = (props) => {
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
    }, {
        id: 7,
        image: 'https://images.unsplash.com/photo-1644416598043-11c2816eec28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80',
        title: 'Minimal Interior'
    }, {
        id: 8,
        image: 'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        title: 'Minimal Interior'
    }, {
        id: 9,
        image: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 10,
        image: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 11,
        image: 'https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 12,
        image: 'https://images.pexels.com/photos/587958/pexels-photo-587958.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }]

    return (
        <div className='bg-gray-200 dark:bg-darkNavBg'>
            <div className='pt-3 px-2'>
                <div className='text-2xl font-antipasto font-bold text-violet-500 dark:text-violet-600'>Welcome to the Artyst Store</div>
                <div className='text-md font-caviar text-gray-800 dark:text-neutral-300'>Find the best of the artworld with artistic pieces, merch and products of everything art.</div>
            </div>
            <div className='flex m-3 space-x-3'>
                {['Store - All', 'Artyst Verified Sellers'].map(item => (
                    <button className="w-1/2 tracking-wider bg-gradient-to-r font-caviar font-bold from-violet-600 to-purple-500 drop-shadow-md shadow-cla-blue p-3 rounded">{item}</button>
                ))}
            </div>
            <StoreMultiCarousel data={carouselData} />
            {/* Highlights of the Day section */}
            <div className='p-4 space-y-2'>
                <div className='text-3xl font-antipasto font-bold dark:text-neutral-400'>Highlights of the Day</div>
                <div className='grid gap-4 grid-cols-3 grid-rows-3 '>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                        <div className="h-full drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                            <img className="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100" src="https://images.unsplash.com/photo-1618172193622-ae2d025f4032?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80" alt="blog" />
                            <div className="py-6 px-4">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY:</h2>
                                <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">The Catalyzer</h1>
                                <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
                                <div className="flex items-center flex-wrap ">
                                    <button className="bg-gradient-to-r font-caviar font-semibold from-violet-400 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className='mx-4 rounded border-2 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' />
            {/* Featured */}
            <div className='p-4 space-y-2'>
                <div className='text-3xl font-antipasto font-bold dark:text-neutral-400'>Featured</div>
                <div className='grid gap-4 grid-cols-3 grid-rows-3'>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                        <div className="h-full drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                            <img className="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100" src="https://images.unsplash.com/photo-1618172193622-ae2d025f4032?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80" alt="blog" />
                            <div className="py-6 px-4">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY:</h2>
                                <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">The Catalyzer</h1>
                                <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
                                <div className="flex items-center flex-wrap ">
                                    <button className="bg-gradient-to-r font-caviar font-semibold from-violet-400 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className='mx-4 rounded border-2 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' />
            {/* Artists of the Month */}
            <div className='p-4'>
                <div className='text-3xl font-antipasto font-bold dark:text-neutral-400'>Trending Sellers</div>
                <div className='grid gap-4 grid-cols-3'>
                    {[0, 1, 2].map(item => (
                        <div className="py-8 h-3/4 mt-auto cursor-pointer rounded-3xl bg-gray-100 dark:bg-neutral-900 transition duration-300 ease-in-out hover:scale-105">
                            <div className="-mb-14 -translate-y-40 transform">
                                <img src={LazyPanda} alt="Kobe Bryant" title="Kobe Bryant" className="mx-auto" />
                            </div>
                            <div className="-translate-y-28">
                                <div className="text-center dark:text-gray-300">
                                    <h3 className="text-center text-2xl font-bold">Kobe Bryant</h3>
                                    <span className="text-sm">Shooting Guard</span>
                                    <ul className="m-3 flex justify-center text-center font-josefinlight space-x-4">
                                        <li className="flex flex-col text-sm"><span className="font-bold text-lg">Rating</span>5.00</li>
                                        <li className="flex flex-col text-sm"><span className="font-bold text-lg">Followers</span> 4.7</li>
                                        <li className="flex flex-col text-sm"><span className="font-bold text-lg">YSR*</span>4.5</li>
                                    </ul>
                                    <div className="mb-3">
                                        <button className="bg-gradient-to-r font-caviar font-semibold from-yellow-300 to-amber-500 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg text-black">More Info</button>
                                    </div>
                                    <div className='text-sm font-bold font-josefinlight text-rose-400'>* YSR - Year to Sales Rating</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Merch */}
        </div>
    )
}

const mapStateToProps = (state, props) => ({
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Store)