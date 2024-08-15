import { createAsyncThunk } from '@reduxjs/toolkit';

import { api_addExploreItemComment, api_artworkList, api_awardExplore, api_bookmarkExploreItem, api_deleteExploreItem, api_dislikeExplore, api_exploreDeleteComment, api_exploreDislikeComment, api_exploreEditComment, api_exploreItem, api_exploreItemEdit, api_exploreLikeComment, api_exploreUpload, api_filterExploreList, api_likeExplore } from '../../utils/api'
import { a_refreshUserDetails } from './common.actions';
import { r_exploreEdit, r_exploreUpload, r_setExploreItem, r_setExploreList, r_setMonthHighlightsList, r_setNewlyAddedList, r_setTrendingList } from '../reducers/explore.reducers';

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
// function trendingCheck() {
//     var createdAt = new Date(getState().explore.artworks[0].createdAt)
//     console.log('Trending', createdAt.getTime(), Date.now(), Date.now() - createdAt.getTime())
//     // return function (a, b) {

//     //     var result = 
//     // }
// }
// if createdAt-1 is less than createdAt-2 then check if 

export const a_exploreItemViewed = createAsyncThunk("a_exploreItemViewed", async (payload, { getState, dispatch, rejectWithValue }) => {
    api_exploreItem(payload, getState().common.viewer_id);
    return;
});

