import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    activeDialog: false,
    main_list: [],
    trending_list: [],
    item: {
        _id: '',
        full_text: '',
        files: [],
        poll: {
            question: '',
            multiple_choice: false,
            options: [],
            total_votes: 0,
            expires_at: ''
        },
        author: {
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
        views: []
    },
    upload: {
        status: '',
        full_text: '',
        files: [],
        poll: {
            question: '',
            multiple_choice: false,
            options: [],
            total_votes: 0,
            expires_at: ''
        },
    }
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        r_setPost: (state, action) => {
            let res = { ...action.payload };
            state.item = res;
        },
        r_setPosts: (state, action) => {
            const posts = [...action.payload];
            state.main_list = posts;
        },
        r_setTrendingPosts: (state, action) => {
            const list = [...action.payload];
            state.trending_list = list;
        },
        r_postUpload: (state, action) => {
            state.upload = {
                status: 'success',
                ...action.payload
            }
        },
        r_postEdit: (state, action) => {
            state.item = { ...action.payload };
        }
    }
});

export const {
    r_setPost,
    r_setPosts,
    r_setTrendingPosts,
    r_postUpload,
    r_postEdit
} = postsSlice.actions
export default postsSlice.reducer