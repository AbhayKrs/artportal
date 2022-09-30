export const SWITCH_THEME = 'SWITCH_THEME';
export const SET_SNACKMSG = 'SET_SNACKMSG';
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';
export const SET_LOADER = 'SET_LOADER';
export const GET_TAGS = 'GET_TAGS';
export const GET_VIEWER_IP = 'GET_VIEWER_IP';
export const HANDLE_RESIZE = 'HANDLE_RESIZE';
export const HANDLE_VERIFY_USER = 'HANDLE_VERIFY_USER';
export const HANDLE_HEADER_DIALOG_OPEN = 'HANDLE_HEADER_DIALOG_OPEN';
export const HANDLE_HEADER_DIALOG_CLOSE = 'HANDLE_HEADER_DIALOG_CLOSE';
export const HANDLE_SIGNUPSUCCESS_CLOSE = 'HANDLE_SIGNUPSUCCESS_CLOSE';
export const HANDLE_CART_OPEN = 'HANDLE_CART_OPEN';
export const HANDLE_CART_CLOSE = 'HANDLE_CART_CLOSE';
export const FETCH_USER_EXPLORELIST = 'FETCH_USER_EXPLORELIST';
export const FETCH_USER_STORELIST = 'FETCH_USER_STORELIST';
export const FETCH_CARTLIST = 'FETCH_CARTLIST';
export const PUSH_TO_CART = 'PUSH_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const EDIT_CARTLIST = 'EDIT_CARTLIST';
export const LOAD_PROFILE_DETAILS = 'LOAD_PROFILE_DETAILS';
export const REFRESH_USER_DETAILS = 'REFRESH_USER_DETAILS';
export const HANDLE_SIGNIN = 'HANDLE_SIGNIN';
export const GOOGLE_AUTH = 'GOOGLE_AUTH';
export const HANDLE_SIGNUP = 'HANDLE_SIGNUP';
export const HANDLE_SIGNOUT = 'HANDLE_SIGNOUT';
export const FETCH_COMMON_IMAGES = 'FETCH_COMMON_IMAGES';
export const FETCH_AVATARLIST = 'FETCH_AVATARLIST';
export const FETCH_AWARDLIST = 'FETCH_AWARDLIST';
export const FETCH_LOCATIONS = 'FETCH_LOCATIONS';
export const RESET_BOOKMARK_LIST = 'RESET_BOOKMARK_LIST';

export const initialState = {
    theme: 'dark',
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
    dialogData: '',
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
        joinDate: '',
        tokens: 0,
        google_authenticated: false,
        followers: [],
        bookmarked: [],
        followers_count: 0,
        explore: [],
        explore_count: 0,
        comment_count: 0,
        store: [],
        store_count: 0,
        cart: [],
        cart_count: 0,
        seller: false,
        seller_rating: 0
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
        dialogTitle = 'Sign In';
    } else if (value === 'openRegisterDialog') {
        activeDialogName = 'RegisterDialog';
        dialogTitle = 'Sign Up';
    } else if (value === 'openTokenDialog') {
        activeDialogName = 'TokenDialog';
        dialogTitle = 'Purchase Tokens';
    } else if (value === 'openPurchaseDialog') {
        activeDialogName = 'PurchaseDialog';
    }
    return { activeDialogName, dialogTitle };
}

export const commonReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_TAGS: {
            return { ...state, tags: payload }
        }
        case SWITCH_THEME: {
            return { ...state, theme: payload }
        }
        case SET_LOADER: {
            return { ...state, loader: payload }
        }
        case SET_SNACKMSG: {
            return { ...state, snackmsg: payload };
        }
        case SET_AUTH_ERROR: {
            return { ...state, authError: payload };
        }
        case GET_VIEWER_IP: {
            return { ...state, viewer_id: payload }
        }
        case HANDLE_VERIFY_USER: {
            return { ...state, isAuthenticated: true, user: payload }
        }
        case HANDLE_HEADER_DIALOG_OPEN: {
            if (payload.data) {
                const { activeDialogName, dialogTitle } = openDialog(payload.value);
                return { ...state, [`open${activeDialogName}`]: true, activeDialogName: activeDialogName, dialogTitle: dialogTitle, dialogData: payload.data };
            } else {
                const { activeDialogName, dialogTitle } = openDialog(payload);
                return { ...state, [`open${activeDialogName}`]: true, activeDialogName: activeDialogName, dialogTitle: dialogTitle };
            }
        }
        case HANDLE_HEADER_DIALOG_CLOSE: {
            const activeDialogName = state.activeDialogName;
            return { ...state, [`open${activeDialogName}`]: payload, activeDialogName: '', dialogTitle: '', dialogData: '' };
        }
        case HANDLE_SIGNUPSUCCESS_CLOSE: {
            return { ...state, signupSuccess: payload }
        }
        case FETCH_AVATARLIST: {
            const avatarList = [...payload];
            return { ...state, avatarList }
        }
        case FETCH_AWARDLIST: {
            const awardList = [...payload];
            return { ...state, awardList }
        }
        case FETCH_LOCATIONS: {
            const locationList = [...payload];
            return { ...state, locationList }
        }
        case FETCH_COMMON_IMAGES: {
            return { ...state, loginImage: payload.login, signupImage: payload.signup }
        }
        case FETCH_USER_EXPLORELIST: {
            const exploreList = [...payload.explore];
            return { ...state, user: { ...state.user, explore: exploreList, explore_count: payload.explore_count } }
        }
        case FETCH_USER_STORELIST: {
            const storeList = [...payload.store];
            return { ...state, user: { ...state.user, store: storeList, store_count: payload.store_count } }
        }
        case FETCH_CARTLIST: {
            const cartList = [...payload.cart];
            let cartTotal = 0;
            cartList.map(cart => {
                cartTotal = cartTotal + cart.subtotal;
            })
            return { ...state, user: { ...state.user, cart: cartList, cart_count: payload.cart_count }, cartTotal: cartTotal }
        }
        case PUSH_TO_CART: {
            return {
                ...state, user: { ...state.user, cart: [...state.user.cart, payload] }
            }
        }
        case REFRESH_USER_DETAILS: {
            return { ...state, isAuthenticated: true, user: payload }
        }
        case LOAD_PROFILE_DETAILS: {
            return { ...state, viewed_user: payload }
        }
        case HANDLE_SIGNIN: {
            return { ...state, isAuthenticated: true, user: payload }
        }
        case GOOGLE_AUTH: {
            return { ...state, isAuthenticated: true, user: payload }
        }
        case HANDLE_SIGNUP: {
            return { ...state, isAuthenticated: true, signupSuccess: true, user: payload }
        }
        case HANDLE_SIGNOUT: {
            return { ...state, isAuthenticated: false, user: payload }
        }
        case RESET_BOOKMARK_LIST: {
            return { ...state, viewed_user: { ...state.viewed_user, bookmarked: [...payload] } }
        }
        default:
            return state;
    }
};