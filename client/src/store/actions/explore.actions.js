import axios from 'axios';
import { exploreItemAPI, exploreListAPI, searchExploreListAPI, filterExploreListAPI, likeExploreAPI, dislikeExploreAPI, awardExploreAPI } from '../../api';
import {
    FETCH_EXPLORE,
    FETCH_EXPLORELIST,
    HANDLE_DIALOG_OPEN,
    HANDLE_DIALOG_CLOSE,
    HANDLE_TABCHANGE,
    initialState
} from '../reducers/explore.reducers';

const dynamicSort = (property) => {
    return (a, b) => {
        var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
        return result;
    }
}

// function trendingCheck() {
//     var createdAt = new Date(getState().explore.exploreList[0].createdAt)
//     console.log('Trending', createdAt.getTime(), Date.now(), Date.now() - createdAt.getTime())
//     // return function (a, b) {

//     //     var result = 
//     // }
// }

// if createdAt-1 is less than createdAt-2 then check if 
const risingSort = (property) => {
    return (a, b) => {
        var result = (a[property].toLowerCase() < b[property].toLowerCase())
        return result;
    }
}

export const clearExploreShow = () => (dispatch, getState) => {
    console.log('clear', initialState.exploreData)
    dispatch({ type: FETCH_EXPLORE, payload: initialState.exploreData })
}

export const fetchExploreItem = (exploreID) => async (dispatch, getState) => {
    await exploreItemAPI(exploreID).then(res => {
        dispatch({ type: FETCH_EXPLORE, payload: res.data })
    }).catch(err => {
        console.log('---error fetchExploreItem', err);
    })
}

export const fetchExploreList = () => async (dispatch, getState) => {
    await exploreListAPI().then(res => {
        dispatch({ type: FETCH_EXPLORELIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchExploreList', err);
    })
};

export const searchExploreList = (query, filter, period) => async (dispatch, getState) => {
    await searchExploreListAPI(query, filter, period).then(res => {
        dispatch({ type: FETCH_EXPLORELIST, payload: res.data });
    }).catch(err => {
        console.log('---error searchExploreList', err);
    })
}

export const filterExploreList = (filter, period) => async (dispatch, getState) => {
    await filterExploreListAPI(filter, period).then(res => {
        dispatch({ type: FETCH_EXPLORELIST, payload: res.data });
    }).catch(err => {
        console.log('---error filterExploreList', err);
    })
}

export const handleDialogOpen = (value) => async (dispatch, getState) => {
    console.log('explore dialog open :: true');
    try {
        dispatch({ type: HANDLE_DIALOG_OPEN, payload: { activeDialog: true, data: value } })
    } catch (err) {
        console.log('---error handleDialogClose', err);
    }
}

export const handleDialogClose = () => async (dispatch, getState) => {
    console.log('explore dialog close :: true');
    try {
        dispatch({ type: HANDLE_DIALOG_CLOSE, payload: false })
    } catch (err) {
        console.log('---error handleDialogClose', err);
    }
}

export const handleLikeExplore = (exploreID) => async (dispatch, getState) => {
    console.log('handleLikesCount', exploreID);
    await likeExploreAPI(exploreID, getState().common.user).then(res => {
        console.log('likeCount', res.status);
    }).catch(err => {
        console.log('---error handleLikesCount', err);
    })
}

export const handleDislikeExplore = (exploreID, likeStatus) => async (dispatch, getState) => {
    console.log('handleDislikeExplore', likeStatus, exploreID);
    await dislikeExploreAPI(exploreID, getState().common.user).then(res => {
        console.log('likeCount', res.status);
    }).catch(err => {
        console.log('---error handleDislikeExplore', err);
    })
}

export const handleAwardExplore = (exploreID, userID, award) => async (dispatch, getState) => {
    console.log('handleAwardExplore', award);
    await awardExploreAPI(exploreID, userID, award).then(res => {
        console.log('award', res.status);
    }).catch(err => {
        console.log('---error handleAwardExplore', err);
    })
}

export const handleAddComment = (commentText, exploreID) => async (dispatch, getState) => {
    console.log('handleAddComment');
    try {
        const commentData = await axios({
            url: `http://localhost:5000/api/explore/${exploreID}/comments/new`,
            method: 'POST',
            data: {
                content: commentText,
                user: getState().common.user
            }
        })
        console.log('commentData', commentData);
    } catch (err) {
        console.log('---error handleAddComment', err);
    }
}

export const handleEditComment = (newComment, exploreID, commentID) => async (dispatch, getState) => {
    console.log('handleEditComment', exploreID, commentID);
    try {
        const editStatus = await axios({
            url: `http://localhost:5000/api/explore/${exploreID}/comments/${commentID}`,
            method: 'PUT',
            data: { content: newComment, user: getState().common.user }
        });
        console.log('editStatus', editStatus);
    } catch (err) {
        console.log('---error handleEditComment', err);
    }
}

export const handleDeleteComment = (exploreID, commentID) => async (dispatch, getState) => {
    console.log('handleDeleteComment', exploreID, commentID);
    try {
        const deleteStatus = await axios({
            url: `http://localhost:5000/api/explore/${exploreID}/comments/${commentID}`,
            method: 'DELETE',
        });
        console.log('deleteStatus', deleteStatus);
    } catch (err) {
        console.log('---error handleDeleteComement', err);
    }
}

export const handleLikeComment = (exploreID, commentID) => async (dispatch, getState) => {
    console.log('handleLikeComment', exploreID, commentID);
    try {
        const likeCommentCount = await axios({
            url: `http://localhost:5000/api/explore/${exploreID}/comments/${commentID}/like`,
            method: 'PUT',
            data: { user: getState().common.user }
        });
        console.log('likeCommentCount', likeCommentCount);
    } catch (err) {
        console.log('---error handleLikeComment', err);
    }
}

export const handleDislikeComment = (exploreID, commentID) => async (dispatch, getState) => {
    console.log('handleDislikeComment', exploreID, commentID);
    try {
        const dislikeCommentCount = await axios({
            url: `http://localhost:5000/api/explore/${exploreID}/comments/${commentID}/dislike`,
            method: 'PUT',
            data: { user: getState().common.user }
        });
        console.log('dislikeCommentCount', dislikeCommentCount);
    } catch (err) {
        console.log('---error handleDislikeComment', err);
    }
}

export const handleTabChange = (selectedTab) => async (dispatch, getState) => {
    console.log('handleTabChange', selectedTab);
    switch (selectedTab) {
        case 'Latest': {
            let exploreList = getState().explore.exploreList;
            await dispatch({ type: FETCH_EXPLORELIST, payload: exploreList.sort(dynamicSort('createdAt')) });
            console.log('exploreList', typeof exploreList[0].createdAt, exploreList.sort(dynamicSort('createdAt'))[0]);
            break;
        }
        case 'Trending': {
            let exploreList = getState().explore.exploreList;

            await dispatch({ type: FETCH_EXPLORELIST, payload: exploreList.sort(dynamicSort('title')) });
            break;
        }
        case 'Rising': {
            let exploreList = getState().explore.exploreList;
            await dispatch({ type: FETCH_EXPLORELIST, payload: exploreList.sort(dynamicSort('title')) });
            console.log('exploreList', typeof exploreList[0].createdAt, exploreList.sort(dynamicSort('title'))[0]);
            break;
        }
        default: break;
    }
    dispatch({ type: HANDLE_TABCHANGE, payload: selectedTab })
}