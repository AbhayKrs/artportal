import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';

import { api_userImages } from '../utils/api_routes';
import { a_handlePostUpload } from '../store/actions/posts.actions';
import { r_setSnackMessage } from '../store/reducers/common.reducer';

import Divider from './Divider';
import AutoResizeTextarea from './Inputs/AutoResizeTextarea';
import DragDrop from './DragDrop';

import { ReactComponent as MediaIcon } from '../assets/icons/media.svg';
import { ReactComponent as EmojiIcon } from '../assets/icons/emoji.svg';


const PostInput = ({ value, toggle }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const tags = useSelector(state => state.common.tags);

    const pickerRef = useRef(null);
    const [fullText, setFullText] = useState("");
    const [images, setImages] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);
    const [primaryFile, setPrimaryFile] = useState('');

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // useEffect(() => {
    //     dispatch(a_getTags());
    // }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (user && user.accessToken === '')
        return null;

    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const onImageChange = (ev) => {
        if (ev.target.files.length > 4 || images.length > 4) {
            const msgData = {
                open: true,
                message: 'Only a maximum of 4 files may be selected.',
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
                    setImages(arr => [...arr, convertedFile]);

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

    const handleSubmit = () => {
        const data = new FormData();
        const userID = user.id;

        data.append("full_text", fullText);
        images.map(file => data.append('files[]', file));
        data.append('userID', userID);

        dispatch(a_handlePostUpload(data));
    }

    const handleEmojiClick = (emojiData) => {
        setFullText(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className='flex flex-col gap-2 py-3 px-4 border border-gray-400 dark:border-neutral-800 rounded-lg bg-gray-200 dark:bg-black/15'>
            <div className='flex flex-row gap-2'>

                <div className='flex flex-col gap-2 w-full'>
                    <div className='flex flex-row gap-2'>
                        {user.avatar.icon && <div className="w-12 h-12 overflow-hidden">
                            {user.avatar.icon.length > 0 && <img loading='lazy' src={api_userImages(user.avatar.icon)} alt="user_avatar" className="object-contain w-full h-full" />}
                        </div>}
                        <AutoResizeTextarea
                            value={fullText}
                            onChange={e => setFullText(e.target.value)}
                            placeholder="Write something..."
                        // tags={tags.flatMap(itm => itm.value)}
                        />
                    </div>
                    <div className='flex flex-row'>
                        {images.length === 0 ?
                            null
                            :
                            <div className='w-full'>
                                <DragDrop
                                    source="posts"
                                    selectedImages={images.map((file, index) => {
                                        return {
                                            id: index.toString(),
                                            content: file
                                        }
                                    })}
                                    setReorderedFiles={setImages}
                                    r_setSnackMessage={(msgData) => dispatch(r_setSnackMessage(msgData))}
                                />
                                <div className='text-red-400 font-medium text-sm'>You may select a maximum of 3 files.</div>
                            </div>
                        }
                    </div>
                    <Divider noPadding />
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-row gap-2'>
                            <div className="flex" >
                                <label htmlFor="file-upload">
                                    <MediaIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-400 cursor-pointer" />
                                </label>
                                <input id="file-upload" className='hidden' type="file" multiple onChange={onImageChange} />
                            </div>
                            <div ref={pickerRef} className='relative'>
                                <button
                                    type="button"
                                    className="text-neutral-600 dark:text-neutral-300 hover:text-yellow-400"
                                    onClick={() => setShowEmojiPicker(v => !v)}
                                >
                                    <EmojiIcon className="h-5 w-5 text-neutral-700 dark:text-neutral-400 cursor-pointer" />
                                </button>
                                {showEmojiPicker && (
                                    <div className="absolute z-50 top-6 left-0">
                                        <EmojiPicker
                                            theme={localStorage.getItem("theme")}
                                            searchDisabled={true}
                                            onEmojiClick={handleEmojiClick}
                                            previewConfig={{
                                                showPreview: false
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <button className='flex text-base py-1 px-3 rounded-lg text-white dark:text-black bg-blue-700' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default PostInput;