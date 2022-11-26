import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Artyst_logo from '../assets/images/artyst_header.svg';
import DarkMode from '../assets/images/DarkMode.svg';
import LightMode from '../assets/images/LightMode.svg';
import TokenLogo from '../assets/images/money.png';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IoAddCircleSharp, IoMenu } from "react-icons/io5";
import { MdSettings } from "react-icons/md";
import { RiFireFill } from "react-icons/ri";
import { TokenModal, LoginModal, RegisterModal, SignupSuccessModal } from '../components/Modal';

import { switchTheme, setAuthError, handleHeaderDialogOpen, handleHeaderDialogClose, handleSignIn, handleSignUp, handleGoogleAuth, handleSignOut, handleSignupSuccessMsgClose } from '../store/actions/common.actions';
import { fetchUserImages } from '../api';

const Header = (props) => {
    let navigate = useNavigate();
    const location = useLocation();
    const [tokenOpen, setTokenOpen] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [activeRoute, setActiveRoute] = useState('');

    const logout = () => {
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
        <nav className='bg-slate-100 dark:bg-darkNavHeader w-full fixed top-0 z-50 shadow-[0_4px_3px_rgba(175,175,175,0.55),_0_2px_2px_rgba(175,175,175,0.5)] dark:shadow-[0_4px_3px_rgba(45,45,45,0.55),_0_2px_2px_rgba(45,45,45,0.5)]'>
            <div className={`${mobileMenu ? 'h-screen' : 'h-14'} px-2 lg:px-4`}>
                <div className={`flex ${mobileMenu ? 'h-14' : 'h-full'} items-center`}>
                    <Link to='/' onClick={() => setMobileMenu(false)}>
                        <img loading='lazy' className='block h-6 w-auto hover:cursor-pointer' src={Artyst_logo} alt='Artyst' />
                    </Link>
                    <div className='sm:flex hidden ml-auto'>
                        <Link to='/explore' className='relative self-center text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>
                            Explore
                            {activeRoute.includes('/explore') ? <span className='absolute bottom-[-10px] left-2 text-2xl text-violet-500'>&#9866;</span> : null}
                        </Link>
                        <Link to='/store' className='relative self-center text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>
                            Store
                            {activeRoute.includes('/store') ? <span className='absolute bottom-[-10px] left-2 text-2xl text-violet-500'>&#9866;</span> : null}
                        </Link>
                        {props.common.isAuthenticated ?
                            <div className='relative group group-hover:block ml-1'>
                                <div className='flex relative w-10 h-10 justify-center items-center text-xl group-hover:p-1 group-hover:scale-125 group-hover:rounded-b-lg group-hover:block group-hover:bg-slate-300 dark:group-hover:bg-[#313135] group-hover:rounded-full'>
                                    {props.common.isAuthenticated ? <img loading='lazy' alt='user' src={fetchUserImages(props.user.avatar.icon)} className='mt-0.5' /> : null}
                                </div>
                                <div className='container hidden fixed group-hover:block top-[3.25rem] w-52' style={{ right: window.innerWidth > 1024 ? '0.725rem' : '0.2rem' }}>
                                    <div className='grid grid-cols-1 space-y-2 bg-slate-300 dark:bg-[#313135] text-white rounded-tl-lg rounded-br-lg p-3 rounded-bl-lg group-hover:block'>
                                        <div className='flex place-content-between'>
                                            <div className='block text-left'>
                                                <p className='text-gray-900 dark:text-gray-300 text-md font-caviar font-semibold'>{props.user.name}</p>
                                                <Link to={`/users/${props.user.id}`} className='text-gray-900 dark:text-gray-300 text-xs font-caviar font-semibold'>#{props.user.username}</Link>
                                            </div>
                                            {props.common.theme === 'dark' ?
                                                <button className='rounded px-1.5 py-0.5 m-1 shadow-sm bg-gray-300 border-gray-300' onClick={() => props.switchTheme('light')}>
                                                    <img loading='lazy' src={LightMode} />
                                                </button>
                                                :
                                                <button className='rounded px-1.5 py-0.5 m-1 shadow-sm bg-neutral-900 border-gray-300' onClick={() => props.switchTheme('dark')}>
                                                    <img loading='lazy' src={DarkMode} />
                                                </button>
                                            }
                                        </div>
                                        <hr className='border-neutral-800 dark:border-neutral-200' />
                                        <div className='flex items-center'>
                                            <img loading='lazy' className='h-8' src={TokenLogo} />
                                            <div className='block text-left ml-1'>
                                                <p className='text-gray-900 dark:text-gray-300 text-sm font-caviar font-semibold'>Tokens</p>
                                                <p className='flex items-center text-gray-900 dark:text-gray-300 text-xs font-caviar'>{props.user.tokens} tokens <IoAddCircleSharp className='mx-1 text-base text-violet-500 cursor-pointer' onClick={() => setTokenOpen(true)} /></p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <Link to='/settings' className='flex items-center text-gray-900 dark:text-gray-200 text-base font-caviar font-bold dark:font-normal'><MdSettings className='mr-1 text-lg' /> Settings</Link>
                                        </div>
                                        {/* <div className='flex flex-col'>
                                            <Link to='/' className='flex items-center text-gray-900 dark:text-gray-200 text-base font-caviar font-bold dark:font-normal'><RiFireFill className='mr-1 text-lg' /> Premium</Link>
                                        </div> */}
                                        <div className='flex flex-col'>
                                            <button onClick={logout} className="bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal">
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <>
                                <button onClick={() => props.handleHeaderDialogOpen('openLoginDialog')} className='bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>Login</button>
                                <button onClick={() => props.handleHeaderDialogOpen('openRegisterDialog')} className='bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 ml-3 rounded-md text-lg font-caviar font-bold dark:font-normal'>Signup</button>
                                {props.common.theme === 'dark' ?
                                    <button className='rounded px-1.5 py-1 ml-3 shadow-sm bg-gray-300 border-gray-300' onClick={() => props.switchTheme('light')}>
                                        <img loading='lazy' src={LightMode} />
                                    </button>
                                    :
                                    <button className='rounded px-1.5 py-1 ml-1 shadow-sm bg-neutral-900 border-gray-300' onClick={() => props.switchTheme('dark')}>
                                        <img loading='lazy' src={DarkMode} />
                                    </button>
                                }
                            </>
                        }

                    </div>
                    <div className='sm:hidden flex ml-auto'>
                        <button className='p-1' onClick={() => { setMobileMenu(!mobileMenu) }}>
                            <IoMenu className='h-8 w-8 text-violet-500' />
                        </button>
                    </div>
                </div>
                {mobileMenu ?
                    <div className='flex flex-col space-y-4 text-white'>
                        {props.common.isAuthenticated ?
                            <div className='ml-1'>
                                <div className='grid grid-cols-1 w-full space-y-2 bg-slate-300 dark:bg-[#313135] text-white rounded-lg p-3 rounded-bl-lg group-hover:block'>
                                    <div className='flex place-content-between'>
                                        <div className='flex relative w-10 h-10 justify-center items-center text-xl group-hover:p-1 group-hover:scale-125 group-hover:rounded-b-lg group-hover:block group-hover:bg-slate-300 dark:group-hover:bg-[#313135] group-hover:rounded-full'>
                                            {props.common.isAuthenticated ? <img loading='lazy' alt='user' src={fetchUserImages(props.user.avatar.icon)} className='mt-0.5' /> : null}
                                        </div>
                                        <div className='block text-left'>
                                            <p className='text-gray-900 dark:text-gray-300 text-md font-caviar font-semibold'>{props.user.name}</p>
                                            <Link to={`/users/${props.user.id}`} onClick={() => setMobileMenu(false)} className='text-gray-900 dark:text-gray-300 text-xs font-caviar font-semibold'>#{props.user.username}</Link>
                                        </div>
                                    </div>
                                    <hr className='border-neutral-800 dark:border-neutral-200' />
                                    <div className='flex items-center'>
                                        <img loading='lazy' className='h-8' src={TokenLogo} />
                                        <div className='block text-left ml-1'>
                                            <p className='text-gray-900 dark:text-gray-300 text-sm font-caviar font-semibold'>Tokens</p>
                                            <p className='flex items-center text-gray-900 dark:text-gray-300 text-xs font-caviar'>{props.user.tokens} tokens <IoAddCircleSharp className='mx-1 text-base text-violet-500 cursor-pointer' onClick={() => setTokenOpen(true)} /></p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <button onClick={logout} className="bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal">
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        <Link to='/explore' onClick={() => setMobileMenu(false)} className='text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>
                            Explore
                        </Link>
                        <Link to='/store' onClick={() => setMobileMenu(false)} className='text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>
                            Store
                        </Link>
                        <Link to='/' onClick={() => setMobileMenu(false)} className='text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>
                            Settings
                        </Link>
                        <Link to='/' onClick={() => setMobileMenu(false)} className='text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>
                            Premium
                        </Link>
                        {props.common.isAuthenticated ?
                            null :
                            <div className='flex'>
                                <button onClick={() => props.handleHeaderDialogOpen('openLoginDialog')} className='bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>Login</button>
                                <button onClick={() => props.handleHeaderDialogOpen('openRegisterDialog')} className='bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 ml-3 rounded-md text-lg font-caviar font-bold dark:font-normal'>Signup</button>
                            </div>}
                    </div>
                    : null
                }
            </div>
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
                    title='Welcome!'
                    onClose={props.handleSignupSuccessMsgClose}
                    onClick={props.handleSignupSuccessMsgClose}
                />
            }
        </nav >
    );
};

const mapStateToProps = (state, props) => ({
    common: state.common,
    user: state.common.user
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
    handleSignupSuccessMsgClose
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
