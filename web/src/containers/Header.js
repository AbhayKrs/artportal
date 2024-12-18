import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { a_handleSignIn, a_fetchSearchList, a_handleSignUp, a_handleGoogleAuth } from '../store/actions/common.actions';
import { r_switchTheme, r_handleSignout, r_setSearchType, r_clearSearchList, r_headerDialogOpen, r_headerDialogClose, r_setAuthError, r_authMsgClose } from '../store/reducers/common.reducers';
import { api_fetchUserImages } from '../utils/api';

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

const Header = ({ betaMsg, setBetaMsg }) => {
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
        <nav className='fixed h-20 top-0 z-50 bg-slate-200 w-full dark:bg-darkBg'>
            {betaMsg && <div className='relative flex flex-row w-full py-1.5 justify-center bg-amber-500 '>
                <span className='font-montserrat font-semibold text-sm tracking-wider uppercase'>This site is currently in Beta.</span>
                <IoClose onClick={() => { setBetaMsg(!betaMsg) }} className='absolute m-auto inset-y-0 right-1 w-6 h-6 cursor-pointer text-neutral-800' />
            </div>}
            <div className='flex flex-row items-center py-2 px-3 justify-between'>
                <div className='flex flex-row space-x-6'>
                    <Link to='/' onClick={() => setMobileMenu(false)} className='flex items-center'>
                        <Artportal_logo fill="#4f46e5" className='h-8 w-8 hover:cursor-pointer' />
                    </Link>
                    <Link to='/explore' className='relative group hidden sm:flex self-center text-neutral-800 dark:text-gray-300 rounded-md text-lg font-montserrat font-medium tracking-wide'>
                        Explore
                        <div className={`absolute ${activeRoute.includes('/explore') ? 'block' : 'hidden group-hover:block'} h-1 w-2/6 bottom-[-2px] left-0 rounded text-2xl bg-indigo-600 dark:bg-indigo-600`}></div>
                    </Link>
                    <Link to='/store' className='relative group hidden sm:flex self-center text-neutral-800 dark:text-gray-300 rounded-md text-lg font-montserrat font-medium tracking-wide'>
                        Store
                        <div className={`absolute ${activeRoute.includes('/store') ? 'block' : 'hidden group-hover:block'} h-1 w-2/6 bottom-[-2px] left-0 rounded text-2xl bg-indigo-600 dark:bg-indigo-600`}></div>
                    </Link>
                </div>
                <SearchBar betaMsg={betaMsg} tags={common.tags} explore={explore} activeSearch={common.activeSearch} searchList={common.searchList} setSearchType={(type) => dispatch(r_setSearchType(type))} fetchSearchList={(type, value) => dispatch(a_fetchSearchList(type, value))} clearSearchList={() => dispatch(r_clearSearchList())} />
                <div className='hidden sm:flex flex-row space-x-4 justify-end'>
                    {common.isAuthenticated ?
                        <>
                            <Link to='/explore/new' className='relative self-center hover:cursor-pointer'>
                                <MdUpload className='h-7 w-7 text-neutral-800 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-600' />
                            </Link>
                            <Link to='/store/cart' className='relative self-center rounded-md hover:cursor-pointer'>
                                <MdShoppingCart className='w-6 h-6 text-neutral-800 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-600' />
                                {user.cart && user.cart.length > 0 && <div className='absolute top-[-5px] left-4 px-1 bg-rose-500 font-bold text-gray-200 rounded-full text-xs'>{user.cart.length}</div>}
                            </Link>
                            <Link to='/notifications' className='relative self-center hover:cursor-pointer'>
                                <AiFillNotification className='h-6 w-6 text-neutral-800 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-600' />
                                {user.cart && user.cart.length > 0 && <div className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                    </span>
                                </div>}
                            </Link>
                        </>
                        :
                        <>
                            <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className='whitespace-nowrap self-center bg-neutral-800 dark:bg-gray-300 text-gray-200 dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-gray-200 py-1 px-3 rounded-md text-base font-montserrat font-medium tracking-wide'>Sign In</button>
                            <button onClick={() => dispatch(r_headerDialogOpen('openRegisterDialog'))} className='whitespace-nowrap self-center border border-gray-800 dark:border-gray-300 text-neutral-800 dark:text-gray-200 hover:bg-slate-300 dark:hover:bg-neutral-500/20 py-1 px-3 ml-3 rounded-md text-base font-montserrat font-medium tracking-wide'>Sign Up</button>
                        </>
                    }
                    <Link to='/settings' className='relative self-center hover:cursor-pointer'>
                        <RiSettings4Fill className='h-6 w-6 text-neutral-800 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-600' />
                    </Link>
                    <ThemeToggle value={common.theme} toggle={handleThemeToggle} />
                    {common.isAuthenticated ?
                        <div ref={userMenuRef} className='relative group'>
                            <button onClick={() => setUserMenuActive(!userMenuActive)} className={`flex w-full m-auto p-1.5 justify-center items-center ${userMenuActive ? 'bg-slate-300 dark:bg-[#313135] rounded-md' : null}`} >
                                {user.avatar.icon.length > 0 && <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='w-6 h-6 mx-auto' />}
                            </button>
                            <div className={`container fixed ${betaMsg === true ? 'top-[4.75rem]' : 'top-[3.25rem]'} w-80 p-1 ${userMenuActive ? 'visible opacity-100' : 'invisible opacity-0'} bg-slate-300 dark:bg-[#313135] rounded-lg`} style={{ right: window.innerWidth >= 1024 ? '0.75rem' : '0.2rem' }}>
                                <div className='flex flex-col scrollbar overflow-auto p-1 pr-2 h-full' style={{ maxHeight: 'calc(100vh - 5rem)' }}>
                                    <div className='flex flex-row items-center space-x-2 p-4'>
                                        <div className='flex relative w-14 h-14 justify-center items-center'>
                                            <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='mt-0.5' />
                                        </div>
                                        <div className='flex flex-col'>
                                            <p className='text-gray-900 dark:text-gray-200 text-3xl font-montserrat font-bold'>{user.name}</p>
                                            <div className='inline-flex flex-row items-center gap-1'>
                                                <p className='text-gray-900 dark:text-gray-200 text-xs font-montserrat font-bold tracking-wide'>#{user.username}</p>
                                                <svg className="stroke-current stroke-1 text-emerald-500 dark:text-emerald-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                                        <p className='font-montserrat text-sm font-bold tracking-wide text-gray-900 dark:text-gray-300'>Upgrade to artportal plus</p>
                                    </button>
                                    <div className='flex flex-row justify-between items-center rounded-md py-1 px-4'>
                                        <div className='flex flex-row gap-2 items-center'>
                                            <img loading='lazy' className='h-8' src={TokenLogo} />
                                            <div>
                                                <p className='font-montserrat font-bold dark:font-bold text-gray-900 dark:text-gray-300'>Tokens</p>
                                                <p className='font-montserrat items-center font-bold dark:font-normal text-gray-900 dark:text-gray-300'>{user.tokens} tokens</p>
                                            </div>
                                        </div>
                                        <FaPlus className='h-7 w-7 text-indigo-600 cursor-pointer' onClick={() => setTokenOpen(true)} />
                                    </div>
                                    <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                    <div className='flex flex-col'>
                                        <Link to={`/users/${user.id}`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <PiUserBold className='h-5 w-5' />
                                            <span className='text-base font-montserrat font-bold tracking-wide'>My Profile</span>
                                        </Link>
                                        <Link to={`/users/${user.id}/pins`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <PiPushPinBold className='h-5 w-5' />
                                            <span className='text-base font-montserrat font-bold tracking-wide'>My Pins</span>
                                        </Link>
                                        <Link to={`/users/${user.id}/space`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <PiUsersThreeBold className='h-5 w-5' />
                                            <span className='text-base font-montserrat font-bold tracking-wide'>My Space</span>
                                        </Link>
                                        <Link to={`/users/${user.id}/history`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <MdOutlineHistory className='h-5 w-5' />
                                            <span className='text-base font-montserrat font-bold tracking-wide'>My History</span>
                                        </Link>
                                        <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                        <Link to='/studio' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <PiChalkboardSimpleBold className='h-5 w-5' />
                                            <span className='text-base font-montserrat font-bold tracking-wide'>Studio</span>
                                        </Link>
                                        <Link to='/studio/earnings' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2'>
                                            <MdOutlineAttachMoney className='h-5 w-5' />
                                            <span className='text-base font-montserrat font-bold tracking-wide'>Earnings</span>
                                        </Link>
                                        <Link to='/studio/payments' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                            <MdOutlineReceiptLong className='h-5 w-5' />
                                            <span className='text-base font-montserrat font-bold tracking-wide'>Billing & Payments</span>
                                        </Link>
                                        <button onClick={logout} className='flex items-center text-gray-900 dark:text-indigo-600 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2 rounded-md cursor-pointer'>
                                            <HiOutlineLogout className='h-6 w-6' />
                                            <span className='text-base font-montserrat font-bold tracking-wide'>Logout</span>
                                        </button>
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='font-montserrat text-xs p-3 items-center font-bold dark:font-normal text-neutral-500 dark:text-neutral-400/50'>
                                            artportal Inc. <span className='text-sm'>&#169;</span> 2024. All rights reserved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null}
                </div>
                <div className='flex sm:hidden'>
                    <button className='h-9 w-9 relative' onClick={() => { setMobileMenu(!mobileMenu) }}>
                        <IoMenu className={`absolute inset-0 m-auto h-9 w-9 ${mobileMenu ? 'opacity-0 duration-100' : 'opacity-100 duration-1000'} text-indigo-600 transition-opacity fade-out`} />
                        <IoClose className={`absolute inset-0 m-auto h-9 w-9 ${mobileMenu ? 'opacity-100 duration-1000 ' : 'opacity-0 duration-100'} text-indigo-600 transition-opacity fade-in`} />
                    </button>
                </div>
            </div>
            {mobileMenu ?
                <div className='flex flex-col space-y-2 p-3 overflow-y-auto w-auto' style={{ height: 'calc(100vh - 3.75rem)' }}>
                    {common.isAuthenticated ?
                        <div className="flex flex-col gap-2 bg-gray-300 dark:bg-neutral-800 p-3 rounded-md">
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-row gap-2'>
                                    <div className='flex relative w-14 h-14 justify-center items-center'>
                                        <img loading='lazy' alt='user' src={api_fetchUserImages(user.avatar.icon)} className='mt-0.5' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='text-gray-900 dark:text-gray-200 text-3xl font-montserrat font-bold'>{user.name}</p>
                                        <div className='inline-flex flex-row items-center gap-1'>
                                            <p className='text-gray-900 dark:text-gray-200 text-xs font-montserrat font-bold tracking-wide'>#{user.username}</p>
                                            <svg className="stroke-current stroke-1 text-emerald-500 dark:text-emerald-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <img loading='lazy' className='h-auto w-6' src={premium_logo} alt='artportal' />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={logout} className='cursor-pointer text-indigo-600 dark:text-indigo-600'>
                                    <HiOutlineLogout className='h-9 w-9' />
                                </button>
                            </div>
                            <button onClick={() => { navigate('/premium'); setMobileMenu(false) }} className='flex flex-row gap-1 justify-center bg-slate-200 dark:bg-neutral-700 items-center px-3 rounded-md'>
                                <div className='flex items-center justify-center rounded-md'>
                                    <img loading='lazy' className='h-8 w-8' src={premium_logo} alt='artportal' />
                                </div>
                                <p className='font-montserrat font-bold text-gray-900 dark:text-gray-300'>Upgrade to artportal Premium</p>
                            </button>
                            <div className='flex flex-row justify-between items-center rounded-md'>
                                <div className='flex flex-row gap-2 items-center'>
                                    <img loading='lazy' className='h-8' src={TokenLogo} />
                                    <div>
                                        <p className='font-montserrat font-bold dark:font-bold text-gray-900 dark:text-gray-300'>Tokens</p>
                                        <p className='font-montserrat items-center font-bold dark:font-normal text-gray-900 dark:text-gray-300'>{user.tokens} tokens</p>
                                    </div>
                                </div>
                                <FaPlus className='h-7 w-7 text-indigo-600 cursor-pointer' onClick={() => setTokenOpen(true)} />
                            </div>
                        </div> :
                        <div className='flex flex-row w-full space-x-3 mb-2'>
                            <button onClick={() => dispatch(r_headerDialogOpen('openLoginDialog'))} className='w-full bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-gray-200 px-3 py-1 rounded-md text-lg tracking-wide font-montserrat font-bold dark:font-normal'>Sign In</button>
                            <button onClick={() => dispatch(r_headerDialogOpen('openRegisterDialog'))} className='w-full border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-gray-200 px-3 py-1 rounded-md text-lg tracking-wide font-montserrat font-bold dark:font-normal'>Sign Up</button>
                        </div>
                    }
                    <div className='flex flex-row justify-between items-center rounded-md px-2'>
                        <p className='text-lg font-montserrat font-bold text-gray-900 dark:text-gray-200 '>Theme</p>
                        <ThemeToggle value={common.theme} toggle={handleThemeToggle} />
                    </div>
                    <div className='flex flex-col h-full'>
                        {common.isAuthenticated ?
                            <>
                                <Link to='/settings' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <TbSettings className='h-5 w-5' />
                                    <span className='text-lg font-montserrat font-bold tracking-wide'>Settings</span>
                                </Link>
                                <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                <Link to={`/users/${user.id}`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiUserBold className='h-5 w-5' />
                                    <span className='text-lg font-montserrat font-bold tracking-wide'>My Profile</span>
                                </Link>
                                <Link to={`/users/${user.id}/pins`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiPushPinBold className='h-5 w-5' />
                                    <span className='text-lg font-montserrat font-bold tracking-wide'>My Pins</span>
                                </Link>
                                <Link to={`/users/${user.id}/space`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiUsersThreeBold className='h-5 w-5' />
                                    <span className='text-lg font-montserrat font-bold tracking-wide'>My Space</span>
                                </Link>
                                <Link to={`/users/${user.id}/history`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <MdOutlineHistory className='h-5 w-5' />
                                    <span className='text-lg font-montserrat font-bold tracking-wide'>My History</span>
                                </Link>
                                <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                <Link to='/studio' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiChalkboardSimpleBold className='h-5 w-5' />
                                    <span className='text-lg font-montserrat font-bold tracking-wide'>artportal Studio</span>
                                </Link>
                                <Link to='/studio/earnings' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2'>
                                    <MdOutlineAttachMoney className='h-5 w-5' />
                                    <span className='text-lg font-montserrat font-bold tracking-wide'>Earnings</span>
                                </Link>
                                <Link to='/studio/payments' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <MdOutlineReceiptLong className='h-5 w-5' />
                                    <span className='text-lg font-montserrat font-bold tracking-wide'>Billing & Payments</span>
                                </Link>
                            </> : null}
                        <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                        <Link to='/about' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <TbInfoCircle className='h-5 w-5' />
                            <span className='text-lg font-montserrat font-bold tracking-wide'>About</span>
                        </Link>
                        <Link to='/help' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <MdHelpOutline className='h-5 w-5' />
                            <span className='text-lg font-montserrat font-bold tracking-wide'>Help</span>
                        </Link>
                        <Link to='/tos' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <TbGavel className='h-5 w-5' />
                            <span className='text-lg font-montserrat font-bold tracking-wide'>Terms of Service</span>
                        </Link>
                        <Link to='/privacy' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <BiLock className='h-5 w-5' />
                            <span className='text-lg font-montserrat font-bold tracking-wide'>Privacy Policy</span>
                        </Link>
                        <p className='font-montserrat mt-auto text-sm p-3 items-center font-bold dark:font-normal text-neutral-500 dark:text-gray-300'>
                            artportal Private Limited <span className='text-base'>&#169;</span> 2023. All rights reserved.
                        </p>
                    </div>
                </div>
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
        </nav >
    );
};

export default Header;
