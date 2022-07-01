import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Masonry from '../components/Masonry';

import { fetchExploreImages, fetchUserImages } from '../api';
import { setLoader, fetchAvatars, loadProfileDetails, clearUserProfile, deleteBookmark, handleEditUserAvatar } from '../store/actions/common.actions';
import { fetchExploreList, deleteExploreItem } from '../store/actions/explore.actions';

import { MdAddAPhoto, MdClose } from 'react-icons/md';
import { BsHeart, BsChat, BsTrash } from 'react-icons/bs';
import { BiTimeFive } from 'react-icons/bi';
import { GoInfo } from 'react-icons/go';
import { AvatarModal } from '../components/Modal';

const Profile = (props) => {
    const { id } = useParams();
    let navigate = useNavigate();
    const [avatarModal, setAvatarModal] = useState(false);

    useEffect(() => {
        props.setLoader(true);
        window.scrollTo(0, 0);
        props.loadProfileDetails(id);
        props.fetchExploreList();
        props.fetchAvatars();
        return () => props.clearUserProfile();
    }, [])

    const [activeView, setActiveView] = useState('portfolio');

    const deleteBookmark = (bookmarkID, userID) => {
        props.deleteBookmark(bookmarkID, userID);
    }

    return (
        <div className='main-container bg-gray-200 dark:bg-darkNavBg'>
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
                        <div className="px-6">
                            <div className="flex flex-wrap justify-center mb-7">
                                <div className="w-full sm:w-4/12 px-4">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 justify-center sm:pt-4 pt-16">
                                        <div className="shrink mr-4 p-3 min-w-fit text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-800 dark:text-gray-300">{props.viewed_user.followers_count}</span><span className="text-sm font-semibold text-blueGray-500">Following</span>
                                        </div>
                                        <div className="mr-4 p-3 min-w-fit text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-800 dark:text-gray-300">{props.viewed_user.followers_count}</span><span className="text-sm font-semibold text-blueGray-500">Followers</span>
                                        </div>
                                        <div className="mr-4 p-3 min-w-fit text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-800 dark:text-gray-300">{props.viewed_user.explore_count}</span><span className="text-sm font-semibold text-blueGray-500">Explore Uploads</span>
                                        </div>
                                        <div className="mr-4 p-3 min-w-fit text-center">
                                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-800 dark:text-gray-300">{props.viewed_user.comment_count}</span><span className="text-sm font-semibold text-blueGray-500">Comments</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full sm:w-3/12 px-4 flex justify-center">
                                    <div className="relative h-fit align-middle sm:-m-32 -m-[27rem] sm:-ml-28 -ml-[7.5rem]  max-w-[15rem]">
                                        <img src={fetchUserImages(props.viewed_user.avatar.icon)} />
                                        <MdAddAPhoto onClick={() => setAvatarModal(true)} className='h-10 w-10 cursor-pointer text-gray-200 absolute bottom-2 right-2 z-30' />
                                    </div>
                                </div>
                                <div className="w-full sm:w-4/12 px-4 lg:text-right lg:self-center">
                                    <div className="text-center pt-4 space-y-1">
                                        <h3 className="text-4xl font-josefinregular font-semibold text-blueGray-800 dark:text-gray-300">
                                            {props.viewed_user.name}
                                        </h3>
                                        <div className="text-sm font-josefinregular text-blueGray-500 font-bold">
                                            #{props.viewed_user.username}
                                        </div>
                                        <div className="text-blueGray-600 font-josefinregular text-blueGray-700 dark:text-gray-400 font-bold">
                                            {props.viewed_user.email}
                                        </div>
                                        <div className="px-3 sm:mt-0">
                                            <button className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                                                Follow
                                            </button>
                                            <button className="bg-teal-500 active:bg-teal-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                                                Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex space-x-3 py-3 items-center'>
                                <div onClick={() => setActiveView('portfolio')} className={`text-lg font-semibold ${activeView === 'portfolio' ? 'text-violet-400 dark:text-violet-500' : 'text-gray-700 dark:text-gray-400'} font-caviar cursor-pointer`}>Portfolio</div>
                                <span className='text-gray-700 dark:text-gray-400'>&#9679;</span>
                                <div onClick={() => setActiveView('about')} className={`text-lg font-semibold ${activeView === 'about' ? 'text-violet-400 dark:text-violet-500' : 'text-gray-700 dark:text-gray-400'} font-caviar cursor-pointer`}>About</div>
                                <span className='text-gray-700 dark:text-gray-400'>&#9679;</span>
                                <div onClick={() => setActiveView('liked')} className={`text-lg font-semibold ${activeView === 'liked' ? 'text-violet-400 dark:text-violet-500' : 'text-gray-700 dark:text-gray-400'} font-caviar cursor-pointer`}>Liked</div>
                                <span className='text-gray-700 dark:text-gray-400'>&#9679;</span>
                                <div onClick={() => setActiveView('bookmarks')} className={`text-lg font-semibold ${activeView === 'bookmarks' ? 'text-violet-400 dark:text-violet-500' : 'text-gray-700 dark:text-gray-400'} font-caviar cursor-pointer`}>Bookmarks</div>
                            </div>
                            {activeView === 'portfolio' && props.viewed_user.explore && <div className='flex flex-row'>
                                <Masonry>
                                    {props.viewed_user.explore.map((explore, index) => (
                                        // onClick={() => navigate(`/explore/${explore._id}`)}
                                        <div key={index} className='relative group group-hover:block'>
                                            <img
                                                id={index}
                                                className='object-cover w-full h-full'
                                                src={fetchExploreImages(explore.files[0])}
                                            />
                                            <button onClick={() => props.deleteExploreItem(explore._id, props.common.user.id)} className='hidden group-hover:block bg-gray-300 absolute top-[-25px] rounded-t-lg right-0 z-50'>
                                                <MdClose className=' h-6 w-6' />
                                            </button>
                                            <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row w-full bg-gradient-to-t from-black text-gray-200 group-hover:flex group-hover:justify-between'>
                                                <div className="flex flex-col place-self-end max-w-[65%]">
                                                    <h3 className="text-md text-base font-bold leading-5 capitalize break-words">{explore.title + 'afsafokasfjhbasfbasbhfsbhf'}</h3>
                                                    <div className='flex'>
                                                        <span className="font-base text-xs my-1 mr-1">
                                                            {explore.author.username}
                                                        </span>
                                                        <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col self-end place-items-end space-y-1.5">
                                                    <div className="inline-flex items-center">
                                                        <BsHeart className='h-4 w-4' />
                                                        <span className="text-xs ml-1 antialiased">{explore.likes.length}</span>
                                                    </div>
                                                    <div className="inline-flex items-center">
                                                        <BsChat className='h-4 w-4' />
                                                        <span className="text-xs ml-1 antialiased">{explore.comment_count}</span>
                                                    </div>
                                                    <div className="inline-flex items-center">
                                                        <BiTimeFive className='h-4 w-4' />
                                                        <span className="text-xs ml-1 antialiased">{moment(explore.createdAt).fromNow()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Masonry>
                            </div>}
                            {activeView === 'about' && <div className='text-4xl text-gray-400'>HELLO</div>}
                            {activeView === 'liked' && <div className='flex flex-row'>
                                <Masonry>
                                    {props.explore.exploreList.filter(item => item.likes.indexOf(props.viewed_user.id) >= 0).map((explore, index) => (
                                        <div key={index} onClick={() => navigate(`/explore/${explore._id}`)} className='relative group group-hover:block'>
                                            <img
                                                id={index}
                                                className='object-cover w-full h-full'
                                                src={fetchExploreImages(explore.files[0])}
                                            />
                                            <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row w-full bg-gradient-to-t from-black text-gray-200 group-hover:flex group-hover:justify-between'>
                                                <div className="flex flex-col place-self-end max-w-[65%]">
                                                    <h3 className="text-md text-base font-bold leading-5 capitalize break-words">{explore.title + 'afsafokasfjhbasfbasbhfsbhf'}</h3>
                                                    <div className='flex'>
                                                        <span className="font-base text-xs my-1 mr-1">
                                                            {explore.author.username}
                                                        </span>
                                                        <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col self-end place-items-end space-y-1.5">
                                                    <div className="inline-flex items-center">
                                                        <BsHeart className='h-4 w-4' />
                                                        <span className="text-xs ml-1 antialiased">{explore.likes.length}</span>
                                                    </div>
                                                    <div className="inline-flex items-center">
                                                        <BsChat className='h-4 w-4' />
                                                        <span className="text-xs ml-1 antialiased">{explore.comment_count}</span>
                                                    </div>
                                                    <div className="inline-flex items-center">
                                                        <BiTimeFive className='h-4 w-4' />
                                                        <span className="text-xs ml-1 antialiased">{moment(explore.createdAt).fromNow()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Masonry>
                            </div>}
                            {activeView === 'bookmarks' && <div className='flex flex-row'>
                                <Masonry>
                                    {props.viewed_user.bookmarked.map((explore, index) => (
                                        <div key={index} className='relative group group-hover:block'>
                                            <img
                                                id={index}
                                                className='object-cover w-full h-full'
                                                src={fetchExploreImages(explore.files[0])}
                                            />
                                            <div className='hidden absolute max-h-full bottom-0 p-2 pt-14 group-hover:flex group-hover:flex-row w-full bg-gradient-to-t from-black text-gray-200 group-hover:flex group-hover:justify-between'>
                                                <div className="flex flex-col place-self-end max-w-[65%]">
                                                    <h3 className="text-md text-base font-bold leading-5 capitalize break-words">{explore.title + 'afsafokasfjhbasfbasbhfsbhf'}</h3>
                                                    <div className='flex'>
                                                        <span className="font-base text-xs my-1 mr-1">
                                                            {explore.author.username}
                                                        </span>
                                                        <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col self-end place-items-end space-y-1.5">
                                                    <BsTrash onClick={() => deleteBookmark(explore._id, props.common.user.id)} className='h-6 w-6 cursor-pointer text-gray-200' />
                                                    <GoInfo onClick={() => navigate(`/explore/${props.explore._id}`)} className='w-6 h-6 cursor-pointer text-gray-200' />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Masonry>
                            </div>}
                        </div>
                    </div>
                </div>
            </div >
            <AvatarModal
                open={avatarModal}
                title='Pick your Avatar'
                avatarList={props.common.avatarList}
                handleEditUserAvatar={props.handleEditUserAvatar}
                onClose={() => setAvatarModal(false)}
            />
        </div >
    )
}

const mapStateToProps = (state) => ({
    common: state.common,
    explore: state.explore,
    viewed_user: state.common.viewed_user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader,
    fetchAvatars,
    fetchExploreList,
    deleteExploreItem,
    loadProfileDetails,
    clearUserProfile,
    deleteBookmark,
    handleEditUserAvatar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profile)