import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { a_handleSignIn, a_fetchSearchList, a_handleSignUp, a_handleGoogleAuth } from '../store/actions/common.actions';
import { r_switchTheme, r_handleSignout, r_setSearchType, r_clearSearchList, r_headerDialogOpen, r_headerDialogClose, r_setAuthError, r_authMsgClose, r_setBetaMessage } from '../store/reducers/common.reducers';
import { api_fetchUserImages } from '../utils/api_routes';

import { TokenModal, LoginModal, RegisterModal, SignupSuccessModal } from '../components/Modal';
import SearchBar from '../components/SearchBar';
import ThemeToggle from '../components/ThemeToggle';

import premium_logo from '../assets/icons/premium_logo.svg';
import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';
import TokenLogo from '../assets/images/money.png';
import { FaPlus } from 'react-icons/fa';
import { IoClose, IoMenu } from "react-icons/io5";
import { AiFillNotification } from "react-icons/ai";
import { MdUpload, MdHelpOutline, MdShoppingCart, MdOutlineAttachMoney, MdOutlineReceiptLong, MdOutlineHistory } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { BiLock } from 'react-icons/bi';
import { PiUserBold, PiPushPinBold, PiUsersThreeBold, PiChalkboardSimpleBold } from 'react-icons/pi';
import { TbSettings, TbInfoCircle, TbGavel } from 'react-icons/tb';
import { RiSettings4Fill } from "react-icons/ri";

