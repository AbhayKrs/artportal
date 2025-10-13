import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { a_fetchProfileData } from '../store/actions/profile.actions';
import { r_resetProfile } from '../store/reducers/profile.reducer';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducer';
import { api_artworkImages, api_userImages } from '../utils/api_routes';

import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';
import { ReactComponent as SubscribeIcon } from "../assets/icons/subscribe.svg";
import { ReactComponent as VerifiedIcon } from '../assets/icons/verified.svg';
import { ReactComponent as NotificationIcon } from '../assets/icons/notifications.svg';
import { ReactComponent as MoreIcon } from '../assets/icons/more.svg';

import MasonryGrid from '../components/Grids/Masonry';

import { BsHeart, BsChat } from 'react-icons/bs';
import { BiTimeFive } from 'react-icons/bi';
import { GoInfo } from 'react-icons/go';
import UserBadge from '../components/Badges/UserBadge';

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

    // const renderView = () => {
    //     switch (activeView) {
    //         case 'portfolio': return <div className='flex flex-row'>
    //             <MasonryGrid cols={5}>
    //                 {profile.artworks.map((artwork, index) => (
    //                     <div key={index} className='relative group group-hover:block'>
    //                         <img loading='lazy'
    //                             id={index}
    //                             className='object-cover w-full h-full'
    //                             src={api_artworkImages(artwork.files[0])}
    //                         />
    //                         <div className='absolute z-30 hidden group-hover:flex top-0 right-0 m-2 gap-1'>
    //                             <GoInfo onClick={() => navigate(`/artwork/${artwork._id}`)} className='w-6 h-6 cursor-pointer text-gray-200' />
    //                         </div>
    //                         <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row group-hover:justify-between w-full bg-gradient-to-t from-black text-gray-200 '>
    //                             <div className="flex flex-col place-self-end max-w-[65%]">
    //                                 <h3 className="text-md text-base font-bold leading-5 capitalize break-words">{artwork.title}</h3>
    //                                 <div className='flex'>
    //                                     <span className="font-base text-xs my-1 mr-1">
    //                                         {artwork.artist.username}
    //                                     </span>
    //                                     <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    //                                         <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
    //                                     </svg>
    //                                 </div>
    //                             </div>
    //                             <div className="flex flex-col self-end place-items-end gap-1.5">
    //                                 <div className="inline-flex items-center">
    //                                     <BsHeart className='h-4 w-4' />
    //                                     <span className="text-xs ml-1 antialiased">{artwork.likes.length}</span>
    //                                 </div>
    //                                 <div className="inline-flex items-center">
    //                                     <BsChat className='h-4 w-4' />
    //                                     <span className="text-xs ml-1 antialiased">{artwork.comment_count}</span>
    //                                 </div>
    //                                 <div className="inline-flex items-center">
    //                                     <BiTimeFive className='h-4 w-4' />
    //                                     <span className="text-xs ml-1 antialiased text-right whitespace-nowrap">{moment(artwork.createdAt).fromNow()}</span>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </MasonryGrid>
    //         </div>
    //         case 'about': return <div className='text-4xl text-gray-400'>HELLO</div>
    //         case 'liked': return <div className='flex flex-row'>
    //             <MasonryGrid cols={5}>
    //                 {profile.artworks.filter(item => item.likes.indexOf(profile.id) >= 0).map((artwork, index) => (
    //                     <div key={index} onClick={() => navigate(`/artwork/${artwork._id}`)} className='relative group group-hover:block'>
    //                         <img loading='lazy'
    //                             id={index}
    //                             className='object-cover w-full h-full'
    //                             src={api_artworkImages(artwork.files[0])}
    //                         />
    //                         <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex w-full bg-gradient-to-t from-black text-gray-200 group-hover:justify-between'>
    //                             <div className="flex flex-col place-self-end max-w-[65%]">
    //                                 <h3 className="text-md text-base font-bold leading-5 capitalize break-words">{artwork.title}</h3>
    //                                 <div className='flex'>
    //                                     <span className="font-base text-xs my-1 mr-1">
    //                                         {artwork.artist.username}
    //                                     </span>
    //                                     <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    //                                         <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
    //                                     </svg>
    //                                 </div>
    //                             </div>
    //                             <div className="flex flex-col self-end place-items-end gap-1.5">
    //                                 <div className="inline-flex items-center">
    //                                     <BsHeart className='h-4 w-4' />
    //                                     <span className="text-xs ml-1 antialiased">{artwork.likes.length}</span>
    //                                 </div>
    //                                 <div className="inline-flex items-center">
    //                                     <BsChat className='h-4 w-4' />
    //                                     <span className="text-xs ml-1 antialiased">{artwork.comment_count}</span>
    //                                 </div>
    //                                 <div className="inline-flex items-center">
    //                                     <BiTimeFive className='h-4 w-4' />
    //                                     <span className="text-xs ml-1 antialiased">{moment(artwork.createdAt).fromNow()}</span>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </MasonryGrid>
    //         </div>
    //         case 'bookmarks': return <div className='flex flex-row'>
    //             <MasonryGrid cols={5}>
    //                 {profile.bookmarks.map((artwork, index) => (
    //                     <div key={index} className='relative group group-hover:block'>
    //                         <img loading='lazy'
    //                             id={index}
    //                             className='object-cover w-full h-full'
    //                             src={api_artworkImages(artwork.files[0])}
    //                         />
    //                         <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row w-full bg-gradient-to-t from-black text-gray-200 group-hover:justify-between'>
    //                             <div className="flex flex-col place-self-end max-w-[65%]">
    //                                 <h3 className="text-md text-base font-bold leading-5 capitalize break-words">{artwork.title}</h3>
    //                                 <div className='flex'>
    //                                     <span className="font-base text-xs my-1 mr-1">
    //                                         {artwork.artist.username}
    //                                     </span>
    //                                     <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    //                                         <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
    //                                     </svg>
    //                                 </div>
    //                             </div>
    //                             <div className="flex flex-col self-end place-items-end gap-1.5">
    //                                 <GoInfo onClick={() => navigate(`/artwork/${artwork._id}`)} className='w-6 h-6 cursor-pointer text-gray-200' />
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </MasonryGrid>
    //         </div>
    //         default: break;
    //     }
    // }

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
                    <MasonryGrid cols={5}>
                        {profile.artworks.map((artwork, index) => (
                            <div onClick={() => navigate(`/artwork/${artwork._id}`)} key={index} className='relative group group-hover:block cursor-pointer'>
                                <img loading='lazy'
                                    id={index}
                                    className='object-cover w-full h-full'
                                    src={api_artworkImages(artwork.files[0])}
                                />
                                {/* <div className='absolute z-30 hidden group-hover:flex top-0 right-0 m-2 gap-1'>
                                    <GoInfo className='w-6 h-6 cursor-pointer text-gray-200' />
                                </div>
                                <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row group-hover:justify-between w-full bg-gradient-to-t from-black text-gray-200 '>
                                    <div className="flex flex-col place-self-end max-w-[65%]">
                                        <h3 className="text-md text-base font-bold leading-5 capitalize break-words">{artwork.title}</h3>
                                        <div className='flex'>
                                            <span className="font-base text-xs my-1 mr-1">
                                                {artwork.artist.username}
                                            </span>
                                            <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col self-end place-items-end gap-1.5">
                                        <div className="inline-flex items-center">
                                            <BsHeart className='h-4 w-4' />
                                            <span className="text-xs ml-1 antialiased">{artwork.likes.length}</span>
                                        </div>
                                        <div className="inline-flex items-center">
                                            <BsChat className='h-4 w-4' />
                                            <span className="text-xs ml-1 antialiased">{artwork.comment_count}</span>
                                        </div>
                                        <div className="inline-flex items-center">
                                            <BiTimeFive className='h-4 w-4' />
                                            <span className="text-xs ml-1 antialiased text-right whitespace-nowrap">{moment(artwork.createdAt).fromNow()}</span>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        ))}
                    </MasonryGrid>
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