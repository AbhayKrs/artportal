import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';
import { AwardTabPanel } from './TabPanel';

import TokenLogo from '../assets/images/money.png';

import { fetchUserImages } from '../api';

export const LoginModal = (props) => {
    const { open, title, banner, error, onClose, openRegister, handleSignIn } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setLoggedIn] = useState(false);

    const handleStayLoggedin = (event) => {
        setLoggedIn(event.target.checked);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const onSubmitClick = () => {
        const signinInput = {
            username: username,
            password: password,
        }
        handleSignIn(stayLoggedIn, signinInput);
        setUsername('');
        setPassword('');
    }
    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-6/12 sm:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid grid-cols-2'>
                    <img src={fetchUserImages(banner)} />
                    <div className='p-4 pt-2 flex flex-col space-y-3'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 dark:text-violet-800 text-5xl font-semibold tracking-widest font-antipasto pt-5'>{title}</h1>
                        <p className='text-black dark:text-white text-md font-josefinlight'>Become an Artyst Member <button type='button' onClick={() => { onClose(); openRegister() }} className='text-sm font-bold text-violet-500'>JOIN</button></p>
                        <div className="flex items-center pt-10">
                            <div className='px-3 py-2.5 bg-gray-300 rounded-l'>
                                <FaUser className="h-5 w-5 text-violet-500" />
                            </div>
                            <input
                                name="username"
                                value={username}
                                className="rounded-r p-2 w-full focus:outline-none"
                                type="text"
                                placeholder="Username"
                                onChange={handleUsernameChange}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        onSubmitClick()
                                    }
                                }}
                            />
                        </div>
                        <div className="flex items-center">
                            <div className='px-3 py-2.5 bg-gray-300 rounded-l'>
                                <FaLock className="h-5 w-5 text-violet-500" />
                            </div>
                            <input
                                name="password"
                                value={password}
                                className="rounded-r p-2 w-full focus:outline-none"
                                type="password"
                                placeholder="Password"
                                onChange={handlePasswordChange}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        onSubmitClick()
                                    }
                                }}
                            />
                        </div>
                        <label className="flex items-center cursor-pointer space-x-1">
                            <input type="checkbox" checked={stayLoggedIn} onChange={handleStayLoggedin} className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-violet-500 cursor-pointer mr-1" />
                            <p className='font-caviar text-sm text-gray-900 dark:text-gray-300'>Keep me logged in</p>
                        </label>
                        {error.message && !username && !password ?
                            <div className='flex p-2 border-2 border-red-500 rounded-lg space-x-2'>
                                <IoCloseCircle className='h-5 w-5 text-red-500' />
                                <p className='font-caviar font-bold text-sm text-red-500'>{error.message}</p>
                            </div> :
                            null
                        }
                        <button onClick={onSubmitClick} className='w-20 bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-4 py-2 rounded-md text-lg font-caviar font-bold dark:font-normal'>Login</button>
                        <p className='text-gray-700 dark:text-gray-500 text-sm'>By clicking Sign In, I confirm that I have read and agree to the Artyst <button type='button' className='text-sm font-bold text-violet-500'>Terms of Service</button> and <button type='button' className='text-sm font-bold text-violet-500'>Privacy Policy</button>.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const RegisterModal = (props) => {
    const { open, title, banner, error, onClose, openLogin, handleSignUp } = props;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value)
    }
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }
    const handleConfirmPasswordChange = (event) => {
        setPassword2(event.target.value)
    }

    const onSubmitClick = () => {
        const signupInput = {
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        }
        handleSignUp(signupInput);
    }

    const onReset = () => {
        setName('');
        setEmail('');
        setUsername('');
        setPassword('');
        setPassword2('');
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-6/12 sm:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid grid-cols-2'>
                    <img className='h-full' src={fetchUserImages(banner)} />
                    <div className='p-4 pt-2 flex flex-col space-y-3'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 dark:text-violet-800 text-5xl font-semibold tracking-widest font-antipasto pt-5'>{title}</h1>
                        <p className='text-black dark:text-white text-md font-josefinlight'>Already an Artyst Member? <button type='button' onClick={() => { onClose(); openLogin() }} className='text-sm font-bold text-violet-500'>SIGN IN</button></p>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-300 rounded-l'>                           </div>
                            <input name="name" value={name} className="rounded-r p-1.5 w-full focus:outline-none" type="text" placeholder="Name" onChange={handleNameChange} />
                        </div>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-300 rounded-l'>                           </div>
                            <input name="username" value={username} className="rounded-r p-1.5 w-full focus:outline-none" type="text" placeholder="Username" onChange={handleUsernameChange} />
                        </div>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-300 rounded-l'>                           </div>
                            <input name="email" value={email} className="rounded-r p-1.5 w-full focus:outline-none" type="email" placeholder="Email" onChange={handleEmailChange} />
                        </div>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-300 rounded-l'>                           </div>
                            <input name="password" value={password} className="rounded-r p-1.5 w-full focus:outline-none" type="password" placeholder="Password" onChange={handlePasswordChange} />
                        </div>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-300 rounded-l'>                           </div>
                            <input name="password2" value={password2} className="rounded-r p-1.5 w-full focus:outline-none" type="password" placeholder="Confirm Password" onChange={handleConfirmPasswordChange} />
                        </div>
                        {error.message ?
                            <div className='flex p-2 border-2 border-red-500 rounded-lg space-x-2'>
                                <IoCloseCircle className='h-5 w-5 text-red-500' />
                                <p className='font-caviar font-bold text-sm text-red-500'>{error.message}</p>
                            </div> :
                            null
                        }
                        <div className='flex space-x-2'>
                            <button onClick={onSubmitClick} className='bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-4 py-2 rounded-md text-lg font-caviar font-bold dark:font-normal'>Signup</button>
                            <button onClick={onReset} className='text-white dark:text-violet-500 bg-gray-600 dark:bg-gray-200 hover:text-violet-500 dark:hover:text-violet-500 px-4 py-2 rounded-md text-lg font-caviar font-bold dark:font-normal'>Reset</button>
                        </div>
                        <p className='text-gray-700 dark:text-gray-500 text-sm py-5'>By clicking Sign In, I confirm that I have read and agree to the Artyst <button type='button' className='text-sm font-bold text-violet-500'>Terms of Service</button> and <button type='button' className='text-sm font-bold text-violet-500'>Privacy Policy</button>.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const AwardModal = (props) => {
    const { open, onClose, title, awardList, handleAwardExplore } = props;

    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-6/12 sm:w-10/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 pt-2 flex flex-col space-y-3'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 dark:text-violet-800 text-4xl font-semibold tracking-widest font-antipasto'>{title}</h1>
                        <AwardTabPanel awards={awardList} handleAwardExplore={handleAwardExplore} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const TokenModal = (props) => {
    const { open, onClose, title } = props;
    const [purchaseDialog, setPurchaseDialog] = useState({
        open: false,
        value: '',
        price: 0
    });

    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-6/12 sm:w-8/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 dark:text-violet-800 text-4xl font-semibold tracking-widest font-antipasto'>{title}</h1>
                        <div className='text-black dark:text-white text-md font-josefinlight'>Tokens are used to purchase awards, badges and profile avatars. You can gift your tokens to artists you admire as well!</div>
                        <ul className='px-5 space-y-2 text-gray-700 dark:text-gray-400'>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg font-caviar'>250 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 250, price: 100 })} className='w-20 bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 p-2 rounded-md text-sm font-caviar font-bold dark:font-normal'>&#8377;100</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg font-caviar'>500 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 500, price: 190 })} className='w-20 bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 p-2 rounded-md text-sm font-caviar font-bold dark:font-normal'>&#8377;190</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg font-caviar'>1000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 1000, price: 360 })} className='w-20 bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 p-2 rounded-md text-sm font-caviar font-bold dark:font-normal'>&#8377;360</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg font-caviar'>5000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 5000, price: 1500 })} className='w-20 bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 p-2 rounded-md text-sm font-caviar font-bold dark:font-normal'>&#8377;1500</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg font-caviar'>10000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 10000, price: 2600 })} className='w-20 bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 p-2 rounded-md text-sm font-caviar font-bold dark:font-normal'>&#8377;2600</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg font-caviar'>25000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 25000, price: 5000 })} className='w-20 bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 p-2 rounded-md text-sm font-caviar font-bold dark:font-normal'>&#8377;5000</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg font-caviar'>50000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 50000, price: 7400 })} className='w-20 bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 p-2 rounded-md text-sm font-caviar font-bold dark:font-normal'>&#8377;7400</button>
                            </li>
                        </ul>
                        <hr className='my-3 border-gray-700 dark:border-gray-200' />
                        <div className='flex flex-row justify-between'>
                            <div>
                                <h6 className='text-neutral-900 dark:text-gray-300 text-md'>Premium</h6>
                                <p className='text-gray-500 text-sm'>Get 1000 tokens/month. No Ads & more!</p>
                            </div>
                            <button className='whitespace-nowrap text-center bg-violet-500/75 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 py-1 px-4 rounded-md font-caviar font-bold dark:font-normal'>Go Premium</button>
                        </div>
                    </div>
                </div>
            </div>
            <PurchaseModal
                open={purchaseDialog.open}
                value={purchaseDialog.value}
                price={purchaseDialog.price}
                user={props.user}
                onClose={() => setPurchaseDialog({ open: false, value: '', price: 0 })}
                onClick={() => setPurchaseDialog({ open: false, value: '', price: 0 })}
            />
        </div>
    )
}

