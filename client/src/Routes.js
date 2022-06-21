import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import setAuthToken from './utils/setAuthToken';
import { setError, handleSignOut, handleVerifyUser, fetchUserExploreList, fetchUserStoreList, fetchCartList, fetchCommonImages } from './store/actions/common.actions';

// import Loader from './components/Loader';
// import ErrorPopup from './components/Error/ErrorPopup';
import Header from './containers/Header';
import Footer from './containers/Footer';
import Alerts from './components/Alerts';
import Home from './containers/Home';
import Explore from './containers/Explore';
import ExploreSearch from './containers/ExploreSearch';
import Upload from './containers/Upload';
import Show from './containers/Show';
import Store from './containers/Store';
import StoreAll from './containers/StoreAll';
import Profile from './containers/Profile';

// import ExploreUpload from './components/ExploreUpload';
import SnackBarError from './components/SnackBarError';
// import ExploreShow from './components/Explore/ExploreShow';
// import About from './components/Help/About';
// import Dashboard from './components/Dashboard/Dashboard';
// import Profile from './components/Account/Profile';
// import Notification from './components/Notification/Notification';
// import StoreShow from './components/Store/StoreShow';
// import StoreUpload from './components/Store/StoreUpload';
// import Upload from './components/Explore/Upload';
// import Privacy from './components/Help/Privacy';

const ArtystRoutes = (props) => {
    useEffect(async () => {
        props.fetchCommonImages();
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
    }, []);

    return (
        <div className={props.common.theme}>
            <Header />
            <div className='mt-14'></div>
            <SnackBarError error={props.common.error} setError={props.setError} />
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/explore' exact element={<Explore />} />
                <Route path='/explore/search' exact element={<ExploreSearch />} />
                <Route path='/explore/:id' exact element={<Show.ExploreShow />} />
                <Route path='/explore/new' exact element={<Upload.ExploreUpload />} />
                <Route path='/store' exact element={<Store />} />
                <Route path='/store/:id' exact element={<Show.StoreShow />} />
                <Route path='/store/all' exact element={<StoreAll />} />
                <Route path='/store/new' exact element={<Upload.StoreUpload />} />
                <Route path='/users/:id' exact element={<Profile />} />
                {/* <Route path='/about' exact component={About} />
                <Route path='/dashboard' exact component={Dashboard} />
                <Route path='/notification' exact component={Notification} />
                <Route path='/store/upload' exact component={StoreUpload} />
                <Route path='/upload' exact component={Upload} />
                <Route path='/privacy' exact component={Privacy} /> */}
            </Routes>
            <Alerts open={false} type='info' />
            <Footer />
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setError,
    handleVerifyUser,
    fetchUserExploreList,
    fetchUserStoreList,
    fetchCartList,
    handleSignOut,
    fetchCommonImages
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArtystRoutes);
