import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Artyst_logo from '../assets/images/artyst_header.svg';
import DarkMode from '../assets/images/DarkMode.svg';
import LightMode from '../assets/images/LightMode.svg';
import TokenLogo from '../assets/images/coin.png';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IoAddCircleSharp } from "react-icons/io5";
import { MdSettings } from "react-icons/md";

import { handleHeaderDialogOpen, handleHeaderDialogClose, handleSignin, handleSignOut } from '../store/actions/common.actions';
import { fetchUserImages } from '../api';

const Header = (props) => {
    const [myTheme, toggleTheme] = useState('');
    const [username, setUsername] = useState('akn787');
    const [password, setPassword] = useState('Akn@1234');
    const [stayLoggedIn, setLoggedIn] = useState(true);

    const onSubmitClick = () => {
        setUsername('');
        setPassword('');
        const signinInput = {
            username: username,
            password: password,
        }
        props.handleSignin(stayLoggedIn, signinInput);
    }

    const logout = () => {
        props.handleSignOut();
    }

    return (
        <nav className='bg-slate-200 dark:bg-darkNavBg w-full fixed px-2 top-0 drop-shadow-md'>
            <div className='h-14 px-2 sm:px-2 lg:px-4'>
                <div className='flex-shrink-0 flex h-full items-center'>
                    <Link to='/'>
                        <img className='block h-7 w-auto hover:cursor-pointer' src={Artyst_logo} alt='Artyst' />
                    </Link>
                    <div className='flex ml-auto'>
                        <Link to='/explore' className='text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-2 rounded-md text-lg font-caviar font-bold'>
                            Explore
                        </Link>
                        <Link to='/store' className='text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-2 rounded-md text-lg font-caviar font-bold'>
                            Store
                        </Link>
                        <Link to='/profile' className='text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-2 rounded-md text-lg font-caviar font-bold'>
                            Profile
                        </Link>
                        <button onClick={onSubmitClick} className='text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-2 rounded-md text-lg font-caviar font-bold'>Login</button>
                        <button onClick={logout} className='text-gray-900 dark:text-gray-200 hover:text-violet-500 px-3 py-2 rounded-md text-lg font-caviar font-bold'>Logout</button>
                        {props.common.isAuthenticated ?
                            <div className='relative group group-hover:block ml-1'>
                                <div className='flex relative w-10 h-10 justify-center items-center text-xl group-hover:p-1 group-hover:scale-125 group-hover:rounded-b-lg group-hover:block group-hover:bg-slate-300 group-hover:rounded-full'>
                                    <img alt='user' src={fetchUserImages(props.user.avatar.icon)} />
                                </div>
                                <div className='container hidden fixed group-hover:block top-12 w-52' style={{ right: '0.7rem' }}>
                                    <div className='grid grid-cols-1 space-y-2 bg-slate-300 text-white rounded-tl-lg rounded-br-lg p-3 rounded-bl-lg group-hover:block'>
                                        <div className='flex place-content-between'>
                                            <div className='block text-left'>
                                                <p className='text-gray-900 dark:text-gray-200 text-md font-caviar font-semibold'>{props.user.name}</p>
                                                <a href="#" className='text-gray-900 dark:text-gray-200 text-xs font-caviar font-semibold'>#{props.user.username}</a>
                                            </div>
                                            <button className='rounded px-1.5 py-0.5 m-1 border-b-4 border-l-2 shadow-sm bg-gray-200 border-gray-300' onClick={() => console.log('toggle theme')}>
                                                <img src={LightMode} />
                                            </button>
                                        </div>
                                        <hr />
                                        <div className='flex items-center'>
                                            <img className='h-8' src={TokenLogo} />
                                            <div className='block text-left ml-1'>
                                                <p className='text-gray-900 dark:text-gray-200 text-sm font-caviar font-semibold'>Tokens</p>
                                                <p className='flex items-center text-gray-900 dark:text-gray-200 text-xs font-caviar'>{props.user.tokens} tokens <IoAddCircleSharp className='mx-0.5 text-base' /></p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <a href="#" className='flex items-center text-gray-900 dark:text-gray-200 text-base font-caviar font-semibold'><MdSettings className='mx-1.5 text-lg' /> Settings</a>
                                        </div>
                                        <div className='flex flex-col'>
                                            <a href="#" className="bg-white rounded-md text-black text-center uppercase px-2 py-1 transition duration-300 ease-in-out hover:bg-gray-100">
                                                Sign Out
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            ''
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
};

const mapStateToProps = (state, props) => ({
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    handleHeaderDialogOpen,
    handleHeaderDialogClose,
    handleSignin,
    handleSignOut
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
