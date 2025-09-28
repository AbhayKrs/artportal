import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { api_artworkImages, api_userImages, api_storeImages, api_googleRedirectURL, api_googleLogin } from '../utils/api_routes';
import Stepper from './Stepper';

import TokenLogo from '../assets/images/money.png';
import TokenIcon from '../assets/images/money.png';
import Success from '../assets/images/successgif.gif';

import { MdSearch, MdClose } from 'react-icons/md';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';
import { HiPlus, HiMinus, HiOutlineMail } from 'react-icons/hi';
import { FaUser, FaLock } from 'react-icons/fa';
import { BsArrowUpRightSquare } from 'react-icons/bs';
import { FaChevronRight, FaHashtag, FaGreaterThan } from 'react-icons/fa6';
import { FiAtSign } from 'react-icons/fi';

import { ReactComponent as GoogleIcon } from '../assets/icons/google-icon.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';

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
import { ImageCard } from './Card';
import Masonry from './Masonry';

export const LoginModal = ({ open, title, banner, error, onClose, openRegister, handleSignIn, setAuthError }) => {
    let navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setLoggedIn] = useState(false);

    const handleStayLoggedin = (event) => {
        setLoggedIn(event.target.checked);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        error.login && setAuthError()
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        error.login && setAuthError()
    }

    const onSubmitClick = () => {
        const signinInput = {
            username: username,
            password: password
        }
        handleSignIn(stayLoggedIn, signinInput);
        setUsername('');
        setPassword('');
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto max-h-modal bg-slate-200 dark:bg-neutral-800 xs:w-11/12 sm:w-6/12 lg:w-6/12 rounded-xl z-50 overflow-y-auto">
                <div className='flex flex-col my-14 mx-auto gap-4 xs:w-10/12 md:w-8/12'>
                    <IoCloseSharp onClick={() => { onClose(); setAuthError() }} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-500' />
                    <div className='flex flex-col'>
                        <h1 className="text-4xl font-bold tracking-wide text-neutral-800 dark:text-gray-300">{title}</h1>
                        <p className="tracking-wide text-base font-normal text-neutral-700 dark:text-gray-100/50">Don't have an account? <span className='font-semibold text-blue-700 dark:text-blue-700 tracking-wide cursor-pointer' onClick={() => { onClose(); openRegister() }}>Sign up</span></p>
                    </div>
                    <a
                        href={api_googleRedirectURL}
                        className="flex items-center justify-center w-full mt-6 py-2 px-3 rounded-full border border-gray-300 dark:border-slate-400 cursor-pointer">
                        <GoogleIcon />
                        <p className="w-full text-base text-center font-medium text-gray-800 dark:text-gray-300">Continue with Google</p>
                    </a>
                    <p className='text-sm w-full text-center text-neutral-700 dark:text-neutral-400'>or</p>
                    <div className="relative flex items-center">
                        <FaUser className="absolute left-3.5 h-4 w-4 text-gray-300 dark:text-neutral-800" />
                        <input
                            name="username"
                            value={username}
                            className=" bg-slate-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-full text-base py-3 pl-10 w-full focus:outline-none"
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
                    <div className="relative flex items-center">
                        <FaLock className="absolute left-3.5 h-4 w-4 text-gray-300 dark:text-neutral-800" />
                        <input
                            name="password"
                            value={password}
                            className=" bg-slate-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-full text-base py-3 pl-10 w-full focus:outline-none"
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
                    {/* <label className="flex items-center cursor-pointer gap-2">
                        <input type="checkbox" checked={stayLoggedIn} onChange={handleStayLoggedin}
                            style={{
                                WebkitAppearance: 'none',
                            }}
                            className="h-4 w-4 appearance-none align-middle rounded-md outline-none bg-slate-300 dark:bg-neutral-700 checked:bg-blue-700 dark:checked:bg-blue-700 cursor-pointer"
                        />
                        <p className=' tracking-wide text-sm text-neutral-700 dark:text-neutral-400'>Keep me logged in</p>
                    </label> */}
                    {error.login && !username && !password ?
                        <div className='flex p-2 border-2 border-red-500 rounded-lg gap-2'>
                            <IoCloseCircle className='h-5 w-5 text-red-500' />
                            <p className='font-semibold text-sm text-red-500'>{error.message}</p>
                        </div> :
                        null
                    }
                    <button onClick={onSubmitClick} className="flex w-fit py-2.5 px-6 text-base font-medium tracking-wide bg-blue-700 hover:bg-blue-600 text-neutral-800 dark:text-gray-300 rounded-xl items-center">Sign In</button>
                    <p className='tracking-wide font-semibold text-neutral-700 dark:text-gray-400 text-sm'>By clicking Sign In, I confirm that I have read and agree to the artportal <button type='button' className='text-sm font-bold text-blue-700'>Terms of Service</button> and <button type='button' className='text-sm font-bold text-blue-700'>Privacy Policy</button>.</p>
                </div>
            </div>
        </div >
    )
}

