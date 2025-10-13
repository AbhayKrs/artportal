import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

import { api_signIn, api_signUp, api_googleLogin, api_userData, api_updateUserData, api_deleteBookmark, api_userArtworks, api_userStoreListings, api_deleteStoreListing, api_userCart, api_editAvatar, api_removeFromCart, api_addToCart, api_verifyAuth, api_cart } from '../../utils/api_routes'
import {
    r_setAuthError,
    r_setVisitorStatus,
    r_setUserArtworks,
    r_setUserStoreList,
    r_setCartList,
    r_setProfileDetails,
    r_signIn,
    r_signUp,
    r_deleteBookmark,
    r_clearAuth
} from '../reducers/users.reducer';
import {
    r_setSnackMessage,
    r_headerDialogOpen,
    r_headerDialogClose
} from '../reducers/common.reducer';

import jwt_decode from 'jwt-decode';

export const a_fetchVisitorStatus = createAsyncThunk("a_fetchVisitorStatus", async (payload, { getState, dispatch, rejectWithValue }) => {
    const setCookie = (c_name, value, exdays) => { var exdate = new Date(); exdate.setDate(exdate.getDate() + exdays); var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString()); document.cookie = c_name + "=" + c_value; }
    const getCookie = (c_name) => { var c_value = document.cookie; var c_start = c_value.indexOf(" " + c_name + "="); if (c_start === -1) { c_start = c_value.indexOf(c_name + "="); } if (c_start === -1) { c_value = null; } else { c_start = c_value.indexOf("=", c_start) + 1; var c_end = c_value.indexOf(";", c_start); if (c_end === -1) { c_end = c_value.length; } c_value = unescape(c_value.substring(c_start, c_end)); } return c_value; }

    var c = getCookie("visited");
    if (c === "yes") {
        // alert("Welcome back YOU!");
        dispatch(r_setVisitorStatus(false));
    } else {
        // alert("Welcome new visitor!");
        dispatch(r_setVisitorStatus(true));
    }
    setCookie("visited", "yes", 365); // expire in 1 year; or use null to never expire
});

export const a_verifyAuth = createAsyncThunk("a_verifyAuth", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_verifyAuth().then(res => {
        const { token } = res.data;
        const userData = jwt_decode(token);
        dispatch(r_signIn({ accessToken: token, user: userData }));
        dispatch(r_headerDialogClose());
        return;
    }).catch(err => {
        if (err.response) {
            const error = {
                message: err.response.data,
                login: true,
                signup: false
            }
            // dispatch(r_setAuthError(error));
        }
        Cookies.remove('hasSession');
        localStorage.removeItem('hasSession');
        dispatch(r_clearAuth());
        return rejectWithValue(err.message)
    })
});

export const a_handleSignIn = createAsyncThunk("a_handleSignIn", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { userData } = payload;

    await api_signIn(userData).then(res => {
        const { token } = res.data;
        const userData = jwt_decode(token);
        Cookies.set('hasSession', 'true', { expires: 7 }); // readable cookie
        localStorage.setItem('hasSession', 'true');
        dispatch(r_signIn({ accessToken: token, user: userData }));
        dispatch(r_headerDialogClose());
        return;
    }).catch(err => {
        console.log('err', err)
        if (err.response) {
            const error = {
                message: err.response.data,
                login: true,
                signup: false
            }
            dispatch(r_setAuthError(error));
        }
        console.log('---error a_handleSignIn', err);
        return rejectWithValue(err.message)
    })
});

export const a_handleSignUp = createAsyncThunk("a_handleSignUp", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_signUp(payload).then(res => {
        const { token } = res.data;
        const userData = jwt_decode(token);
        Cookies.set('hasSession', 'true', { expires: 7 }); // readable cookie
        localStorage.setItem('hasSession', 'true');
        dispatch(r_signUp(userData));
        dispatch(r_headerDialogClose());
        return;
    }).catch(err => {
        if (err.response) {
            const error = {
                message: err.response.data,
                login: false,
                signup: true
            }
            dispatch(r_setAuthError(error))
        }
        console.log('---error a_handleSignUp', err);
        return rejectWithValue(err.message)
    })
});

export const a_handleGoogleAuth = createAsyncThunk("a_handleGoogleAuth", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_googleLogin().then(res => {
        const userData = res.data;
        Cookies.set('hasSession', 'true', { expires: 7 }); // readable cookie
        localStorage.setItem('hasSession', 'true');
        dispatch(r_signIn(userData));
        dispatch(r_headerDialogOpen());
        return;
    }).catch(err => {
        if (err.message) {
            const msgData = {
                open: true,
                message: err.response.data,
                type: 'inline'
            }
            dispatch(r_setSnackMessage(msgData))
        }
        console.log('---error a_handleSignUp', err);
        return rejectWithValue(err.message);
    })
});

