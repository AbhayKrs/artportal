import axios from 'axios';
import { loginAPI, signUpAPI, tagsAPI, commonImagesAPI, userDetailsAPI, userArtworkListAPI, userStoreListAPI, userCartListAPI, deleteStoreItemAPI } from '../../api';
import {
    SET_LOADER,
    SET_ERROR,
    GET_TAGS,
    HANDLE_HEADER_DIALOG_OPEN,
    HANDLE_HEADER_DIALOG_CLOSE,
    HANDLE_CART_OPEN,
    HANDLE_CART_CLOSE,
    HANDLE_VERIFY_USER,
    FETCH_USER_ARTWORKLIST,
    FETCH_USER_STORELIST,
    FETCH_CARTLIST,
    HANDLE_SIGNIN,
    HANDLE_REFRESHTOKEN,
    HANDLE_SIGNUP,
    HANDLE_SIGNOUT,
    FETCH_COMMON_IMAGES,
    FETCH_AVATARLIST,
    FETCH_AWARDLIST
} from '../reducers/common.reducers';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../../utils/setAuthToken';

export const setLoader = (loaderData) => (dispatch) => {
    dispatch({ type: SET_LOADER, payload: loaderData })
}

export const setError = (errorData) => (dispatch) => {
    try {
        dispatch({ type: SET_ERROR, payload: errorData })
    } catch (err) {
        console.log('---error setError', err);
    }
}

export const getTags = () => (dispatch) => {
    tagsAPI().then(res => {
        dispatch({ type: GET_TAGS, payload: res.data });
    }).catch(err => {
        console.log('---error getTags', err);
    })
}

export const fetchCommonImages = () => (dispatch) => {
    commonImagesAPI().then(res => {
        dispatch({ type: FETCH_COMMON_IMAGES, payload: res.data });
    }).catch(err => {
        console.log('---error getTags', err);
    })
}

export const handleVerifyUser = (token) => (dispatch) => {
    try {
        const decoded = jwt_decode(token);
        dispatch({ type: HANDLE_VERIFY_USER, payload: decoded });
    } catch (err) {
        console.log('err', err);
    }
}

export const handleHeaderDialogOpen = (value) => (dispatch, getState) => {
    try {
        if (value === 'openLoginDialog') {
            dispatch({ type: HANDLE_HEADER_DIALOG_OPEN, payload: value });
        } else if (value === 'openRegisterDialog') {
            dispatch({ type: HANDLE_HEADER_DIALOG_OPEN, payload: value });
        } else if (value === 'openTokenDialog') {
            dispatch({ type: HANDLE_HEADER_DIALOG_OPEN, payload: value });
        }
    } catch (err) {
        console.log('error', err)
    }
}
export const handleHeaderDialogClose = () => async (dispatch, getState) => {
    try {
        dispatch({ type: HANDLE_HEADER_DIALOG_CLOSE, payload: false });
    } catch (err) {
        console.log('error', err)
    }
}

export const handleSignin = (stayLoggedIn, userData) => async (dispatch, getState) => {
    await loginAPI(userData).then(res => {
        const { token } = res.data;
        stayLoggedIn ?
            localStorage.setItem('jwtToken', token)
            :
            sessionStorage.setItem('jwtToken', token)
        setAuthToken(token);
        const loginData = jwt_decode(token);
        dispatch({ type: HANDLE_SIGNIN, payload: loginData });
        dispatch({ type: HANDLE_HEADER_DIALOG_CLOSE, payload: false });
    }).catch(err => {
        if (err.response) {
            const error = {
                open: true,
                message: err.response.data,
                severity: 'error',
            }
            dispatch(setError(error))
        }
    })
}

export const handleSignUp = (userData) => async (dispatch, getState) => {
    await signUpAPI(userData).then(res => {
        const data = res.data;
        // console.log('res data', data);
        dispatch({ type: HANDLE_SIGNUP, payload: data });
        dispatch({ type: HANDLE_HEADER_DIALOG_CLOSE, payload: false });
    }).catch(err => {
        if (err.response) {
            const error = {
                open: true,
                message: err.response.data,
                severity: 'error',
            }
            dispatch(setError(error))
        }
    })
    // try {
    //     axios({
    //         url: 'http://localhost:5000/api/users/signup',
    //         method: 'POST',
    //         headers: { "Content-Type": "application/json" },
    //         data: userData
    //     })
    //         .then(async res => {
    //             console.log('res', res.status);
    //             const data = res.data;
    //             console.log('res data', data);
    //             dispatch({ type: HANDLE_SIGNUP, payload: data });
    //             dispatch({ type: HANDLE_HEADER_DIALOG_CLOSE, payload: false });
    //         }).catch(err => {
    //             if (err.response) {
    //                 const error = {
    //                     open: true,
    //                     message: err.response.data,
    //                     severity: 'error',
    //                 }
    //                 dispatch(setError(error))
    //             }
    //         })
    // } catch (err) {
    //     console.log('---error handleSignup', err);
    // }
}

