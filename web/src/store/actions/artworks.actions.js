import { createAsyncThunk } from '@reduxjs/toolkit';

import { api_artworkComment, api_artworks, api_artworkGift, api_bookmarkArtwork, api_artworkDelete, api_artworkDislike, api_artworkCommentDelete, api_artworkCommentDislike, api_artworkCommentEdit, api_artwork, api_artworkEdit, api_artworkCommentLike, api_artworkUpload, api_artworkLike, api_artworkViewed } from '../../utils/api_routes'
import { a_refreshUserDetails } from './user.actions';
import { r_artworkEdit, r_artworkUpload, r_setArtwork, r_setArtworks, r_setFeaturedArtworks, r_setTrendingArtworks } from '../reducers/artworks.reducer';

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

export const a_artworkViewed = createAsyncThunk("a_artworkViewed", async (payload, { getState, dispatch, rejectWithValue }) => {
    api_artworkViewed(payload, getState().common.profile_data);
    return;
});

export const a_fetchArtwork = createAsyncThunk("a_fetchArtwork", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().user.id;
    await api_artwork(payload, { _id: userID }).then(res => {
        dispatch(r_setArtwork(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchArtwork', err);
        return rejectWithValue(err.message);
    })
});

export const a_featuredArtworks = createAsyncThunk("a_featuredArtworks", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_artworks("artist", "jayabhay9").then(res =>
        dispatch(r_setFeaturedArtworks(res.data))
    );
});

export const a_handleArtworkUpload = createAsyncThunk("a_handleArtworkUpload", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_artworkUpload(payload).then(res => {
        dispatch(r_artworkUpload(res.data));
        return;
    }).catch(err => {
        console.log('---error a_handleArtworkUpload', err);
        return rejectWithValue(err.message);
    })
});

export const a_editArtwork = createAsyncThunk("a_editArtwork", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, updatedData } = payload;
    await api_artworkEdit(artworkID, updatedData).then(res => {
        dispatch(r_artworkEdit(res.data));
        return;
    }).catch(err => {
        console.log('---error a_editArtwork', err);
        return rejectWithValue(err.message);
    })
});

export const a_bookmarkArtwork = createAsyncThunk("a_bookmarkArtwork", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { userID, artworkID } = payload;
    await api_bookmarkArtwork(userID, artworkID).then(res => {
        if (sessionStorage.jwtToken) {
            dispatch(a_refreshUserDetails(userID));
        } else if (localStorage.jwtToken) {
            dispatch(a_refreshUserDetails(userID));
        }
        console.log('success a_bookmarkArtwork', res.data);
        return;
    }).catch(err => {
        console.log('---error a_bookmarkArtwork', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchArtworks = createAsyncThunk("a_fetchArtworks", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { filter, period } = payload;
    await api_artworks("list", "", filter, period).then(res => {
        dispatch(r_setArtworks(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchArtworks', err);
        return rejectWithValue(err.message);
    })
});

export const a_searchArtworks = createAsyncThunk("a_searchArtworks", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { value, filter, period } = payload;
    await api_artworks("search", value, filter, period).then(res => {
        dispatch(r_setArtworks(res.data));
        return;
    }).catch(err => {
        console.log('---error a_searchArtworks', err);
        return rejectWithValue(err.message);
    })
});

export const a_artworkVisited = createAsyncThunk("a_artworkVisited", async (payload, { getState, dispatch, rejectWithValue }) => {
    console.log('page visited');
    return;
});

export const a_deleteArtwork = createAsyncThunk("a_deleteArtwork", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_artworkDelete(payload).then(res => {
        console.log('deleted Artwork');
        return;
    }).catch(err => {
        console.log('---error a_deleteArtwork', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleLikeArtwork = createAsyncThunk("a_handleLikeArtwork", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, userID } = payload;

    await api_artworkLike(artworkID, userID).then(res => {
        console.log('likeCount', res.status);
        return;
    }).catch(err => {
        console.log('---error a_handleLikeArtwork', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDislikeArtwork = createAsyncThunk("a_handleDislikeArtwork", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, userID } = payload;

    await api_artworkDislike(artworkID, userID).then(res => {
        console.log('likeCount', res.status);
        return;
    }).catch(err => {
        console.log('---error a_handleDislikeArtwork', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleAwardArtwork = createAsyncThunk("a_handleAwardArtwork", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, userID, award } = payload;
    await api_artworkGift(artworkID, userID, award).then(res => {
        console.log('award', res.status);
        return;
    }).catch(err => {
        console.log('---error a_handleAwardArtwork', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleAddComment = createAsyncThunk("a_handleAddComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { isParent, userID, artworkID, parentID, commentText } = payload;
    await api_artworkComment(isParent, userID, artworkID, parentID, commentText).then(res => {
        console.log('commentData', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleAddComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleEditComment = createAsyncThunk("a_handleEditComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { newComment, artworkID, commentID } = payload;
    await api_artworkCommentEdit(artworkID, newComment, commentID, getState().user).then(res => {
        console.log('editStatus', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleEditComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDeleteComment = createAsyncThunk("a_handleDeleteComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, commentID } = payload;
    await api_artworkCommentDelete(artworkID, commentID).then(res => {
        console.log('deleteStatus', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleDeleteComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleLikeComment = createAsyncThunk("a_handleLikeComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, commentID, userID } = payload;
    await api_artworkCommentLike(artworkID, commentID, userID).then(res => {
        console.log('likeCommentCount', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleLikeComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDislikeComment = createAsyncThunk("a_handleDislikeComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { artworkID, commentID, userID } = payload;
    await api_artworkCommentDislike(artworkID, commentID, userID).then(res => {
        console.log('dislikeCommentCount', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleDislikeComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleTabChange = createAsyncThunk("a_handleTabChange", async (payload, { getState, dispatch, rejectWithValue }) => {
    switch (payload) {
        case 'Latest': {
            let artworks = getState().artwork.artworks;
            dispatch(r_setArtworks(artworks.sort(dynamicSort('createdAt'))));
            break;
        }
        case 'Trending': {
            let artworks = getState().artwork.artworks;
            dispatch(r_setArtworks(artworks.sort(dynamicSort('title'))));
            break;
        }
        case 'Rising': {
            let artworks = getState().artwork.artworks;
            dispatch(r_setArtworks(artworks.sort(dynamicSort('title'))));
            break;
        }
        default: break;
    }
    return;
});