export const RegisterModal = ({ open, title, banner, error, onClose, openLogin, handleSignUp, onSuccess, setAuthError }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    // const [name, setName] = useState('asd');
    // const [email, setEmail] = useState('asd@ga.com');
    // const [username, setUsername] = useState('asdsad');
    // const [password, setPassword] = useState('Test@12345');
    // const [password2, setPassword2] = useState('Test@12345');

    const handleNameChange = (event) => {
        setName(event.target.value);
        error.signup && setAuthError();
    }
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        error.signup && setAuthError();
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        error.signup && setAuthError();
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        error.signup && setAuthError();
    }
    const handleConfirmPasswordChange = (event) => {
        setPassword2(event.target.value);
        error.signup && setAuthError();
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
            <div className="relative m-auto max-h-modal bg-slate-200 dark:bg-neutral-800 xs:w-11/12 sm:w-6/12 lg:w-6/12 rounded-xl z-50 overflow-y-auto">
                <div className='flex flex-col my-14 mx-auto gap-4 xs:w-10/12 md:w-8/12'>
                    <IoCloseSharp onClick={() => { onClose(); setAuthError() }} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-500' />
                    <div className='flex flex-col'>
                        <h1 className="text-4xl font-bold tracking-wide text-neutral-800 dark:text-gray-300">{title}</h1>
                        <p className="tracking-wide text-base font-normal text-neutral-700 dark:text-gray-100/50">Have an account already? <span className='font-semibold text-blue-700 dark:text-blue-700 tracking-wide cursor-pointer' onClick={() => { onClose(); openLogin() }}>Sign in</span></p>
                    </div>
                    <a
                        href={api_googleRedirectURL}
                        className="flex items-center justify-center w-full mt-6 py-2 px-3 rounded-full border border-gray-300 dark:border-slate-400 cursor-pointer">
                        <GoogleIcon />
                        <p className="w-full text-center font-medium text-gray-800 dark:text-gray-300">Continue with Google</p>
                    </a>
                    <p className='text-sm w-full text-center text-neutral-700 dark:text-neutral-400'>or</p>
                    <div className="relative flex items-center">
                        <input
                            name="name"
                            value={name}
                            className=" bg-slate-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-full text-base py-2.5 pl-4 w-full focus:outline-none"
                            type="text"
                            placeholder="Name"
                            onChange={handleNameChange}
                        />
                    </div>
                    <div className="relative flex items-center">
                        <input
                            name="username"
                            value={username}
                            className=" bg-slate-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-full text-base py-2.5 pl-4 w-full focus:outline-none"
                            type="text"
                            placeholder="Username"
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div className="relative flex items-center">
                        <input
                            name="email"
                            value={email}
                            className=" bg-slate-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-full text-base py-2.5 pl-4 w-full focus:outline-none"
                            type="email"
                            placeholder="Email"
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="relative flex items-center">
                        <input
                            name="password"
                            value={password}
                            className=" bg-slate-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-full text-base py-2.5 pl-4 w-full focus:outline-none"
                            type="password"
                            placeholder="Password"
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="relative flex items-center">
                        <input
                            name="password2"
                            value={password2}
                            className=" bg-slate-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-full text-base py-2.5 pl-4 w-full focus:outline-none"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={handleConfirmPasswordChange}
                        />
                    </div>
                    {error.signup ?
                        <div className='flex p-2 border-2 border-red-500 rounded-lg gap-2'>
                            <IoCloseCircle className='h-5 w-5 text-red-500' />
                            <p className=' font-bold text-sm text-red-500'>{error.message}</p>
                        </div> :
                        null
                    }
                    <div className='flex gap-2'>
                        <button onClick={onSubmitClick} className="flex w-fit py-2.5 px-6 text-base font-medium tracking-wide bg-blue-700 hover:bg-blue-600 text-neutral-800 dark:text-gray-300 rounded-xl items-center">Sign Up</button>
                        <button onClick={onReset} className="flex w-fit py-2.5 px-6 text-base font-medium tracking-wide bg-neutral-700 hover:bg-neutral-600 text-neutral-800 dark:text-gray-300 rounded-xl items-center">Reset</button>
                    </div>
                    <p className='tracking-wide font-semibold text-neutral-700 dark:text-gray-400 text-sm'>By clicking Sign Up, I confirm that I have read and agree to the artportal <button type='button' className='text-sm font-bold text-blue-700'>Terms of Service</button> and <button type='button' className='text-sm font-bold text-blue-700'>Privacy Policy</button>.</p>
                </div>
            </div>
        </div>
    )
}

