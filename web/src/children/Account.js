import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";

import { a_fetchAvatars, a_handleEditUserAvatar, a_handleUpdateUser, a_handleViewUser, a_refreshUserDetails } from '../store/actions/common.actions';
import { r_setSnackMessage } from '../store/reducers/common.reducers';
import { api_fetchArtworkImages, api_fetchUserImages } from '../utils/api';

import { AvatarModal, ConfirmModal } from '../components/Modal';

import { AiOutlineLink } from 'react-icons/ai';
import { FaEdit, FaRegUserCircle } from 'react-icons/fa';
import { MdAlternateEmail, MdEditOff, MdDownloadDone } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { MdAddAPhoto, MdClose } from 'react-icons/md';

export const Account = (props) => {
    const dispatch = useDispatch();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.common.user);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatarModal, setAvatarModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);

    const [editStatus, setEditStatus] = useState(false);

    useEffect(() => {
        if (!common.user.id) {
        } else {
            dispatch(a_fetchAvatars());
            dispatch(a_handleViewUser(common.user.id));
            setUsername(user.username);
            setName(user.name);
            setEmail(user.email)
            setBio(user.bio)
        }
    }, [common.user])

    const openAvatarModal = () => {
        if (common.isAuthenticated)
            setAvatarModal(true)
        else {
            const msgData = {
                open: true,
                message: 'User not logged in. Please Sign In/Sign Up to perform the action.',
                type: 'error'
            }
            dispatch(r_setSnackMessage(msgData));
        }
    }

    const updateUserData = () => {
        let userData;
        userData = { name: name, username: username, bio: bio };
        dispatch(a_handleUpdateUser({ userID: user.id, userData }));
        setEditStatus(false);
        setTimeout(() => {
            dispatch(a_refreshUserDetails(user.id));
        }, 2000);
    }

    const editAvatar = (avatar) => {
        dispatch(a_handleEditUserAvatar({ userID: user.id, avatar }));
    }

    return (
        <div className='flex flex-col col-span-3 p-2'>
            <h1 className='text-4xl font-antipasto tracking-wider font-bold text-purple-500'>Account Settings</h1>
            <h3 className='text-lg font-josefinlight tracking-wide font-bold dark:text-gray-400'>Update your personal account details here.</h3>
            <div className='grid grid-cols-3 gap-4 p-3'>
                <div className='relative col-span-2 flex flex-col rounded gap-4 py-4 px-6 bg-gray-300 dark:bg-neutral-800/75'>
                    {!editStatus ?
                        <FaEdit onClick={() => setEditStatus(true)} className='absolute top-0 right-0 m-2 h-6 w-6 text-rose-500 dark:text-rose-400 cursor-pointer' />
                        :
                        <div className='absolute top-0 right-0 flex m-2 space-x-1'>
                            <MdEditOff onClick={() => setEditStatus(false)} className='h-6 w-6 text-rose-500 dark:text-rose-400 cursor-pointer' />
                            <MdDownloadDone onClick={() => setConfirmModal(true)} className='h-7 w-7 text-green-500 dark:text-green-400 cursor-pointer' />
                        </div>
                    }
                    <div className='grid grid-cols-4'>
                        <div className='flex items-center'>
                            <div className='flex gap-2 relative'>
                                {user.avatar ? <img loading='lazy' className='w-28' src={api_fetchUserImages(user.avatar.icon)} /> : null}
                                {editStatus && <MdAddAPhoto onClick={() => openAvatarModal()} className='absolute bottom-0 right-0 h-6 w-6 cursor-pointer text-gray-800 dark:text-gray-200' />}
                            </div>
                        </div>
                        <div className='col-span-3 flex flex-col'>
                            <div className=''>
                                <div className='flex gap-2'>
                                    <h2 className='text-lg font-josefinlight font-semibold dark:text-gray-300'>Full name</h2>
                                </div>
                                <div className='flex relative items-center gap-2'>
                                    <FaRegUserCircle className='absolute h-5 w-5 text-gray-400 ml-2' />
                                    <input disabled={!editStatus} type="text" name="search" value={name} onChange={(ev) => setName(ev.target.value)} className="placeholder-gray-600 w-full dark:placeholder-gray-300 text-black dark:text-white bg-white disabled:bg-gray-200 dark:bg-neutral-700 dark:disabled:bg-neutral-900 h-10 pl-9 pr-16 rounded-lg text-sm focus:outline-none" />
                                </div>
                            </div>
                            <div className=''>
                                <div className='flex gap-2'>
                                    <h2 className='text-lg font-josefinlight font-semibold dark:text-gray-300'>Username</h2>
                                </div>
                                <div className='flex relative items-center gap-2'>
                                    <AiOutlineLink className='absolute h-5 w-5 text-gray-400 ml-2' />
                                    <input disabled={!editStatus} type="text" name="search" value={username} onChange={(ev) => setUsername(ev.target.value)} className="placeholder-gray-600 w-full dark:placeholder-gray-300 text-black dark:text-white bg-white disabled:bg-gray-200 dark:bg-neutral-700 dark:disabled:bg-neutral-900 h-10 pl-9 pr-16 rounded-lg text-sm focus:outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <div className='flex gap-2'>
                            <h2 className='text-lg font-josefinlight font-semibold dark:text-gray-300'>Email address</h2>
                        </div>
                        <div className='flex relative items-center gap-2'>
                            <MdAlternateEmail className='absolute h-5 w-5 text-gray-400 ml-2' />
                            <input disabled type="text" name="search" value={email} onChange={(ev) => setEmail(ev.target.value)} className="placeholder-gray-600 w-full dark:placeholder-gray-300 text-black dark:text-white bg-white disabled:bg-gray-200 dark:bg-neutral-700 dark:disabled:bg-neutral-900 h-10 pl-9 pr-16 rounded-lg text-sm focus:outline-none" />
                        </div>
                    </div>
                    <div className=''>
                        <div className='flex gap-2'>
                            <h2 className='text-lg font-josefinlight font-semibold dark:text-gray-300'>Profile bio</h2>
                        </div>
                        <div className='flex items-center gap-2'>
                            <textarea rows='4' disabled={!editStatus} value={bio} placeholder="Enter a brief description about yourself and what your art signifies." onChange={(ev) => setBio(ev.target.value)} className="placeholder-gray-600 w-full dark:placeholder-gray-400 text-black dark:text-white bg-white disabled:bg-gray-200 dark:bg-neutral-700 dark:disabled:bg-neutral-900 p-3 pr-16 rounded-lg text-sm focus:outline-none" />
                        </div>
                    </div>
                </div>
                <div className='rounded gap-4 py-4 px-6 bg-gray-300 dark:bg-neutral-800/75'>
                    <h2 className='text-xl font-josefinlight font-semibold text-black dark:text-gray-300'>Linked Accounts</h2>
                    <p className='font-josefinlight font-semibold text-gray-600 dark:text-gray-400'>Connect your social accounts to ease login process with just a few clicks.</p>
                    <div className='flex flex-col gap-2 rounded-md p-3 bg-gray-200 dark:bg-neutral-900'>
                        <div className='flex gap-2 justify-between'>
                            <FcGoogle className='h-10 w-10' />
                            <h5 className='font-josefinlight text-md text-black dark:text-gray-300 font-semibold'>Use Google to sign in to your account. Learn more</h5>
                        </div>
                        {user.google_authenticated ?
                            <button disabled className="bg-green-200 text-green-500 px-3 py-1 w-fit rounded-md text-md font-parkinsans font-bold">
                                Connected!
                            </button> :
                            <button className="bg-green-500 text-gray-900 dark:text-gray-200 hover:bg-green-600 dark:hover:bg-green-600 px-3 py-1 rounded-md text-lg font-parkinsans font-bold dark:font-normal">
                                Link Account to Google
                            </button>
                        }
                    </div>
                    {/* <div className='flex flex-col rounded-md p-3 bg-neutral-900'>
                        <div className='flex justify-between'>
                            <h1 className='flex text-xl font-md text-gray-200'><FcGoogle className='h-6 w-6' /> Google</h1>
                            {false ?
                                <button disabled className="bg-green-200 text-green-500 px-3 py-1 rounded-md text-md font-parkinsans font-bold">
                                    Connected!
                                </button> :
                                <button className="bg-indigo-600 text-gray-900 dark:text-gray-200 hover:bg-indigo-600 dark:hover:bg-indigo-600 px-3 py-1 rounded-md text-lg font-parkinsans font-bold dark:font-normal">
                                    Sign in
                                </button>
                            }
                        </div>
                        <h4 className='font-josefinlight text-gray-300 font-semibold'>Use Google to sign in to your account.</h4>
                    </div> */}
                </div>
            </div>
            {avatarModal && <AvatarModal
                open={avatarModal}
                title='Pick your Avatar'
                avatarList={common.avatarList}
                a_handleEditUserAvatar={editAvatar}
                onClose={() => setAvatarModal(false)}
            />}
            {confirmModal && <ConfirmModal
                open={confirmModal}
                title='Do you confirm to edit your user details?'
                onClose={() => setConfirmModal(false)}
                onConfirm={() => updateUserData()}
            />}
        </div >
    )
}

export default Account