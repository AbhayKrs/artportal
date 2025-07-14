import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { api_fetchArtworkImages, api_fetchUserImages } from '../utils/api_routes';
import { r_setLoader } from '../store/reducers/common.reducers';

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
                        <p onClick={() => navigate('/settings/general')} className="inline-flex cursor-pointer items-center hover:text-gray-900 text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
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
                            {user.avatar.icon.length > 0 && <img loading='lazy' className='w-24' src={api_fetchUserImages(user.avatar.icon)} />}
                            <div className='clear-left'>
                                <h2 className='text-2xl font-bold text-gray-700 dark:text-white'>{user.name}</h2>
                                <h4 className='text-sm font-semibold text-gray-500 dark:text-gray-400'>{`Member since ` + moment(user.created_on).fromNow() + ` ( ` + moment(user.created_on).format('LL') + ` )`}</h4>
                                <h4 className='text-sm font-semibold text-gray-500 dark:text-gray-400'>{`Premium member since ` + moment(user.created_on).format('LL')}</h4>
                            </div>
                        </div>
                    </>
                    }
                    <button className={`${childPath === 'general' ? `text-purple-500` : `text-black dark:text-gray-300`}  font-bold`} onClick={() => navigate('/settings/general')}>General</button>
                    {common.isAuthenticated && <> <button className={`${childPath === 'account' ? `text-purple-500` : `text-black dark:text-gray-300`}  font-bold`} onClick={() => navigate('/settings/account')}>Account</button>
                        <button disabled className={`${childPath === 'notifications' ? `text-purple-500` : `text-gray-500 dark:text-gray-600`}  font-bold`} onClick={() => navigate('/settings/notifications')}>Notifications</button>
                        <button disabled className={`${childPath === 'community' ? `text-purple-500` : `text-gray-500 dark:text-gray-600`}  font-bold`} onClick={() => navigate('/settings/community')}>Community</button>
                        <button disabled className={`${childPath === 'billing' ? `text-purple-500` : `text-gray-500 dark:text-gray-600`}  font-bold`} onClick={() => navigate('/settings/billing')}>Billing</button>
                    </>}
                    <button className={`${childPath === 'about' ? `text-purple-500` : `text-black dark:text-gray-300`}  font-bold`} onClick={() => navigate('/settings/about')}>About</button>
                    <button className={`${childPath === 'tos' ? `text-purple-500` : `text-black dark:text-gray-300`}  font-bold`} onClick={() => navigate('/settings/tos')}>Terms of Service</button>
                    <button className={`${childPath === 'privacy' ? `text-purple-500` : `text-black dark:text-gray-300`}  font-bold`} onClick={() => navigate('/settings/privacy')}>Privacy Policy</button>
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default Settings