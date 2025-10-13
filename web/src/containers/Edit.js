import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { a_getTags } from '../store/actions/common.actions';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducer';
import { a_fetchArtworks, a_fetchArtwork, a_editArtwork } from '../store/actions/artworks.actions';

import { api_artworkImages } from '../utils/api_routes';

import { MdClose } from 'react-icons/md';
import { BsHash } from 'react-icons/bs';

import DragDrop from '../components/DragDrop';
import Dropdown from '../components/Dropdown';

const ExploreEdit = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const common = useSelector(state => state.common);
    const artwork = useSelector(state => state.artworks.item);

    const { id } = useParams();

    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagSearch, setTagSearch] = useState('');
    const [primaryFile, setPrimaryFile] = useState('');

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
        dispatch(a_getTags());

        load_data();
    }, [id])

    const load_data = async () => {
        await dispatch(a_fetchArtworks());
        await dispatch(a_fetchArtwork(id));
    }

    useEffect(() => {
        setTitle(artwork.title)
        setDescription(artwork.description)
        setTags(artwork.tags)
    }, [artwork])

    const handleSelectTag = (selectedTag) => {
        if (tags.filter(item => item === selectedTag).length === 0) {
            if (tags.length === 10) {
                setTagSearch('');
                const msgData = {
                    open: true,
                    message: 'Maximum number of tags assigned!',
                    type: 'warning'
                }
                dispatch(r_setSnackMessage(msgData));
            } else {
                setTags(tags => [...tags, selectedTag])
            }
        }
    }

    const handleRemoveTag = (selectedTag) => {
        setTags(tags.filter(tag => tag !== selectedTag))
    }

    const handleEditSubmit = () => {
        if (title.length === 0 || description.length === 0 || tags.length === 0) {
            const msgData = {
                open: true,
                message: 'Please fill all mandatory fields!',
                type: 'error'
            }
            dispatch(r_setSnackMessage(msgData))
            return;
        }

        const updatedData = { title, description, tags };
        dispatch(a_editArtwork({ id, updatedData })).then(() => {
            navigate(`/library/${id}`)
            const msgData = {
                open: true,
                message: 'Successfully updated!',
                type: 'success'
            }
            dispatch(r_setSnackMessage(msgData));
        }).catch(err => {
            const msgData = {
                open: true,
                message: 'Edit Failed!',
                type: 'warning'
            }
            dispatch(r_setSnackMessage(msgData));
        });
    }

    return (
        <div className="main-container bg-gray-200 dark:bg-darkBg p-8">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
                <div className="flex justify-between pt-5">
                    <span className='text-3xl text-gray-700 dark:text-gray-300'>Edit</span>
                    <div>
                        <button onClick={() => navigate(`/library/${id}`)} className="rounded-md px-3 py-1 bg-gray-100 hover:bg-gray-200 focus:shadow-outline focus:outline-none">
                            Cancel
                        </button>
                        <button onClick={handleEditSubmit} className="ml-3 rounded-md px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white focus:shadow-outline focus:outline-none">
                            Apply
                        </button>
                    </div>
                </div>
                <div className='flex lg:flex-row flex-col mt-3 lg:gap-4 md:gap-2'>
                    <div className='scrollbar w-full max-h-[37.5em] overflow-y-auto'>
                        <div className="flex flex-col gap-3">
                            <img loading='lazy' src={`${api_artworkImages(artwork.files[0])}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />
                            <div className='flex w-fit flex-col self-center items-center gap-3 place-content-center'>
                                {artwork.files.filter((image, index) => index !== 0).map((image, index) => (
                                    <img loading='lazy' key={index} src={`${api_artworkImages(image)}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='w-full gap-2'>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-gray-700 dark:text-gray-300'>Title<span className='text-rose-400 text-md'>*</span></span>
                            <input type="text" value={title} onChange={(ev) => setTitle(ev.target.value)} className="py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 focus:outline-none rounded-md w-full" placeholder='Title' />
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-gray-700 dark:text-gray-300'>Description<span className='text-rose-400 text-md'>*</span></span>
                            <textarea rows='4' value={description} onChange={(ev) => setDescription(ev.target.value)} className="scrollbar py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 resize-none focus:outline-none rounded-md w-full" placeholder='Title' />
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-gray-700 dark:text-gray-300'>Add tags:</span>
                            <div className='text-rose-400 font-semibold text-sm'>You may assign a maximum of 10 tags</div>
                            <div className="w-full inline-flex flex-col justify-center relative text-gray-500">
                                <div className="relative">
                                    <input value={tagSearch} onChange={(ev) => setTagSearch(ev.target.value)} type="text" className="p-2 shadow  pl-8 w-full text-md rounded bg-slate-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 focus:outline-none" placeholder="Search for tags..." />
                                    <BsHash className="w-5 h-5 text-gray-400 dark:text-gray-300 absolute left-2 top-2.5" />
                                    {tagSearch.length === 0 ? '' : <MdClose onClick={() => setTagSearch('')} className="w-5 h-5 text-gray-700 dark:text-gray-300 absolute right-2 top-2.5" />}
                                </div>
                                {tagSearch.length === 0 ? '' :
                                    <div className="scrollbar grid grid-cols-2 bg-gray-200/25 dark:bg-neutral-700 max-h-60 h-full overflow-y-auto w-full mt-2 rounded">
                                        {common.tags.filter(tag => tag.includes(tagSearch)).map(tag => {
                                            if (tags.includes(tag)) {
                                                return <div className="flex justify-between items-center pl-8 pr-2 py-2 m-1 bg-indigo-100 text-gray-600 rounded">
                                                    {tag}
                                                    <MdClose onClick={() => handleRemoveTag(tag)} className='h-5 w-5 cursor-pointer' />
                                                </div>
                                            } else {
                                                return <div onClick={() => handleSelectTag(tag)} className="pl-8 pr-2 py-2 m-1 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-indigo-300 hover:text-gray-800 hover:rounded">
                                                    {tag}
                                                </div>
                                            }
                                        })}
                                    </div>
                                }
                                {tags.length === 0 ? '' :
                                    <div id='tagmenu' className='flex flex-wrap justify-center gap-1 p-2'>
                                        {tags.map(tag => (
                                            <div className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-indigo-100 bg-blue-700 border border-indigo-700 ">
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