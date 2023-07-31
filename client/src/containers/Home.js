import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { HomeTabPanel } from '../components/TabPanel';
import { fetchExploreList } from '../store/actions/explore.actions';
import { setLoader } from '../store/actions/common.actions';
import { HomeSingleCarousel } from '../components/Carousel';

import AppQR from '../assets/images/artyst_appQR.png';
import HighlightList from '../components/HighlightList';

const Home = (props) => {
    let navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        props.setLoader(true);
        props.fetchExploreList();
    }, [])

    return (
        <div className='main-container bg-gray-200 dark:bg-darkNavBg'>
            <div className='flex flex-col gap-2 px-4 bg-cover bg-no-repeat pt-2 lg:pt-0'>
                <div className='flex flex-col gap-4 md:flex-row md:h-96'>
                    <div className='w-full md:w-3/5 h-48 md:h-full rounded-lg'>
                        <HomeSingleCarousel
                            itemCount="3"
                            images={props.explore.exploreList.sort(() => 0.5 - Math.random()).slice(0, 3).map((item, index) => {
                                return {
                                    id: index,
                                    file: item.files[0],
                                    title: item.title,
                                    artist: item.author.username
                                }
                            })} />
                    </div>
                    <div className='flex flex-col gap-4 w-full md:w-2/5'>
                        <div className='w-full h-full py-5 md:py-0 backdrop-sepia-0 bg-white/50 dark:bg-black/50 rounded-lg'>
                            <div className='flex h-full relative text-black dark:text-white'>
                                <div className='flex flex-col space-y-2 h-fit w-fit m-auto items-start'>
                                    <h2 className='font-caviar text-lg leading-[1.125rem] md:text-xl lg:text-2xl font-bold uppercase tracking-wider'>Check out the<br /><span className='text-xl md:text-2xl lg:text-3xl font-black text-violet-400 dark:text-violet-500'>Trending Category</span><br />of the day</h2>
                                    <button onClick={() => navigate(`/explore?filter=trending`)} className="bg-gradient-to-r font-caviar font-semibold from-violet-500 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Explore</button>
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
                                    <h2 className='font-caviar w-min text-md md:text-xl lg:text-2xl font-bold uppercase tracking-wider'>Download the app for<br /> <span className='text-2xl md:text-3xl lg:text-5xl font-black'>free!</span></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col'>
                <HighlightList type="new" title="Newly Added" list={props.explore.exploreList.sort(() => 0.5 - Math.random()).slice(0, 8)} />
                <HighlightList type="trending" title="Trending" list={props.explore.exploreList.sort(() => 0.4 - Math.random()).slice(0, 12)} />
                <HighlightList type="popular" title="Highlights of the Month" list={props.explore.exploreList.sort(() => 0.4 - Math.random()).slice(0, 8)} />
            </div>
            {/* <HomeTabPanel tags={props.common.tags} exploreList={props.explore.exploreList} /> */}
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
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
