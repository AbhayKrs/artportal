import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { matchRoutes, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import moment from 'moment';

import { fetchExploreImages, fetchUserImages } from '../api';
import { setError, setLoader } from '../store/actions/common.actions';
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

    return (
        <div className='main-container flex flex-col gap-2 p-4 bg-gray-200 dark:bg-darkNavBg'>
            <nav className="flex py-2 px-3 text-gray-700 bg-slate-300 rounded-lg dark:bg-neutral-900" aria-label="Breadcrumb">
                <div className="inline-flex items-center space-x-1 md:space-x-3">
                    <div className="inline-flex items-center space-x-2 font-medium text-gray-700 ">
                        <a href={`/settings/general`} className="inline-flex items-center hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                            <MdSettings className="mr-1 w-5 h-5" />
                            Settings
                        </a>
                        <span>/</span>
                        <span className="capitalize text-neutral-900 dark:text-gray-200">{childPath}</span>
                    </div>
                </div>
            </nav>

            <div className='grid grid-cols-4 gap-4'>
                <div className='flex flex-col p-3 space-y-3 text-gray-700 bg-slate-300 rounded-lg dark:bg-neutral-900 dark:text-gray-300'>
                    <div className="flex space-x-2 w-full justify-center">
                        {props.user.avatar ? <img loading='lazy' className='w-24' src={fetchUserImages(props.user.avatar.icon)} /> : null}
                        <div className='clear-left'>
                            <h2 className='text-2xl font-josefinlight font-bold'>{props.user.name}</h2>
                            <h4 className='text-sm font-josefinlight font-semibold text-gray-500 dark:text-gray-400'>{`Member since ` + moment(props.user.joinDate).fromNow() + ` (` + moment(props.user.joinDate).format('LL') + `)`}</h4>
                        </div>
                    </div>
                    <hr />
                    <button className={`${childPath === 'general' && `text-purple-500`} font-caviar font-bold`} onClick={() => navigate('/settings/general')}>General</button>
                    <button className={`${childPath === 'account' && `text-purple-500`} font-caviar font-bold`} onClick={() => navigate('/settings/account')}>Account</button>
                    <button disabled className={childPath === 'notifications' ? `text-purple-500` : `dark:text-gray-600`} onClick={() => navigate('/settings/notifications')}>Notifications</button>
                    <button disabled className={childPath === 'community' ? `text-purple-500` : `dark:text-gray-600`} onClick={() => navigate('/settings/community')}>Community</button>
                    <button disabled className={childPath === 'billing' ? `text-purple-500` : `dark:text-gray-600`} onClick={() => navigate('/settings/billing')}>Billing</button>
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
    setError
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Settings)