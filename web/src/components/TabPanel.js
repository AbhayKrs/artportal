import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Dropdown from './Dropdown';

import { filterOptions, periodOptions } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { a_fetchArtworks, a_searchArtworks } from '../store/actions/library.actions';

import { MdClose } from 'react-icons/md';
import { FiAtSign } from 'react-icons/fi';
import { FaHashtag, FaGreaterThan } from 'react-icons/fa6';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { r_clearSearchList, r_setSearchType } from '../store/reducers/common.reducers';
import { a_getTags } from '../store/actions/common.actions';

const TabPanel = ({ search }) => {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const common = useSelector(state => state.common);

    const [triggerEffect, setTriggerEffect] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [activeFilterLabel, setActiveFilterLabel] = useState('Select a filter');
    const [activePeriod, setActivePeriod] = useState('');
    const [activePeriodLabel, setActivePeriodLabel] = useState('Select a time period');

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    useEffect(() => {
        const activePath = search ? "search" : "library";

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
    }, [triggerEffect, searchVal, activeFilter, activePeriod]);

    useEffect(() => {
        if (search && params.query) {
            setSearchVal(params.query);
        }

        if (params.filter || params.period) {
            params.filter ? setActiveFilter(params.filter) : setActiveFilter('');
            let filterlabel = params.filter && filterOptions.some(item => item.value === params.filter) ?
                filterOptions.find(item => item.value === params.filter).label
                :
                'Select a filter'
            setActiveFilterLabel(filterlabel);
            if (params.filter === 'trending' || params.filter === 'new' || params.filter === 'rising') {
                setActivePeriod('');
            } else {
                params.period ? setActivePeriod(params.period) : setActivePeriod('month')
            }

            let periodlabel = params.period && periodOptions.some(item => item.value === params.period) ?
                periodOptions.find(item => item.value === params.period).label
                :
                'Select a time period'
            setActivePeriodLabel(periodlabel);
        }
        setTriggerEffect(true);
    }, []);

    const selectFilter = (item) => {
        if (activeFilter === item.value) {
            setActiveFilter('');
            setActiveFilterLabel('Select a filter');
            setActivePeriod('');
            setActivePeriodLabel('Select a time period');
        } else {
            if (item.value === 'trending' || item.value === 'new' || item.value === 'rising') {
                setActivePeriod('');
                setActivePeriodLabel('Select a time period');
            } else {
                setActivePeriod('month');
                setActivePeriodLabel('Past Month');
            }
            setActiveFilter(item.value);
            setActiveFilterLabel(item.label);
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
            dispatch(a_searchArtworks({ value: val, filter: activeFilter.replace(/\s+/g, '+'), period: activePeriod.replace(/\s+/g, '+') }));
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
                            className="w-full bg-transparent text-neutral-800 dark:text-gray-200 placeholder-gray-600 dark:placeholder-gray-300 text-base focus:outline-none"
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
            <div className='flex flex-row gap-6 w-full'>
                {search && (
                    <div className='flex flex-row gap-2 items-center'>
                        <button disabled={common.activeSearch === 'artwork'} onClick={() => { dispatch(r_setSearchType('artwork')); dispatch(a_searchArtworks({ value: searchVal, filter: "", period: "" })) }} className={`flex gap-1 items-center tracking-wide ${common.activeSearch === 'artwork' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                            <FiAtSign className='h-4 w-4' />
                            <span className='font-semibold text-base'>Artworks</span>
                        </button>
                        <span className='flex text-neutral-500'>&#8226;</span>
                        <button disabled={searchVal.length === 0} onClick={() => { dispatch(a_getTags()); dispatch(a_searchArtworks({ value: searchVal })) }} className={`flex gap-1 items-center tracking-wide ${common.activeSearch === 'tag' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'} disabled:text-gray-300 dark:disabled:text-neutral-500`}>
                            <FaHashtag className='h-4 w-4' />
                            <span className='font-semibold text-base'>Tags</span>
                        </button>
                        <span className='flex text-neutral-500'>&#8226;</span>
                        <button disabled={searchVal.length === 0} onClick={() => { dispatch(r_setSearchType('artist')); dispatch(a_searchArtworks({ value: searchVal })) }} className={`flex gap-1 items-center tracking-wide ${common.activeSearch === 'artist' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'} disabled:text-gray-300 dark:disabled:text-neutral-500`}>
                            <FaGreaterThan className='h-4 w-4' />
                            <span className='font-semibold text-base'>Artists</span>
                        </button>
                    </div>
                )}
                {(!search || (search && common.activeSearch === "artwork")) && (
                    <div className='flex items-center'>
                        <Dropdown
                            left
                            name='filters'
                            selected={activeFilterLabel}
                            options={filterOptions}
                            onSelect={selectFilter}
                        />
                        {activePeriod.length > 0 &&
                            <>
                                {window.innerWidth > 640 ?
                                    <Dropdown
                                        left
                                        name='period'
                                        selected={activePeriodLabel}
                                        options={periodOptions}
                                        onSelect={handlePeriodChange}
                                    />
                                    :
                                    <Dropdown
                                        right
                                        name='period'
                                        selected={activePeriodLabel}
                                        options={periodOptions}
                                        onSelect={handlePeriodChange}
                                    />
                                }
                            </>
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default TabPanel;