import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { api_tags, api_signIn, api_signUp, api_googleLogin, api_userData, api_updateUserData, api_deleteBookmark, api_userArtworks, api_userStoreListings, api_deleteStoreListing, api_userCart, api_avatars, api_awards, api_locations, api_editAvatar, api_deleteFromCart, api_updateCart, api_addToCart, api_artworks } from '../../utils/api_routes'
import {
    r_setTags,
    r_switchTheme,
    r_setLoader,
    r_setBetaMessage,
    r_setSnackMessage,
    r_setVisitorStatus,
    r_headerDialogOpen,
    r_headerDialogClose,
    r_setSearchType,
    r_setSearchList,
    r_clearSearchList,
    r_setAvatars,
    r_setAwards,
    r_setLocations
} from '../reducers/common.reducers';

import jwt_decode from 'jwt-decode';
import setAuthToken from '../../utils/setAuthToken';

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