export const getUserDetails = () => async (dispatch, getState) => {
    const userID = getState().common.user.id;
    await userDetailsAPI(userID).then(res => {
        const { token } = res.data;
        if (localStorage.getItem('jwtToken')) {
            localStorage.setItem('jwtToken', token)
        } else if (sessionStorage.getItem('jwtToken')) {
            sessionStorage.setItem('jwtToken', token)
        }
        setAuthToken(token);
        const loginData = jwt_decode(token);
        dispatch({ type: HANDLE_REFRESHTOKEN, payload: loginData });
    }).catch(err => {
        if (err.response) {
            const error = {
                open: true,
                message: err.response.data,
                severity: 'error',
            }
            dispatch(setError(error))
        }
    })
    // try {
    //     axios({
    //         url: `http://localhost:5000/api/users/${userID}`,
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' }
    //     }).then(res => {
    //         const { token } = res.data;
    //         if (localStorage.getItem('jwtToken')) {
    //             localStorage.setItem('jwtToken', token)
    //         } else if (sessionStorage.getItem('jwtToken')) {
    //             sessionStorage.setItem('jwtToken', token)
    //         }
    //         setAuthToken(token);
    //         const loginData = jwt_decode(token);
    //         dispatch({ type: HANDLE_REFRESHTOKEN, payload: loginData });
    //     }).catch(err => {
    //         if (err.response) {
    //             const error = {
    //                 open: true,
    //                 message: err.response.data,
    //                 severity: 'error',
    //             }
    //             dispatch(setError(error))
    //         }
    //     })
    // .then(async (response) => {
    //     if (response.ok) {
    //       const data = await response.json();
    //       setUserContext((oldValues) => {
    //         return { ...oldValues, token: data.token };
    //       });
    //     } else {
    //       setUserContext((oldValues) => {
    //         return { ...oldValues, token: null };
    //       });
    //     }
    //     // call refreshToken every 5 minutes to renew the authentication token.
    //     setTimeout(verifyUser, 5 * 60 * 1000);
    //   });
}

