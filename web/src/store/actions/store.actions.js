import { } from '../../api';
import { api_categorizedStoreList, api_sellerList, api_storeItem, api_storeList, api_storeUpload } from '../../utils/api';
import { r_setSellerList, r_setStoreItem, r_setStoreList, r_storeUpload } from '../reducers/store.reducers';

export const a_fetchSellerList = () => async (dispatch, getState) => {
    await api_sellerList().then(res => {
        dispatch(r_setSellerList(res.data));
    }).catch(err => {
        console.log('---error a_fetchSellerList', err)
    })
}

export const a_fetchStoreList = () => async (dispatch, getState) => {
    await api_storeList().then(res => {
        dispatch(r_setStoreList(res.data));
    }).catch(err => {
        console.log('---error a_fetchStoreList', err);
    })
};

export const a_fetchStoreItem = (storeID) => async (dispatch, getState) => {
    await api_storeItem(storeID).then(res => {
        dispatch(r_setStoreItem(res.data));
    }).catch(err => {
        console.log('---error a_fetchStoreItem', err);
    })
};

export const a_fetchCategorizedStoreList = (category) => async (dispatch, getState) => {
    await api_categorizedStoreList(category).then(res => {
        dispatch(r_setStoreList(res.data));
    }).catch(err => {
        console.log('---error a_fetchCategorizedStoreList', err);
    })
};

export const a_handleStoreUpload = (storeData) => async (dispatch, getState) => {
    await api_storeUpload(storeData).then(res => {
        dispatch(r_storeUpload(res.data));
    }).catch(err => {
        console.log('---error a_handleStoreUpload', err);
    })
}