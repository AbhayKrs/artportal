import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ImageCard } from './Card';
import { AwardConfirmModal } from './Modal';
import { MdUpload, MdClose } from 'react-icons/md';
import Dropdown from './Dropdown';
import SearchBar from './SearchBar';

import { fetchUserImages } from '../api';

export const HomeTabPanel = (props) => {
    const [activeStatus, setActiveStatus] = useState(0);
    let defaultTransform = 0;

    const goNext = () => {
        defaultTransform = defaultTransform - 600;
        var tabSlider = document.getElementById("tabSlider");
        if (Math.abs(defaultTransform) >= tabSlider.scrollWidth / 1.05)
            defaultTransform = 0;
        tabSlider.style.transform = "translateX(" + defaultTransform + "px)";
    }
    const goPrev = () => {
        var tabSlider = document.getElementById("tabSlider");
        if (Math.abs(defaultTransform) === 0) defaultTransform = 0;
        else defaultTransform = defaultTransform + 600;
        tabSlider.style.transform = "translateX(" + defaultTransform + "px)";
    }

    return (
        <div className="p-2 h-fit bg-gray-200 dark:bg-darkNavBg">
            <div className='flex'>
                <button onClick={() => goPrev()} aria-label="slide backward" className="px-1.5 z-30 left-0 cursor-pointer bg-gray-400/50 dark:bg-neutral-700 rounded-tl-md">
                    <svg className="dark:text-gray-200 h-3 w-3" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 1L1 7L7 13" stroke="currentColor" />
                    </svg>
                </button>
                <div className='flex overflow-hidden bg-gray-300 dark:bg-neutral-800'>
                    <ul id='tabSlider' className="flex ">
                        {props.tags.map((tag, index) => {
                            return <li key={index} onClick={() => setActiveStatus(index)} className={index === activeStatus ? "text-sm text-gray-600 bg-violet-300 mr-1" : "text-sm text-gray-600 dark:text-gray-400 flex items-center mr-1 hover:text-indigo-700 cursor-pointer"}>
                                <div className="flex items-center">
                                    <span className="p-2 font-normal">{tag}</span>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
                <button onClick={() => goNext()} aria-label="slide forward" className="px-1.5 z-30 right-0 cursor-pointer bg-gray-400/50 dark:bg-neutral-700 rounded-tr-md">
                    <svg className="dark:text-gray-200 h-3 w-3" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L1 13" stroke="currentColor" />
                    </svg>
                </button>
            </div>
            {props.exploreList.length > 0 ?
                <div className="grid bg-gray-300 dark:bg-neutral-800 overflow-hidden rounded-b-md lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-1">
                    {props.tags.map((tag, index) => {
                        return <Fragment key={index}>
                            {
                                index === activeStatus && props.exploreList.filter(item => item.tags.includes(tag) === true).map((explore, index) => (
                                    <ImageCard key={index} explore={explore} author={explore.author} />
                                ))
                            }
                        </Fragment>
                    })}
                </div>
                :
                <div className='flex justify-center items-center font-josefinlight text-lg text-gray-800 dark:text-gray-300 bg-gray-300 dark:bg-neutral-800 h-full min-h-[20em]'>No artworks found...</div>
            }
        </div >
    )
}

export const AwardTabPanel = (props) => {
    const [activeStatus, setActiveStatus] = useState(0);
    const [confirmData, setConfirmData] = useState({ open: false, award: {} });

    return (
        <div className="p-2 h-fit bg-slate-100 dark:bg-neutral-800">
            <div className='flex'>
                <div className='flex w-full overflow-hidden bg-gray-100 dark:bg-neutral-800'>
                    <ul id='tabSlider' className="flex ">
                        {['Artyst Specials', 'Community Made', 'Premium'].map((awardType, index) => {
                            return <li key={index} onClick={() => setActiveStatus(index)} className={index === activeStatus ? "text-sm text-gray-900 dark:font-medium bg-violet-500 mr-1 rounded-t-md" : "text-sm text-gray-600 rounded-t-md dark:text-gray-400 dark:bg-neutral-700 flex items-center mr-1 hover:text-indigo-700 cursor-pointer"}>
                                <div className="font-josefinregular flex items-center uppercase">
                                    <span className="p-2 pb-1">{awardType}</span>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
            <div className="scrollbar grid max-h-96 gap-6 bg-gray-300 dark:bg-neutral-900 p-5 overflow-x-hidden rounded-b-md lg:grid-cols-6 xs:grid-cols-2" >
                {props.awards.map((award, index) => {
                    return <Fragment key={index}>
                        {index === activeStatus && props.awards.map((award, index) => (
                            <button key={index} onClick={() => setConfirmData({ open: true, award })}>
                                <img loading='lazy' style={{ width: '3em', height: '3em' }} src={fetchUserImages(award.icon)} />
                                <p className="font-bold font-serif text-right text-neutral-700 dark:text-gray-300 text-sm">{award.value}</p>
                            </button>
                        ))}
                    </Fragment>
                })}
            </div>
            {confirmData.open &&
                <AwardConfirmModal
                    open={confirmData.open}
                    awardData={confirmData.award}
                    user={props.user}
                    exploreID={props.exploreID}
                    onClose={() => setConfirmData({ open: false, award: {} })}
                    handleAwardExplore={props.handleAwardExplore}
                />
            }
        </div >
    )
}

export const FilterPanel = (props) => {
    let navigate = useNavigate();

    const [exploreSearch, setExploreSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState(-1);
    const [activePeriod, setActivePeriod] = useState('');
    const [activePeriodLabel, setActivePeriodLabel] = useState('Select a time period');

    const filters = [
        { id: 0, label: 'Trending', value: 'trending' },
        { id: 1, label: 'Popular', value: 'popular' },
        { id: 2, label: 'New', value: 'new' },
        { id: 3, label: 'Rising', value: 'rising' },
        { id: 4, label: 'Most Discussed', value: 'most discussed' }
    ];

    const periodOptions = [
        { id: 1, label: 'Past hour', value: 'hour' },
        { id: 2, label: 'Past 24 hours', value: 'day' },
        { id: 3, label: 'Past week', value: 'week' },
        { id: 4, label: 'Past month', value: 'month' },
        { id: 5, label: 'Past year', value: 'year' },
        { id: 6, label: 'All time', value: 'all time' }
    ]

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        if (params.filter || params.period) {
            setActiveFilter(filters.map(x => { return x.value }).indexOf(params.filter));
            params.period ? setActivePeriod(params.period) : setActivePeriod('');
        }
    }, []);

    useEffect(() => {
        let label = activePeriod && periodOptions.find(item => item.value === activePeriod) ?
            periodOptions.find(item => item.value === activePeriod).label
            :
            'Select a time period'
        setActivePeriodLabel(label);

        if (activeFilter < 0) {
            props.fetchExploreList();
            navigate('/explore');
        } else {
            if (activeFilter === 0 || activeFilter === 2 || activeFilter === 3) {
                setActivePeriod('')
                navigate(`?filter=${filters[activeFilter].value.replace(/\s+/g, '+')}`);
                props.filterExploreList(filters[activeFilter].value.replace(/\s+/g, '+'));
            } else {
                activePeriod.length <= 0 && setActivePeriod('month')
                navigate(`?filter=${filters[activeFilter].value.replace(/\s+/g, '+')}&period=${activePeriod}`);
                props.filterExploreList(filters[activeFilter].value.replace(/\s+/g, '+'), activePeriod);
            }
        }
    }, [activeFilter, activePeriod])

    const selectFilter = (item) => {
        if (activeFilter === item) {
            setActiveFilter(-1);
            setActivePeriod('')
        } else {
            setActiveFilter(item.id)
        }
        console.log('activeFilter', activeFilter, item);
    }

    const handlePeriodChange = (popular) => {
        setActivePeriod(popular.value)
    }

    const handleExploreSearch = () => {
        if (activeFilter < 0) {
            navigate(`/explore/search?query=${exploreSearch}`);
        } else if (activeFilter === 0 || activeFilter === 2 || activeFilter === 3) {
            navigate(`/explore/search?query=${exploreSearch}&filter=${filters[activeFilter].value.replace(/\s+/g, '+')}`);

        } else {
            navigate(`/explore/search?query=${exploreSearch}&filter=${filters[activeFilter].value.replace(/\s+/g, '+')}&period=${activePeriod}`);
        }
    }

    return (
        <div className='flex sm:flex-row gap-2 flex-col w-full items-center bg-slate-100/75 dark:bg-darkNavBg/75 p-2 sticky top-14 z-20'>
            <div className='flex w-full items-center sm:justify-start justify-between'>
                <div className='lg:flex hidden overflow-hidden'>
                    <ul id='tabSlider' className="flex space-x-2 items-center">
                        {filters.map((filter, index) => {
                            return <li key={index} onClick={() => selectFilter(filter)} className={index === activeFilter ? "font-caviar text-sm font-bold tracking-wider text-gray-700 bg-violet-300 rounded-lg h-fit shadow" : "font-caviar text-sm font-bold tracking-wider text-gray-700 dark:text-gray-400 bg-slate-200 dark:bg-neutral-900 flex items-center shadow cursor-pointer rounded-lg h-fit"}>
                                <div className="flex items-center">
                                    <span className="py-2 px-3 capitalize">{filter.label}</span>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
                <div className="lg:hidden flex items-center cursor-pointer space-x-2">
                    <Dropdown left name='filters' selectedPeriod={activeFilter === -1 ? 'Select a filter' : activeFilter >= 0 && filters[activeFilter].label} options={filters} onSelect={selectFilter} />
                </div>
                {activePeriod.length > 0 && <span className='text-gray-600 dark:text-gray-400 mx-2'>&#9679;</span>}
                {activePeriod.length > 0 ?
                    <div className="flex items-center cursor-pointer space-x-2">
                        {window.innerWidth > 640 ?
                            <Dropdown left name='period' selectedPeriod={activePeriodLabel} options={periodOptions} onSelect={handlePeriodChange} />
                            :
                            <Dropdown right name='period' selectedPeriod={activePeriodLabel} options={periodOptions} onSelect={handlePeriodChange} />
                        }
                    </div>
                    :
                    null}
            </div>
            <div className='flex w-full max-w-[25rem] sm:ml-auto'>
                <SearchBar searchValue={exploreSearch} setSearchValue={setExploreSearch} handleSubmit={handleExploreSearch} />
                <button type="button" className='btn ml-2 bg-violet-500 drop-shadow-xl p-2.5 items-center shadow-lg rounded-xl' onClick={() => navigate(`/explore/new `)}>
                    <MdUpload className='h-6 w-full text-white' />
                </button>
            </div>
        </div>
    )
}

export const SearchFilterPanel = (props) => {
    let navigate = useNavigate();

    const [exploreSearch, setExploreSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState(-1);
    const [activePeriod, setActivePeriod] = useState('');
    const [activePeriodLabel, setActivePeriodLabel] = useState('Select a time period');

    const filters = ['trending', 'popular', 'new', 'rising', 'most discussed'];

    const periodOptions = [
        { id: 1, label: 'Past hour', value: 'hour' },
        { id: 2, label: 'Past 24 hours', value: 'day' },
        { id: 3, label: 'Past week', value: 'week' },
        { id: 4, label: 'Past month', value: 'month' },
        { id: 5, label: 'Past year', value: 'year' },
        { id: 6, label: 'All time', value: 'all time' }
    ]

    const handlePeriodChange = (popular) => {
        setActivePeriod(popular.value)
    }

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        setExploreSearch(params.query);
        if (params.filter || params.period) {
            params.filter && setActiveFilter(filters.indexOf(params.filter));
            params.period ? setActivePeriod(params.period) : setActivePeriod('');
        }
    }, []);

    useEffect(() => {
        let label = activePeriod && periodOptions.find(item => item.value === activePeriod) ?
            periodOptions.find(item => item.value === activePeriod).label
            :
            'Select a time period'
        setActivePeriodLabel(label);
        if (exploreSearch.length === 0) {
            props.fetchExploreList();
            navigate('/explore');
        }
        if (activeFilter < 0) {
            props.searchExploreList(exploreSearch);
            navigate(`/explore/search?query=${exploreSearch}`);
        } else {
            if (activeFilter === 0 || activeFilter === 2 || activeFilter === 3) {
                navigate(`/explore/search?query=${exploreSearch}&filter=${filters[activeFilter].replace(/\s+/g, '+')}`);
                props.searchExploreList(exploreSearch, filters[activeFilter].replace(/\s+/g, '+'));
            } else {
                setActivePeriod('month')
                navigate(`/explore/search?query=${exploreSearch}&filter=${filters[activeFilter].replace(/\s+/g, '+')}&period=${activePeriod}`);
                props.searchExploreList(exploreSearch, filters[activeFilter].replace(/\s+/g, '+'), activePeriod);
            }
        }
    }, [exploreSearch, activeFilter, activePeriod])

    const selectFilter = (index) => {
        if (activeFilter === index) {
            setActiveFilter(-1);
            setActivePeriod('')
        } else {
            setActiveFilter(index)
        }
    }

    const handleExploreSearch = () => {
        if (activeFilter < 0) {
            navigate(`/explore/search?query=${exploreSearch}`);
        } else if (activeFilter === 0 || activeFilter === 2 || activeFilter === 3) {
            navigate(`/explore/search?query=${exploreSearch}&filter=${filters[activeFilter].replace(/\s+/g, '+')}`);

        } else {
            navigate(`/explore/search?query=${exploreSearch}&filter=${filters[activeFilter].replace(/\s+/g, '+')}&period=${activePeriod}`);
        }
    }

    return (
        <div className='flex w-full items-center bg-slate-100/75 dark:bg-darkNavBg/75 p-2 sticky top-14 z-20'>
            <div className='flex overflow-hidden'>
                <ul id='tabSlider' className="flex space-x-2 items-center">
                    {filters.map((filter, index) => {
                        return <li key={index} onClick={() => selectFilter(index)} className={index === activeFilter ? "font-caviar text-sm font-bold tracking-wider text-gray-700 bg-violet-300 rounded-lg h-fit shadow" : "font-caviar text-sm font-bold tracking-wider text-gray-700 dark:text-gray-400 bg-slate-200 dark:bg-neutral-900 flex items-center shadow cursor-pointer rounded-lg h-fit"}>
                            <div className="flex items-center">
                                <span className="py-2 px-3 capitalize">{filter}</span>
                            </div>
                        </li>
                    })}
                </ul>
            </div>
            <span className='text-gray-600 dark:text-gray-400 mx-2'>&#9679;</span>
            <div className="flex items-center cursor-pointer space-x-2">
                <Dropdown left name='period' selectedPeriod={activePeriodLabel} options={periodOptions} onSelect={handlePeriodChange} />
            </div>
            <SearchBar searchValue={exploreSearch} setSearchValue={setExploreSearch} handleSubmit={handleExploreSearch} />
            <button type="button" className='btn ml-2 bg-violet-700 drop-shadow-xl p-2.5 items-center shadow-lg rounded-xl' onClick={() => navigate(`/explore/new `)}>
                <MdUpload className='h-6 w-full text-gray-200' />
            </button>
        </div>
    )
}