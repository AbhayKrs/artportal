import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet';

import { a_handleArtworkUpload } from '../store/actions/library.actions';
import { a_getTags } from '../store/actions/common.actions';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducers';

import { MdClose } from 'react-icons/md';
import { BsHash } from 'react-icons/bs';

import DragDrop from '../components/DragDrop';
import Title from '../components/Title';
import FlaggedModal from '../components/Modals/FlaggedModal';

import { ReactComponent as AiAgentIcon } from '../assets/icons/ai_agent.svg';

const LibraryUpload = ({ }) => {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.user);

    const [categories, setCategories] = useState([]);
    const [files, setFiles] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagSearch, setTagSearch] = useState('');
    const [primaryFile, setPrimaryFile] = useState('');

    const [isFlagged, setIsFlagged] = useState(false);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
        dispatch(a_getTags());
        // setTitle(randomSentence({ min: 2, max: 8 }))
        // setDescription(randomSentence({ min: 5, max: 14 }))
        // setTags(common.tags.sort(() => 0.5 - Math.random()).slice(0, 10))
    }, [])

    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const onImageChange = (ev) => {
        if (ev.target.files.length > 3 || files.length > 2) {
            const msgData = {
                open: true,
                message: 'Only a maximum of 3 files may be selected.',
                type: 'warning'
            }
            dispatch(r_setSnackMessage(msgData));
        }
        else {
            Object.keys(ev.target.files).map((key, index) => {
                let convertedFile, convertedThumbFile;
                let userImage = new Image();

                userImage.src = URL.createObjectURL(ev.target.files[key])

                let canvas = document.createElement('canvas');
                let thumb = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                let ttx = thumb.getContext('2d');

                userImage.onload = () => {
                    canvas.width = userImage.width;
                    canvas.height = userImage.height;
                    ctx.drawImage(userImage, 0, 0);

                    thumb.width = userImage.width * 0.25;
                    thumb.height = userImage.height * 0.25;
                    ttx.drawImage(userImage, 0, 0, thumb.width, thumb.height);

                    let convertedImg = canvas.toDataURL('image/webp');
                    let convertedThumb = thumb.toDataURL('image/webp');

                    let newImage = new Image();
                    newImage.src = convertedImg;
                    convertedFile = dataURLtoFile(newImage.src, `${ev.target.files[key].name.split('.')[0]}.webp`)
                    setFiles(arr => [...arr, convertedFile]);

                    let newThumb = new Image();
                    newThumb.src = convertedThumb;
                    convertedThumbFile = dataURLtoFile(newThumb.src, `${ev.target.files[key].name.split('.')[0]}.webp`)
                    console.log('test', convertedThumbFile)
                    setThumbnail(convertedThumbFile);
                }
            })
            setPrimaryFile(ev.target.files[0]);
        }
    }

    const dropHandler = (ev) => {
        ev.nativeEvent.preventDefault();
        if (ev.dataTransfer.files.length > 3 || files.length > 2) {
            const msgData = {
                open: true,
                message: 'Only a maximum of 3 files may be selected.',
                type: 'warning'
            }
            dispatch(r_setSnackMessage(msgData));
        } else {
            Object.keys(ev.target.files).map((key, index) => {
                let convertedFile, convertedThumbFile;
                let userImage = new Image();

                userImage.src = URL.createObjectURL(ev.target.files[key])

                let canvas = document.createElement('canvas');
                let thumb = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                let ttx = thumb.getContext('2d');

                userImage.onload = () => {
                    canvas.width = userImage.width;
                    canvas.height = userImage.height;
                    ctx.drawImage(userImage, 0, 0);

                    thumb.width = userImage.width * 0.25;
                    thumb.height = userImage.height * 0.25;
                    ttx.drawImage(userImage, 0, 0, thumb.width, thumb.height);

                    let convertedImg = canvas.toDataURL('image/webp');
                    let convertedThumb = thumb.toDataURL('image/webp');

                    let newImage = new Image();
                    newImage.src = convertedImg;
                    convertedFile = dataURLtoFile(newImage.src, `${ev.target.files[key].name.split('.')[0]}.webp`)
                    setFiles(arr => [...arr, convertedFile]);

                    let newThumb = new Image();
                    newThumb.src = convertedThumb;
                    convertedThumbFile = dataURLtoFile(newThumb.src, `${ev.target.files[key].name.split('.')[0]}.webp`)
                    setThumbnail(convertedThumbFile);
                }
            })
            setPrimaryFile(ev.target.files[0]);
        }
        ev.preventDefault();
    }

    const dragOverHandler = (ev) => {
        ev.preventDefault();
    }

    const handleSelectTag = (selectedTag) => {
        if (tags.filter(item => item._id === selectedTag._id).length === 0) {
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
        setTags(tags.filter(tag => tag._id !== selectedTag._id))
    }

    const handleUpload = () => {
        if (files.length === 0 || title.length === 0 || description.length === 0) {
            const msgData = {
                open: true,
                message: 'Please fill all the required fields!',
                type: 'error'
            }
            dispatch(r_setSnackMessage(msgData))
            return;
        }

        const userID = user.id;
        const uploadData = new FormData();
        files.map(file => uploadData.append('files[]', file));
        // uploadData.append('thumbnail', thumbnail);
        categories.map(category => uploadData.append('categories[]', category));
        uploadData.append('title', title);
        uploadData.append('description', description);
        uploadData.append('userID', userID);
        tags.map(tag => uploadData.append('tags[]', JSON.stringify(tag)));

        dispatch(a_handleArtworkUpload(uploadData)).then(() => {
            navigate(`/library`)
            const msgData = {
                open: true,
                message: 'Successfully Uploaded!',
                type: 'success'
            }
            dispatch(r_setSnackMessage(msgData));
        }).catch(err => {
            const msgData = {
                open: true,
                message: 'Upload Failed!',
                type: 'warning'
            }
            dispatch(r_setSnackMessage(msgData));
        });
    }

    return (
        <div className="main-container bg-gray-200 dark:bg-darkBg">
            <Helmet>
                <title>artportal | Library - Upload</title>
            </Helmet>
            <div className="py-4 px-8">
                <Title text="Library - Upload" />
                <div className='flex flex-col gap-2'>
                    <p className='font-semibold text-lg text-neutral-700 dark:text-neutral-400'>Once you upload your image, our system runs two AI checks in the background to help keep the platform safe and organized:</p>
                    <div className='flex flex-row gap-2 items-center'>
                        <AiAgentIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-400" />
                        <p className='text-base font-semibold text-neutral-700 dark:text-neutral-400'>
                            Auto-Categorization: The AI agent analyzes your artwork and automatically places it under the right category — no extra steps needed from you.
                        </p>
                    </div>
                    <div className='flex flex-row gap-2 items-center'>
                        <AiAgentIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-400" />
                        <p className='font-semibold text-base text-neutral-700 dark:text-neutral-400'>
                            Your upload is automatically scanned against existing artworks on the platform to ensure its authenticity and not copied from another artist's work.
                        </p>
                    </div>
                    <p className='text-sm font-light italic text-neutral-700 dark:text-neutral-400'>* Your artwork and personal data are never shared outside the platform. All uploads are securely processed and stored within our systems.</p>
                </div>
                <div className='flex lg:flex-row flex-col py-5 px-2 lg:gap-8 md:gap-2'>
                    <div className='w-8/12 xs:mb-2 md:mb-0'>
                        <span className='text-lg tracking-wide font-medium text-neutral-700 dark:text-gray-300'>Files<span className='text-red-400 text-base'>*</span></span>
                        <div className="flex flex-col gap-3">
                            <div className='flex flex-row gap-4'>
                                <div className="flex flex-col w-full justify-center items-center gap-2 rounded-lg border border-gray-500 dark:border-gray-400 py-12" onDrop={(ev) => dropHandler(ev)} onDragOver={(ev) => dragOverHandler(ev)} >
                                    <label htmlFor="file-upload" className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-blue-700 hover:bg-blue-600 text-neutral-800 dark:text-gray-300 rounded-xl items-center">
                                        Select image files
                                    </label>
                                    <input id="file-upload" className='hidden' type="file" multiple onChange={onImageChange} />
                                    <p className="tracking-wide text-gray-700 dark:text-gray-300 flex-wrap justify-center">or drag and drop here</p>
                                </div>
                            </div>
                            <div className="flex flex-col rounded-lg bg-slate-100 dark:bg-neutral-800 shadow items-center p-5 w-full">
                                <h1 className="font-bold tracking-wide text-lg text-gray-800 dark:text-gray-400">Selected Files</h1>
                                <div className="h-full w-full text-center flex flex-col justify-center items-center">
                                    {files.length === 0 ?
                                        <div className='w-full'>
                                            <img loading='lazy' className="my-2 mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                                            <span className="text-sm tracking-wide dark:text-gray-500">No files selected</span>
                                            <div className='text-red-400 font-medium tracking-wide text-sm'>You may select a maximum of 3 files only.</div>
                                        </div>
                                        :
                                        <div className='w-full'>
                                            <DragDrop
                                                isFlagged={isFlagged}
                                                setIsFlagged={setIsFlagged}
                                                selectedImages={files.map((file, index) => {
                                                    return {
                                                        id: index.toString(),
                                                        content: file
                                                    }
                                                })}
                                                setReorderedFiles={setFiles}
                                                setCategories={(categories) => setCategories(imageCategories => [...new Set([...imageCategories, ...categories])])}
                                                r_setSnackMessage={(msgData) => dispatch(r_setSnackMessage(msgData))}
                                            />
                                            <div className='text-red-400 font-medium text-sm'>You may select a maximum of 3 files.</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-4/12 ">
                        {categories.length === 0 ? null : <div className='flex flex-col'>
                            <span className='text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Categories<span className='text-red-400 text-base'>*</span></span>
                            <div className="w-full inline-flex flex-col justify-center relative text-gray-500">
                                <div id='category_menu' className='flex flex-wrap gap-1'>
                                    {categories.map((category, index) => (
                                        <div key={index} className="flex justify-center items-center m-1 font-medium py-2 px-3 rounded-md text-indigo-100 bg-blue-700 border border-blue-700 ">
                                            <div className="text-sm font-normal leading-none max-w-full flex-initial">{category}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>}
                        <div className='flex flex-col gap-1'>
                            <span className='text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Title<span className='text-red-400 text-base'>*</span></span>
                            <input type="text" maxLength={250} value={title} onChange={(ev) => setTitle(ev.target.value)} className="py-2 px-3 shadow text-base bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none rounded-full w-full" placeholder='Title' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Description<span className='text-red-400 text-base'>*</span></span>
                            <textarea rows='4' maxLength={1000} value={description} onChange={(ev) => setDescription(ev.target.value)} className="scrollbar py-2 px-3 shadow text-base bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 resize-none focus:outline-none rounded-xl w-full" placeholder='Description' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className="flex flex-col">
                                <span className='text-lg  leading-[1.125rem] tracking-wide font-medium text-gray-700 dark:text-gray-300'>Add tags<span className='text-red-400 text-base'>*</span></span>
                                <div className='text-red-400 font-medium text-xs mb-1.5'>You may assign a maximum of 10 tags</div>
                            </div>
                            <div className="w-full inline-flex flex-col justify-center relative text-gray-500">
                                <div className="relative">
                                    <input value={tagSearch} onChange={(ev) => setTagSearch(ev.target.value)} type="text" className="p-2 shadow  pl-8 w-full text-base rounded bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none" placeholder="Search for tags..." />
                                    <BsHash className="w-5 h-5 text-gray-400 dark:text-gray-300 absolute left-2 top-2" />
                                    {tagSearch.length === 0 ? '' : <MdClose onClick={() => setTagSearch('')} className="w-5 h-5 text-gray-700 dark:text-gray-300 absolute right-2 top-2.5" />}
                                </div>
                                {tags.length === 0 ? '' :
                                    <div id='tagmenu' className='flex flex-wrap justify-center gap-1 mt-2'>
                                        {tags.map(tag => (
                                            <div className="flex items-center font-medium py-1 px-2 rounded-full text-gray-700 dark:text-gray-300 border-2 border-gray-700 dark:border-gray-300">
                                                <div className="text-xs tracking-wide font-semibold leading-none max-w-full flex-initial">{tag.value}</div>
                                                <div className="flex flex-auto flex-row-reverse">
                                                    <MdClose onClick={() => handleRemoveTag(tag)} className='h-5 w-5 cursor-pointer' />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                                {tagSearch.length === 0 ? '' :
                                    <div className="scrollbar bg-gray-200/25 dark:bg-neutral-800 max-h-60 h-full overflow-y-auto w-full mt-2 p-2 rounded">
                                        {common.tags.filter(tag => tag.value.toLowerCase().includes(tagSearch)).map(tag => {
                                            if (tags.includes(tag)) {
                                                return <div className="flex justify-between items-center pl-8 pr-2 py-2 m-1 bg-indigo-100 text-gray-600 rounded">
                                                    {tag.value}
                                                </div>
                                            } else {
                                                return <div onClick={() => handleSelectTag(tag)} className="pl-8 pr-2 py-2 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-indigo-300 hover:bg-gray-100 dark:hover:bg-neutral-800/25 hover:rounded">
                                                    {tag.value}
                                                </div>
                                            }
                                        })}
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 justify-end pt-5">
                    <button onClick={() => navigate(`/library`)} className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-neutral-400 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-800 rounded-xl items-center">
                        Reset
                    </button>
                    <button disabled={files.length === 0 || categories.length === 0 || title.length === 0 || description.length === 0} onClick={handleUpload} className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-blue-700 dark:bg-blue-700 disabled:bg-neutral-700 disabled:dark:bg-neutral-700 hover:bg-neutral-600 text-neutral-800 dark:text-gray-300 disabled:text-neutral-800 disabled:dark:text-neutral-500 rounded-xl items-center">
                        Apply
                    </button>
                </div>
            </div>
            {
                isFlagged && <FlaggedModal
                    open={isFlagged}
                    onClose={() => navigate(0)}
                />
            }
        </div>
    )
}

export default LibraryUpload;