import { ReactComponent as SidePane } from '../assets/icons/sidepane.svg';
import { ReactComponent as LibraryIcon } from '../assets/icons/library.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as StoreIcon } from '../assets/icons/store.svg';
import { ReactComponent as UploadIcon } from '../assets/icons/upload.svg';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import { ReactComponent as NotificationIcon } from '../assets/icons/notifications.svg';

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

    return (
        <nav className='fixed max-w-64 h-screen top-0 left-0 z-50 bg-slate-200 dark:bg-darkBg'>
            {/* {common.betaMsg && <div className='relative flex flex-col w-full py-2 justify-center bg-amber-500'>
                <span className=' font-semibold text-xs tracking-wider uppercase'>This site is currently in Beta.</span>
                <IoClose onClick={() => { dispatch(r_setBetaMessage(!common.betaMsg)) }} className='absolute m-auto inset-y-0 right-1 w-6 h-6 cursor-pointer text-neutral-800' />
            </div>} */}
            <div className='flex flex-col gap-6 items-center p-4 justify-between w-full'>
                <div className='flex items-center justify-between w-full'>
                    <Link to='/' onClick={() => setMobileMenu(false)} className='flex items-center'>
                        <Artportal_logo fill="#1d4ed8" className='h-9 w-9 hover:cursor-pointer' />
                    </Link>
                    <button className="p-1.5 hover:bg-neutral-700/50 rounded-md" onClick={() => setHidePane(!hidePane)}>
                        <SidePane className="h-6 w-6" />
                    </button>
                </div>
                <div className='flex flex-col w-full gap-2'>
                    <Link to='/explore' className='flex gap-2 items-end py-2 px-1.5 group hover:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-md text-xl font-medium tracking-wide'>
                        <div className={`${activeRoute.includes('/explore') ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                        <LibraryIcon className="h-5 w-5" />
                        Library
                    </Link>
                    <Link to='/test' className='flex gap-2 items-end py-2 px-1.5 group hover:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-md text-xl font-medium tracking-wide'>
                        <div className={`${activeRoute.includes('/test') ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                        <SearchIcon className="h-5 w-5" />
                        Search
                    </Link>
                    <Link to='/store' className='flex gap-2 items-end py-2 px-1.5 group hover:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-md text-xl font-medium tracking-wide'>
                        <div className={`${activeRoute.includes('/store') ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                        <StoreIcon className="h-5 w-5" />
                        Store
                    </Link>
                </div>
                <SearchBar tags={common.tags} explore={explore} activeSearch={common.activeSearch} searchList={common.searchList} setSearchType={(type) => dispatch(r_setSearchType(type))} fetchSearchList={(type, value) => dispatch(a_fetchSearchList(type, value))} clearSearchList={() => dispatch(r_clearSearchList())} />
                <div className='hidden sm:flex flex-col w-full gap-2'>
                    {common.isAuthenticated ?
                        <>
                            <Link to='/explore/new' className='flex gap-2 items-end py-2 px-1.5 group hover:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-md text-xl font-medium tracking-wide'>
                                <UploadIcon className='h-5 w-5 text-neutral-800 dark:text-gray-300' />
                                Upload
                            </Link>
                            <Link to='/store/cart' className='flex gap-2 items-end py-2 px-1.5 group hover:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-md text-xl font-medium tracking-wide'>
                                <CartIcon className='h-5 w-5 text-neutral-800 dark:text-gray-300' />
                                {user.cart && user.cart.length > 0 && <div className='absolute top-[-5px] left-4 px-1 bg-rose-500 font-bold text-gray-200 rounded-full text-xs'>{user.cart.length}</div>}
                                Cart (0)
                            </Link>
                            <Link to='/notifications' className='flex gap-2 items-end py-2 px-1.5 group hover:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-md text-xl font-medium tracking-wide'>
                                <NotificationIcon className='h-5 w-5 text-neutral-800 dark:text-gray-300' />
                                Notifications
                            </Link>
                        </>
                        :
                        <>
                            <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className='whitespace-nowrap self-center bg-neutral-800 dark:bg-gray-300 text-gray-200 dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-gray-200 py-1 px-3 rounded-md text-base  font-medium tracking-wide'>Sign In</button>
                            <button onClick={() => dispatch(r_headerDialogOpen('openRegisterDialog'))} className='whitespace-nowrap self-center border border-gray-800 dark:border-gray-300 text-neutral-800 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-neutral-500/20 py-1 px-3 ml-3 rounded-md text-base  font-medium tracking-wide'>Sign Up</button>
                        </>
                    }
                    <ThemeToggle value={common.theme} toggle={handleThemeToggle} />
                    {common.isAuthenticated ?
                        <div ref={userMenuRef} className='relative group'>
                            {console.log("Test", common, user)}
                            <button onClick={() => setUserMenuActive(!userMenuActive)} className={`flex w-full m-auto p-1.5 justify-center items-center ${userMenuActive ? 'bg-slate-300 dark:bg-[#313135] rounded-md' : null}`} >
                                {user.avatar.icon.length > 0 && <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='w-6 h-6 mx-auto' />}
                            </button>
                            <div className={`container fixed ${common.betaMsg === true ? 'top-[4.75rem]' : 'top-[3.25rem]'} w-80 p-1 ${userMenuActive ? 'visible opacity-100' : 'invisible opacity-0'} bg-slate-300 dark:bg-[#313135] rounded-lg`} style={{ right: window.innerWidth >= 1024 ? '0.75rem' : '0.2rem' }}>
                                <div className='flex flex-col scrollbar overflow-auto p-1 pr-2 h-full' style={{ maxHeight: 'calc(100vh - 5rem)' }}>
                                    <div className='flex flex-row items-center space-x-2 p-4'>
                                        {user.avatar.icon.length > 0 && <div className='flex relative w-14 h-14 justify-center items-center'>
                                            <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='mt-0.5' />
                                        </div>}
                                        <div className='flex flex-col'>
                                            <p className='text-gray-900 dark:text-gray-200 text-3xl  font-bold'>{user.name}</p>
                                            <div className='inline-flex flex-row items-center gap-1'>
                                                <p className='text-gray-900 dark:text-gray-200 text-xs  font-bold tracking-wide'>#{user.username}</p>
                                                <svg className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <img loading='lazy' className='h-4 w-4' src={premium_logo} alt='artportal' />
                                            </div>
                                        </div>
                                        {/* <button onClick={logout} className='flex items-center text-gray-900 dark:text-gray-200 mx-2 my-1.5 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md cursor-pointer'>
                                        <HiOutlineLogout className='h-9 w-9' />
                                    </button> */}
                                    </div>
                                    <button onClick={() => { navigate('/premium'); setUserMenuActive(false) }} className='flex flex-row justify-center bg-slate-200 dark:bg-neutral-900 items-center gap-1 mb-1 py-1.5 px-3 rounded-md w-full'>
                                        <div className='flex items-center justify-center rounded-md'>
                                            <img loading='lazy' className='h-6 w-6' src={premium_logo} alt='artportal' />
                                        </div>
                                        <p className=' text-sm font-bold tracking-wide text-gray-900 dark:text-gray-300'>Upgrade to artportal plus</p>
                                    </button>
                                    <div className='flex flex-row justify-between items-center rounded-md py-1 px-4'>
                                        <div className='flex flex-row gap-2 items-center'>
                                            <img loading='lazy' className='h-8' src={TokenLogo} />
                                            <div>
                                                <p className=' font-bold dark:font-bold text-gray-900 dark:text-gray-300'>Tokens</p>
                                                <p className=' items-center font-bold dark:font-normal text-gray-900 dark:text-gray-300'>{user.tokens} tokens</p>
                                            </div>
                                        </div>
                                        <FaPlus className='h-7 w-7 text-blue-700 cursor-pointer' onClick={() => setTokenOpen(true)} />
                                    </div>
                                    <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                    <div className='flex flex-col'>
                                        <Link to={`/users/${user.id}`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <PiUserBold className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>My Profile</span>
                                        </Link>
                                        <Link to={`/users/${user.id}/pins`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <PiPushPinBold className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>My Pins</span>
                                        </Link>
                                        <Link to={`/users/${user.id}/space`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <PiUsersThreeBold className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>My Space</span>
                                        </Link>
                                        <Link to={`/users/${user.id}/history`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <MdOutlineHistory className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>My History</span>
                                        </Link>
                                        <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                        <Link to='/settings' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <TbSettings className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>Settings</span>
                                        </Link>
                                        <Link to='/studio' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <PiChalkboardSimpleBold className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>Studio</span>
                                        </Link>
                                        <Link to='/studio/earnings' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2'>
                                            <MdOutlineAttachMoney className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>Earnings</span>
                                        </Link>
                                        <Link to='/studio/payments' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <MdOutlineReceiptLong className='h-5 w-5' />
                                            <span className='text-base  font-bold tracking-wide'>Billing & Payments</span>
                                        </Link>
                                        <button onClick={logout} className='flex items-center text-gray-900 dark:text-blue-700 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2 rounded-md cursor-pointer'>
                                            <HiOutlineLogout className='h-6 w-6' />
                                            <span className='text-base  font-bold tracking-wide'>Logout</span>
                                        </button>
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className=' text-xs p-3 items-center font-bold dark:font-normal text-neutral-500 dark:text-neutral-400/50'>
                                            artportal Inc. <span className='text-sm'>&#169;</span> 2024. All rights reserved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                    }
                </div >
                <div className='flex sm:hidden'>
                    <button className='h-9 w-9 relative' onClick={() => { setMobileMenu(!mobileMenu) }}>
                        <IoMenu className={`absolute inset-0 m-auto h-9 w-9 ${mobileMenu ? 'opacity-0 duration-100' : 'opacity-100 duration-1000'} text-blue-700 transition-opacity fade-out`} />
                        <IoClose className={`absolute inset-0 m-auto h-9 w-9 ${mobileMenu ? 'opacity-100 duration-1000 ' : 'opacity-0 duration-100'} text-blue-700 transition-opacity fade-in`} />
                    </button>
                </div>
            </div >
            {mobileMenu ?
                <div className='flex flex-col space-y-2 p-3 overflow-y-auto w-auto' style={{ height: 'calc(100vh - 3.75rem)' }
                } >
                    {
                        common.isAuthenticated ?
                            <div className="flex flex-col gap-2 bg-gray-300 dark:bg-neutral-800 p-3 rounded-md">
                                <div className='flex flex-row justify-between'>
                                    <div className='flex flex-row gap-2'>
                                        {user.avatar.icon.length > 0 && <div className='flex relative w-14 h-14 justify-center items-center'>
                                            <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='mt-0.5' />
                                        </div>}
                                        <div className='flex flex-col'>
                                            <p className='text-gray-900 dark:text-gray-200 text-3xl  font-bold'>{user.name}</p>
                                            <div className='inline-flex flex-row items-center gap-1'>
                                                <p className='text-gray-900 dark:text-gray-200 text-xs  font-bold tracking-wide'>#{user.username}</p>
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
                                <button onClick={() => { navigate('/premium'); setMobileMenu(false) }} className='flex flex-row gap-1 justify-center bg-slate-200 dark:bg-neutral-700 items-center px-3 rounded-md'>
                                    <div className='flex items-center justify-center rounded-md'>
                                        <img loading='lazy' className='h-8 w-8' src={premium_logo} alt='artportal' />
                                    </div>
                                    <p className=' font-bold text-gray-900 dark:text-gray-300'>Upgrade to artportal Premium</p>
                                </button>
                                <div className='flex flex-row justify-between items-center rounded-md'>
                                    <div className='flex flex-row gap-2 items-center'>
                                        <img loading='lazy' className='h-8' src={TokenLogo} />
                                        <div>
                                            <p className=' font-bold dark:font-bold text-gray-900 dark:text-gray-300'>Tokens</p>
                                            <p className=' items-center font-bold dark:font-normal text-gray-900 dark:text-gray-300'>{user.tokens} tokens</p>
                                        </div>
                                    </div>
                                    <FaPlus className='h-7 w-7 text-blue-700 cursor-pointer' onClick={() => setTokenOpen(true)} />
                                </div>
                            </div> :
                            <div className='flex flex-row w-full space-x-3 mb-2'>
                                <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className='w-full bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-gray-200 px-3 py-1 rounded-md text-lg tracking-wide  font-bold dark:font-normal'>Sign In</button>
                                <button onClick={() => dispatch(r_headerDialogOpen('openRegisterDialog'))} className='w-full border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-gray-200 px-3 py-1 rounded-md text-lg tracking-wide  font-bold dark:font-normal'>Sign Up</button>
                            </div>
                    }
                    <div className='flex flex-row justify-between items-center rounded-md px-2' >
                        <p className='text-lg  font-bold text-gray-900 dark:text-gray-200 '>Theme</p>
                        <ThemeToggle value={common.theme} toggle={handleThemeToggle} />
                    </div>
                    <div className='flex flex-col h-full'>
                        {common.isAuthenticated ?
                            <>
                                <Link to='/settings' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <TbSettings className='h-5 w-5' />
                                    <span className='text-lg  font-bold tracking-wide'>Settings</span>
                                </Link>
                                <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                <Link to={`/users/${user.id}`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiUserBold className='h-5 w-5' />
                                    <span className='text-lg  font-bold tracking-wide'>My Profile</span>
                                </Link>
                                <Link to={`/users/${user.id}/pins`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiPushPinBold className='h-5 w-5' />
                                    <span className='text-lg  font-bold tracking-wide'>My Pins</span>
                                </Link>
                                <Link to={`/users/${user.id}/space`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiUsersThreeBold className='h-5 w-5' />
                                    <span className='text-lg  font-bold tracking-wide'>My Space</span>
                                </Link>
                                <Link to={`/users/${user.id}/history`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <MdOutlineHistory className='h-5 w-5' />
                                    <span className='text-lg  font-bold tracking-wide'>My History</span>
                                </Link>
                                <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                <Link to='/studio' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiChalkboardSimpleBold className='h-5 w-5' />
                                    <span className='text-lg  font-bold tracking-wide'>artportal Studio</span>
                                </Link>
                                <Link to='/studio/earnings' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2'>
                                    <MdOutlineAttachMoney className='h-5 w-5' />
                                    <span className='text-lg  font-bold tracking-wide'>Earnings</span>
                                </Link>
                                <Link to='/studio/payments' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <MdOutlineReceiptLong className='h-5 w-5' />
                                    <span className='text-lg  font-bold tracking-wide'>Billing & Payments</span>
                                </Link>
                            </> : null}
                        <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                        <Link to='/about' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <TbInfoCircle className='h-5 w-5' />
                            <span className='text-lg  font-bold tracking-wide'>About</span>
                        </Link>
                        <Link to='/help' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <MdHelpOutline className='h-5 w-5' />
                            <span className='text-lg  font-bold tracking-wide'>Help</span>
                        </Link>
                        <Link to='/tos' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <TbGavel className='h-5 w-5' />
                            <span className='text-lg  font-bold tracking-wide'>Terms of Service</span>
                        </Link>
                        <Link to='/privacy' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <BiLock className='h-5 w-5' />
                            <span className='text-lg  font-bold tracking-wide'>Privacy Policy</span>
                        </Link>
                        <p className=' mt-auto text-sm p-3 items-center font-bold dark:font-normal text-neutral-500 dark:text-gray-300'>
                            artportal Private Limited <span className='text-base'>&#169;</span> 2023. All rights reserved.
                        </p>
                    </div>
                </div >
                : null
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

export default Header;
