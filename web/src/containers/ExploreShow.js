import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { a_fetchExploreItem, a_fetchExploreList, a_handleDislikeExplore, a_handleLikeExplore, a_handleDeleteComment, a_handleEditComment, a_handleDislikeComment, a_handleLikeComment, a_bookmarkExploreItem, a_handleAddComment } from '../store/actions/explore.actions';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducers';
import { a_refreshUserDetails } from '../store/actions/common.actions';
import { api_fetchUserImages } from '../utils/api';

import { ExploreShowCarousel } from '../components/Carousel';
import { AwardModal, ShareModal } from '../components/Modal';

import { IoEye, IoHeart, IoSend, IoShareSocialSharp, IoChatbox } from 'react-icons/io5';
import { BsTrash, BsHeartFill } from 'react-icons/bs';
import { IoIosSend } from "react-icons/io";
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { MdEdit, MdEditOff, MdBookmarkAdd, MdBookmarkAdded } from 'react-icons/md';
import { ImPlus } from 'react-icons/im';
import AwardIcon from '../assets/images/gift.png';

const ExploreShow = (props) => {
    const dispatch = useDispatch();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.common.user);
    const explore = useSelector(state => state.explore);
    const artwork = useSelector(state => state.explore.artwork);

    const [prev, setPrev] = useState('');
    const [next, setNext] = useState('');
    const [like, setLike] = useState(false);
    const [comment, setComment] = useState('');
    const [editForm, setEditForm] = useState(false);
    const [editIndex, setEditIndex] = useState('');
    const [editComment, setEditComment] = useState('');
    const [shareOpen, setShareOpen] = useState(false);
    const [awardOpen, setAwardOpen] = useState(false);

    const { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(r_setLoader(true));
        dispatch(a_fetchExploreList());
        dispatch(a_fetchExploreItem(id));
    }, [id])

    useEffect(() => {
        const len = explore.artworks.length;
        if (artwork.likes.filter(item => item === user.id).length > 0) {
            setLike(true);
        } else {
            setLike(false);
        }
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
        dispatch(a_handleAddComment({ exploreID: id, commentText: comment }));
        setTimeout(() => dispatch(a_fetchExploreItem(id)), 2000)
        setComment('');
    }

    const handleToggleLike = async (likes) => {
        if (likes.includes(user.id)) {
            await dispatch(a_handleDislikeExplore(id));
        } else {
            await dispatch(a_handleLikeExplore(id));
        }
        dispatch(a_fetchExploreItem(id));
    }

    const a_handleAwardExplore = async (award) => {
        await dispatch(a_handleAwardExplore({ exploreID: id, userID: user.id, award }));
        setTimeout(() => {
            dispatch(a_refreshUserDetails(user.id));
            dispatch(a_fetchExploreItem(id));
        }, 2000);
    }

    const onDeleteComment = async (comment) => {
        await dispatch(a_handleDeleteComment({ exploreID: id, commentID: comment._id }));
        dispatch(a_fetchExploreItem(id));
    }

    const onEditComment = async (comment) => {
        await dispatch(a_handleEditComment({ exploreID: id, newComment: editComment, commentID: comment._id }));
        setEditForm(false);
        setTimeout(() => {
            dispatch(a_fetchExploreItem(id));
        }, 2000);
        return false;
    }

    const handleToggleCommentLike = async (status, comment) => {
        if (!status) {
            await dispatch(a_handleDislikeComment({ exploreID: id, commentID: comment._id }));
        } else {
            await dispatch(a_handleLikeComment({ exploreID: id, commentID: comment._id }));
        }
        setTimeout(() => {
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
        const bookmarkData = {
            id: artwork._id,
            files: artwork.files,
            title: artwork.title,
            author: artwork.artist,
            description: artwork.description
        }
        dispatch(a_bookmarkExploreItem({ userID: user.id, bookmarkData })).then(() => {
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

    return (
        <div className='sm:grid gap-2 bg-gray-200 dark:bg-darkBg sm:grid-cols-1 lg:grid-cols-12 xs:flex xs:flex-col'>
            <ExploreShowCarousel
                isMatureContent={artwork.categories.includes("mature_art")}
                prevTrue={prev.length > 0}
                nextTrue={next.length > 0}
                data={explore.artworks}
                currentImage={artwork.files[0]}
                secondaryImages={artwork.files.filter((image, index) => index !== 0)}
                prev={() => { navigate(`/explore/${prev}`); dispatch(a_fetchExploreItem(prev)); }}
                next={() => { navigate(`/explore/${next}`); dispatch(a_fetchExploreItem(next)); }}
            />
            <div className='fixed right-0 lg:w-4/12 md:mt-3 sm:mt-0'>
                <div className='flex flex-col break-anywhere rounded-md bg-neutral-50 dark:bg-neutral-800 mr-2 ml-2 lg:ml-1 py-3'>
                    <div className='flex flex-col space-y-1 p-2'>
                        <div className='flex flex-row space-x-2'>
                            <div className='flex px-2 flex-col w-full space-y-1'>
                                <h1 className='font-montserrat text-2xl tex-gray-900 dark:text-gray-200 font-bold'>{artwork.title}</h1>
                                <p className='font-montserrat text-lg tex-gray-800 dark:text-gray-300'>{artwork.description}</p>
                            </div>
                        </div>
                        <div className='flex space-x-3 py-1 px-2 bg-neutral-100 dark:bg-neutral-800 rounded'>
                            <div className='flex items-center justify-end py-0.5 space-x-1 text-teal-500'>
                                <IoEye className='h-6 w-6' />
                                <h3 className='font-montserrat text-lg self-center'>{new Intl.NumberFormat().format(artwork.views.length)}</h3>

                            </div>
                            <div className='flex items-center justify-end py-0.5 space-x-1 text-indigo-600 dark:text-indigo-600'>
                                <IoHeart className='h-6 w-6' />
                                <h3 className='font-montserrat text-lg self-center'>{new Intl.NumberFormat().format(artwork.likes.length)}</h3>

                            </div>
                            <div className='flex items-center justify-end py-0.5 space-x-1 text-indigo-600 dark:text-indigo-600'>
                                <IoChatbox className='h-6 w-6' />
                                <h3 className='font-montserrat text-lg self-center'>{new Intl.NumberFormat().format(artwork.comments.length)}</h3>

                            </div>
                        </div>
                        <div className='flex flex-col w-full p-2 bg-neutral-200 dark:bg-neutral-900 rounded-xl space-y-2'>
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
                            {console.log("artwork", artwork)}
                            {artwork.tags.map((item, index) => (
                                <div key={index} className="flex w-fit justify-center items-center m-0.5 font-medium py-1.5 px-2 rounded-full text-indigo-600 dark:text-indigo-600">
                                    <div className="text-xs font-medium leading-none">#{item}</div>
                                </div>
                            ))}
                        </div>
                        <div className='flex pl-1 justify-between'>
                            <div className='flex w-fit items-center space-x-3'>
                                {artwork.artist.id === common.user.id ?
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
                                    </div>}
                                <BsHeartFill
                                    style={like ? { color: '#FF3980' } : { color: '#F190B3' }}
                                    className='h-7 w-7 cursor-pointer'
                                    onClick={() => {
                                        common.isAuthenticated ?
                                            // setLike(!like);
                                            handleToggleLike(artwork.likes)
                                            :
                                            handleInvalidUser()
                                    }}
                                />
                                <IoShareSocialSharp onClick={() => setShareOpen(true)} className='h-7 w-7 cursor-pointer text-indigo-600 dark:text-indigo-600' />
                                {user && user.bookmarked && !!user.bookmarked.find(item => item._id === artwork._id) ?
                                    <MdBookmarkAdded className='h-7 w-7 text-indigo-600 dark:text-indigo-600' />
                                    :
                                    <MdBookmarkAdd
                                        className='h-7 w-7 cursor-pointer text-indigo-600 dark:text-indigo-600'
                                        onClick={() => {
                                            common.isAuthenticated ?
                                                bookmarkIt()
                                                :
                                                handleInvalidUser()
                                        }}
                                    />
                                }
                            </div>
                            <div className='mr-3'>
                                <div className='flex flex-col text-right justify-end py-1 text-neutral-900 dark:text-gray-400'>
                                    <p className='font-montserrat text-xl'>Posted By</p>
                                    <div onClick={() => navigate(`/users/${artwork.artist.id}`)} className="flex cursor-pointer justify-end">
                                        <div className="w-6 h-6 overflow-hidden">
                                            {artwork.artist ? <img loading='lazy' src={api_fetchUserImages(artwork.artist.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" /> : null}
                                        </div>
                                        <p className="font-montserrat pt-0.5 font-medium text-lg mx-0.5">
                                            {artwork.artist.username}
                                        </p>
                                        <svg className="stroke-current stroke-1 text-blue-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                    </div>
                                    <p className='font-montserrat whitespace-nowrap text-sm'>{moment(artwork.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* {artwork.awards.length > 0 ?
                        <div id='award' className='flex overflow-x-hidden bg-slate-200 dark:bg-neutral-700 mx-2 p-2 rounded-lg space-x-2'>
                            {artwork.awards.map((award, index) => (
                                <div key={index} className="relative float-left mr-2 flex">
                                    <img loading='lazy' draggable="false" className='max-w-fit h-12 w-12' src={api_fetchUserImages(award.icon)} />
                                    <span className="absolute font-bold top-0 right-0 inline-block rounded-full bg-violet-800 shadow-lg shadow-neutral-800 text-gray-300 px-1.5 py-0.5 text-xs">{award.count}</span>
                                </div>
                            ))}
                        </div>
                        : ''} */}
                </div>
                {common.isAuthenticated ?
                    <div className='m-2 rounded flex bg-gray-300 dark:bg-neutral-700'>
                        {artwork.comments.length > 0 ?
                            <IoIosSend onClick={(ev) => submitComment(ev)} className='h-7 w-7 text-gray-600 dark:text-gray-300 cursor-pointer self-center ml-2' />
                            :
                            <IoIosSend className='h-7 w-7 text-neutral-700 dark:text-gray-300 self-center ml-2' />
                        }
                        <input type="text" name="comment" value={artwork.comments} onChange={(ev) => setComment(ev.target.value)} onKeyPress={(ev) => { if (ev.key === 'Enter') { submitComment(ev) } }} placeholder={`Hey ${user.username}, Let the artist know your thoughts...`} className="font-montserrat w-full mx-2 my-3 font-bold text-md placeholder:text-neutral-700 dark:placeholder:text-gray-300 text-gray-600 dark:text-gray-300 outline-none bg-gray-300 dark:bg-neutral-700 border-b-2 border-b-gray-700 dark:border-b-gray-300" />
                    </div>
                    :
                    ''}
                <div className='m-2 ml-6'>
                    {artwork.comments.map((comment, index) => (
                        <div key={index} className='flex rounded-lg items-center bg-gray-300 dark:bg-neutral-700 text-neutral-700 dark:text-gray-300 py-2 px-4 mb-2 space-x-2'>
                            <div className='flex flex-col basis-10/12'>
                                {editForm && index === editIndex ?
                                    <div className='rounded flex bg-gray-300 dark:bg-neutral-700'>
                                        <input type="text" name="comment" value={editComment} onChange={(ev) => setEditComment(ev.target.value)} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); onEditComment(comment) } }} className="font-montserrat w-fit mb-2 font-bold text-md placeholder:text-neutral-700 dark:placeholder:text-gray-300 text-gray-600 dark:text-gray-300 outline-none bg-gray-300 dark:bg-neutral-700 border-b-2 border-b-gray-700 dark:border-b-gray-300" />
                                        <IoSend onClick={(ev) => onEditComment(comment)} className='h-5 w-5 ml-2 text-gray-600 dark:text-gray-300 cursor-pointer self-center' />
                                    </div>
                                    :
                                    <p className='font-montserrat text-lg font-bold'>{comment.content}</p>
                                }
                                <div className='flex'>
                                    <div onClick={() => navigate(`/users/${comment.author.id}`)} className='flex cursor-pointer'>
                                        <div className="w-5 h-5 overflow-hidden">
                                            <img loading='lazy' src={api_fetchUserImages(comment.author.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />
                                        </div>
                                        <p className="font-montserrat text-sm mx-0.5">
                                            {comment.author.username}
                                        </p>
                                    </div>
                                    <p className='font-montserrat text-sm'>{'- ' + moment(comment.createdAt).fromNow()}</p>
                                </div>
                            </div>
                            <div className="flex basis-2/12 items-center justify-end relative">
                                <div className='flex space-x-1'>
                                    {comment.likes.filter(item => item === user.id).length > 0 ?
                                        <button disabled>
                                            <AiFillLike className='w-5 h-5 text-indigo-600' />
                                        </button>
                                        :
                                        <button
                                            onClick={() => {
                                                common.isAuthenticated ?
                                                    handleToggleCommentLike(true, comment)
                                                    :
                                                    handleInvalidUser()
                                            }}
                                        >
                                            <AiFillLike className='w-5 h-5 text-neutral-500' />
                                        </button>
                                    }
                                    <div className="text-sm">
                                        {comment.likes.length}
                                    </div>
                                    <button
                                        onClick={() => {
                                            common.isAuthenticated ?
                                                handleToggleCommentLike(false, comment)
                                                :
                                                handleInvalidUser()
                                        }}
                                    >
                                        <AiFillDislike className='w-5 h-5' />
                                    </button>
                                </div>
                                {common.isAuthenticated && user.id === comment.author.id ?
                                    <div className='flex flex-col ml-2 border-l-2 border-gray-600 pl-3 space-y-2'>
                                        {editForm && index === editIndex ?
                                            <MdEditOff onClick={() => { setEditForm(false) }} className='w-5 h-5' />
                                            :
                                            <MdEdit onClick={() => { setEditComment(comment.content); setEditForm(true); setEditIndex(index) }} className='w-5 h-5' />
                                        }
                                        <BsTrash onClick={() => onDeleteComment(comment)} className='w-5 h-5 cursor-pointer' />
                                    </div>
                                    :
                                    ''}
                            </div>
                        </div>
                    ))}
                </div>
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
        </div >
    )
}

export default ExploreShow;
