import { createSlice } from '@reduxjs/toolkit'
import jwt_decode from 'jwt-decode';

const initialState = {
    accessToken: '',
    id: '',
    name: '',
    username: '',
    email: '',
    avatar: {
        icon: '',
        category: ''
    },
    bio: '',
    created_on: '',
    tokens: 0,
    is_verified: false,
    google_authenticated: false,
    followers: [],
    following: [],
    bookmarks: [],
    followers_count: 0,
    artworks: [],
    artworks_count: 0,
    comments: [],
    comment_count: 0,
    is_seller: false,
    seller_rating: 0,
    store: [],
    store_count: 0,
    cart: [],
    cart_open: false,
    cart_count: 0,
    cart_cost: 0,
    is_premium: false,
    premium_validity: '',
    authSuccess: {
        message: '',
        login: false,
        signup: false,
    },
    authError: {
        message: '',
        login: false,
        signup: false
    },
    new_visitor: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        r_setAuthError: (state, action) => {
            if (action.payload)
                state.authError = action.payload;
            else
                state.authError = state.authError;
        },
        r_setVisitorStatus: (state, action) => {
            state.profile_data = { ...initialState.profile_data, ...action.payload };
        },
        r_verifyUser: (state, action) => {
            const decoded = jwt_decode(action.payload);
            Object.assign(state, decoded);
        },
        r_authMsgClose: (state, action) => {
            state.authSuccess = action.payload;
        },
        r_setUserArtworks: (state, action) => {
            const artworksItems = [...action.payload.artworks];
            state.artworks = artworksItems;
            state.artworks_count = artworksItems.length;
        },
        r_setUserStoreList: (state, action) => {
            const storeList = [...action.payload.store];
            state.store = storeList;
            state.store_count = action.payload.store_count;
        },
        r_handleCartOpen: (state, action) => {
            state.cart_open = true
        },
        r_handleCartClose: (state, action) => {
            state.cart_open = false
        },
        r_setCartList: (state, action) => {
            const cartList = [...action.payload.cart];
            let cart_cost = 0;
            cartList.map(cart => {
                cart_cost = cart_cost + cart.subtotal;
            });
            state.cart = cartList;
            state.cart_count = action.payload.cart_count;
            state.cart_cost = cart_cost;
        },
        r_pushToCart: (state, action) => {
            state.cart = [...state.cart, action.payload]
        },
        r_removeFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item !== action.payload)
        },
        r_setProfileDetails: (state, action) => {
            Object.keys(action.payload).map(key => {
                state[key] = action.payload[key]
            })
        },
        r_clearProfileDetails: (state, action) => {
            state = { ...initialState };
        },
        r_signIn: (state, action) => {
            const { accessToken, user } = action.payload;
            state.authSuccess = {
                message: 'Login successful',
                login: true,
                signup: false
            }
            state.accessToken = accessToken;
            Object.keys(user).map(key => {
                state[key] = user[key]
            })
        },
        r_signUp: (state, action) => {
            state.authSuccess = {
                message: 'Signup successful',
                login: false,
                signup: true
            }
            Object.keys(action.payload).map(key => {
                state[key] = action.payload[key]
            })
        },
        r_clearAuth: (state, action) => {
            state.accessToken = '';
            state = initialState;
        },
        r_handleLogout: (state, action) => {
            state.authSuccess = {
                message: 'Logout successful',
                login: false,
                signup: false
            };
            Object.keys(action.payload).map(key => {
                state[key] = action.payload[key]
            })
        },
        r_deleteBookmark: (state, action) => {
            state.viewed_user = { ...state.viewed_user, bookmarks: [...action.payload] }
        },
    }
})

export const {
    r_setAuthError,
    r_setVisitorStatus,
    r_verifyUser,
    r_authMsgClose,
    r_setUserArtworks,
    r_setUserStoreList,
    r_handleCartOpen,
    r_handleCartClose,
    r_setCartList,
    r_pushToCart,
    r_removeFromCart,
    r_setProfileDetails,
    r_clearProfileDetails,
    r_signIn,
    r_signUp,
    r_clearAuth,
    r_handleLogout,
    r_deleteBookmark
} = userSlice.actions
export default userSlice.reducer