import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { api_artworkImages } from '../utils/api_routes';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducer';
import { ReactComponent as EventsIcon } from '../assets/icons/events.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';

import MasonryGrid from '../components/Grids/Masonry';
import Divider from '../components/Divider';
import EventCard from '../components/Cards/EventCard';
import LibraryTabs from '../components/Tabs/LibraryTabs';

import { BsHeart, BsChat } from 'react-icons/bs';
import { BiTimeFive } from 'react-icons/bi';
import { Helmet } from 'react-helmet';


const Library = ({ }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const common = useSelector(state => state.common);
    const artworks = useSelector(state => state.artworks);

    const hidePane = useOutletContext();
    const [eventsPane, setEventsPane] = useState(true);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='md:relative flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-darkBg'>
            <Helmet>
                <title>artportal | Library</title>
            </Helmet>
            <div className={`flex flex-col ${hidePane ? eventsPane ? 'md:w-[82.5%]' : 'md:w-full' : eventsPane ? 'md:w-[80%]' : 'md:w-full'} order-2 md:order-1 py-2 px-4 min-h-show`}>
                <LibraryTabs eventsPane={eventsPane} setEventsPane={setEventsPane} />
                <Divider />
                {artworks.main_list.length > 0 ?
                    <div className='flex flex-row'>
                        <MasonryGrid cols={5}>
                            {artworks.main_list.map((artwork, index) => (
                                <div key={index} onClick={() => navigate(`/artwork/${artwork._id}`)} className='relative group group-hover:block cursor-pointer'>
                                    <img loading='lazy'
                                        id={index}
                                        className='object-cover w-full h-full rounded'
                                        src={api_artworkImages(artwork.files[0])}
                                    />
                                    {/* <div className='opacity-0 flex transition-all delay-200 absolute bottom-0 p-2 pt-14 group-hover:opacity-100 w-full bg-gradient-to-t from-black text-gray-200 justify-between'>
                                        <div className="flex flex-col place-self-end max-w-[65%]">
                                            <h4 className="text-md text-base  font-bold leading-5 break-words">{artwork.title.length > 20 ? artwork.title.slice(0, 20) + "..." : artwork.title}</h4>
                                            <div className='flex'>
                                                <p className="font-base text-xs my-1 mr-1">
                                                    {artwork.artist.username}
                                                </p>
                                                <svg className="stroke-current stroke-1 text-blue-700 dark:text-blue-700 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                                    </div> */}
                                </div>
                            ))}
                        </MasonryGrid>
                    </div>
                    :
                    <div >
                        <div className='absolute inset-0 h-fit w-fit m-auto text-center text-gray-300'>
                            <h2 className='text-2xl'>It's empty in here!</h2>
                        </div>
                    </div>
                }
            </div>
            {eventsPane &&
                <div className={`relative max-h-show px-2 py-3 h-full md:fixed md:right-2 flex flex-col gap-3 w-full md:w-[17.5%] order-1 md:order-2 backdrop-sepia-0 bg-white/30 dark:bg-black/30 border-l-2 border-gray-400 dark:border-neutral-800`}>
                    <div className='flex flex-row justify-between px-2'>
                        <div className={`flex gap-1 text-lg font-medium tracking-wide text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                            <EventsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                            Events
                        </div>
                        <button onClick={() => setEventsPane(!eventsPane)}>
                            <CloseIcon className='h-4 w-auto text-neutral-800 dark:text-gray-300' />
                        </button>
                    </div>
                    <div className='flex flex-col px-1 gap-2 h-11/12 overflow-y-auto'>
                        {artworks.main_list.map((artwork, index) => (
                            <EventCard size="m" key={index} artwork={artwork} artist={artwork.artist} />
                        ))}
                    </div>
                </div>
            }
        </div >
    )
}

export default Library;