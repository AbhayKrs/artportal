import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { api_userImages } from '../utils/api_routes';

import { TokenModal, LoginModal, RegisterModal, SignupSuccessModal } from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';

import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';
import { ReactComponent as SidePane } from '../assets/icons/sidepane.svg';
import { ReactComponent as LibraryIcon } from '../assets/icons/library.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as StoreIcon } from '../assets/icons/store.svg';
import { ReactComponent as UploadIcon } from '../assets/icons/upload.svg';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import { ReactComponent as NotificationIcon } from '../assets/icons/notifications.svg';
import { ReactComponent as VerifiedIcon } from '../assets/icons/verified.svg';
import { ReactComponent as TokenIcon } from '../assets/icons/token.svg';
import { ReactComponent as SigninIcon } from '../assets/icons/signin.svg';
import { ReactComponent as SignupIcon } from '../assets/icons/signup.svg';
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg';
import { ReactComponent as ProfileIcon } from '../assets/icons/profile.svg';
import { ReactComponent as PinIcon } from '../assets/icons/pin.svg';
import { ReactComponent as CommunityIcon } from '../assets/icons/community.svg';
import { ReactComponent as HistoryIcon } from '../assets/icons/history.svg';
import { ReactComponent as SettingsIcon } from '../assets/icons/settings.svg';
import { ReactComponent as StudioIcon } from '../assets/icons/studio.svg';
import { ReactComponent as EarningsIcon } from '../assets/icons/earnings.svg';
import { ReactComponent as BillingIcon } from '../assets/icons/billing.svg';
import { ReactComponent as AboutIcon } from '../assets/icons/about.svg';
import { ReactComponent as HelpIcon } from '../assets/icons/help.svg';
import { ReactComponent as TermsIcon } from '../assets/icons/terms.svg';
import { ReactComponent as PrivacyIcon } from '../assets/icons/privacy.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import { ReactComponent as AddIcon } from '../assets/icons/add.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menu.svg';
import HeaderLink from '../components/HeaderLink';
import Divider from '../components/Divider';
import { r_authMsgClose, r_handleSignout, r_setAuthError } from '../store/reducers/user.reducers';
import { r_clearSearchList, r_headerDialogClose, r_headerDialogOpen, r_setSearchType, r_switchTheme } from '../store/reducers/common.reducers';
import { a_handleGoogleAuth, a_handleSignIn, a_handleSignUp } from '../store/actions/user.actions';

const MobileHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const common = useSelector(state => state.common);
    const library = useSelector(state => state.library);
    const user = useSelector(state => state.user);

    const [headerMenu, setHeaderMenu] = useState(false);
    const [tokenOpen, setTokenOpen] = useState(false);
    const [activeRoute, setActiveRoute] = useState('');

    const [searchVal, setSearchVal] = useState('');
    const [searchModal, setSearchModal] = useState(false);

    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location.pathname])

    useEffect(() => {
        headerMenu ?
            document.body.style.overflow = 'hidden'
            :
            document.body.style.removeProperty('overflow');
    }, [headerMenu])

    const handleThemeToggle = () => {
        dispatch(r_switchTheme());
    }

    const handleSignout = () => {
        try {
            dispatch(r_handleSignout({}));
        } catch (err) {
            console.log('---error handleSignOut', err);
        }
    }

    const logout = () => {
        setHeaderMenu(false)
        handleSignout();
        navigate('/');
    }

    const clearSearch = () => {
        dispatch(r_clearSearchList())
        setSearchVal('');
    }


    const handleArtworkSearch = () => {
        navigate(`/library/search?query=${searchVal}`);
        dispatch(r_clearSearchList())
    }

    return (
        <nav className='fixed top-0 z-50 w-full bg-slate-200 dark:bg-darkBg'>
            <div className='flex items-center justify-between py-2 px-4 w-full'>
                <Link to='/' className='flex items-center'>
                    <Artportal_logo fill="#1d4ed8" className='h-6 w-auto hover:cursor-pointer' />
                </Link>
                <div className='flex flex-row gap-2'>
                    <ThemeToggle value={common.theme} toggle={handleThemeToggle} />
                    <button className="sm:p-1.5 sm:hover:bg-gray-300 sm:hover:dark:bg-neutral-700/50 rounded-xl" onClick={() => setHeaderMenu(!headerMenu)}>
                        <MenuIcon className="h-6 w-6 text-neutral-800 dark:text-gray-300" />
                    </button>
                </div>
            </div >
            {headerMenu && <div className='flex flex-col gap-2 p-2 overflow-y-auto w-auto' style={{ height: 'calc(100vh - 1.75rem)' }}>
                <div className='flex flex-col gap-2 h-10/12 overflow-y-auto'>
                    <div className='flex flex-col w-full'>
                        <HeaderLink type="link" hidePane={false} text="Library" path="/library" icon={<LibraryIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />} activeRoute={activeRoute} />
                        <HeaderLink type="button" hidePane={false} text="Search" icon={<SearchIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />} activeRoute={activeRoute} func={() => { dispatch(r_setSearchType("artwork")); setSearchModal(true) }} />
                        <HeaderLink type="link" hidePane={false} text="Store" path="/store" icon={<StoreIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />} activeRoute={activeRoute} />
                    </div>
                    <hr className='w-full border border-gray-300 dark:border-neutral-800 rounded-xl' />
                    {user.is_authenticated ?
                        <div className='flex flex-col w-full gap-4'>
                            <div className='flex flex-col'>
                                <HeaderLink type="link" hidePane={false} text="Upload" path="/library/new" icon={<UploadIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                <HeaderLink type="link" hidePane={false} text={`Cart (${user.cart.length})`} path="/store/cart" icon={<CartIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                <HeaderLink type="link" hidePane={false} text="Notifications" path="/notifications" icon={<NotificationIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                            </div>
                            <Divider />
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col'>
                                    <HeaderLink type="link" hidePane={false} text="My Profile" path={`/users/${user.id}`} icon={<ProfileIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={false} text="My Pins" path={`/users/${user.id}/pins`} icon={<PinIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={false} text="My Space" path={`/users/${user.id}/space`} icon={<CommunityIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={false} text="My History" path={`/users/${user.id}/history`} icon={<HistoryIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                </div>
                                <Divider />
                                <div className='flex flex-col' >
                                    <HeaderLink type="link" hidePane={false} text="Settings" path="/settings" icon={<SettingsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={false} text="Studio" path="/studio" icon={<StudioIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={false} text="Earnings" path="/studio/earnings" icon={<EarningsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={false} text="Billing & Payments" path="/studio/payments" icon={<BillingIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                </div >
                            </div >
                        </div >
                        :
                        <div className='flex flex-col w-full px-2 gap-2 mt-auto' >
                            <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className='flex flex-row items-center justify-center bg-gray-300 dark:bg-neutral-700/50 dark:text-gray-300 gap-2 p-3 text-xl font-medium tracking-wide rounded-xl' >
                                <SigninIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                Sign In
                            </button >
                            <button onClick={() => dispatch(r_headerDialogOpen('openRegisterDialog'))} className='flex flex-row items-center justify-center bg-gray-400 dark:bg-neutral-950 dark:text-gray-300 gap-2 p-3 text-xl font-medium tracking-wide rounded-xl' >
                                <SignupIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                Sign Up
                            </button >
                        </div >
                    }
                </div >
                {user.is_authenticated &&
                    <div className='flex flex-col px-2 w-full mt-auto'>
                        <div className='flex flex-col gap-3'>
                            <button onClick={() => { navigate(`/users/${user.id}`) }} className='flex flex-row items-center gap-2 px-1'>
                                {user.avatar.icon.length > 0 && <div className='flex relative w-10 h-10 justify-center items-center'>
                                    <img loading='lazy' alt='user' src={api_userImages(user.avatar.icon)} className='mt-0.5' />
                                </div>}
                                <div className='flex flex-col'>
                                    <p className='text-neutral-800 dark:text-gray-200 text-2xl font-medium tracking-wide'>{user.name}</p>
                                    <div className='flex flex-row items-center gap-1'>
                                        <p className='text-neutral-800 dark:text-gray-200 text-sm font-medium tracking-wide'>#{user.username}</p>
                                        <VerifiedIcon className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 h-4 w-4" />
                                        <Artportal_logo fill="#059669" className='h-3 w-auto' />
                                    </div>
                                </div>
                            </button>
                            <button onClick={() => { navigate('/premium') }} className='flex flex-row items-center justify-center bg-neutral-800 dark:bg-neutral-950 gap-2 p-3 rounded-xl w-full'>
                                <Artportal_logo fill="#059669" className='h-4 w-auto hover:cursor-pointer' />
                                <p className='text-sm font-semibold tracking-wide text-neutral-200 dark:text-gray-300'>Upgrade to artportal+</p>
                            </button>
                            <div className='flex flex-row justify-between items-center rounded-xl pl-3'>
                                <div className='flex flex-col items-start'>
                                    <div className='flex flex-row gap-1 items-start'>
                                        <TokenIcon className="text-neutral-800 dark:text-gray-300 h-6 w-6" />
                                        <p className='text-md tracking-wide text-neutral-800 dark:text-gray-300'>Tokens</p>
                                    </div>
                                    <p className='items-center text-base font-semibold tracking-wide text-neutral-800 dark:text-gray-300'>{user.tokens} tokens</p>
                                </div>
                                <button className="p-1.5 hover:bg-gray-300 hover:dark:bg-neutral-700/50 rounded-xl" onClick={() => setTokenOpen(true)}>
                                    <AddIcon className='h-7 w-7 text-neutral-800 dark:text-gray-300' />
                                </button>
                            </div>
                        </div>
                        <button onClick={logout} className='flex gap-2 items-end p-3 text-xl font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-center'>
                            <LogoutIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                            Logout
                        </button>
                    </div>
                }
            </div>
            }
            {common.openLoginDialog &&
                <LoginModal
                    open={common.openLoginDialog}
                    title={common.dialogTitle}
                    banner={common.loginImage}
                    error={common.authError}
                    setAuthError={(msg) => dispatch(r_setAuthError(msg))}
                    onClose={() => dispatch(r_headerDialogClose())}
                    onClick={() => dispatch(r_headerDialogClose())}
                    openRegister={() => dispatch(r_headerDialogOpen('openRegisterDialog'))}
                    handleSignIn={(stayLoggedIn, userData) => dispatch(a_handleSignIn({ stayLoggedIn, userData }))}
                />
            }
            {common.openRegisterDialog &&
                <RegisterModal
                    open={common.openRegisterDialog}
                    title={common.dialogTitle}
                    banner={common.signupImage}
                    error={common.authError}
                    setAuthError={(msg) => dispatch(r_setAuthError(msg))}
                    onClose={() => dispatch(r_headerDialogClose())}
                    onClick={() => dispatch(r_headerDialogClose())}
                    openLogin={() => dispatch(r_headerDialogOpen('openLoginDialog'))}
                    handleSignUp={(userData) => dispatch(a_handleSignUp(userData))}
                    handleGoogleAuth={() => dispatch(a_handleGoogleAuth())}
                />
            }
            {tokenOpen &&
                <TokenModal
                    open={tokenOpen}
                    user={user}
                    title='Get Tokens'
                    onClose={() => setTokenOpen(false)}
                    onClick={() => setTokenOpen(false)}
                />
            }
            {common.signupSuccess &&
                <SignupSuccessModal
                    open={common.signupSuccess}
                    user={user}
                    title={`Welcome to artportal, ${user.name}!`}
                    onClose={() => dispatch(r_authMsgClose())}
                    onClick={() => dispatch(r_authMsgClose())}
                />
            }
        </nav >
    );
};

export default MobileHeader;
