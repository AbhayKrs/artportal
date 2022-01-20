export const FETCH_ARTWORK = 'FETCH_ARTWORK';
export const FETCH_ARTWORKLIST = 'FETCH_ARTWORKLIST';
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
    openArtworkDialog: false,
    artworkList: [],
    artworkData: {
        author: {
            id: '',
            username: '',
            avatar: {
                icon: '',
                category: ''
            }
        },
        filename: '',
        comments: [],
        _id: '',
        title: '',
        description: '',
        likes: [],
        tags: []
    },
    activeDialog: false
}

export const exploreReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case FETCH_ARTWORK: {
            return { ...state, artworkData: payload }
        }
        case FETCH_ARTWORKLIST: {
            console.log('ARTWORKLIST_REQUEST', payload);
            const artworkList = [...payload];
            return { ...state, artworkList }
        }
        case HANDLE_DIALOG_OPEN: {
            console.log('HANDLE_DIALOG_OPEN', payload);
            const selectedData = payload.data;
            return { ...state, activeDialog: payload.activeDialog, selectedArtwork: selectedData }
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
