import { configureStore } from "@reduxjs/toolkit";

import commonReducers from './reducers/common.reducers';
import exploreReducers from './reducers/explore.reducers';
import storeReducers from './reducers/store.reducers';

const store = configureStore({
    reducer: {
        common: commonReducers,
        explore: exploreReducers,
        store: storeReducers
    }
})

export default store;