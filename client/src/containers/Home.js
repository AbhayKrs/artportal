import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { HomeTabPanel } from '../components/TabPanel';
import { fetchExploreList } from '../store/actions/explore.actions';
import { setLoader, getTags } from '../store/actions/common.actions';
import { MultipleCarousel, HomeMultiCarousel, HomeSingleCarousel } from '../components/Carousel';

import HomeWallpaper from '../assets/images/homeWallpaper.jpg'
import AppQR from '../assets/images/artyst_appQR.png';
import { HorizontalCard } from '../components/Card';

const Home = (props) => {
    let navigate = useNavigate();

    useEffect(() => {
        props.setLoader(true);
        window.scrollTo(0, 0);
        props.fetchExploreList();
        props.getTags();
    }, [])
    return (
        <div className='main-container bg-gray-200 dark:bg-darkNavBg'>
            <div className='flex flex-col gap-2 p-4 bg-cover bg-no-repeat' style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(0,0,0,0.8)), url(${HomeWallpaper})`,
            }}>
                <div className='flex flex-col md:flex-row h-[29.5rem] md:h-96 relative'>
                    <div className='absolute xs:w-full md:w-[52%] h-48 md:h-full inset-y-0 left-0' style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}>
                        <HomeSingleCarousel />
                    </div>
                    <div className='absolute top-[12.5rem] md:top-0 right-0 w-full md:w-1/2 h-40 p-2 md:p-0 md:h-48 backdrop-sepia-0 bg-white/50 dark:bg-black/50' style={{ clipPath: 'polygon(8% 0%, 100% 0px, 85% 75%, 2.5% 100%)' }}>
                        <div className='h-full relative text-black dark:text-white'>
                            <div className='flex flex-col md:flex-row absolute h-auto md:h-fit w-fit inset-0 m-auto items-start md:items-center md:space-x-4'>
                                <h2 className='font-caviar text-md md:text-2xl font-bold uppercase tracking-wider'>Check out the<br /><span className='text-2xl md:text-4xl font-black text-violet-400 dark:text-violet-500'>Trending Category</span><br />of the day</h2>
                                <button onClick={() => navigate(`/explore?filter=trending`)} className="bg-gradient-to-r font-caviar font-semibold from-violet-500 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                            </div>
                        </div>
                    </div>
                    <div className='absolute bottom-0 right-0 w-full md:w-1/2 h-36 md:h-60 p-[50px 30px 10px] md:p-0 backdrop-sepia-0 bg-white/30 dark:bg-black/30' style={{ clipPath: 'polygon(5% 25%, 100% 4%, 100% 100%, 0% 100%)' }}>
                        <div className='h-full relative text-black dark:text-white'>
                            <div className='flex absolute h-fit w-fit inset-0 mx-auto mt-auto mb-2 md:mb-9 items-center space-x-4'>
                                <div className='flex h-24 w-24 md:h-32 md:w-32'>
                                    <span className='m-auto text-center'>
                                        <img src={AppQR} />
                                    </span>
                                </div>
                                <h2 className='font-caviar text-md md:text-2xl font-bold uppercase tracking-wider'>Download the app <br className='md:none' /> for <br /> <span className='text-2xl md:text-5xl font-black'>free!</span></h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col md:flex-row gap-5 py-5 px-2 md:px-20'>
                <div className='flex flex-col w-full'>
                    <h2 className='font-josefinlight font-bold text-3xl text-violet-500'>New & Trending</h2>
                    <div className='h-1 bg-violet-500 w-10 mb-2 rounded'></div>
                    <div className='flex flex-col space-y-2'>
                        {props.explore.exploreList.sort(() => 0.5 - Math.random()).slice(0, 3).map((explore, index) => (
                            <HorizontalCard key={index} explore={explore} author={explore.author} />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    <h2 className='font-josefinlight font-bold text-3xl text-violet-500'>Highlights of the Month</h2>
                    <div className='h-1 bg-violet-500 w-10 mb-2 rounded'></div>
                    <div className='flex flex-col space-y-2'>
                        {props.explore.exploreList.sort(() => 0.5 - Math.random()).slice(0, 3).map((explore, index) => (
                            <HorizontalCard key={index} explore={explore} author={explore.author} />
                        ))}
                    </div>
                </div>
            </div>
            <HomeTabPanel tags={props.common.tags} exploreList={props.explore.exploreList} />
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    explore: state.explore,
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader,
    fetchExploreList,
    getTags
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
