import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { fetchExploreImages, fetchUserImages, fetchStoreImages } from '../api';
import { clearExploreShow, fetchExploreList, fetchExploreItem, handleLikeExplore, handleAwardExplore, handleDislikeExplore, handleAddComment, handleEditComment, handleDeleteComment, handleLikeComment, handleDislikeComment, bookmarkExploreItem } from '../store/actions/explore.actions';
import { fetchStoreList, fetchStoreItem } from '../store/actions/store.actions';
import { setLoader, fetchAwards, loadProfileDetails, refreshUserDetails, setError } from '../store/actions/common.actions';
import { ExploreShowCarousel } from '../components/Carousel';
import { AwardModal, ShareModal } from '../components/Modal';

import { IoEye, IoHeart, IoSend, IoShareSocialSharp, IoChatbox } from 'react-icons/io5';
import { BsFillBookmarkFill, BsTrash, BsHeartFill } from 'react-icons/bs';
import { IoIosSend } from "react-icons/io";
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { MdEdit, MdEditOff } from 'react-icons/md';
import { ImPlus, ImStarFull } from 'react-icons/im';

import AwardIcon from '../assets/images/gift.png';

const ExploreShow = (props) => {
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
        props.setLoader(true);
        window.scrollTo(0, 0)
        await props.fetchExploreList();
        props.fetchExploreItem(id);
        props.fetchAwards();
    }, [])

    const submitComment = async (event) => {
        event.preventDefault();
        await props.handleAddComment(comment, id);
        props.fetchExploreItem(id);
        setComment('');
    }

    useEffect(() => {
        const len = props.explore.exploreList.length;
        props.fetchExploreItem(id);
        if (props.exploreShow.likes.filter(item => item === props.user.id).length > 0) {
            setLike(true);
        } else {
            setLike(false);
        }
        props.explore.exploreList.forEach((item, index) => {
            if (item._id === props.exploreShow._id) {
                if (index > 0) {
                    setPrev(props.explore.exploreList[index - 1]._id)
                } else {
                    setPrev('');
                }
                if (index < len - 1) {
                    setNext(props.explore.exploreList[index + 1]._id)
                } else {
                    setNext('')
                }
            }
        })
    }, [props.exploreShow._id]);

    const handleToggleLike = async (likes) => {
        if (likes.includes(props.user.id)) {
            await props.handleDislikeExplore(id, false);
        } else {
            await props.handleLikeExplore(id, true);
        }
        props.fetchExploreItem(id);
    }

    const handleAwardExplore = async (award) => {
        console.log('handleAwardExplore', award);
        await props.handleAwardExplore(id, props.user.id, award);
        setTimeout(() => {
            props.refreshUserDetails(props.user.id);
            props.fetchExploreItem(id);
        }, 2000);
    }

    const onDeleteComment = async (comment) => {
        await props.handleDeleteComment(id, comment._id);
        props.fetchExploreItem(id);
    }

    const onEditComment = async (comment) => {
        await props.handleEditComment(editComment, id, comment._id);
        setEditForm(false);
        setTimeout(() => {
            props.fetchExploreItem(id);
        }, 2000);
        return false;
    }

    const handleToggleCommentLike = async (status, comment) => {
        if (!status) {
            await props.handleDislikeComment(id, comment._id);
        } else {
            await props.handleLikeComment(id, comment._id);
        }
        setTimeout(() => {
            props.fetchExploreItem(id);
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
        const error = {
            open: true,
            message: 'User not logged in. Please Sign In/Sign Up to perform the action.',
            type: 'snackbar'
        }
        console.log('like error', error)
        props.setError(error);
    }

    const bookmarkIt = () => {
        const bookmarkData = {
            id: props.exploreShow._id,
            files: props.exploreShow.files,
            title: props.exploreShow.title,
            author: props.exploreShow.author,
            description: props.exploreShow.description
        }
        props.bookmarkExploreItem(props.user.id, bookmarkData).then(() => {
            const errorData = {
                open: true,
                message: 'Added to Bookmarks!',
                type: 'success'
            }
            props.setError(errorData);
        }).catch(err => {
            console.log('err', err)
        })
    }

    return (
        <div className='main-container grid min-h-screen gap-2 bg-gray-200 dark:bg-darkNavBg sm:grid-cols-1 lg:grid-cols-12'>
            <ExploreShowCarousel
                prevTrue={prev.length > 0}
                nextTrue={next.length > 0}
                data={props.explore.exploreList}
                currentImage={props.exploreShow.files[0]}
                secondaryImages={props.exploreShow.files.filter((image, index) => index !== 0)}
                prev={() => { navigate(`/explore/${prev}`); props.fetchExploreItem(prev); }}
                next={() => { navigate(`/explore/${next}`); props.fetchExploreItem(next); }}
            />
            <div className='flex fixed m-5 space-x-3 py-1 px-2 bg-neutral-100 dark:bg-neutral-800 rounded'>
                <div className='flex justify-end py-0.5 space-x-2 text-teal-500'>
                    <h3 className='font-josefinlight text-lg self-center'>{new Intl.NumberFormat().format(props.exploreShow.likes.length)}</h3>
                    <IoEye className='h-6 w-6' />
                </div>
                <div className='flex justify-end py-0.5 space-x-2 text-violet-500 dark:text-violet-500'>
                    <h3 className='font-josefinlight text-lg self-center'>{new Intl.NumberFormat().format(props.exploreShow.likes.length)}</h3>
                    <IoHeart className='h-6 w-6' />
                </div>
                <div className='flex justify-end py-0.5 space-x-2 text-violet-500 dark:text-violet-500'>
                    <h3 className='font-josefinlight text-lg self-center'>{new Intl.NumberFormat().format(props.exploreShow.comment_count)}</h3>
                    <IoChatbox className='h-6 w-6' />
                </div>
            </div>
            <div className='lg:col-span-4 md:mt-3 sm:mt-0 bg-fixed'>
                <div className='flex flex-col rounded-md bg-neutral-50 dark:bg-neutral-800 mr-2 ml-2 lg:ml-0 py-3'>
                    <div className='flex flex-col space-y-2'>
                        <div className='flex flex-row space-x-2'>
                            <div className='flex flex-col w-full space-y-2 px-2'>
                                <h1 className='font-caviar text-2xl tex-gray-900 dark:text-gray-200 font-bold'>{props.exploreShow.title}</h1>
                                <p className='font-josefinlight text-lg tex-gray-800 dark:text-gray-300'>{props.exploreShow.description}</p>
                            </div>
                        </div>
                        <div className='flex flex-wrap px-1'>
                            {props.exploreShow.tags.map((item, index) => (
                                <div key={index} className="flex w-fit justify-center items-center m-0.5 font-medium py-1.5 px-2 bg-indigo-50 dark:bg-violet-500/25 rounded-full text-gray-600 dark:text-gray-300 shadow">
                                    <div className="text-xs font-medium leading-none">{item}</div>
                                </div>
                            ))}
                        </div>
                        <div className='flex pl-1 justify-between'>
                            <div className='flex w-fit items-center space-x-3'>
                                <div className="relative float-left flex">
                                    <img onClick={props.common.isAuthenticated ? () => setAwardOpen(true) : handleInvalidUser} src={AwardIcon} className='h-12 w-12 cursor-pointer' />
                                    <ImPlus className="absolute bottom-0 right-0 text-[#D1853A] h-4 w-4" />
                                </div>
                                <BsHeartFill style={like ? { color: '#FF3980' } : { color: '#F190B3' }} className='h-7 w-7 cursor-pointer' onClick={props.common.isAuthenticated ? () => { setLike(!like); handleToggleLike(props.exploreShow.likes) } : handleInvalidUser} />
                                <IoShareSocialSharp onClick={() => setShareOpen(true)} className='h-7 w-7 cursor-pointer text-violet-500 dark:text-violet-500' />
                                <BsFillBookmarkFill onClick={props.common.isAuthenticated ? () => bookmarkIt() : handleInvalidUser} className='h-7 w-7 cursor-pointer text-violet-500 dark:text-violet-500' />
                            </div>
                            <div className='mr-3'>
                                <div className='flex flex-col text-right justify-end py-1 text-neutral-900 dark:text-gray-400'>
                                    <p className='font-josefinlight text-xl'>Posted By</p>
                                    <div className="flex justify-end">
                                        <div className="w-6 h-6 overflow-hidden">
                                            <img src={fetchUserImages(props.exploreShow.author.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />
                                        </div>
                                        <p className="font-josefinlight pt-0.5 font-medium text-lg mx-0.5">
                                            {props.exploreShow.author.username}
                                        </p>
                                        <svg className="stroke-current stroke-1 text-blue-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                    </div>
                                    <p className='font-josefinlight whitespace-nowrap text-sm'>{moment(props.exploreShow.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='award' className='flex overflow-x-hidden bg-slate-200 dark:bg-neutral-700 mx-2 p-2 rounded-lg space-x-2'>
                        {props.exploreShow.awards.map((award, index) => (
                            <div key={index} className="relative float-left mr-2 flex">
                                <img draggable="false" className='max-w-fit h-12 w-12' src={fetchUserImages(award.icon)} />
                                <span className="absolute font-bold top-0 right-0 inline-block rounded-full bg-violet-800 shadow-lg shadow-neutral-800 text-gray-300 px-1.5 py-0.5 text-xs">{award.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {props.common.isAuthenticated ?
                    <div className='m-2 rounded flex bg-gray-300 dark:bg-neutral-700'>
                        {comment.length > 0 ?
                            <IoIosSend onClick={(ev) => submitComment(ev)} className='h-7 w-7 text-gray-600 dark:text-gray-300 cursor-pointer self-center ml-2' />
                            :
                            <IoIosSend className='h-7 w-7 text-neutral-700 dark:text-gray-300 self-center ml-2' />
                        }
                        <input type="text" name="comment" value={comment} onChange={(ev) => setComment(ev.target.value)} onKeyPress={(ev) => { if (ev.key === 'Enter') { submitComment(ev) } }} placeholder={`Hey ${props.user.username}, Let the artist know your thoughts...`} className="font-josefinlight w-full mx-2 my-3 font-bold text-md placeholder:text-neutral-700 dark:placeholder:text-gray-300 text-gray-600 dark:text-gray-300 outline-none bg-gray-300 dark:bg-neutral-700 border-b-2 border-b-gray-700 dark:border-b-gray-300" />
                    </div>
                    :
                    ''}
                <div className='m-2 ml-6'>
                    {props.exploreShow.comments.map((comment, index) => (
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
                                    <div className="w-5 h-5 overflow-hidden">
                                        <img src={fetchUserImages(comment.author.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />
                                    </div>
                                    <p className="font-josefinlight text-sm mx-0.5">
                                        {comment.author.username}
                                    </p>
                                    <p className='font-josefinlight text-sm'>{'- ' + moment(comment.createdAt).fromNow()}</p>
                                </div>
                            </div>
                            <div className="flex basis-2/12 items-center justify-end relative ">
                                <div className='flex space-x-1'>
                                    {comment.likes.filter(item => item === props.user.id).length > 0 ?
                                        <button disabled>
                                            <AiFillLike className='w-5 h-5 text-violet-500' />
                                        </button>
                                        :
                                        <button onClick={props.common.isAuthenticated ? () => handleToggleCommentLike(true, comment) : handleInvalidUser}>
                                            <AiFillLike className='w-5 h-5 text-neutral-500' />
                                        </button>
                                    }
                                    <div className="text-sm">
                                        {comment.likes.length}
                                    </div>
                                    <button onClick={props.common.isAuthenticated ? () => handleToggleCommentLike(false, comment) : handleInvalidUser}>
                                        <AiFillDislike className='w-5 h-5' />
                                    </button>
                                </div>
                                {props.common.isAuthenticated && props.user.id === comment.author.id ?
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
                <AwardModal
                    open={awardOpen}
                    title='Awards'
                    awardList={props.common.awardList}
                    user={props.user}
                    exploreID={id}
                    onClose={() => setAwardOpen(false)}
                    onClick={() => setAwardOpen(false)}
                    handleAwardExplore={handleAwardExplore}
                />
                <ShareModal
                    open={shareOpen}
                    title='Share'
                    onClose={() => setShareOpen(false)}
                    onClick={() => setShareOpen(false)}
                />
            </div>
        </div >
    )
}

const StoreShow = (props) => {
    const { id } = useParams();
    let navigate = useNavigate();

    useEffect(async () => {
        props.setLoader(true);
        window.scrollTo(0, 0)
        await props.fetchStoreList();
        props.fetchStoreItem(id);
    }, [])

    return (
        <div className='main-container bg-gray-200 dark:bg-darkNavBg max-100vh'>
            <section className="text-gray-400 body-font overflow-hidden">
                <div className="p-6 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <img className="lg:w-1/2 w-full lg:h-auto h-96 object-cover object-center rounded" src={fetchStoreImages(props.storeShow.files[0])} />
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-4 lg:mt-0">
                            <div className="text-black dark:text-white text-4xl title-font font-medium mb-1">{props.storeShow.title}</div>
                            <h2 className="tracking-widest text-lg title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize text-gray-700'>{props.storeShow.category}</span></h2>
                            <p className="text-gray-500 leading-relaxed">{props.storeShow.description}</p>
                            <div className="flex my-2">
                                <span className="flex items-center">
                                    <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <span className="ml-3 text-lg text-gray-600">{Number.parseFloat(props.storeShow.rating).toFixed(1)} / 5.0</span>
                                </span>
                            </div>
                            <div className='mr-3'>
                                <div className='flex flex-col text-right justify-end py-1 text-neutral-900 dark:text-gray-400'>
                                    <p className='font-josefinlight text-xl'>Seller Details</p>
                                    <div className="flex justify-end">
                                        <div className="w-6 h-6 overflow-hidden">
                                            <img src={fetchUserImages(props.storeShow.seller.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />
                                        </div>
                                        <p className="font-josefinlight pt-0.5 font-medium text-lg mx-0.5">
                                            {props.storeShow.seller.username}
                                        </p>
                                        <svg className="stroke-current stroke-1 text-blue-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                    </div>
                                    <div className='flex justify-end text-md items-center text-josefinlight'>Rating: {Number.parseFloat(props.storeShow.seller.seller_rating).toFixed(1)} <ImStarFull className='ml-1 text-indigo-500' /></div>
                                    <p className='font-josefinlight whitespace-nowrap text-sm'>{moment(props.storeShow.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                </div>
                            </div>
                            <div className="flex">
                                <span className="flex flex-col font-medium text-3xl text-neutral-700 dark:text-gray-300">
                                    ${Number.parseFloat(props.storeShow.price).toFixed(2)}
                                    <span className='text-xs text-rose-400'>including shipping & taxes</span>
                                </span>
                                <button className="flex ml-auto  items-center font-caviar font-bold text-violet-500 bg-transparent border-2 border-violet-500 py-2 px-6 focus:outline-none hover:bg-violet-500 hover:text-gray-600 rounded-md">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    user: state.common.user,
    common: state.common,
    explore: state.explore,
    exploreShow: state.explore.exploreData,
    store: state.store,
    storeShow: state.store.storeItem
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader,
    clearExploreShow,
    fetchExploreItem,
    fetchExploreList,
    fetchStoreList,
    fetchStoreItem,
    loadProfileDetails,
    refreshUserDetails,
    handleLikeExplore,
    handleAwardExplore,
    handleDislikeExplore,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handleLikeComment,
    handleDislikeComment,
    fetchAwards,
    setError,
    bookmarkExploreItem
}, dispatch);

export default {
    ExploreShow: connect(mapStateToProps, mapDispatchToProps)(ExploreShow),
    StoreShow: connect(mapStateToProps, mapDispatchToProps)(StoreShow)
}