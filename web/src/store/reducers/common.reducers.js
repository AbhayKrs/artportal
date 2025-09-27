import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    theme: localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark",
    loader: false,
    betaMsg: true,
    snackmsg: {
        open: false,
        message: '',
        type: ''
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
    activeSearch: '',
    searchList: [],
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
        }
    }
})

export const {
    r_setTags,
    r_switchTheme,
    r_setLoader,
    r_setBetaMessage,
    r_setSnackMessage,
    r_headerDialogOpen,
    r_headerDialogClose,
    r_setSearchType,
    r_setSearchList,
    r_clearSearchList,
    r_setAvatars,
    r_setAwards,
    r_setLocations
} = commonSlice.actions
export default commonSlice.reducer