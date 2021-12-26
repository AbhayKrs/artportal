import {
    SET_LOADER,
    SET_ERROR,
    GET_TAGS,
    HANDLE_HEADER_DIALOG_OPEN,
    HANDLE_HEADER_DIALOG_CLOSE,
    HANDLE_CART_OPEN,
    HANDLE_CART_CLOSE,
    HANDLE_VERIFY_USER,
    FETCH_CARTLIST,
    PUSH_TO_CART,
    EDIT_CARTLIST,
    HANDLE_SIGNIN,
    HANDLE_SIGNUP,
    HANDLE_SIGNOUT
} from '../reducers/common.reducers';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../../utils/setAuthToken';

export const setLoader = (loaderData) => (dispatch, getState) => {
    dispatch({ type: SET_LOADER, payload: loaderData })
}

export const setError = (errorData) => (dispatch, getState) => {
    console.log('setError invoked');
    try {
        dispatch({ type: SET_ERROR, payload: errorData })
    } catch (err) {
        console.log('---error setError', err);
    }
}

export const getTags = () => (dispatch, getState) => {
    console.log('getTags invoked');
    try {
        axios({
            url: 'http://localhost:4000/api/users/tags',
            method: 'GET'
        }).then(res => {
            console.log('tags', res.data);
            dispatch({ type: GET_TAGS, payload: res.data });
        }).catch(err => {
            console.log('Error: ', err);
        })
    } catch (err) {
        console.log('---error getTags', err);
    }
}

export const handleVerifyUser = (userData) => (dispatch, getState) => {
    console.log('handleVerifyUser invoked');
    try {
        dispatch({ type: HANDLE_VERIFY_USER, payload: userData });
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

export const handleSignin = (userData) => async (dispatch, getState) => {
    console.log('handleSignin invoked');
    try {
        axios({
            url: 'http://localhost:4000/api/users/login',
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            data: userData
        })
            .then(res => {
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);
                setAuthToken(token);
                const loginData = jwt_decode(token);
                console.log('login token', token, loginData, res.data)
                dispatch({ type: HANDLE_SIGNIN, payload: loginData });
                dispatch({ type: HANDLE_HEADER_DIALOG_CLOSE, payload: false });
            }).catch(err => {
                if (err.response) {
                    console.log('Login fail:: ', err.response.status);
                }
            })
    } catch (err) {
        console.log('---error handleSignin', err);
    }
}

export const handleSignUp = (userData) => async (dispatch, getState) => {
    console.log('handleSignUp invoked', userData);
    try {
        axios({
            url: 'http://localhost:4000/api/users/signup',
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            data: userData
        })
            .then(async res => {
                console.log('res', res.status);
                const data = res.data;
                console.log('res data', data);
                dispatch({ type: HANDLE_SIGNUP, payload: data });
                dispatch({ type: HANDLE_HEADER_DIALOG_CLOSE, payload: false });
            }).catch(err => {
                if (err.response) {
                    console.log('Signup fail:: ', err.response.status);
                }
            })
    } catch (err) {
        console.log('---error handleSignup', err);
    }
}

export const fetchCartList = () => async (dispatch, getState) => {
    console.log('fetchCartList invoked', getState().common);
    try {
        const userID = getState().common.user.id;
        console.log('fetchCartList userID', userID);
        const cartData = await axios.get(`http://localhost:4000/api/users/${userID}/cart`);
        console.log('cartData', cartData.data);
        await dispatch({ type: FETCH_CARTLIST, payload: cartData.data });
    } catch (err) {
        console.log('---error fetchCartList', err);
    }
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
                url: `http://localhost:4000/api/users/${userID}/cart/${cartID}`,
                method: 'PUT',
                data: cartData,
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
                url: `http://localhost:4000/api/users/${userID}/cart/add`,
                method: 'POST',
                data: cartData
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
                url: `http://localhost:4000/api/users/${userID}/cart/${cartID}`,
                method: 'DELETE',
            });
        } else {
            let quantity = userCart.filter(item => item.title === data.title)[0].quantity - 1;
            let subtotal = data.price * quantity;
            cartData = {
                quantity,
                subtotal
            }
            const cartID = userCart.filter(item => item.title === data.title)[0]._id;
            await axios({
                url: `http://localhost:4000/api/users/${userID}/cart/${cartID}`,
                method: 'PUT',
                data: cartData,
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
        localStorage.removeItem('jwtToken');
        setAuthToken(false);
        dispatch({ type: HANDLE_SIGNOUT, payload: {} });
    } catch (err) {
        console.log('---error handleSignOut', err);
    }
}

