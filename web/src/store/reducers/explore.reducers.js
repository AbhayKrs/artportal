import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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

const exploreSlice = createSlice({
    name: 'explore',
    initialState,
    reducers: {
        r_setExploreItem: (state, action) => {
            state.artwork = { ...action.payload };
        },
        r_setExploreList: (state, action) => {
            const artworks = [...action.payload];
            state.artworks = artworks;
        },
        r_setTrendingList: (state, action) => {
            const list = [...action.payload.sort(() => 0.4 - Math.random()).slice(0, 12)];
            state.trending_artworks = list;

        },
        r_setNewlyAddedList: (state, action) => {
            const list = [...action.payload.sort(() => 0.4 - Math.random()).slice(0, 12)];
            state.new_artworks = list;

        },
        r_setMonthHighlightsList: (state, action) => {
            const list = [...action.payload.sort(() => 0.4 - Math.random()).slice(0, 12)];
            state.highlight_artworks = list;
        },
        r_exploreUpload: (state, action) => {
            const { file, title, description } = action.payload;
            state.uploadData = {
                file: file,
                title: title,
                description: description,
                uploadStatus: 'success'
            }
        },
        r_exploreEdit: (state, action) => {
            state.artwork = { ...action.payload };
        },
        r_dialogOpen: (state, action) => {
            const selectedData = action.payload;
            state.activeDialog = true;
            state.selectedExplore = selectedData
        },
        r_dialogClose: (state, action) => {
            state.activeDialog = false
        },
    }
});

export const {
    r_setExploreItem,
    r_setExploreList,
    r_setTrendingList,
    r_setNewlyAddedList,
    r_setMonthHighlightsList,
    r_exploreUpload,
    r_exploreEdit,
    r_dialogOpen,
    r_dialogClose
} = exploreSlice.actions
export default exploreSlice.reducer