export const a_refreshUserDetails = createAsyncThunk("a_refreshUserDetails", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_userData(payload).then(res => {
        const { token } = res.data;
        const userData = jwt_decode(token);
        Cookies.set('hasSession', 'true', { expires: 7 }); // readable cookie
        localStorage.setItem('hasSession', 'true');
        dispatch(r_signIn(userData));
        return;
    }).catch(err => {
        if (err.response) {
            const msgData = {
                open: true,
                message: err.response.data,
                type: 'high',
            }
            dispatch(r_setSnackMessage(msgData));
        }
        console.log('---error a_handleSignUp', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleFetchUserDetails = createAsyncThunk("a_handleFetchUserDetails", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_userData(payload).then(res => {
        const { token } = res.data;
        const loginData = jwt_decode(token);
        dispatch(r_setProfileDetails(loginData));
        return;
    }).catch(err => {
        if (err.response) {
            const msgData = {
                open: true,
                message: err.response.data,
                type: 'high',
            }
            dispatch(r_setSnackMessage(msgData))
        }
        console.log('---error a_handleSignUp', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleUpdateUser = createAsyncThunk("a_handleUpdateUser", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { userID, userData } = payload;

    await api_updateUserData(userID, userData).then(res => {
        console.log('updated user data', res.data);
        return;
    }).catch(err => {
        if (err.response) {
            const msgData = {
                open: true,
                message: err.response.data,
                type: 'high',
            }
            dispatch(r_setSnackMessage(msgData))
        }
        console.log('---error a_handleSignUp', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleDeleteBookmark = createAsyncThunk("a_handleDeleteBookmark", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { bookmarkID, userID } = payload

    await api_deleteBookmark(bookmarkID, userID).then(res => {
        dispatch(r_deleteBookmark(res.data));
        return;
    }).catch(err => {
        if (err.response) {
            const msgData = {
                open: true,
                message: err.response.data,
                type: 'hight',
            }
            dispatch(r_setSnackMessage(msgData))
        }
        console.log('---error a_handleSignUp', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchUserStoreList = createAsyncThunk("a_fetchUserStoreList", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().user.id;
    await api_userStoreListings(userID).then(res => {
        dispatch(r_setUserStoreList(res.data));
        return;
    }).catch(err => {
        console.log('---error fetchUserStoreList', err);
        return rejectWithValue(err.message);
    })
});

export const a_deleteUserStoreItem = createAsyncThunk("a_deleteUserStoreItem", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().user.id;
    await api_deleteStoreListing(payload, userID).then(async res => {
        await dispatch(a_fetchUserStoreList());
        return;
    }).catch(err => {
        console.log('Signup fail:: ', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchUserCart = createAsyncThunk("a_fetchUserCart", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().user.id;
    await api_cart(userID).then(res => {
        dispatch(r_setCartList(res.data));
        return;
    }).catch(err => {
        console.log('---error fetchCartList', err);
        return rejectWithValue(err.message);
    })
});

export const a_addToCart = createAsyncThunk("a_addToCart", async (payload, { getState, dispatch, rejectWithValue }) => {
    try {
        const userID = getState().user.id;
        const data = {
            productID: payload,
            quantity: 1
        }
        await api_addToCart(userID, data).then(() => {
            dispatch(a_fetchUserCart());
        })
        return;
    } catch (err) {
        console.log('---error fetchCartList', err);
        return rejectWithValue(err.message);
    }
});

export const a_removeFromCart = createAsyncThunk("a_removeFromCart", async (payload, { getState, dispatch, rejectWithValue }) => {
    try {
        const userID = getState().user.id;
        const data = {
            productID: payload,
            quantity: 1
        }
        await api_removeFromCart(userID, data).then(() => {
            dispatch(a_fetchUserCart());
        })
        return;
    } catch (err) {
        console.log('---error fetchCartList', err);
        return rejectWithValue(err.message);
    }
});

export const a_handleUploadAsset = createAsyncThunk("a_handleUploadAsset", async (payload, { getState, dispatch, rejectWithValue }) => {
    try {
        await axios({
            url: 'http://localhost:5000/api/users/assets/new',
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: payload
        }).then(async res => {
            console.log('a_handleUploadAsset Successful!');
        }).catch(err => {
            if (err.response) {
                console.log('Upload fail:: ', err.response.status);
            }
        })
        return;
    } catch (err) {
        console.log(err);
        return rejectWithValue(err.message);
    }
});

export const a_handleEditUserAvatar = createAsyncThunk("a_handleEditUserAvatar", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().user.id;
    await api_editAvatar(userID, payload).then(res => {
        console.log('a_handleEditUserAvatar Successful!');
        return;
    }).catch(err => {
        console.log('Fail:: ', err);
        return rejectWithValue(err.message);
    })
});