export const AwardModal = ({ open, onClose, title, awardList, user, artworkID, handleAwardArtwork }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto xs:m-5 bg-slate-100 dark:bg-neutral-800 max-w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 pt-2 flex flex-col gap-3'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-4xl font-semibold tracking-widest '>{title}</h1>
                        {/* <AwardTabPanel awards={awardList} user={user} artworkID={artworkID} handleAwardArtwork={handleAwardArtwork} awardClose={onClose} /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const AwardConfirmModal = ({ open, awardData, user, onClose, awardClose, artworkID, handleAwardArtwork }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-4/12 md:w-6/12 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='p-4 flex flex-col'>
                    <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute right-0 top-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <p className='text-indigo-800  text-2xl font-semibold '>Confirm Purchase?</p>
                    <div className='flex items-center gap-3 my-2'>
                        {awardData.icon.length > 0 && <img loading='lazy' className='h-16 w-16' src={api_userImages(awardData.icon)} />}
                        <div className='flex-row'>
                            <div className='flex gap-1 items-center'>
                                <img loading='lazy' src={TokenIcon} className='h-6 w-6' />
                                <span className='flex items-center font-bold text-2xl text-emerald-500 '>{awardData.value}</span>
                            </div>
                            <p className='text-gray-900 font-bold dark:text-gray-200  text-md'>Awarded by {user.username}.</p>
                            <p className='text-gray-400 text-sm italic'>By purchasing the award, you understand the mentioned total will be deducted from your balance.</p>
                        </div>
                    </div>
                    <hr className='h-2 w-full px-2 mt-2' />
                    <div className='flex items-center place-content-between'>
                        <p className='flex text-md text-gray-900 font-bold dark:text-gray-300 '>Current Balance: <img loading='lazy' src={TokenIcon} className='h-6 w-6 ml-1 mr-1' />{user.tokens}</p>
                        <button onClick={() => { handleAwardArtwork(awardData); onClose(); awardClose() }} className='p-1.5 bg-yellow-400 w-fit rounded-md'>Confirm</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export const TokenModal = ({ open, onClose, title, user }) => {
    const [purchaseDialog, setPurchaseDialog] = useState({
        open: false,
        value: '',
        price: 0
    });

    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-5/12 sm:w-11/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-4xl font-semibold tracking-widest '>{title}</h1>
                        <div className='text-black dark:text-white text-md '>Tokens are used to purchase awards, badges and profile avatars. You can gift your tokens to artists you admire as well!</div>
                        <h1 className='text-3xl  m-2 text-rose-400 dark:text-rose-600'>*Feature to be added soon.</h1>
                        {/* <ul className='py-2 px-5 gap-2 text-gray-700 dark:text-gray-400'>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg '>250 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 250, price: 100 })} className='w-20 bg-blue-700/75 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 p-2 rounded-md text-sm  font-bold dark:font-normal'>&#8377;100</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg '>500 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 500, price: 190 })} className='w-20 bg-blue-700/75 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 p-2 rounded-md text-sm  font-bold dark:font-normal'>&#8377;190</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg '>1000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 1000, price: 360 })} className='w-20 bg-blue-700/75 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 p-2 rounded-md text-sm  font-bold dark:font-normal'>&#8377;360</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg '>5000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 5000, price: 1500 })} className='w-20 bg-blue-700/75 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 p-2 rounded-md text-sm  font-bold dark:font-normal'>&#8377;1500</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg '>10000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 10000, price: 2600 })} className='w-20 bg-blue-700/75 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 p-2 rounded-md text-sm  font-bold dark:font-normal'>&#8377;2600</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg '>25000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 25000, price: 5000 })} className='w-20 bg-blue-700/75 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 p-2 rounded-md text-sm  font-bold dark:font-normal'>&#8377;5000</button>
                            </li>
                            <li className='flex justify-between place-items-center'>
                                <div className='text-lg '>50000 tokens</div>
                                <button onClick={() => setPurchaseDialog({ open: true, value: 50000, price: 7400 })} className='w-20 bg-blue-700/75 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 p-2 rounded-md text-sm  font-bold dark:font-normal'>&#8377;7400</button>
                            </li>
                        </ul>
                        <hr className='my-3 border-gray-700 dark:border-gray-200' />
                        <div className='flex flex-row justify-between'>
                            <div>
                                <h6 className='text-neutral-900 dark:text-gray-300 text-md'>Premium</h6>
                                <p className='text-gray-500 text-sm'>Get 1000 tokens/month. No Ads & more!</p>
                            </div>
                            <button className='whitespace-nowrap text-center bg-blue-700/75 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 py-1 px-4 rounded-md  font-bold dark:font-normal'>Go Premium</button>
                        </div> */}
                    </div>
                </div>
            </div>
            <PurchaseModal
                open={purchaseDialog.open}
                value={purchaseDialog.value}
                price={purchaseDialog.price}
                user={user}
                onClose={() => setPurchaseDialog({ open: false, value: '', price: 0 })}
                onClick={() => setPurchaseDialog({ open: false, value: '', price: 0 })}
            />
        </div>
    )
}

