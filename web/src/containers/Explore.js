import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { api_fetchArtworkImages } from '../utils/api_routes';
import { a_fetchExploreList, a_filterExploreList } from '../store/actions/explore.actions';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducers';

import Masonry from '../components/Masonry';

import { BsHeart, BsChat } from 'react-icons/bs';
import { BiTimeFive } from 'react-icons/bi';
import { ExplorePanel } from '../components/TabPanel';
import { Helmet } from 'react-helmet';

const Explore = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const common = useSelector(state => state.common);
    const artworks = useSelector(state => state.explore.artworks);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className=' bg-gray-200 dark:bg-darkBg'>
            <Helmet>
                <title>artportal | Explore</title>
            </Helmet>
            <ExplorePanel authenticated={common.isAuthenticated} r_setSnackMessage={(msgData) => dispatch(r_setSnackMessage(msgData))} a_fetchExploreList={() => dispatch(a_fetchExploreList())} a_filterExploreList={(filter, period) => dispatch(a_filterExploreList({ filter, period }))} tags={common.tags} />
            {artworks.length > 0 ?
                <div className='flex flex-row'>
                    <Masonry cols={5}>
                        {artworks.map((artwork, index) => (
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
                                    <div className="flex flex-col self-end place-items-end space-y-1.5">
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

export default Explore;


{/* <label className="flex items-center cursor-pointer">
                            <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                            <p className=' font-semibold text-sm'>New</p>
                        </label> */}