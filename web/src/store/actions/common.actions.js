import { createAsyncThunk } from '@reduxjs/toolkit';

import { api_tags, api_avatars, api_awards, api_locations } from '../../utils/api_routes'
import {
    r_setTags,
    r_setAvatars,
    r_setAwards,
    r_setLocations
} from '../reducers/common.reducers';


export const a_getTags = createAsyncThunk("a_getTags", async (payload, { getState, dispatch, rejectWithValue }) => {
    api_tags().then(res => {
        dispatch(r_setTags(res.data));
        return;
    }).catch(err => {
        console.log('---error a_getTags', err);
        return rejectWithValue(err.message)
    })
});

export const a_fetchAvatars = createAsyncThunk("a_fetchAvatars", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_avatars().then(res => {
        console.log('avatarList', res);
        dispatch(r_setAvatars(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchAvatars', err);
        return rejectWithValue(err.message);
    });
});

export const a_fetchAwards = createAsyncThunk("a_fetchAwards", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_awards().then(res => {
        console.log('awardList', res);
        dispatch(r_setAwards(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchAwards', err);
        return rejectWithValue(err.message);
    });
});

export const a_fetchLocations = createAsyncThunk("a_fetchLocations", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_locations().then(res => {
        dispatch(r_setLocations(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchLocations', err);
        return rejectWithValue(err.message);
    })
});