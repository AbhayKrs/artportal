import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import setAuthToken from './utils/setAuthToken';
import { setSnackMessage, setLoader, getTags, handleSignOut, handleVerifyUser, getViewerIP, fetchUserExploreList, fetchUserStoreList, fetchCartList } from './store/actions/common.actions';

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

import General from './containers/children/General';
import Account from './containers/children/Account';
import Notification from './containers/children/Notification';
import Community from './containers/children/Community';
import Billing from './containers/children/Billing';
import About from './containers/children/About';
import TOS from './containers/children/TOS';
import Privacy from './containers/children/Privacy';

import Edit from './containers/Edit';
import Cart from './containers/Cart';
import Notifications from './containers/Notifications';

const usePageViews = () => {
    let location = useLocation();
    useEffect(() => {
        if (!window.GA_INITIALIZED) {
            ReactGA.initialize('UA-180342030-1');
            window.GA_INITIALIZED = true;
        }
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    }, [location])
}

const PageRoutes = (props) => {
    const [betaMsg, setBetaMsg] = useState(true);

    usePageViews();
    useEffect(async () => {
        if (localStorage.getItem('theme') === null) {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
            if (systemTheme) {
                localStorage.setItem('theme', "dark");
            } else {
                localStorage.setItem('theme', "light");
            }
        }

        console.log(localStorage.getItem('theme'))

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
        // await props.getTags();
    }, []);

    return (
        <main className={props.common.theme}>
            <Header betaMsg={betaMsg} setBetaMsg={setBetaMsg} />
            <div className={`h-screen flex flex-col bg-gray-200 dark:bg-darkBg ${betaMsg === true ? 'pt-[5.5rem]' : 'pt-[3.75rem]'}`}>
                <Loader open={props.common.loader} setLoader={props.setLoader} colorTheme={props.common.theme} />
                <Snackbar msgdata={props.common.snackmsg} setMessage={props.setSnackMessage} />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/google_success' element={<Google header="Success" />} />
                    <Route path='/google_failed' element={<Google header="Failed" />} />
                    <Route path='/explore' element={<Explore />} ></Route>
                    <Route path='/explore/search' element={<ExploreSearch />} />
                    <Route path='/explore/:id' element={<Show.ExploreShow />} />
                    <Route path='/explore/new' element={<Upload.ExploreUpload />} />
                    <Route path='/explore/:id/edit' element={<Edit.ExploreEdit />} />
                    <Route path='/store' element={<Store />} />
                    <Route path='/store/:id' element={<Show.StoreShow />} />
                    <Route path='/store/all' element={<StoreAll />} />
                    <Route path='/store/new' element={<Upload.StoreUpload />} />
                    <Route path='/store/cart' element={<Cart />} />
                    <Route path='/users/:id' element={<Profile />} />
                    <Route path='/settings' element={<Settings />} >
                        <Route index element={<Navigate to='general' />} />
                        <Route path='general' element={<General />} />
                        <Route path='account' element={<Account />} />
                        <Route path='notifications' element={<Notification />} />
                        <Route path='community' element={<Community />} />
                        <Route path='billing' element={<Billing />} />
                        <Route path='about' element={<About />} />
                        <Route path='tos' element={<TOS />} />
                        <Route path='privacy' element={<Privacy />} />
                    </Route>
                    <Route path='/notifications' element={<Notifications />} />
                </Routes>
                <Footer />
            </div>
        </main >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setSnackMessage,
    setLoader,
    handleVerifyUser,
    getViewerIP,
    fetchUserExploreList,
    fetchUserStoreList,
    fetchCartList,
    handleSignOut,
    getTags
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PageRoutes);
