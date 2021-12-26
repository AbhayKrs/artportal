import axios from 'axios';
import {
    HANDLE_UPLOAD_ARTWORK
} from '../reducers/upload.reducers';

export const handleUploadArtwork = (artworkData) => async (dispatch, getState) => {
    console.log('handleUploadArtwork invoked', artworkData);
    try {
        await axios({
            url: 'http://localhost:4000/api/artworks/new',
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: artworkData
        }).then(async res => {
            dispatch({ type: HANDLE_UPLOAD_ARTWORK, payload: res.data });
        }).catch(err => {
            if (err.response) {
                console.log('Upload fail:: ', err.response.status);
            }
        })
    } catch (err) {
        console.log(err);
    }
}