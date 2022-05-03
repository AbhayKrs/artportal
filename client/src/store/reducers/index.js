import { combineReducers } from 'redux';

import { exploreReducer } from './explore.reducers';
import { uploadReducer } from './upload.reducers';
import { commonReducer } from './common.reducers';
import { storeReducer } from './store.reducers';

export default combineReducers({
    explore: exploreReducer,
    uploadData: uploadReducer,
    common: commonReducer,
    store: storeReducer
    // exploreList: sketchListReducer,
    // sketchDetails: sketchDetailsReducer,
    // sketchDelete: sketchDeleteReducer,
    // sketchCreate: sketchCreateReducer,
    // sketchUpdate: sketchUpdateReducer,
    // // userLogin: userauthReducer,
    // // userRegister: userRegisterReducer,
    // // userDetails: userDetailsReducer,
    // // userUpdateProfile: userUpdateProfileReducer,
    // // userList: userListReducer,
    // // userDelete: userDeleteReducer,
    // // userUpdate: userUpdateReducer,
});