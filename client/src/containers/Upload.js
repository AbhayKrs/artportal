import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useNavigate } from "react-router-dom";

import randomSentence from 'random-sentence';

import { setSnackMessage, setLoader, getTags } from '../store/actions/common.actions';
import { handleExploreUpload } from '../store/actions/explore.actions';
import { handleStoreUpload } from '../store/actions/store.actions';

import { MdClose } from 'react-icons/md';
import { BsHash } from 'react-icons/bs';

import DragDrop from '../components/DragDrop';
import Dropdown from '../components/Dropdown';

const ExploreUpload = (props) => {
    let navigate = useNavigate();

    const [exploreCategories, setExploreCategories] = useState([]);
    const [exploreFiles, setExploreFiles] = useState([]);
    const [exploreTitle, setExploreTitle] = useState('');
    const [exploreDesc, setExploreDesc] = useState('');
    const [exploreTags, setExploreTags] = useState([]);
    const [tagSearch, setTagSearch] = useState('');
    const [primaryFile, setPrimaryFile] = useState('');

    useEffect(async () => {
        props.setLoader(true);
        window.scrollTo(0, 0)
        await props.getTags();
        // setExploreTitle(randomSentence({ min: 2, max: 8 }))
        // setExploreDesc(randomSentence({ min: 5, max: 14 }))
        // setExploreTags(props.common.tags.sort(() => 0.5 - Math.random()).slice(0, 10))
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
            props.setSnackMessage(msgData);
        }
        else {
            Object.keys(ev.target.files).map((key, index) => {
                let convertedFile;
                let userImage = new Image();

                userImage.src = URL.createObjectURL(ev.target.files[key])

                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');

                userImage.onload = () => {
                    canvas.width = userImage.width;
                    canvas.height = userImage.height;
                    ctx.drawImage(userImage, 0, 0);
                    let convertedImg = canvas.toDataURL('image/webp');
                    let newImage = new Image();
                    newImage.src = convertedImg;
                    convertedFile = dataURLtoFile(newImage.src, `${ev.target.files[key].name.split('.')[0]}.webp`)
                    setExploreFiles(arr => [...arr, convertedFile])
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
            props.setSnackMessage(msgData);
        } else {
            Object.keys(ev.target.files).map((key, index) => {
                let convertedFile;
                let userImage = new Image();

                userImage.src = URL.createObjectURL(ev.target.files[key])

                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');

                userImage.onload = () => {
                    canvas.width = userImage.width;
                    canvas.height = userImage.height;
                    ctx.drawImage(userImage, 0, 0);
                    let convertedImg = canvas.toDataURL('image/webp');
                    let newImage = new Image();
                    newImage.src = convertedImg;
                    convertedFile = dataURLtoFile(newImage.src, `${ev.target.files[key].name.split('.')[0]}.webp`)
                    setExploreFiles(arr => [...arr, convertedFile])
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
        if (exploreTags.filter(item => item == selectedTag).length === 0) {
            if (exploreTags.length === 10) {
                setTagSearch('');
                const msgData = {
                    open: true,
                    message: 'Maximum number of tags assigned!',
                    type: 'warning'
                }
                props.setSnackMessage(msgData);
            } else {
                setExploreTags(tags => [...tags, selectedTag])
            }
        }
    }

    const handleRemoveTag = (selectedTag) => {
        setExploreTags(exploreTags.filter(tag => tag !== selectedTag))
    }

    const handleUpload = () => {
        if (exploreFiles.length === 0 || exploreTitle.length === 0 || exploreDesc.length === 0 || exploreTags.length === 0) {
            const msgData = {
                open: true,
                message: 'Please fill all the required fields!',
                type: 'error'
            }
            props.setSnackMessage(msgData)
            return;
        }

        const userID = props.common.user.id;
        const exploreUploadData = new FormData();
        exploreFiles.map(file => exploreUploadData.append('files[]', file));
        exploreCategories.map(category => exploreUploadData.append('categories[]', category));
        exploreUploadData.append('title', exploreTitle);
        exploreUploadData.append('description', exploreDesc);
        exploreUploadData.append('userID', userID);
        exploreTags.map(tag => exploreUploadData.append('tags[]', tag));

        props.handleExploreUpload(exploreUploadData).then(() => {
            navigate(`/explore`)
            const msgData = {
                open: true,
                message: 'Successfully Uploaded!',
                type: 'success'
            }
            props.setSnackMessage(msgData);
        }).catch(err => {
            const msgData = {
                open: true,
                message: 'Upload Failed!',
                type: 'warning'
            }
            props.setSnackMessage(msgData);
        });
    }

    return (
        <div className="main-container bg-gray-200 dark:bg-darkNavBg p-5">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
                <span className='font-caviar text-3xl text-gray-700 dark:text-gray-300'>Upload</span>
                <div className='flex lg:flex-row flex-col mt-3 lg:space-x-4 md:space-y-2'>
                    <div className='w-full xs:mb-2 md:mb-0'>
                        <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Files<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                        <div className="flex flex-col space-y-3">
                            <div className="flex flex-col justify-center items-center border-dashed space-y-2 rounded-lg border-2 border-gray-400 py-8" onDrop={(ev) => dropHandler(ev)} onDragOver={(ev) => dragOverHandler(ev)} >
                                <p className="font-semibold text-gray-700 dark:text-gray-300 flex flex-wrap justify-center">Drag files</p>
                                <p className="font-semibold text-gray-700 dark:text-gray-300">OR</p>
                                <label htmlFor="file-upload" className='bg-violet-500 text-white font-caviar font-semibold py-1 px-2 rounded'>
                                    Select files
                                </label>
                                <input id="file-upload" className='hidden' type="file" multiple onChange={onImageChange} />
                            </div>
                            <div className="flex flex-col rounded-lg bg-slate-100 dark:bg-neutral-700 shadow items-center py-5 px-1 w-full">
                                <h1 className="font-bold sm:text-lg text-gray-800 dark:text-gray-400">Upload Files</h1>
                                <div className="h-full w-full text-center flex flex-col items-center justify-center items-center">
                                    {exploreFiles.length === 0 ?
                                        <div className='w-full'>
                                            <img loading='lazy' className="mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                                            <span className="text-small dark:text-gray-500">No files selected</span>
                                            <div className='font-josefinlight text-rose-400 font-semibold text-sm'>You may select a maximum of 3 files.</div>
                                        </div>
                                        :
                                        <div className='w-full'>
                                            <DragDrop
                                                selectedImages={exploreFiles.map((explore, index) => {
                                                    return {
                                                        id: index.toString(),
                                                        content: explore
                                                    }
                                                })}
                                                setReorderedFiles={setExploreFiles}
                                                setCategories={(categories) => setExploreCategories(imageCategories => [...new Set([...imageCategories, ...categories])])}
                                                setSnackMessage={(msgData) => props.setSnackMessage(msgData)}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full space-y-2'>
                        {exploreCategories.length === 0 ? '' : <div className='flex flex-col'>
                            <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Categories:</span>
                            <div className="w-full inline-flex flex-col justify-center relative text-gray-500">
                                <div id='category_menu' className='flex flex-wrap space-x-1'>
                                    {exploreCategories.map((category, index) => (
                                        <div key={index} className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-indigo-100 bg-violet-500 border border-violet-700 ">
                                            <div className="text-xs font-normal leading-none max-w-full flex-initial">{category}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        }
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
                                        {props.common.tags.filter(tag => tag.includes(tagSearch)).map(tag => {
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
                                            <div className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-indigo-100 bg-violet-500 border border-violet-700 ">
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
                <div className="flex justify-end pt-5">
                    <button onClick={() => navigate(`/explore`)} className="rounded-md px-3 py-1 bg-gray-300 focus:shadow-outline focus:outline-none">
                        Cancel
                    </button>
                    <button onClick={handleUpload} className="ml-3 rounded-md px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white focus:shadow-outline focus:outline-none">
                        Apply
                    </button>
                </div>
            </div>
        </div >
    )
}

const StoreUpload = (props) => {
    let navigate = useNavigate();

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
        props.setLoader(true);
        window.scrollTo(0, 0)
        props.getTags();
    }, [])

    const onImageChange = (ev) => {
        if (ev.target.files.length > 3 || storeFiles.length > 2) {
            const msgData = {
                open: true,
                message: 'Only a maximum of 3 files may be selected.',
                type: 'warning'
            }
            props.setSnackMessage(msgData);
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
            props.setSnackMessage(msgData);
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
            props.setSnackMessage(msgData)
            return;
        }

        const userID = props.common.user.id;
        const formData = new FormData();

        storeFiles.map(file => formData.append('files[]', file));
        formData.append('title', storeTitle);
        formData.append('description', storeDesc);
        formData.append('price', storePrice);
        formData.append('category', storeCategory);
        formData.append('userID', userID);

        props.handleStoreUpload(formData).then(() => {
            navigate(`/store`)
            const msgData = {
                open: true,
                message: 'Successfully listed product!',
                type: 'success'
            }
            props.setSnackMessage(msgData);
        }).catch(err => {
            const msgData = {
                open: true,
                message: 'Upload Failed!',
                type: 'warning'
            }
            props.setSnackMessage(msgData);
        });
    }

    return (
        <div className="main-container bg-gray-200 dark:bg-darkNavBg p-5">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-5">
                <span className='font-caviar text-3xl text-gray-700 dark:text-gray-300'>List Product to Store</span>
                <div className='flex lg:flex-row flex-col mt-3 lg:space-x-4 md:space-y-2'>
                    <div className='w-full'>
                        <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Files<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                        <div className="flex flex-col space-y-3">
                            <div className="flex flex-col justify-center items-center border-dashed space-y-2 rounded-lg border-2 border-gray-400 py-8" onDrop={(ev) => dropHandler(ev)} onDragOver={(ev) => dragOverHandler(ev)} >
                                <p className="font-semibold text-gray-700 dark:text-gray-300 flex flex-wrap justify-center">Drag files</p>
                                <p className="font-semibold text-gray-700 dark:text-gray-300">OR</p>
                                <label htmlFor="file-upload" className='bg-violet-500 text-white font-caviar font-semibold py-1 px-2 rounded'>
                                    Select files
                                </label>
                                <input id="file-upload" className='hidden' type="file" multiple onChange={onImageChange} />
                            </div>
                            <div className="flex flex-col rounded-lg bg-slate-100 dark:bg-neutral-700 shadow items-center py-5 px-1 w-full">
                                <h1 className="font-bold sm:text-lg text-gray-800 dark:text-gray-400">Upload Files</h1>
                                <div className="h-full w-full text-center flex flex-col items-center justify-center items-center">
                                    {storeFiles.length === 0 ?
                                        <div>
                                            <img loading='lazy' className="mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                                            <span className="text-small dark:text-gray-500">No files selected</span>
                                            <div className='font-josefinlight text-rose-400 font-semibold text-sm'>You may select a maximum of 3 files.</div>
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
                    <div className='w-full space-y-2'>
                        <div className='flex flex-col'>
                            <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Title<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                            <input type="text" value={storeTitle} onChange={(ev) => setStoreTitle(ev.target.value)} className="py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 focus:outline-none rounded-md w-full" placeholder='Title' />
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Description<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                            <textarea rows='3' value={storeDesc} onChange={(ev) => setStoreDesc(ev.target.value)} className="scrollbar py-2 px-3 shadow text-md bg-slate-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 resize-none focus:outline-none rounded-md w-full" placeholder='Description' />
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Price<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                            <span className="absolute ml-2 mt-8 text-gray-700 dark:text-gray-300">$</span>
                            <input type='number' value={storePrice} onChange={(ev) => setStorePrice(ev.target.value)} className="scrollbar w-fit py-2 pl-6 pr-3 shadow text-md bg-slate-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 focus:outline-none rounded-md" />
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-josefinlight font-semibold text-gray-700 dark:text-gray-300'>Category<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
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

const mapStateToProps = (state, props) => ({
    user: state.common.user,
    common: state.common,
    uploadData: state.explore.uploadData
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setSnackMessage,
    setLoader,
    getTags,
    handleExploreUpload,
    handleStoreUpload
}, dispatch);

export default {
    ExploreUpload: connect(mapStateToProps, mapDispatchToProps)(ExploreUpload),
    StoreUpload: connect(mapStateToProps, mapDispatchToProps)(StoreUpload)
}