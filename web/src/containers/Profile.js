import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { a_fetchProfileData } from '../store/actions/profile.actions';
import { r_resetProfile } from '../store/reducers/profile.reducer';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducer';
import { api_userImages } from '../utils/api_routes';

import ArtworksGridList from '../components/Lists/ArtworksGridList';

import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';
import { ReactComponent as SubscribeIcon } from "../assets/icons/subscribe.svg";
import { ReactComponent as VerifiedIcon } from '../assets/icons/verified.svg';
import { ReactComponent as NotificationIcon } from '../assets/icons/notifications.svg';
import { ReactComponent as MoreIcon } from '../assets/icons/more.svg';


const Profile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const moreRef = useRef(null);
    const profile = useSelector(state => state.profile);

    const [moreActive, setMoreActive] = useState(false);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0);
        if (id !== null) {
            dispatch(a_fetchProfileData(id));
        }
        return () => dispatch(r_resetProfile());
    }, [id])

    useEffect(() => {
        const handleClick = (e) => {
            if (!moreRef.current?.contains(e.target))
                setMoreActive(false);
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    const onFollowClick = () => {
        if (profile.is_verified)
            console.log('follow clicked')
        else {
            const msgData = {
                open: true,
                message: 'User not logged in. Please Sign In/Sign Up to perform the action.',
                type: 'error'
            }
            dispatch(r_setSnackMessage(msgData));
        }
    }

    return (
        <div className='bg-gray-200 dark:bg-darkBg'>
            <div className="block h-48">
                <img src='https://cdnb.artstation.com/p/assets/images/images/092/182/291/large/gabriele-nicastro-cpt-shots003.webp?1758903706' className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row gap-4 px-8 py-3">
                    <div className="relative h-fit align-middle sm:-mt-20 w-28 sm:w-40 rounded-full p-1.5 bg-darkBg">
                        {profile.avatar.icon.length > 0 && <img loading='lazy' src={api_userImages(profile.avatar.icon)} />}
                    </div>
                    <div className='flex flex-row w-full justify-between'>
                        <div className="flex flex-col gap-1.5 w-full">
                            <div className='flex flex-row justify-between'>
                                <div className="flex flex-col">
                                    <div className='flex flex-row items-center gap-1'>
                                        <h3 className="text-3xl font-bold text-neutral-800 dark:text-gray-200">{profile.name}</h3>
                                        {profile.is_verified && <VerifiedIcon className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 h-6 w-6" />}
                                        {profile.is_premium && <Artportal_logo fill="#059669" className='h-5 w-auto' />}
                                    </div>
                                    <p className='text-neutral-700 dark:text-gray-400 text-base tracking-wide'>@{profile.username}</p>
                                </div>
                                <div className='flex flex-row gap-3 items-center'>
                                    <NotificationIcon className="h-7 w-7 text-neutral-800 dark:text-gray-300 cursor-pointer" />
                                    <button
                                        className="flex w-fit p-1.5 tracking-wide bg-emerald-600 hover:bg-emerald-700  rounded-full items-center">
                                        <SubscribeIcon className="h-6 w-6 text-neutral-800 dark:text-gray-300" />
                                    </button>
                                    <button
                                        onClick={() => { }}
                                        className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-blue-700 hover:bg-blue-600 text-neutral-800 dark:text-gray-300 rounded-xl items-center"
                                    >
                                        Follow
                                    </button>
                                    <div ref={moreRef} className='relative flex'>
                                        <MoreIcon
                                            onClick={() => setMoreActive(!moreActive)}
                                            className="h-8 w-8 text-neutral-800 dark:text-gray-300 cursor-pointer"
                                        />
                                        {moreActive &&
                                            <div className='absolute top-10 right-0 flex-col rounded-lg w-48 p-2 bg-neutral-800'>
                                                <div className='flex flex-row py-1 px-2 gap-1 rounded-lg text-neutral-700 dark:text-gray-300 hover:bg-neutral-700'>
                                                    <p>Add to Favourites</p>
                                                </div>
                                                <div className='flex flex-row py-1 px-2 gap-1 rounded-lg text-neutral-700 dark:text-gray-300 hover:bg-neutral-700'>
                                                    <p>Block @{profile.username}</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <p className='text-base text-neutral-700 dark:text-gray-300'>{profile.bio}</p>
                            <div className="flex flex-row gap-6">
                                <span className="text-base font-semibold uppercase text-blueGray-800 dark:text-gray-200">{profile.artworks.length} artworks</span>
                                <span className="text-base font-semibold uppercase text-blueGray-800 dark:text-gray-200">{profile.followers} followers</span>
                                <span className="text-base font-semibold uppercase text-blueGray-800 dark:text-gray-200">{profile.following} followers</span>
                            </div>
                        </div>

                    </div>
                </div>
                {/* <div className='flex gap-3 items-center justify-start xs:flex-wrap xs:justify-center'>
                    <div onClick={() => setActiveView('portfolio')} className={`text-base font-medium ${activeView === 'portfolio' ? 'text-blue-700 dark:text-blue-700' : 'text-gray-700 dark:text-gray-400'}  cursor-pointer`}>Portfolio</div>
                    <span className='text-gray-700 dark:text-gray-400'>&#9679;</span>
                    <div onClick={() => setActiveView('about')} className={`text-base font-medium ${activeView === 'about' ? 'text-blue-700 dark:text-blue-700' : 'text-gray-700 dark:text-gray-400'}  cursor-pointer`}>About</div>
                    <span className='text-gray-700 dark:text-gray-400'>&#9679;</span>
                    <div onClick={() => setActiveView('liked')} className={`text-base font-medium ${activeView === 'liked' ? 'text-blue-700 dark:text-blue-700' : 'text-gray-700 dark:text-gray-400'}  cursor-pointer`}>Liked</div>
                    <span className='text-gray-700 dark:text-gray-400'>&#9679;</span>
                    {user.id === profile.id && <div onClick={() => setActiveView('bookmarks')} className={`text-base font-medium ${activeView === 'bookmarks' ? 'text-blue-700 dark:text-blue-700' : 'text-gray-700 dark:text-gray-400'}  cursor-pointer`}>Bookmarks</div>}
                </div> */}
                {/* {profile && renderView()} */}
                <div className='flex flex-row'>
                    <ArtworksGridList list={profile.artworks} />
                </div>
            </div>
        </div>
    )
}

// {user.id === profile.id ?
//     <div>
//         <button onClick={() => navigate('/settings/account')} className="flex items-center gap-2 bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
//             <FaUserEdit />
//             <span>Manage user profile</span>
//         </button>
//     </div>
//     :
//     <div className="px-3 sm:mt-0">
//         <button onClick={() => onFollowClick()} className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
//             Follow
//         </button>
//         <button onClick={() => onMessageClick()} className="bg-teal-500 active:bg-teal-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
//             Message
//         </button>
//     </div>
// }

export default Profile