import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';

import { filterOptions, periodOptions } from '../utils/constants';

import { r_clearSearchList, r_setLoader } from '../store/reducers/common.reducer';
import { api_artworkImages } from '../utils/api_routes';
import { a_fetchArtworks, a_searchArtworks } from '../store/actions/artworks.actions';

import MasonryGrid from '../components/Grids/Masonry';
import Dropdown from '../components/Dropdown';
import Divider from '../components/Divider';

import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { MdClose } from 'react-icons/md';
import PostList from '../components/PostList';

const Search = ({ }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const posts = useSelector(state => state.posts);
    const artworks = useSelector(state => state.artworks);
    const common = useSelector(state => state.common);

    const [searchVal, setSearchVal] = useState('');
    const [searchType, setSearchType] = useState('posts');
    const [activeFilter, setActiveFilter] = useState('');
    const [activeFilterLabel, setActiveFilterLabel] = useState('Select a filter');
    const [activePeriod, setActivePeriod] = useState('');
    const [activePeriodLabel, setActivePeriodLabel] = useState('Select a time period');

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let searchList = [];

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
    }, []);

    useEffect(() => {
        if (params.q) {
            setSearchVal(params.q);
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

    useEffect(() => {
        if (common.activeSearch === "artwork") {
            searchList = artworks.main_list;
        } else if (common.activeSearch === 'tag') {
            searchList = common.tags;
        } else { }
    }, [common.activeSearch])

    const searchContent = () => {
        switch (searchType) {
            case 'artworks': return (
                <MasonryGrid cols={5}>
                    {artworks.main_list.map((item, index) => (
                        <div onClick={() => navigate(`/library/${item._id}`)} className='relative group group-hover:block cursor-pointer'>
                            <img loading='lazy'
                                id={index}
                                className='object-cover w-full h-full rounded'
                                src={api_artworkImages(item.files[0])}
                            />
                            {/* <div className='hidden absolute bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row w-full bg-gradient-to-t from-black text-gray-200 group-hover:justify-between'>
                            <div className="flex flex-col place-self-end max-w-[65%]">
                                <h3 className="text-lg font-bold leading-5 capitalize break-words">{item.title}</h3>
                                <div className='flex'>
                                    <span className="font-base text-xs my-1 mr-1">
                                        {item.artist.username}
                                    </span>
                                    <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col place-items-end gap-1">
                                <div className="inline-flex items-center">
                                    <BsHeart className='h-4 w-4' />
                                    <span className="text-xs ml-1 antialiased">{item.likes.length}</span>
                                </div>
                                <div className="inline-flex items-center">
                                    <BsChat className='h-4 w-4' />
                                    <span className="text-xs ml-1 antialiased">{item.comment_count}</span>
                                </div>
                                <div className="inline-flex items-center">
                                    <BiTimeFive className='h-4 w-4' />
                                    <span className="text-xs ml-1 antialiased">{moment(item.createdAt).fromNow()}</span>
                                </div>
                            </div>
                        </div> */}
                        </div>
                    ))}
                </MasonryGrid>
            )
            case 'posts': return (
                <PostList list={posts.main_list} />
            )
            default: return null;
        }
    }

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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    switch (searchType) {
                                        case 'artworks': {
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
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row gap-2 items-center'>
                        <button disabled={searchType === 'posts'} onClick={() => { dispatch(a_searchArtworks({ value: searchVal, filter: "", period: "" })) }} className={`flex gap-1 items-center tracking-wide ${searchType === 'posts' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                            <span className='font-semibold text-base'>Posts</span>
                        </button>
                        <span className='flex text-neutral-500'>&#8226;</span>
                        <button disabled={searchType === 'artworks'} onClick={() => { dispatch(a_searchArtworks({ value: searchVal, filter: "", period: "" })) }} className={`flex gap-1 items-center tracking-wide ${searchType === 'artworks' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                            <span className='font-semibold text-base'>Artworks</span>
                        </button>
                        <span className='flex text-neutral-500'>&#8226;</span>
                        <button disabled={searchType === 'artists'} onClick={() => { dispatch(a_searchArtworks({ value: searchVal })) }} className={`flex gap-1 items-center tracking-wide ${searchType === 'artists' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'} disabled:text-gray-300 dark:disabled:text-neutral-500`}>
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