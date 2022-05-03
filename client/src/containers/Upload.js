import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useNavigate } from "react-router-dom";

import { setError, getTags } from '../store/actions/common.actions';
import { handleUploadExplore } from '../store/actions/upload.actions';

import { MdClose } from 'react-icons/md';
import { BsHash } from 'react-icons/bs';

import DragDrop from '../components/DragDrop';

const ExploreUpload = (props) => {
    let navigate = useNavigate();

    const [exploreFiles, setExploreFiles] = useState([]);
    const [exploreTitle, setExploreTitle] = useState('test_title');
    const [exploreDesc, setExploreDesc] = useState('test_desc');
    const [exploreTags, setExploreTags] = useState([]);
    const [tagSearch, setTagSearch] = useState('');
    const [primaryFile, setPrimaryFile] = useState('');

    useEffect(() => {
        props.getTags();
    }, [])

    useEffect(() => {
        console.log('files', exploreFiles);
    }, [exploreFiles])

    const onImageChange = (ev) => {
        if (ev.target.files.length > 3 || exploreFiles.length > 2) {
            const error = {
                open: true,
                message: 'Only a maximum of 3 files may be selected.',
                type: 'snackbar'
            }
            props.setError(error);
        }
        else {
            Object.keys(ev.target.files).map((key, index) => {
                setExploreFiles(arr => [...arr, ev.target.files[key]])
            })
            setPrimaryFile(ev.target.files[0]);
        }
    }

    const dropHandler = (ev) => {
        ev.nativeEvent.preventDefault();
        if (ev.dataTransfer.files.length > 3 || exploreFiles.length > 2) {
            const error = {
                open: true,
                message: 'Only a maximum of 3 files may be selected.',
                type: 'snackbar'
            }
            props.setError(error);
        } else {
            Object.keys(ev.dataTransfer.files).map((key, index) => {
                setExploreFiles(arr => [...arr, ev.dataTransfer.files[key]])
            })
            setPrimaryFile(ev.dataTransfer.files[0]);
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
                const error = {
                    open: true,
                    message: 'Maximum number of tags assigned!',
                    type: 'snackbar'
                }
                props.setError(error);
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
            const errorData = {
                open: true,
                message: 'Please fill all the required fields!',
                type: 'error'
            }
            props.setError(errorData)
            return;
        }

        const userID = props.common.user.id;
        const formData = new FormData();

        exploreFiles.map(file => formData.append('files[]', file));
        formData.append('title', exploreTitle);
        formData.append('description', exploreDesc);
        formData.append('userID', userID);
        exploreTags.map(tag => formData.append('tags[]', tag));

        props.handleUploadExplore(formData).then(() => {
            navigate(`/explore`)
            const errorData = {
                open: true,
                message: 'Successfully Uploaded!',
                type: 'success'
            }
            props.setError(errorData);
        }).catch(err => {
            console.log('err', err);
        });
    }

    return (
        <div className="bg-darkNavBg p-5">
            <div className="bg-neutral-800 rounded-lg p-5">
                <span className='font-caviar text-3xl text-gray-300'>Upload</span>
                <div className='mt-3 space-y-2'>
                    <div>
                        <span className='font-josefinlight text-gray-300'>Files<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                        <div className="flex flex-col space-y-3">
                            <div className="flex flex-col justify-center items-center border-dashed space-y-2 rounded-lg border-2 border-gray-400 py-8" onDrop={(ev) => dropHandler(ev)} onDragOver={(ev) => dragOverHandler(ev)} >
                                <p className="font-semibold text-gray-300 flex flex-wrap justify-center">Drag files</p>
                                <p className="font-semibold text-gray-300">OR</p>
                                <label for="file-upload" className='bg-violet-500 text-white font-caviar font-semibold py-1 px-2 rounded'>
                                    Select files
                                </label>
                                <input id="file-upload" className='hidden' type="file" multiple onChange={onImageChange} />
                            </div>
                            <div className="flex flex-col rounded-lg bg-neutral-700 items-center py-5 px-1 w-full">
                                <h1 className="font-bold sm:text-lg text-gray-400">Upload Files</h1>
                                <div className="h-full w-full text-center flex flex-col items-center justify-center items-center">
                                    {exploreFiles.length === 0 ?
                                        <div>
                                            <img className="mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                                            <span className="text-small text-gray-500">No files selected</span>
                                            <div className='font-josefinlight text-rose-400 text-sm'>You may select a maximum of 3 files.</div>
                                        </div>
                                        :
                                        <div className=''>
                                            <DragDrop
                                                selectedImages={exploreFiles.map((explore, index) => {
                                                    return {
                                                        id: index.toString(),
                                                        content: explore
                                                    }
                                                })}
                                                setReorderedFiles={setExploreFiles}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span className='font-josefinlight text-gray-300'>Title<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                            <input type="text" value={exploreTitle} onChange={(ev) => setExploreTitle(ev.target.value)} className="py-2 px-3 text-md bg-neutral-600 text-gray-300 focus:outline-none rounded-md w-full" placeholder='Title' />
                        </div>
                        <div>
                            <span className='font-josefinlight text-gray-300'>Description<span className='font-josefinlight text-rose-400 text-md'>*</span></span>
                            <textarea rows='4' value={exploreDesc} onChange={(ev) => setExploreDesc(ev.target.value)} className="scrollbar py-2 px-3 text-md bg-neutral-600 text-gray-300 resize-none focus:outline-none rounded-md w-full" placeholder='Title' />
                        </div>
                        <div>
                            <span className='font-josefinlight text-gray-300'>Add tags:</span>
                            <div className='font-josefinlight text-rose-400 text-sm'>You may assign a maximum of 10 tags</div>
                            <div className="w-full inline-flex flex-col justify-center relative text-gray-500">
                                <div className="relative">
                                    <input value={tagSearch} onChange={(ev) => setTagSearch(ev.target.value)} type="text" className="p-2 pl-8 w-full text-md rounded bg-neutral-600 text-gray-300 focus:outline-none" placeholder="Search for tags..." />
                                    <BsHash className="w-5 h-5 text-gray-300 absolute left-2 top-2.5" />
                                    {tagSearch.length === 0 ? '' : <MdClose onClick={() => setTagSearch('')} className="w-5 h-5 text-gray-300 absolute right-2 top-2.5" />}
                                </div>
                                {tagSearch.length === 0 ? '' :
                                    <div className="scrollbar grid grid-cols-2 bg-neutral-600 max-h-60 h-full overflow-y-auto w-full mt-2 rounded">
                                        {props.common.tags.filter(tag => tag.includes(tagSearch)).map(tag => {
                                            if (exploreTags.includes(tag)) {
                                                return <div className="flex justify-between items-center pl-8 pr-2 py-2 m-2 bg-violet-100 text-gray-600 rounded">
                                                    {tag}
                                                    <MdClose onClick={() => handleRemoveTag(tag)} className='h-5 w-5 cursor-pointer' />
                                                </div>
                                            } else {
                                                return <div onClick={() => handleSelectTag(tag)} className="pl-8 pr-2 py-2 m-2 text-gray-300 cursor-pointer hover:bg-violet-300 hover:text-gray-800 hover:rounded">
                                                    {tag}
                                                </div>
                                            }
                                        })}
                                    </div>
                                }
                                {exploreTags.length === 0 ? '' :
                                    <div id='tagmenu' className='flex flex-wrap justify-center space-x-1 p-2'>
                                        {exploreTags.map(tag => (
                                            <div class="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-indigo-100 bg-violet-600 border border-violet-700 ">
                                                <div class="text-xs font-normal leading-none max-w-full flex-initial">{tag}</div>
                                                <div class="flex flex-auto flex-row-reverse">
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
                    <button onClick={handleUpload} className="ml-3 rounded-md px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none">
                        Apply
                    </button>
                </div>
            </div>
        </div >
    )
}

const StoreUpload = (props) => {
    return (
        <div>test store show</div>
    )
}

const mapStateToProps = (state, props) => ({
    user: state.common.user,
    common: state.common,
    uploadData: state.uploadData,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setError,
    getTags,
    handleUploadExplore
}, dispatch);

export default {
    ExploreUpload: connect(mapStateToProps, mapDispatchToProps)(ExploreUpload),
    StoreUpload: connect(mapStateToProps, mapDispatchToProps)(StoreUpload)
}