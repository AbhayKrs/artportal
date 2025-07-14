import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

import { r_setLoader } from '../store/reducers/common.reducers';
import { a_fetchExploreList, a_filterExploreList } from '../store/actions/explore.actions';
import { api_fetchArtworkImages } from '../utils/api_routes';

import Masonry from '../components/Masonry';
import { ExplorePanel } from '../components/TabPanel';

import { BsHeart, BsChat } from 'react-icons/bs';
import { BiTimeFive } from 'react-icons/bi';

const ExploreSearch = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const explore = useSelector(state => state.explore);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
    }, []);

    return (
        <div className=' bg-gray-200 dark:bg-darkBg'>
            <ExplorePanel search a_fetchExploreList={() => dispatch(a_fetchExploreList())} a_filterExploreList={(filter, period) => dispatch(a_filterExploreList({ filter, period }))} />
            <div className='flex flex-row'>
                <Masonry cols={5}>
                    {explore.artworks.map((explore, index) => (
                        <div onClick={() => navigate(`/explore/${explore._id}`)} className='relative group group-hover:block'>
                            <img loading='lazy'
                                id={index}
                                className='object-cover w-full h-full'
                                src={api_fetchArtworkImages(explore.files[0])}
                            />
                            <div className='hidden absolute bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row w-full bg-gradient-to-t from-black text-gray-200 group-hover:flex group-hover:justify-between'>
                                <div className="flex flex-col place-self-end max-w-[65%]">
                                    <h3 className="text-lg text-base font-bold leading-5 capitalize break-words">{explore.title}</h3>
                                    <div className='flex'>
                                        <span className="font-base text-xs my-1 mr-1">
                                            {explore.author.username}
                                        </span>
                                        <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex flex-col place-items-end gap-1">
                                    <div className="inline-flex items-center">
                                        <BsHeart className='h-4 w-4' />
                                        <span className="text-xs ml-1 antialiased">{explore.likes.length}</span>
                                    </div>
                                    <div className="inline-flex items-center">
                                        <BsChat className='h-4 w-4' />
                                        <span className="text-xs ml-1 antialiased">{explore.comment_count}</span>
                                    </div>
                                    <div className="inline-flex items-center">
                                        <BiTimeFive className='h-4 w-4' />
                                        <span className="text-xs ml-1 antialiased">{moment(explore.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Masonry>
            </div>
        </div >
    )
}

export default ExploreSearch;