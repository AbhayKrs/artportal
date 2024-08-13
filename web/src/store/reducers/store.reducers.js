import { createSlice } from '@reduxjs/toolkit'
import { sellerListAPI, storeListAPI, storeItemAPI, categorizedStoreListAPI, storeUploadAPI } from '../../utils/api';

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
        fetchSellerList: (state, action) => {
            sellerListAPI().then(res => {
                const sellerList = [...res.data];
                state.sellerList = sellerList;
            }).catch(err => {
                console.log('---error fetchSellersList', err)
            })
        },
        fetchStoreList: (state, action) => {
            storeListAPI().then(res => {
                const storeList = [...res.data];
                state.storeList = storeList;
            }).catch(err => {
                console.log('---error fetchStoreList', err);
            })
        },
        fetchStoreItem: (state, action) => {
            storeItemAPI(action.payload).then(res => {
                state.storeItem = res.data
            }).catch(err => {
                console.log('---error fetchStoreItem', err);
            })
        },
        fetchCategorizedStoreList: (state, action) => {
            categorizedStoreListAPI(action.payload).then(res => {
                const storeList = [...res.data];
                state.storeList = storeList;
            }).catch(err => {
                console.log('---error fetchCategorizedStoreList', err);
            })
        },
        handleStoreUpload: (state, action) => {
            storeUploadAPI(action.payload).then(res => {
                state.file = res.data.file;
                state.title = res.data.title;
                state.description = res.data.description;
                state.uploadStatus = 'success'
            }).catch(err => {
                console.log('---error handleStoreUpload', err);
            })
        },
        reset: () => initialState
    }
});

export const {
    fetchSellerList,
    fetchStoreList,
    fetchStoreItem,
    fetchCategorizedStoreList,
    handleStoreUpload
} = storeSlice.actions
export default storeSlice.reducer