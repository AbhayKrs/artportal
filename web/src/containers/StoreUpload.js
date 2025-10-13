import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet';

import { a_handleStoreUpload } from '../store/actions/store.actions';
import { a_getTags } from '../store/actions/common.actions';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducer';

import { MdClose } from 'react-icons/md';
import { BsHash } from 'react-icons/bs';

import DragDrop from '../components/DragDrop';
import Title from '../components/Title';
import FlaggedModal from '../components/Modals/FlaggedModal';

import { ReactComponent as AiAgentIcon } from '../assets/icons/ai_agent.svg';
import Dropdown from '../components/Dropdown';

const StoreUpload = ({ }) => {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.user);

    const [category, setCategory] = useState("");
    const [files, setFiles] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const [title, setTitle] = useState('Bond Beyond Time City Tote');
    const [description, setDescription] = useState('Imagination is their brush, and the future, their canvas. City Tote transcends space and time to bring you a tomorrow envisioned and created by artists. Inspired by the clean slate of tomorrow, City is crafted from 100% cotton canvas. The lightweight design effortlessly blends into your routine, and flawlessly folds flat when not in use. The artwork featured in the product has been created by winning artist — Amit Kumar.');
    const [price, setPrice] = useState(1405);
    const [discountedPrice, setDiscountedPrice] = useState(799);
    const [stock, setStock] = useState(5);
    const [tags, setTags] = useState([]);
    const [tagSearch, setTagSearch] = useState('');
    const [primaryFile, setPrimaryFile] = useState('tote');
    const [activeCategoryLabel, setActiveCategoryLabel] = useState('Tote');

    const [hasDiscount, setHasDiscount] = useState(true);

    const categoryOptions = [
        { id: 1, label: 'Prints', value: 'prints' },
        { id: 2, label: 'Clothing', value: 'clothes' },
        { id: 3, label: 'Frames', value: 'frames' },
        { id: 4, label: 'Tote', value: 'tote' }
    ]

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
        if (ev.target.files.length > 10 || files.length > 10) {
            const msgData = {
                open: true,
                message: 'Only a maximum of 10 files may be selected.',
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
        if (ev.dataTransfer.files.length > 10 || files.length > 10) {
            const msgData = {
                open: true,
                message: 'Only a maximum of 10 files may be selected.',
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

    const handleCategoryChange = (category) => {
        setCategory(category.value);
        setActiveCategoryLabel(category.label)
    }

    const handleUpload = () => {
        if (files.length === 0 || title.length === 0 || description.length === 0 || price === 0 || category.length === 0 || stock === 0) {
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
        uploadData.append('title', title);
        uploadData.append('description', description);
        uploadData.append('price', price);
        uploadData.append('discount_price', discountedPrice);
        uploadData.append('category', category);
        uploadData.append('stock', stock);
        uploadData.append('userID', userID);

        dispatch(a_handleStoreUpload(uploadData)).then(() => {
            navigate(`/store`)
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
                <title>artportal | Store - Upload</title>
            </Helmet>
            <div className="py-4 px-8">
                <Title text="Store - Upload" />
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
                                            <img loading='lazy' className="my-2 mx-auto w-32" src="https:user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                                            <span className="text-sm tracking-wide dark:text-gray-500">No files selected</span>
                                            <div className='text-red-400 font-medium tracking-wide text-sm'>You may select a maximum of 3 files only.</div>
                                        </div>
                                        :
                                        <div className='w-full'>
                                            <DragDrop
                                                source="store"
                                                selectedImages={files.map((file, index) => {
                                                    return {
                                                        id: index.toString(),
                                                        content: file
                                                    }
                                                })}
                                                setReorderedFiles={setFiles}
                                                r_setSnackMessage={(msgData) => dispatch(r_setSnackMessage(msgData))}
                                            />
                                            <div className='text-red-400 font-medium text-sm'>You may add a maximum of 10 images.</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-4/12 ">
                        <div className='flex flex-col gap-1'>
                            <span className='text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Title<span className='text-red-400 text-base'>*</span></span>
                            <input type="text" maxLength={250} value={title} onChange={(ev) => setTitle(ev.target.value)} className="py-2 px-4 shadow text-base bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none rounded-full w-full" placeholder='Title' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Description<span className='text-red-400 text-base'>*</span></span>
                            <textarea rows='4' maxLength={1000} value={description} onChange={(ev) => setDescription(ev.target.value)} className="scrollbar py-2 px-3 shadow text-base bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 resize-none focus:outline-none rounded-xl w-full" placeholder='Description' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Price<span className='text-red-400 text-base'>*</span></span>
                                <input type="number" maxLength={250} value={price} onChange={(ev) => setPrice(ev.target.value)} className="py-2 px-4 shadow text-base bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none rounded-full w-full" placeholder='Price' />
                            </div>
                            <label className="flex items-center cursor-pointer gap-2">
                                <input
                                    type="checkbox"
                                    checked={hasDiscount}
                                    onChange={() => setHasDiscount(!hasDiscount)}
                                    style={{
                                        WebkitAppearance: 'none',
                                    }}
                                    className="h-4 w-4 appearance-none align-middle rounded-md outline-none bg-slate-300 dark:bg-neutral-700 checked:bg-blue-700 dark:checked:bg-blue-700 cursor-pointer"
                                />
                                <p className='tracking-wide text-sm text-neutral-700 dark:text-neutral-400'>Do you wish to provide at a discount?</p>
                            </label>
                            {hasDiscount && <div className='flex flex-col gap-1'>
                                <input type="number" maxLength={250} value={discountedPrice} onChange={(ev) => setDiscountedPrice(ev.target.value)} className="py-2 px-4 shadow text-base bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none rounded-full w-full" placeholder='Discount Price' />
                            </div>}
                        </div>
                        <div className='flex flex-row gap-4'>
                            <div className='flex flex-col gap-1 w-full'>
                                <span className='text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Category<span className='text-red-400 text-base'>*</span></span>
                                <Dropdown
                                    left
                                    withBg
                                    name='category'
                                    selected={activeCategoryLabel}
                                    options={categoryOptions}
                                    onSelect={handleCategoryChange}
                                />
                            </div>
                            <div className='flex flex-col gap-1 w-full'>
                                <span className='text-lg tracking-wide font-medium text-gray-700 dark:text-gray-300'>Stock<span className='text-red-400 text-base'>*</span></span>
                                <input type="number" maxLength={250} value={stock} onChange={(ev) => setStock(ev.target.value)} className="py-2 px-4 shadow text-base bg-slate-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 focus:outline-none rounded-full w-full" placeholder='Stock' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 justify-end pt-5">
                <button onClick={() => navigate(`/store`)} className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-neutral-400 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-800 rounded-xl items-center">
                    Reset
                </button>
                <button disabled={files.length === 0 || title.length === 0 || description.length === 0} onClick={handleUpload} className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-blue-700 dark:bg-blue-700 disabled:bg-neutral-700 disabled:dark:bg-neutral-700 hover:bg-neutral-600 text-neutral-800 dark:text-gray-300 disabled:text-neutral-800 disabled:dark:text-neutral-500 rounded-xl items-center">
                    Apply
                </button>
            </div>
        </div>
    )
}

export default StoreUpload;