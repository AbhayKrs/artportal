import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import {
    a_fetchArtwork,
    a_handleDeleteComment,
    a_handleEditComment,
    a_handleDislikeComment,
    a_handleLikeComment,
    a_bookmarkLibraryItem,
    a_handleAddComment
} from '../store/actions/library.actions';
import { api_userImages } from '../utils/api_routes';
import { IoSend } from 'react-icons/io5';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';

moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: 'secs',
        ss: '%ds',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1mo',
        MM: '%dmo',
        y: '1y',
        yy: '%dy'
    }
});

const CommentList = ({ comments, handleInvalidUser }) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const common = useSelector(state => state.common);
    const user = useSelector(state => state.user);

    const [editForm, setEditForm] = useState(false);
    const [editIndex, setEditIndex] = useState('');
    const [editComment, setEditComment] = useState('');
    const [replies, setReplies] = useState([]);

    const onDeleteComment = async (comment) => {
        await dispatch(a_handleDeleteComment({ libraryItemID: id, commentID: comment._id }));
        dispatch(a_fetchArtwork(id));
    };

    const onEditComment = async (comment) => {
        dispatch(a_handleEditComment({ libraryItemID: id, newComment: editComment, commentID: comment._id }));
        setEditForm(false);
        setTimeout(() => {
            dispatch(a_fetchArtwork(id));
        }, 2000);
    };

    const handleToggleCommentLike = async (status, comment) => {
        if (!status) {
            dispatch(a_handleDislikeComment({ artworkID: id, commentID: comment._id, userID: user.id }));
        } else {
            dispatch(a_handleLikeComment({ artworkID: id, commentID: comment._id, userID: user.id }));
        }
        setTimeout(() => {
            dispatch(a_fetchArtwork(id));
        }, 2000);
    };

    const startReply = (replyId, parentId) => {
        setReplies(prev => {
            if (prev.some(r => r.id === replyId)) return prev;
            return [...prev, { id: replyId, parent: parentId, text: "" }];
        });
    };

    const updateReplies = (id, text) => {
        setReplies(prev => prev.map(r => r.id === id ? { ...r, text } : r));
    };

    const submitReply = (replyId) => {
        const toSubmit = replies.find(r => r.id === replyId);
        if (!toSubmit || !toSubmit.text.trim()) return;

        dispatch(a_handleAddComment({
            isParent: false,
            userID: user.id,
            artworkID: id,
            parentID: toSubmit.parent,
            commentText: toSubmit.text
        }));

        setTimeout(() => {
            dispatch(a_fetchArtwork(id));
            clearReply(replyId);
        }, 2000);
    };

    const clearReply = (replyId) => {
        setReplies(prev => prev.filter(r => r.id !== replyId));
    };

    return (
        <div className="flex flex-col gap-4">
            {comments.map((comment, index) => (
                <div key={comment._id} className="flex flex-col gap-4 text-neutral-700 dark:text-gray-300">
                    <div className='flex flex-col gap-1'>
                        {/* Author + Time */}
                        <div className="flex flex-row items-center gap-1">
                            <div
                                onClick={() => navigate(`/users/${comment.author.id}`)}
                                className="flex gap-1 cursor-pointer items-center"
                            >
                                {comment.author.avatar.icon.length > 0 && (
                                    <div className="w-4 h-4 overflow-hidden">
                                        <img
                                            loading="lazy"
                                            src={api_userImages(comment.author.avatar.icon)}
                                            alt="user_avatar"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                )}
                                <p className="text-xs">{comment.author.username}</p>
                            </div>
                            <p className="text-xs">- {moment(comment.createdAt).fromNow()}</p>
                        </div>

                        {/* Comment text or edit field */}
                        {editForm && index === editIndex ? (
                            <div className="flex bg-gray-300 dark:bg-neutral-700 rounded">
                                <input
                                    type="text"
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            onEditComment(comment);
                                        }
                                    }}
                                    className="w-fit font-bold text-md text-gray-600 dark:text-gray-300 bg-gray-300 dark:bg-neutral-700 border-b-2 border-gray-700 dark:border-gray-300 outline-none"
                                />
                                <IoSend
                                    onClick={() => onEditComment(comment)}
                                    className="h-5 w-5 ml-2 text-gray-600 dark:text-gray-300 cursor-pointer self-center"
                                />
                            </div>
                        ) : (
                            <p className="text-base">{comment.text}</p>
                        )}

                        {/* Like / Dislike / Reply */}
                        <div className="flex flex-row gap-3 items-center text-xs font-semibold">
                            <div className="flex flex-row gap-1 items-center">
                                {comment.likes.includes(user.id) ? (
                                    <AiFillLike className="w-4 h-4 text-gray-200" />
                                ) : (
                                    <button
                                        onClick={() =>
                                            user.is_authenticated
                                                ? handleToggleCommentLike(true, comment)
                                                : handleInvalidUser()
                                        }
                                    >
                                        <AiFillLike className="w-4 h-4 text-neutral-500" />
                                    </button>
                                )}
                                <span>{comment.likes.length}</span>
                            </div>

                            <div className="flex flex-row gap-1 items-center">
                                {comment.dislikes.includes(user.id) ? (
                                    <AiFillDislike className="w-4 h-4 text-gray-200" />
                                ) : (
                                    <button
                                        onClick={() =>
                                            user.is_authenticated
                                                ? handleToggleCommentLike(false, comment)
                                                : handleInvalidUser()
                                        }
                                    >
                                        <AiFillDislike className="w-4 h-4 text-neutral-500" />
                                    </button>
                                )}
                                <span>{comment.dislikes.length}</span>
                            </div>
                            <span className="text-gray-300 dark:text-neutral-500">•</span>
                            <button onClick={() => startReply(index, comment._id)}>
                                Reply
                            </button>
                        </div>

                    </div>

                    {/* Replies */}
                    {comment.replies?.length > 0 && (
                        <div className="pl-4 border-l-2 border-gray-300 dark:border-neutral-700">
                            <CommentList comments={comment.replies} handleInvalidUser={handleInvalidUser} />
                        </div>
                    )}

                    {/* Reply input */}
                    {replies.find(r => r.id === index) && (
                        <div className="flex flex-row gap-2 items-center">
                            {user.avatar.icon.length > 0 && (
                                <div className="w-7 h-7 overflow-hidden">
                                    <img
                                        loading="lazy"
                                        src={api_userImages(user.avatar.icon)}
                                        alt="user_avatar"
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            )}
                            <input
                                type="text"
                                value={replies.find(r => r.id === index).text}
                                onChange={(e) => updateReplies(index, e.target.value)}
                                placeholder="Add a reply..."
                                className="flex-1 p-1 rounded text-xs border-2 border-gray-700 dark:border-neutral-600 text-gray-600 dark:text-neutral-300 outline-none"
                            />
                            <button
                                className="text-xs"
                                onClick={() => clearReply(index)}
                            >
                                Cancel
                            </button>
                            <button
                                className="text-xs"
                                onClick={() => submitReply(index)}
                            >
                                Reply
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CommentList;
