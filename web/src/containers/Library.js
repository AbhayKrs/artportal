import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet';

import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducer';
import { ReactComponent as EventsIcon } from '../assets/icons/events.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';

import ArtworksGridList from '../components/Lists/ArtworksGridList';
import Divider from '../components/Divider';
import EventCard from '../components/Cards/EventCard';
import LibraryTabs from '../components/Tabs/LibraryTabs';

const Library = ({ }) => {
    const dispatch = useDispatch();
    const hidePane = useOutletContext();

    const artworks = useSelector(state => state.artworks);

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
                    <ArtworksGridList list={artworks.main_list} />
                    :
                    <div className='absolute inset-0 h-fit w-fit m-auto text-center text-gray-300'>
                        <h2 className='text-2xl'>It's empty in here!</h2>
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