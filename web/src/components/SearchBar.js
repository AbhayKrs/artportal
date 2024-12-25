import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { a_fetchSearchList } from '../store/actions/common.actions';

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

const SearchBar = ({ clearSearchList, activeSearch, setSearchType, explore, searchList }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const common = useSelector(state => state.common);

    const [searchVal, setSearchVal] = useState('');
    const [searchModal, setSearchModal] = useState(false);

    const searchModalRef = useRef(null);
    useSearchModalView(searchModalRef, clearSearchList);

    const handleSearch = (val) => {
        setSearchVal(val);
        if (val.length > 0) {
            dispatch(a_fetchSearchList({ type: activeSearch, value: val }))
            setSearchModal(true);
        } else {
            clearSearchList()
        }
    }

    const clearSearch = () => {
        clearSearchList();
        setSearchVal('');
    }


    const handleExploreSearch = () => {
        navigate(`/explore/search?query=${searchVal}`);
        clearSearchList();
    }

    return (
        <div className='relative flex xs:w-9/12 md:w-5/12 lg:w-6/12 text-gray-300 dark:text-gray-600 items-center'>
            <div
                ref={searchModalRef}
                onClick={() => {
                    if (activeSearch === '') {
                        setSearchType('artwork');
                    }
                    if (searchVal.length > 0) {
                        setSearchModal(true);
                    }
                }}
                className="flex w-full items-center bg-slate-300 dark:bg-neutral-800 rounded-xl p-0.5"
            >
                <div className="flex relative items-center justify-center px-2">
                    <MdSearch className='h-5 w-5 text-gray-600 dark:text-gray-100/30' />
                </div>
                {searchVal.length > 0 && <div className="flex relative items-center justify-center rounded border-2 border-gray-300 text-neutral-800 dark:text-gray-300 h-7 w-7 mr-2">
                    {activeSearch === 'artwork' && <FiAtSign className='h-4 w-4' />}
                    {activeSearch === 'tag' && <FaHashtag className='h-4 w-4' />}
                    {activeSearch === 'artist' && <FaGreaterThan className='h-4 w-4' />}
                </div>}
                <input
                    type="text"
                    name="search"
                    value={searchVal}
                    placeholder="Search..."
                    autoComplete="off"
                    className="w-full  font-normal tracking-wide bg-transparent text-neutral-800 dark:text-gray-200 placeholder-gray-600 dark:placeholder-gray-100/30 h-8 text-base focus:outline-none"
                    onChange={(ev) => handleSearch(ev.target.value)}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            dispatch(a_fetchSearchList({ type: activeSearch, value: searchVal }))
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
            <SearchModal
                open={searchModal}
                handleClose={() => setSearchModal(false)}
                betaMsg={common.betaMsg}
                searchVal={searchVal}
                explore={explore}
                searchList={searchList}
                setSearchVal={setSearchVal}
                activeSearch={activeSearch}
                fetchSearchList={(type, value) => dispatch(a_fetchSearchList({ type, value }))}
                clearSearch={clearSearch}
                handleExploreSearch={handleExploreSearch}
            />
        </div >
    )
}


export default SearchBar;