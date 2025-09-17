import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    openArtworkDialog: false,
    artworks: [],
    trending_artworks: [],
    featured_artworks: [],
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
        dislikes: [],
        comments: [],
        comments_count: 0,
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

const librarySlice = createSlice({
    name: 'library',
    initialState,
    reducers: {
        r_setArtworkItem: (state, action) => {
            let artwork_res = { ...action.payload };
            const commentMap = new Map();
            artwork_res.comments.forEach(com => {
                com.replies = [];
                commentMap.set(com._id, com);
            });

            const grouped = [];
            artwork_res.comments.forEach(com => {
                if (com.is_parent) {
                    grouped.push(com);
                } else {
                    const parent = commentMap.get(com.parent_ref);
                    if (parent) {
                        parent.replies.push(com);
                    }
                }
            });

            const recursiveReplies = (comments) => {
                comments.forEach((com) => {
                    if (com.replies && com.replies.length > 0) {
                        recursiveReplies(com.replies); // Call the function recursively on children
                    }
                });
            };
            artwork_res.comments_count = artwork_res.comments.length;
            recursiveReplies(grouped);

            artwork_res.comments = grouped;
            state.artwork = artwork_res;
        },
        r_setArtworks: (state, action) => {
            const artworks = [...action.payload];
            state.artworks = artworks;
        },
        r_setTrendingList: (state, action) => {
            const list = [...action.payload];
            state.trending_artworks = list;
        },
        r_setFeaturedList: (state, action) => {
            const list = [...action.payload];
            state.featured_artworks = list;
        },
        r_setNewlyAddedList: (state, action) => {
            const list = [...action.payload.sort(() => 0.4 - Math.random()).slice(0, 12)];
            state.new_artworks = list;

        },
        r_setMonthHighlightsList: (state, action) => {
            const list = [...action.payload.sort(() => 0.4 - Math.random()).slice(0, 12)];
            state.highlight_artworks = list;
        },
        r_artworkUpload: (state, action) => {
            const { file, title, description } = action.payload;
            state.uploadData = {
                file: file,
                title: title,
                description: description,
                uploadStatus: 'success'
            }
        },
        r_artworkEdit: (state, action) => {
            state.artwork = { ...action.payload };
        },
        r_dialogOpen: (state, action) => {
            const selectedData = action.payload;
            state.activeDialog = true;
            state.selectedArtwork = selectedData
        },
        r_dialogClose: (state, action) => {
            state.activeDialog = false
        },
    }
});

export const {
    r_setArtworkItem,
    r_setArtworks,
    r_setTrendingList,
    r_setFeaturedList,
    r_setNewlyAddedList,
    r_setMonthHighlightsList,
    r_artworkUpload,
    r_artworkEdit,
    r_dialogOpen,
    r_dialogClose
} = librarySlice.actions
export default librarySlice.reducer