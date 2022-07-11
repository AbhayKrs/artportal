import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import setAuthToken from './utils/setAuthToken';
import { setError, setLoader, handleSignOut, handleVerifyUser, getViewerIP, fetchUserExploreList, fetchUserStoreList, fetchCartList, fetchCommonImages } from './store/actions/common.actions';

// import ErrorPopup from './components/Error/ErrorPopup';
import Header from './containers/Header';
import Footer from './containers/Footer';
import Home from './containers/Home';
import Explore from './containers/Explore';
import ExploreSearch from './containers/ExploreSearch';
import Upload from './containers/Upload';
import Show from './containers/Show';
import Store from './containers/Store';
import StoreAll from './containers/StoreAll';
import Profile from './containers/Profile';
import Google from './containers/splash/Google';
import Settings from './containers/Settings';

// import ExploreUpload from './components/ExploreUpload';
import Loader from './components/Loader';
import Snackbar from './components/Snackbar';
// import ExploreShow from './components/Explore/ExploreShow';
// import About from './components/Help/About';
// import Dashboard from './components/Dashboard/Dashboard';
// import Profile from './components/Account/Profile';
// import Notification from './components/Notification/Notification';
// import StoreShow from './components/Store/StoreShow';
// import StoreUpload from './components/Store/StoreUpload';
// import Upload from './components/Explore/Upload';
// import Privacy from './components/Help/Privacy';

import Settings_Gnr from './containers/children/Settings_Gnr';
import Settings_Acc from './containers/children/Settings_Acc';
import Settings_Ntf from './containers/children/Settings_Ntf';
import Settings_Cmt from './containers/children/Settings_Cmt';
import Settings_Bill from './containers/children/Settings_Bill';

const ArtystRoutes = (props) => {
    useEffect(async () => {
        await props.getViewerIP();
        if (sessionStorage.jwtToken) {
            const token = sessionStorage.jwtToken;
            setAuthToken(token);
            await props.handleVerifyUser(token);
            await props.fetchUserExploreList();
            await props.fetchUserStoreList();
            await props.fetchCartList();
        } else if (localStorage.jwtToken) {
            const token = localStorage.jwtToken;
            setAuthToken(token);
            await props.handleVerifyUser(token);
            await props.fetchUserExploreList();
            await props.fetchUserStoreList();
            await props.fetchCartList();
        }
        await props.fetchCommonImages();
    }, []);

    return (
        <div className={props.common.theme}>
            <Header />
            <div className='mt-14'></div>
            <Loader open={props.common.loader} setLoader={props.setLoader} colorTheme={props.common.theme} />
            <Snackbar error={props.common.error} setError={props.setError} />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/google_success' element={<Google header="Success" />} />
                <Route path='/google_failed' element={<Google header="Failed" />} />
                <Route path='/explore' element={<Explore />} ></Route>
                <Route path='/explore/search' element={<ExploreSearch />} />
                <Route path='/explore/:id' element={<Show.ExploreShow />} />
                <Route path='/explore/new' element={<Upload.ExploreUpload />} />
                <Route path='/store' element={<Store />} />
                <Route path='/store/:id' element={<Show.StoreShow />} />
                <Route path='/store/all' element={<StoreAll />} />
                <Route path='/store/new' element={<Upload.StoreUpload />} />
                <Route path='/users/:id' element={<Profile />} />
                <Route path='/settings' element={<Settings />} >
                    <Route index element={<Navigate to='general' />} />
                    <Route path='general' element={<Settings_Gnr />} />
                    <Route path='account' element={<Settings_Acc />} />
                    <Route path='notifications' element={<Settings_Ntf />} />
                    <Route path='community' element={<Settings_Cmt />} />
                    <Route path='billing' element={<Settings_Bill />} />
                </Route>
                {/* <Route path='/about' exact component={About} />
                <Route path='/dashboard' exact component={Dashboard} />
                <Route path='/notification' exact component={Notification} />
                <Route path='/store/upload' exact component={StoreUpload} />
                <Route path='/upload' exact component={Upload} />
                <Route path='/privacy' exact component={Privacy} /> */}
            </Routes>
            <Footer />
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setError,
    setLoader,
    handleVerifyUser,
    getViewerIP,
    fetchUserExploreList,
    fetchUserStoreList,
    fetchCartList,
    handleSignOut,
    fetchCommonImages
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArtystRoutes);
