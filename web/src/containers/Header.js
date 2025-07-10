import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { a_handleSignIn, a_fetchSearchList, a_handleSignUp, a_handleGoogleAuth } from '../store/actions/common.actions';
import { r_switchTheme, r_handleSignout, r_setSearchType, r_clearSearchList, r_headerDialogOpen, r_headerDialogClose, r_setAuthError, r_authMsgClose, r_setBetaMessage } from '../store/reducers/common.reducers';
import { api_fetchUserImages } from '../utils/api_routes';

import { TokenModal, LoginModal, RegisterModal, SignupSuccessModal } from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';
import { SearchModal } from '../components/Modal';

import premium_logo from '../assets/icons/premium_logo.svg';
import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';
import TokenLogo from '../assets/images/money.png';
import { FaPlus } from 'react-icons/fa';
import { IoClose, IoMenu } from "react-icons/io5";
import { MdUpload, MdHelpOutline, MdShoppingCart, MdOutlineAttachMoney, MdOutlineReceiptLong, MdOutlineHistory } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { BiLock } from 'react-icons/bi';
import { PiUserBold, PiPushPinBold, PiUsersThreeBold, PiChalkboardSimpleBold } from 'react-icons/pi';
import { TbSettings, TbInfoCircle, TbGavel } from 'react-icons/tb';

import { ReactComponent as SidePane } from '../assets/icons/sidepane.svg';
import { ReactComponent as LibraryIcon } from '../assets/icons/library.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as StoreIcon } from '../assets/icons/store.svg';
import { ReactComponent as UploadIcon } from '../assets/icons/upload.svg';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import { ReactComponent as NotificationIcon } from '../assets/icons/notifications.svg';
import { ReactComponent as VerifiedIcon } from '../assets/icons/verified.svg';
import { ReactComponent as TokenIcon } from '../assets/icons/token.svg';

const useUserMenuOut = (ref, active, setActive) => {
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                // alert('You clicked outside');
                setActive(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [ref]);
}

