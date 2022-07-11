import { sellerListAPI, storeListAPI, storeItemAPI, categorizedStoreListAPI, storeUploadAPI } from '../../api';

import {
    FETCH_SELLERLIST,
    FETCH_STORELIST,
    FETCH_STOREITEM,
    HANDLE_STORE_UPLOAD,
    HANDLE_STORE_EXIT,
} from '../reducers/store.reducers';

export const fetchSellerList = () => async (dispatch, getState) => {
    await sellerListAPI().then(res => {
        dispatch({ type: FETCH_SELLERLIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchSellersList', err)
    })
}

export const fetchStoreList = () => async (dispatch, getState) => {
    await storeListAPI().then(res => {
        dispatch({ type: FETCH_STORELIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchStoreList', err);
    })
};

export const fetchStoreItem = (storeID) => async (dispatch, getState) => {
    await storeItemAPI(storeID).then(res => {
        dispatch({ type: FETCH_STOREITEM, payload: res.data })
    }).catch(err => {
        console.log('---error fetchStoreItem', err);
    })
};

export const fetchCategorizedStoreList = (category) => async (dispatch, getState) => {
    await categorizedStoreListAPI(category).then(res => {
        dispatch({ type: FETCH_STORELIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchCategorizedStoreList', err);
    })
};



export const handleStoreUpload = (storeData) => async (dispatch, getState) => {
    await storeUploadAPI(storeData).then(res => {
        dispatch({ type: HANDLE_STORE_UPLOAD, payload: res.data });
    }).catch(err => {
        console.log('---error handleStoreUpload', err);
    })
}

export const handleStoreExit = () => async (dispatch, getState) => {
    try {
        await dispatch({ type: HANDLE_STORE_EXIT });
    } catch (err) {
        console.log(err);
    }
}