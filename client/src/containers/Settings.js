import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { matchRoutes, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import moment from 'moment';

import { fetchArtworkImages, fetchUserImages } from '../api';
import { setSnackMessage, setLoader } from '../store/actions/common.actions';
import { MdSettings } from 'react-icons/md';

export const Settings = (props) => {
    let navigate = useNavigate();
    const location = useLocation();

    const [childPath, setChildPath] = useState('');

    useEffect(async () => {
        props.setLoader(true);
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
        <div className=' flex flex-col gap-2 p-4 bg-gray-200 dark:bg-darkNavBg'>
            <nav className="flex py-2 px-3 text-gray-700 bg-slate-300 rounded-lg dark:bg-neutral-900" aria-label="Breadcrumb">
                <div className="inline-flex items-center space-x-1 md:space-x-3">
                    <div className="inline-flex items-center space-x-2 font-medium ">
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
                <div className='flex flex-col p-3 space-y-3 bg-slate-300 rounded-lg dark:bg-neutral-900 '>
                    {props.common.isAuthenticated && <>
                        <div className="flex space-x-2 w-full justify-center">
                            {props.user.avatar ? <img loading='lazy' className='w-24' src={fetchUserImages(props.user.avatar.icon)} /> : null}
                            <div className='clear-left'>
                                <h2 className='text-2xl font-josefinlight font-bold text-gray-700 dark:text-white'>{props.user.name}</h2>
                                <h4 className='text-sm font-josefinlight font-semibold text-gray-500 dark:text-gray-400'>{`Member since ` + moment(props.user.joinDate).fromNow() + ` (` + moment(props.user.joinDate).format('LL') + `)`}</h4>
                            </div>
                        </div>
                        <hr />
                    </>
                    }
                    <button className={`${childPath === 'general' ? `text-purple-500` : `text-black dark:text-gray-300`} font-caviar font-bold`} onClick={() => navigate('/settings/general')}>General</button>
                    <button className={`${childPath === 'account' ? `text-purple-500` : `text-black dark:text-gray-300`} font-caviar font-bold`} onClick={() => navigate('/settings/account')}>Account</button>
                    <button disabled className={`${childPath === 'notifications' ? `text-purple-500` : `text-gray-500 dark:text-gray-600`} font-caviar font-bold`} onClick={() => navigate('/settings/notifications')}>Notifications</button>
                    <button disabled className={`${childPath === 'community' ? `text-purple-500` : `text-gray-500 dark:text-gray-600`} font-caviar font-bold`} onClick={() => navigate('/settings/community')}>Community</button>
                    <button disabled className={`${childPath === 'billing' ? `text-purple-500` : `text-gray-500 dark:text-gray-600`} font-caviar font-bold`} onClick={() => navigate('/settings/billing')}>Billing</button>
                    <button className={`${childPath === 'about' ? `text-purple-500` : `text-black dark:text-gray-300`} font-caviar font-bold`} onClick={() => navigate('/settings/about')}>About</button>
                    <button className={`${childPath === 'tos' ? `text-purple-500` : `text-black dark:text-gray-300`} font-caviar font-bold`} onClick={() => navigate('/settings/tos')}>Terms of Service</button>
                    <button className={`${childPath === 'privacy' ? `text-purple-500` : `text-black dark:text-gray-300`} font-caviar font-bold`} onClick={() => navigate('/settings/privacy')}>Privacy Policy</button>
                </div>
                <Outlet />
            </div>
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader,
    setSnackMessage
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Settings)