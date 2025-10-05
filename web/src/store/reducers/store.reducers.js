import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    id: null,
    file: '',
    title: '',
    description: '',
    uploadStatus: '',
    seller_list: [],
    products: [],
    product_item: {
        seller: {
            id: '',
            username: '',
            avatar: {
                icon: '',
                category: ''
            }
        },
        images: [],
        _id: '',
        title: '',
        description: '',
        category: '',
        average_rating: 0,
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
            state.seller_list = sellerList;
        },
        r_setProducts: (state, action) => {
            const products = [...action.payload];
            state.products = products;
        },
        r_setProduct: (state, action) => {
            state.product_item = { ...action.payload };
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
    r_setProducts,
    r_setProduct,
    r_storeUpload
} = storeSlice.actions
export default storeSlice.reducer