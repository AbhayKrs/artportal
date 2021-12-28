import axios from 'axios';
import {
    FETCH_ARTWORK,
    FETCH_ARTWORKLIST,
    HANDLE_DIALOG_OPEN,
    HANDLE_DIALOG_CLOSE,
} from '../reducers/explore.reducers';

export const handleLikeArtwork = (artworkID) => async (dispatch, getState) => {
    console.log('handleLikesCount', artworkID);
    try {
        const likeCount = await axios({
            url: `http://localhost:4000/api/artworks/${artworkID}/like`,
            method: 'PUT',
            data: { user: getState().common.user }
        });
        console.log('likeCount', likeCount);
    } catch (err) {
        console.log('---error handleLikesCount', err);
    }
}

export const handleDislikeArtwork = (artworkID, likeStatus) => async (dispatch, getState) => {
    console.log('handleDislikeArtwork', likeStatus, artworkID);
    try {
        const dislikeCount = await axios({
            url: `http://localhost:4000/api/artworks/${artworkID}/dislike`,
            method: 'PUT',
            data: { user: getState().common.user }
        });
        console.log('dislikeCount', dislikeCount);
    } catch (err) {
        console.log('---error handleDislikeArtwork', err);
    }
}

export const handleAddComment = (commentText, artworkID) => async (dispatch, getState) => {
    console.log('handleAddComment');
    try {
        const commentData = await axios({
            url: `http://localhost:4000/api/artworks/${artworkID}/comments/new`,
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

export const handleEditComment = (newComment, artworkID, commentID) => async (dispatch, getState) => {
    console.log('handleEditComment', artworkID, commentID);
    try {
        const editStatus = await axios({
            url: `http://localhost:4000/api/artworks/${artworkID}/comments/${commentID}`,
            method: 'PUT',
            data: { content: newComment, user: getState().common.user }
        });
        console.log('editStatus', editStatus);
    } catch (err) {
        console.log('---error handleEditComment', err);
    }
}

export const handleDeleteComment = (artworkID, commentID) => async (dispatch, getState) => {
    console.log('handleDeleteComment', artworkID, commentID);
    try {
        const deleteStatus = await axios({
            url: `http://localhost:4000/api/artworks/${artworkID}/comments/${commentID}`,
            method: 'DELETE',
        });
        console.log('deleteStatus', deleteStatus);
    } catch (err) {
        console.log('---error handleDeleteComement', err);
    }
}

export const fetchArtwork = (artworkID) => async (dispatch, getState) => {
    try {
        const artworkData = await axios.get(`http://localhost:4000/api/artworks/${artworkID}`);
        await dispatch({ type: FETCH_ARTWORK, payload: artworkData.data });
    } catch (err) {
        console.log('---error fetchArtwork', err);
    }
}

export const fetchArtworkList = () => async (dispatch, getState) => {
    console.log('fetchArtworkList invoked');
    try {
        const artworkList = await axios.get('http://localhost:4000/api/artworks');
        console.log('artworkList', artworkList);
        await dispatch({ type: FETCH_ARTWORKLIST, payload: artworkList.data });
    } catch (err) {
        console.log('---error fetchArtworkList', err);
    }
};

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
