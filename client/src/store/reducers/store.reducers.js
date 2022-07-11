export const FETCH_SELLERLIST = 'STORE_FETCH_SELLERLIST';
export const FETCH_STORELIST = 'STORE_FETCH_STORELIST';
export const HANDLE_STORE_UPLOAD = 'STORE_HANDLE_STORE_UPLOAD';
export const FETCH_STOREITEM = 'STORE_FETCH_STOREITEM';
export const HANDLE_STORE_EXIT = 'STORE_HANDLE_STORE_EXIT';
export const HANDLE_CART_OPEN = 'STORE_HANDLE_CART_OPEN';
export const FETCH_CARTLIST = 'STORE_FETCH_CARTLIST';
export const PUSH_TO_CART = 'STORE_PUSH_TO_CART';
export const REMOVE_FROM_CART = 'STORE_REMOVE_FROM_CART';
export const HANDLE_CART_CLOSE = 'STORE_HANDLE_CART_CLOSE';

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
    },
    activeDialog: false
}

export const storeReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case FETCH_SELLERLIST: {
            const sellerList = [...payload];
            return { ...state, sellerList }
        }
        case FETCH_STORELIST: {
            const storeList = [...payload];
            return { ...state, storeList }
        }
        case FETCH_STOREITEM: {
            return { ...state, storeItem: payload }
        }
        case HANDLE_STORE_UPLOAD: {
            return { ...state, file: payload.file, title: payload.title, description: payload.description, uploadStatus: 'success' }
        }
        case HANDLE_STORE_EXIT: {
            return { ...initialState }
        }
        case HANDLE_CART_OPEN: {
            return { ...state, cartOpen: true }
        }
        case FETCH_CARTLIST: {
            const cartList = [...payload];
            return { ...state, cartList }
        }
        case PUSH_TO_CART: {
            return { ...state, cartList: [...state.cartList, payload] }
        }
        case REMOVE_FROM_CART: {
            return { ...state, cartList: state.cartList.filter(item => item !== payload) }
        }
        case HANDLE_CART_CLOSE: {
            return { ...state, cartOpen: false }
        }
        default:
            return state;
    }
};