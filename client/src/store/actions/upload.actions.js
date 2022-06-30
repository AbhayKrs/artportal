import axios from 'axios';
import { exploreUploadAPI } from '../../api';
import {
    HANDLE_UPLOAD_EXPLORE
} from '../reducers/upload.reducers';

export const handleUploadExplore = (exploreData) => async (dispatch, getState) => {

    // await axios({
    //     url: 'http://localhost:5000/api/explore/new',
    //     method: 'POST',
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //     data: exploreData
    // }).then(async res => {
    //     dispatch({ type: HANDLE_UPLOAD_EXPLORE, payload: res.data });
    // }).catch(err => {
    //     if (err.response) {
    //         console.log('Upload fail:: ', err.response.status);
    //     }
    // })
    await exploreUploadAPI(exploreData).then(res => {
        dispatch({ type: HANDLE_UPLOAD_EXPLORE, payload: res.data });
    }).catch(err => {
        console.log('---error handleUploadExplore', err);
    })
}