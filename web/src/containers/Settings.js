import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { api_artworkImages, api_userImages } from '../utils/api_routes';
import { r_setLoader } from '../store/reducers/common.reducers';

import Divider from '../components/Divider';

import { MdSettings } from 'react-icons/md';

export const Settings = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.common.user);

    const [childPath, setChildPath] = useState('');

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        setChildPath(location.pathname.split("/").pop())
    }, [location.pathname])

    const fetchTitle = () => {
        switch (childPath) {
            case 'general': return 'General';
            case 'account': return 'Account';
            case 'notifications': return 'Notifications';
            case 'community': return 'Community';
            case 'about': return 'About';
            case 'tos': return 'Terms of Service';
            case 'privacy': return 'Privacy Policy';
            default: break;
        }
    }

    return (
        <div className='flex flex-col gap-2 p-4 bg-gray-200 dark:bg-darkBg'>
            <nav className="flex py-2 px-3 text-gray-700 bg-slate-300 rounded-lg dark:bg-neutral-900" aria-label="Breadcrumb">
                <div className="inline-flex items-center gap-1 md:gap-3">
                    <div className="inline-flex items-center gap-2 font-medium ">
                        <p onClick={() => navigate('/settings/general')} className="inline-flex cursor-pointer items-center hover:text-gray-900 text-gray-600 dark:text-neutral-400 dark:hover:text-gray-200">
                            <MdSettings className="mr-1 w-5 h-5" />
                            Settings
                        </p>
                        <span>/</span>
                        <span className="capitalize text-neutral-900 dark:text-gray-200">{fetchTitle()}</span>
                    </div>
                </div>
            </nav>

            <div className='grid grid-cols-4 gap-4'>
                <div className='flex flex-col p-3 gap-3 bg-slate-300 rounded-lg dark:bg-neutral-900 items-start'>
                    {common.isAuthenticated && <>
                        <div className="flex gap-2 w-full justify-center">
                            {user.avatar.icon.length > 0 && <img loading='lazy' className='w-24' src={api_userImages(user.avatar.icon)} />}
                            <div className='clear-left'>
                                <h2 className='text-2xl font-bold text-gray-700 dark:text-white'>{user.name}</h2>
                                <h4 className='text-sm font-semibold text-gray-500 dark:text-neutral-400'>{`Member since ` + ` (` + moment(user.created_on).format('LL') + `)`}</h4>
                                <h4 className='text-sm font-semibold text-gray-500 dark:text-neutral-400'>{`Premium member since ` + moment(user.created_on).format('LL')}</h4>
                            </div>
                        </div>
                    </>
                    }
                    <Divider />
                    <div className='flex flex-col gap-1 w-full'>
                        <button onClick={() => navigate('/settings/general')} className={`flex w-full p-2 gap-2 items-end text-xl font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                            <div className={`${childPath === "general" ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                            General
                        </button>
                        {common.isAuthenticated && <>
                            <button onClick={() => navigate('/settings/account')} className={`flex w-full p-2 gap-2 items-end text-xl font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                                <div className={`${childPath === "account" ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                                Account
                            </button>
                            <button onClick={() => navigate('/settings/notifications')} className={`flex w-full p-2 gap-2 items-end text-xl font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                                <div className={`${childPath === "notifications" ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                                Notifications
                            </button>
                            <button onClick={() => navigate('/settings/community')} className={`flex w-full p-2 gap-2 items-end text-xl font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                                <div className={`${childPath === "community" ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                                Community
                            </button>
                            <button onClick={() => navigate('/settings/billing')} className={`flex w-full p-2 gap-2 items-end text-xl font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                                <div className={`${childPath === "billing" ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                                Billing
                            </button>
                        </>}

                        <button onClick={() => navigate('/settings/about')} className={`flex w-full p-2 gap-2 items-end text-xl font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                            <div className={`${childPath === "about" ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                            About
                        </button>
                        <button onClick={() => navigate('/settings/tos')} className={`flex w-full p-2 gap-2 items-end text-xl font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                            <div className={`${childPath === "tos" ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                            Terms of Service
                        </button>
                        <button onClick={() => navigate('/settings/privacy')} className={`flex w-full p-2 gap-2 items-end text-xl font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                            <div className={`${childPath === "privacy" ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                            Privacy Policy
                        </button>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default Settings