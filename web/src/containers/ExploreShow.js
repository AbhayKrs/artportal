import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { a_fetchExploreItem, a_fetchExploreList, a_handleDislikeExplore, a_handleLikeExplore, a_handleDeleteComment, a_handleEditComment, a_handleDislikeComment, a_handleLikeComment, a_bookmarkExploreItem, a_handleAddComment } from '../store/actions/explore.actions';
import { r_setLoader, r_setSnackMessage, r_headerDialogOpen } from '../store/reducers/common.reducers';
import { a_refreshUserDetails } from '../store/actions/common.actions';
import { api_fetchUserImages, api_fetchArtworkImages } from '../utils/api_routes';

import { AwardModal, ShareModal } from '../components/Modal';

import { IoEye, IoHeart, IoSend, IoShareSocialSharp, IoChatbox } from 'react-icons/io5';
import { AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from 'react-icons/ai';
import { MdEdit, MdEditOff, MdBookmarkAdd, MdBookmarkAdded } from 'react-icons/md';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CommentList from '../components/CommentList';

const ExploreShow = (props) => {
    const dispatch = useDispatch();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.common.user);
    const explore = useSelector(state => state.explore);
    const artwork = useSelector(state => state.explore.artwork);

    const [prev, setPrev] = useState('');
    const [next, setNext] = useState('');
    const [comment, setComment] = useState('');
    const [shareOpen, setShareOpen] = useState(false);
    const [awardOpen, setAwardOpen] = useState(false);

    const { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(r_setLoader(true));
        dispatch(a_fetchExploreList());
        dispatch(a_fetchExploreItem(id));
    }, [id]);

    useEffect(() => {
        const len = explore.artworks.length;
        explore.artworks.forEach((item, index) => {
            if (item._id === artwork._id) {
                if (index > 0) {
                    setPrev(explore.artworks[index - 1]._id)
                } else {
                    setPrev('');
                }
                if (index < len - 1) {
                    setNext(explore.artworks[index + 1]._id)
                } else {
                    setNext('')
                }
            }
        })
    }, [artwork._id]);

    const submitComment = async (event) => {
        event.preventDefault();
        dispatch(a_handleAddComment({ isParent: true, userID: user.id, artworkID: id, parentID: null, commentText: comment }));
        setTimeout(() => dispatch(a_fetchExploreItem(id)), 2000)
        setComment('');
    }

    const handleToggleLike = async (status) => {
        if (!status) {
            dispatch(a_handleDislikeExplore({ artworkID: id, userID: user.id }));
        } else {
            dispatch(a_handleLikeExplore({ artworkID: id, userID: user.id }));
        }
        setTimeout(() => {
            dispatch(a_fetchExploreItem(id));
        }, 2000);
    }

    const a_handleAwardExplore = async (award) => {
        dispatch(a_handleAwardExplore({ exploreID: id, userID: user.id, award }));
        setTimeout(() => {
            dispatch(a_refreshUserDetails(user.id));
            dispatch(a_fetchExploreItem(id));
        }, 2000);
    }

    const slider = document.querySelector('#award');
    let mouseDown = false;
    let startX, scrollLeft;

    if (slider) {
        let startDragging = function (e) {
            mouseDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };
        let stopDragging = function (event) {
            mouseDown = false;
        };

        slider.addEventListener('mousemove', (e) => {
            e.preventDefault();
            if (!mouseDown) { return; }
            const x = e.pageX - slider.offsetLeft;
            const scroll = x - startX;
            slider.scrollLeft = scrollLeft - scroll;
        });

        slider.addEventListener('mousedown', startDragging, false);
        slider.addEventListener('mouseup', stopDragging, false);
        slider.addEventListener('mouseleave', stopDragging, false);
    }

    const handleInvalidUser = () => {
        const msgData = {
            open: true,
            message: 'User not logged in. Please Sign In/Sign Up to perform the action.',
            type: 'warning'
        }
        dispatch(r_setSnackMessage(msgData));
    }

    const bookmarkIt = () => {
        dispatch(a_bookmarkExploreItem({ userID: user.id, artworkID: artwork._id })).then(() => {
            const msgData = {
                open: true,
                message: 'Added to Bookmarks!',
                type: 'success'
            }
            dispatch(r_setSnackMessage(msgData));
            setTimeout(() => {
                dispatch(a_refreshUserDetails(user.id));
                dispatch(a_fetchExploreItem(id));
            }, 2000)
        }).catch(err => {
            const msgData = {
                open: true,
                message: 'Add to Bookmark failed!',
                type: 'warning'
            }
            dispatch(r_setSnackMessage(msgData));
        })
    }

    const handlePrev = () => {
        navigate(`/explore/${prev}`);
        dispatch(a_fetchExploreItem(prev));
    }

    const handleNext = () => {
        navigate(`/explore/${next}`);
        dispatch(a_fetchExploreItem(next));
    }

    return (
        <div className='md:relative flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-darkBg'>
            <div className='relative md:fixed md:left-4 flex flex-col h-fit md:w-[23%] mx-4 md:mx-0 order-2 md:order-1 rounded-md bg-neutral-50 dark:bg-neutral-800 py-3' style={{ maxHeight: "calc(100vh - 7.25rem)" }}>
                <div className='flex flex-col space-y-2 py-2 px-4'>
                    <div className='flex flex-col gap-1 w-full wrap-any'>
                        <h1 className='text-2xl tex-gray-900 dark:text-gray-200 font-bold'>{artwork.title}</h1>
                        <p className='text-lg tex-gray-800 dark:text-gray-300'>{artwork.description}</p>
                    </div>
                    <div className='flex flex-row items-center w-full p-2 bg-neutral-200 dark:bg-neutral-900 rounded-xl space-x-2'>
                        <div className="font-medium text-xs font-medium text-gray-600 dark:text-gray-300">Categories</div>
                        <div className='flex flex-row space-x-1.5'>
                            {artwork.categories.map((item, index) => (
                                <div key={index} className="flex w-fit justify-center items-center font-medium py-1.5 px-2 bg-teal-500 dark:bg-teal-600 rounded-full text-gray-600 dark:text-gray-300 shadow">
                                    <div className="text-xs font-medium leading-none">{item}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-wrap'>
                        {artwork.tags.map((item, index) => (
                            <div key={index} className="flex w-fit justify-center items-center font-medium p-1 rounded-full text-neutral-600 dark:text-gray-300">
                                <div className="text-xs font-medium leading-none">{item.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2 text-right justify-end text-neutral-900 dark:text-gray-400'>
                            <div onClick={() => navigate(`/users/${artwork.artist.id}`)} className="flex flex-row gap-1 items-center cursor-pointer">
                                <div className="w-6 h-6 overflow-hidden">
                                    {artwork.artist.avatar.icon.length > 0 && <img loading='lazy' src={api_fetchUserImages(artwork.artist.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />}
                                </div>
                                <p className="font-semibold text-base text-neutral-800 dark:text-gray-300">
                                    {artwork.artist.username}
                                </p>
                                <svg className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                </svg>
                            </div>
                            <p className=' whitespace-nowrap text-sm'>{moment(artwork.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            {/* {artwork.artist.id === common.user.id ?
                                    <div onClick={() => navigate(`/explore/${artwork._id}/edit`)} className='rounded-lg bg-indigo-600 p-2 cursor-pointer ml-2'>
                                        <MdEdit className="text-gray-200 h-6 w-6" />
                                    </div>
                                    : <div className="relative float-left flex">
                                        <img
                                            loading='lazy'
                                            src={AwardIcon}
                                            className='h-12 w-12 cursor-pointer'
                                            onClick={() => {
                                                common.isAuthenticated ?
                                                    setAwardOpen(true)
                                                    :
                                                    handleInvalidUser()
                                            }}
                                        />
                                        <ImPlus className="absolute bottom-0 right-0 text-[#D1853A] h-4 w-4" />
                                    </div>} */}
                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-row space-x-4 items-center'>
                                    <div className='flex flex-row items-center gap-0.5'>
                                        <IoEye className='h-6 w-6 text-neutral-600 dark:text-neutral-500' />
                                        <p className='font-semibold text-neutral-600 dark:text-neutral-500 text-base'>{new Intl.NumberFormat().format(artwork.views.length)}</p>
                                    </div>
                                    <div className='flex flex-row items-center gap-0.5'>
                                        {artwork.likes.filter(item => item === user.id).length > 0 ?
                                            <button disabled>
                                                <AiFillLike className='w-6 h-6 text-neutral-700 dark:text-gray-200' />
                                            </button>
                                            :
                                            <button
                                                onClick={() => {
                                                    common.isAuthenticated ?
                                                        handleToggleLike(true)
                                                        :
                                                        handleInvalidUser()
                                                }}
                                            >
                                                <AiOutlineLike className='w-6 h-6 text-neutral-600 dark:text-neutral-500' />
                                            </button>
                                        }
                                        <p className="font-bold text-neutral-600 dark:text-gray-400 text-base">
                                            {artwork.likes.length}
                                        </p>
                                    </div>
                                    <div className='flex flex-row items-center gap-0.5'>
                                        {artwork.dislikes.filter(item => item === user.id).length > 0 ?
                                            <button disabled>
                                                <AiFillDislike className='w-6 h-6 text-neutral-700 dark:text-gray-200' />
                                            </button>
                                            :
                                            <button
                                                onClick={() => {
                                                    common.isAuthenticated ?
                                                        handleToggleLike(false)
                                                        :
                                                        handleInvalidUser()
                                                }}
                                            >
                                                <AiOutlineDislike className='w-6 h-6 text-neutral-600 dark:text-neutral-500' />
                                            </button>
                                        }
                                        <p className="font-bold text-neutral-600 dark:text-gray-400 text-base">
                                            {artwork.dislikes.length}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex flex-row gap-3 items-center'>
                                    <IoShareSocialSharp onClick={() => setShareOpen(true)} className='h-6 w-6 cursor-pointer text-neutral-700 dark:text-gray-200' />
                                    {user && user.bookmarks && !!user.bookmarks.find(item => item._id === artwork._id) ?
                                        <MdBookmarkAdded className='h-6 w-6 text-neutral-700 dark:text-gray-200' />
                                        :
                                        <MdBookmarkAdd
                                            className='h-6 w-6 cursor-pointer text-neutral-700 dark:text-gray-200'
                                            onClick={() => {
                                                common.isAuthenticated ?
                                                    bookmarkIt()
                                                    :
                                                    handleInvalidUser()
                                            }}
                                        />
                                    }
                                </div>
                            </div>
                            <div className='flex flex-row gap-3 rounded'>
                                {prev.length > 0 ? <div onClick={handlePrev} className='cursor-pointer flex justify-end py-0.5 space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-600'>
                                    <FaChevronLeft className='h-6 w-6' />
                                </div> : ''}
                                {next.length > 0 ? <div onClick={handleNext} className='cursor-pointer flex justify-end py-0.5 space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-600'>
                                    <FaChevronRight className='h-6 w-6' />
                                </div> : ''}
                            </div>
                        </div>
                    </div>
                </div>
                {/* {artwork.awards.length > 0 ?
                        <div id='award' className='flex overflow-x-hidden bg-slate-200 dark:bg-neutral-700 mx-2 p-2 rounded-lg space-x-2'>
                            {artwork.awards.map((award, index) => (
                                <div key={index} className="relative float-left mr-2 flex">
                                    <img loading='lazy' draggable="false" className='max-w-fit h-12 w-12' src={api_fetchUserImages(award.icon)} />
                                    <span className="absolute font-bold top-0 right-0 inline-block rounded-full bg-indigo-800 shadow-lg shadow-neutral-800 text-gray-300 px-1.5 py-0.5 text-xs">{award.count}</span>
                                </div>
                            ))}
                        </div>
                        : ''} */}
                {awardOpen &&
                    <AwardModal
                        open={awardOpen}
                        title='Awards'
                        awardList={common.awardList}
                        user={user}
                        exploreID={id}
                        onClose={() => setAwardOpen(false)}
                        onClick={() => setAwardOpen(false)}
                        a_handleAwardExplore={a_handleAwardExplore}
                    />
                }
                {shareOpen &&
                    <ShareModal
                        open={shareOpen}
                        title='Share'
                        onClose={() => setShareOpen(false)}
                        onClick={() => setShareOpen(false)}
                    />
                }
            </div>
            <div className="flex mx-auto md:w-6/12 order-1 md:order-2 justify-center">
                {artwork.categories.includes("mature_art") ?
                    <div className="flex flex-col mx-4 md:mx-0 space-y-3 w-full">
                        <div className='flex flex-col items-center text-center'>
                            <h1 className='text-xl lg:text-2xl  font-semibold leading-5 lg:leading-6 text-neutral-800 dark:text-neutral-200'>18+ Content</h1>
                            <h2 className='text-base lg:text-lg  font-semibold leading-5 lg:leading-6 text-neutral-700 dark:text-neutral-200'>The following artwork contains mature content.<br /> Please validate yourself by via login to view the artwork.</h2>
                            <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className='whitespace-nowrap self-center bg-neutral-800 dark:bg-gray-300 text-gray-200 dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-gray-200 py-1 px-3 rounded-md text-base  font-medium tracking-wide'>Sign In</button>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col mx-4 md:mx-0 space-y-3 w-full">
                        <div className='flex w-fit self-center items-center place-content-center'>
                            {artwork.files[0]?.length > 0 && <img loading='lazy' src={`${api_fetchArtworkImages(artwork.files[0])}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />}
                        </div>
                        {artwork.files.filter((image, index) => index !== 0).length > 0 &&
                            <div className='flex w-fit flex-col self-center items-center space-y-3 place-content-center'>
                                {artwork.files.filter((image, index) => index !== 0).map((image, index) => (
                                    <img loading='lazy' key={index} src={`${api_fetchArtworkImages(image)}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />
                                ))}
                            </div>
                        }
                    </div>
                }
            </div>
            <div className='relative md:fixed md:right-4 flex flex-col gap-2 order-3 md:w-[23%] mx-4 md:mx-0' style={{ maxHeight: "calc(100vh - 7.25rem)" }}>
                <div className='flex flex-col gap-1 rounded'>
                    <div className='flex items-center justify-between py-0.5 text-neutral-800 dark:text-gray-300'>
                        <div className='flex flex-row gap-1 items-center'>
                            {/* <IoChatbox className='h-5 w-5' /> */}
                            <h2 className='text-lg self-center'>{new Intl.NumberFormat().format(artwork.comments_count)} Comments</h2>
                        </div>
                    </div>
                    {common.isAuthenticated ? <div className='flex flex-row gap-2 items-center'>
                        {user.avatar.icon.length > 0 && <div className="w-7 h-7 overflow-hidden">
                            <img loading='lazy' src={api_fetchUserImages(user.avatar.icon)} alt="user_avatar" className="object-contain w-full h-full" />
                        </div>}
                        <input
                            type="text"
                            name="comment"
                            value={comment}
                            onChange={(ev) => setComment(ev.target.value)}
                            onKeyDown={(ev) => { if (ev.code === 'Enter') { submitComment(ev) } }}
                            placeholder="Add a comment..."
                            className="w-full p-1 rounded text-md placeholder:font-semibold placeholder:text-neutral-700 dark:placeholder:text-neutral-500 text-gray-600 dark:text-neutral-300 outline-none border-2 border-gray-700 dark:border-neutral-600"
                        />
                    </div> : null}
                </div>
                <CommentList comments={artwork.comments} handleInvalidUser={handleInvalidUser} />
            </div>
        </div >
    )
}

export default ExploreShow;
