import React, { useState, useEffect } from 'react';
import { createBrowserRouter, Outlet, Navigate, RouterProvider } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import jwt_decode from 'jwt-decode';
import store from './store';

import { r_verifyUser, r_setSnackMessage } from './store/reducers/common.reducers';
import { a_fetchUserCart, a_fetchUserArtworks, a_fetchUserStoreList, a_fetchVisitorStatus } from './store/actions/common.actions';
import setAuthToken from './utils/setAuthToken';

import Header from './containers/Header';
import MobileHeader from './containers/MobileHeader';
import Footer from './containers/Footer';
import Home from './containers/Home';
import Library from './containers/Library';
import LibrarySearch from './containers/LibrarySearch';
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

import Loader from './components/Loader';
import Snackbar from './components/Snackbar';
// import About from './components/Help/About';
// import Dashboard from './components/Dashboard/Dashboard';
// import Profile from './components/Account/Profile';
// import Notification from './components/Notification/Notification';
// import StoreShow from './components/Store/StoreShow';
// import StoreUpload from './components/Store/StoreUpload';
// import Upload from './components/Library/Upload';
// import Privacy from './components/Help/Privacy';

import General from './children/General';
import Account from './children/Account';
import Notification from './children/Notification';
import Community from './children/Community';
import Billing from './children/Billing';
import About from './children/About';
import TOS from './children/TOS';
import Privacy from './children/Privacy';
import useWindowWidth from './hooks/useWindowWidth';

const Layout = (props) => {
  const dispatch = useDispatch();
  const common = useSelector(state => state.common);

  const width = useWindowWidth();
  const isMobile = width < 640; // sm breakpoint

  const [hidePane, setHidePane] = useState(false);

  useEffect(() => {
    dispatch(a_fetchVisitorStatus());
    load_theme();
    load_auth();
  }, []);

  const load_theme = () => {
    //Check condition for site theme
    if (localStorage.getItem('theme') === null) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
      if (systemTheme) {
        localStorage.setItem('theme', "dark");
      } else {
        localStorage.setItem('theme', "light");
      }
    }
    console.log(localStorage.getItem('theme'));
  }

  const load_auth = () => {
    //Check condition for login status
    let token = null;
    if (localStorage.jwtToken) {
      token = localStorage.jwtToken;

      const userID = common.user.id;
      dispatch(r_verifyUser(token));
      if (userID) {
        dispatch(a_fetchUserArtworks(userID));
        dispatch(a_fetchUserStoreList(userID));
      }
      dispatch(a_fetchUserCart());
    } else if (sessionStorage.jwtToken) {
      token = sessionStorage.jwtToken;

      const userID = common.user.id;
      dispatch(r_verifyUser(token));
      if (userID) {
        dispatch(a_fetchUserArtworks(userID));
        dispatch(a_fetchUserStoreList(userID));
      }
      dispatch(a_fetchUserCart());
    }
  }

  return (
    <main className={`${common.theme} relative font-nunito`}>
      {isMobile ?
        <MobileHeader className="block sm:hidden" hidePane={hidePane} setHidePane={setHidePane} />
        :
        <Header className="hidden sm:block" hidePane={hidePane} setHidePane={setHidePane} />
      }
      <div className={`max-h-show min-h-show overflow-auto flex flex-col bg-gray-200 dark:bg-darkBg ${isMobile ? "pt-8" : hidePane ? "pl-16" : "pl-60"}`}>
        <Snackbar msgdata={common.snackmsg} setMessage={(msgData) => dispatch(r_setSnackMessage(msgData))} />
        <Loader />
        <Outlet context={hidePane} />
      </div>
      {!isMobile && <Footer hidePane={hidePane} />}
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
        { path: '/library', element: <Library /> },
        { path: '/library/search', element: <LibrarySearch /> },
        { path: '/library/:id', element: <Show.Library /> },
        { path: '/library/new', element: <Upload.Library /> },
        { path: '/library/:id/edit', element: <Edit.Library /> },
        { path: '/store', element: <Store /> },
        { path: '/store/:id', element: <Show.Store /> },
        { path: '/store/all', element: <StoreAll /> },
        { path: '/store/new', element: <Upload.Store /> },
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