import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    activeDialog: false,
    main_list: [],
    trending_list: [],
    featured_list: [],
    new_list: [],
    highlight_list: [],
    item: {
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
    upload: {
        file: '',
        title: '',
        description: '',
        status: ''
    }
}

const artworksSlice = createSlice({
    name: 'artworks',
    initialState,
    reducers: {
        r_setArtwork: (state, action) => {
            let res = { ...action.payload };
            const commentMap = new Map();
            res.comments.forEach(com => {
                com.replies = [];
                commentMap.set(com._id, com);
            });

            const grouped = [];
            res.comments.forEach(com => {
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
            res.comments_count = res.comments.length;
            recursiveReplies(grouped);

            res.comments = grouped;
            state.item = res;
        },
        r_setArtworks: (state, action) => {
            const artworks = [...action.payload];
            state.main_list = artworks;
        },
        r_setTrendingArtworks: (state, action) => {
            const list = [...action.payload];
            state.trending_list = list;
        },
        r_setFeaturedArtworks: (state, action) => {
            const list = [...action.payload];
            state.featured_list = list;
        },
        r_setNewArtworks: (state, action) => {
            const list = [...action.payload.sort(() => 0.4 - Math.random()).slice(0, 12)];
            state.new_list = list;

        },
        r_setHighlightedArtworks: (state, action) => {
            const list = [...action.payload.sort(() => 0.4 - Math.random()).slice(0, 12)];
            state.highlight_list = list;
        },
        r_artworkUpload: (state, action) => {
            state.upload = {
                status: 'success',
                ...action.payload
            }
        },
        r_artworkEdit: (state, action) => {
            state.item = { ...action.payload };
        }
    }
});

export const {
    r_setArtwork,
    r_setArtworks,
    r_setTrendingArtworks,
    r_setFeaturedArtworks,
    r_setNewArtworks,
    r_setHighlightedArtworks,
    r_artworkUpload,
    r_artworkEdit
} = artworksSlice.actions
export default artworksSlice.reducer