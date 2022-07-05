export const FETCH_EXPLORE = 'FETCH_EXPLORE';
export const FETCH_EXPLORELIST = 'FETCH_EXPLORELIST';
export const HANDLE_EXPLORE_UPLOAD = 'HANDLE_EXPLORE_UPLOAD';
export const HANDLE_DIALOG_OPEN = 'HANDLE_DIALOG_OPEN';
export const HANDLE_DIALOG_CLOSE = 'HANDLE_DIALOG_CLOSE';
export const HANDLE_TABCHANGE = 'HANDLE_TABCHANGE';

export const initialState = {
    id: null,
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
        awards: [],
        views: [],
    },
    uploadData: {
        file: '',
        title: '',
        description: '',
        uploadStatus: ''
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
        case HANDLE_EXPLORE_UPLOAD: {
            console.log('HANDLE_EXPLORE_UPLOAD', payload);
            return {
                ...state, uploadData: {
                    file: payload.file, title: payload.title, description: payload.description, uploadStatus: 'success'
                }
            }
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
