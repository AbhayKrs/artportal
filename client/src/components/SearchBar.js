import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, } from 'react-router-dom';

import { FaGreaterThan, FaHashtag } from 'react-icons/fa6';
import { MdSearch, MdClose } from 'react-icons/md';
import { FiAtSign } from 'react-icons/fi';
import { SearchModal } from './Modal';

const useSearchModalView = (ref, clearSearch) => {

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                clearSearch();
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [ref]);
}

const SearchBar = (props) => {
    let navigate = useNavigate();
    const [searchVal, setSearchVal] = useState('');

    const searchModalRef = useRef(null);
    useSearchModalView(searchModalRef, props.clearSearchList);

    const handleSearch = (val) => {
        setSearchVal(val);
        val.length > 0 ?
            props.fetchSearchList(props.activeSearch, val)
            :
            props.clearSearchList()
    }

    const clearSearch = () => {
        props.clearSearchList();
        setSearchVal('');
    }


    const handleExploreSearch = () => {
        navigate(`/explore/search?query=${searchVal}`);
        props.clearSearchList();
    }

    return (
        <div className='relative flex xs:w-9/12 md:w-5/12 lg:w-6/12 text-gray-300 dark:text-gray-600 items-center'>
            <div
                ref={searchModalRef}
                onClick={() => {
                    if (props.activeSearch === '') {
                        props.fetchSearchList('artwork', searchVal)
                        props.setSearchType('artwork');
                    }
                }}
                className="flex w-full items-center bg-slate-300 dark:bg-neutral-800 rounded-xl p-0.5"
            >
                <div className="flex relative items-center justify-center px-2">
                    <MdSearch className='h-5 w-5 text-gray-600 dark:text-gray-100/30' />
                </div>
                {searchVal.length > 0 && <div className="flex relative items-center justify-center rounded border-2 border-gray-300 text-neutral-800 dark:text-gray-300 h-7 w-7 mr-2">
                    {props.activeSearch === 'artwork' && <FiAtSign className='h-4 w-4' />}
                    {props.activeSearch === 'tag' && <FaHashtag className='h-4 w-4' />}
                    {props.activeSearch === 'artist' && <FaGreaterThan className='h-4 w-4' />}
                </div>}
                <input
                    type="text"
                    name="search"
                    value={searchVal}
                    placeholder="Search..."
                    autoComplete="off"
                    className="w-full font-nunito font-normal tracking-wide bg-transparent text-neutral-800 dark:text-gray-200 placeholder-gray-600 dark:placeholder-gray-100/30 h-8 text-base focus:outline-none"
                    onChange={(ev) => handleSearch(ev.target.value)}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            props.fetchSearchList(props.activeSearch, searchVal)
                        }
                    }}
                />
                {searchVal.length === 0 ?
                    '' :
                    <button className="flex items-center justify-center text-neutral-800 dark:text-gray-300 h-full w-12" onClick={() => setSearchVal('')}>
                        <MdClose className='h-5 w-5' />
                    </button>
                }
                <SearchModal
                    open={searchVal.length > 0}
                    betaMsg={props.betaMsg}
                    searchVal={searchVal}
                    explore={props.explore}
                    searchList={props.searchList}
                    setSearchVal={setSearchVal}
                    activeSearch={props.activeSearch}
                    fetchSearchList={props.fetchSearchList}
                    clearSearch={clearSearch}
                    handleExploreSearch={handleExploreSearch}
                />
            </div>
        </div >
    )
}


export default SearchBar;