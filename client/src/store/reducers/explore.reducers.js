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
    openExploreDialog: false,
    artworks: [],
    trending_artworks: [],
    new_artworks: [],
    highlight_artworks: [],
    artwork: {
        _id: '',
        title: '',
        description: '',
        files: [],
        categories: [],
        artist: {
            _id: '',
            name: '',
            username: '',
            avatar: {
                icon: '',
                category: ''
            }
        },
        likes: [],
        comments: [],
        tags: [],
        awards: [],
        views: []
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
            return { ...state, artwork: payload }
        }
        case FETCH_EXPLORELIST: {
            const artworks = [...payload];
            return { ...state, artworks }
        }
        case FETCH_EXPLORE_TRENDING: {
            const list = [...payload];
            return { ...state, trending_artworks: list }
        }
        case FETCH_EXPLORE_NEW: {
            const list = [...payload];
            return { ...state, new_artworks: list }
        }
        case FETCH_EXPLORE_MONTHHIGHLIGHTS: {
            const list = [...payload];
            return { ...state, highlight_artworks: list }
        }
        case HANDLE_EXPLORE_UPLOAD: {
            return {
                ...state, uploadData: {
                    file: payload.file, title: payload.title, description: payload.description, uploadStatus: 'success'
                }
            }
        }
        case HANDLE_EXPLORE_EDITED: {
            return { ...state, artwork: payload }
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
