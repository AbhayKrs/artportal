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
        <div className='relative flex text-gray-300 dark:text-gray-600 w-full items-center'>
            <div
                ref={searchModalRef}
                onClick={() => {
                    if (props.activeSearch === '') {
                        props.fetchSearchList('artwork', searchVal)
                        props.setSearchType('artwork');
                    }
                }}
                className="flex w-full items-center bg-slate-300 dark:bg-neutral-800 h-10 rounded-xl"
            >
                <div className="flex relative items-center justify-center text-neutral-800 dark:text-gray-300 h-8 px-2">
                    <MdSearch className='h-6 w-6' />
                </div>
                {props.activeSearch != '' && <div className="flex relative items-center justify-center rounded border-[1px] border-solid border-gray-200 text-neutral-800 dark:text-gray-300 h-7 w-7 mr-2">
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
                    className="w-full font-caviar font-semibold tracking-wide bg-transparent text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-300 h-10 text-lg focus:outline-none"
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
                    open={props.activeSearch.length > 0}
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