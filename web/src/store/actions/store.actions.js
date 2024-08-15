import { createAsyncThunk } from '@reduxjs/toolkit';

import { api_categorizedStoreList, api_sellerList, api_storeItem, api_storeList, api_storeUpload } from '../../utils/api';
import { r_setSellerList, r_setStoreItem, r_setStoreList, r_storeUpload } from '../reducers/store.reducers';

export const a_fetchSellerList = createAsyncThunk("a_fetchSellerList", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_sellerList().then(res => {
        dispatch(r_setSellerList(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchSellerList', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchStoreList = createAsyncThunk("a_fetchStoreList", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_storeList().then(res => {
        dispatch(r_setStoreList(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchStoreList', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchStoreItem = createAsyncThunk("a_fetchStoreItem", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_storeItem(payload).then(res => {
        dispatch(r_setStoreItem(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchStoreItem', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchCategorizedStoreList = createAsyncThunk("a_fetchCategorizedStoreList", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_categorizedStoreList(payload).then(res => {
        dispatch(r_setStoreList(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchCategorizedStoreList', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleStoreUpload = createAsyncThunk("a_handleStoreUpload", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_storeUpload(payload).then(res => {
        dispatch(r_storeUpload(res.data));
        return;
    }).catch(err => {
        console.log('---error a_handleStoreUpload', err);
        return rejectWithValue(err.message);
    })
});