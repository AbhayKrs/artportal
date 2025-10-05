import { createAsyncThunk } from '@reduxjs/toolkit';

import { api_categorizedStoreListings, api_productItem, api_products, api_productUpload } from '../../utils/api_routes';
import { r_setSellerList, r_setProduct, r_setProducts, r_storeUpload } from '../reducers/store.reducers';

export const a_fetchProducts = createAsyncThunk("a_fetchProducts", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_products().then(res => {
        dispatch(r_setProducts(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchProducts', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchProduct = createAsyncThunk("a_fetchProduct", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_productItem(payload).then(res => {
        console.log("res", res);
        dispatch(r_setProduct(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchProduct', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchCategorizedStoreList = createAsyncThunk("a_fetchCategorizedStoreList", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_categorizedStoreListings(payload).then(res => {
        dispatch(r_setProducts(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchCategorizedStoreList', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleStoreUpload = createAsyncThunk("a_handleStoreUpload", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_productUpload(payload).then(res => {
        dispatch(r_storeUpload(res.data));
        return;
    }).catch(err => {
        console.log('---error a_handleStoreUpload', err);
        return rejectWithValue(err.message);
    })
});