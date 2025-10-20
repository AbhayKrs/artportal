import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { a_fetchPost, a_fetchPosts } from '../store/actions/posts.actions';
import { r_setLoader, r_setSnackMessage, r_headerDialogOpen } from '../store/reducers/common.reducer';
import { api_postImages } from '../utils/api_routes';

import { ReactComponent as ViewsIcon } from '../assets/icons/views.svg';
import { ReactComponent as VerifiedIcon } from '../assets/icons/verified.svg';
import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg';
import { ReactComponent as PinIcon } from '../assets/icons/pin.svg';
import { ReactComponent as LikeIcon } from '../assets/icons/like.svg';
import { ReactComponent as LinkIcon } from '../assets/icons/link.svg';
import { ReactComponent as MoreIcon } from '../assets/icons/more.svg';
import { ReactComponent as LikeFilledIcon } from '../assets/icons/likefilled.svg';

import CommentList from '../components/CommentList';
import Divider from '../components/Divider';
import UserBadge from '../components/Badges/UserBadge';
import PostText from '../components/Typography/PostText';
import ImageCarousel from '../components/Carousels/ImageCaroursel';


const PostView = ({ }) => {
    const dispatch = useDispatch();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.user);
    const posts = useSelector(state => state.posts);
    const post = useSelector(state => state.posts.item);

    const [prev, setPrev] = useState('');
    const [next, setNext] = useState('');
    const [comment, setComment] = useState('');

    const hidePane = useOutletContext();

    const { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        dispatch(r_setLoader(true));
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(a_fetchPosts());
        dispatch(a_fetchPost(id));
    }, [id]);

    useEffect(() => {
        const len = posts.main_list.length;
        posts.main_list.forEach((item, index) => {
            if (item._id === post._id) {
                if (index > 0) {
                    setPrev(posts.main_list[index - 1]._id)
                } else {
                    setPrev('');
                }
                if (index < len - 1) {
                    setNext(posts.main_list[index + 1]._id)
                } else {
                    setNext('')
                }
            }
        })
    }, [post._id]);

    const submitComment = async (event) => {
        event.preventDefault();
        // dispatch(a_handleAddComment({ isParent: true, userID: user.id, artworkID: id, parentID: null, commentText: comment }));
        setTimeout(() => dispatch(a_fetchPost(id)), 2000)
        setComment('');
    }

    const handleToggleLike = async (status) => {
        if (!status) {
            // dispatch(a_handleDislikeArtwork({ artworkID: id, userID: user.id }));
        } else {
            // dispatch(a_handleLikeArtwork({ artworkID: id, userID: user.id }));
        }
        setTimeout(() => {
            dispatch(a_fetchPost(id));
        }, 2000);
    }

    const a_handleAwardArtwork = async (award) => {
        // dispatch(a_handleAwardArtwork({ artworkID: id, userID: user.id, award }));
        setTimeout(() => {
            // dispatch(a_refreshUserDetails(user.id));
            dispatch(a_fetchPost(id));
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

    const handlePrev = () => {
        navigate(`/library/${prev}`);
        dispatch(a_fetchPost(prev));
    }

    const handleNext = () => {
        navigate(`/library/${next}`);
        dispatch(a_fetchPost(next));
    }

    return (
        <div className='md:relative flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-darkBg'>
            <div className={`flex ${hidePane ? 'md:w-[70%]' : 'md:w-[69%]'} order-2 md:order-1 justify-center p-4 pr-2 min-h-show`}>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-2'>
                        <UserBadge icon size="md" link={`/users/${post.author._id} `} user={post.author} />
                        <span className='text-base text-neutral-700 dark:text-gray-300'>{moment(post.createdAt).fromNow()}</span>
                    </div>
                    <PostText text={post.full_text} />
                    <ImageCarousel source="posts" size={28} fit="contain" imagePaths={post.files} />
                </div>
            </div>
            <div className={`relative h-full max-h-innershow min-h-innershow md:fixed md:right-4 flex flex-col gap-2 ${hidePane ? 'md:w-[28%]' : 'md:w-3/12'}  order-1 md:order-2 rounded-lg backdrop-sepia-0 bg-white/30 dark:bg-black/30 my-4 py-3`}>
                <div className='flex flex-col gap-3 px-3'>
                    <div className='flex flex-row gap-4'>
                        <div className='flex flex-row items-center gap-1'>
                            {post.likes.filter(item => item === user.id).length > 0 ?
                                <button disabled>
                                    <LikeFilledIcon className='w-4 h-4 text-neutral-700 dark:text-gray-200' />
                                </button>
                                :
                                <button
                                    onClick={() => { user.is_verified ? handleToggleLike(true, post._id) : handleInvalidUser() }}
                                >
                                    <LikeIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                                </button>
                            }
                            <p className="font-semibold text-neutral-600 dark:text-gray-400 text-base">
                                {post.likes.length}
                            </p>
                        </div>
                        <div className='flex flex-row gap-1'>
                            <CommentIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                            <p className="font-semibold text-neutral-600 dark:text-gray-400 text-base">
                                {post.comments.length}
                            </p>
                        </div>
                        <PinIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                        <LinkIcon className='w-4 h-4 text-neutral-600 dark:text-neutral-500' />
                    </div>
                </div>
                <Divider />
                <div className='flex flex-col gap-2 h-full'>
                    <div className='flex items-center justify-between py-0.5 text-neutral-800 dark:text-gray-300 px-3'>
                        <div className='flex flex-row gap-1 items-center'>
                            {/* <IoChatbox className='h-5 w-5' /> */}
                            <h2 className='text-base self-center'>{new Intl.NumberFormat().format(post.comments_count)} comments</h2>
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
                            comments={post.comments}
                            handleInvalidUser={handleInvalidUser}
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default PostView;