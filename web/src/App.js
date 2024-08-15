import React, { useState, useEffect } from 'react';
import { createBrowserRouter, Outlet, Navigate, RouterProvider } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import jwt_decode from 'jwt-decode';
import store from './store';

import { r_verifyUser, r_setSnackMessage } from './store/reducers/common.reducers';
import { a_fetchCartList, a_fetchUserExploreList, a_fetchUserStoreList, a_fetchViewerID } from './store/actions/common.actions';
import setAuthToken from './utils/setAuthToken';

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
import Google from './splash/Google';
import Settings from './containers/Settings';
import Edit from './containers/Edit';
import Cart from './containers/Cart';
import Notifications from './containers/Notifications';

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

const Layout = (props) => {
  const dispatch = useDispatch();
  const common = useSelector(state => state.common);

  const [betaMsg, setBetaMsg] = useState(true);

  useEffect(async () => {
    if (localStorage.getItem('theme') === null) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
      if (systemTheme) {
        localStorage.setItem('theme', "dark");
      } else {
        localStorage.setItem('theme', "light");
      }
    }
    console.log(localStorage.getItem('theme'));

    dispatch(a_fetchViewerID());

    let token = null;
    if (localStorage.jwtToken) {
      token = localStorage.jwtToken;
      setAuthToken(token);

      const userID = common.user.id;
      dispatch(r_verifyUser(token));
      dispatch(a_fetchUserExploreList(userID));
      dispatch(a_fetchUserStoreList(userID));
      dispatch(a_fetchCartList());
    } else if (sessionStorage.jwtToken) {
      token = sessionStorage.jwtToken;
      setAuthToken(token);

      const userID = common.user.id;
      dispatch(r_verifyUser(token));
      dispatch(a_fetchUserExploreList(userID));
      dispatch(a_fetchUserStoreList(userID));
      dispatch(a_fetchCartList());
    }
  }, []);

  return (
    <main className={`App ${common.theme} relative`}>
      <Header betaMsg={betaMsg} setBetaMsg={setBetaMsg} />
      <div className={`h-screen flex flex-col bg-gray-200 dark:bg-darkBg ${betaMsg === true ? 'pt-[5.5rem]' : 'pt-[3.75rem]'}`}>
        <Snackbar msgdata={common.snackmsg} setMessage={(msgData) => dispatch(r_setSnackMessage(msgData))} />
        <Outlet />
        <Footer />
      </div>
    </main>
  )
};

const App = () => {

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/google_success', element: <Google header="Success" />, },
        { path: '/google_failed', element: <Google header="Failed" /> },
        { path: '/explore', element: <Explore /> },
        { path: '/explore/search', element: <ExploreSearch /> },
        { path: '/explore/:id', element: <Show.ExploreShow /> },
        { path: '/explore/new', element: <Upload.ExploreUpload /> },
        { path: '/explore/:id/edit', element: <Edit.ExploreEdit /> },
        { path: '/store', element: <Store /> },
        { path: '/store/:id', element: <Show.StoreShow /> },
        { path: '/store/all', element: <StoreAll /> },
        { path: '/store/new', element: <Upload.StoreUpload /> },
        { path: '/store/cart', element: <Cart /> },
        { path: '/users/:id', element: <Profile /> },
        { path: '/notifications', element: <Notifications /> },
        {
          path: '/settings', element: <Settings />, children: [
            { index: true, element: <Navigate to='general' /> },
            { path: 'general', element: <General /> },
            { path: 'account', element: <Account /> },
            { path: 'notifications', element: <Notification /> },
            { path: 'community', element: <Community /> },
            { path: 'billing', element: <Billing /> },
            { path: 'about', element: <About /> },
            { path: 'tos', element: <TOS /> },
            { path: 'privacy', element: <Privacy /> },

          ]
        },
      ]
    }
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;