import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { api_artworkImages, api_userImages, api_googleRedirectURL, api_googleLogin } from '../../utils/api_routes';

import { MdSearch, MdClose } from 'react-icons/md';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';
import { BsArrowUpRightSquare } from 'react-icons/bs';
import { FaChevronRight, FaHashtag, FaGreaterThan } from 'react-icons/fa6';
import { FiAtSign } from 'react-icons/fi';

import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';

import ImageCard from './Cards/ImageCard';
import MasonryGrid from './Grids/Masonry';

const SearchModal = ({ open, handleClose, betaMsg, searchVal, setSearchVal, activeSearch, searchList, setSearchType, fetchSearchList, clearSearch, handleArtworkSearch }) => {
    let navigate = useNavigate();

    const handleSearch = (val) => {
        setSearchVal(val);
        if (val.length > 0) {
            fetchSearchList(activeSearch, val);
        } else {
            clearSearch();
        }
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className={`scrollbar fixed mx-auto ${betaMsg === true ? 'top-20' : 'top-14'} p-4 z-50 h-fit bg-slate-300 dark:bg-neutral-800 w-11/12 sm:w-8/12 md:w-9/12 rounded-xl`}>
                <IoCloseSharp onClick={handleClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                <div className="flex w-6/12 items-center bg-slate-300 dark:bg-neutral-700 rounded-xl py-2 px-4 gap-2">
                    <div className="flex relative items-center justify-center">
                        <SearchIcon className="h-5 w-5 text-neutral-800 dark:text-gray-400" />
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
                        className="w-full font-normal tracking-wide bg-transparent text-neutral-800 dark:text-gray-200 placeholder-gray-600 dark:placeholder-gray-100/30 text-xl focus:outline-none"
                        onChange={(ev) => handleSearch(ev.target.value)}
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                fetchSearchList(activeSearch, searchVal)
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
                <div className='flex flex-col w-full'>
                    <div className='sticky bottom-0 inset-x-0 flex flex-col md:flex-row items-center justify-between w-full p-2 bg-slate-300 dark:bg-neutral-800  gap-2'>
                        <div className='flex flex-row p-2 bg-slate-300 dark:bg-neutral-800  gap-2'>
                            <button disabled={activeSearch === 'artwork'} onClick={() => { fetchSearchList('artwork', searchVal) }} className={`flex gap-1 items-center tracking-wide ${activeSearch === 'artwork' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                                <FiAtSign className='h-4 w-4' />
                                <span className='font-semibold text-base'>Artworks</span>
                            </button>
                            <span className='flex text-neutral-700 dark:text-gray-300'>&#8226;</span>
                            <button disabled={activeSearch === 'tag'} onClick={() => { fetchSearchList('tag', searchVal) }} className={`flex gap-1 items-center tracking-wide ${activeSearch === 'tag' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                                <FaHashtag className='h-4 w-4' />
                                <span className='font-semibold text-base'>Tags</span>
                            </button>
                            <span className='flex text-neutral-700 dark:text-gray-300'>&#8226;</span>
                            <button disabled={activeSearch === 'artist'} onClick={() => { fetchSearchList('artist', searchVal) }} className={`flex gap-1 items-center tracking-wide ${activeSearch === 'artist' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                                <FaGreaterThan className='h-4 w-4' />
                                <span className='font-semibold text-base'>Artists</span>
                            </button>
                        </div>
                        <div className='flex flex-col md:flex-row p-2 bg-slate-300 dark:bg-neutral-800  gap-2'>
                            <button onClick={() => { handleArtworkSearch(); handleClose() }} className='flex  font-normal text-base gap-2 items-center tracking-wide text-neutral-700 dark:text-gray-300 hover:text-blue-700'>
                                {searchVal.length > 0 &&
                                    <>
                                        Search {activeSearch}s for '{searchVal}'
                                        <BsArrowUpRightSquare className='h-4 w-4' />
                                    </>
                                }
                            </button>
                        </div>
                    </div>
                    {/* <MasonryGrid cols={5}>
                        {library.trending_artworks.map((artwork, index) => (
                            <div key={index} onClick={() => navigate(`/library/${artwork._id}`)} className='relative group group-hover:block cursor-pointer'>
                                <img loading='lazy'
                                    id={index}
                                    className='object-cover w-full h-full rounded'
                                    src={api_artworkImages(artwork.files[0])}
                                />
                                <div className='opacity-0 flex transition-all delay-200 absolute bottom-0 p-2 pt-14 group-hover:opacity-100 w-full bg-gradient-to-t from-black text-gray-200 justify-between'>
                                    <div className="flex flex-col place-self-end max-w-[65%]">
                                        <h4 className="text-md text-base  font-bold leading-5 break-words">{artwork.title.length > 20 ? artwork.title.slice(0, 20) + "..." : artwork.title}</h4>
                                        <div className='flex'>
                                            <p className="font-base text-xs my-1 mr-1">
                                                {artwork.artist.username}
                                            </p>
                                            <svg className="stroke-current stroke-1 text-indigo-600 dark:text-indigo-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col self-end place-items-end gap-1.5">
                                        <div className="inline-flex gap-1 items-end">
                                            <BsHeart className='h-4 w-4' />
                                            <p className="text-xs antialiased">{artwork.likes.length}</p>
                                        </div>
                                        <div className="inline-flex gap-1 items-end">
                                            <BsChat className='h-4 w-4' />
                                            <p className="text-xs antialiased">{artwork.comments.length}</p>
                                        </div>
                                        <div className="inline-flex gap-1 items-end">
                                            <BiTimeFive className='h-4 w-4' />
                                            <p className="text-xs antialiased">{moment(artwork.createdAt).fromNow()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </MasonryGrid> */}
                    <div className='scrollbar max-h-full md:max-h-[30rem] overflow-y-auto'>
                        {activeSearch === 'artwork' &&
                            <div className='flex flex-col gap-2 pr-2'>
                                <MasonryGrid cols={6}>
                                    {searchList.length > 0 ?
                                        searchList.map((item, index) => (
                                            <ImageCard size="m" key={index} artwork={item} artist={item.artist} />
                                        ))
                                        // searchList.map((item, index) => (
                                        //     <div key={index} className='flex items-center gap-4 rounded-lg text-neutral-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-900 py-2 px-5'>
                                        //         <img src={api_artworkImages(item.files[0])} className='object-cover w-10 h-10 md:w-14 md:h-14 rounded' />
                                        //         <span className='text-base md:text-xl font-semibold leading-5 capitalize'>{item.title}</span>
                                        //         <FaChevronRight onClick={() => { navigate(`/library/${item._id}`); clearSearch(); handleClose() }} className="ml-auto h-6 w-6 cursor-pointer" />
                                        //     </div>
                                        // ))
                                        :
                                        <div className='flex flex-col gap-2 items-center justify-center p-4'>
                                            <FiAtSign className='h-8 w-8 text-neutral-800 dark:text-gray-300' />
                                            <div className='flex flex-col gap-1 items-center'>
                                                <span className='text-neutral-800 dark:text-gray-200  font-semibold leading-5'>No artworks found.</span>
                                                <span className='text-neutral-500 dark:text-gray-400  text-sm'>"{searchVal}" did not match any artworks in our database. Please try again.</span>
                                            </div>
                                        </div>}
                                </MasonryGrid>
                            </div>
                        }
                        {activeSearch === 'artist' &&
                            <div className='flex flex-col gap-2 pr-2'>
                                {searchList.length > 0 ? searchList.map((item, index) => (
                                    <div key={index} onClick={() => { navigate(`/users/${item.id}`); clearSearch() }} className='flex items-center gap-5 cursor-pointer rounded-lg text-neutral-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-900 py-3 px-5'>
                                        {item.avatar.icon.length > 0 && <img src={api_userImages(item.avatar.icon)} className='object-cover w-10 h-10' />}
                                        <div className='flex flex-col'>
                                            <span className='text-lg font-semibold'>{item.name}</span>
                                            <span className='text-sm font-semibold'>@{item.username}</span>
                                        </div>
                                    </div>
                                )) :
                                    <div className='flex flex-col gap-2 items-center justify-center p-4'>
                                        <FaGreaterThan className='h-8 w-8 text-neutral-800 dark:text-gray-300' />
                                        <div className='flex flex-col items-center'>
                                            <span className='text-neutral-800 dark:text-gray-200  font-semibold leading-5'>No artists found.</span>
                                            <span className='text-neutral-500 dark:text-gray-400  text-sm'>"{searchVal}" did not match any artists in our database. Please try again.</span>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        {activeSearch === 'tag' &&
                            <div className='flex flex-col gap-2 pr-2'>
                                {searchList.length > 0 ? searchList.map((item, index) => (
                                    <div key={index} onClick={() => { navigate(`/library`); clearSearch() }} className='flex cursor-pointer items-center gap-4 rounded-lg text-neutral-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-900 p-4'>
                                        <FaHashtag className='h-5 w-5' />
                                        <span className='font-semibold leading-5'>{item}</span>
                                    </div>
                                )) :
                                    <div className='flex flex-col gap-2 items-center justify-center p-4'>
                                        <FaHashtag className='h-8 w-8 text-neutral-800 dark:text-gray-300' />
                                        <div className='flex flex-col items-center'>
                                            <span className='text-neutral-800 dark:text-gray-200  font-semibold leading-5'>No tags found.</span>
                                            <span className='text-neutral-500 dark:text-gray-400  text-sm'>"{searchVal}" did not match any tags in our database. Please try again.</span>
                                        </div>
                                    </div>}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchModal;