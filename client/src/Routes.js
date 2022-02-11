import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import setAuthToken from './utils/setAuthToken';
import { handleSignOut, handleVerifyUser, fetchUserArtworkList, fetchUserStoreList, fetchCartList, fetchCommonImages } from './store/actions/common.actions';

// import Loader from './components/Loader';
// import ErrorPopup from './components/Error/ErrorPopup';
import Header from './components/Header';
import Footer from './components/Footer';
import Alerts from './components/Alerts';

import Home from './components/Home';
import Explore from './components/Explore';
// import ExploreShow from './components/Explore/ExploreShow';
// import About from './components/Help/About';
// import Dashboard from './components/Dashboard/Dashboard';
// import Profile from './components/Account/Profile';
// import Notification from './components/Notification/Notification';
// import Store from './components/Store/Store';
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
            await props.fetchUserArtworkList();
            await props.fetchUserStoreList();
            await props.fetchCartList();
        } else if (localStorage.jwtToken) {
            const token = localStorage.jwtToken;
            setAuthToken(token);
            await props.handleVerifyUser(token);
            await props.fetchUserArtworkList();
            await props.fetchUserStoreList();
            await props.fetchCartList();
        }
    }, []);

    return (
        <>
            <Header />
            <div className='mt-14'></div>
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/explore' exact element={<Explore />} />
                {/* <Route path='/about' exact component={About} />
                <Route path='/explore/:id' exact component={ExploreShow} />
                <Route path='/dashboard' exact component={Dashboard} />
                <Route path='/notification' exact component={Notification} />
                <Route path='/store' exact component={Store} />
                <Route path='/store/upload' exact component={StoreUpload} />
                <Route path='/store/:id' exact component={StoreShow} />
                <Route path='/upload' exact component={Upload} />
                <Route path='/user/:id' exact component={Profile} />
                <Route path='/privacy' exact component={Privacy} /> */}
            </Routes>
            <Alerts open={false} type='info' />
            <Footer />
        </>
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    handleVerifyUser,
    fetchUserArtworkList,
    fetchUserStoreList,
    fetchCartList,
    handleSignOut,
    fetchCommonImages
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArtystRoutes);