const Header = ({ hidePane, setHidePane }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const common = useSelector(state => state.common);
    const explore = useSelector(state => state.explore);
    const user = useSelector(state => state.common.user);

    const [tokenOpen, setTokenOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [activeRoute, setActiveRoute] = useState('');
    const [userMenuActive, setUserMenuActive] = useState(false);

    const [searchVal, setSearchVal] = useState('');
    const [searchModal, setSearchModal] = useState(false);

    const userMenuRef = useRef(null);
    useUserMenuOut(userMenuRef, userMenuActive, setUserMenuActive);

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
        <nav className={`fixed ${hidePane ? 'max-w-16' : 'max-w-60'} w-full h-screen top-0 left-0 z-50 bg-slate-200 dark:bg-darkBg border-r-[3px] border-gray-400 dark:border-neutral-800`}>
            {/* {common.betaMsg && <div className='relative flex flex-col w-full py-2 justify-center bg-amber-500'>
                <span className='font-semibold text-xs tracking-wider uppercase'>This site is currently in Beta.</span>
                <IoClose onClick={() => { dispatch(r_setBetaMessage(!common.betaMsg)) }} className='absolute m-auto inset-y-0 right-1 w-6 h-6 cursor-pointer text-neutral-800' />
            </div>} */}
            <div className={`flex flex-col gap-4 items-center ${hidePane ? 'py-4 px-2' : 'p-2'} w-full h-screen`}>
                <div className={`flex items-center ${hidePane ? 'flex-col gap-4' : 'justify-between pl-2 w-full'}`}>
                    <Link to='/' onClick={() => setMobileMenu(false)} className='flex items-center'>
                        <Artportal_logo fill="#1d4ed8" className='h-7 w-auto hover:cursor-pointer' />
                    </Link>
                    <div className={`flex ${hidePane ? 'flex-col' : 'flex-row'} gap-1`}>
                        <ThemeToggle value={common.theme} toggle={handleThemeToggle} />
                        <button className="p-1.5 hover:bg-gray-300 hover:dark:bg-neutral-700/50 rounded-xl" onClick={() => setHidePane(!hidePane)}>
                            <SidePane className="h-6 w-6 text-neutral-800 dark:text-gray-300" />
                        </button>
                    </div>

                </div>
                <div className={`flex flex-col ${hidePane ? null : 'w-full'}  gap-1`}>
                    <Link to='/explore' className={`${hidePane ? 'p-2' : 'flex gap-2 items-end py-3 px-4 text-xl font-medium tracking-wide'} group hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                        <div className={`${activeRoute.includes('/explore') ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                        <LibraryIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />
                        {!hidePane && `Library`}
                    </Link>
                    <Link onClick={() => { dispatch(r_setSearchType("artwork")); setSearchModal(true) }} className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'py-3 px-4 text-xl font-medium tracking-wide'} group hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                        <div className={`${activeRoute.includes('/test') ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                        <SearchIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />
                        {!hidePane && `Search`}
                    </Link>
                    <Link to='/store' className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'py-3 px-4 text-xl font-medium tracking-wide'} group hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                        <div className={`${activeRoute.includes('/store') ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                        <StoreIcon className="h-5 w-5 text-neutral-800 dark:text-gray-300" />
                        {!hidePane && `Store`}
                    </Link>
                </div>
                {common.isAuthenticated ?
                    <div className={`flex flex-col ${hidePane ? null : 'w-full'}  gap-1`}>
                        <hr className={`${hidePane ? 'w-full' : 'w-11/12'} border border-gray-300 dark:border-neutral-800 rounded-xl`} />
                        <Link to='/explore/new' className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'py-3 px-4 text-xl font-medium tracking-wide'} group hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                            <UploadIcon className='h-5 w-5 text-neutral-800 dark:text-gray-300' />
                            {!hidePane && `Upload`}
                        </Link>
                        <Link to='/store/cart' className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'py-3 px-4 text-xl font-medium tracking-wide'} group hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                            <CartIcon className='h-5 w-5 text-neutral-800 dark:text-gray-300' />
                            {user.cart && user.cart.length > 0 && <div className='absolute top-[-5px] left-4 px-1 bg-rose-500 font-bold text-gray-200 rounded-full text-xs'>{user.cart.length}</div>}
                            {!hidePane && `Cart (0)`}
                        </Link>
                        <Link to='/notifications' className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'py-3 px-4 text-xl font-medium tracking-wide'} group hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                            <NotificationIcon className='h-5 w-5 text-neutral-800 dark:text-gray-300' />
                            {!hidePane && `Notifications`}
                        </Link>
                    </div>
                    :
                    <div className='flex flex-col w-full gap-2 mt-auto px-2'>
                        <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className='flex flex-row items-center justify-center bg-gray-300 dark:bg-neutral-700/50 dark:text-gray-300 gap-2 p-3 rounded-xl w-full text-xl font-medium tracking-wide'>
                            Sign In
                        </button>
                        <button onClick={() => dispatch(r_headerDialogOpen('openRegisterDialog'))} className='flex flex-row items-center justify-center bg-gray-400 dark:bg-neutral-950 dark:text-gray-300 gap-2 p-3 rounded-xl w-full text-xl font-medium tracking-wide'>
                            Sign Up
                        </button>
                    </div>
                }
                {!hidePane && common.isAuthenticated &&
                    <div ref={userMenuRef} className='flex flex-col px-2 w-full mt-auto'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-row items-center gap-2 pl-3'>
                                {user.avatar.icon.length > 0 && <div className='flex relative w-10 h-10 justify-center items-center'>
                                    <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='mt-0.5' />
                                </div>}
                                <div className='flex flex-col'>
                                    <p className='text-neutral-800 dark:text-gray-200 text-2xl font-medium tracking-wide'>{user.name}</p>
                                    <div className='flex flex-row items-center gap-1'>
                                        <p className='text-neutral-800 dark:text-gray-200 text-sm font-medium tracking-wide'>#{user.username}</p>
                                        <VerifiedIcon className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 h-4 w-4" />
                                        <Artportal_logo fill="#059669" className='h-3 w-auto hover:cursor-pointer' />
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => { navigate('/premium'); setUserMenuActive(false) }} className='flex flex-row items-center justify-center bg-neutral-800 dark:bg-neutral-900 gap-2 p-3 rounded-xl w-full'>
                                <Artportal_logo fill="#059669" className='h-4 w-auto hover:cursor-pointer' />
                                <p className='text-sm font-semibold tracking-wide text-neutral-200 dark:text-neutral-800'>Upgrade to artportal+</p>
                            </button>
                            <div className='flex flex-row justify-between items-center rounded-xl pl-3'>
                                <div className='flex flex-col items-start'>
                                    <div className='flex flex-row gap-1 items-start'>
                                        <TokenIcon className="text-neutral-800 h-6 w-6" />
                                        <p className='text-md tracking-wide text-neutral-800 dark:text-gray-300'>Tokens</p>
                                    </div>
                                    <p className='items-center text-base font-semibold tracking-wide text-neutral-800 dark:text-gray-300'>{user.tokens} tokens</p>
                                </div>
                                <button className="p-1.5 hover:bg-gray-300 hover:dark:bg-neutral-700/50 rounded-xl" onClick={() => setTokenOpen(true)}>
                                    <FaPlus className='h-7 w-7 text-neutral-800' />
                                </button>
                            </div>
                        </div>
                        {/* <hr className='w-full border border-gray-300 dark:border-neutral-800 rounded-xl px-2' />
                                    <div className='flex flex-col'>
                                        <Link to={`/users/${user.id}`} onClick={() => setUserMenuActive(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                            <PiUserBold className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>My Profile</span>
                                        </Link>
                                        <Link to={`/users/${user.id}/pins`} onClick={() => setUserMenuActive(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                            <PiPushPinBold className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>My Pins</span>
                                        </Link>
                                        <Link to={`/users/${user.id}/space`} onClick={() => setUserMenuActive(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                            <PiUsersThreeBold className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>My Space</span>
                                        </Link>
                                        <Link to={`/users/${user.id}/history`} onClick={() => setUserMenuActive(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                            <MdOutlineHistory className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>My History</span>
                                        </Link>
                                        <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                        <Link to='/settings' onClick={() => setUserMenuActive(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                            <TbSettings className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>Settings</span>
                                        </Link>
                                        <Link to='/studio' onClick={() => setUserMenuActive(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                            <PiChalkboardSimpleBold className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>Studio</span>
                                        </Link>
                                        <Link to='/studio/earnings' onClick={() => setUserMenuActive(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2'>
                                            <MdOutlineAttachMoney className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>Earnings</span>
                                        </Link>
                                        <Link to='/studio/payments' onClick={() => setUserMenuActive(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                            <MdOutlineReceiptLong className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>Billing & Payments</span>
                                        </Link>
                                        <button onClick={logout} className='flex items-center text-neutral-800 dark:text-blue-700 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2 rounded-xl cursor-pointer'>
                                            <HiOutlineLogout className='h-6 w-6' />
                                            <span className='text-base  font-bold tracking-wide'>Logout</span>
                                        </button>
                                    </div> */}
                        <button onClick={logout} className='flex gap-2 items-end p-3 group hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl text-xl font-medium tracking-wide'>
                            <HiOutlineLogout className='h-6 w-6' />
                            <span className='text-base  font-bold tracking-wide'>Logout</span>
                        </button>
                    </div>
                }
            </div>
            {
                mobileMenu ?
                    <div className='flex flex-col space-y-2 py-2 px-3 overflow-y-auto w-auto' style={{ height: 'calc(100vh - 3.75rem)' }
                    } >
                        {
                            common.isAuthenticated ?
                                <div className="flex flex-col gap-2 bg-gray-300 dark:bg-neutral-800 p-3 rounded-xl">
                                    <div className='flex flex-row justify-between'>
                                        <div className='flex flex-row gap-2'>
                                            {user.avatar.icon.length > 0 && <div className='flex relative w-14 h-14 justify-center items-center'>
                                                <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='mt-0.5' />
                                            </div>}
                                            <div className='flex flex-col'>
                                                <p className='text-neutral-800 dark:text-gray-200 text-3xl  font-bold'>{user.name}</p>
                                                <div className='inline-flex flex-row items-center gap-1'>
                                                    <p className='text-neutral-800 dark:text-gray-200 text-xs  font-bold tracking-wide'>#{user.username}</p>
                                                    <svg className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <img loading='lazy' className='h-auto w-6' src={premium_logo} alt='artportal' />
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={logout} className='cursor-pointer text-blue-700 dark:text-blue-700'>
                                            <HiOutlineLogout className='h-9 w-9' />
                                        </button>
                                    </div>
                                    <button onClick={() => { navigate('/premium'); setMobileMenu(false) }} className='flex flex-row gap-1 justify-center bg-slate-200 dark:bg-neutral-700 items-center px-3 rounded-xl'>
                                        <div className='flex items-center justify-center rounded-xl'>
                                            <img loading='lazy' className='h-8 w-8' src={premium_logo} alt='artportal' />
                                        </div>
                                        <p className='font-bold text-neutral-800 dark:text-gray-300'>Upgrade to artportal Premium</p>
                                    </button>
                                    <div className='flex flex-row justify-between items-center rounded-xl'>
                                        <div className='flex flex-row gap-2 items-center'>
                                            <img loading='lazy' className='h-8' src={TokenLogo} />
                                            <div>
                                                <p className='font-bold dark:font-bold text-neutral-800 dark:text-gray-300'>Tokens</p>
                                                <p className='items-center font-bold dark:font-normal text-neutral-800 dark:text-gray-300'>{user.tokens} tokens</p>
                                            </div>
                                        </div>
                                        <FaPlus className='h-7 w-7 text-blue-700 cursor-pointer' onClick={() => setTokenOpen(true)} />
                                    </div>
                                </div> :
                                <>
                                    <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className='flex flex-row items-center justify-center bg-gray-300 dark:bg-neutral-700/50 dark:text-gray-300 gap-2 p-3 rounded-xl w-full text-xl font-medium tracking-wide'>
                                        Sign In
                                    </button>
                                    <button onClick={() => dispatch(r_headerDialogOpen('openRegisterDialog'))} className='flex flex-row items-center justify-center bg-gray-400 dark:bg-neutral-950 dark:text-gray-300 gap-2 p-3 rounded-xl w-full text-xl font-medium tracking-wide'>
                                        Sign Up
                                    </button>
                                </>
                        }
                        <div className='flex flex-row justify-between items-center rounded-xl px-2' >
                            <p className='text-lg  font-bold text-neutral-800 dark:text-gray-200 '>Theme</p>
                            <ThemeToggle value={common.theme} toggle={handleThemeToggle} />
                        </div>
                        <div className='flex flex-col h-full'>
                            {common.isAuthenticated ?
                                <>
                                    <Link to='/settings' onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                        <TbSettings className='h-5 w-5' />
                                        <span className='text-lg  font-bold tracking-wide'>Settings</span>
                                    </Link>
                                    <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                    <Link to={`/users/${user.id}`} onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                        <PiUserBold className='h-5 w-5' />
                                        <span className='text-lg  font-bold tracking-wide'>My Profile</span>
                                    </Link>
                                    <Link to={`/users/${user.id}/pins`} onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                        <PiPushPinBold className='h-5 w-5' />
                                        <span className='text-lg  font-bold tracking-wide'>My Pins</span>
                                    </Link>
                                    <Link to={`/users/${user.id}/space`} onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                        <PiUsersThreeBold className='h-5 w-5' />
                                        <span className='text-lg  font-bold tracking-wide'>My Space</span>
                                    </Link>
                                    <Link to={`/users/${user.id}/history`} onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                        <MdOutlineHistory className='h-5 w-5' />
                                        <span className='text-lg  font-bold tracking-wide'>My History</span>
                                    </Link>
                                    <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                    <Link to='/studio' onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                        <PiChalkboardSimpleBold className='h-5 w-5' />
                                        <span className='text-lg  font-bold tracking-wide'>artportal Studio</span>
                                    </Link>
                                    <Link to='/studio/earnings' onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2'>
                                        <MdOutlineAttachMoney className='h-5 w-5' />
                                        <span className='text-lg  font-bold tracking-wide'>Earnings</span>
                                    </Link>
                                    <Link to='/studio/payments' onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                        <MdOutlineReceiptLong className='h-5 w-5' />
                                        <span className='text-lg  font-bold tracking-wide'>Billing & Payments</span>
                                    </Link>
                                </> : null}
                            <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                            <Link to='/about' onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                <TbInfoCircle className='h-5 w-5' />
                                <span className='text-lg  font-bold tracking-wide'>About</span>
                            </Link>
                            <Link to='/help' onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                <MdHelpOutline className='h-5 w-5' />
                                <span className='text-lg  font-bold tracking-wide'>Help</span>
                            </Link>
                            <Link to='/tos' onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                <TbGavel className='h-5 w-5' />
                                <span className='text-lg  font-bold tracking-wide'>Terms of Service</span>
                            </Link>
                            <Link to='/privacy' onClick={() => setMobileMenu(false)} className='flex items-center text-neutral-800 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-xl'>
                                <BiLock className='h-5 w-5' />
                                <span className='text-lg  font-bold tracking-wide'>Privacy Policy</span>
                            </Link>
                            <p className='mt-auto text-sm p-3 items-center font-bold dark:font-normal text-neutral-500 dark:text-gray-300'>
                                artportal Private Limited <span className='text-base'>&#169;</span> 2023. All rights reserved.
                            </p>
                        </div>
                    </div >
                    : null
            }
            {
                common.openLoginDialog &&
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
            {
                common.openRegisterDialog &&
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
            {
                tokenOpen &&
                <TokenModal
                    open={tokenOpen}
                    user={user}
                    title='Get Tokens'
                    onClose={() => setTokenOpen(false)}
                    onClick={() => setTokenOpen(false)}
                />
            }
            {
                common.signupSuccess &&
                <SignupSuccessModal
                    open={common.signupSuccess}
                    user={user}
                    title={`Welcome to artportal, ${user.name}!`}
                    onClose={() => dispatch(r_authMsgClose())}
                    onClick={() => dispatch(r_authMsgClose())}
                />
            }
            {
                searchModal && <SearchModal
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
        </nav >
    );
};

export default Header;
