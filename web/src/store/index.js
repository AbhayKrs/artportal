import { configureStore } from "@reduxjs/toolkit";

import commonReducers from './reducers/common.reducers';
import libraryReducers from './reducers/library.reducers';
import storeReducers from './reducers/store.reducers';

const store = configureStore({
    reducer: {
        common: commonReducers,
        library: libraryReducers,
        store: storeReducers
    }
})

export default store;