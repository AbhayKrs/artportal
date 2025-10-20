import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';

import { r_setLoader } from '../store/reducers/common.reducer';

import PostList from '../components/Lists/PostList';
import ArtworksGridList from '../components/Lists/ArtworksGridList';
import Dropdown from '../components/Dropdown';
import Divider from '../components/Divider';

import { filterOptions, periodOptions } from '../utils/constants';

import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { MdClose } from 'react-icons/md';


const Search = ({ }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const posts = useSelector(state => state.posts);
    const artworks = useSelector(state => state.artworks);

    const [searchVal, setSearchVal] = useState('');
    const [searchType, setSearchType] = useState('posts');
    const [activeFilter, setActiveFilter] = useState('');
    const [activeFilterLabel, setActiveFilterLabel] = useState('Select a filter');
    const [activePeriod, setActivePeriod] = useState('');
    const [activePeriodLabel, setActivePeriodLabel] = useState('Select a time period');

    const params = new Proxy(new URLSearchParams(location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
    }, []);

    useEffect(() => {
        if (params.q !== null) {
            setSearchVal(params.q);
        } else {
            setSearchVal('');
        }

        if (params.type) {
            setSearchType(params.type);
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
    }, [location.search]);

    const selectFilter = (item) => {
        const params = new URLSearchParams(location.search);

        if (activeFilter === item.value) {
            setActiveFilter('');
            setActiveFilterLabel('Select a filter');
            setActivePeriod('');
            setActivePeriodLabel('Select a time period');
            params.delete('filter');
        } else {
            if (item.value === 'trending' || item.value === 'new' || item.value === 'rising') {
                setActivePeriod('');
                setActivePeriodLabel('Select a time period');
                params.delete('period');
            } else {
                setActivePeriod('month');
                setActivePeriodLabel('Past Month');
                params.set('period', 'month');
            }
            setActiveFilter(item.value);
            setActiveFilterLabel(item.label);

            params.set('filter', item.value);
        }
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }

    const handlePeriodChange = (item) => {
        const params = new URLSearchParams(location.search);

        setActivePeriod(item.value);
        setActivePeriodLabel(item.label);

        params.set('period', item.value);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }

    const handleSearch = (val) => {
        const params = new URLSearchParams(location.search);
        setSearchVal(val);
        params.set('q', val);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }

    const clearSearch = () => {
        setSearchVal('');
    }

    const searchContent = () => {
        switch (searchType) {
            case 'artworks': return (
                <ArtworksGridList search={searchVal} list={artworks.main_list} />
            )
            case 'posts': return (
                <PostList search={searchVal} list={posts.main_list} />
            )
            default: return null;
        }
    }

    const handleTabChange = (val) => {
        const params = new URLSearchParams(location.search);
        params.set("type", val); // change only 'type' param
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    return (
        <div className='relative bg-gray-200 dark:bg-darkBg p-4'>
            <Helmet>
                <title>artportal | Search</title>
            </Helmet>
            <div className={`flex flex-col gap-2 w-full bg-slate-100/75 dark:bg-darkBg/75`}>
                <div className='flex flex-col gap-2'>
                    <div className="flex w-6/12 items-center bg-slate-300 dark:bg-neutral-800 rounded-xl py-2 px-4 gap-2">
                        <div className="flex relative items-center justify-center">
                            <SearchIcon className="h-4 w-4 text-neutral-800 dark:text-gray-300" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            value={searchVal}
                            placeholder="Search..."
                            autoComplete="off"
                            className="w-full bg-transparent text-neutral-800 dark:text-gray-200 placeholder-gray-600 dark:placeholder-gray-300 text-base focus:outline-none"
                            onChange={(ev) => handleSearch(ev.target.value)}
                        />
                        {searchVal.length === 0 ?
                            '' :
                            <button className="flex items-center justify-center text-neutral-800 dark:text-gray-300 h-full w-12" onClick={clearSearch}>
                                <MdClose className='h-5 w-5' />
                            </button>
                        }
                    </div>
                </div>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row gap-2 items-center'>
                        <button disabled={searchType === 'posts'} onClick={() => handleTabChange("posts")} className={`flex gap-1 items-center tracking-wide ${searchType === 'posts' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                            <span className='font-semibold text-base'>Posts</span>
                        </button>
                        <span className='flex text-neutral-500'>&#8226;</span>
                        <button disabled={searchType === 'artworks'} onClick={() => handleTabChange("artworks")} className={`flex gap-1 items-center tracking-wide ${searchType === 'artworks' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                            <span className='font-semibold text-base'>Artworks</span>
                        </button>
                        <span className='flex text-neutral-500'>&#8226;</span>
                        <button disabled={searchType === 'artists'} onClick={() => handleTabChange("artists")} className={`flex gap-1 items-center tracking-wide ${searchType === 'artists' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                            <span className='font-semibold text-base'>Artists</span>
                        </button>
                    </div>
                    <div className='flex items-center'>
                        <Dropdown
                            right
                            name='filters'
                            selected={activeFilterLabel}
                            options={filterOptions}
                            onSelect={selectFilter}
                        />
                        {activePeriod.length > 0 &&
                            <>
                                {window.innerWidth > 640 ?
                                    <Dropdown
                                        right
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
                </div>
            </div>
            <Divider />
            {searchContent()}
        </div >
    )
}

export default Search;