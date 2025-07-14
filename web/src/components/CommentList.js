import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { a_fetchExploreItem, a_handleDeleteComment, a_handleEditComment, a_handleDislikeComment, a_handleLikeComment, a_bookmarkExploreItem, a_handleAddComment } from '../store/actions/explore.actions';
import { api_fetchUserImages } from '../utils/api_routes';

import { IoSend } from 'react-icons/io5';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';

const CommentList = ({ comments, handleInvalidUser }) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    let navigate = useNavigate();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.common.user);

    const [editForm, setEditForm] = useState(false);
    const [editIndex, setEditIndex] = useState('');
    const [editComment, setEditComment] = useState('');
    const [replies, setReplies] = useState([]);

    const onDeleteComment = async (comment) => {
        await dispatch(a_handleDeleteComment({ exploreID: id, commentID: comment._id }));
        dispatch(a_fetchExploreItem(id));
    }

    const onEditComment = async (comment) => {
        dispatch(a_handleEditComment({ exploreID: id, newComment: editComment, commentID: comment._id }));
        setEditForm(false);
        setTimeout(() => {
            dispatch(a_fetchExploreItem(id));
        }, 2000);
        return false;
    }

    const handleToggleCommentLike = async (status, comment) => {
        if (!status) {
            dispatch(a_handleDislikeComment({ artworkID: id, commentID: comment._id, userID: user.id }));
        } else {
            dispatch(a_handleLikeComment({ artworkID: id, commentID: comment._id, userID: user.id }));
        }
        setTimeout(() => {
            dispatch(a_fetchExploreItem(id));
        }, 2000);
    }

    const startReply = (id, parent) => {
        setReplies((prevReplies) => {
            const exists = prevReplies.some((reply) => reply.id === id);
            if (exists) return prevReplies;
            return [...prevReplies, { id, parent, text: "" }];
        });
    }

    const updateReplies = (id, text) => {
        setReplies((prevReplies) =>
            prevReplies.map((reply) =>
                reply.id === id
                    ? { ...reply, text } // Update the matching reply
                    : reply // Keep other replies unchanged
            )
        );
    }

    const submitReply = (replyID) => {
        const toSubmit = replies.find(reply => reply.id === replyID);
        console.log("Test", toSubmit);
        dispatch(a_handleAddComment({
            isParent: false,
            userID: user.id,
            artworkID: id,
            parentID: toSubmit.parent,
            commentText: toSubmit.text
        }));
        setTimeout(() => {
            dispatch(a_fetchExploreItem(id));
            clearReply(replyID);
        }, 2000)
    }

    const clearReply = (id) => {
        setReplies((prevReplies) => {
            return prevReplies.filter((reply) => reply.id !== id);
        });
    }

    return (
        <div className='flex flex-col gap-2 overflow-y-auto scrollbar'>
            {comments.map((comment, index) => (
                <>
                    <div key={index} className='flex items-center text-neutral-700 dark:text-gray-300 gap-2'>
                        <div className='flex flex-col gap-0.5 basis-10/12'>
                            {editForm && index === editIndex ?
                                <div className='rounded flex bg-gray-300 dark:bg-neutral-700'>
                                    <input type="text" name="comment" value={editComment} onChange={(ev) => setEditComment(ev.target.value)} onKeyPress={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); onEditComment(comment) } }} className=" w-fit mb-2 font-bold text-md placeholder:text-neutral-700 dark:placeholder:text-gray-300 text-gray-600 dark:text-gray-300 outline-none bg-gray-300 dark:bg-neutral-700 border-b-2 border-b-gray-700 dark:border-b-gray-300" />
                                    <IoSend onClick={(ev) => onEditComment(comment)} className='h-5 w-5 ml-2 text-gray-600 dark:text-gray-300 cursor-pointer self-center' />
                                </div>
                                :
                                <p className='text-base'>{comment.text}</p>
                            }
                            <div className='flex flex-row items-center'>
                                <div onClick={() => navigate(`/users/${comment.author.id}`)} className='flex gap-0.5 cursor-pointer items-center'>
                                    {comment.author.avatar.icon.length > 0 && <div className="w-4 h-4 overflow-hidden">
                                        <img loading='lazy' src={api_fetchUserImages(comment.author.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />
                                    </div>}
                                    <p className="text-xs mx-0.5">
                                        {comment.author.username}
                                    </p>
                                </div>
                                <p className='text-xs'>{'- ' + moment(comment.createdAt).fromNow()}</p>
                            </div>
                        </div>
                        <div className="flex basis-2/12 items-center justify-end relative">
                            <div className='flex flex-row gap-2 items-center'>
                                <div className='flex flex-row gap-1'>
                                    {comment.likes.filter(item => item === user.id).length > 0 ?
                                        <button disabled>
                                            <AiFillLike className='w-4 h-4 text-gray-200' />
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
                                            <AiFillLike className='w-4 h-4 text-neutral-500' />
                                        </button>
                                    }
                                    <div className="text-sm">
                                        {comment.likes.length}
                                    </div>
                                </div>
                                <div className='flex flex-row gap-1'>
                                    {comment.dislikes.filter(item => item === user.id).length > 0 ?
                                        <button disabled>
                                            <AiFillDislike className='w-4 h-4 text-gray-200' />
                                        </button>
                                        :
                                        <button
                                            onClick={() => {
                                                common.isAuthenticated ?
                                                    handleToggleCommentLike(false, comment)
                                                    :
                                                    handleInvalidUser()
                                            }}
                                        >
                                            <AiFillDislike className='w-4 h-4 text-neutral-500' />
                                        </button>
                                    }
                                    <div className="text-sm">
                                        {comment.dislikes.length}
                                    </div>
                                </div>
                                <span className='text-gray-300 dark:text-neutral-500 text-xs'>&#9679;</span>
                                <button
                                    onClick={() => startReply(index, comment._id)}
                                    className='flex flex-row gap-1 text-sm'
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                    {comment.replies && comment.replies.length > 0 && <div className='self-end w-[95%]'>
                        <CommentList comments={comment.replies} handleInvalidUser={handleInvalidUser} />
                    </div>}
                    {replies.length > 0 ?
                        replies[index] !== null && replies.find((reply) => reply.id === index) ?
                            <div className='flex flex-row gap-3 items-center'>
                                <div className='flex flex-row gap-1 w-full'>
                                    {user.avatar.icon.length > 0 && <div className="w-7 h-7 overflow-hidden">
                                        <img loading='lazy' src={api_fetchUserImages(user.avatar.icon)} alt="user_avatar" className="object-contain w-full h-full" />
                                    </div>}
                                    <input
                                        type="text"
                                        name="comment"
                                        value={replies.find((reply) => reply.id === index).text}
                                        onChange={(ev) => updateReplies(replies.find((reply) => reply.id === index).id, ev.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full p-1 rounded text-xs placeholder:font-semibold placeholder:text-neutral-700 dark:placeholder:text-neutral-500 text-gray-600 dark:text-neutral-300 outline-none border-2 border-gray-700 dark:border-neutral-600"
                                    />
                                </div>
                                <button className='text-xs text-neutral-700 dark:text-gray-300' onClick={() => clearReply(replies.find((reply) => reply.id === index).id)}>Cancel</button>
                                <button className='text-xs text-neutral-700 dark:text-gray-300' onClick={() => submitReply(replies.find((reply) => reply.id === index).id)}>Reply</button>
                            </div> : null
                        : null
                    }
                </>
            ))}
        </div>
    )
}

export default CommentList