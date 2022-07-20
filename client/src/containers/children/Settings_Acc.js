import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AiOutlineLink } from 'react-icons/ai';
import { FaEdit, FaRegUserCircle } from 'react-icons/fa';
import { MdAlternateEmail } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';

import { setError, loadProfileDetails } from '../../store/actions/common.actions';
import { fetchExploreImages, fetchUserImages } from '../../api';
import { AvatarModal } from '../../components/Modal';


export const Settings_Acc = (props) => {
    const [username, setUsername] = useState('');
    const [profileName, setProfileName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarModal, setAvatarModal] = useState(false);

    useEffect(() => {
        if (!props.common.user.id) {
        } else {
            props.loadProfileDetails(props.common.user.id);
            setUsername(props.user.username);
            setProfileName(props.user.name);
            setEmail(props.user.email)
        }
    }, [props.common.user])

    const handleUsernameChange = (val) => {
        console.log(val);
    }

    const openAvatarModal = () => {
        if (props.common.isAuthenticated)
            setAvatarModal(true)
        else {
            const error = {
                open: true,
                message: 'User not logged in. Please Sign In/Sign Up to perform the action.',
                type: 'error'
            }
            props.setError(error);
        }
    }

    return (
        <div className='flex flex-col col-span-3 p-2'>
            <h1 className='text-4xl font-antipasto tracking-wider font-bold dark:text-purple-500'>Account Settings</h1>
            <h3 className='text-lg font-josefinlight tracking-wide font-bold dark:text-gray-400'>Update your personal account details here.</h3>
            <div className='grid grid-cols-3 gap-4 p-3'>
                <div className='col-span-2 flex flex-col rounded gap-4 py-4 px-6 bg-neutral-800/75'>
                    <div className='grid grid-cols-4'>
                        <div className='flex items-center'>
                            <div className='flex gap-2'>
                                {props.user.avatar ? <img loading='lazy' className='w-28' src={fetchUserImages(props.user.avatar.icon)} /> : null}
                                <FaEdit onClick={() => openAvatarModal()} className='h-5 w-5 text-rose-400 cursor-pointer' />
                            </div>
                        </div>
                        <div className='col-span-3 flex flex-col'>
                            <div className=''>
                                <div className='flex gap-2'>
                                    <h2 className='text-lg font-josefinlight font-semibold dark:text-gray-300'>Full name</h2>
                                    <FaEdit className='h-5 w-5 text-rose-400 cursor-pointer' />
                                </div>
                                <div className='flex relative items-center gap-2'>
                                    <FaRegUserCircle className='absolute h-5 w-5 text-gray-400 ml-2' />
                                    <input disabled={true} type="text" name="search" value={profileName} onChange={(ev) => handleUsernameChange(ev.target.value)} className="placeholder-gray-600 w-full dark:placeholder-gray-300 text-black dark:text-white bg-slate-300 dark:bg-neutral-700 h-10 pl-9 pr-16 rounded-lg text-sm focus:outline-none" />
                                </div>
                            </div>
                            <div className=''>
                                <div className='flex gap-2'>
                                    <h2 className='text-lg font-josefinlight font-semibold dark:text-gray-300'>Username</h2>
                                    <FaEdit className='h-5 w-5 text-rose-400 cursor-pointer' />
                                </div>
                                <div className='flex relative items-center gap-2'>
                                    <AiOutlineLink className='absolute h-5 w-5 text-gray-400 ml-2' />
                                    <input disabled={true} type="text" name="search" value={username} onChange={(ev) => handleUsernameChange(ev.target.value)} className="placeholder-gray-600 w-full dark:placeholder-gray-300 text-black dark:text-white bg-slate-300 dark:bg-neutral-700 h-10 pl-9 pr-16 rounded-lg text-sm focus:outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <div className='flex gap-2'>
                            <h2 className='text-lg font-josefinlight font-semibold dark:text-gray-300'>Email address</h2>
                            <FaEdit className='h-5 w-5 text-rose-400 cursor-pointer' />
                        </div>
                        <div className='flex relative items-center gap-2'>
                            <MdAlternateEmail className='absolute h-5 w-5 text-gray-400 ml-2' />
                            <input disabled={true} type="text" name="search" value={email} onChange={(ev) => handleUsernameChange(ev.target.value)} className="placeholder-gray-600 w-full dark:placeholder-gray-300 text-black dark:text-white bg-slate-300 dark:bg-neutral-700 h-10 pl-9 pr-16 rounded-lg text-sm focus:outline-none" />
                        </div>
                    </div>
                    <div className=''>
                        <div className='flex gap-2'>
                            <h2 className='text-lg font-josefinlight font-semibold dark:text-gray-300'>Profile bio</h2>
                            <FaEdit className='h-5 w-5 text-rose-400 cursor-pointer' />
                        </div>
                        <div className='flex items-center gap-2'>
                            <textarea rows='4' disabled={true} value={email} onChange={(ev) => handleUsernameChange(ev.target.value)} className="placeholder-gray-600 w-full dark:placeholder-gray-300 text-black dark:text-white bg-slate-300 dark:bg-neutral-700 p-3 pr-16 rounded-lg text-sm focus:outline-none" />
                        </div>
                    </div>
                </div>
                <div className='rounded gap-4 py-4 px-6 bg-neutral-800/75'>
                    <h2 className='text-xl font-josefinlight font-semibold dark:text-gray-300'>Linked Accounts</h2>
                    <p className='font-josefinlight font-semibold dark:text-gray-400'>Connect your social accounts to ease login process with just a few clicks.</p>
                    <div className='flex flex-col gap-2 rounded-md p-3 bg-neutral-900'>
                        <div className='flex gap-2 justify-between'>
                            <FcGoogle className='h-10 w-10' />
                            <h5 className='font-josefinlight text-md text-gray-300 font-semibold'>Use Google to sign in to your account. Learn more</h5>
                        </div>
                        {true ?
                            <button disabled className="bg-green-200 text-green-500 px-3 py-1 w-fit rounded-md text-md font-caviar font-bold">
                                Connected!
                            </button> :
                            <button className="bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal">
                                Sign Out
                            </button>
                        }
                    </div>
                    {/* <div className='flex flex-col rounded-md p-3 bg-neutral-900'>
                        <div className='flex justify-between'>
                            <h1 className='flex text-xl font-md text-gray-200'><FcGoogle className='h-6 w-6' /> Google</h1>
                            {false ?
                                <button disabled className="bg-green-200 text-green-500 px-3 py-1 rounded-md text-md font-caviar font-bold">
                                    Connected!
                                </button> :
                                <button className="bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal">
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
                avatarList={props.common.avatarList}
                handleEditUserAvatar={props.handleEditUserAvatar}
                onClose={() => setAvatarModal(false)}
            />}
        </div >
    )
}

const mapStateToProps = (state) => ({
    user: state.common.user,
    common: state.common
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setError,
    loadProfileDetails
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Settings_Acc)