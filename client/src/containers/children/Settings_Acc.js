import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';


export const Settings_Acc = (props) => {
    const [username, setUsername] = useState('');
    const [profileName, setProfileName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        setUsername(props.user.username);
        setProfileName(props.user.name);
        setEmail(props.user.email)
    }, [props.common.user])

    const handleUsernameChange = (val) => {
        console.log(val);
    }

    return (
        <div className='flex flex-col col-span-3'>
            <h1 className='text-4xl font-antipasto tracking-wider font-bold dark:text-purple-500'>Account Settings</h1>
            <div className='flex flex-col gap-4 py-4 px-6'>
                <div className=''>
                    <h2 className='text-2xl font-josefinlight font-semibold dark:text-gray-300'>Username</h2>
                    <div className='flex items-center gap-2'>
                        <input disabled={true} type="text" name="search" value={username} onChange={(ev) => handleUsernameChange(ev.target.value)} className="mx-2 placeholder-gray-600 w-fit dark:placeholder-gray-300 text-black dark:text-white bg-slate-300 dark:bg-neutral-900 h-10 px-3 pr-16 rounded-lg text-sm focus:outline-none" />
                        <FaEdit className='h-6 w-6 text-gray-400 cursor-pointer' />
                    </div>
                </div>
                <div className=''>
                    <h2 className='text-2xl font-josefinlight font-semibold dark:text-gray-300'>Profile Name</h2>
                    <div className='flex items-center gap-2'>
                        <input disabled={true} type="text" name="search" value={profileName} onChange={(ev) => handleUsernameChange(ev.target.value)} className="mx-2 placeholder-gray-600 w-fit dark:placeholder-gray-300 text-black dark:text-white bg-slate-300 dark:bg-neutral-900 h-10 px-3 pr-16 rounded-lg text-sm focus:outline-none" />
                        <FaEdit className='h-6 w-6 text-gray-400 cursor-pointer' />
                    </div>
                </div>
                <div className=''>
                    <h2 className='text-2xl font-josefinlight font-semibold dark:text-gray-300'>Email address</h2>
                    <div className='flex items-center gap-2'>
                        <input disabled={true} type="text" name="search" value={email} onChange={(ev) => handleUsernameChange(ev.target.value)} className="mx-2 placeholder-gray-600 w-fit dark:placeholder-gray-300 text-black dark:text-white bg-slate-300 dark:bg-neutral-900 h-10 px-3 pr-16 rounded-lg text-sm focus:outline-none" />
                        <FaEdit className='h-6 w-6 text-gray-400 cursor-pointer' />
                    </div>
                </div>
                <div className=''>
                    <h2 className='text-2xl font-josefinlight font-semibold dark:text-gray-300'>Connected Accounts</h2>
                    <div className='flex gap-1 mx-2'>
                        <FcGoogle className='h-5 w-5' />
                        <div className='flex items-center text-lg font-josefinlight dark:text-gray-400'>Google Authenticated</div>
                    </div>
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = (state) => ({
    user: state.common.user,
    common: state.common
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Settings_Acc)