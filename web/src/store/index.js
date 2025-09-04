import { configureStore } from "@reduxjs/toolkit";

import commonReducers from './reducers/common.reducers';
import userReducers from './reducers/user.reducers';
import libraryReducers from './reducers/library.reducers';
import storeReducers from './reducers/store.reducers';

const store = configureStore({
    reducer: {
        common: commonReducers,
        user: userReducers,
        library: libraryReducers,
        store: storeReducers
    }
})

export default store;