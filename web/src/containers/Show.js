import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { a_fetchExploreItem, a_fetchExploreList, a_handleDislikeExplore, a_handleLikeExplore, a_handleAwardExplore, a_handleDeleteComment, a_handleEditComment, a_handleDislikeComment, a_handleLikeComment, a_bookmarkExploreItem, a_handleAddComment } from '../store/actions/explore.actions';
import { r_setLoader, r_setSnackMessage } from '../store/reducers/common.reducers';
import { a_fetchAwards, a_refreshUserDetails } from '../store/actions/common.actions';
import { a_fetchStoreItem, a_fetchStoreList } from '../store/actions/store.actions';
import { api_fetchArtworkImages, api_fetchUserImages, api_fetchStoreImages } from '../utils/api';

import { ExploreShowCarousel } from '../components/Carousel';
import { AwardModal, ShareModal } from '../components/Modal';
import Ratings from '../components/Ratings';

import { IoEye, IoHeart, IoSend, IoShareSocialSharp, IoChatbox } from 'react-icons/io5';
import { BsTrash, BsHeartFill } from 'react-icons/bs';
import { IoIosSend } from "react-icons/io";
import { AiFillLike, AiFillDislike, AiOutlineDown, AiOutlineUp, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { MdEdit, MdEditOff, MdBookmarkAdd, MdBookmarkAdded, MdOutlineAddShoppingCart } from 'react-icons/md';
import { ImPlus, ImStarFull } from 'react-icons/im';
import { TiInfoLarge } from 'react-icons/ti';
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

    useEffect(async () => {
        window.scrollTo(0, 0);
        dispatch(r_setLoader(true));
        await dispatch(a_fetchExploreList());
        await dispatch(a_fetchExploreItem(id));
        // await dispatch(a_fetchAwards());
        // await dispatch(viewExploreItem(id));
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
        await dispatch(a_handleAddComment({ exploreID: id, commentText: comment }));
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
        <div className=' min-h-screen sm:grid gap-2 bg-gray-200 dark:bg-darkBg sm:grid-cols-1 lg:grid-cols-12 xs:flex xs:flex-col'>
            <ExploreShowCarousel
                prevTrue={prev.length > 0}
                nextTrue={next.length > 0}
                data={explore.artworks}
                currentImage={artwork.files[0]}
                secondaryImages={artwork.files.filter((image, index) => index !== 0)}
                prev={() => { navigate(`/explore/${prev}`); dispatch(a_fetchExploreItem(prev)); }}
                next={() => { navigate(`/explore/${next}`); dispatch(a_fetchExploreItem(next)); }}
            />
            <div className='lg:col-span-4 md:mt-3 sm:mt-0 bg-fixed'>
                <div className='flex flex-col rounded-md bg-neutral-50 dark:bg-neutral-800 mr-2 ml-2 lg:ml-0 py-3'>
                    <div className='flex flex-col space-y-1 p-2'>
                        <div className='flex flex-row space-x-2'>
                            <div className='flex px-2 flex-col w-full space-y-1'>
                                <h1 className='font-parkinsans text-2xl tex-gray-900 dark:text-gray-200 font-bold'>{artwork.title}</h1>
                                <p className='font-josefinlight text-lg tex-gray-800 dark:text-gray-300'>{artwork.description}</p>
                            </div>
                        </div>
                        <div className='flex space-x-3 py-1 px-2 bg-neutral-100 dark:bg-neutral-800 rounded'>
                            <div className='flex items-center justify-end py-0.5 space-x-1 text-teal-500'>
                                <IoEye className='h-6 w-6' />
                                <h3 className='font-josefinregular text-lg self-center'>{new Intl.NumberFormat().format(artwork.views.length)}</h3>

                            </div>
                            <div className='flex items-center justify-end py-0.5 space-x-1 text-indigo-600 dark:text-indigo-600'>
                                <IoHeart className='h-6 w-6' />
                                <h3 className='font-josefinregular text-lg self-center'>{new Intl.NumberFormat().format(artwork.likes.length)}</h3>

                            </div>
                            <div className='flex items-center justify-end py-0.5 space-x-1 text-indigo-600 dark:text-indigo-600'>
                                <IoChatbox className='h-6 w-6' />
                                <h3 className='font-josefinregular text-lg self-center'>{new Intl.NumberFormat().format(artwork.comments.length)}</h3>

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
                                    <p className='font-josefinlight text-xl'>Posted By</p>
                                    <div onClick={() => navigate(`/users/${artwork.artist.id}`)} className="flex cursor-pointer justify-end">
                                        <div className="w-6 h-6 overflow-hidden">
                                            {artwork.artist ? <img loading='lazy' src={api_fetchUserImages(artwork.artist.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" /> : null}
                                        </div>
                                        <p className="font-josefinlight pt-0.5 font-medium text-lg mx-0.5">
                                            {artwork.artist.username}
                                        </p>
                                        <svg className="stroke-current stroke-1 text-blue-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                    </div>
                                    <p className='font-josefinlight whitespace-nowrap text-sm'>{moment(artwork.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
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
                        <input type="text" name="comment" value={artwork.comments} onChange={(ev) => setComment(ev.target.value)} onKeyPress={(ev) => { if (ev.key === 'Enter') { submitComment(ev) } }} placeholder={`Hey ${user.username}, Let the artist know your thoughts...`} className="font-josefinlight w-full mx-2 my-3 font-bold text-md placeholder:text-neutral-700 dark:placeholder:text-gray-300 text-gray-600 dark:text-gray-300 outline-none bg-gray-300 dark:bg-neutral-700 border-b-2 border-b-gray-700 dark:border-b-gray-300" />
                    </div>
                    :
                    ''}
                <div className='m-2 ml-6'>
                    {artwork.comments.map((comment, index) => (
                        <div key={index} className='flex rounded-lg items-center bg-gray-300 dark:bg-neutral-700 text-neutral-700 dark:text-gray-300 py-2 px-4 mb-2 space-x-2'>
                            <div className='flex flex-col basis-10/12'>
                                {editForm && index === editIndex ?
                                    <div className='rounded flex bg-gray-300 dark:bg-neutral-700'>
                                        <input type="text" name="comment" value={editComment} onChange={(ev) => setEditComment(ev.target.value)} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); onEditComment(comment) } }} className="font-josefinlight w-fit mb-2 font-bold text-md placeholder:text-neutral-700 dark:placeholder:text-gray-300 text-gray-600 dark:text-gray-300 outline-none bg-gray-300 dark:bg-neutral-700 border-b-2 border-b-gray-700 dark:border-b-gray-300" />
                                        <IoSend onClick={(ev) => onEditComment(comment)} className='h-5 w-5 ml-2 text-gray-600 dark:text-gray-300 cursor-pointer self-center' />
                                    </div>
                                    :
                                    <p className='font-josefinlight text-lg font-bold'>{comment.content}</p>
                                }
                                <div className='flex'>
                                    <div onClick={() => navigate(`/users/${comment.author.id}`)} className='flex cursor-pointer'>
                                        <div className="w-5 h-5 overflow-hidden">
                                            <img loading='lazy' src={api_fetchUserImages(comment.author.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />
                                        </div>
                                        <p className="font-josefinlight text-sm mx-0.5">
                                            {comment.author.username}
                                        </p>
                                    </div>
                                    <p className='font-josefinlight text-sm'>{'- ' + moment(comment.createdAt).fromNow()}</p>
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

const StoreShow = (props) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeImg, setActiveImg] = useState('');

    const storeItem = useSelector(state => state.store.storeItem);

    useEffect(async () => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
        await dispatch(a_fetchStoreList());
        await dispatch(a_fetchStoreItem(id));
    }, [])

    useEffect(() => {
        setActiveImg(storeItem.files[0])
    }, [storeItem])

    return (
        <div className=' bg-gray-200 dark:bg-darkBg max-100vh pt-5'>
            <div className="text-black dark:text-white text-4xl title-font font-medium mx-5">{storeItem.title}</div>
            <p className='font-josefinlight text-gray-600 dark:text-gray-400 whitespace-nowrap text-sm mx-5'>- Listed on {moment(storeItem.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <p className="text-gray-700 dark:text-gray-400 text-xl leading-relaxed mx-5">{storeItem.description}</p>
            <section className="text-gray-400 body-font overflow-hidden">
                <div className="p-4 mx-auto">
                    <div className="mx-auto flex flex-col lg:flex-row gap-3">
                        <div className="order-2 lg:order-1 lg:w-3/12 w-full mt-4 lg:mt-0 space-y-2">
                            <h2 className="tracking-widest text-lg title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize'>{storeItem.category}</span></h2>
                            <div className='flex relative flex-col p-3 text-left justify-start text-neutral-900 dark:text-gray-400 bg-slate-300 dark:bg-neutral-900 rounded-md'>
                                <TiInfoLarge onClick={() => navigate(`/users/${storeItem.seller.id}`)} className='absolute cursor-pointer h-4 w-4 top-0 right-0 m-2' />
                                <div className="flex">
                                    <div className="w-6 h-6 overflow-hidden">
                                        {storeItem.seller ? <img loading='lazy' src={api_fetchUserImages(storeItem.seller.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" /> : null}
                                    </div>
                                    <p className="font-josefinlight pt-0.5 font-medium text-lg mx-0.5">
                                        {storeItem.seller.username}
                                    </p>
                                    <svg className="stroke-current stroke-1 text-blue-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                    </svg>
                                </div>
                                <div className='flex text-md items-center text-josefinlight'>Seller Rating: <span className='flex ml-2 items-center text-indigo-600'>{Number.parseFloat(storeItem.seller.seller_rating).toFixed(1)}<ImStarFull className='ml-1 text-indigo-600' /></span></div>
                            </div>
                            <span className="flex flex-col text-2xl text-neutral-700 dark:text-gray-300">
                                ${Number.parseFloat(storeItem.price).toFixed(2)}
                                <span className='text-xs text-rose-400'>including shipping & taxes</span>
                            </span>
                            <div className='flex space-x-3'>
                                <button className="flex items-center font-parkinsans font-bold text-indigo-600 bg-transparent border-2 border-indigo-600 py-2 px-6 focus:outline-none hover:bg-indigo-600 hover:text-gray-600 rounded-md">Add to Cart</button>
                                <button className="flex items-center font-parkinsans font-bold text-gray-300 bg-indigo-600 py-2 px-6 focus:outline-none hover:bg-indigo-600 hover:text-gray-600 rounded-md">Checkout</button>
                            </div>
                            {/*<div className='pt-5 pr-3 space-y-2'>
                                <hr className='rounded border-1 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' />
                                <p className="text-black dark:text-gray-200 text-lg title-font font-medium mb-1">
                                    More from {storeItem.seller.username}
                                </p>
                            </div>
                             <div className='grid grid-cols-2 gap-2 mr-3'>
                                {[0, 1, 2, 3].map(item => <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden h-fit">
                                    <img loading='lazy' className="h-40 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={api_fetchStoreImages(activeImg)} />
                                    <div className="py-4 px-2">
                                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400">CATEGORY: <span className='capitalize text-gray-700'>category</span></h2>
                                        <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">title</h1>
                                        <div className="flex items-center flex-wrap justify-between">
                                            <div className='tracking-wide text-md font-medium text-gray-500 font-josefinregular'>$price</div>
                                            <button className="bg-gradient-to-r font-parkinsans font-semibold from-indigo-600 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-2 py-1 rounded-lg">Learn more</button>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div> */}
                        </div>
                        <div className='order-1 lg:order-2 flex flex-col gap-2 lg:w-6/12 lg:h-full rounded'>
                            <img loading='lazy' className="w-full h-full object-cover object-center" src={api_fetchStoreImages(activeImg)} />
                            <div className='grid grid-cols-3 gap-2'>
                                {storeItem.files.map((file, index) =>
                                    <img key={index} onClick={() => setActiveImg(file)} loading='lazy' className={`w-full object-cover object-center rounded ${activeImg === file ? 'border-4 border-indigo-600 dark:border-indigo-600' : ''}`} src={api_fetchStoreImages(file)} />
                                )}
                            </div>
                        </div>
                        <div className='order-3 lg:order-3 lg:w-3/12 w-full lg:h-auto object-cover object-center rounded'>
                            <div className='flex flex-col justify-between'>
                                <p className="text-black dark:text-white text-2xl title-font font-medium mb-1">Ratings & Reviews</p>
                                <div className='flex space-x-2 items-center text-black dark:text-gray-300'>
                                    <p className='text-md title-font'>Sort by:</p>
                                    <div className='flex items-center space-x-1'>
                                        <p>Ratings</p>
                                        <div className='block'>
                                            <AiOutlineUp className='w-2 h-2' />
                                            <AiOutlineDown className='w-2 h-2' />
                                            {/*
                                                    <AiOutlineArrowUp className='w-3 h-3' />
                                                    <AiOutlineArrowDown className='w-3 h-3' />   
                                               */}
                                        </div>
                                    </div>
                                    <div className='flex items-center space-x-1'>
                                        <p>Date</p>
                                        <div className='block'>
                                            <AiOutlineUp className='w-2 h-2' />
                                            <AiOutlineDown className='w-2 h-2' />
                                            {/*
                                                    <AiOutlineArrowUp className='w-3 h-3' />
                                                    <AiOutlineArrowDown className='w-3 h-3' />   
                                               */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-300 dark:bg-neutral-900 p-4 mt-2 rounded-md">
                                <p className="text-black dark:text-gray-200 text-xl title-font font-medium mb-1">Customer Ratings</p>
                                <Ratings size='lg' withBg withValues rating={storeItem.rating} color='text-gray-200' />
                                <div className='flex flex-col mt-2 px-2 space-y-2'>
                                    <Ratings withReview reviews={24} rating={5} color='text-indigo-400' />
                                    <Ratings withReview reviews={4} rating={4} color='text-indigo-400' />
                                    <Ratings withReview reviews={14} rating={3} color='text-indigo-400' />
                                    <Ratings withReview reviews={6} rating={2} color='text-indigo-400' />
                                    <Ratings withReview reviews={1} rating={1} color='text-indigo-400' />
                                </div>
                                <hr className='m-3 rounded border-1 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' />
                                <p className="text-black dark:text-gray-200 text-lg title-font font-medium mb-1">
                                    {storeItem.reviews.length} Reviews
                                </p>
                                {storeItem.reviews.map((review, index) => (
                                    <div key={index} className='flex flex-col rounded-lg bg-gray-300 dark:bg-neutral-800 text-neutral-700 dark:text-gray-300 py-2 px-4 mb-2 space-y-1'>
                                        <div className='flex items-center justify-between'>
                                            <div onClick={() => navigate(`/users/${review.author.id}`)} className='flex cursor-pointer'>
                                                <div className="w-6 h-6 overflow-hidden">
                                                    <img loading='lazy' src={api_fetchUserImages(review.author.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />
                                                </div>
                                                <p className="font-josefinlight text-lg mx-0.5">
                                                    {review.author.username}
                                                </p>
                                            </div>
                                            <div className='flex flex-col'>
                                                <Ratings size='sm' withSingleValue rating={review.rating} color='text-indigo-400' />
                                                <p className='font-josefinlight text-sm'>{'- ' + moment(review.createdAt).fromNow()}</p>
                                            </div>
                                        </div>
                                        <p className='font-josefinlight text-md font-bold'>{review.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default {
    ExploreShow,
    StoreShow
}