export const fetchUserArtworkList = () => async (dispatch, getState) => {
    const userID = getState().common.user.id;
    await userArtworkListAPI(userID).then(res => {
        dispatch({ type: FETCH_USER_ARTWORKLIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchUserArtworkList', err);
    })
}

export const fetchUserStoreList = () => async (dispatch, getState) => {
    const userID = getState().common.user.id;
    await userStoreListAPI(userID).then(res => {
        dispatch({ type: FETCH_USER_STORELIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchUserStoreList', err);
    })
}

export const deleteUserStoreItem = (storeID) => async (dispatch, getState) => {
    const userID = getState().common.user.id;
    await deleteStoreItemAPI(storeID, userID).then(async res => {
        console.log('res', res.status);
        await dispatch({ type: FETCH_USER_STORELIST, payload: res.data });
    }).catch(err => {
        if (err.response) {
            console.log('Signup fail:: ', err.response.status);
        }
    })
    // try {
    //     const storeStatus = await axios({
    //         url: `http://localhost:5000/api/store/${storeID}`,
    //         method: 'DELETE',
    //         headers: { "Content-Type": "application/json" },
    //         data: { userID: userID }
    //     }).then(async res => {
    //         console.log('res', res.status);
    //         await dispatch({ type: FETCH_USER_STORELIST, payload: res.data });
    //     }).catch(err => {
    //         if (err.response) {
    //             console.log('Signup fail:: ', err.response.status);
    //         }
    //     })
    //     dispatch(fetchUserStoreList());
    // } catch (err) {
    //     console.log('---error deleteUserStoreItem', err);
    // }
}

export const fetchCartList = () => async (dispatch, getState) => {
    const userID = getState().common.user.id;
    await userCartListAPI(userID).then(res => {
        dispatch({ type: FETCH_CARTLIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchCartList', err);
    })
}

export const handleAddToCart = (data) => async (dispatch, getState) => {
    try {
        let cartData;
        const userID = getState().common.user.id;
        const userCart = getState().common.user.cart;
        if (userCart.filter(item => item.title === data.title).length !== 0) {
            console.log('handleAddToCart update');
            let quantity = userCart.filter(item => item.title === data.title)[0].quantity + 1;
            let subtotal = data.price * quantity;
            cartData = {
                quantity,
                subtotal
            }
            const cartID = userCart.filter(item => item.title === data.title)[0]._id;
            await axios({
                url: `http://localhost:5000/api/users/${userID}/cart/${cartID}`,
                method: 'PUT',
                data: cartData
            }).then(async res => {
                console.log('res', res.status);
                await dispatch(fetchCartList());
            }).catch(err => {
                if (err.response) {
                    console.log('Signup fail:: ', err.response.status);
                }
            })
        } else {
            console.log('handleAddToCart add');
            cartData = {
                title: data.title,
                price: data.price,
                quantity: 1,
                subtotal: data.price * 1
            }
            await axios({
                url: `http://localhost:5000/api/users/${userID}/cart/add`,
                method: 'POST',
                data: cartData
            }).then(async res => {
                console.log('res', res.status);
                await dispatch(fetchCartList());
            }).catch(err => {
                if (err.response) {
                    console.log('Signup fail:: ', err.response.status);
                }
            })
        }
    } catch (err) {
        console.log(err);
    }
}

export const handleRemoveFromCart = (data) => async (dispatch, getState) => {
    console.log('handleRemoveFromCart');
    let cartData;
    const userID = getState().common.user.id;
    const userCart = getState().common.user.cart;
    const cartID = userCart.filter(item => item.title === data.title)[0]._id;
    try {
        if (userCart.filter(item => item.title === data.title)[0].quantity === 1) {
            await axios({
                url: `http://localhost:5000/api/users/${userID}/cart/${cartID}`,
                method: 'DELETE',
            }).then(async res => {
                console.log('res', res.status);
                await dispatch(fetchCartList());
            }).catch(err => {
                if (err.response) {
                    console.log('Signup fail:: ', err.response.status);
                }
            })
        } else {
            let quantity = userCart.filter(item => item.title === data.title)[0].quantity - 1;
            let subtotal = data.price * quantity;
            cartData = {
                quantity,
                subtotal
            }
            const cartID = userCart.filter(item => item.title === data.title)[0]._id;
            await axios({
                url: `http://localhost:5000/api/users/${userID}/cart/${cartID}`,
                method: 'PUT',
                data: cartData,
            }).then(async res => {
                console.log('res', res.status);
                await dispatch(fetchCartList());
            }).catch(err => {
                if (err.response) {
                    console.log('Signup fail:: ', err.response.status);
                }
            })
        }
    } catch (err) {
        console.log('---error handleRemoveFromCart', err);
    }
}

export const handleCartOpen = () => async (dispatch, getState) => {
    try {
        dispatch({ type: HANDLE_CART_OPEN });

    } catch (err) {
        console.log(err);
    }
}

export const handleCartClose = () => async (dispatch, getState) => {
    try {
        dispatch({ type: HANDLE_CART_CLOSE })
    } catch (err) {
        console.log(err);
    }
}

export const handleSignOut = () => async (dispatch, getState) => {
    console.log('handleSignOut invoked');
    try {
        localStorage.hasOwnProperty('jwtToken') ?
            localStorage.removeItem('jwtToken')
            :
            sessionStorage.removeItem('jwtToken')
        setAuthToken(false);
        dispatch({ type: HANDLE_SIGNOUT, payload: {} });
    } catch (err) {
        console.log('---error handleSignOut', err);
    }
}

export const fetchAvatars = () => async (dispatch, getState) => {
    console.log('fetchAvatars invoked');
    try {
        const avatarList = await axios.get('http://localhost:5000/api/users/avatars');
        console.log('avatarList', avatarList);
        await dispatch({ type: FETCH_AVATARLIST, payload: avatarList.data });
    } catch (err) {
        console.log('---error fetchAvatars', err);
    }
}

export const fetchAwards = () => async (dispatch, getState) => {
    console.log('fetchAwards invoked');
    try {
        const awardList = await axios.get('http://localhost:5000/api/users/awards');
        console.log('avatarList', awardList);
        await dispatch({ type: FETCH_AWARDLIST, payload: awardList.data });
    } catch (err) {
        console.log('---error fetchAwards', err);
    }
}

export const handleUploadAsset = (assetData) => async (dispatch, getState) => {
    console.log('handleUploadAsset invoked', assetData);
    try {
        await axios({
            url: 'http://localhost:5000/api/users/assets/new',
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: assetData
        }).then(async res => {
            console.log('handleUploadAsset Successful!');
        }).catch(err => {
            if (err.response) {
                console.log('Upload fail:: ', err.response.status);
            }
        })
    } catch (err) {
        console.log(err);
    }
}

export const handleEditUserAvatar = (avatar) => async (dispatch, getState) => {
    const userID = getState().common.user.id;
    console.log('handleEditUserAvatar', avatar);
    try {
        await axios({
            url: `http://localhost:5000/api/users/${userID}/avatar`,
            method: 'POST',
            data: avatar
        }).then(async res => {
            console.log('handleEditUserAvatar Successful!');
        }).catch(err => {
            if (err.response) {
                console.log('Fail:: ', err.response.status);
            }
        })
    } catch (err) {
        console.log(err);
    }
}