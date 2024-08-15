import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    id: null,
    file: '',
    title: '',
    description: '',
    uploadStatus: '',
    sellerList: [],
    storeList: [],
    storeItem: {
        seller: {
            id: '',
            username: '',
            avatar: {
                icon: '',
                category: ''
            }
        },
        files: [],
        _id: '',
        title: '',
        description: '',
        category: '',
        rating: 0,
        price: 0,
        reviews: [],
    },
    activeDialog: false
}

const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        r_setSellerList: (state, action) => {
            const sellerList = [...action.payload];
            state.sellerList = sellerList;
        },
        r_setStoreList: (state, action) => {
            const storeList = [...action.payload];
            state.storeList = storeList;
        },
        r_setStoreItem: (state, action) => {
            state.storeItem = action.payload;
        },
        r_storeUpload: (state, action) => {
            const { file, title, description } = action.payload;
            state.file = file;
            state.title = title;
            state.description = description;
            state.uploadStatus = 'success'
        },
        handleStoreReset: () => initialState
    }
});

export const {
    r_setSellerList,
    r_setStoreList,
    r_setStoreItem,
    r_storeUpload
} = storeSlice.actions
export default storeSlice.reducer