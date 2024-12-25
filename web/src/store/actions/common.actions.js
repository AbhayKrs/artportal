import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { api_tags, api_signIn, api_signUp, api_googleLogin, api_userDetails, api_updateUserData, api_deleteBookmark, api_search, api_userExploreList, api_userStoreList, api_deleteStoreItem, api_userCartList, api_avatarList, api_awardList, api_locationsList, api_editAvatar, api_deleteCartItem, api_updateUserCart, api_addUserCart } from '../../utils/api'
import { r_deleteBookmark, r_headerDialogClose, r_headerDialogOpen, r_setAuthError, r_setAvatars, r_setAwards, r_setCartList, r_setLocations, r_setProfileDetails, r_setSearchList, r_setSnackMessage, r_setTags, r_setUserExploreList, r_setUserStoreList, r_setVisitorStatus, r_signIn, r_signUp } from '../reducers/common.reducers';

import jwt_decode from 'jwt-decode';
import setAuthToken from '../../utils/setAuthToken';

export const a_fetchVisitorStatus = createAsyncThunk("a_fetchVisitorStatus", async (payload, { getState, dispatch, rejectWithValue }) => {
    const setCookie = (c_name, value, exdays) => { var exdate = new Date(); exdate.setDate(exdate.getDate() + exdays); var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString()); document.cookie = c_name + "=" + c_value; }
    const getCookie = (c_name) => { var c_value = document.cookie; var c_start = c_value.indexOf(" " + c_name + "="); if (c_start == -1) { c_start = c_value.indexOf(c_name + "="); } if (c_start == -1) { c_value = null; } else { c_start = c_value.indexOf("=", c_start) + 1; var c_end = c_value.indexOf(";", c_start); if (c_end == -1) { c_end = c_value.length; } c_value = unescape(c_value.substring(c_start, c_end)); } return c_value; }

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

export const a_getTags = createAsyncThunk("a_getTags", async (payload, { getState, dispatch, rejectWithValue }) => {
    api_tags().then(res => {
        dispatch(r_setTags(res.data));
        return;
    }).catch(err => {
        console.log('---error a_getTags', err);
        return rejectWithValue(err.message)
    })
});

export const a_handleSignIn = createAsyncThunk("a_handleSignIn", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { stayLoggedIn, userData } = payload;

    await api_signIn(userData).then(res => {
        const { token } = res.data;
        stayLoggedIn ?
            localStorage.setItem('jwtToken', token)
            :
            sessionStorage.setItem('jwtToken', token)
        setAuthToken(token);
        const userData = jwt_decode(token);
        dispatch(r_signIn(userData));
        dispatch(r_headerDialogClose());
        return;
    }).catch(err => {
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
        sessionStorage.setItem('jwtToken', token);
        setAuthToken(token);
        const userData = jwt_decode(token);
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
    await api_userDetails(payload).then(res => {
        const { token } = res.data;
        if (sessionStorage.jwtToken) {
            sessionStorage.setItem('jwtToken', token)
        } else if (localStorage.jwtToken) {
            localStorage.setItem('jwtToken', token)
        }
        setAuthToken(token);
        const userData = jwt_decode(token);
        console.log("test", userData);
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
    await api_userDetails(payload).then(res => {
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

export const a_fetchSearchList = createAsyncThunk("a_fetchSearchList", async (payload, { getState, dispatch, rejectWithValue }) => {
    const { type, value } = payload;

    await api_search(type, value).then(res => {
        console.log('---fetch', res);
        dispatch(r_setSearchList({ type: type, list: res.data }));
        return;
    }).catch(err => {
        console.log('---error a_fetchSearchList', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchUserExploreList = createAsyncThunk("a_fetchUserExploreList", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_userExploreList(payload).then(res => {
        dispatch(r_setUserExploreList(res.data));
        return;
    }).catch(err => {
        console.log('---error fetchUserExploreList', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchUserStoreList = createAsyncThunk("a_fetchUserStoreList", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().common.user.id;
    await api_userStoreList(userID).then(res => {
        dispatch(r_setUserStoreList(res.data));
        return;
    }).catch(err => {
        console.log('---error fetchUserStoreList', err);
        return rejectWithValue(err.message);
    })
});

export const a_deleteUserStoreItem = createAsyncThunk("a_deleteUserStoreItem", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().common.user.id;
    await api_deleteStoreItem(payload, userID).then(async res => {
        await dispatch(a_fetchUserStoreList());
        return;
    }).catch(err => {
        console.log('Signup fail:: ', err);
        return rejectWithValue(err.message);
    })
});

export const a_fetchCartList = createAsyncThunk("a_fetchCartList", async (payload, { getState, dispatch, rejectWithValue }) => {
    const userID = getState().common.user.id;
    await api_userCartList(userID).then(res => {
        dispatch(r_setCartList(res.data));
        return;
    }).catch(err => {
        console.log('---error fetchCartList', err);
        return rejectWithValue(err.message);
    })
});

export const a_handleCartAdd = createAsyncThunk("a_handleCartAdd", async (payload, { getState, dispatch, rejectWithValue }) => {
    try {
        let cartData;
        const userID = getState().common.user.id;
        const userCart = getState().common.user.cart;
        if (userCart.filter(item => item.title === payload.title).length !== 0) {
            let quantity = userCart.filter(item => item.title === payload.title)[0].quantity + 1;
            let subtotal = payload.price * quantity;
            cartData = {
                quantity,
                subtotal
            }
            const cartID = userCart.filter(item => item.title === payload.title)[0]._id;
            await api_updateUserCart(userID, cartID, cartData).then(res => {
                dispatch(a_fetchCartList());
            })
        } else {
            cartData = {
                file: payload.files[0],
                title: payload.title,
                category: payload.category,
                price: payload.price,
                quantity: 1,
                subtotal: payload.price * 1
            }
            await api_addUserCart(userID, cartData).then(res => {
                dispatch(a_fetchCartList());
            })
        }
        return;
    } catch (err) {
        console.log('---error fetchCartList', err);
        return rejectWithValue(err.message);
    }
});

export const a_handleRemoveFromCart = createAsyncThunk("a_handleRemoveFromCart", async (payload, { getState, dispatch, rejectWithValue }) => {
    let cartData;
    const userID = getState().common.user.id;
    const userCart = getState().common.user.cart;
    const cartID = userCart.filter(item => item.title === payload.title)[0]._id;
    try {
        if (userCart.filter(item => item.title === payload.title)[0].quantity === 1) {
            await api_deleteCartItem(cartID, userID).then(res => {
                dispatch(a_fetchCartList());
            })
        } else {
            let quantity = userCart.filter(item => item.title === payload.title)[0].quantity - 1;
            let subtotal = payload.price * quantity;
            cartData = {
                quantity,
                subtotal
            }
            const cartID = userCart.filter(item => item.title === payload.title)[0]._id;
            await api_deleteCartItem(cartID, userID).then(res => {
                dispatch(a_fetchCartList());
            })
        }
        return;
    } catch (err) {
        console.log('---error fetchCartList', err);
        return rejectWithValue(err.message);
    }
});

export const a_fetchAvatars = createAsyncThunk("a_fetchAvatars", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_avatarList().then(res => {
        console.log('avatarList', res);
        dispatch(r_setAvatars(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchAvatars', err);
        return rejectWithValue(err.message);
    });
});

export const a_fetchAwards = createAsyncThunk("a_fetchAwards", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_awardList().then(res => {
        console.log('awardList', res);
        dispatch(r_setAwards(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchAwards', err);
        return rejectWithValue(err.message);
    });
});

export const a_fetchLocations = createAsyncThunk("a_fetchLocations", async (payload, { getState, dispatch, rejectWithValue }) => {
    await api_locationsList().then(res => {
        dispatch(r_setLocations(res.data));
        return;
    }).catch(err => {
        console.log('---error a_fetchLocations', err);
        return rejectWithValue(err.message);
    })
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
    const userID = getState().common.user.id;
    await api_editAvatar(userID, payload).then(res => {
        console.log('a_handleEditUserAvatar Successful!');
        return;
    }).catch(err => {
        console.log('Fail:: ', err);
        return rejectWithValue(err.message);
    })
});