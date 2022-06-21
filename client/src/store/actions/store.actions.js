import { sellerListAPI, storeListAPI, storeItemAPI, categorizedStoreListAPI, storeUploadAPI } from '../../api';

import {
    FETCH_SELLERLIST,
    FETCH_STORELIST,
    FETCH_STOREITEM,
    HANDLE_STORE_UPLOAD,
    HANDLE_STORE_EXIT,
    FETCH_CARTLIST,
    HANDLE_CART_OPEN,
    HANDLE_CART_CLOSE,
    PUSH_TO_CART
} from '../reducers/store.reducers';

export const fetchSellerList = () => async (dispatch, getState) => {
    await sellerListAPI().then(res => {
        dispatch({ type: FETCH_SELLERLIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchSellersList', err)
    })
}

export const fetchStoreList = () => async (dispatch, getState) => {
    await storeListAPI().then(res => {
        dispatch({ type: FETCH_STORELIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchStoreList', err);
    })
};

export const fetchStoreItem = (storeID) => async (dispatch, getState) => {
    await storeItemAPI(storeID).then(res => {
        dispatch({ type: FETCH_STOREITEM, payload: res.data })
    }).catch(err => {
        console.log('---error fetchStoreItem', err);
    })
};

export const fetchCategorizedStoreList = (category) => async (dispatch, getState) => {
    await categorizedStoreListAPI(category).then(res => {
        dispatch({ type: FETCH_STORELIST, payload: res.data });
    }).catch(err => {
        console.log('---error fetchCategorizedStoreList', err);
    })
};



export const handleStoreUpload = (storeData) => async (dispatch, getState) => {
    await storeUploadAPI(storeData).then(res => {
        dispatch({ type: HANDLE_STORE_UPLOAD, payload: res.data });
    }).catch(err => {
        console.log('---error handleStoreUpload', err);
    })
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