export const a_fetchExploreItem = createAsyncThunk("a_fetchExploreItem", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().common.user.id;
    await api_exploreItem(payload, { _id: userID }).then(res => {
        dispatch(r_setExploreItem(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchExploreItem', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchExploreList = createAsyncThunk("a_fetchExploreList", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_artworkList().then(res => {
        console.log('---success fetchExploreList', res.data);
        dispatch(r_setExploreList(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchExploreList', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchTrendingList = createAsyncThunk("a_fetchTrendingList", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_artworkList().then(res => {
        dispatch(r_setTrendingList(res.data.sort(() => 0.4 - Math.random()).slice(0, 12)));
        return;
    }).catch(err => {
        console.log('---error a_fetchTrendingList', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchNewlyAddedList = createAsyncThunk("a_fetchNewlyAddedList", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_artworkList().then(res => {
        dispatch(r_setNewlyAddedList(res.data.sort(() => 0.4 - Math.random()).slice(0, 12)));
        return;
    }).catch(err => {
        console.log('---error a_fetchNewlyAddedList', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchMonthHighlightsList = createAsyncThunk("a_fetchMonthHighlightsList", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_artworkList().then(res => {
        dispatch(r_setMonthHighlightsList(res.data.sort(() => 0.4 - Math.random()).slice(0, 12)));
        return;
    }).catch(err => {
        console.log('---error a_fetchMonthHighlightsList', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleExploreUpload = createAsyncThunk("a_handleExploreUpload", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_exploreUpload(payload).then(res => {
        dispatch(r_exploreUpload(res.data));
        return;
    }).catch(err => {
        console.log('---error a_handleExploreUpload', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleExploreEdit = createAsyncThunk("a_handleExploreEdit", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { exploreID, updatedData } = payload;
    await api_exploreItemEdit(exploreID, updatedData).then(res => {
        dispatch(r_exploreEdit(res.data));
        return;
    }).catch(err => {
        console.log('---error a_handleExploreEdit', err);
        return rejectWithValue(err.message);
    })
});

export const a_bookmarkExploreItem = createAsyncThunk("a_bookmarkExploreItem", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { userID, bookmarkData } = payload;
    await api_bookmarkExploreItem(userID, bookmarkData).then(res => {
        if (sessionStorage.jwtToken) {
            dispatch(a_refreshUserDetails(userID));
        } else if (localStorage.jwtToken) {
            dispatch(a_refreshUserDetails(userID));
        }
        console.log('success a_bookmarkExploreItem', res.data);
        return;
    }).catch(err => {
        console.log('---error a_bookmarkExploreItem', err);
        return rejectWithValue(err.message);
    })
});

// export const a_searchExploreList = createAsyncThunk(query, filter, period) , async ({ getState, dispatch, rejectWithValue }) => {
//     if (!filter && !period) {
//         await searchExploreListAPI(query).then(res => {
//             console.log('test search', res.data);
//             dispatch({ type: FETCH_EXPLORELIST, payload: res.data });
//         }).catch(err => {
//             console.log('---error searchExploreList', err);
//         })
//     } else {
//         await searchFilterExploreListAPI(query, filter, period).then(res => {
//             dispatch({ type: FETCH_EXPLORELIST, payload: res.data });
//         }).catch(err => {
//             console.log('---error searchExploreList', err);
//         })
//     }
// }

export const a_filterExploreList = createAsyncThunk("a_filterExploreList", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { filter, period } = payload;
    await api_filterExploreList(filter, period).then(res => {
        dispatch(r_setExploreList(res.data));
        return;
    }).catch(err => {
        console.log('---error a_filterExploreList', err);
        return rejectWithValue(err.message);
    })
});

export const a_exploreVisited = createAsyncThunk("a_exploreVisited", async (payload, { getState, dispatch, rejectWithValue }) => {
    console.log('page visited');
    return;
});

export const a_deleteExploreItem = createAsyncThunk("a_deleteExploreItem", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_deleteExploreItem(payload).then(res => {
        console.log('deleted Explore');
        return;
    }).catch(err => {
        console.log('---error a_deleteExploreItem', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleLikeExplore = createAsyncThunk("a_handleLikeExplore", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_likeExplore(payload, getState().common.user).then(res => {
        console.log('likeCount', res.status);
        return;
    }).catch(err => {
        console.log('---error a_handleLikeExplore', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDislikeExplore = createAsyncThunk("a_handleDislikeExplore", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_dislikeExplore(payload, getState().common.user).then(res => {
        console.log('likeCount', res.status);
        return;
    }).catch(err => {
        console.log('---error a_handleDislikeExplore', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleAwardExplore = createAsyncThunk("a_handleAwardExplore", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { exploreID, userID, award } = payload;
    await api_awardExplore(exploreID, userID, award).then(res => {
        console.log('award', res.status);
        return;
    }).catch(err => {
        console.log('---error a_handleAwardExplore', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleAddComment = createAsyncThunk("a_handleAddComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { commentText, exploreID } = payload;
    await api_addExploreItemComment(exploreID, commentText, getState().common.user).then(res => {
        console.log('commentData', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleAddComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleEditComment = createAsyncThunk("a_handleEditComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { newComment, exploreID, commentID } = payload;
    await api_exploreEditComment(exploreID, newComment, commentID, getState().common.user).then(res => {
        console.log('editStatus', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleEditComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDeleteComment = createAsyncThunk("a_handleDeleteComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { exploreID, commentID } = payload;
    await api_exploreDeleteComment(exploreID, commentID).then(res => {
        console.log('deleteStatus', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleDeleteComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleLikeComment = createAsyncThunk("a_handleLikeComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { exploreID, commentID } = payload;
    await api_exploreLikeComment(exploreID, commentID, getState().common.user).then(res => {
        console.log('likeCommentCount', res.data);
        return;
    }).catch(err => {
        console.log('---error a_handleLikeComment', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDislikeComment = createAsyncThunk("a_handleDislikeComment", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { exploreID, commentID } = payload;
    await api_exploreDislikeComment(exploreID, commentID, getState().common.user).then(res => {
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
            let artworks = getState().explore.artworks;
            dispatch(r_setExploreList(artworks.sort(dynamicSort('createdAt'))));
            break;
        }
        case 'Trending': {
            let artworks = getState().explore.artworks;
            dispatch(r_setExploreList(artworks.sort(dynamicSort('title'))));
            break;
        }
        case 'Rising': {
            let artworks = getState().explore.artworks;
            dispatch(r_setExploreList(artworks.sort(dynamicSort('title'))));
            break;
        }
        default: break;
    }
    return;
});