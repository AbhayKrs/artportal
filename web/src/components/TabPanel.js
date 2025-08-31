import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Dropdown from './Dropdown';

import { filters, periodOptions } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { a_fetchArtworks, a_searchArtworks } from '../store/actions/library.actions';

import { MdClose } from 'react-icons/md';
import { FiAtSign } from 'react-icons/fi';
import { FaChevronRight, FaHashtag, FaGreaterThan } from 'react-icons/fa6';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { r_clearSearchList } from '../store/reducers/common.reducers';

const TabPanel = ({ search }) => {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const common = useSelector(state => state.common);

    const [triggerEffect, setTriggerEffect] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [activePeriod, setActivePeriod] = useState('');
    const [activePeriodLabel, setActivePeriodLabel] = useState('Select a time period');

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        if (search && params.query) {
            setSearchVal(params.query);
        }

        if (params.filter || params.period) {
            params.filter ? setActiveFilter(params.filter) : setActiveFilter('');

            if (params.filter === 'trending' || params.filter === 'new' || params.filter === 'rising') {
                setActivePeriod('');
            } else {
                params.period ? setActivePeriod(params.period) : setActivePeriod('month')
            }

            let label = params.period && periodOptions.some(item => item.value === params.period) ?
                periodOptions.find(item => item.value === params.period).label
                :
                'Select a time period'
            setActivePeriodLabel(label);
        }
        setTriggerEffect(true);
    }, []);

    useEffect(() => {
        const activePath = search ? "search" : "library";
        console.log("activePath", activePath);

        if (triggerEffect) {
            //case 1 - No search / No Filter / No Period
            if (searchVal.length === 0 && activeFilter.length === 0 && activePeriod.length === 0) {
                navigate(`/${activePath}?filter=trending`);
                dispatch(a_fetchArtworks({ filter: "trending" }));
            }

            //case 2 - Search / No Filter / No Period
            if (searchVal.length > 0 && activeFilter.length === 0 && activePeriod.length === 0) {
                navigate(`/${activePath}?query=${searchVal}`);
            }

            //case 3 - Search / Filter / No Period
            if (searchVal.length > 0 && activeFilter.length > 0 && activePeriod.length === 0) {
                navigate(`/${activePath}?query=${searchVal}&filter=${activeFilter.replace(/\s+/g, '+')}`);
            }

            //case 4 - Search / Filter / Period
            if (searchVal.length > 0 && activeFilter.length > 0 && activePeriod.length > 0) {
                navigate(`/${activePath}?query=${searchVal}&filter=${activeFilter.replace(/\s+/g, '+')}&period=${activePeriod.replace(/\s+/g, '+')}`);
            }

            //case 5 - No Search / Filter / No Period
            if (searchVal.length === 0 && activeFilter.length > 0 && activePeriod.length === 0) {
                navigate(`/${activePath}?filter=${activeFilter.replace(/\s+/g, '+')}`);
                dispatch(a_fetchArtworks({ filter: activeFilter.replace(/\s+/g, '+') }))
            }

            //case 6 - No Search / Filter / Period
            if (searchVal.length === 0 && activeFilter.length > 0 && activePeriod.length > 0) {
                navigate(`/${activePath}?filter=${activeFilter.replace(/\s+/g, '+')}&period=${activePeriod.replace(/\s+/g, '+')}`);
                dispatch(a_fetchArtworks({ filter: activeFilter.replace(/\s+/g, '+'), period: activePeriod.replace(/\s+/g, '+') }))
            }

        }
    }, [triggerEffect, searchVal, activeFilter, activePeriod])

    const selectFilter = (item) => {
        if (activeFilter === item) {
            setActiveFilter('');
            setActivePeriod('');
            setActivePeriodLabel('Select a time period');
        } else {
            if (item === 'trending' || item === 'new' || item === 'rising') {
                setActivePeriod('');
                setActivePeriodLabel('Select a time period');
            } else {
                setActivePeriod('month');
                setActivePeriodLabel('Past Month');
            }
            setActiveFilter(item)
        }
    }

    const handlePeriodChange = (item) => {
        setActivePeriod(item.value);
        setActivePeriodLabel(item.label);
    }

    const clearSearch = () => {
        dispatch(r_clearSearchList())
        setSearchVal('');
    }

    const handleSearch = (val) => {
        setSearchVal(val);
        if (val.length > 0) {
            dispatch(a_searchArtworks({ value: val, filter: "", period: "" }));
        } else {
            clearSearch();
        }
    }

    return (
        <div className={`flex flex-col gap-2 w-full bg-slate-100/75 dark:bg-darkBg/75`}>
            {search && (
                <div className='flex flex-col gap-2 w-full'>
                    <div className="flex w-6/12 items-center bg-slate-300 dark:bg-neutral-800 rounded-xl py-2 px-4 gap-2">
                        <div className="flex relative items-center justify-center">
                            <SearchIcon className="h-4 w-4 text-neutral-800 dark:text-gray-300" />
                        </div>
                        {searchVal.length > 0 && <div className="flex relative items-center justify-center rounded dark:text-gray-300 h-7 w-7 mr-2">
                            {common.activeSearch === 'artwork' && <FiAtSign className='h-4 w-4' />}
                            {common.activeSearch === 'tag' && <FaHashtag className='h-4 w-4' />}
                            {common.activeSearch === 'artist' && <FaGreaterThan className='h-4 w-4' />}
                        </div>}
                        <input
                            type="text"
                            name="search"
                            value={searchVal}
                            placeholder="Search..."
                            autoComplete="off"
                            className="w-full bg-transparent text-neutral-800 dark:text-gray-200 placeholder-gray-600 dark:placeholder-gray-300 text-xl focus:outline-none"
                            onChange={(ev) => handleSearch(ev.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    switch (common.activeSearch) {
                                        case 'artwork': {
                                            dispatch(a_searchArtworks({ value: searchVal, filter: "", period: "" }))
                                        }
                                    }
                                }
                            }}
                        />
                        {searchVal.length === 0 ?
                            '' :
                            <button className="flex items-center justify-center text-neutral-800 dark:text-gray-300 h-full w-12" onClick={() => setSearchVal('')}>
                                <MdClose className='h-5 w-5' />
                            </button>
                        }
                    </div>
                </div>
            )}
            <div className='flex flex-row w-full justify-between'>
                {search && (
                    <div className='flex flex-row gap-2'>
                        <button disabled={common.activeSearch === 'artwork'} onClick={() => { dispatch(a_searchArtworks({ value: searchVal, filter: "", period: "" })) }} className={`flex gap-1 items-center tracking-wide ${common.activeSearch === 'artwork' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                            <FiAtSign className='h-4 w-4' />
                            <span className=' font-semibold text-base'>Artworks</span>
                        </button>
                        <span className='flex text-neutral-700 dark:text-gray-300'>&#8226;</span>
                        <button disabled={searchVal.length === 0} onClick={() => { dispatch(a_searchArtworks({ value: searchVal })) }} className={`flex gap-1 items-center tracking-wide ${common.activeSearch === 'tag' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'} disabled:text-gray-300 dark:disabled:text-neutral-500`}>
                            <FaHashtag className='h-4 w-4' />
                            <span className=' font-semibold text-base'>Tags</span>
                        </button>
                        <span className='flex text-neutral-700 dark:text-gray-300'>&#8226;</span>
                        <button disabled={searchVal.length === 0} onClick={() => { dispatch(a_searchArtworks({ value: searchVal })) }} className={`flex gap-1 items-center tracking-wide ${common.activeSearch === 'artist' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'} disabled:text-gray-300 dark:disabled:text-neutral-500`}>
                            <FaGreaterThan className='h-4 w-4' />
                            <span className=' font-semibold text-base'>Artists</span>
                        </button>
                    </div>
                )}
                {(!search || (search && common.activeSearch === "artwork")) && (
                    <div className='flex items-center'>
                        <div className='lg:flex hidden'>
                            <ul id='tabSlider' className="flex flex-row gap-4 items-center whitespace-nowrap">
                                {filters.map((filter, index) => {
                                    return (
                                        <li
                                            key={index}
                                            onClick={() => selectFilter(filter.value)}
                                            className={`flex gap-1 cursor-pointer text-lg font-medium tracking-wide text-neutral-800 dark:text-gray-300 rounded-xl items-center`}
                                        >
                                            <div className={`${filter.value === activeFilter ? 'flex' : 'hidden'} h-4 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                                            {filter.label}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="lg:hidden flex items-center cursor-pointer gap-2">
                            <Dropdown left name='filters' selectedPeriod={activeFilter === '' ? 'Select a filter' : activePeriodLabel} options={filters} onSelect={selectFilter} />
                        </div>
                        {activePeriod.length > 0 && <span className='text-gray-600 dark:text-gray-400 mx-2'>&#9679;</span>}
                        {activePeriod.length > 0 ?
                            <div className="flex items-center cursor-pointer gap-2">
                                {window.innerWidth > 640 ?
                                    <Dropdown left name='period' selectedPeriod={activePeriodLabel} options={periodOptions} onSelect={handlePeriodChange} />
                                    :
                                    <Dropdown right name='period' selectedPeriod={activePeriodLabel} options={periodOptions} onSelect={handlePeriodChange} />
                                }
                            </div>
                            :
                            null}
                    </div>
                )}
            </div>
        </div>
    )
}

export default TabPanel;