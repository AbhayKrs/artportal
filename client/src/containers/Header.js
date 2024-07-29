import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import premium_logo from '../assets/images/premium_logo.svg';
import Artyst_logo from '../assets/images/artyst_logo.svg';
import TokenLogo from '../assets/images/money.png';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import { IoClose, IoMenu, IoSunny } from "react-icons/io5";
import { AiFillNotification } from "react-icons/ai";
import { FaEllipsisVertical, FaMoon } from 'react-icons/fa6';
import { MdUpload, MdHelpOutline, MdShoppingCart, MdOutlineAttachMoney, MdOutlineReceiptLong, MdOutlineHistory } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { BiLock } from 'react-icons/bi';
import { PiSunHorizonBold, PiMoonStarsBold, PiUserBold, PiPushPinBold, PiUsersThreeBold, PiChalkboardSimpleBold } from 'react-icons/pi';
import { TbSettings, TbInfoCircle, TbGavel } from 'react-icons/tb';
import { TokenModal, LoginModal, RegisterModal, SignupSuccessModal } from '../components/Modal';
import { switchTheme, setAuthError, setSearchType, fetchSearchList, clearSearchList, handleHeaderDialogOpen, handleHeaderDialogClose, handleSignIn, handleSignUp, handleGoogleAuth, handleSignOut, handleSignupSuccessMsgClose } from '../store/actions/common.actions';
import { fetchUserImages } from '../api';

import SearchBar from '../components/SearchBar';
import { ThemeToggle } from '../components/Toggle';

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

