import { createAsyncThunk } from '@reduxjs/toolkit';
import { r_setProfileData } from '../reducers/profile.reducers';
import { api_profileData } from '../../utils/api_routes';

export const a_fetchProfileData = createAsyncThunk("a_fetchProfileData", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_profileData(payload).then(res => {
        dispatch(r_setProfileData(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchProfileData', err);
        return rejectWithValue(err.message);
    })
});