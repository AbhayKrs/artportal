import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { api_fetchUserImages } from '../utils/api_routes';

import { ImageCard } from './Card';
import { AwardConfirmModal } from './Modal';
import Dropdown from './Dropdown';

import { awardTabPanelHeaders, exploreFilters, explorePeriodOptions } from '../utils/constants';
import { useSelector } from 'react-redux';

export const HomeTabPanel = ({ tags, artworks, }) => {
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
        <div className="p-2 h-fit bg-gray-200 dark:bg-darkBg">
            <div className='flex'>
                <button onClick={() => goPrev()} aria-label="slide backward" className="px-1.5 z-30 left-0 cursor-pointer bg-gray-400/50 dark:bg-neutral-700 rounded-tl-md">
                    <svg className="dark:text-gray-200 h-3 w-3" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 1L1 7L7 13" stroke="currentColor" />
                    </svg>
                </button>
                <div className='flex overflow-hidden bg-gray-300 dark:bg-neutral-800'>
                    <ul id='tabSlider' className="flex ">
                        {tags.map((tag, index) => {
                            return <li key={index} onClick={() => setActiveStatus(index)} className={index === activeStatus ? "text-sm text-gray-600 bg-indigo-300 mr-1" : "text-sm text-gray-600 dark:text-gray-400 flex items-center mr-1 hover:text-indigo-700 cursor-pointer"}>
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
            {artworks.length > 0 ?
                <div className="grid bg-gray-300 dark:bg-neutral-800 overflow-hidden rounded-b-md lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-1">
                    {tags.map((tag, index) => {
                        return <Fragment key={index}>
                            {
                                index === activeStatus && artworks.filter(item => item.tags.includes(tag) === true).map((explore, index) => (
                                    <ImageCard size='l' key={index} explore={explore} artist={explore.artist} />
                                ))
                            }
                        </Fragment>
                    })}
                </div>
                :
                <div className='flex justify-center items-center  text-lg text-gray-800 dark:text-gray-300 bg-gray-300 dark:bg-neutral-800 h-full min-h-[20em]'>No artworks found...</div>
            }
        </div >
    )
}

export const AwardTabPanel = ({ awards, user, exploreID, awardClose, handleAwardExplore }) => {
    const [activeStatus, setActiveStatus] = useState(0);
    const [confirmData, setConfirmData] = useState({ open: false, award: {} });

    return (
        <div className="p-2 h-fit bg-slate-100 dark:bg-neutral-800">
            <div className='flex'>
                <div className='flex w-full overflow-hidden bg-gray-100 dark:bg-neutral-800'>
                    <ul id='tabSlider' className="flex ">
                        {awardTabPanelHeaders.map((awardType, index) => {
                            return <li key={index} onClick={() => setActiveStatus(index)} className={index === activeStatus ? "text-sm text-gray-900 dark:font-medium bg-blue-700 mr-1 rounded-t-md" : "text-sm text-gray-600 rounded-t-md dark:text-gray-400 dark:bg-neutral-700 flex items-center mr-1 hover:text-indigo-700 cursor-pointer"}>
                                <div className=" flex items-center uppercase">
                                    <span className="p-2 pb-1">{awardType}</span>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
            <div className="scrollbar w-fit grid max-h-96 gap-6 bg-gray-300 dark:bg-neutral-900 p-5 overflow-x-hidden rounded-b-md lg:grid-cols-6 xs:grid-cols-4" >
                {awards.map((award, index) => {
                    return <Fragment key={index}>
                        {index === activeStatus && awards.map((award, index) => (
                            <button className='flex flex-col items-center' key={index} onClick={() => setConfirmData({ open: true, award })}>
                                {award.icon.length > 0 && <img loading='lazy' style={{ width: '3em', height: '3em' }} src={api_fetchUserImages(award.icon)} />}
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
                    user={user}
                    exploreID={exploreID}
                    onClose={() => setConfirmData({ open: false, award: {} })}
                    awardClose={awardClose}
                    handleAwardExplore={handleAwardExplore}
                />
            }
        </div >
    )
}

export const ExplorePanel = ({ search, a_filterExploreList, searchExploreList }) => {
    let navigate = useNavigate();

    const common = useSelector(state => state.common);

    const [triggerEffect, setTriggerEffect] = useState(false);
    const [exploreSearch, setExploreSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [activePeriod, setActivePeriod] = useState('');
    const [activePeriodLabel, setActivePeriodLabel] = useState('Select a time period');

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        if (search && params.query) {
            setExploreSearch(params.query);
        }

        if (params.filter || params.period) {
            params.filter ? setActiveFilter(params.filter) : setActiveFilter('');

            if (params.filter === 'trending' || params.filter === 'new' || params.filter === 'rising') {
                setActivePeriod('');
            } else {
                params.period ? setActivePeriod(params.period) : setActivePeriod('month')
            }

            let label = params.period && explorePeriodOptions.some(item => item.value === params.period) ?
                explorePeriodOptions.find(item => item.value === params.period).label
                :
                'Select a time period'
            setActivePeriodLabel(label);
        }
        setTriggerEffect(true);
    }, []);

    useEffect(() => {
        if (triggerEffect) {
            //case 1 - No search / No Filter / No Period
            console.log('case1', exploreSearch.length === 0 && activeFilter.length === 0 && activePeriod.length === 0)
            if (exploreSearch.length === 0 && activeFilter.length === 0 && activePeriod.length === 0) {
                navigate('/explore?filter=trending');
                a_filterExploreList('trending');
            }

            //case 2 - Search / No Filter / No Period
            console.log('case2', exploreSearch.length > 0 && activeFilter.length === 0 && activePeriod.length === 0)
            if (exploreSearch.length > 0 && activeFilter.length === 0 && activePeriod.length === 0) {
                navigate(`/explore/search?query=${exploreSearch}`);
                // searchExploreList(exploreSearch);
            }

            //case 3 - Search / Filter / No Period
            console.log('case3', exploreSearch.length > 0 && activeFilter.length > 0 && activePeriod.length === 0)
            if (exploreSearch.length > 0 && activeFilter.length > 0 && activePeriod.length === 0) {
                navigate(`/explore/search?query=${exploreSearch}&filter=${activeFilter.replace(/\s+/g, '+')}`);
                // searchExploreList(exploreSearch, activeFilter.replace(/\s+/g, '+'));
            }

            //case 4 - Search / Filter / Period
            console.log('case4', exploreSearch.length > 0 && activeFilter.length > 0 && activePeriod.length > 0)
            if (exploreSearch.length > 0 && activeFilter.length > 0 && activePeriod.length > 0) {
                navigate(`/explore/search?query=${exploreSearch}&filter=${activeFilter.replace(/\s+/g, '+')}&period=${activePeriod.replace(/\s+/g, '+')}`);
                // searchExploreList(exploreSearch, activeFilter.replace(/\s+/g, '+'), activePeriod.replace(/\s+/g, '+'));
            }

            //case 5 - No Search / Filter / No Period
            console.log('case5', exploreSearch.length === 0 && activeFilter.length > 0 && activePeriod.length === 0)
            if (exploreSearch.length === 0 && activeFilter.length > 0 && activePeriod.length === 0) {
                navigate(`?filter=${activeFilter.replace(/\s+/g, '+')}`);
                a_filterExploreList(activeFilter.replace(/\s+/g, '+'));
            }

            //case 6 - No Search / Filter / Period
            console.log('case6', exploreSearch.length === 0 && activeFilter.length > 0 && activePeriod.length > 0)
            if (exploreSearch.length === 0 && activeFilter.length > 0 && activePeriod.length > 0) {
                navigate(`?filter=${activeFilter.replace(/\s+/g, '+')}&period=${activePeriod.replace(/\s+/g, '+')}`);
                a_filterExploreList(activeFilter.replace(/\s+/g, '+'), activePeriod.replace(/\s+/g, '+'));
            }

        }
    }, [triggerEffect, exploreSearch, activeFilter, activePeriod])

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

    return (
        <div className={`flex sm:flex-row gap-2 flex-col w-full items-center bg-slate-100/75 dark:bg-darkBg/75 sticky z-20`}>
            <div className='flex w-full items-center sm:justify-start justify-between'>
                <div className='lg:flex hidden'>
                    <ul id='tabSlider' className="flex flex-row gap-4 items-center whitespace-nowrap">
                        {exploreFilters.map((filter, index) => {
                            return <li key={index} onClick={() => selectFilter(filter.value)} className={`flex gap-1 cursor-pointer text-xl font-medium tracking-wide text-neutral-800 dark:text-gray-300 rounded-xl items-center`}>
                                <div className={`${filter.value === activeFilter ? 'flex' : 'hidden'} h-4 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                                {filter.label}
                            </li>
                        })}
                    </ul>
                </div>
                <div className="lg:hidden flex items-center cursor-pointer gap-2">
                    <Dropdown left name='filters' selectedPeriod={activeFilter === '' ? 'Select a filter' : activePeriodLabel} options={exploreFilters} onSelect={selectFilter} />
                </div>
                {activePeriod.length > 0 && <span className='text-gray-600 dark:text-gray-400 mx-2'>&#9679;</span>}
                {activePeriod.length > 0 ?
                    <div className="flex items-center cursor-pointer gap-2">
                        {window.innerWidth > 640 ?
                            <Dropdown left name='period' selectedPeriod={activePeriodLabel} options={explorePeriodOptions} onSelect={handlePeriodChange} />
                            :
                            <Dropdown right name='period' selectedPeriod={activePeriodLabel} options={explorePeriodOptions} onSelect={handlePeriodChange} />
                        }
                    </div>
                    :
                    null}
            </div>
        </div>
    )
}

export const NotificationTabPanel = ({ awards, user, exploreID, awardClose, handleAwardExplore }) => {
    return (
        <div className="p-2 h-fit bg-slate-100 dark:bg-neutral-800">
            {/* <div className='flex'>
                <div className='flex w-full overflow-hidden bg-gray-100 dark:bg-neutral-800'>
                    <ul id='tabSlider' className="flex ">
                        {['artportal Specials', 'Community Made', 'Premium'].map((awardType, index) => {
                            return <li key={index} onClick={() => setActiveStatus(index)} className={index === activeStatus ? "text-sm text-gray-900 dark:font-medium bg-blue-700 mr-1 rounded-t-md" : "text-sm text-gray-600 rounded-t-md dark:text-gray-400 dark:bg-neutral-700 flex items-center mr-1 hover:text-indigo-700 cursor-pointer"}>
                                <div className=" flex items-center uppercase">
                                    <span className="p-2 pb-1">{awardType}</span>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
            <div className="scrollbar w-fit grid max-h-96 gap-6 bg-gray-300 dark:bg-neutral-900 p-5 overflow-x-hidden rounded-b-md lg:grid-cols-6 xs:grid-cols-4" >
                {awards.map((award, index) => {
                    return <Fragment key={index}>
                        {index === activeStatus && awards.map((award, index) => (
                            <button className='flex flex-col items-center' key={index} onClick={() => setConfirmData({ open: true, award })}>
                                <img loading='lazy' style={{ width: '3em', height: '3em' }} src={api_fetchUserImages(award.icon)} />
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
                    user={user}
                    exploreID={exploreID}
                    onClose={() => setConfirmData({ open: false, award: {} })}
                    awardClose={awardClose}
                    handleAwardExplore={handleAwardExplore}
                />
            } */}
        </div >
    )
}