import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: '',
    name: '',
    username: '',
    avatar: {
        icon: '',
        category: ''
    },
    bio: '',
    is_verified: false,
    is_premium: false,
    followers: 0,
    following: 0,
    bookmarks: [],
    posts: [],
    artworks: [],
    comments: []
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        r_setProfileData: (state, action) => {
            Object.keys(action.payload).forEach((key) => {
                state[key] = action.payload[key];
            });
        },
        r_resetProfile: () => initialState
    }
})

export const {
    r_setProfileData,
    r_resetProfile,
} = profileSlice.actions
export default profileSlice.reducer