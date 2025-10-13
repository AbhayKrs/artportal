import { configureStore } from "@reduxjs/toolkit";

import commonReducer from './reducers/common.reducer';
import usersReducer from './reducers/users.reducer';
import postsReducer from './reducers/posts.reducer';
import artworksReducer from './reducers/artworks.reducer';
import storeReducer from './reducers/store.reducer';
import profileReducer from './reducers/profile.reducer';

const store = configureStore({
    reducer: {
        common: commonReducer,
        user: usersReducer,
        posts: postsReducer,
        artworks: artworksReducer,
        store: storeReducer,
        profile: profileReducer
    }
})

export default store;