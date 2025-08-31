import { createSlice } from '@reduxjs/toolkit'
import jwt_decode from 'jwt-decode';
import setAuthToken from '../../utils/setAuthToken';

const initialState = {
    theme: localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark",
    loader: false,
    betaMsg: true,
    snackmsg: {
        open: false,
        message: '',
        type: ''
    },
    authError: {
        message: '',
        login: false,
        signup: false
    },
    openLoginDialog: false,
    loginImage: '',
    openRegisterDialog: false,
    signupImage: '',
    openTokenDialog: false,
    openPurchaseDialog: false,
    signupSuccess: false,
    tags: [],
    dialogTitle: '',
    activeDialogName: '',
    user: {
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
        google_authenticated: false,
        followers: [],
        bookmarks: [],
        followers_count: 0,
        artworks: [],
        artworks_count: 0,
        comments: [],
        comment_count: 0,
        isSeller: false,
        seller_rating: 0,
        store: [],
        store_count: 0,
        cart: [],
        cart_count: 0,
        premium_validity: ''
    },
    profile_data: {
        id: '',
        name: '',
        username: '',
        email: '',
        avatar: {
            icon: '',
            category: ''
        },
        bio: '',
        followers: [],
        bookmarks: [],
        followers_count: 0,
        artworks: [],
        artworks_count: 0,
        comment_count: 0,
        store: [],
        store_count: 0,
        seller: false,
        seller_rating: 0
    },
    new_visitor: '',
    token: null,
    isAuthenticated: false,
    cartOpen: false,
    cartEmpty: true,
    cartTotal: 0,
    activeSearch: '',
    searchList: [],
    cartList: [],
    avatarList: [],
    awardList: [],
    locationList: []
}

const openDialog = (value) => {
    let activeDialogName = '';
    let dialogTitle = '';
    if (value === 'openLoginDialog') {
        activeDialogName = 'LoginDialog';
        dialogTitle = 'Sign in to artportal';
    } else if (value === 'openRegisterDialog') {
        activeDialogName = 'RegisterDialog';
        dialogTitle = 'Sign up to artportal';
    } else if (value === 'openTokenDialog') {
        activeDialogName = 'TokenDialog';
        dialogTitle = 'Purchase Tokens';
    } else if (value === 'openPurchaseDialog') {
        activeDialogName = 'PurchaseDialog';
    }
    return { activeDialogName, dialogTitle };
}

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        r_setTags: (state, action) => {
            state.tags = action.payload;
        },
        r_switchTheme: (state, action) => {
            const theme = localStorage.getItem("theme");
            const value = theme === "light" ? "dark" : "light";
            state.theme = value;
            localStorage.setItem("theme", value);
        },
        r_setLoader: (state, action) => {
            state.loader = action.payload;
        },
        r_setBetaMessage: (state, action) => {
            state.betaMsg = action.payload;
        },
        r_setSnackMessage: (state, action) => {
            state.snackmsg = action.payload;
        },
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
            state.isAuthenticated = true;
            state.user = { ...state.user, ...decoded };
        },
        r_headerDialogOpen: (state, action) => {
            const { activeDialogName, dialogTitle } = openDialog(action.payload);
            state[`open${activeDialogName}`] = true;
            state.activeDialogName = activeDialogName;
            state.dialogTitle = dialogTitle;
        },
        r_headerDialogClose: (state, action) => {
            const activeDialogName = state.activeDialogName;
            state[`open${activeDialogName}`] = false;
            state.activeDialogName = '';
            state.dialogTitle = '';
        },
        r_authMsgClose: (state, action) => {
            state.signupSuccess = false;
        },
        r_setSearchType: (state, action) => {
            state.activeSearch = action.payload
        },
        r_setSearchList: (state, action) => {
            const { type, list } = action.payload;
            const searchList = [...list];
            state.activeSearch = type;
            state.searchList = searchList;
        },
        r_clearSearchList: (state, action) => {
            state.searchList = [];
        },
        r_setAvatars: (state, action) => {
            const avatarList = [...action.payload];
            state.avatarList = avatarList;
        },
        r_setAwards: (state, action) => {
            const awardList = [...action.payload];
            state.awardList = awardList;
        },
        r_setLocations: (state, action) => {
            const locationList = [...action.payload];
            state.locationList = locationList;
        },
        r_setUserArtworks: (state, action) => {
            const artworksItems = [...action.payload.artworks];
            state.profile_data = { ...state.user, artworks: artworksItems, artworks_count: action.payload.artworks_count }
        },
        r_setUserStoreList: (state, action) => {
            const storeList = [...action.payload.store];
            state.user = { ...state.user, store: storeList, store_count: action.payload.store_count }
        },
        r_handleCartOpen: (state, action) => {
            state.cartOpen = true
        },
        r_handleCartClose: (state, action) => {
            state.cartOpen = false
        },
        r_setCartList: (state, action) => {
            const cartList = [...action.payload.cart];
            let cartTotal = 0;
            cartList.map(cart => {
                cartTotal = cartTotal + cart.subtotal;
            });
            state.user = { ...state.user, cart: cartList, cart_count: action.payload.cart_count };
            state.cartTotal = cartTotal;
        },
        r_pushToCart: (state, action) => {
            state.user = { ...state.user, cart: [...state.user.cart, action.payload] }
        },
        r_removeFromCart: (state, action) => {
            state.user = { ...state.user, cart: state.user.cart.filter(item => item !== action.payload) }
        },
        r_setProfileDetails: (state, action) => {
            state.profile_data = { ...initialState.profile_data, ...action.payload };
        },
        r_clearProfileDetails: (state, action) => {
            state.viewed_user = initialState.viewed_user;
        },
        r_signIn: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        r_signUp: (state, action) => {
            state.isAuthenticated = true;
            state.signupSuccess = true;
            state.user = action.payload;
        },
        r_handleSignout: (state, action) => {
            localStorage.hasOwnProperty('jwtToken') ?
                localStorage.removeItem('jwtToken')
                :
                sessionStorage.removeItem('jwtToken')
            setAuthToken(false);
            state.isAuthenticated = false;
            state.user = action.payload;
        },
        r_deleteBookmark: (state, action) => {
            state.viewed_user = { ...state.viewed_user, bookmarks: [...action.payload] }
        },
    }
})

export const {
    r_setTags,
    r_switchTheme,
    r_setLoader,
    r_setBetaMessage,
    r_setSnackMessage,
    r_setAuthError,
    r_setVisitorStatus,
    r_verifyUser,
    r_headerDialogOpen,
    r_headerDialogClose,
    r_authMsgClose,
    r_setSearchType,
    r_setSearchList,
    r_clearSearchList,
    r_setAvatars,
    r_setAwards,
    r_setLocations,
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
    r_handleSignout,
    r_deleteBookmark
} = commonSlice.actions
export default commonSlice.reducer