export const PurchaseModal = ({ open, value, price, user, onClose }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-4/12 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-3xl font-semibold tracking-wide '>Add {new Intl.NumberFormat().format(value)} tokens</h1>
                        <div className='text-rose-500 text-md '>Total: &#8377;{Number.parseFloat(price).toFixed(2)}</div>
                        <p className='mt-2 text-gray-700 dark:text-gray-300 text-sm'>Purchased tokens will be added to, <span>{user.username}</span></p>
                        <p className='text-gray-500 text-xs'>By purchasing Coins and Awards, you agree to the <button type='button' className='text-xs font-bold text-blue-700'>artportal User Agreement</button>.</p>
                        <hr className='my-3 border-gray-500 dark:border-gray-300' />
                        <div className='flex flex-row justify-between'>
                            <h6 className='flex text-gray-700 dark:text-gray-300 text-md items-center'>Current Balance: <img loading='lazy' src={TokenLogo} className='w-5 h-5 mx-1' />{new Intl.NumberFormat().format(user.tokens)}</h6>
                            <button className='whitespace-nowrap text-center bg-amber-400 text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 py-1 px-4 rounded-md text-sm  font-bold'>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const CartModal = ({ open, onClose, cartList, cartTotal, api_storeImages, addToCart, handleCartRemove }) => {
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


    useEffect(() => {
        setFinal(cartTotal - taxValue - couponValue)
        if (cartList.length <= 0) {
            onClose()
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
                        <div className='flex sm:flex-row flex-col gap-5 py-2  text-md'>
                            <div className='flex gap-4'>
                                <img loading='lazy' src={api_storeImages(cartItem.file)} className="w-20 h-20 object-cover rounded shadow-lg" alt="Thumbnail" />
                                <div className='flex flex-col'>
                                    <span>Title: {cartItem.title}</span>
                                    <span>Category: {cartItem.title}</span>
                                    <span>Price: &#8377;{Number.parseFloat(cartItem.price).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className='flex flex-col items-end ml-auto gap-2'>
                                <div className="flex flex-row h-10 rounded-lg relative bg-transparent mt-1">
                                    <button onClick={() => addToCart(cartItem)} className="bg-slate-300 dark:bg-neutral-700 h-full w-10 rounded-l cursor-pointer flex items-center justify-center">
                                        <HiPlus className='text-gray-600 dark:text-gray-300' />
                                    </button>
                                    <span className='bg-slate-300 dark:bg-neutral-700 font-semibold text-lg flex items-center text-gray-700 dark:text-gray-300 px-2'>{cartItem.quantity}</span>
                                    <button onClick={() => handleCartRemove(cartItem)} className="bg-slate-300 dark:bg-neutral-700 h-full w-10 rounded-r cursor-pointer flex items-center justify-center">
                                        <HiMinus className='text-gray-600 dark:text-gray-300' />
                                    </button>
                                </div>
                                <span className='text-md'>SubTotal: &#8377;{Number.parseFloat(cartItem.subtotal).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex sm:flex-row flex-col mt-4 sm:mx-2 mx-0 gap-4">
                    <div className="sm:w-1/2 w-full gap-4">
                        <div>
                            <h1 className="font-bold uppercase text-gray-700 dark:text-gray-300">Coupon Code</h1>
                            <p className="mb-2 text-sm italic text-gray-500">If you have a coupon code, please enter it in the box below</p>
                            <div className="flex w-full justify-center">
                                <div className="flex items-center w-full mx-auto bg-white dark:bg-neutral-700 rounded-lg">
                                    <div className="w-full">
                                        <input type="search" value={couponCode} onChange={(ev) => setCouponCode(ev.target.value)} className="w-full px-4 py-1 text-gray-800 dark:text-gray-400 rounded-full focus:outline-none bg-transparent" placeholder="Type a coupon code..." x-model="search" />
                                    </div>
                                    <div>
                                        <button type="submit" className="flex items-center bg-blue-700 justify-center w-12 h-12 text-white rounded-r-lg">
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
                        <button onClick={() => setCurrentIndex(1)} className="flex float-right justify-center w-fit p-3 mt-6 sm:mb-0 mb-6 font-medium text-white uppercase bg-blue-700 rounded-xl shadow item-center hover:bg-blue-700 focus:shadow-outline focus:outline-none">Select the delivery location</button>
                    </div>
                </div>
            </div>

            case 1: return <div className='flex sm:flex-row flex-col h-full gap-4'>
                <div className="flex flex-col w-full">
                    <div className="gap-4">
                        <div className="flex flex-col w-full gap-2">
                            <h1 className="font-bold text-gray-700 dark:text-gray-300">Full Name <span className=' text-rose-400 text-md'>*</span></h1>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={name.fname} onChange={(ev) => setName({ ...name, fname: ev.target.value })} placeholder="First Name" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={name.lname} onChange={(ev) => setName({ ...name, lname: ev.target.value })} placeholder="Last Name" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <h1 className="font-bold text-gray-700 dark:text-gray-300">Delivery address <span className=' text-rose-400 text-md'>*</span></h1>
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
                    <div className='flex ml-auto mt-auto gap-2'>
                        <button onClick={() => setCurrentIndex(0)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-rose-400 rounded-xl shadow item-center hover:bg-rose-500 focus:shadow-outline focus:outline-none">Back</button>
                        <button disabled={checkAddressValues()} onClick={() => setCurrentIndex(2)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-blue-700 rounded-xl shadow item-center hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-gray-500 disabled:dark:bg-neutral-700 disabled:dark:text-gray-500 focus:shadow-outline focus:outline-none">Proceed to Payment</button>
                    </div>
                </div>
            </div>

            case 2: return <div className="flex flex-col h-full">
                <div className='p-4 gap-3'>
                    <div className="flex">
                        <label for="type1" className="flex items-center cursor-pointer">
                            <img loading='lazy' src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png" className="h-8" />
                        </label>
                    </div>
                    <div>
                        <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Name on Card</label>
                        <div>
                            <input value={cardHolder} onChange={(ev) => setCardHolder(ev.target.value)} className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors" placeholder="John Smith" type="text" />
                        </div>
                    </div>
                    <div>
                        <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Card Number</label>
                        <div>
                            <input value={cardNumber} onChange={(ev) => setCardNumber(ev.target.value)} className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors" placeholder="0000 0000 0000 0000" type="text" />
                        </div>
                    </div>
                    <div className='flex items-end'>
                        <div className='flex gap-2 w-1/2'>
                            <div className='flex flex-col'>
                                <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Expiration Date</label>
                                <select value={expDate.date} onChange={(ev) => setExpDate({ ...expDate, date: ev.target.value })} className="form-select w-fit py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors cursor-pointer">
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
                            <select value={expDate.year} onChange={(ev) => setExpDate({ ...expDate, year: ev.target.value })} className="form-select w-fit py-2 mb-1 mt-auto border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors cursor-pointer">
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
                                <input value={cvv} onChange={(ev) => setCvv(ev.target.value)} className="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors" placeholder="000" type="text" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex ml-auto mt-auto gap-2'>
                    <button onClick={() => setCurrentIndex(1)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-rose-400 rounded-xl shadow item-center hover:bg-rose-500 focus:shadow-outline focus:outline-none">Back</button>
                    <button disabled={checkPaymentValues()} onClick={() => setCurrentIndex(3)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-blue-700 rounded-xl shadow item-center hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-gray-500 disabled:dark:bg-neutral-700 disabled:dark:text-gray-500 focus:shadow-outline focus:outline-none">Proceed to Confirmation</button>
                </div>
            </div>

            case 3: return <div className='flex flex-col h-full'>
                <div className='gap-6'>
                    <h1 className="font-bold uppercase text-gray-300">Summary</h1>
                    <div className='flex sm:flex-row flex-col gap-8'>
                        <div className='w-full'>
                            <div className="text-lg font-bold text-gray-800 dark:text-blue-700">Price Details</div>
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
                            <div className="text-lg font-bold text-gray-800 dark:text-blue-700">Shipping Address</div>
                            <div className='text-md dark:text-gray-300 uppercase'>{name.fname + ' ' + name.lname}</div>
                            <div className='flex items-center text-md dark:text-gray-300'><HiOutlineMail className='mr-2' /> david89@gmail.com</div>
                            <div className='text-md dark:text-gray-300'>
                                {address.line1 + ', ' + address.line2 + ', ' + address.zipCode}
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className="text-lg font-bold text-gray-800 dark:text-blue-700">Payment Details</div>
                        <div className='text-md dark:text-gray-300'>Mode of Payment: Card</div>
                        <div className='flex items-center text-md dark:text-gray-300'>Card Number: 	XXXXXXXX88881881</div>
                    </div>
                </div>
                <div className='flex ml-auto mt-auto gap-2'>
                    <button onClick={() => setCurrentIndex(2)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-rose-400 rounded-xl shadow item-center hover:bg-rose-500 focus:shadow-outline focus:outline-none">Back</button>
                    <button onClick={() => console.log('cart done')} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-blue-700 rounded-xl shadow item-center hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-gray-500 disabled:dark:bg-neutral-700 disabled:dark:text-gray-500 focus:shadow-outline focus:outline-none">Checkout</button>
                </div>
            </div >
        }
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="scrollbar relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-8/12 sm:w-11/12 xs:w-11/12 h-full max-h-[90%] rounded-xl z-50 overflow-y-auto">
                <div className='p-4 h-full flex flex-col'>
                    <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <h1 className='text-blue-700 dark:text-blue-700 text-5xl font-semibold tracking-widest '>Cart</h1>
                    <Stepper activeIndex={currentIndex} />
                    {switchCartView()}
                </div>
            </div>
        </div >
    )
}

export const ShareModal = ({ open, value, title, onClose }) => {
    const [linkCopy, setLinkCopy] = useState(false);
    const shareURL = window.location.href;

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
                        <h1 className='text-blue-700 dark:text-indigo-800 text-3xl font-semibold tracking-wide '>{title}</h1>
                        <div className='flex flex-col gap-3 py-2 px-4'>
                            <div>
                                <h4 className='text-gray-500 dark:text-gray-300 text-lg '>Share this with via...</h4>
                                <div className='flex gap-2'>
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
                            <button disabled={linkCopy} onClick={() => copyLink()} className='w-fit bg-blue-700 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 px-3 py-1 rounded-md text-lg  font-bold dark:font-normal'>{!linkCopy ? 'Copy the link url' : 'Link Copied!'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const AvatarModal = ({ open, avatarList, title, onClose, a_handleEditUserAvatar }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-3xl font-semibold tracking-wide '>{title}</h1>
                        <div className='grid grid-rows-4 grid-flow-col gap-4'>
                            {avatarList.map(avatar => (
                                <img loading='lazy' onClick={() => a_handleEditUserAvatar(avatar)} id={avatar._id} src={api_userImages(avatar.icon)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const SearchModal = ({ open, handleClose, betaMsg, searchVal, setSearchVal, activeSearch, searchList, setSearchType, fetchSearchList, clearSearch, handleArtworkSearch }) => {
    let navigate = useNavigate();

    const handleSearch = (val) => {
        setSearchVal(val);
        if (val.length > 0) {
            fetchSearchList(activeSearch, val);
        } else {
            clearSearch();
        }
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className={`scrollbar fixed mx-auto ${betaMsg === true ? 'top-20' : 'top-14'} p-4 z-50 h-fit bg-slate-300 dark:bg-neutral-800 w-11/12 sm:w-8/12 md:w-9/12 rounded-xl`}>
                <IoCloseSharp onClick={handleClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                <div className="flex w-6/12 items-center bg-slate-300 dark:bg-neutral-700 rounded-xl py-2 px-4 gap-2">
                    <div className="flex relative items-center justify-center">
                        <SearchIcon className="h-5 w-5 text-neutral-800 dark:text-gray-400" />
                    </div>
                    {searchVal.length > 0 && <div className="flex relative items-center justify-center rounded border-2 border-gray-300 text-neutral-800 dark:text-gray-300 h-7 w-7 mr-2">
                        {activeSearch === 'artwork' && <FiAtSign className='h-4 w-4' />}
                        {activeSearch === 'tag' && <FaHashtag className='h-4 w-4' />}
                        {activeSearch === 'artist' && <FaGreaterThan className='h-4 w-4' />}
                    </div>}
                    <input
                        type="text"
                        name="search"
                        value={searchVal}
                        placeholder="Search..."
                        autoComplete="off"
                        className="w-full font-normal tracking-wide bg-transparent text-neutral-800 dark:text-gray-200 placeholder-gray-600 dark:placeholder-gray-100/30 text-xl focus:outline-none"
                        onChange={(ev) => handleSearch(ev.target.value)}
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                fetchSearchList(activeSearch, searchVal)
                            }
                        }}
                    />
                    {searchVal.length === 0 ?
                        '' :
                        <button className="flex items-center justify-center text-neutral-800 dark:text-gray-300 h-full w-12" onClick={() => setSearchVal('')}>
                            <MdClose className='h-5 w-5' />
                        </button>
                    }
                </div>
                <div className='flex flex-col w-full'>
                    <div className='sticky bottom-0 inset-x-0 flex flex-col md:flex-row items-center justify-between w-full p-2 bg-slate-300 dark:bg-neutral-800  gap-2'>
                        <div className='flex flex-row p-2 bg-slate-300 dark:bg-neutral-800  gap-2'>
                            <button disabled={activeSearch === 'artwork'} onClick={() => { fetchSearchList('artwork', searchVal) }} className={`flex gap-1 items-center tracking-wide ${activeSearch === 'artwork' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                                <FiAtSign className='h-4 w-4' />
                                <span className=' font-semibold text-base'>Artworks</span>
                            </button>
                            <span className='flex text-neutral-700 dark:text-gray-300'>&#8226;</span>
                            <button disabled={activeSearch === 'tag'} onClick={() => { fetchSearchList('tag', searchVal) }} className={`flex gap-1 items-center tracking-wide ${activeSearch === 'tag' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                                <FaHashtag className='h-4 w-4' />
                                <span className=' font-semibold text-base'>Tags</span>
                            </button>
                            <span className='flex text-neutral-700 dark:text-gray-300'>&#8226;</span>
                            <button disabled={activeSearch === 'artist'} onClick={() => { fetchSearchList('artist', searchVal) }} className={`flex gap-1 items-center tracking-wide ${activeSearch === 'artist' ? 'text-blue-700' : 'text-neutral-700 dark:text-gray-300 hover:text-blue-700'}`}>
                                <FaGreaterThan className='h-4 w-4' />
                                <span className=' font-semibold text-base'>Artists</span>
                            </button>
                        </div>
                        <div className='flex flex-col md:flex-row p-2 bg-slate-300 dark:bg-neutral-800  gap-2'>
                            <button onClick={() => { handleArtworkSearch(); handleClose() }} className='flex  font-normal text-base gap-2 items-center tracking-wide text-neutral-700 dark:text-gray-300 hover:text-blue-700'>
                                {searchVal.length > 0 &&
                                    <>
                                        Search {activeSearch}s for '{searchVal}'
                                        <BsArrowUpRightSquare className='h-4 w-4' />
                                    </>
                                }
                            </button>
                        </div>
                    </div>
                    {/* <Masonry cols={5}>
                        {library.trending_artworks.map((artwork, index) => (
                            <div key={index} onClick={() => navigate(`/library/${artwork._id}`)} className='relative group group-hover:block cursor-pointer'>
                                <img loading='lazy'
                                    id={index}
                                    className='object-cover w-full h-full rounded'
                                    src={api_artworkImages(artwork.files[0])}
                                />
                                <div className='opacity-0 flex transition-all delay-200 absolute bottom-0 p-2 pt-14 group-hover:opacity-100 w-full bg-gradient-to-t from-black text-gray-200 justify-between'>
                                    <div className="flex flex-col place-self-end max-w-[65%]">
                                        <h4 className="text-md text-base  font-bold leading-5 break-words">{artwork.title.length > 20 ? artwork.title.slice(0, 20) + "..." : artwork.title}</h4>
                                        <div className='flex'>
                                            <p className="font-base text-xs my-1 mr-1">
                                                {artwork.artist.username}
                                            </p>
                                            <svg className="stroke-current stroke-1 text-indigo-600 dark:text-indigo-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col self-end place-items-end gap-1.5">
                                        <div className="inline-flex gap-1 items-end">
                                            <BsHeart className='h-4 w-4' />
                                            <p className="text-xs antialiased">{artwork.likes.length}</p>
                                        </div>
                                        <div className="inline-flex gap-1 items-end">
                                            <BsChat className='h-4 w-4' />
                                            <p className="text-xs antialiased">{artwork.comments.length}</p>
                                        </div>
                                        <div className="inline-flex gap-1 items-end">
                                            <BiTimeFive className='h-4 w-4' />
                                            <p className="text-xs antialiased">{moment(artwork.createdAt).fromNow()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Masonry> */}
                    <div className='scrollbar max-h-full md:max-h-[30rem] overflow-y-auto'>
                        {activeSearch === 'artwork' &&
                            <div className='flex flex-col gap-2 pr-2'>
                                <Masonry cols={6}>
                                    {searchList.length > 0 ?
                                        searchList.map((item, index) => (
                                            <ImageCard size="m" key={index} artwork={item} artist={item.artist} />
                                        ))
                                        // searchList.map((item, index) => (
                                        //     <div key={index} className='flex items-center gap-4 rounded-lg text-neutral-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-900 py-2 px-5'>
                                        //         <img src={api_artworkImages(item.files[0])} className='object-cover w-10 h-10 md:w-14 md:h-14 rounded' />
                                        //         <span className='text-base md:text-xl font-semibold leading-5 capitalize'>{item.title}</span>
                                        //         <FaChevronRight onClick={() => { navigate(`/library/${item._id}`); clearSearch(); handleClose() }} className="ml-auto h-6 w-6 cursor-pointer" />
                                        //     </div>
                                        // ))
                                        :
                                        <div className='flex flex-col gap-2 items-center justify-center p-4'>
                                            <FiAtSign className='h-8 w-8 text-neutral-800 dark:text-gray-300' />
                                            <div className='flex flex-col gap-1 items-center'>
                                                <span className='text-neutral-800 dark:text-gray-200  font-semibold leading-5'>No artworks found.</span>
                                                <span className='text-neutral-500 dark:text-gray-400  text-sm'>"{searchVal}" did not match any artworks in our database. Please try again.</span>
                                            </div>
                                        </div>}
                                </Masonry>
                            </div>
                        }
                        {activeSearch === 'artist' &&
                            <div className='flex flex-col gap-2 pr-2'>
                                {searchList.length > 0 ? searchList.map((item, index) => (
                                    <div key={index} onClick={() => { navigate(`/users/${item.id}`); clearSearch() }} className='flex items-center gap-5 cursor-pointer rounded-lg text-neutral-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-900 py-3 px-5'>
                                        {item.avatar.icon.length > 0 && <img src={api_userImages(item.avatar.icon)} className='object-cover w-10 h-10' />}
                                        <div className='flex flex-col'>
                                            <span className='text-lg font-semibold'>{item.name}</span>
                                            <span className='text-sm font-semibold'>@{item.username}</span>
                                        </div>
                                    </div>
                                )) :
                                    <div className='flex flex-col gap-2 items-center justify-center p-4'>
                                        <FaGreaterThan className='h-8 w-8 text-neutral-800 dark:text-gray-300' />
                                        <div className='flex flex-col items-center'>
                                            <span className='text-neutral-800 dark:text-gray-200  font-semibold leading-5'>No artists found.</span>
                                            <span className='text-neutral-500 dark:text-gray-400  text-sm'>"{searchVal}" did not match any artists in our database. Please try again.</span>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        {activeSearch === 'tag' &&
                            <div className='flex flex-col gap-2 pr-2'>
                                {searchList.length > 0 ? searchList.map((item, index) => (
                                    <div key={index} onClick={() => { navigate(`/library`); clearSearch() }} className='flex cursor-pointer items-center gap-4 rounded-lg text-neutral-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-900 p-4'>
                                        <FaHashtag className='h-5 w-5' />
                                        <span className=' font-semibold leading-5'>{item}</span>
                                    </div>
                                )) :
                                    <div className='flex flex-col gap-2 items-center justify-center p-4'>
                                        <FaHashtag className='h-8 w-8 text-neutral-800 dark:text-gray-300' />
                                        <div className='flex flex-col items-center'>
                                            <span className='text-neutral-800 dark:text-gray-200  font-semibold leading-5'>No tags found.</span>
                                            <span className='text-neutral-500 dark:text-gray-400  text-sm'>"{searchVal}" did not match any tags in our database. Please try again.</span>
                                        </div>
                                    </div>}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ConfirmModal = ({ open, title, onClose, onConfirm }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-4/12 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col items-center'>
                        <h1 className='text-blue-700 dark:text-indigo-800 text-xl font-semibold tracking-wide '>{title}</h1>
                        <div className='flex gap-4 mt-3'>
                            <button onClick={onClose} className='text-white dark:text-blue-700 bg-gray-600 dark:bg-gray-200 hover:text-blue-700 dark:hover:text-blue-700 px-4 py-2 rounded-md  font-bold dark:font-normal'>Cancel</button>
                            <button onClick={() => { onConfirm(); onClose() }} className='bg-blue-700 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 px-4 py-2 rounded-md  font-bold dark:font-normal'>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const FlaggedModal = ({ open, onClose }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-4/12 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col items-center'>
                        <h1 className='text-neutral-800 dark:text-gray-200 text-xl font-semibold tracking-wide'>Inappropriate or Explicit Content</h1>
                        <div className='flex flex-col gap-1 items-center text-center mt-3'>
                            <p className='text-neutral-700 dark:text-gray-300 text-sm tracking-wide'>The upload was flagged as inappropriate or of mature nature and is not allowed per site policies.</p>
                            <p className='text-neutral-700 dark:text-gray-300 text-sm tracking-wide'>Please try again!</p>
                        </div>
                        <div className='flex items-center mt-3'>
                            <button onClick={onClose} className='text-white dark:text-blue-700 bg-gray-600 dark:bg-gray-200 hover:text-blue-700 dark:hover:text-blue-700 px-4 py-2 rounded-md  font-bold dark:font-normal'>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const SignupSuccessModal = ({ open, onClose, title, user }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-5/12 sm:w-11/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 items-center text-center flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-4xl font-semibold tracking-widest '>{title}</h1>
                        <img src={Success} />
                        <div className='text-black dark:text-white text-2xl font-bold '>Thank you for joining the community! Have fun and enjoy your art journey here.</div>
                        <h1 className='text-md  font-bold mt-2 text-rose-400 dark:text-rose-600'>5000 tokens have been added to your account to celebrate the occation. Enjoy!</h1>
                        <h6 className='flex text-gray-700 dark:text-gray-300 text-md  font-bold items-center'>Token Balance: <img loading='lazy' src={TokenLogo} className='w-5 h-5 mx-1' />{new Intl.NumberFormat().format(user.tokens)}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}