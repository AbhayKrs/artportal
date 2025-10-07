import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Cookies from 'js-cookie';

import { api_logout, api_userImages } from '../utils/api_routes';

import TokenModal from '../components/Modals/TokenModal';
import LoginModal from '../components/Modals/LoginModal';
import SignupModal from '../components/Modals/SignupModal';
import SignupSuccessModal from '../components/Modals/SignupSuccessModal';
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
import HeaderLink from '../components/HeaderLink';
import Divider from '../components/Divider';
import { r_headerDialogClose, r_headerDialogOpen, r_switchTheme } from '../store/reducers/common.reducers';
import { r_authMsgClose, r_clearAuth, r_handleLogout, r_setAuthError } from '../store/reducers/user.reducers';
import { a_handleGoogleAuth, a_handleSignIn, a_handleSignUp } from '../store/actions/user.actions';

const Header = ({ hidePane, setHidePane }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const common = useSelector(state => state.common);
    const user = useSelector(state => state.user);

    const [tokenOpen, setTokenOpen] = useState(false);
    const [activeRoute, setActiveRoute] = useState('');

    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location.pathname])

    const handleThemeToggle = () => {
        dispatch(r_switchTheme());
    }

    const logout = () => {
        Cookies.remove('hasSession');
        localStorage.removeItem('hasSession');
        api_logout();
        dispatch(r_clearAuth({}));
        navigate('/');
    }

    return (
        <nav className={`fixed top-0 left-0 z-50 bg-slate-200 dark:bg-darkBg border-r-2 border-gray-400 dark:border-neutral-800`}>
            {/* {common.betaMsg && <div className='relative flex flex-col items-center w-full py-2 justify-center bg-amber-500'>
                <span className='font-semibold text-xs tracking-wider uppercase'>The site is currently in Beta</span>
                <CloseIcon onClick={() => { dispatch(r_setBetaMessage(!common.betaMsg)) }} className='absolute m-auto inset-y-0 right-1 h-3 w-auto cursor-pointer text-neutral-800' />
            </div>} */}
            <div className={`flex flex-col items-center h-screen ${hidePane ? 'w-16' : 'w-60'}`}>
                <div className={`flex flex-col gap-2 h-full w-full overflow-y-auto ${hidePane ? 'py-4' : 'p-1 pt-2'}`}>
                    <div className={`flex items-center ${hidePane ? 'flex-col gap-6' : 'justify-between pl-2 w-full'}`}>
                        <Link to='/' className='flex gap-1 items-center'>
                            <Artportal_logo fill="#1d4ed8" className='h-6 w-auto hover:cursor-pointer' />
                        </Link>
                        <div className={`flex ${hidePane ? 'flex-col' : 'flex-row'} items-center`}>
                            <ThemeToggle value={common.theme} toggle={handleThemeToggle} />
                            <button className="p-1.5 hover:bg-gray-300 hover:dark:bg-neutral-700/50 rounded-xl" onClick={() => setHidePane(!hidePane)}>
                                <SidePane className="h-6 w-6 text-neutral-800 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                    <div className={`flex flex-col overflow-y-auto ${hidePane ? ' items-center px-1' : 'w-full pr-1'}`}>
                        <HeaderLink type="link" hidePane={hidePane} text="Library" path="/library?filter=trending" icon={<LibraryIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />} activeRoute={activeRoute} />
                        <HeaderLink type="link" hidePane={hidePane} text="Search" path="/search" icon={<SearchIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />} activeRoute={activeRoute} />
                        <HeaderLink type="link" hidePane={hidePane} text="Store" path="/store" icon={<StoreIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />} activeRoute={activeRoute} />
                        {user.is_verified &&
                            <>
                                <Divider />
                                <HeaderLink type="link" hidePane={hidePane} text="Upload" path="/library/new" icon={<UploadIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                <HeaderLink type="link" withBadge hidePane={hidePane} text={`Cart (${user && user.cart ? user.cart.length : 0})`} path="/store/cart" icon={<CartIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                <HeaderLink type="link" hidePane={hidePane} text="Notifications" path="/notifications" icon={<NotificationIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                <Divider />
                                <div className={`flex flex-col ${hidePane ? 'items-center' : ''}`}>
                                    <HeaderLink type="link" hidePane={hidePane} text="My Profile" path={`/users/${user.id}`} icon={<ProfileIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="My Pins" path={`/users/${user.id}/pins`} icon={<PinIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="My Space" path={`/users/${user.id}/space`} icon={<CommunityIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="My History" path={`/users/${user.id}/history`} icon={<HistoryIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                </div>
                                <Divider />
                                <div className={`flex flex-col ${hidePane ? 'items-center' : ''}`}>
                                    <HeaderLink type="link" hidePane={hidePane} text="Settings" path="/settings" icon={<SettingsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="Studio" path="/studio" icon={<StudioIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="Earnings" path="/studio/earnings" icon={<EarningsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                    <HeaderLink type="link" hidePane={hidePane} text="Billing & Payments" path="/studio/payments" icon={<BillingIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                </div>
                            </>
                        }
                    </div>
                    <div className='flex flex-col w-full mt-auto'>
                        {user.is_verified ?
                            (hidePane ?
                                <>
                                    <Divider noPadding />
                                    <div className='flex items-center flex-col gap-2 mt-2'>
                                        <div className='relative w-10 flex flex-col items-center gap-2'>
                                            {user.avatar.icon.length > 0 && <div className='flex relative w-10 h-10 justify-center items-center'>
                                                <img loading='lazy' alt='user' src={api_userImages(user.avatar.icon)} className='mt-0.5' />
                                            </div>}
                                            <div className='absolute justify-between left-[-5px] bottom-[-8px] flex flex-row bg-neutral-400/50 dark:bg-neutral-950/80 p-1 rounded-xl'>
                                                <VerifiedIcon className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 h-3 w-3" />
                                            </div>
                                            <div className='absolute justify-between right-[-5px] bottom-[-8px] flex flex-row bg-neutral-400/50 dark:bg-neutral-950/80 p-1 rounded-xl'>
                                                <Artportal_logo fill="#059669" className='h-2.5 w-auto hover:cursor-pointer' />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1 items-center'>
                                            <TokenIcon className="text-neutral-800 dark:text-gray-300 h-6 w-6" />
                                            <p className='text-sm font-semibold tracking-wide text-neutral-800 dark:text-gray-300'>{user.tokens}</p>
                                        </div>
                                        <button onClick={logout} className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'p-3 font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-center`}>
                                            <LogoutIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                        </button>
                                    </div>
                                </>
                                :
                                <>
                                    <Divider noPadding />
                                    <div className='flex flex-col w-full gap-3 px-2 my-2'>
                                        <button onClick={() => { navigate(`/users/${user.id}`) }} className='flex flex-row items-center gap-2 px-1'>
                                            {user.avatar.icon.length > 0 && <div className='flex relative w-10 h-10 justify-center items-center'>
                                                <img loading='lazy' alt='user' src={api_userImages(user.avatar.icon)} className='mt-0.5' />
                                            </div>}
                                            <div className='flex flex-col w-9/12'>
                                                <p className='text-neutral-800 dark:text-gray-200 text-xl text-start font-medium tracking-wide'>{user.name.length > 14 ? user.name.slice(0, 12) + "..." : user.name}</p>
                                                <div className='flex flex-row items-center gap-1'>
                                                    <p className='text-neutral-800 dark:text-gray-200 text-sm font-medium tracking-wide'>#{user.username}</p>
                                                    {user.is_verified && <VerifiedIcon className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 h-4 w-4" />}
                                                    {user.is_premium && <Artportal_logo fill="#059669" className='h-3 w-auto' />}
                                                </div>
                                            </div>
                                        </button>
                                        <button onClick={() => { navigate('/premium') }} className='flex flex-row items-center justify-center bg-neutral-800 dark:bg-slate-200 gap-2 p-3 rounded-xl w-full'>
                                            <Artportal_logo fill="#059669" className='h-5 w-auto hover:cursor-pointer' />
                                            <p className='text-sm font-semibold tracking-wide text-neutral-200 dark:text-neutral-800'>Upgrade to artportal+</p>
                                        </button>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-row justify-between items-center rounded-xl'>
                                                <div className='flex flex-col items-start'>
                                                    <div className='flex flex-row gap-1 items-center'>
                                                        <TokenIcon className="text-neutral-800 dark:text-gray-300 h-6 w-6" />
                                                        <p className='text-base font-semibold tracking-wide text-neutral-800 dark:text-gray-300'>Tokens</p>
                                                    </div>
                                                    <p className='items-center text-sm font-semibold tracking-wide text-neutral-800 dark:text-gray-300'>{user.tokens} tokens</p>
                                                </div>
                                                <button className="p-1.5 hover:bg-gray-300 hover:dark:bg-neutral-700/50 rounded-xl" onClick={() => setTokenOpen(true)}>
                                                    <AddIcon className='h-8 w-8 text-neutral-800 dark:text-gray-300' />
                                                </button>
                                            </div>
                                            <button onClick={logout} className={`flex gap-2 items-end ${hidePane ? 'mt-auto p-2' : 'p-3 text-lg font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-center`}>
                                                <LogoutIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )
                            :
                            <>
                                <HeaderLink type="link" hidePane={hidePane} text="Settings" path="/settings" icon={<SettingsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />} activeRoute={activeRoute} />
                                <Divider />
                                <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'p-3 text-lg font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-center`}>
                                    <SigninIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                    {!hidePane && `Sign In`}
                                </button>
                                <button onClick={() => dispatch(r_headerDialogOpen('openRegisterDialog'))} className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'p-3 text-lg font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-center`}>
                                    <SignupIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                                    {!hidePane && `Sign Up`}
                                </button>
                            </>
                        }
                    </div>
                </div>
            </div>
            {common.openLoginDialog &&
                <LoginModal
                    open={common.openLoginDialog}
                    title={common.dialogTitle}
                    banner={common.loginImage}
                    error={user.authError}
                    setAuthError={(msg) => dispatch(r_setAuthError(msg))}
                    onClose={() => dispatch(r_headerDialogClose())}
                    onClick={() => dispatch(r_headerDialogClose())}
                    openRegister={() => dispatch(r_headerDialogOpen('openRegisterDialog'))}
                    handleSignIn={(stayLoggedIn, userData) => dispatch(a_handleSignIn({ stayLoggedIn, userData }))}
                />
            }
            {common.openRegisterDialog &&
                <SignupModal
                    open={common.openRegisterDialog}
                    title={common.dialogTitle}
                    banner={common.signupImage}
                    error={user.authError}
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
        </nav>
    );
};

export default Header;
