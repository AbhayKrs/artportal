import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { getTags, setLoader, setSnackMessage } from '../store/reducers/common.reducers';
import { fetchExploreList, fetchExploreItem, handleExploreEdit } from '../store/reducers/explore.reducers';

import { fetchArtworkImages } from '../utils/api';

import { MdClose } from 'react-icons/md';
import { BsHash } from 'react-icons/bs';

import DragDrop from '../components/DragDrop';
import Dropdown from '../components/Dropdown';

const ExploreEdit = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const common = useSelector(state => state.common);
    const artwork = useSelector(state => state.explore.exploreData);

    const { id } = useParams();

    const [exploreFiles, setExploreFiles] = useState([]);
    const [exploreTitle, setExploreTitle] = useState('');
    const [exploreDesc, setExploreDesc] = useState('');
    const [exploreTags, setExploreTags] = useState([]);
    const [tagSearch, setTagSearch] = useState('');
    const [primaryFile, setPrimaryFile] = useState('');

    useEffect(async () => {
        dispatch(setLoader(true));
        window.scrollTo(0, 0)
        dispatch(getTags());

        await dispatch(fetchExploreList());
        await dispatch(fetchExploreItem(id));
        console.log('test')
    }, [id])

    useEffect(() => {
        setExploreTitle(artwork.title)
        setExploreDesc(artwork.description)
        setExploreTags(artwork.tags)
    }, [artwork])

    const handleSelectTag = (selectedTag) => {
        if (exploreTags.filter(item => item === selectedTag).length === 0) {
            if (exploreTags.length === 10) {
                setTagSearch('');
                const msgData = {
                    open: true,
                    message: 'Maximum number of tags assigned!',
                    type: 'warning'
                }
                dispatch(setSnackMessage(msgData));
            } else {
                setExploreTags(tags => [...tags, selectedTag])
            }
        }
    }

    const handleRemoveTag = (selectedTag) => {
        setExploreTags(exploreTags.filter(tag => tag !== selectedTag))
    }

    const handleEditSubmit = () => {
        if (exploreTitle.length === 0 || exploreDesc.length === 0 || exploreTags.length === 0) {
            const msgData = {
                open: true,
                message: 'Please fill all mandatory fields!',
                type: 'error'
            }
            dispatch(setSnackMessage(msgData))
            return;
        }

        const updatedData = {
            title: exploreTitle,
            description: exploreDesc,
            tags: exploreTags
        }

        dispatch(handleExploreEdit({ id, updatedData })).then(() => {
            navigate(`/explore/${id}`)
            const msgData = {
                open: true,
                message: 'Successfully updated!',
                type: 'success'
            }
            dispatch(setSnackMessage(msgData));
        }).catch(err => {
            const msgData = {
                open: true,
                message: 'Edit Failed!',
                type: 'warning'
            }
            dispatch(setSnackMessage(msgData));
        });
    }

    return (
        <div className="main-container bg-gray-200 dark:bg-darkBg p-8">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
                <div className="flex justify-between pt-5">
                    <span className='font-nunito text-3xl text-gray-700 dark:text-gray-300'>Edit</span>
                    <div>
                        <button onClick={() => navigate(`/explore/${id}`)} className="rounded-md px-3 py-1 bg-gray-100 hover:bg-gray-200 focus:shadow-outline focus:outline-none">
                            Cancel
                        </button>
                        <button onClick={handleEditSubmit} className="ml-3 rounded-md px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white focus:shadow-outline focus:outline-none">
                            Apply
                        </button>
                    </div>
                </div>
                <div className='flex lg:flex-row flex-col mt-3 lg:space-x-4 md:space-y-2'>
                    <div className='scrollbar w-full max-h-[37.5em] overflow-y-auto'>
                        <div className="flex flex-col space-y-3">
                            <img loading='lazy' src={`${fetchArtworkImages(artwork.files[0])}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />
                            <div className='flex w-fit flex-col self-center items-center space-y-3 place-content-center'>
                                {artwork.files.filter((image, index) => index !== 0).map((image, index) => (
                                    <img loading='lazy' key={index} src={`${fetchArtworkImages(image)}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='w-full space-y-2'>
                        <div className='flex flex-col'>
                            <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Title<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                            <input type="text" value={exploreTitle} onChange={(ev) => setExploreTitle(ev.target.value)} className="py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 focus:outline-none rounded-md w-full" placeholder='Title' />
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Description<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                            <textarea rows='4' value={exploreDesc} onChange={(ev) => setExploreDesc(ev.target.value)} className="scrollbar py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 resize-none focus:outline-none rounded-md w-full" placeholder='Title' />
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Add tags:</span>
                            <div className='font-josefinlight text-rose-400 font-semibold text-sm'>You may assign a maximum of 10 tags</div>
                            <div className="w-full inline-flex flex-col justify-center relative text-gray-500">
                                <div className="relative">
                                    <input value={tagSearch} onChange={(ev) => setTagSearch(ev.target.value)} type="text" className="p-2 shadow  pl-8 w-full text-md rounded bg-slate-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 focus:outline-none" placeholder="Search for tags..." />
                                    <BsHash className="w-5 h-5 text-gray-400 dark:text-gray-300 absolute left-2 top-2.5" />
                                    {tagSearch.length === 0 ? '' : <MdClose onClick={() => setTagSearch('')} className="w-5 h-5 text-gray-700 dark:text-gray-300 absolute right-2 top-2.5" />}
                                </div>
                                {tagSearch.length === 0 ? '' :
                                    <div className="scrollbar grid grid-cols-2 bg-gray-200/25 dark:bg-neutral-700 max-h-60 h-full overflow-y-auto w-full mt-2 rounded">
                                        {common.tags.filter(tag => tag.includes(tagSearch)).map(tag => {
                                            if (exploreTags.includes(tag)) {
                                                return <div className="flex justify-between items-center pl-8 pr-2 py-2 m-1 bg-violet-100 text-gray-600 rounded">
                                                    {tag}
                                                    <MdClose onClick={() => handleRemoveTag(tag)} className='h-5 w-5 cursor-pointer' />
                                                </div>
                                            } else {
                                                return <div onClick={() => handleSelectTag(tag)} className="pl-8 pr-2 py-2 m-1 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-violet-300 hover:text-gray-800 hover:rounded">
                                                    {tag}
                                                </div>
                                            }
                                        })}
                                    </div>
                                }
                                {exploreTags.length === 0 ? '' :
                                    <div id='tagmenu' className='flex flex-wrap justify-center space-x-1 p-2'>
                                        {exploreTags.map(tag => (
                                            <div className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-indigo-100 bg-indigo-600 border border-violet-700 ">
                                                <div className="text-xs font-normal leading-none max-w-full flex-initial">{tag}</div>
                                                <div className="flex flex-auto flex-row-reverse">
                                                    <MdClose className='feather feather-x cursor-pointer hover:text-indigo-400 rounded-full w-4 h-4 ml-1' />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ExploreEdit;