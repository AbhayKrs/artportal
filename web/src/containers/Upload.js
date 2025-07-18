import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet';

import { a_handleExploreUpload } from '../store/actions/explore.actions';
import { a_getTags } from '../store/actions/common.actions';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducers';
import { a_handleStoreUpload } from '../store/actions/store.actions';

import { MdClose } from 'react-icons/md';
import { BsHash } from 'react-icons/bs';

import DragDrop from '../components/DragDrop';
import Dropdown from '../components/Dropdown';
import { ConfirmModal, FlaggedModal } from '../components/Modal';

import { ReactComponent as AiAgentIcon } from '../assets/icons/ai_agent.svg';


const ExploreUpload = (props) => {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const common = useSelector(state => state.common);
    const explore = useSelector(state => state.explore);

    const [exploreCategories, setExploreCategories] = useState([]);
    const [exploreFiles, setExploreFiles] = useState([]);
    const [exploreThumbnail, setExploreThumbnail] = useState([]);
    const [exploreTitle, setExploreTitle] = useState('');
    const [exploreDesc, setExploreDesc] = useState('');
    const [exploreTags, setExploreTags] = useState([]);
    const [tagSearch, setTagSearch] = useState('');
    const [primaryFile, setPrimaryFile] = useState('');

    const [isFlagged, setIsFlagged] = useState(false);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
        dispatch(a_getTags());
        // setExploreTitle(randomSentence({ min: 2, max: 8 }))
        // setExploreDesc(randomSentence({ min: 5, max: 14 }))
        // setExploreTags(common.tags.sort(() => 0.5 - Math.random()).slice(0, 10))
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
        if (ev.target.files.length > 3 || exploreFiles.length > 2) {
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
                    setExploreFiles(arr => [...arr, convertedFile]);

                    let newThumb = new Image();
                    newThumb.src = convertedThumb;
                    convertedThumbFile = dataURLtoFile(newThumb.src, `${ev.target.files[key].name.split('.')[0]}.webp`)
                    console.log('test', convertedThumbFile)
                    setExploreThumbnail(convertedThumbFile);
                }
            })
            setPrimaryFile(ev.target.files[0]);
        }
    }

    const dropHandler = (ev) => {
        ev.nativeEvent.preventDefault();
        if (ev.dataTransfer.files.length > 3 || exploreFiles.length > 2) {
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
                    setExploreFiles(arr => [...arr, convertedFile]);

                    let newThumb = new Image();
                    newThumb.src = convertedThumb;
                    convertedThumbFile = dataURLtoFile(newThumb.src, `${ev.target.files[key].name.split('.')[0]}.webp`)
                    setExploreThumbnail(convertedThumbFile);
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
        if (exploreTags.filter(item => item._id === selectedTag._id).length === 0) {
            if (exploreTags.length === 10) {
                setTagSearch('');
                const msgData = {
                    open: true,
                    message: 'Maximum number of tags assigned!',
                    type: 'warning'
                }
                dispatch(r_setSnackMessage(msgData));
            } else {
                setExploreTags(tags => [...tags, selectedTag])
            }
        }
    }

    const handleRemoveTag = (selectedTag) => {
        setExploreTags(exploreTags.filter(tag => tag._id !== selectedTag._id))
    }

    const handleUpload = () => {
        if (exploreFiles.length === 0 || exploreTitle.length === 0 || exploreDesc.length === 0) {
            const msgData = {
                open: true,
                message: 'Please fill all the required fields!',
                type: 'error'
            }
            dispatch(r_setSnackMessage(msgData))
            return;
        }

        const userID = common.user.id;
        const exploreUploadData = new FormData();
        exploreFiles.map(file => exploreUploadData.append('files[]', file));
        // exploreUploadData.append('thumbnail', exploreThumbnail);
        exploreCategories.map(category => exploreUploadData.append('categories[]', category));
        exploreUploadData.append('title', exploreTitle);
        exploreUploadData.append('description', exploreDesc);
        exploreUploadData.append('userID', userID);
        exploreTags.map(tag => exploreUploadData.append('tags[]', JSON.stringify(tag)));

        dispatch(a_handleExploreUpload(exploreUploadData)).then(() => {
            navigate(`/explore`)
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
                <title>artportal | Upload</title>
            </Helmet>
            <div className="py-4 px-8">
                <div className='relative w-fit justify-between mb-2'>
                    <h2 className='font-medium tracking-wide text-3xl text-neutral-800 dark:text-gray-300'>Upload</h2>
                    <div className='absolute h-1 w-6/12 bottom-[-3px] left-0 text-2xl bg-gray-300 rounded-md'></div>
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='text-md text-neutral-700 dark:text-neutral-400'>Once you upload your image, our system runs two AI checks in the background to help keep the platform safe and organized:</p>
                    <div className='flex flex-row gap-2 items-center'>
                        <AiAgentIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-400" />
                        <p className='text-md text-neutral-700 dark:text-neutral-400'>
                            Auto-Categorization: The AI agent analyzes your artwork and automatically places it under the right category — no extra steps needed from you.
                        </p>
                    </div>
                    <div className='flex flex-row gap-2 items-center'>
                        <AiAgentIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-400" />
                        <p className='flex text-md text-neutral-700 dark:text-neutral-400'>
                            Your upload is automatically scanned against existing artworks on the platform to ensure its authenticity and not copied from another artist's work.
                        </p>
                    </div>
                    <p className='text-sm italic text-neutral-700 dark:text-neutral-400'>Your artwork and personal data are never shared outside the platform. All uploads are securely processed and stored within our systems.</p>
                </div>
                <div className='flex lg:flex-row flex-col py-5 px-2 lg:gap-8 md:gap-2'>
                    <div className='w-8/12 xs:mb-2 md:mb-0'>
                        <span className='text-lg tracking-wide font-medium text-neutral-700 dark:text-gray-300'>Files<span className=' text-rose-400 text-md'>*</span></span>
                        <div className="flex flex-col gap-3">
                            <div className='flex flex-row gap-4'>
                                <div className="flex flex-col w-full justify-center items-center border-dashed gap-2 rounded-lg border-2 border-gray-400 py-12" onDrop={(ev) => dropHandler(ev)} onDragOver={(ev) => dragOverHandler(ev)} >
                                    <label htmlFor="file-upload" className='bg-blue-700 text-gray-200 tracking-wide cursor-pointer text-lg font-medium py-2 px-4 rounded'>
                                        Select image files
                                    </label>
                                    <input id="file-upload" className='hidden' type="file" multiple onChange={onImageChange} />
                                    <p className="tracking-wide text-gray-700 dark:text-gray-300 flex-wrap justify-center">or drag and drop here</p>
                                </div>
                            </div>
                            <div className="flex flex-col rounded-lg bg-slate-100 dark:bg-neutral-800 shadow items-center p-5 w-full">
                                <h1 className="font-bold tracking-wide text-lg text-gray-800 dark:text-gray-400">Selected Files</h1>
                                <div className="h-full w-full text-center flex flex-col justify-center items-center">
                                    {exploreFiles.length === 0 ?
                                        <div className='w-full'>
                                            <img loading='lazy' className="my-2 mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                                            <span className="text-sm tracking-wide dark:text-gray-500">No files selected</span>
                                            <div className=' text-rose-400 font-medium tracking-wide text-sm'>You may select a maximum of 3 files only.</div>
                                        </div>
                                        :
                                        <div className='w-full'>
                                            <DragDrop
                                                isFlagged={isFlagged}
                                                setIsFlagged={setIsFlagged}
                                                selectedImages={exploreFiles.map((explore, index) => {
                                                    return {
                                                        id: index.toString(),
                                                        content: explore
                                                    }
                                                })}
                                                setReorderedFiles={setExploreFiles}
                                                setCategories={(categories) => setExploreCategories(imageCategories => [...new Set([...imageCategories, ...categories])])}
                                                r_setSnackMessage={(msgData) => dispatch(r_setSnackMessage(msgData))}
                                            />
                                            <div className=' text-rose-400 font-medium text-sm'>You may select a maximum of 3 files.</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 w-4/12'>
                        {exploreCategories.length === 0 ? null : <div className='flex flex-col'>
                            <span className=' text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Categories<span className=' text-rose-400 text-md'>*</span></span>
                            <div className="w-full inline-flex flex-col justify-center relative text-gray-500">
                                <div id='category_menu' className='flex flex-wrap gap-1'>
                                    {exploreCategories.map((category, index) => (
                                        <div key={index} className="flex justify-center items-center m-1 font-medium py-2 px-3 rounded-md text-indigo-100 bg-blue-700 border border-blue-700 ">
                                            <div className="text-sm font-normal leading-none max-w-full flex-initial">{category}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>}
                        <div className='flex flex-col gap-1'>
                            <span className=' text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Title<span className=' text-rose-400 text-md'>*</span></span>
                            <input type="text" maxLength={250} value={exploreTitle} onChange={(ev) => setExploreTitle(ev.target.value)} className="py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none rounded-md w-full" placeholder='Title' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className=' text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Description<span className=' text-rose-400 text-md'>*</span></span>
                            <textarea rows='4' maxLength={1000} value={exploreDesc} onChange={(ev) => setExploreDesc(ev.target.value)} className="scrollbar py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 resize-none focus:outline-none rounded-md w-full" placeholder='Description' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className=' text-lg  leading-[1.125rem] tracking-wide font-medium text-gray-700 dark:text-gray-300'>Add tags<span className=' text-rose-400 text-md'>*</span></span>
                            <div className=' text-rose-400 font-medium text-xs mb-1.5'>You may assign a maximum of 10 tags</div>
                            <div className="w-full inline-flex flex-col justify-center relative text-gray-500">
                                <div className="relative">
                                    <input value={tagSearch} onChange={(ev) => setTagSearch(ev.target.value)} type="text" className="p-2 shadow  pl-8 w-full text-md rounded bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none" placeholder="Search for tags..." />
                                    <BsHash className="w-5 h-5 text-gray-400 dark:text-gray-300 absolute left-2 top-2.5" />
                                    {tagSearch.length === 0 ? '' : <MdClose onClick={() => setTagSearch('')} className="w-5 h-5 text-gray-700 dark:text-gray-300 absolute right-2 top-2.5" />}
                                </div>
                                {exploreTags.length === 0 ? '' :
                                    <div id='tagmenu' className='flex flex-wrap justify-center gap-1 mt-2'>
                                        {exploreTags.map(tag => (
                                            <div className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-md text-indigo-100 bg-blue-700 border border-indigo-700 ">
                                                <div className="text-xs font-normal leading-none max-w-full flex-initial">{tag.value}</div>
                                                <div className="flex flex-auto flex-row-reverse">
                                                    <MdClose className='feather feather-x cursor-pointer hover:text-indigo-400 rounded-full w-4 h-4 ml-1' />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                                {tagSearch.length === 0 ? '' :
                                    <div className="scrollbar bg-gray-200/25 dark:bg-neutral-800 max-h-60 h-full overflow-y-auto w-full mt-2 p-2 rounded">
                                        {common.tags.filter(tag => tag.value.toLowerCase().includes(tagSearch)).map(tag => {
                                            if (exploreTags.includes(tag)) {
                                                return <div className="flex justify-between items-center pl-8 pr-2 py-2 m-1 bg-indigo-100 text-gray-600 rounded">
                                                    {tag.value}
                                                    <MdClose onClick={() => handleRemoveTag(tag)} className='h-5 w-5 cursor-pointer' />
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
                <div className="flex justify-end pt-5">
                    <button onClick={() => navigate(`/explore`)} className=" rounded-md px-3 py-1 bg-neutral-400 focus:shadow-outline focus:outline-none">
                        Cancel
                    </button>
                    <button disabled={exploreFiles.length === 0 || exploreCategories.length === 0 || exploreTitle.length === 0 || exploreDesc.length === 0} onClick={handleUpload} className="ml-3 rounded-md px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white focus:shadow-outline focus:outline-none disabled:text-neutral-400 disabled:bg-neutral-600 disabled:hover:bg-neutral-600">
                        Submit
                    </button>
                </div>
            </div>
            {isFlagged && <FlaggedModal
                open={isFlagged}
                onClose={() => navigate(0)}
            />}
        </div >
    )
}

const StoreUpload = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const common = useSelector(state => state.common);

    const [storeFiles, setStoreFiles] = useState([]);
    const [storeTitle, setStoreTitle] = useState('');
    const [storeDesc, setStoreDesc] = useState('');
    const [storePrice, setStorePrice] = useState(0);
    const [storeCategory, setStoreCategory] = useState('');
    const [primaryFile, setPrimaryFile] = useState('');
    const [activeCategoryLabel, setActiveCategoryLabel] = useState('Pick a category');

    const categoryOptions = [
        { id: 1, label: 'Prints', value: 'prints' },
        { id: 2, label: 'Clothing', value: 'clothes' },
        { id: 3, label: 'Frames', value: 'frames' }
    ]

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
        dispatch(a_getTags());
    }, [])

    const onImageChange = (ev) => {
        if (ev.target.files.length > 3 || storeFiles.length > 2) {
            const msgData = {
                open: true,
                message: 'Only a maximum of 3 files may be selected.',
                type: 'warning'
            }
            dispatch(r_setSnackMessage(msgData));
        }
        else {
            const reader = new FileReader();
            reader.readAsDataURL(ev.target.files[0]);
            reader.onload = (ev) => {
                const imgElement = document.createElement("img");
                imgElement.src = ev.target.result;

                imgElement.onload = function (e) {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 300;

                    const scaleSize = MAX_WIDTH / e.target.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = e.target.height * scaleSize;

                    const ctx = canvas.getContext("2d");

                    ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

                    const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");

                    // you can send srcEncoded to the server
                    document.querySelector("#output").src = srcEncoded;
                }
            }
        }
        Object.keys(ev.target.files).map((key, index) => {
            setStoreFiles(arr => [...arr, ev.target.files[key]])
        })
        setPrimaryFile(ev.target.files[0]);
    }

    const dropHandler = (ev) => {
        ev.nativeEvent.preventDefault();
        if (ev.dataTransfer.files.length > 3 || storeFiles.length > 2) {
            const msgData = {
                open: true,
                message: 'Only a maximum of 3 files may be selected.',
                type: 'warning'
            }
            dispatch(r_setSnackMessage(msgData));
        } else {
            Object.keys(ev.dataTransfer.files).map((key, index) => {
                setStoreFiles(arr => [...arr, ev.dataTransfer.files[key]])
            })
            setPrimaryFile(ev.dataTransfer.files[0]);
        }
        ev.preventDefault();
    }

    const dragOverHandler = (ev) => {
        ev.preventDefault();
    }

    const handleCategoryChange = (category) => {
        setStoreCategory(category.value);
        setActiveCategoryLabel(category.label)
    }

    const handleUpload = () => {
        if (storeFiles.length === 0 || storeTitle.length === 0 || storeDesc.length === 0) {
            const msgData = {
                open: true,
                message: 'Please fill all the required fields!',
                type: 'error'
            }
            dispatch(r_setSnackMessage(msgData))
            return;
        }

        const userID = common.user.id;
        const formData = new FormData();

        storeFiles.map(file => formData.append('files[]', file));
        formData.append('title', storeTitle);
        formData.append('description', storeDesc);
        formData.append('price', storePrice);
        formData.append('category', storeCategory);
        formData.append('userID', userID);

        dispatch(a_handleStoreUpload(formData)).then(() => {
            navigate(`/store`)
            const msgData = {
                open: true,
                message: 'Successfully listed product!',
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
        <div className="main-container bg-gray-200 dark:bg-darkBg p-5">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
                <span className=' text-3xl text-gray-700 dark:text-gray-300'>List Product to Store</span>
                <div className='flex lg:flex-row flex-col mt-3 lg:gap-4 md:gap-2'>
                    <div className='w-full'>
                        <span className=' font-medium text-gray-700 dark:text-gray-300'>Files<span className=' text-rose-400 text-md'>*</span></span>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col justify-center items-center border-dashed gap-2 rounded-lg border-2 border-gray-400 py-8" onDrop={(ev) => dropHandler(ev)} onDragOver={(ev) => dragOverHandler(ev)} >
                                <p className="font-medium text-gray-700 dark:text-gray-300 flex flex-wrap justify-center">Drag files</p>
                                <p className="font-medium text-gray-700 dark:text-gray-300">OR</p>
                                <label htmlFor="file-upload" className='bg-blue-700 text-white  font-medium py-1 px-2 rounded'>
                                    Select files
                                </label>
                                <input id="file-upload" className='hidden' type="file" multiple onChange={onImageChange} />
                            </div>
                            <div className="flex flex-col rounded-lg bg-slate-100 dark:bg-neutral-800 shadow items-center py-5 px-1 w-full">
                                <h1 className="font-bold sm:text-lg text-gray-800 dark:text-gray-400">Upload Files</h1>
                                <div className="h-full w-full text-center flex flex-col items-center justify-center items-center">
                                    {storeFiles.length === 0 ?
                                        <div>
                                            <img loading='lazy' className="mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                                            <span className="text-small dark:text-gray-500">No files selected</span>
                                            <div className=' text-rose-400 font-medium text-sm'>You may select a maximum of 3 files.</div>
                                        </div>
                                        :
                                        <div className=''>
                                            <DragDrop
                                                selectedImages={storeFiles.map((store, index) => {
                                                    return {
                                                        id: index.toString(),
                                                        content: store
                                                    }
                                                })}
                                                setReorderedFiles={setStoreFiles}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full gap-2'>
                        <div className='flex flex-col'>
                            <span className=' font-medium text-gray-700 dark:text-gray-300'>Title<span className=' text-rose-400 text-md'>*</span></span>
                            <input type="text" value={storeTitle} onChange={(ev) => setStoreTitle(ev.target.value)} className="py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none rounded-md w-full" placeholder='Title' />
                        </div>
                        <div className='flex flex-col'>
                            <span className=' font-medium text-gray-700 dark:text-gray-300'>Description<span className=' text-rose-400 text-md'>*</span></span>
                            <textarea rows='3' value={storeDesc} onChange={(ev) => setStoreDesc(ev.target.value)} className="scrollbar py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 resize-none focus:outline-none rounded-md w-full" placeholder='Description' />
                        </div>
                        <div className='flex flex-col'>
                            <span className=' font-medium text-gray-700 dark:text-gray-300'>Price<span className=' text-rose-400 text-md'>*</span></span>
                            <span className="absolute ml-2 mt-8 text-gray-700 dark:text-gray-300">$</span>
                            <input type='number' value={storePrice} onChange={(ev) => setStorePrice(ev.target.value)} className="scrollbar w-fit py-2 pl-6 pr-3 shadow text-md bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none rounded-md" />
                        </div>
                        <div className='flex flex-col'>
                            <span className=' font-medium text-gray-700 dark:text-gray-300'>Category<span className=' text-rose-400 text-md'>*</span></span>
                            <Dropdown left name='category' selectedPeriod={activeCategoryLabel} options={categoryOptions} onSelect={handleCategoryChange} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-5">
                    <button onClick={() => navigate(`/store`)} className="rounded-md px-3 py-1 bg-gray-300 focus:shadow-outline focus:outline-none">
                        Cancel
                    </button>
                    <button onClick={handleUpload} className="ml-3 rounded-md px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

export default {
    ExploreUpload,
    StoreUpload
}