export const PurchaseModal = (props) => {
    const { open, value, price, onClose } = props;

    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-6/12 sm:w-9/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 dark:text-violet-800 text-3xl font-semibold tracking-wide font-josefinregular'>Add {new Intl.NumberFormat().format(value)} tokens</h1>
                        <div className='text-rose-500 text-md font-josefinregular'>Total: &#8377;{Number.parseFloat(price).toFixed(2)}</div>
                        <p className='mt-2 text-gray-700 dark:text-gray-300 text-sm'>Purchased tokens will be added to, <span>{props.user.username}</span></p>
                        <p className='text-gray-500 text-xs'>By purchasing Coins and Awards, you agree to the <button type='button' className='text-xs font-bold text-violet-500'>Artyst User Agreement</button>.</p>
                        <hr className='my-3 border-gray-500 dark:border-gray-300' />
                        <div className='flex flex-row justify-between'>
                            <h6 className='flex text-gray-700 dark:text-gray-300 text-md items-center'>Current Balance: <img src={TokenLogo} className='w-5 h-5 mx-1' />{new Intl.NumberFormat().format(props.user.tokens)}</h6>
                            <button className='whitespace-nowrap text-center bg-amber-400 text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 py-1 px-4 rounded-md text-sm font-caviar font-bold'>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}