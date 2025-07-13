import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { a_handleSignIn, a_fetchSearchList, a_handleSignUp, a_handleGoogleAuth } from '../store/actions/common.actions';
import { r_switchTheme, r_handleSignout, r_setSearchType, r_clearSearchList, r_headerDialogOpen, r_headerDialogClose, r_setAuthError, r_authMsgClose, r_setBetaMessage } from '../store/reducers/common.reducers';
import { api_fetchUserImages } from '../utils/api_routes';

import { TokenModal, LoginModal, RegisterModal, SignupSuccessModal } from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';
import { SearchModal } from '../components/Modal';

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
import HeaderLink from '../components/HeaderLink';
import Divider from '../components/Divider';
import useWindowWidth from '../hooks/useWindowWidth';

const Header = ({ hidePane, setHidePane, mobileMenu, setMobileMenu }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const common = useSelector(state => state.common);
    const explore = useSelector(state => state.explore);
    const user = useSelector(state => state.common.user);

    const [tokenOpen, setTokenOpen] = useState(false);
    const [activeRoute, setActiveRoute] = useState('');

    const [searchVal, setSearchVal] = useState('');
    const [searchModal, setSearchModal] = useState(false);

    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location.pathname])

    useEffect(() => {
        mobileMenu ?
            document.body.style.overflow = 'hidden'
            :
            document.body.style.removeProperty('overflow');
    }, [mobileMenu])

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
        setMobileMenu(false)
        handleSignout();
        navigate('/');
    }

    const clearSearch = () => {
        dispatch(r_clearSearchList())
        setSearchVal('');
    }


    const handleExploreSearch = () => {
        navigate(`/explore/search?query=${searchVal}`);
        dispatch(r_clearSearchList())
    }

    return (
        <nav className={`fixed top-0 left-0 z-50 bg-slate-200 dark:bg-darkBg border-r-[3px] border-gray-400 dark:border-neutral-800`}>
            {/* {common.betaMsg && <div className='relative flex flex-col items-center w-full py-2 justify-center bg-amber-500'>
                <span className='font-semibold text-xs tracking-wider uppercase'>The site is currently in Beta</span>
                <CloseIcon onClick={() => { dispatch(r_setBetaMessage(!common.betaMsg)) }} className='absolute m-auto inset-y-0 right-1 h-3 w-auto cursor-pointer text-neutral-800' />
            </div>} */}
            <div className={`flex flex-row md:flex-col gap-4 items-center h-16 md:h-screen ${hidePane ? 'max-w-16' : 'max-w-60'} w-full`}>
                <div className={`flex flex-col gap-2 h-10/12 overflow-y-auto ${hidePane ? 'py-4 px-2' : 'p-2'}`}>
                    <div className={`flex items-center ${hidePane ? 'flex-col gap-4' : 'justify-between pl-2 w-full'}`}>
                        <Link to='/' className='flex items-center'>
                            <Artportal_logo fill="#1d4ed8" className='h-7 w-auto hover:cursor-pointer' />
                        </Link>
                        <div className={`flex ${hidePane ? 'flex-col' : 'flex-row'}`}>
                            <ThemeToggle value={common.theme} toggle={handleThemeToggle} />
                            <button className="p-1.5 hover:bg-gray-300 hover:dark:bg-neutral-700/50 rounded-xl" onClick={() => setHidePane(!hidePane)}>
                                <SidePane className="h-6 w-6 text-neutral-800 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                    <div className={`flex flex-col ${hidePane ? null : 'w-full'}`}>
                        <HeaderLink type="link" hidePane={hidePane} text="Library" path="/explore" icon={<LibraryIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />} activeRoute={activeRoute} />
                        <HeaderLink type="button" hidePane={hidePane} text="Search" icon={<SearchIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />} activeRoute={activeRoute} func={() => { dispatch(r_setSearchType("artwork")); setSearchModal(true) }} />
                        <HeaderLink type="link" hidePane={hidePane} text="Store" path="/store" icon={<StoreIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />} activeRoute={activeRoute} />
                    </div>
                    <hr className={`w-full border border-gray-300 dark:border-neutral-800 rounded-xl`} />
                    {common.isAuthenticated ?
                        <div className={`flex flex-col  ${hidePane ? null : 'w-full'} gap-4`}>
                            <div className={`flex flex-col ${hidePane ? 'items-center' : null}`}>
                                <HeaderLink type="link" hidePane={hidePane} text="Upload" path="/explore/new" icon={<UploadIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                <HeaderLink type="link" hidePane={hidePane} text={`Cart (${user.cart.length})`} path="/store/cart" icon={<CartIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                <HeaderLink type="link" hidePane={hidePane} text="Notifications" path="/notifications" icon={<NotificationIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                            </div>
                            <Divider />
                            <div className='flex flex-col gap-4'>
                                <div className={`flex flex-col ${hidePane ? 'items-center' : null}`}>
                                    <HeaderLink type="link" hidePane={hidePane} text="My Profile" path={`/users/${user.id}`} icon={<ProfileIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="My Pins" path={`/users/${user.id}/pins`} icon={<PinIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="My Space" path={`/users/${user.id}/space`} icon={<CommunityIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="My History" path={`/users/${user.id}/history`} icon={<HistoryIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                </div>
                                <Divider />
                                <div className={`flex flex-col ${hidePane ? 'items-center' : null}`}>
                                    <HeaderLink type="link" hidePane={hidePane} text="Settings" path="/settings" icon={<SettingsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="Studio" path="/studio" icon={<StudioIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="Earnings" path="/studio/earnings" icon={<EarningsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="Billing & Payments" path="/studio/payments" icon={<BillingIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                </div>
                            </div>
                        </div>
                        :
                        <div className={`flex flex-col ${hidePane ? null : 'w-full px-2'} gap-2 mt-auto`}>
                            <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className={`flex flex-row items-center justify-center bg-gray-300 dark:bg-neutral-700/50 dark:text-gray-300 gap-2 ${hidePane ? 'p-2' : 'p-3 text-xl font-medium tracking-wide'} rounded-xl`}>
                                <SigninIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                {!hidePane && `Sign In`}
                            </button>
                            <button onClick={() => dispatch(r_headerDialogOpen('openRegisterDialog'))} className={`flex flex-row items-center justify-center bg-gray-400 dark:bg-neutral-950 dark:text-gray-300 gap-2 ${hidePane ? 'p-2' : 'p-3 text-xl font-medium tracking-wide'} rounded-xl`}>
                                <SignupIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                {!hidePane && `Sign Up`}
                            </button>
                        </div>
                    }
                </div>
                {common.isAuthenticated &&
                    (hidePane ?
                        <div className='flex flex-col items-center w-full mt-auto'>
                            <div className='flex flex-col gap-2'>
                                <div className='relative w-10 flex flex-col items-center gap-2'>
                                    {user.avatar.icon.length > 0 && <div className='flex relative w-10 h-10 justify-center items-center'>
                                        <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='mt-0.5' />
                                    </div>}
                                    <div className='absolute justify-between left-[-5px] bottom-[-8px] flex flex-row bg-neutral-950/80 p-1 rounded-xl'>
                                        <VerifiedIcon className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 h-3 w-3" />
                                    </div>
                                    <div className='absolute justify-between right-[-5px] bottom-[-8px] flex flex-row bg-neutral-950/80 p-1 rounded-xl'>
                                        <Artportal_logo fill="#059669" className='h-2.5 w-auto hover:cursor-pointer' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1 items-center'>
                                    <TokenIcon className="text-neutral-800 dark:text-gray-300 h-6 w-6" />
                                    <p className='text-sm tracking-wide text-neutral-800 dark:text-gray-300'>{user.tokens}</p>
                                </div>
                                <button onClick={logout} className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'p-3 text-xl font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-center`}>
                                    <LogoutIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                </button>
                            </div>
                        </div>
                        :
                        <div className='flex flex-col px-2 w-full mt-auto'>
                            <div className='flex flex-col gap-3'>
                                <button onClick={() => { navigate(`/users/${user.id}`) }} className='flex flex-row items-center gap-2 px-1'>
                                    {user.avatar.icon.length > 0 && <div className='flex relative w-10 h-10 justify-center items-center'>
                                        <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='mt-0.5' />
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
                            <button onClick={logout} className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'p-3 text-xl font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-center`}>
                                <LogoutIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                Logout
                            </button>
                        </div>
                    )
                }
            </div>
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
            {searchModal &&
                <SearchModal
                    open={searchModal}
                    handleClose={() => setSearchModal(false)}
                    betaMsg={common.betaMsg}
                    searchVal={searchVal}
                    explore={explore}
                    searchList={common.searchList}
                    setSearchVal={setSearchVal}
                    activeSearch={common.activeSearch}
                    setSearchType={(type) => dispatch(r_setSearchType(type))}
                    fetchSearchList={(type, value) => dispatch(a_fetchSearchList({ type, value }))}
                    clearSearch={clearSearch}
                    handleExploreSearch={handleExploreSearch}
                />
            }
        </nav>
    );
};

export default Header;
