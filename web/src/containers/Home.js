import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { r_setLoader } from '../store/reducers/common.reducers';
import { a_fetchExploreList, a_fetchTrendingList, a_fetchNewlyAddedList, a_fetchMonthHighlightsList } from '../store/actions/explore.actions';

import { HomeSingleCarousel } from '../components/Carousel';
import HighlightList from '../components/HighlightList';

import AppQR from '../assets/images/artportal_appQR.png';

const Home = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const explore = useSelector(state => state.explore);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(r_setLoader(true));
        dispatch(a_fetchExploreList());
        dispatch(a_fetchTrendingList());
        dispatch(a_fetchNewlyAddedList());
        dispatch(a_fetchMonthHighlightsList());
    }, [])

    return (
        <div className=' bg-gray-200 dark:bg-darkBg'>
            <div className='flex flex-col gap-2 px-4 bg-cover bg-no-repeat pt-2 lg:pt-0'>
                <div className='flex flex-col gap-4 md:flex-row md:h-96'>
                    <div className='w-full md:w-3/5 h-48 md:h-full rounded-lg'>
                        <HomeSingleCarousel
                            itemCount="3"
                            images={explore.artworks.slice(0, 3).map((item, index) => {
                                return {
                                    id: index,
                                    file: item.files[0],
                                    title: item.title,
                                    artist: item.artist.username
                                }
                            })} />
                    </div>
                    <div className='flex flex-col gap-4 w-full md:w-2/5'>
                        <div className='w-full h-full py-5 md:py-0 backdrop-sepia-0 bg-white/50 dark:bg-black/50 rounded-lg'>
                            <div className='flex h-full relative text-black dark:text-white'>
                                <div className='flex flex-col h-fit w-fit m-auto items-start'>
                                    <h2 className='flex flex-col'>
                                        <span className='font-nunito text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider'>Check out the</span>
                                        <span className='font-nunito text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wider font-black text-indigo-600 dark:text-indigo-600'>Trending Category</span>
                                        <span className='font-nunito text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider'>of the day</span>
                                    </h2>
                                    <button onClick={() => navigate(`/explore?filter=trending`)} className="bg-gradient-to-r font-nunito font-semibold from-indigo-600 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Explore</button>
                                </div>
                            </div>
                        </div>
                        <div className='w-full h-full py-5 md:py-0 backdrop-sepia-0 bg-white/30 dark:bg-black/30 rounded-lg'>
                            <div className='flex h-full text-black dark:text-white'>
                                <div className='flex h-fit w-fit m-auto items-center space-x-2 lg:space-x-4'>
                                    <div className='flex h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32'>
                                        <span className='m-auto text-center'>
                                            <img className='rounded-md' src={AppQR} />
                                        </span>
                                    </div>
                                    <h2 className='font-nunito w-min text-md md:text-xl lg:text-2xl font-bold uppercase tracking-wider'>Download the app for<br /> <span className='text-2xl md:text-3xl lg:text-5xl font-black'>free!</span></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mt-4'>
                <HighlightList type="trending" title="Trending" list={explore.artworks} />
                <HighlightList type="new" title="Newly Added" list={explore.new_artworks} />
                <HighlightList type="popular" title="Highlights of the Month" list={explore.highlight_artworks} />
            </div>
        </div >
    )
}

export default Home;
