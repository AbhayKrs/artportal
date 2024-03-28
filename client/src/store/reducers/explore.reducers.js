export const FETCH_EXPLORE = 'FETCH_EXPLORE';
export const FETCH_EXPLORELIST = 'FETCH_EXPLORELIST';
export const HANDLE_EXPLORE_UPLOAD = 'HANDLE_EXPLORE_UPLOAD';
export const HANDLE_EXPLORE_EDITED = 'HANDLE_EXPLORE_EDITED';
export const HANDLE_DIALOG_OPEN = 'HANDLE_DIALOG_OPEN';
export const HANDLE_DIALOG_CLOSE = 'HANDLE_DIALOG_CLOSE';
export const FETCH_EXPLORE_TRENDING = 'FETCH_EXPLORE_TRENDING';
export const FETCH_EXPLORE_NEW = 'FETCH_EXPLORE_NEW';
export const FETCH_EXPLORE_MONTHHIGHLIGHTS = 'FETCH_EXPLORE_MONTHHIGHLIGHTS';

export const initialState = {
    id: null,
    openExploreDialog: false,
    catalogList: [],
    trending_catalogList: [],
    new_catalogList: [],
    monthHighlight_catalogList: [],
    catalogItem: {
        author: {
            id: '',
            name: '',
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
        categories: [],
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
            return { ...state, catalogItem: payload }
        }
        case FETCH_EXPLORELIST: {
            const catalogList = [...payload];
            return { ...state, catalogList }
        }
        case FETCH_EXPLORE_TRENDING: {
            const list = [...payload];
            return { ...state, trending_catalogList: list }
        }
        case FETCH_EXPLORE_NEW: {
            const list = [...payload];
            return { ...state, new_catalogList: list }
        }
        case FETCH_EXPLORE_MONTHHIGHLIGHTS: {
            const list = [...payload];
            return { ...state, monthHighlight_catalogList: list }
        }
        case HANDLE_EXPLORE_UPLOAD: {
            return {
                ...state, uploadData: {
                    file: payload.file, title: payload.title, description: payload.description, uploadStatus: 'success'
                }
            }
        }
        case HANDLE_EXPLORE_EDITED: {
            return { ...state, catalogItem: payload }
        }
        case HANDLE_DIALOG_OPEN: {
            const selectedData = payload.data;
            return { ...state, activeDialog: payload.activeDialog, selectedExplore: selectedData }
        }
        case HANDLE_DIALOG_CLOSE: {
            return { ...state, activeDialog: payload }
        }
        default:
            return state;
    }
};
