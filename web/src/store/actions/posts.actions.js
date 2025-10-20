import { createAsyncThunk } from '@reduxjs/toolkit';

import { api_postComment, api_posts, api_postDelete, api_postDislike, api_postCommentDelete, api_postCommentDislike, api_postCommentEdit, api_post, api_postEdit, api_postCommentLike, api_postUpload, api_postLike, api_postViewed } from '../../utils/api_routes'
import { r_postEdit, r_postUpload } from '../reducers/posts.reducer';
import { r_setPost, r_setPosts } from '../reducers/posts.reducer';
import { a_refreshUserDetails } from './user.actions';

const dynamicSort = (property) => {
    return (a, b) => {
        var result = createAsyncThunk(a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
        return result;
    }
}
const risingSort = (property) => {
    return (a, b) => {
        var result = createAsyncThunk(a[property].toLowerCase() < b[property].toLowerCase())
        return result;
    }
}

export const a_postViewed = createAsyncThunk("a_postViewed", async (payload, { getState, dispatch, rejectWithValue }) => {
    api_postViewed(payload, getState().common.profile_data);
    return;
});

export const a_fetchPosts = createAsyncThunk("a_fetchPosts", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_posts().then(res => {
        dispatch(r_setPosts(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchPosts', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchPost = createAsyncThunk("a_fetchPost", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().user.id;
    await api_post(payload, { _id: userID }).then(res => {
        dispatch(r_setPost(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchPost', err);
        return rejectWithValue(err.message);
    })
});

export const a_handlePostUpload = createAsyncThunk("a_handlePostUpload", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_postUpload(payload).then(res => {
        dispatch(r_postUpload(res.data));
        return;
    }).catch(err => {
        console.log('---error a_handlePostUpload', err);
        return rejectWithValue(err.message);
    })
});

export const a_editPost = createAsyncThunk("a_editPost", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, updatedData } = payload;
    await api_postEdit(artworkID, updatedData).then(res => {
        dispatch(r_postEdit(res.data));
        return;
    }).catch(err => {
        console.log('---error a_editPost', err);
        return rejectWithValue(err.message);
    })
});



export const a_searchPosts = createAsyncThunk("a_searchPosts", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { value, filter, period } = payload;
    await api_posts("search", value, filter, period).then(res => {
        dispatch(r_setPosts(res.data));
        return;
    }).catch(err => {
        console.log('---error a_searchPosts', err);
        return rejectWithValue(err.message);
    })
});

export const a_postVisited = createAsyncThunk("a_postVisited", async (payload, { getState, dispatch, rejectWithValue }) => {
    console.log('page visited');
    return;
});

export const a_deletePost = createAsyncThunk("a_deletePost", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_postDelete(payload).then(res => {
        console.log('deleted Post');
        return;
    }).catch(err => {
        console.log('---error a_deletePost', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleLikePost = createAsyncThunk("a_handleLikePost", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, userID } = payload;

    await api_postLike(artworkID, userID).then(res => {
        console.log('likeCount', res.status);
        return;
    }).catch(err => {
        console.log('---error a_handleLikePost', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDislikePost = createAsyncThunk("a_handleDislikePost", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, userID } = payload;

    await api_postDislike(artworkID, userID).then(res => {
        console.log('likeCount', res.status);
        return;
    }).catch(err => {
        console.log('---error a_handleDislikePost', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleAddComment = createAsyncThunk("a_handleAddComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { isParent, userID, artworkID, parentID, commentText } = payload;
    await api_postComment(isParent, userID, artworkID, parentID, commentText).then(res => {
        console.log('commentData', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleAddComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleEditComment = createAsyncThunk("a_handleEditComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { newComment, artworkID, commentID } = payload;
    await api_postCommentEdit(artworkID, newComment, commentID, getState().user).then(res => {
        console.log('editStatus', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleEditComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDeleteComment = createAsyncThunk("a_handleDeleteComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, commentID } = payload;
    await api_postCommentDelete(artworkID, commentID).then(res => {
        console.log('deleteStatus', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleDeleteComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleLikeComment = createAsyncThunk("a_handleLikeComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, commentID, userID } = payload;
    await api_postCommentLike(artworkID, commentID, userID).then(res => {
        console.log('likeCommentCount', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleLikeComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDislikeComment = createAsyncThunk("a_handleDislikeComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, commentID, userID } = payload;
    await api_postCommentDislike(artworkID, commentID, userID).then(res => {
        console.log('dislikeCommentCount', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleDislikeComment', err);
        return rejectWithValue(err.message);
    })
});