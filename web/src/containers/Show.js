import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { a_fetchArtwork, a_fetchArtworks, a_handleDislikeArtwork, a_handleLikeArtwork, a_handleDeleteComment, a_handleEditComment, a_handleDislikeComment, a_handleLikeComment, a_bookmarkArtwork, a_handleAddComment } from '../store/actions/library.actions';
import { a_fetchStoreItem, a_fetchStoreList } from '../store/actions/store.actions';
import { r_setLoader, r_setSnackMessage, r_headerDialogOpen } from '../store/reducers/common.reducers';
import { api_userImages, api_artworkImages, api_storeImages } from '../utils/api_routes';

import { AwardModal, ShareModal } from '../components/Modal';
import Ratings from '../components/Ratings';

import { IoEye, IoHeart, IoSend, IoShareSocialSharp, IoChatbox } from 'react-icons/io5';
import { MdEdit, MdEditOff, MdBookmarkAdd, MdBookmarkAdded } from 'react-icons/md';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { ImStarFull } from 'react-icons/im';
import { TiInfoLarge } from 'react-icons/ti';

import { ReactComponent as ViewsIcon } from '../assets/icons/views.svg';
import { ReactComponent as VerifiedIcon } from '../assets/icons/verified.svg';
import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';
import { ReactComponent as LikeIcon } from '../assets/icons/like.svg';
import { ReactComponent as LikeFilledIcon } from '../assets/icons/likefilled.svg';
import { ReactComponent as DislikeIcon } from '../assets/icons/dislike.svg';
import { ReactComponent as DislikeFilledIcon } from '../assets/icons/dislikefilled.svg';

import CommentList from '../components/CommentList';
import Divider from '../components/Divider';
import { a_refreshUserDetails } from '../store/actions/user.actions';

