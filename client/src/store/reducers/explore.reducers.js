export const FETCH_EXPLORE = 'FETCH_EXPLORE';
export const FETCH_EXPLORELIST = 'FETCH_EXPLORELIST';
export const HANDLE_DIALOG_OPEN = 'HANDLE_DIALOG_OPEN';
export const HANDLE_DIALOG_CLOSE = 'HANDLE_DIALOG_CLOSE';
export const HANDLE_TABCHANGE = 'HANDLE_TABCHANGE';

export const SKETCH_DETAILS_FAIL = 'SKETCH_DETAILS_FAIL';
export const SKETCH_DELETE_REQUEST = 'SKETCH_DELETE_REQUEST';
export const SKETCH_DELETE_SUCCESS = 'SKETCH_DELETE_SUCCESS';
export const SKETCH_DELETE_FAIL = 'SKETCH_DELETE_FAIL';
export const SKETCH_CREATE_REQUEST = 'SKETCH_CREATE_REQUEST';
export const SKETCH_CREATE_SUCCESS = 'SKETCH_CREATE_SUCCESS';
export const SKETCH_CREATE_FAIL = 'SKETCH_CREATE_FAIL';
export const SKETCH_CREATE_RESET = 'SKETCH_CREATE_RESET';
export const SKETCH_UPDATE_REQUEST = 'SKETCH_UPDATE_REQUEST';
export const SKETCH_UPDATE_SUCCESS = 'SKETCH_UPDATE_SUCCESS';
export const SKETCH_UPDATE_FAIL = 'SKETCH_UPDATE_FAIL';
export const SKETCH_UPDATE_RESET = 'SKETCH_UPDATE_RESET';
export const SKETCH_CREATE_REVIEW_REQUEST = 'SKETCH_CREATE_REVIEW_REQUEST';
export const SKETCH_CREATE_REVIEW_SUCCESS = 'SKETCH_CREATE_REVIEW_SUCCESS';
export const SKETCH_CREATE_REVIEW_FAIL = 'SKETCH_CREATE_REVIEW_FAIL';
export const SKETCH_CREATE_REVIEW_RESET = 'SKETCH_CREATE_REVIEW_RESET';

export const initialState = {
    ID: null,
    openExploreDialog: false,
    exploreList: [],
    exploreData: {
        author: {
            id: '',
            username: '',
            avatar: {
                icon: '',
                category: ''
            }
        },
        files: [],
        comments: [],
        _id: '',
        title: '',
        description: '',
        likes: [],
        tags: [],
        awards: []
    },
    activeDialog: false
}

export const exploreReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case FETCH_EXPLORE: {
            return { ...state, exploreData: payload }
        }
        case FETCH_EXPLORELIST: {
            console.log('EXPLORELIST_REQUEST', payload);
            const exploreList = [...payload];
            return { ...state, exploreList }
        }
        case HANDLE_DIALOG_OPEN: {
            console.log('HANDLE_DIALOG_OPEN', payload);
            const selectedData = payload.data;
            return { ...state, activeDialog: payload.activeDialog, selectedExplore: selectedData }
        }
        case HANDLE_DIALOG_CLOSE: {
            console.log('HANDLE_DIALOG_CLOSE', payload);
            return { ...state, activeDialog: payload }
        }
        case HANDLE_TABCHANGE: {
            console.log('hello')
        }
        default:
            return state;
    }
};
