import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import moment from 'moment';

import { api_fetchArtworkImages } from '../utils/api_routes';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducers';
import { a_fetchHomeData, a_fetchExploreList, a_filterExploreList } from '../store/actions/explore.actions';

import { HomeSingleCarousel } from '../components/Carousel';
import HighlightList from '../components/HighlightList';

import AppQR from '../assets/images/artportal_appQR.png';
import Masonry from '../components/Masonry';

import { BsHeart, BsChat } from 'react-icons/bs';
import { BiTimeFive } from 'react-icons/bi';
import Divider from '../components/Divider';
import { Helmet } from 'react-helmet';
import { ImageCard } from '../components/Card';

import { ReactComponent as ViewsIcon } from '../assets/icons/views.svg';

const Home = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const hidePane = useOutletContext();

    const explore = useSelector(state => state.explore);
    const common = useSelector(state => state.common);

    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(r_setLoader(true));
        dispatch(a_fetchHomeData());
    }, [])

    return (
        <div className='bg-gray-200 dark:bg-darkBg p-4'>
            <HighlightList type="trending" title="Trending" list={explore.trending_artworks} visibleItems={{ desktop: 7, tablet: 4, mobile: 2 }} />
            <Divider />
            <div className='flex gap-2 w-full backdrop-sepia-0 rounded-lg'>
                <div className='flex flex-col gap-4 w-8/12 p-4 backdrop-sepia-0 bg-white/30 dark:bg-black/30 rounded-lg'>
                    <div className='flex flex-col gap-2 justify-between w-full'>
                        <div className='flex flex-row gap-4 relative'>
                            <h2 className='font-medium text-2xl text-neutral-800 dark:text-gray-300'>Featured Artist</h2>
                            <div className='absolute h-1 w-8 bottom-[-2px] left-0 text-2xl bg-gray-300 rounded-md'></div>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-neutral-800 dark:text-gray-200 text-2xl font-medium tracking-wide'>Akunta</p>
                            <a href="#" className='flex flex-row items-center gap-1'>
                                <p className='text-neutral-800 dark:text-gray-200 text-sm font-medium tracking-wide'>#akn787</p>
                            </a>
                        </div>
                    </div>
                    <HighlightList title="" list={explore.trending_artworks.slice(0, 8)} visibleItems={{ desktop: 5, tablet: 2, mobile: 2 }} />
                </div>
                <div className='flex-1 w-2/12 content-center justify-items-center backdrop-sepia-0 bg-white/30 dark:bg-black/30 rounded-lg'>
                    <div className='flex flex-col gap-2 lg:gap-4 p-4'>
                        <div className='flex bg-neutral-900 h-24 w-24 md:h-28 md:w-28 lg:h-36 lg:w-36'>
                            <span className='m-auto text-center'>
                                {showQR ?
                                    <img className='rounded-md' src={AppQR} />
                                    :
                                    <button onClick={() => setShowQR(true)}>
                                        <ViewsIcon className='w-6 h-6 text-neutral-600 dark:text-neutral-400' />
                                    </button>
                                }
                            </span>
                        </div>
                        <h2 className='w-min text-md md:text-xl lg:text-xl font-bold uppercase text-center tracking-wider text-neutral-800 dark:text-gray-200'>Download the app for<br /> <span className='text-2xl md:text-3xl lg:text-5xl font-black'>free!</span></h2>
                    </div>
                </div>
                <div className='flex-1 w-2/12 content-center justify-items-center backdrop-sepia-0 bg-white/30 dark:bg-black/30 rounded-lg'>
                    <div className='flex flex-col gap-2 lg:gap-4 p-4'>
                        <div className='flex flex-row gap-4 relative'>
                            <h2 className='font-medium text-2xl text-neutral-800 dark:text-gray-300'>Categories</h2>
                            <div className='absolute h-1 w-8 bottom-[-2px] left-0 text-2xl bg-gray-300 rounded-md'></div>
                        </div>
                        <div className='flex flex-col'>
                            {["abstract", "nature", "concept", "abstract", "nature", "concept"].map(ctg => (
                                <>
                                    <h2 className='w-min text-md text-neutral-800 dark:text-gray-200'>{ctg}</h2>
                                    <Divider noPadding />
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            {explore.trending_artworks.length > 0 ?
                <div className='flex flex-row'>
                    <Masonry cols={5}>
                        {explore.trending_artworks.map((artwork, index) => (
                            <div key={index} onClick={() => navigate(`/explore/${artwork._id}`)} className='relative group group-hover:block cursor-pointer'>
                                <img loading='lazy'
                                    id={index}
                                    className='object-cover w-full h-full rounded'
                                    src={api_fetchArtworkImages(artwork.files[0])}
                                />
                                <div className='opacity-0 flex transition-all delay-200 absolute bottom-0 p-2 pt-14 group-hover:opacity-100 w-full bg-gradient-to-t from-black text-gray-200 justify-between'>
                                    <div className="flex flex-col place-self-end max-w-[65%]">
                                        <h4 className="text-md text-base  font-bold leading-5 break-words">{artwork.title.length > 20 ? artwork.title.slice(0, 20) + "..." : artwork.title}</h4>
                                        <div className='flex'>
                                            <p className="font-base text-xs my-1 mr-1">
                                                {artwork.artist.username}
                                            </p>
                                            <svg className="stroke-current stroke-1 text-indigo-600 dark:text-indigo-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col self-end place-items-end gap-1.5">
                                        <div className="inline-flex gap-1 items-end">
                                            <BsHeart className='h-4 w-4' />
                                            <p className="text-xs antialiased">{artwork.likes.length}</p>
                                        </div>
                                        <div className="inline-flex gap-1 items-end">
                                            <BsChat className='h-4 w-4' />
                                            <p className="text-xs antialiased">{artwork.comments.length}</p>
                                        </div>
                                        <div className="inline-flex gap-1 items-end">
                                            <BiTimeFive className='h-4 w-4' />
                                            <p className="text-xs antialiased">{moment(artwork.createdAt).fromNow()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Masonry>
                </div>
                :
                <div >
                    <div className='absolute inset-0 h-fit w-fit m-auto text-center text-gray-300'>
                        {/* <img loading='lazy' className='h-32 w-auto' src={emptyIcon} /> */}
                        <h2 className=' text-2xl'>It's empty in here!</h2>
                    </div>
                </div>
            }
        </div >
    )
}

export default Home;
