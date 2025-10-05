import React, { useState, useEffect } from 'react';
import { createBrowserRouter, Outlet, Navigate, RouterProvider } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import Cookies from 'js-cookie';
import store from './store';

import Header from './containers/Header';
import MobileHeader from './containers/MobileHeader';
import Footer from './containers/Footer';
import Home from './containers/Home';
import Library from './containers/Library';
import Search from './containers/Search';
import Store from './containers/Store';
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
import { a_fetchUserArtworks, a_fetchUserCart, a_fetchUserStoreList, a_fetchVisitorStatus, a_verifyAuth } from './store/actions/user.actions';
import { r_verifyUser } from './store/reducers/user.reducers';
import { r_setLoader, r_setSnackMessage } from './store/reducers/common.reducers';
import LibraryView from './containers/LibraryView';
import StoreView from './containers/StoreView';
import StoreUpload from './containers/StoreUpload';
import LibraryUpload from './containers/LibraryUpload';

const Layout = (props) => {
  const dispatch = useDispatch();
  const common = useSelector(state => state.common);
  const user = useSelector(state => state.user);

  const width = useWindowWidth();
  const isMobile = width < 640; // sm breakpoint

  const [hidePane, setHidePane] = useState(false);

  useEffect(() => {
    dispatch(a_fetchVisitorStatus());
    load_theme();
    load_auth();
  }, []);

  useEffect(() => {
    if (common.loader) {
      document.querySelector("body").style.overflow = 'hidden';
      setTimeout(() => {
        dispatch(r_setLoader(false));
      }, 1500)
    } else {
      document.querySelector("body").style.overflow = 'auto';
    }
  }, [common.loader])

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
  }

  const load_auth = () => {
    // Check condition for site theme
    const hasSession = !!Cookies.get('hasSession') || !!localStorage.getItem('hasSession');
    if (!hasSession) return; // user anonymous, skip refresh
    dispatch(a_verifyAuth());
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
        {/* <Loader /> */}
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
        { path: '/search', element: <Search /> },
        { path: '/library/:id', element: <LibraryView /> },
        { path: '/library/new', element: <LibraryUpload /> },
        { path: '/library/:id/edit', element: <Edit.Library /> },
        { path: '/store', element: <Store /> },
        { path: '/store/:id', element: <StoreView /> },
        { path: '/store/new', element: <StoreUpload /> },
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