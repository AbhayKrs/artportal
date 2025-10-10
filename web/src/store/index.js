import { configureStore } from "@reduxjs/toolkit";

import commonReducers from './reducers/common.reducers';
import userReducers from './reducers/user.reducers';
import libraryReducers from './reducers/library.reducers';
import storeReducers from './reducers/store.reducers';
import profileReducers from './reducers/profile.reducers';

const store = configureStore({
    reducer: {
        common: commonReducers,
        user: userReducers,
        library: libraryReducers,
        store: storeReducers,
        profile: profileReducers
    }
})

export default store;