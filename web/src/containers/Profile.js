import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { r_clearProfileDetails, r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducers';
import { a_fetchUserExploreList, a_handleDeleteBookmark, a_handleFetchUserDetails, a_refreshUserDetails } from '../store/actions/common.actions';
import { a_deleteArtwork, a_fetchExploreList } from '../store/actions/explore.actions';
import { api_fetchArtworkImages, api_fetchUserImages } from '../utils/api_routes';

import Masonry from '../components/Masonry';

import { BsHeart, BsChat, BsTrash } from 'react-icons/bs';
import { FaUserEdit } from 'react-icons/fa';
import { BiTimeFive } from 'react-icons/bi';
import { GoInfo } from 'react-icons/go';
import { IoCloseCircle } from 'react-icons/io5';


const Profile = (props) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const common = useSelector(state => state.common);
    const artworks = useSelector(state => state.explore.artworks);
    const profile_data = useSelector(state => state.common.profile_data);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0);
        if (id !== null) {
            dispatch(a_fetchExploreList());
            dispatch(a_handleFetchUserDetails(id));
            dispatch(a_fetchUserExploreList(id));
        }
        return () => dispatch(r_clearProfileDetails());
    }, [id])

    const [activeView, setActiveView] = useState('portfolio');

    const deleteArtwork = (exploreID) => {
        const msgData = {
            open: true,
            message: 'Successfully deleted uploaded artwork.',
            type: 'success'
        }
        dispatch(r_setSnackMessage(msgData));
        dispatch(a_deleteArtwork(exploreID))
        setTimeout(() => {
            dispatch(a_refreshUserDetails(profile_data.id));
            dispatch(a_handleFetchUserDetails(id));
        }, 2000)
    }

    const deleteBookmark = (bookmarkID, userID) => {
        const msgData = {
            open: true,
            message: 'Bookmark deleted.',
            type: 'success'
        }
        dispatch(r_setSnackMessage(msgData));
        dispatch(a_handleDeleteBookmark({ bookmarkID, userID }))
    }

    const onFollowClick = () => {
        if (common.authenticated)
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

    const onMessageClick = () => {
        if (common.authenticated)
            console.log('message clicked')
        else {
            const msgData = {
                open: true,
                message: 'User not logged in. Please Sign In/Sign Up to perform the action.',
                type: 'error'
            }
            dispatch(r_setSnackMessage(msgData));
        }
    }

    const renderView = () => {
        switch (activeView) {
            case 'portfolio': return <div className='flex flex-row'>
                <Masonry cols={4}>
                    {profile_data.artworks.map((artwork, index) => (
                        <div key={index} className='relative group group-hover:block'>
                            <img loading='lazy'
                                id={index}
                                className='object-cover w-full h-full'
                                src={api_fetchArtworkImages(artwork.files[0])}
                            />
                            <div className='absolute z-30 hidden group-hover:flex top-0 right-0 m-2 space-x-1'>
                                {common.user.id === profile_data.id && <BsTrash onClick={() => deleteArtwork(artwork._id)} className=' h-6 w-6 cursor-pointer text-gray-200' />}
                                <GoInfo onClick={() => navigate(`/artworks/${artwork._id}`)} className='w-6 h-6 cursor-pointer text-gray-200' />
                            </div>
                            <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row w-full bg-gradient-to-t from-black text-gray-200 group-hover:flex group-hover:justify-between'>
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
                                <div className="flex flex-col self-end place-items-end space-y-1.5">
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
                            </div>
                        </div>
                    ))}
                </Masonry>
            </div>
            case 'about': return <div className='text-4xl text-gray-400'>HELLO</div>
            case 'liked': return <div className='flex flex-row'>
                <Masonry cols={5}>
                    {artworks.filter(item => item.likes.indexOf(profile_data.id) >= 0).map((artwork, index) => (
                        <div key={index} onClick={() => navigate(`/artworks/${artwork._id}`)} className='relative group group-hover:block'>
                            <img loading='lazy'
                                id={index}
                                className='object-cover w-full h-full'
                                src={api_fetchArtworkImages(artwork.files[0])}
                            />
                            <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row w-full bg-gradient-to-t from-black text-gray-200 group-hover:flex group-hover:justify-between'>
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
                                <div className="flex flex-col self-end place-items-end space-y-1.5">
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
                                        <span className="text-xs ml-1 antialiased">{moment(artwork.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Masonry>
            </div>
            case 'bookmarks': return <div className='flex flex-row'>
                <Masonry cols={5}>
                    {profile_data.bookmarks.map((artwork, index) => (
                        <div key={index} className='relative group group-hover:block'>
                            <img loading='lazy'
                                id={index}
                                className='object-cover w-full h-full'
                                src={api_fetchArtworkImages(artwork.files[0])}
                            />
                            <IoCloseCircle onClick={() => deleteBookmark(artwork._id, common.user.id)} className='hidden group-hover:flex absolute z-30 top-0 right-0 h-8 w-8 m-2 cursor-pointer text-gray-200' />
                            <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row w-full bg-gradient-to-t from-black text-gray-200 group-hover:flex group-hover:justify-between'>
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
                                <div className="flex flex-col self-end place-items-end space-y-1.5">
                                    <GoInfo onClick={() => navigate(`/artworks/${artwork._id}`)} className='w-6 h-6 cursor-pointer text-gray-200' />
                                </div>
                            </div>
                        </div>
                    ))}
                </Masonry>
            </div>
            default: break;
        }
    }

    return (
        <div className=' bg-gray-200 dark:bg-darkBg'>
            {console.log("profile_data", profile_data)}
            <div className="relative block h-96">
                <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{
                    backgroundImage: `url('https://cdna.artstation.com/p/assets/images/images/049/944/404/large/gabriel-gomez-fghghfghfghfghfghfghfg.jpg?1653675686')`
                }}>
                    <span id="blackOverlay" className="w-full h-full absolute opacity-25 bg-black"></span>
                </div>
            </div>
            <div className="relative pt-20 pb-6">
                <div className="mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-neutral-100 dark:bg-neutral-800 w-full shadow-xl rounded-lg -mt-64">
                        <div className="px-6 pb-6">
                            <div className="flex flex-wrap justify-center mb-7">
                                <div className="w-full sm:w-4/12 px-4">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 justify-center sm:pt-4 pt-16">
                                        <div className="shrink mr-4 p-3 min-w-fit text-center justify-items-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-800 dark:text-gray-300">{profile_data.followers_count}</span><span className="text-sm font-semibold text-blueGray-500">Following</span>
                                        </div>
                                        <div className="mr-4 p-3 min-w-fit text-center justify-items-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-800 dark:text-gray-300">{profile_data.followers_count}</span><span className="text-sm font-semibold text-blueGray-500">Followers</span>
                                        </div>
                                        <div className="mr-4 p-3 min-w-fit text-center justify-items-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-800 dark:text-gray-300">{profile_data.artworks_count}</span><span className="text-sm font-semibold text-blueGray-500">Explore Uploads</span>
                                        </div>
                                        <div className="mr-4 p-3 min-w-fit text-center justify-items-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-800 dark:text-gray-300">{profile_data.comment_count}</span><span className="text-sm font-semibold text-blueGray-500">Comments</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full sm:w-3/12 px-4 flex justify-center">
                                    <div className="relative h-fit align-middle -m-[27rem] -ml-[27.5rem] sm:-m-32 sm:-ml-28 max-w-[15rem]">
                                        {profile_data.avatar.icon.length > 0 && <img loading='lazy' src={api_fetchUserImages(profile_data.avatar.icon)} />}
                                    </div>
                                </div>
                                <div className="w-full sm:w-4/12 px-4 lg:text-right lg:self-center">
                                    <div className="flex flex-col text-center pt-4 space-y-1.5">
                                        <h3 className="text-4xl font-semibold text-blueGray-800 dark:text-gray-300">
                                            {profile_data.name}
                                        </h3>
                                        <span className="text-md text-blueGray-500 font-bold">
                                            #{profile_data.username}
                                        </span>
                                        {profile_data.bio && <p className="text-blueGray-600 text-blueGray-700 dark:text-gray-400 font-bold italic">
                                            {'“' + profile_data.bio + '”'}
                                        </p>}
                                        {common.user.id === profile_data.id ?
                                            <div>
                                                <button onClick={() => navigate('/settings/account')} className="flex items-center space-x-2 bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                                                    <FaUserEdit />
                                                    <span>Manage user profile</span>
                                                </button>
                                            </div>
                                            :
                                            <div className="px-3 sm:mt-0">
                                                <button onClick={() => onFollowClick()} className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                                                    Follow
                                                </button>
                                                <button onClick={() => onMessageClick()} className="bg-teal-500 active:bg-teal-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                                                    Message
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='flex space-x-3 py-3 items-center justify-start xs:flex-wrap xs:justify-center'>
                                <div onClick={() => setActiveView('portfolio')} className={`text-lg font-semibold ${activeView === 'portfolio' ? 'text-indigo-600 dark:text-indigo-600' : 'text-gray-700 dark:text-gray-400'}  cursor-pointer`}>Portfolio</div>
                                <span className='text-gray-700 dark:text-gray-400'>&#9679;</span>
                                <div onClick={() => setActiveView('about')} className={`text-lg font-semibold ${activeView === 'about' ? 'text-indigo-600 dark:text-indigo-600' : 'text-gray-700 dark:text-gray-400'}  cursor-pointer`}>About</div>
                                <span className='text-gray-700 dark:text-gray-400'>&#9679;</span>
                                <div onClick={() => setActiveView('liked')} className={`text-lg font-semibold ${activeView === 'liked' ? 'text-indigo-600 dark:text-indigo-600' : 'text-gray-700 dark:text-gray-400'}  cursor-pointer`}>Liked</div>
                                <span className='text-gray-700 dark:text-gray-400'>&#9679;</span>
                                {common.user.id === profile_data.id && <div onClick={() => setActiveView('bookmarks')} className={`text-lg font-semibold ${activeView === 'bookmarks' ? 'text-indigo-600 dark:text-indigo-600' : 'text-gray-700 dark:text-gray-400'}  cursor-pointer`}>Bookmarks</div>}
                            </div>
                            {profile_data && renderView()}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Profile