const Library = (props) => {
    const dispatch = useDispatch();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.user);
    const library = useSelector(state => state.library);
    const artwork = useSelector(state => state.library.artwork);

    const [prev, setPrev] = useState('');
    const [next, setNext] = useState('');
    const [comment, setComment] = useState('');
    const [shareOpen, setShareOpen] = useState(false);
    const [awardOpen, setAwardOpen] = useState(false);

    const hidePane = useOutletContext();

    const { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        dispatch(r_setLoader(true));
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(a_fetchArtworks());
        dispatch(a_fetchArtwork(id));
    }, [id]);

    useEffect(() => {
        const len = library.artworks.length;
        library.artworks.forEach((item, index) => {
            if (item._id === artwork._id) {
                if (index > 0) {
                    setPrev(library.artworks[index - 1]._id)
                } else {
                    setPrev('');
                }
                if (index < len - 1) {
                    setNext(library.artworks[index + 1]._id)
                } else {
                    setNext('')
                }
            }
        })
    }, [artwork._id]);

    const submitComment = async (event) => {
        event.preventDefault();
        dispatch(a_handleAddComment({ isParent: true, userID: user.id, artworkID: id, parentID: null, commentText: comment }));
        setTimeout(() => dispatch(a_fetchArtwork(id)), 2000)
        setComment('');
    }

    const handleToggleLike = async (status) => {
        if (!status) {
            dispatch(a_handleDislikeArtwork({ artworkID: id, userID: user.id }));
        } else {
            dispatch(a_handleLikeArtwork({ artworkID: id, userID: user.id }));
        }
        setTimeout(() => {
            dispatch(a_fetchArtwork(id));
        }, 2000);
    }

    const a_handleAwardArtwork = async (award) => {
        dispatch(a_handleAwardArtwork({ artworkID: id, userID: user.id, award }));
        setTimeout(() => {
            dispatch(a_refreshUserDetails(user.id));
            dispatch(a_fetchArtwork(id));
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
        dispatch(a_bookmarkArtwork({ userID: user.id, artworkID: artwork._id })).then(() => {
            const msgData = {
                open: true,
                message: 'Added to Bookmarks!',
                type: 'success'
            }
            dispatch(r_setSnackMessage(msgData));
            setTimeout(() => {
                dispatch(a_refreshUserDetails(user.id));
                dispatch(a_fetchArtwork(id));
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
        navigate(`/library/${prev}`);
        dispatch(a_fetchArtwork(prev));
    }

    const handleNext = () => {
        navigate(`/library/${next}`);
        dispatch(a_fetchArtwork(next));
    }

    return (
        <div className='md:relative flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-darkBg'>
            <div className={`flex ${hidePane ? 'md:w-[70%]' : 'md:w-[69%]'} order-2 md:order-1 justify-center p-4 pr-2 min-h-show`}>
                {artwork.categories.includes("mature_art") ?
                    <div className="flex flex-col mx-4 md:mx-0 gap-3 w-full">
                        <div className='flex flex-col items-center text-center'>
                            <h1 className='text-xl lg:text-2xl  font-semibold leading-5 lg:leading-6 text-neutral-800 dark:text-neutral-200'>18+ Content</h1>
                            <h2 className='text-base lg:text-lg  font-semibold leading-5 lg:leading-6 text-neutral-700 dark:text-neutral-200'>The following artwork contains mature content.<br /> Please validate yourself by via login to view the artwork.</h2>
                            <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className='whitespace-nowrap self-center bg-neutral-800 dark:bg-gray-300 text-gray-200 dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-gray-200 py-1 px-3 rounded-md text-base  font-medium tracking-wide'>Sign In</button>
                        </div>
                    </div>
                    :
                    <div className="flex flex-col gap-3 w-full">
                        <div className='flex m-auto w-fit self-center justify-center'>
                            {artwork.files[0]?.length > 0 && <img loading='lazy' src={`${api_artworkImages(artwork.files[0])}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />}
                        </div>
                        {artwork.files.filter((image, index) => index !== 0).length > 0 &&
                            <div className='flex w-fit flex-col self-center justify-center gap-3'>
                                {artwork.files.filter((image, index) => index !== 0).map((image, index) => (
                                    <img loading='lazy' key={index} src={`${api_artworkImages(image)}`} className="h-full px-10 xs:px-0 object-cover object-center rounded-lg" />
                                ))}
                            </div>
                        }
                    </div>
                }
            </div>
            <div className={`relative min-h-innershow md:fixed md:right-4 flex flex-col gap-2 ${hidePane ? 'md:w-[28%]' : 'md:w-3/12'}  order-1 md:order-2 rounded-lg backdrop-sepia-0 bg-white/30 dark:bg-black/30 my-4 py-3`}>
                {/* <div className='relative md:fixed md:left-4 flex flex-col h-fit md:w-[23%] mx-4 md:mx-0 ' style={{ maxHeight: "calc(100vh - 7.25rem)" }}> */}
                <div className='flex flex-col'>
                    <div className='flex flex-col gap-2 px-3'>
                        <div className='flex flex-col gap-1 w-full wrap-any'>
                            <h1 className='text-xl tex-gray-900 dark:text-gray-200 font-bold'>{artwork.title}</h1>
                            <p className='text-base tex-gray-800 dark:text-gray-300'>{artwork.description}</p>
                        </div>
                        <div className='flex flex-row items-center w-full p-2 bg-neutral-300 dark:bg-neutral-800 rounded-xl gap-2'>
                            <div className="font-medium text-sm text-neutral-800 dark:text-gray-300">Categories</div>
                            <div className='flex flex-row gap-1.5'>
                                {artwork.categories.map((item, index) => (
                                    <div key={index} className="flex w-fit justify-center items-center font-medium py-1.5 px-2 bg-teal-500 dark:bg-teal-600 rounded-full text-neutral-800 dark:text-gray-300 shadow">
                                        <div className="text-sm font-medium leading-none">{item}</div>
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
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2 text-right justify-end text-neutral-900 dark:text-gray-400'>
                                <div onClick={() => navigate(`/users/${artwork.artist._id}`)} className="flex flex-row gap-1 items-center cursor-pointer">
                                    <div className="w-6 h-6 overflow-hidden">
                                        {artwork.artist.avatar.icon.length > 0 && <img loading='lazy' src={api_userImages(artwork.artist.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />}
                                    </div>
                                    <div className='flex flex-row items-center gap-1'>
                                        <p className='text-neutral-800 dark:text-gray-200 text-base font-medium tracking-wide'>{artwork.artist.username}</p>
                                        <VerifiedIcon className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 h-4 w-4" />
                                        <Artportal_logo fill="#059669" className='h-3 w-auto' />
                                    </div>
                                </div>
                                <p className='tracking-wide whitespace-nowrap text-sm'>{moment(artwork.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                {/* {artwork.artist.id === user.id ?
                                    <div onClick={() => navigate(`/library/${artwork._id}/edit`)} className='rounded-lg bg-blue-700 p-2 cursor-pointer ml-2'>
                                        <MdEdit className="text-gray-200 h-6 w-6" />
                                    </div>
                                    : <div className="relative float-left flex">
                                        <img
                                            loading='lazy'
                                            src={AwardIcon}
                                            className='h-12 w-12 cursor-pointer'
                                            onClick={() => {
                                                user.is_verified ?
                                                    setAwardOpen(true)
                                                    :
                                                    handleInvalidUser()
                                            }}
                                        />
                                        <ImPlus className="absolute bottom-0 right-0 text-[#D1853A] h-4 w-4" />
                                    </div>} */}
                                <div className='flex flex-row gap-6'>
                                    <div className='flex flex-row gap-3 items-center'>
                                        <div className='flex flex-row items-center gap-1'>
                                            <ViewsIcon className='w-5 h-5 text-neutral-600 dark:text-neutral-500' />
                                            <p className='font-semibold text-neutral-600 dark:text-neutral-500 text-base'>{new Intl.NumberFormat().format(artwork.views.length)}</p>
                                        </div>
                                        <div className='flex flex-row items-center gap-1'>
                                            {artwork.likes.filter(item => item === user.id).length > 0 ?
                                                <button disabled>
                                                    <LikeFilledIcon className='w-4 h-4 text-neutral-700 dark:text-gray-200' />
                                                </button>
                                                :
                                                <button
                                                    onClick={() => { user.is_verified ? handleToggleLike(true) : handleInvalidUser() }}
                                                >
                                                    <LikeIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                                                </button>
                                            }
                                            <p className="font-semibold text-neutral-600 dark:text-gray-400 text-base">
                                                {artwork.likes.length}
                                            </p>
                                        </div>
                                        <div className='flex flex-row items-center gap-1'>
                                            {artwork.dislikes.filter(item => item === user.id).length > 0 ?
                                                <button disabled>
                                                    <DislikeFilledIcon className='w-4 h-4 text-neutral-700 dark:text-gray-200' />
                                                </button>
                                                :
                                                <button
                                                    onClick={() => { user.is_verified ? handleToggleLike(false) : handleInvalidUser() }}
                                                >
                                                    <DislikeIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                                                </button>
                                            }
                                            <p className="font-semibold text-neutral-600 dark:text-gray-400 text-base">
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
                                                    user.is_verified ?
                                                        bookmarkIt()
                                                        :
                                                        handleInvalidUser()
                                                }}
                                            />
                                        }
                                    </div>
                                </div>
                                <div className='flex flex-row gap-3 rounded'>
                                    {prev.length > 0 ? <div onClick={handlePrev} className='cursor-pointer flex justify-end py-0.5 gap-2 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-700'>
                                        <FaChevronLeft className='h-6 w-6' />
                                    </div> : ''}
                                    {next.length > 0 ? <div onClick={handleNext} className='cursor-pointer flex justify-end py-0.5 gap-2 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-700'>
                                        <FaChevronRight className='h-6 w-6' />
                                    </div> : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between py-0.5 text-neutral-800 dark:text-gray-300 px-3'>
                            <div className='flex flex-row gap-1 items-center'>
                                {/* <IoChatbox className='h-5 w-5' /> */}
                                <h2 className='text-base self-center'>{new Intl.NumberFormat().format(artwork.comments_count)} comments</h2>
                            </div>
                        </div>
                        {user.is_verified ? <div className='flex flex-row gap-2 items-center px-3'>
                            <input
                                type="text"
                                name="comment"
                                value={comment}
                                onChange={(ev) => setComment(ev.target.value)}
                                onKeyDown={(ev) => { if (ev.code === 'Enter') { submitComment(ev) } }}
                                placeholder="Add a comment"
                                className="w-full py-2 px-4 rounded-full text-md placeholder:font-semibold placeholder:text-neutral-700 dark:placeholder:text-neutral-400 text-gray-600 dark:text-neutral-300 outline-none border border-gray-700 dark:border-neutral-500"
                            />
                        </div> : null}
                        <div className="flex flex-col h-full max-h-comments overflow-y-auto scrollbar px-3">
                            <CommentList
                                comments={artwork.comments}
                                handleInvalidUser={handleInvalidUser}
                            />
                        </div>
                    </div>
                </div>
                {/* {artwork.awards.length > 0 ?
                        <div id='award' className='flex overflow-x-hidden bg-slate-200 dark:bg-neutral-700 mx-2 p-2 rounded-lg gap-2'>
                            {artwork.awards.map((award, index) => (
                                <div key={index} className="relative float-left mr-2 flex">
                                    <img loading='lazy' draggable="false" className='max-w-fit h-12 w-12' src={api_userImages(award.icon)} />
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
                        artworkID={id}
                        onClose={() => setAwardOpen(false)}
                        onClick={() => setAwardOpen(false)}
                        a_handleAwardArtwork={a_handleAwardArtwork}
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

const Store = (props) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeImg, setActiveImg] = useState('');

    const storeItem = useSelector(state => state.store.storeItem);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
        dispatch(a_fetchStoreList());
        dispatch(a_fetchStoreItem(id));
    }, [])

    useEffect(() => {
        setActiveImg(storeItem.files[0])
    }, [storeItem])

    return (
        <div className='bg-gray-200 dark:bg-darkBg max-100vh pt-5'>
            <div className="text-black dark:text-white text-4xl title-font font-medium mx-5">{storeItem.title}</div>
            <p className='text-gray-600 dark:text-gray-400 whitespace-nowrap text-sm mx-5'>- Listed on {moment(storeItem.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <p className="text-gray-700 dark:text-gray-400 text-xl leading-relaxed mx-5">{storeItem.description}</p>
            <section className="text-gray-400 body-font overflow-hidden">
                <div className="p-4 mx-auto">
                    <div className="mx-auto flex flex-col lg:flex-row gap-3">
                        <div className="order-2 lg:order-1 lg:w-3/12 w-full mt-4 lg:mt-0 gap-2">
                            <h2 className="tracking-widest text-lg title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize'>{storeItem.category}</span></h2>
                            <div className='flex relative flex-col p-3 text-left justify-start text-neutral-900 dark:text-gray-400 bg-slate-300 dark:bg-neutral-900 rounded-md'>
                                <TiInfoLarge onClick={() => navigate(`/users/${storeItem.seller.id}`)} className='absolute cursor-pointer h-4 w-4 top-0 right-0 m-2' />
                                <div className="flex">
                                    <div className="w-6 h-6 overflow-hidden">
                                        {storeItem.seller ? <img loading='lazy' src={api_userImages(storeItem.seller.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" /> : null}
                                    </div>
                                    <p className=" pt-0.5 font-medium text-lg mx-0.5">
                                        {storeItem.seller.username}
                                    </p>
                                    <svg className="stroke-current stroke-1 text-blue-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                    </svg>
                                </div>
                                <div className='flex text-md items-center text-josefinlight'>Seller Rating: <span className='flex ml-2 items-center text-blue-700'>{Number.parseFloat(storeItem.seller.seller_rating).toFixed(1)}<ImStarFull className='ml-1 text-blue-700' /></span></div>
                            </div>
                            <span className="flex flex-col text-2xl text-neutral-700 dark:text-gray-300">
                                ${Number.parseFloat(storeItem.price).toFixed(2)}
                                <span className='text-xs text-rose-400'>including shipping & taxes</span>
                            </span>
                            <div className='flex gap-3'>
                                <button className="flex items-center  font-bold text-blue-700 bg-transparent border-2 border-blue-700 py-2 px-6 focus:outline-none hover:bg-blue-700 hover:text-gray-600 rounded-md">Add to Cart</button>
                                <button className="flex items-center  font-bold text-gray-300 bg-blue-700 py-2 px-6 focus:outline-none hover:bg-blue-700 hover:text-gray-600 rounded-md">Checkout</button>
                            </div>
                            {/*<div className='pt-5 pr-3 gap-2'>
                                <hr className='rounded border-1 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' />
                                <p className="text-black dark:text-gray-200 text-lg title-font font-medium mb-1">
                                    More from {storeItem.seller.username}
                                </p>
                            </div>
                             <div className='grid grid-cols-2 gap-2 mr-3'>
                                {[0, 1, 2, 3].map(item => <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden h-fit">
                                    <img loading='lazy' className="h-40 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={api_storeImages(activeImg)} />
                                    <div className="py-4 px-2">
                                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400">CATEGORY: <span className='capitalize text-gray-700'>category</span></h2>
                                        <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">title</h1>
                                        <div className="flex items-center flex-wrap justify-between">
                                            <div className='tracking-wide text-md font-medium text-gray-500 '>$price</div>
                                            <button className="bg-gradient-to-r  font-semibold from-blue-700 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-2 py-1 rounded-lg">Learn more</button>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div> */}
                        </div>
                        <div className='order-1 lg:order-2 flex flex-col gap-2 lg:w-6/12 lg:h-full rounded'>
                            <img loading='lazy' className="w-full h-full object-cover object-center" src={api_storeImages(activeImg)} />
                            <div className='grid grid-cols-3 gap-2'>
                                {storeItem.files.map((file, index) =>
                                    <img key={index} onClick={() => setActiveImg(file)} loading='lazy' className={`w-full object-cover object-center rounded ${activeImg === file ? 'border-4 border-blue-700 dark:border-blue-700' : ''}`} src={api_storeImages(file)} />
                                )}
                            </div>
                        </div>
                        <div className='order-3 lg:order-3 lg:w-3/12 w-full lg:h-auto object-cover object-center rounded'>
                            <div className='flex flex-col justify-between'>
                                <p className="text-black dark:text-white text-2xl title-font font-medium mb-1">Ratings & Reviews</p>
                                <div className='flex gap-2 items-center text-black dark:text-gray-300'>
                                    <p className='text-md title-font'>Sort by:</p>
                                    <div className='flex items-center gap-1'>
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
                                    <div className='flex items-center gap-1'>
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
                                <div className='flex flex-col mt-2 px-2 gap-2'>
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
                                    <div key={index} className='flex flex-col rounded-lg bg-gray-300 dark:bg-neutral-800 text-neutral-700 dark:text-gray-300 py-2 px-4 mb-2 gap-1'>
                                        <div className='flex items-center justify-between'>
                                            <div onClick={() => navigate(`/users/${review.author.id}`)} className='flex cursor-pointer'>
                                                <div className="w-6 h-6 overflow-hidden">
                                                    <img loading='lazy' src={api_userImages(review.author.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />
                                                </div>
                                                <p className=" text-lg mx-0.5">
                                                    {review.author.username}
                                                </p>
                                            </div>
                                            <div className='flex flex-col'>
                                                <Ratings size='sm' withSingleValue rating={review.rating} color='text-indigo-400' />
                                                <p className='text-sm'>{'- ' + moment(review.createdAt).fromNow()}</p>
                                            </div>
                                        </div>
                                        <p className='text-md font-bold'>{review.content}</p>
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
    Library,
    Store
}