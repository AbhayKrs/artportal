import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Helmet } from 'react-helmet';

import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducer';
import { a_featuredArtworks, a_fetchArtworks } from '../store/actions/artworks.actions';

import MasonryGrid from '../components/Grids/Masonry';
import PostList from '../components/Lists/PostList';
import ImageCarousel from '../components/Carousels/ImageCaroursel';
import PostInput from '../components/PostInput';
import Divider from '../components/Divider';

import AppQR from '../assets/images/artportal_appQR.png';
import { ReactComponent as ViewsIcon } from '../assets/icons/views.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import { a_fetchPosts } from '../store/actions/posts.actions';

const Home = (props) => {
    const dispatch = useDispatch();
    const hidePane = useOutletContext();

    const artworks = useSelector(state => state.artworks);
    const posts = useSelector(state => state.posts);

    const [sidePane, setSidePane] = useState(true);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(r_setLoader(true));
        dispatch(a_featuredArtworks({ filter: "new", period: "" }));
    }, [])

    return (
        <div className='md:relative flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-darkBg'>
            <Helmet>
                <title>artportal</title>
            </Helmet>
            <div className={`flex flex-col gap-2 ${hidePane ? sidePane ? 'md:w-[74%]' : 'md:w-full' : sidePane ? 'md:w-[70.5%]' : 'md:w-full'} order-2 md:order-1 py-2 px-8 md:px-16 min-h-show`}>
                <PostInput />
                <PostList list={posts.main_list} />
            </div>
            {sidePane &&
                <div className={`relative px-2 py-3 h-full md:fixed max-h-show md:right-2 flex flex-col gap-3 w-full md:w-[25%] order-1 md:order-2 backdrop-sepia-0 bg-white/30 dark:bg-black/30 border-l-2 border-gray-400 dark:border-neutral-800`}>
                    <div className='flex flex-col gap-3 px-1 h-full overflow-y-auto'>
                        <div className='flex flex-col gap-2'>
                            <span className={`flex gap-1 text-lg font-medium tracking-wide text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                                Trending Now
                            </span>
                            <div className='flex flex-row flex-wrap gap-1.5 w-full'>
                                {["painting", "scifi", "landscape", "character"].map(itm => (
                                    <button className='flex rounded-lg bg-gray-300 dark:bg-neutral-800 p-2'>
                                        <span className='text-sm text-neutral-800 dark:text-gray-300'>#{itm}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Divider noPadding />
                        <div className='flex flex-col gap-2'>
                            <span className={`flex gap-1 text-lg font-medium tracking-wide text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                                Featured Artist
                            </span>
                            <div className='flex flex-col gap-2 p-3 justify-between w-full backdrop-sepia-0 bg-white/30 dark:bg-black/30 rounded-lg'>
                                <div className='flex flex-col'>
                                    <p className='text-neutral-800 dark:text-gray-200 text-lg font-medium'>Akunta</p>
                                    <a href="#" className='flex flex-row items-center gap-1 text-neutral-800 dark:text-gray-200 text-sm font-medium'>
                                        @akn787
                                    </a>
                                </div>
                                <ImageCarousel size={12} fit="cover" imagePaths={artworks.featured_list.flatMap(item => item.files)} />
                            </div>
                        </div>
                        <Divider noPadding />
                        <div className='flex flex-col gap-2'>
                            <span className={`flex gap-1 text-lg font-medium tracking-wide text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                                Top Spaces
                            </span>
                            <div className='flex flex-col gap-1.5 h-24 overflow-y-auto'>
                                {["characterdesign", "3Ddesign"].map(itm => (
                                    <button className='flex gap-2 items-center rounded-lg hover:bg-gray-300 hover:dark:bg-neutral-800 p-2'>
                                        <div className="h-8 w-8 bg-violet-600/25 rounded-full"></div>
                                        <div className='flex flex-col'>
                                            <span className='text-sm text-neutral-800 dark:text-gray-300'>{itm}</span>
                                            <span className='text-sm text-neutral-800 dark:text-gray-300'>65k posts</span>
                                        </div>
                                    </button>
                                ))}
                                {["characterdesign", "3Ddesign"].map(itm => (
                                    <button className='flex gap-2 items-center rounded-lg hover:bg-gray-300 hover:dark:bg-neutral-800 p-2'>
                                        <div className="h-8 w-8 bg-violet-600/25 rounded-full"></div>
                                        <div className='flex flex-col'>
                                            <span className='text-sm text-neutral-800 dark:text-gray-300'>{itm}</span>
                                            <span className='text-sm text-neutral-800 dark:text-gray-300'>65k posts</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Divider noPadding />
                        <div className='flex flex-row gap-4 mx-auto items-center'>
                            <h2 className='w-min text-md md:text-xl lg:text-xl font-bold uppercase text-center tracking-wide text-neutral-800 dark:text-gray-200'>Download the app for<br /> <span className='text-2xl md:text-3xl lg:text-4xl font-black'>free!</span></h2>
                            <div className='flex h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32'>
                                <span className='relative m-auto text-center rounded-md'>
                                    {!showQR && <button className='flex absolute rounded-md z-10 inset-0 m-auto items-center justify-center backdrop-blur-sm' onClick={() => setShowQR(true)}>
                                        <ViewsIcon className='w-8 h-8 text-neutral-600 dark:text-black/75' />
                                    </button>}
                                    <img className='rounded-md shadow-md' src={AppQR} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Home;
