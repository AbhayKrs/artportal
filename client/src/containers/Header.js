import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Artyst_logo from '../assets/images/artyst_header.svg';
import DarkMode from '../assets/images/DarkMode.svg';
import LightMode from '../assets/images/LightMode.svg';
import TokenLogo from '../assets/images/money.png';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IoAddCircleSharp } from "react-icons/io5";
import { MdSettings } from "react-icons/md";
import { TokenModal, LoginModal, RegisterModal } from '../components/Modal';

import { switchTheme, handleHeaderDialogOpen, handleHeaderDialogClose, handleSignIn, handleSignUp, handleSignOut } from '../store/actions/common.actions';
import { fetchUserImages } from '../api';

const Header = (props) => {
    const [myTheme, toggleTheme] = useState('');
    const [tokenOpen, setTokenOpen] = useState(false);

    const logout = () => props.handleSignOut();

    return (
        <nav className='bg-slate-100 dark:bg-darkNavHeader w-full fixed top-0 z-50 shadow-[0_4px_3px_rgba(175,175,175,0.55),_0_2px_2px_rgba(175,175,175,0.5)] dark:shadow-[0_4px_3px_rgba(45,45,45,0.55),_0_2px_2px_rgba(45,45,45,0.5)]'>
            <div className='h-14 px-2 sm:px-2 lg:px-4'>
                <div className='flex h-full items-center'>
                    <Link to='/'>
                        <img className='block h-6 w-auto hover:cursor-pointer' src={Artyst_logo} alt='Artyst' />
                    </Link>
                    <div className='flex ml-auto'>
                        <Link to='/explore' className='self-center text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>
                            Explore
                        </Link>
                        <Link to='/store' className='self-center text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>
                            Store
                        </Link>
                        <Link to='/profile' className='self-center text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>
                            Profile
                        </Link>
                        {props.common.isAuthenticated ?
                            <div className='relative group group-hover:block ml-1'>
                                <div className='flex relative w-10 h-10 justify-center items-center text-xl group-hover:p-1 group-hover:scale-125 group-hover:rounded-b-lg group-hover:block group-hover:bg-slate-300 dark:group-hover:bg-neutral-800 group-hover:rounded-full'>
                                    <img alt='user' src={fetchUserImages(props.user.avatar.icon)} />
                                </div>
                                <div className='container hidden fixed group-hover:block top-12 w-52' style={{ right: '0.2rem' }}>
                                    <div className='grid grid-cols-1 space-y-2 bg-slate-300 dark:bg-neutral-800 text-white rounded-tl-lg rounded-br-lg p-3 rounded-bl-lg group-hover:block'>
                                        <div className='flex place-content-between'>
                                            <div className='block text-left'>
                                                <p className='text-gray-900 dark:text-gray-300 text-md font-caviar font-semibold'>{props.user.name}</p>
                                                <Link to='/' className='text-gray-900 dark:text-gray-300 text-xs font-caviar font-semibold'>#{props.user.username}</Link>
                                            </div>
                                            {props.common.theme === 'dark' ?
                                                <button className='rounded px-1.5 py-0.5 m-1 shadow-sm bg-gray-300 border-gray-300' onClick={() => props.switchTheme('light')}>
                                                    <img src={LightMode} />
                                                </button>
                                                :
                                                <button className='rounded px-1.5 py-0.5 m-1 shadow-sm bg-neutral-900 border-gray-300' onClick={() => props.switchTheme('dark')}>
                                                    <img src={DarkMode} />
                                                </button>
                                            }
                                        </div>
                                        <hr className='border-neutral-800 dark:border-neutral-200' />
                                        <div className='flex items-center'>
                                            <img className='h-8' src={TokenLogo} />
                                            <div className='block text-left ml-1'>
                                                <p className='text-gray-900 dark:text-gray-300 text-sm font-caviar font-semibold'>Tokens</p>
                                                <p className='flex items-center text-gray-900 dark:text-gray-300 text-xs font-caviar'>{props.user.tokens} tokens <IoAddCircleSharp className='mx-0.5 text-base cursor-pointer' onClick={() => setTokenOpen(true)} /></p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <Link to='/' className='flex items-center text-gray-900 dark:text-violet-700 text-base font-caviar font-semibold'><MdSettings className='mr-1.5 text-lg' /> Settings</Link>
                                        </div>
                                        <div className='flex flex-col'>
                                            <button onClick={logout} className="bg-gray-200 rounded-md font-caviar font-bold text-gray-900 text-center uppercase px-2 py-1 transition duration-300 ease-in-out hover:bg-gray-100">
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <>
                                <button onClick={() => props.handleHeaderDialogOpen('openLoginDialog')} className='bg-violet-700/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>Login</button>
                                <button onClick={() => props.handleHeaderDialogOpen('openRegisterDialog')} className='bg-violet-700/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 ml-3 rounded-md text-lg font-caviar font-bold dark:font-normal'>Signup</button>
                            </>
                        }
                    </div>
                </div>
            </div>
            <LoginModal
                open={props.common.openLoginDialog}
                title={props.common.dialogTitle}
                banner={props.common.loginImage}
                error={props.common.error}
                onClose={props.handleHeaderDialogClose}
                onClick={props.handleHeaderDialogClose}
                openRegister={() => props.handleHeaderDialogOpen('openRegisterDialog')}
                handleSignIn={props.handleSignIn}
            />
            <RegisterModal
                open={props.common.openRegisterDialog}
                title={props.common.dialogTitle}
                banner={props.common.signupImage}
                error={props.common.error}
                onClose={props.handleHeaderDialogClose}
                onClick={props.handleHeaderDialogClose}
                openLogin={() => props.handleHeaderDialogOpen('openLoginDialog')}
                handleSignUp={props.handleSignUp}
            />
            <TokenModal
                open={tokenOpen}
                user={props.user}
                title='Get Tokens'
                onClose={() => setTokenOpen(false)}
                onClick={() => setTokenOpen(false)}
            />
        </nav>
    );
};

const mapStateToProps = (state, props) => ({
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    switchTheme,
    handleHeaderDialogOpen,
    handleHeaderDialogClose,
    handleSignIn,
    handleSignUp,
    handleSignOut
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
