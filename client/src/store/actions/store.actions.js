import axios from 'axios';
import {
    FETCH_STORELIST,
    FETCH_STOREITEM,
    HANDLE_STORE_UPLOAD,
    HANDLE_STORE_EXIT,
    FETCH_CARTLIST,
    HANDLE_CART_OPEN,
    HANDLE_CART_CLOSE,
    PUSH_TO_CART
} from '../reducers/store.reducers';

export const fetchStoreList = () => async (dispatch, getState) => {
    console.log('fetchStoreList invoked');
    try {
        const storeList = await axios.get('http://localhost:5000/api/store');
        console.log('storeList', storeList);
        await dispatch({ type: FETCH_STORELIST, payload: storeList.data });
    } catch (err) {
        console.log('---error fetchStoreList', err);
    }
};

export const fetchStoreItem = (itemID) => async (dispatch, getState) => {
    try {
        const storeItem = await axios.get(`http://localhost:5000/api/store/${itemID}`);
        await dispatch({ type: FETCH_STOREITEM, payload: storeItem.data });
    } catch (err) {
        console.log('---error fetchExplore', err);
    }
}

export const handleStoreUpload = (itemData) => async (dispatch, getState) => {
    console.log('handleStoreUpload invoked', itemData);
    try {
        await axios({
            url: 'http://localhost:5000/api/store/new',
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: itemData
        }).then(async res => {
            dispatch({ type: HANDLE_STORE_UPLOAD, payload: res.data });
        }).catch(err => {
            if (err.response) {
                console.log('Upload fail:: ', err.response.status);
            }
        })
    } catch (err) {
        console.log(err);
    }
}

// export const fetchCartList = () => async (dispatch, getState) => {
//     console.log('fetchCartList invoked');
//     try {
//         const cartList = await axios.get('http://localhost:5000/api/cart');
//         console.log('cartList', cartList);
//         await dispatch({ type: FETCH_CARTLIST, payload: cartList.data });
//     } catch (err) {
//         console.log('---error fetchCartList', err);
//     }
// }

// export const handleAddToCart = (data, quantity) => async (dispatch, getState) => {
//     try {
//         let cartData = {
//             explore: data.title,
//             price: data.price,
//             quantity,
//             subtotal: data.price * quantity
//         }
//         console.log('addToCart', cartData);
//         dispatch({ type: PUSH_TO_CART, payload: cartData })
//     } catch (err) {
//         console.log(err);
//     }
// }

// export const handleAddToCart = (data, userID) => async (dispatch, getState) => {
//     console.log('handleAddToCart');
//     try {
//         const cartData = await axios({
//             url: `http://localhost:5000/api/user/${userID}/cart/add`,
//             method: 'POST',
//             data: {
//                 cartItem: data,
//                 user: getState().common.user
//             }
//         })
//         console.log('cartData', cartData);
//     } catch (err) {
//         console.log('---error handleAddToCart', err);
//     }
// }

// export const handleEditCartData = (newCartItem, userID, cartID) => async (dispatch, getState) => {
//     console.log('handleEditCartData', userID, cartID);
//     try {
//         const editStatus = await axios({
//             url: `http://localhost:5000/api/user/${userID}/cart/${cartID}`,
//             method: 'PUT',
//             data: { cartItem: newCartItem, user: getState().common.user }
//         });
//         console.log('editStatus', editStatus);
//     } catch (err) {
//         console.log('---error handleEditCartData', err);
//     }
// }

// export const handleDeleteCartData = (userID, cartID) => async (dispatch, getState) => {
//     console.log('handleDeleteCartData', userID, cartID);
//     try {
//         const deleteStatus = await axios({
//             url: `http://localhost:5000/api/user/${userID}/cart/${cartID}`,
//             method: 'DELETE',
//         });
//         console.log('deleteStatus', deleteStatus);
//     } catch (err) {
//         console.log('---error handleDeleteCartData', err);
//     }
// }

// export const handleCartOpen = () => async (dispatch, getState) => {
//     try {
//         dispatch({ type: HANDLE_CART_OPEN });

//     } catch (err) {
//         console.log(err);
//     }
// }

// export const handleCartClose = () => async (dispatch, getState) => {
//     try {
//         dispatch({ type: HANDLE_CART_CLOSE })
//     } catch (err) {
//         console.log(err);
//     }
// }

export const handleStoreExit = () => async (dispatch, getState) => {
    console.log('handleStoreExit invoked');
    try {
        await dispatch({ type: HANDLE_STORE_EXIT });
    } catch (err) {
        console.log(err);
    }
}