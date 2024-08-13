import { createSlice } from '@reduxjs/toolkit'
import { viewerIP, loginAPI, googleLoginAPI, signUpAPI, tagsAPI, commonImagesAPI, userDetailsAPI, userExploreListAPI, userStoreListAPI, userCartListAPI, addUserCartAPI, updateUserCartAPI, deleteStoreItemAPI, awardListAPI, deleteBookmarkAPI, avatarListAPI, deleteCartItemAPI, editAvatarAPI, locationsListAPI, updateUserDataAPI, searchAPI, updateUserThemeAPI } from '../../utils/api';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const initialState = {
    theme: localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark",
    loader: false,
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
    viewer_id: '',
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
    },
    viewed_user: {
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
        bookmarked: [],
        followers_count: 0,
        explore: [],
        explore_count: 0,
        comment_count: 0,
        store: [],
        store_count: 0,
        seller: false,
        seller_rating: 0
    },
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
        getTags: (state, action) => {
            tagsAPI().then(res => {
                state.tags = res.data;
            }).catch(err => {
                console.log('---error getTags', err);
            })
        },
        switchTheme: (state, action) => {
            const theme = localStorage.getItem("theme");
            const value = theme === "light" ? "dark" : "light";
            state.theme = value;
            localStorage.setItem("theme", value);
        },
        setLoader: (state, action) => {
            state.loader = action.payload;
        },
        setSnackMessage: (state, action) => {
            state.snackmsg = action.payload;
        },
        setAuthError: (state, action) => {
            if (action.payload)
                state.authError = action.payload;
            else
                state.authError = state.authError;
        },
        fetchViewerID: (state, action) => {
            fetchViewerID().then(res => {
                const ipAdr = res.data.ip.replaceAll('.', '');
                state.viewer_id = ipAdr;
            }).catch(err => {
                console.log('---error getViewerIP', err);
            })
        },
        handleUpdateUser: (state, action) => {
            const { userID, userData } = action.payload;
            updateUserDataAPI(userID, userData).then(res => {
                console.log('updated user data', res.data)
            }).catch(err => {
                if (err.response) {
                    const msgData = {
                        open: true,
                        message: err.response.data,
                        type: 'high',
                    }
                    state.snackmsg = msgData;
                }
            })
        },
        handleVerifyUser: (state, action) => {
            const decoded = jwt_decode(action.payload);
            state.isAuthenticated = true;
            state.user = { ...decoded };
        },
        handleHeaderDialogOpen: (state, action) => {
            const { activeDialogName, dialogTitle } = openDialog(action.payload);
            state[`open${activeDialogName}`] = true;
            state.activeDialogName = activeDialogName;
            state.dialogTitle = dialogTitle;
        },
        handleHeaderDialogClose: (state, action) => {
            const activeDialogName = state.activeDialogName;
            state[`open${activeDialogName}`] = false;
            state.activeDialogName = '';
            state.dialogTitle = '';
        },
        handleAuthMsgClose: (state, action) => {
            state.signupSuccess = false;
        },
        setSearchType: (state, action) => {
            state.activeSearch = action.payload
        },
        fetchSearchList: (state, action) => {
            const { type, value } = action.payload;
            searchAPI(type, value).then(res => {
                console.log('---fetch', res);
                const searchList = [...res.data];
                state.activeSearch = type;
                state.searchList = searchList;
            }).catch(err => {
                console.log('---error fetchSearchList', err);
            })
        },
        clearSearchList: (state, action) => {
            state.activeSearch = '';
            state.searchList = [];
        },
        fetchAvatars: (state, action) => {
            avatarListAPI().then(res => {
                console.log('avatarList', res);
                const avatarList = [...res.data];
                state.avatarList = avatarList;
            }).catch(err => {
                console.log('---error fetchAvatars', err);
            });
        },
        fetchAwards: (state, action) => {
            awardListAPI().then(res => {
                console.log('awardList', res);
                const awardList = [...res.data];
                state.awardList = awardList;
            }).catch(err => {
                console.log('---error fetchAwards', err);
            });
        },
        fetchLocations: (state, action) => {
            locationsListAPI().then(res => {
                const locationList = [...res.data];
                state.locationList = locationList;
            }).catch(err => {
                console.log('---error fetchLocations', err);
            })
        },
        handleCommonAssetUpload: (state, action) => {
            try {
                axios({
                    url: 'http://localhost:5000/api/users/assets/new',
                    method: 'POST',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    data: action.payload
                }).then(async res => {
                    console.log('handleUploadAsset Successful!');
                }).catch(err => {
                    console.log('---error handleCommonAssetUpload', err);
                })
            } catch (err) {
                console.log(err);
            }
        },
        handleEditUserAvatar: (state, action) => {
            const { userID, avatar } = action.payload;
            editAvatarAPI(userID, avatar).then(res => {
                console.log('handleEditUserAvatar Successful!');
            }).catch(err => {
                console.log('---error handleEditUserAvatar', err);
            })
        },
        fetchUserExploreList: (state, action) => {
            userExploreListAPI(action.payload).then(res => {
                const artworksItems = [...res.data.artworks];
                state.user = { ...state.user, artworks: artworksItems, artworks_count: res.data.artworks_count }
            }).catch(err => {
                console.log('---error fetchUserExploreList', err);
            })
        },
        fetchUserStoreList: (state, action) => {
            userStoreListAPI(action.payload).then(res => {
                const storeList = [...res.data.store];
                state.user = { ...state.user, store: storeList, store_count: res.data.store_count }
            }).catch(err => {
                console.log('---error fetchUserStoreList', err);
            })
        },
        deleteUserStoreItem: (state, action) => {
            const { storeID, userID } = action.payload;
            deleteStoreItemAPI(storeID, userID).then(res => {
                // dispatch(fetchUserStoreList(userID));
            }).catch(err => {
                console.log('---error deleteUserStoreItem', err);
            })
        },
        handleCartOpen: (state, action) => {
            state.cartOpen = true
        },
        handleCartClose: (state, action) => {
            state.cartOpen = false
        },
        fetchCartlist: (state, action) => {
            const userID = state.common.user.id;
            userCartListAPI(userID).then(res => {
                const cartList = [...res.data.cart];
                let cartTotal = 0;
                cartList.map(cart => {
                    cartTotal = cartTotal + cart.subtotal;
                });
                state.user = { ...state.user, cart: cartList, cart_count: res.data.cart_count };
                state.cartTotal = cartTotal;
            }).catch(err => {
                console.log('---error fetchCartList', err);
            })
        },
        updateCartlist: (state, action) => {
            const { userID, cartID, cartData } = action.payload;
            updateUserCartAPI(userID, cartID, cartData).then(res => {
            }).catch(err => {
                console.log('---error updateUserCartAPI', err);
            })
        },
        addUserCart: (state, action) => {
            const { userID, cartData } = action.payload;
            addUserCartAPI(userID, cartData).then(res => {
            }).catch(err => {
                console.log('---error addUserCartAPI', err);
            })
        },
        deleteCartItem: (state, action) => {
            const { cartID, userID } = action.payload;
            deleteCartItemAPI(cartID, userID).then(res => {
            }).catch(err => {
                if (err.response) {
                    console.log('Signup fail:: ', err.response.status);
                }
            })
        },
        handlePushToCart: (state, action) => {
            state.user = { ...state.user, cart: [...state.user.cart, action.payload] }
        },
        handleRemoveFromCart: (state, action) => {
            state.user = { ...state.user, cart: state.user.cart.filter(item => item !== action.payload) }
        },
        refreshUserDetails: (state, action) => {
            userDetailsAPI(action.payload).then(res => {
                const { token } = res.data;
                if (sessionStorage.jwtToken) {
                    sessionStorage.setItem('jwtToken', token)
                } else if (localStorage.jwtToken) {
                    localStorage.setItem('jwtToken', token)
                }
                setAuthToken(token);
                const userData = jwt_decode(token);
                state.isAuthenticated = true;
                state.user = userData;
            }).catch(err => {
                if (err.response) {
                    const msgData = {
                        open: true,
                        message: err.response.data,
                        type: 'high',
                    }
                    state.snackmsg = msgData;
                }
            })
        },
        loadProfileDetails: (state, action) => {
            userDetailsAPI(action.payload).then(res => {
                const { token } = res.data;
                const loginData = jwt_decode(token);
                state.viewed_user = loginData;
            }).catch(err => {
                if (err.response) {
                    const msgData = {
                        open: true,
                        message: err.response.data,
                        type: 'high',
                    }
                    state.snackmsg = msgData;
                }
            })
        },
        clearProfileDetails: (state, action) => {
            state.viewed_user = initialState.viewed_user;
        },
        handleSignIn: (state, action) => {
            const { stayLoggedIn, userData } = action.payload;
            loginAPI(userData).then(res => {
                const { token } = res.data;
                stayLoggedIn ?
                    localStorage.setItem('jwtToken', token)
                    :
                    sessionStorage.setItem('jwtToken', token)
                setAuthToken(token);
                const loginData = jwt_decode(token);
                state.isAuthenticated = true;
                state.user = loginData;
                const activeDialogName = state.activeDialogName;
                state[`open${activeDialogName}`] = false;
                state.activeDialogName = '';
                state.dialogTitle = '';
            }).catch(err => {
                if (err.response) {
                    const error = {
                        message: err.response.data,
                        login: true,
                        signup: false
                    }
                    state.authError = error;
                }
            })
        },
        handleSignUp: (state, action) => {
            signUpAPI(action.payload).then(res => {
                const { token } = res.data;
                sessionStorage.setItem('jwtToken', token);
                setAuthToken(token);
                const userData = jwt_decode(token);
                state.isAuthenticated = true;
                state.signupSuccess = true;
                state.user = userData;
                const activeDialogName = state.activeDialogName;
                state[`open${activeDialogName}`] = false;
                state.activeDialogName = '';
                state.dialogTitle = '';
            }).catch(err => {
                if (err.response) {
                    const error = {
                        message: err.response.data,
                        login: false,
                        signup: true
                    }
                    state.authError = error;
                }
            })
        },
        handleGoogleAuth: (state, action) => {
            googleLoginAPI().then(res => {
                const data = res.data;
                state.isAuthenticated = true;
                state.user = data;
                const activeDialogName = state.activeDialogName;
                state[`open${activeDialogName}`] = false;
                state.activeDialogName = '';
                state.dialogTitle = '';
            }).catch(err => {
                if (err.message) {
                    const msgData = {
                        open: true,
                        message: err.response.data,
                        type: 'inline'
                    }
                    state.snackmsg = msgData;
                }
            });
        },
        handleSignout: (state, action) => {
            localStorage.hasOwnProperty('jwtToken') ?
                localStorage.removeItem('jwtToken')
                :
                sessionStorage.removeItem('jwtToken')
            setAuthToken(false);
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        handleDeleteBookmark: (state, action) => {
            const { bookmarkID, userID } = action.payload;
            deleteBookmarkAPI(bookmarkID, userID).then(res => {
                state.viewed_user = { ...state.viewed_user, bookmarked: [...res.data] }

            }).catch(err => {
                if (err.response) {
                    const msgData = {
                        open: true,
                        message: err.response.data,
                        type: 'hight',
                    };
                    state.snackmsg = msgData;
                }
            })
        },
    }
})

export const {
    getTags,
    switchTheme,
    setLoader,
    setSnackMessage,
    setAuthError,
    fetchViewerID,
    handleUpdateUser,
    handleVerifyUser,
    handleHeaderDialogOpen,
    handleHeaderDialogClose,
    handleAuthMsgClose,
    setSearchType,
    fetchSearchList,
    clearSearchList,
    fetchAvatars,
    fetchAwards,
    fetchLocations,
    handleCommonAssetUpload,
    handleEditUserAvatar,
    fetchUserExploreList,
    fetchUserStoreList,
    deleteUserStoreItem,
    handleCartOpen,
    handleCartClose,
    fetchCartlist,
    updateCartlist,
    addUserCart,
    deleteCartItem,
    handlePushToCart,
    handleRemoveFromCart,
    refreshUserDetails,
    loadProfileDetails,
    clearProfileDetails,
    handleSignIn,
    handleSignUp,
    handleGoogleAuth,
    handleSignout,
    handleDeleteBookmark
} = commonSlice.actions
export default commonSlice.reducer