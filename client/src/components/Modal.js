import React, { useEffect, useState } from 'react';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';
import { HiPlus, HiMinus, HiOutlineMail } from 'react-icons/hi';
import { FaUser, FaLock } from 'react-icons/fa';
import { AwardTabPanel } from './TabPanel';
import AddressMap from './AddressMap';
import Stepper from './Stepper';

import TokenLogo from '../assets/images/money.png';
import TokenIcon from '../assets/images/money.png';

import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    PinterestIcon,
    PinterestShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";

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
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-6/12 sm:w-11/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid sm:grid-cols-2 grid-cols-1'>
                    <img className='h-full sm:flex hidden' src={fetchUserImages(banner)} />
                    <div className='p-4 pt-2 flex flex-col space-y-3'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 dark:text-violet-500 text-5xl font-semibold tracking-widest font-antipasto mt-10'>{title}</h1>
                        <p className='text-black dark:text-white text-md font-josefinlight'>Become an Artyst Member <button type='button' onClick={() => { onClose(); openRegister() }} className='text-sm font-bold text-violet-400'>JOIN</button></p>
                        <a href="http://localhost:5000/api/users/googleAuth" className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-2 px-3 border rounded-lg border-gray-700 dark:border-gray-400 flex items-center w-full mt-10">
                            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z" fill="#4285F4" />
                                <path d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z" fill="#34A853" />
                                <path d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z" fill="#FBBC05" />
                                <path d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z" fill="#EB4335" />
                            </svg>
                            <p className="text-base font-medium ml-4 text-gray-800 dark:text-gray-400">Continue with Google</p>
                        </a>
                        <div className='flex items-center justify-between'>
                            <hr className="w-full border-1 border-gray-600 dark:border-gray-400" />
                            <p className="text-base font-medium leading-4 px-2.5 text-gray-600 dark:text-gray-400">OR</p>
                            <hr className="w-full border-1 border-gray-600 dark:border-gray-400" />
                        </div>
                        <div className="flex items-center">
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
                        <button onClick={onSubmitClick} className='w-20 bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-4 py-2 rounded-md text-lg font-caviar font-bold dark:font-normal'>Login</button>
                        <p className='text-gray-700 dark:text-gray-500 text-sm'>By clicking Sign In, I confirm that I have read and agree to the Artyst <button type='button' className='text-sm font-bold text-violet-500'>Terms of Service</button> and <button type='button' className='text-sm font-bold text-violet-500'>Privacy Policy</button>.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const RegisterModal = (props) => {
    const { open, title, banner, error, onClose, openLogin, handleSignUp, handleGoogleAuth } = props;
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
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-6/12 sm:w-11/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid sm:grid-cols-2 grid-cols-1'>
                    <img className='h-full sm:flex hidden' src={fetchUserImages(banner)} />
                    <div className='p-4 pt-2 flex flex-col space-y-3'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 text-5xl font-semibold tracking-widest font-antipasto'>{title}</h1>
                        <p className='text-black dark:text-white text-md font-josefinlight'>Already an Artyst Member? <button type='button' onClick={() => { onClose(); openLogin() }} className='text-sm font-bold text-violet-400'>SIGN IN</button></p>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-500 rounded-l'></div>
                            <input name="name" value={name} className="rounded-r p-1.5 w-full focus:outline-none" type="text" placeholder="Name" onChange={handleNameChange} />
                        </div>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-500 rounded-l'></div>
                            <input name="username" value={username} className="rounded-r p-1.5 w-full focus:outline-none" type="text" placeholder="Username" onChange={handleUsernameChange} />
                        </div>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-500 rounded-l'></div>
                            <input name="email" value={email} className="rounded-r p-1.5 w-full focus:outline-none" type="email" placeholder="Email" onChange={handleEmailChange} />
                        </div>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-500 rounded-l'></div>
                            <input name="password" value={password} className="rounded-r p-1.5 w-full focus:outline-none" type="password" placeholder="Password" onChange={handlePasswordChange} />
                        </div>
                        <div className="flex items-center">
                            <div className='px-1 py-2 h-full bg-violet-500 rounded-l'></div>
                            <input name="password2" value={password2} className="rounded-r p-1.5 w-full focus:outline-none" type="password" placeholder="Confirm Password" onChange={handleConfirmPasswordChange} />
                        </div>
                        <div className='flex items-center justify-between'>
                            <hr className="w-full border-1 border-gray-600 dark:border-gray-400" />
                            <p className="text-base font-medium leading-4 px-2.5 text-gray-600 dark:text-gray-400">OR</p>
                            <hr className="w-full border-1 border-gray-600 dark:border-gray-400" />
                        </div>
                        <div className='flex space-x-2'>
                            <a href="http://localhost:5000/api/users/googleAuth" className="w-fit p-2 border rounded-lg dark:border-gray-400 flex items-center w-full shadow-md">
                                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z" fill="#4285F4" />
                                    <path d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z" fill="#34A853" />
                                    <path d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z" fill="#FBBC05" />
                                    <path d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z" fill="#EB4335" />
                                </svg>
                                <p className="text-base font-medium ml-2 text-gray-800 dark:text-gray-400">Register with Google</p>
                            </a>
                        </div>
                        {error.message ?
                            <div className='flex p-2 border-2 border-red-500 rounded-lg space-x-2'>
                                <IoCloseCircle className='h-5 w-5 text-red-500' />
                                <p className='font-caviar font-bold text-sm text-red-500'>{error.message}</p>
                            </div> :
                            null
                        }
                        <div className='flex space-x-2 pt-5'>
                            <button onClick={onSubmitClick} className='bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-4 py-2 rounded-md text-lg font-caviar font-bold dark:font-normal'>Signup</button>
                            <button onClick={onReset} className='text-white dark:text-violet-500 bg-gray-600 dark:bg-gray-200 hover:text-violet-500 dark:hover:text-violet-500 px-4 py-2 rounded-md text-lg font-caviar font-bold dark:font-normal'>Reset</button>
                        </div>
                        <p className='text-gray-700 dark:text-gray-500 text-sm pb-5'>By clicking Sign In, I confirm that I have read and agree to the Artyst <button type='button' className='text-sm font-bold text-violet-500'>Terms of Service</button> and <button type='button' className='text-sm font-bold text-violet-500'>Privacy Policy</button>.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const AwardModal = (props) => {
    const { open, onClose, title, awardList, user, exploreID, handleAwardExplore } = props;

    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-8/12 sm:w-11/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 pt-2 flex flex-col space-y-3'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 dark:text-violet-800 text-4xl font-semibold tracking-widest font-antipasto'>{title}</h1>
                        <AwardTabPanel awards={awardList} user={user} exploreID={exploreID} handleAwardExplore={handleAwardExplore} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const AwardConfirmModal = (props) => {
    const { open, awardData, user, onClose, exploreID, handleAwardExplore } = props;

    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='p-4 flex flex-col'>
                    <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute right-0 top-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <p className='text-violet-800 font-josefinregular text-2xl font-semibold '>Confirm Purchase?</p>
                    <div className='flex items-center space-x-3 my-2'>
                        <img className='h-16 w-16' src={fetchUserImages(awardData.icon)} />
                        <div className='flex-row'>
                            <div className='flex space-x-1 items-center'>
                                <img src={TokenIcon} className='h-6 w-6' />
                                <span className='flex items-center font-bold text-2xl text-emerald-500 font-caviar'>{awardData.value}</span>
                            </div>
                            <p className='text-gray-900 font-bold dark:text-gray-200 font-caviar text-md'>Awarded by {user.username}.</p>
                            <p className='text-gray-400 text-sm italic'>By purchasing the award, you understand the mentioned total will be deducted from your balance.</p>
                        </div>
                    </div>

                    <hr className='h-2 w-full px-2 mt-2' />
                    <div className='flex items-center place-content-between'>
                        <p className='flex text-md text-gray-900 font-bold dark:text-gray-300 font-caviar'>Current Balance: <img src={TokenIcon} className='h-6 w-6 ml-1 mr-1' />{user.tokens}</p>
                        <button onClick={() => { handleAwardExplore(awardData); onClose() }} className='p-1.5 bg-yellow-400 w-fit rounded-md'>Confirm</button>
                    </div>
                </div>
            </div>
        </div >
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
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-8/12 sm:w-11/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 dark:text-violet-800 text-4xl font-semibold tracking-widest font-antipasto'>{title}</h1>
                        <div className='text-black dark:text-white text-md font-josefinlight'>Tokens are used to purchase awards, badges and profile avatars. You can gift your tokens to artists you admire as well!</div>
                        <ul className='py-2 px-5 space-y-2 text-gray-700 dark:text-gray-400'>
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
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
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

export const CartModal = (props) => {
    const [couponCode, setCouponCode] = useState('');
    const [couponValue, setCouponValue] = useState(0);
    const [sellerInstruction, setSellerInstruction] = useState('');
    const [taxValue, setTaxValue] = useState(0);
    const [final, setFinal] = useState(0);
    const [name, setName] = useState({
        fname: '',
        lname: ''
    });
    const [lname, setLname] = useState('');
    const [countryCode, setCountryCode] = useState('India');
    const [address, setAddress] = useState({
        line1: '',
        line2: '',
        zipCode: ''
    });
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expDate, setExpDate] = useState({
        date: '1',
        year: '2022'
    });
    const [cvv, setCvv] = useState('');

    const [currentIndex, setCurrentIndex] = useState(0);
    const { open, onClose, cartList, cartTotal, fetchStoreImages } = props;


    useEffect(() => {
        setFinal(cartTotal - taxValue - couponValue)
        if (cartList.length <= 0) {
            props.onClose()
        }
    }, [couponValue, taxValue, cartTotal])

    const checkAddressValues = () => {
        if (name.fname.length === 0 || name.lname.length === 0 || address.line1.length === 0 || address.line2.length === 0 || address.zipCode.length === 0) {
            return true;
        } else return false;
    }
    const checkPaymentValues = () => {
        if (cardHolder.length === 0 || cardNumber.length === 0 || cvv.length === 0) {
            return true;
        } else return false;
    }


    const switchCartView = () => {
        switch (currentIndex) {
            case 0: return <div>
                <div className='sm:scrollbar px-2 flex flex-col bg-slate-200 dark:bg-neutral-900 max-h-48 overflow-y-auto w-full divide-y-2 divide-neutral-800 text-gray-800 dark:text-gray-300 font-semibold dark:font-medium'>
                    {cartList && cartList.map(cartItem => (
                        <div className='flex sm:flex-row flex-col gap-5 py-2 font-caviar text-md'>
                            <div className='flex gap-4'>
                                <img src={fetchStoreImages(cartItem.file)} className="w-20 h-20 object-cover rounded shadow-lg" alt="Thumbnail" />
                                <div className='flex flex-col'>
                                    <span>Title: {cartItem.title}</span>
                                    <span>Category: {cartItem.title}</span>
                                    <span>Price: &#8377;{Number.parseFloat(cartItem.price).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className='flex flex-col items-end ml-auto space-y-2'>
                                <div className="flex flex-row h-10 rounded-lg relative bg-transparent mt-1">
                                    <button onClick={() => props.cartAdd(cartItem)} className="bg-slate-300 dark:bg-neutral-700 h-full w-10 rounded-l cursor-pointer flex items-center justify-center">
                                        <HiPlus className='text-gray-600 dark:text-gray-300' />
                                    </button>
                                    <span className='bg-slate-300 dark:bg-neutral-700 font-semibold text-lg flex items-center text-gray-700 dark:text-gray-300 px-2'>{cartItem.quantity}</span>
                                    <button onClick={() => props.handleCartRemove(cartItem)} className="bg-slate-300 dark:bg-neutral-700 h-full w-10 rounded-r cursor-pointer flex items-center justify-center">
                                        <HiMinus className='text-gray-600 dark:text-gray-300' />
                                    </button>
                                </div>
                                <span className='text-md'>SubTotal: &#8377;{Number.parseFloat(cartItem.subtotal).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex sm:flex-row flex-col mt-4 sm:mx-2 mx-0 gap-4">
                    <div className="sm:w-1/2 w-full space-y-4">
                        <div>
                            <h1 className="font-bold uppercase text-gray-700 dark:text-gray-300">Coupon Code</h1>
                            <p className="mb-2 text-sm italic text-gray-500">If you have a coupon code, please enter it in the box below</p>
                            <div className="flex w-full justify-center">
                                <div className="flex items-center w-full mx-auto bg-white dark:bg-neutral-700 rounded-lg">
                                    <div className="w-full">
                                        <input type="search" value={couponCode} onChange={(ev) => setCouponCode(ev.target.value)} className="w-full px-4 py-1 text-gray-800 dark:text-gray-400 rounded-full focus:outline-none bg-transparent" placeholder="Type a coupon code..." x-model="search" />
                                    </div>
                                    <div>
                                        <button type="submit" className="flex items-center bg-violet-400 justify-center w-12 h-12 text-white rounded-r-lg">
                                            <svg aria-hidden="true" data-prefix="fas" data-icon="gift" className="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="font-bold uppercase text-gray-700 dark:text-gray-300">Instructions for seller</h1>
                            <p className="mb-2 text-sm italic text-gray-500">If you have some information for the seller you can leave them in the box below</p>
                            <textarea rows='4' value={sellerInstruction} onChange={(ev) => setSellerInstruction(ev.target.value)} className="scrollbar w-full p-2 bg-gray-100 dark:bg-neutral-700 rounded resize-none text-gray-800 dark:text-gray-400 focus:outline-none"></textarea>
                        </div>
                    </div>
                    <div className="sm:w-1/2 w-full">
                        <h1 className="font-bold uppercase text-gray-700 dark:text-gray-300">Order Details</h1>
                        <p className="mb-6 italic text-gray-500">Shipping and additionnal costs are calculated based on values you have entered</p>
                        <div className="flex justify-between">
                            <div className="text-lg font-bold text-center text-gray-900 dark:text-gray-400">Total</div>
                            <div className="font-bold text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(cartTotal).toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex text-lg font-bold text-gray-900 dark:text-gray-400">Coupon Discount</div>
                            <div className="font-bold text-center text-green-500 dark:text-green-700">&#8377;{Number.parseFloat(couponValue).toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex text-lg font-bold text-center text-gray-900 dark:text-gray-400">Tax</div>
                            <div className="font-bold text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(taxValue).toFixed(2)}</div>
                        </div>
                        <hr className='my-2 border-1 border-gray-800 dark:border-gray-300' />
                        <div className="flex justify-between">
                            <div className="text-lg font-bold text-center text-gray-900 dark:text-gray-400">Final</div>
                            <div className="font-bold text-center text-gray-900 dark:text-gray-200">&#8377;{Number.parseFloat(final).toFixed(2)}</div>
                        </div>
                        <button onClick={() => setCurrentIndex(1)} className="flex float-right justify-center w-fit p-3 mt-6 sm:mb-0 mb-6 font-medium text-white uppercase bg-violet-400 rounded-xl shadow item-center hover:bg-violet-500 focus:shadow-outline focus:outline-none">Select the delivery location</button>
                    </div>
                </div>
            </div>

            case 1: return <div className='flex sm:flex-row flex-col h-full gap-4'>
                <AddressMap />
                <div className="flex flex-col w-full">
                    <div className="space-y-4">
                        <div className="flex flex-col w-full space-y-2">
                            <h1 className="font-bold text-gray-700 dark:text-gray-300">Full Name <span className='font-josefinlight text-rose-400 text-md'>*</span></h1>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={name.fname} onChange={(ev) => setName({ ...name, fname: ev.target.value })} placeholder="First Name" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={name.lname} onChange={(ev) => setName({ ...name, lname: ev.target.value })} placeholder="Last Name" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                        </div>
                        <div className="flex flex-col w-full space-y-2">
                            <h1 className="font-bold text-gray-700 dark:text-gray-300">Delivery address <span className='font-josefinlight text-rose-400 text-md'>*</span></h1>
                            <select value={countryCode} onChange={(ev) => setCountryCode(ev.target.value)} className="h-10 mt-2 form-select w-full rounded dark:bg-neutral-700 dark:text-gray-300">
                                <option value="India">IN</option>
                                <option value="US">USA</option>
                                <option value="UK">UK</option>
                            </select>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={address.line1} onChange={(ev) => setAddress({ ...address, line1: ev.target.value })} placeholder="Address Line 1" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded ">
                                <input value={address.line2} onChange={(ev) => setAddress({ ...address, line2: ev.target.value })} placeholder="Address Line 2" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={address.zipCode} onChange={(ev) => setAddress({ ...address, zipCode: ev.target.value })} placeholder="Zip Code" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                        </div>
                    </div>
                    <div className='flex ml-auto mt-auto space-x-2'>
                        <button onClick={() => setCurrentIndex(0)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-rose-400 rounded-xl shadow item-center hover:bg-rose-500 focus:shadow-outline focus:outline-none">Back</button>
                        <button disabled={checkAddressValues()} onClick={() => setCurrentIndex(2)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-violet-400 rounded-xl shadow item-center hover:bg-violet-500 disabled:bg-neutral-300 disabled:text-gray-500 disabled:dark:bg-neutral-700 disabled:dark:text-gray-500 focus:shadow-outline focus:outline-none">Proceed to Payment</button>
                    </div>
                </div>
            </div>

            case 2: return <div className="flex flex-col h-full">
                <div className='p-4 space-y-3'>
                    <div className="flex">
                        <label for="type1" className="flex items-center cursor-pointer">
                            <img src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png" className="h-8" />
                        </label>
                    </div>
                    <div>
                        <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Name on Card</label>
                        <div>
                            <input value={cardHolder} onChange={(ev) => setCardHolder(ev.target.value)} className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" placeholder="John Smith" type="text" />
                        </div>
                    </div>
                    <div>
                        <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Card Number</label>
                        <div>
                            <input value={cardNumber} onChange={(ev) => setCardNumber(ev.target.value)} className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" placeholder="0000 0000 0000 0000" type="text" />
                        </div>
                    </div>
                    <div className='flex items-end'>
                        <div className='flex space-x-2 w-1/2'>
                            <div className='flex flex-col'>
                                <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Expiration Date</label>
                                <select value={expDate.date} onChange={(ev) => setExpDate({ ...expDate, date: ev.target.value })} className="form-select w-fit py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                                    <option value="1">01 - January</option>
                                    <option value="2">02 - February</option>
                                    <option value="3">03 - March</option>
                                    <option value="4">04 - April</option>
                                    <option value="5">05 - May</option>
                                    <option value="6">06 - June</option>
                                    <option value="7">07 - July</option>
                                    <option value="8">08 - August</option>
                                    <option value="9">09 - September</option>
                                    <option value="10">10 - October</option>
                                    <option value="11">11 - November</option>
                                    <option value="12">12 - December</option>
                                </select>
                            </div>
                            <select value={expDate.year} onChange={(ev) => setExpDate({ ...expDate, year: ev.target.value })} className="form-select w-fit py-2 mb-1 mt-auto border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer">
                                <option value="2020">2020</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                            </select>
                        </div>
                        <div className='w-1/2'>
                            <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Security code</label>
                            <div>
                                <input value={cvv} onChange={(ev) => setCvv(ev.target.value)} className="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" placeholder="000" type="text" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex ml-auto mt-auto space-x-2'>
                    <button onClick={() => setCurrentIndex(1)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-rose-400 rounded-xl shadow item-center hover:bg-rose-500 focus:shadow-outline focus:outline-none">Back</button>
                    <button disabled={checkPaymentValues()} onClick={() => setCurrentIndex(3)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-violet-400 rounded-xl shadow item-center hover:bg-violet-500 disabled:bg-neutral-300 disabled:text-gray-500 disabled:dark:bg-neutral-700 disabled:dark:text-gray-500 focus:shadow-outline focus:outline-none">Proceed to Confirmation</button>
                </div>
            </div>

            case 3: return <div className='flex flex-col h-full'>
                <div className='space-y-6'>
                    <h1 className="font-bold uppercase text-gray-300">Summary</h1>
                    <div className='flex sm:flex-row flex-col gap-8'>
                        <div className='w-full'>
                            <div className="text-lg font-bold text-gray-800 dark:text-violet-400">Price Details</div>
                            <div className="flex justify-between">
                                <div className="text-lg font-bold text-center text-gray-800 dark:text-gray-400">Total</div>
                                <div className="font-bold text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(cartTotal).toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex text-lg font-bold text-gray-800 dark:text-gray-400">Coupon Discount</div>
                                <div className="font-bold text-center text-green-700">&#8377;{Number.parseFloat(couponValue).toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex text-lg font-bold text-center text-gray-800 dark:text-gray-400">Tax</div>
                                <div className="font-bold text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(taxValue).toFixed(2)}</div>
                            </div>
                            <hr className='my-2 border-1 border-gray-700 dark:boder-gray-300' />
                            <div className="flex justify-between">
                                <div className="text-lg font-bold text-center text-gray-800 dark:text-gray-400">Final</div>
                                <div className="font-bold text-center text-gray-900 dark:text-gray-200">&#8377;{Number.parseFloat(final).toFixed(2)}</div>
                            </div>
                        </div>
                        <div className='w-full'>
                            <div className="text-lg font-bold text-gray-800 dark:text-violet-400">Shipping Address</div>
                            <div className='text-md dark:text-gray-300 uppercase'>{name.fname + ' ' + name.lname}</div>
                            <div className='flex items-center text-md dark:text-gray-300'><HiOutlineMail className='mr-2' /> david89@gmail.com</div>
                            <div className='text-md dark:text-gray-300'>
                                {address.line1 + ', ' + address.line2 + ', ' + address.zipCode}
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className="text-lg font-bold text-gray-800 dark:text-violet-400">Payment Details</div>
                        <div className='text-md dark:text-gray-300'>Mode of Payment: Card</div>
                        <div className='flex items-center text-md dark:text-gray-300'>Card Number: 	XXXXXXXX88881881</div>
                    </div>
                </div>
                <div className='flex ml-auto mt-auto space-x-2'>
                    <button onClick={() => setCurrentIndex(2)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-rose-400 rounded-xl shadow item-center hover:bg-rose-500 focus:shadow-outline focus:outline-none">Back</button>
                    <button onClick={() => console.log('cart done')} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-violet-400 rounded-xl shadow item-center hover:bg-violet-500 disabled:bg-neutral-300 disabled:text-gray-500 disabled:dark:bg-neutral-700 disabled:dark:text-gray-500 focus:shadow-outline focus:outline-none">Checkout</button>
                </div>
            </div >
        }
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="scrollbar relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-8/12 sm:w-11/12 xs:w-11/12 h-full max-h-[90%] rounded-xl z-50 overflow-y-auto">
                <div className='p-4 h-full flex flex-col'>
                    <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <h1 className='text-violet-500 dark:text-violet-500 text-5xl font-semibold tracking-widest font-antipasto'>Cart</h1>
                    <Stepper activeIndex={currentIndex} />
                    {switchCartView()}
                </div>
            </div>
        </div >
    )
}

export const ShareModal = (props) => {
    const { open, value, title, onClose } = props;
    const [linkCopy, setLinkCopy] = useState(false);
    const shareURL = window.location.href;
    console.log('share', shareURL);

    const copyLink = () => {
        setLinkCopy(true);
        navigator.clipboard.writeText(shareURL)
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-violet-500 dark:text-violet-800 text-3xl font-semibold tracking-wide font-josefinregular'>{title}</h1>
                        <div className='flex flex-col space-y-3 py-2 px-4'>
                            <div>
                                <h4 className='text-gray-500 dark:text-gray-300 text-lg font-josefinlight'>Share this with via...</h4>
                                <div className='flex space-x-2'>
                                    <FacebookShareButton url={shareURL} >
                                        <FacebookIcon className="h-12 w-12" round={true} />
                                    </FacebookShareButton>
                                    <EmailShareButton url={shareURL}>
                                        <EmailIcon className="h-12 w-12" round={true} />
                                    </EmailShareButton>
                                    <LinkedinShareButton url={shareURL}>
                                        <LinkedinIcon className="h-12 w-12" round={true} />
                                    </LinkedinShareButton>
                                    <PinterestShareButton url={shareURL} media={shareURL}>
                                        <PinterestIcon className="h-12 w-12" round={true} />
                                    </PinterestShareButton>
                                    <RedditShareButton url={shareURL}>
                                        <RedditIcon className="h-12 w-12" round={true} />
                                    </RedditShareButton>
                                    <TelegramShareButton url={shareURL}>
                                        <TelegramIcon className="h-12 w-12" round={true} />
                                    </TelegramShareButton>
                                    <TwitterShareButton url={shareURL}>
                                        <TwitterIcon className="h-12 w-12" round={true} />
                                    </TwitterShareButton>
                                    <WhatsappShareButton url={shareURL}>
                                        <WhatsappIcon className="h-12 w-12" round={true} />
                                    </WhatsappShareButton>
                                </div>
                            </div>
                            <hr />
                            <button disabled={linkCopy} onClick={() => copyLink()} className='w-fit bg-violet-500 text-gray-900 dark:text-gray-200 hover:bg-violet-500 dark:hover:bg-violet-500 px-3 py-1 rounded-md text-lg font-caviar font-bold dark:font-normal'>{!linkCopy ? 'Copy the link url' : 'Link Copied!'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}