const Header = (props) => {
    let navigate = useNavigate();
    const location = useLocation();
    const [tokenOpen, setTokenOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [activeRoute, setActiveRoute] = useState('');
    const [userMenuActive, setUserMenuActive] = useState(false);

    const userMenuRef = useRef(null);
    useUserMenuOut(userMenuRef, userMenuActive, setUserMenuActive);

    const logout = () => {
        setMobileMenu(false)
        props.handleSignOut();
        navigate('/');
    }

    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location.pathname])

    useEffect(() => {
        mobileMenu ?
            document.body.style.overflow = 'hidden'
            :
            document.body.style.removeProperty('overflow');
    }, [mobileMenu])

    return (
        <nav className='fixed top-0 z-50 bg-gray-200 w-full dark:bg-darkNavBg'>
            <div className='flex flex-row items-center py-1.5 px-2 sm:px-3 space-x-6 lg:space-x-12'>
                <div className='flex flex-row space-x-6'>
                    <Link to='/' onClick={() => setMobileMenu(false)} className='flex items-center justify-center w-12 h-12'>
                        <img loading='lazy' className='h-auto w-8 hover:cursor-pointer' src={Artyst_logo} alt='Artyst' />
                    </Link>
                    <Link to='/explore' className='relative hidden sm:flex self-center text-gray-900 dark:text-gray-200 hover:text-violet-500 rounded-md text-lg font-caviar font-semibold'>
                        Explore
                        {activeRoute.includes('/explore') ? <div className='absolute h-1 w-2/6 bottom-[-2px] left-0 text-2xl bg-violet-500'></div> : null}
                    </Link>
                    <Link to='/store' className='relative hidden sm:flex self-center text-gray-900 dark:text-gray-200 hover:text-violet-500 rounded-md text-lg font-caviar font-semibold'>
                        Store
                        {activeRoute.includes('/store') ? <div className='absolute h-1 w-2/6 bottom-[-2px] left-0 text-2xl bg-violet-500'></div> : null}
                    </Link>
                </div>
                <SearchBar tags={props.common.tags} explore={props.explore} activeSearch={props.common.activeSearch} searchList={props.common.searchList} setSearchType={props.setSearchType} fetchSearchList={props.fetchSearchList} clearSearchList={props.clearSearchList} />
                <div className='hidden sm:flex flex-row space-x-2 lg:space-x-4 w-fit justify-end'>
                    {props.common.isAuthenticated ?
                        <>
                            <Link to='/explore/new' className='relative self-center text-gray-900 hover:cursor-pointer'>
                                <MdUpload className='h-7 w-7 text-gray-900 dark:text-gray-200' />
                            </Link>
                            <Link to='/store/cart' className='relative self-center rounded-md'>
                                <MdShoppingCart className='w-6 h-6 text-gray-900 dark:text-gray-200 hover:cursor-pointer' />
                                {props.user.cart && props.user.cart.length > 0 && <div className='absolute top-[-5px] left-4 px-1 bg-rose-500 font-bold text-gray-200 rounded-full text-xs'>{props.user.cart.length}</div>}
                            </Link>
                            <Link to='/notifications' className='relative self-center text-gray-900 hover:cursor-pointer'>
                                <AiFillNotification className='h-6 w-6 text-gray-900 dark:text-gray-200' />
                                {props.user.cart && props.user.cart.length > 0 && <div className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                    </span>
                                </div>}
                            </Link>
                        </>
                        :
                        <>
                            <button onClick={() => props.handleHeaderDialogOpen('openLoginDialog')} className='h-fit self-center bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 py-1 px-3 rounded-md text-lg font-caviar font-bold dark:font-normal'>Login</button>
                            <button onClick={() => props.handleHeaderDialogOpen('openRegisterDialog')} className='h-fit self-center bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 py-1 px-3 ml-3 rounded-md text-lg font-caviar font-bold dark:font-normal'>Signup</button>
                        </>
                    }
                    <div ref={userMenuRef} className='relative group w-[3.25rem] h-12'>
                        {props.common.isAuthenticated ?
                            <button onClick={() => setUserMenuActive(!userMenuActive)} className={`flex absolute inset-0 m-auto justify-center items-center ${userMenuActive ? 'bg-slate-300 dark:bg-[#313135] rounded-full' : null}`} >
                                {props.user.avatar.icon.length > 0 && <img loading='lazy' alt='user' src={fetchUserImages(props.user.avatar.icon)} className='w-8 h-8 mx-auto' />}
                            </button>
                            :
                            <button onClick={() => setUserMenuActive(!userMenuActive)} className={`flex absolute h-11 inset-0 m-auto justify-center items-center ${userMenuActive ? 'bg-slate-300 dark:bg-[#313135] rounded-full' : null}`} >
                                <FaEllipsisVertical className='w-7 h-7 text-neutral-800 dark:text-gray-300' />
                            </button>
                        }
                        <div className={`container fixed top-16 ${props.common.isAuthenticated ? 'w-96' : 'w-72'} p-1 ${userMenuActive ? 'visible opacity-100' : 'invisible opacity-0'} bg-slate-300 dark:bg-[#313135] rounded-lg`} style={{ right: window.innerWidth >= 1024 ? '0.75rem' : '0.2rem' }}>
                            <div className='flex flex-col scrollbar overflow-auto p-1 pr-2 h-full' style={{ maxHeight: 'calc(100vh - 5rem)' }}>
                                {props.common.isAuthenticated ?
                                    <>
                                        <div className='flex flex-row items-center justify-between p-4'>
                                            <div className="flex flex-row gap-2">
                                                <div className='flex relative w-14 h-14 justify-center items-center'>
                                                    <img loading='lazy' alt='user' src={fetchUserImages(props.user.avatar.icon)} className='mt-0.5' />
                                                </div>
                                                <div className='flex flex-col gap-1'>
                                                    <p className='text-gray-900 dark:text-gray-200 text-4xl font-caviar font-semibold'>{props.user.name}
                                                    </p>
                                                    <div className='inline-flex flex-row items-center gap-1'>
                                                        <p className='text-gray-900 dark:text-gray-200 text-sm font-caviar font-semibold tracking-wide'>#{props.user.username}</p>
                                                        <svg className="stroke-current stroke-1 text-emerald-500 dark:text-emerald-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <img loading='lazy' className='h-auto w-6' src={premium_logo} alt='Artyst' />
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={logout} className='cursor-pointer text-violet-400 dark:text-violet-500'>
                                                <HiOutlineLogout className='h-9 w-9' />
                                            </button>
                                        </div>
                                        <button onClick={() => { navigate('/premium'); setUserMenuActive(false) }} className='flex flex-row justify-center bg-slate-200 dark:bg-neutral-900 items-center gap-1 mb-1 px-3 rounded-md w-full'>
                                            <div className='flex items-center justify-center h-12 w-12 rounded-md'>
                                                <img loading='lazy' className='h-auto w-8' src={premium_logo} alt='Artyst' />
                                            </div>
                                            <p className='font-caviar font-semibold text-gray-900 dark:text-gray-300'>Upgrade to Artyst Premium</p>
                                        </button>
                                        <div className='flex flex-row justify-between items-center rounded-md py-1 px-4'>
                                            <div className='flex flex-row gap-2 items-center'>
                                                <img loading='lazy' className='h-8' src={TokenLogo} />
                                                <div>
                                                    <p className='font-caviar font-bold dark:font-semibold text-gray-900 dark:text-gray-300'>Tokens</p>
                                                    <p className='font-caviar items-center font-semibold dark:font-normal text-gray-900 dark:text-gray-300'>{props.user.tokens} tokens</p>
                                                </div>
                                            </div>
                                            <FaPlus className='h-7 w-7 text-violet-500 cursor-pointer' onClick={() => setTokenOpen(true)} />
                                        </div>
                                    </> : null}
                                <ThemeToggle value={props.common.theme} toggle={props.switchTheme} />
                                {props.common.isAuthenticated ?
                                    <>
                                        <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                        <div className='flex flex-col'>
                                            <Link to={`/users/${props.user.id}`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                                <PiUserBold className='h-5 w-5' />
                                                <span className='text-lg font-caviar font-semibold tracking-wider'>My Profile</span>
                                            </Link>
                                            <Link to={`/users/${props.user.id}/pins`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                                <PiPushPinBold className='h-5 w-5' />
                                                <span className='text-lg font-caviar font-semibold tracking-wider'>My Pins</span>
                                            </Link>
                                            <Link to={`/users/${props.user.id}/space`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                                <PiUsersThreeBold className='h-5 w-5' />
                                                <span className='text-lg font-caviar font-semibold tracking-wider'>My Space</span>
                                            </Link>
                                            <Link to={`/users/${props.user.id}/history`} onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                                <MdOutlineHistory className='h-5 w-5' />
                                                <span className='text-lg font-caviar font-semibold tracking-wider'>My History</span>
                                            </Link>
                                            <Link to='/settings' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                                <TbSettings className='h-5 w-5' />
                                                <span className='text-lg font-caviar font-semibold tracking-wider'>Settings</span>
                                            </Link>
                                            <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                            <Link to='/studio' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                                <PiChalkboardSimpleBold className='h-5 w-5' />
                                                <span className='text-lg font-caviar font-semibold tracking-wider'>Artyst Studio</span>
                                            </Link>
                                            <Link to='/studio/earnings' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2'>
                                                <MdOutlineAttachMoney className='h-5 w-5' />
                                                <span className='text-lg font-caviar font-semibold tracking-wider'>Earnings</span>
                                            </Link>
                                            <Link to='/studio/payments' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                                <MdOutlineReceiptLong className='h-5 w-5' />
                                                <span className='text-lg font-caviar font-semibold tracking-wider'>Billing & Payments</span>
                                            </Link>
                                        </div>
                                    </> : null}
                                <div className='flex flex-col'>
                                    {/* <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' /> */}
                                    <Link to='/about' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                        <TbInfoCircle className='h-5 w-5' />
                                        <span className='text-lg font-caviar font-semibold tracking-wider'>About</span>
                                    </Link>
                                    <Link to='/help' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                        <MdHelpOutline className='h-5 w-5' />
                                        <span className='text-lg font-caviar font-semibold tracking-wider'>Help</span>
                                    </Link>
                                    <Link to='/tos' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                        <TbGavel className='h-5 w-5' />
                                        <span className='text-lg font-caviar font-semibold tracking-wider'>Terms of Service</span>
                                    </Link>
                                    <Link to='/privacy' onClick={() => setUserMenuActive(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                        <BiLock className='h-5 w-5' />
                                        <span className='text-lg font-caviar font-semibold tracking-wider'>Privacy Policy</span>
                                    </Link>
                                    <p className='font-caviar text-sm p-3 items-center font-bold dark:font-normal text-neutral-500 dark:text-gray-300'>
                                        Artyst Private Limited <span className='text-base'>&#169;</span> 2023. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex sm:hidden ml-auto'>
                    <button className='h-10 w-10 relative p-1' onClick={() => { setMobileMenu(!mobileMenu) }}>
                        <IoMenu className={`absolute inset-0 m-auto h-8 w-8 ${mobileMenu ? 'opacity-0 duration-100' : 'opacity-100 duration-1000'} text-violet-500 transition-opacity fade-out`} />
                        <IoClose className={`absolute inset-0 m-auto h-8 w-8 ${mobileMenu ? 'opacity-100 duration-1000 ' : 'opacity-0 duration-100'} text-violet-500 transition-opacity fade-in`} />
                    </button>
                </div>
            </div>
            {mobileMenu ?
                <div className='flex flex-col space-y-2 p-3 overflow-y-auto w-auto' style={{ height: 'calc(100vh - 3.75rem)' }}>
                    {props.common.isAuthenticated ?
                        <div className="flex flex-col gap-2 bg-gray-300 dark:bg-neutral-800 p-3 rounded-md">
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-row gap-2'>
                                    <div className='flex relative w-14 h-14 justify-center items-center'>
                                        <img loading='lazy' alt='user' src={fetchUserImages(props.user.avatar.icon)} className='mt-0.5' />
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='text-gray-900 dark:text-gray-200 text-3xl font-caviar font-semibold'>{props.user.name}</p>
                                        <div className='inline-flex flex-row items-center gap-1'>
                                            <p className='text-gray-900 dark:text-gray-200 text-xs font-caviar font-semibold tracking-wide'>#{props.user.username}</p>
                                            <svg className="stroke-current stroke-1 text-emerald-500 dark:text-emerald-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <img loading='lazy' className='h-auto w-6' src={premium_logo} alt='Artyst' />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={logout} className='cursor-pointer text-violet-400 dark:text-violet-500'>
                                    <HiOutlineLogout className='h-9 w-9' />
                                </button>
                            </div>
                            <button onClick={() => { navigate('/premium'); setMobileMenu(false) }} className='flex flex-row gap-1 justify-center bg-slate-200 dark:bg-neutral-700 items-center px-3 rounded-md'>
                                <div className='flex items-center justify-center w-12 h-12 rounded-md'>
                                    <img loading='lazy' className='h-auto w-8' src={premium_logo} alt='Artyst' />
                                </div>
                                <p className='font-caviar font-semibold text-gray-900 dark:text-gray-300'>Upgrade to Artyst Premium</p>
                            </button>
                            <div className='flex flex-row justify-between items-center rounded-md'>
                                <div className='flex flex-row gap-2 items-center'>
                                    <img loading='lazy' className='h-8' src={TokenLogo} />
                                    <div>
                                        <p className='font-caviar font-bold dark:font-semibold text-gray-900 dark:text-gray-300'>Tokens</p>
                                        <p className='font-caviar items-center font-semibold dark:font-normal text-gray-900 dark:text-gray-300'>{props.user.tokens} tokens</p>
                                    </div>
                                </div>
                                <FaPlus className='h-7 w-7 text-violet-500 cursor-pointer' onClick={() => setTokenOpen(true)} />
                            </div>
                        </div> :
                        <div className='flex flex-row w-full space-x-3 mb-2'>
                            <button onClick={() => props.handleHeaderDialogOpen('openLoginDialog')} className='w-full bg-violet-500 text-gray-900 dark:text-gray-200 px-3 py-1 rounded-md text-lg tracking-wide font-caviar font-bold dark:font-normal'>Login</button>
                            <button onClick={() => props.handleHeaderDialogOpen('openRegisterDialog')} className='w-full bg-violet-500 text-gray-900 dark:text-gray-200 px-3 py-1 rounded-md text-lg tracking-wide font-caviar font-bold dark:font-normal'>Signup</button>
                        </div>
                    }
                    <div className='flex flex-row justify-between items-center rounded-md px-2'>
                        <p className='text-lg font-caviar font-semibold text-gray-900 dark:text-gray-200 '>Theme</p>
                        <div className='flex gap-2'>
                            <button disabled={props.common.theme === 'light'} className='flex gap-2 items-center drop-shadow-md rounded-lg p-2 shadow-sm bg-yellow-400 dark:bg-yellow-500 border-2 border-solid border-red-400' onClick={() => props.switchTheme('light')}>
                                <PiSunHorizonBold className='h-5 w-5 text-neutral-800' />
                            </button>
                            <button disabled={props.common.theme === 'dark'} className='flex gap-2 items-center drop-shadow-md rounded-lg p-2 shadow-sm bg-blue-400 dark:bg-blue-500' onClick={() => props.switchTheme('dark')}>
                                <PiMoonStarsBold className='h-5 w-5 text-neutral-800' />
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col h-full'>
                        {props.common.isAuthenticated ?
                            <>
                                <Link to='/settings' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <TbSettings className='h-5 w-5' />
                                    <span className='text-lg font-caviar font-semibold tracking-wider'>Settings</span>
                                </Link>
                                <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                <Link to={`/users/${props.user.id}`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiUserBold className='h-5 w-5' />
                                    <span className='text-lg font-caviar font-semibold tracking-wider'>My Profile</span>
                                </Link>
                                <Link to={`/users/${props.user.id}/pins`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiPushPinBold className='h-5 w-5' />
                                    <span className='text-lg font-caviar font-semibold tracking-wider'>My Pins</span>
                                </Link>
                                <Link to={`/users/${props.user.id}/space`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiUsersThreeBold className='h-5 w-5' />
                                    <span className='text-lg font-caviar font-semibold tracking-wider'>My Space</span>
                                </Link>
                                <Link to={`/users/${props.user.id}/history`} onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <MdOutlineHistory className='h-5 w-5' />
                                    <span className='text-lg font-caviar font-semibold tracking-wider'>My History</span>
                                </Link>
                                <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                                <Link to='/studio' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <PiChalkboardSimpleBold className='h-5 w-5' />
                                    <span className='text-lg font-caviar font-semibold tracking-wider'>Artyst Studio</span>
                                </Link>
                                <Link to='/studio/earnings' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-2'>
                                    <MdOutlineAttachMoney className='h-5 w-5' />
                                    <span className='text-lg font-caviar font-semibold tracking-wider'>Earnings</span>
                                </Link>
                                <Link to='/studio/payments' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                                    <MdOutlineReceiptLong className='h-5 w-5' />
                                    <span className='text-lg font-caviar font-semibold tracking-wider'>Billing & Payments</span>
                                </Link>
                            </> : null}
                        <hr className='border-2 border-gray-400 dark:border-neutral-800 my-1.5 mx-2' />
                        <Link to='/about' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <TbInfoCircle className='h-5 w-5' />
                            <span className='text-lg font-caviar font-semibold tracking-wider'>About</span>
                        </Link>
                        <Link to='/help' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <MdHelpOutline className='h-5 w-5' />
                            <span className='text-lg font-caviar font-semibold tracking-wider'>Help</span>
                        </Link>
                        <Link to='/tos' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <TbGavel className='h-5 w-5' />
                            <span className='text-lg font-caviar font-semibold tracking-wider'>Terms of Service</span>
                        </Link>
                        <Link to='/privacy' onClick={() => setMobileMenu(false)} className='flex items-center text-gray-900 dark:text-gray-200 py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-neutral-700 space-x-3 rounded-md'>
                            <BiLock className='h-5 w-5' />
                            <span className='text-lg font-caviar font-semibold tracking-wider'>Privacy Policy</span>
                        </Link>
                        <p className='font-caviar mt-auto text-sm p-3 items-center font-bold dark:font-normal text-neutral-500 dark:text-gray-300'>
                            Artyst Private Limited <span className='text-base'>&#169;</span> 2023. All rights reserved.
                        </p>
                    </div>
                </div>
                : null
            }
            {
                props.common.openLoginDialog &&
                <LoginModal
                    open={props.common.openLoginDialog}
                    title={props.common.dialogTitle}
                    banner={props.common.loginImage}
                    error={props.common.authError}
                    setAuthError={props.setAuthError}
                    onClose={props.handleHeaderDialogClose}
                    onClick={props.handleHeaderDialogClose}
                    openRegister={() => props.handleHeaderDialogOpen('openRegisterDialog')}
                    handleSignIn={props.handleSignIn}
                />
            }
            {
                props.common.openRegisterDialog &&
                <RegisterModal
                    open={props.common.openRegisterDialog}
                    title={props.common.dialogTitle}
                    banner={props.common.signupImage}
                    error={props.common.authError}
                    setAuthError={props.setAuthError}
                    onClose={props.handleHeaderDialogClose}
                    onClick={props.handleHeaderDialogClose}
                    openLogin={() => props.handleHeaderDialogOpen('openLoginDialog')}
                    handleSignUp={props.handleSignUp}
                    handleGoogleAuth={props.handleGoogleAuth}
                />
            }
            {
                tokenOpen &&
                <TokenModal
                    open={tokenOpen}
                    user={props.user}
                    title='Get Tokens'
                    onClose={() => setTokenOpen(false)}
                    onClick={() => setTokenOpen(false)}
                />
            }
            {
                props.common.signupSuccess &&
                <SignupSuccessModal
                    open={props.common.signupSuccess}
                    user={props.user}
                    title={`Welcome to Artyst, ${props.user.name}!`}
                    onClose={props.handleSignupSuccessMsgClose}
                    onClick={props.handleSignupSuccessMsgClose}
                />
            }
        </nav >
    );
};

const mapStateToProps = (state, props) => ({
    common: state.common,
    user: state.common.user,
    explore: state.explore,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    switchTheme,
    setAuthError,
    handleHeaderDialogOpen,
    handleHeaderDialogClose,
    handleSignIn,
    handleSignUp,
    handleGoogleAuth,
    handleSignOut,
    handleSignupSuccessMsgClose,
    setSearchType,
    fetchSearchList,
    clearSearchList
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
