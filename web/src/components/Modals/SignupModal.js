import React, { useEffect, useState } from 'react';

import { api_googleRedirectURL } from '../../utils/api_routes';

import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';

import { ReactComponent as GoogleIcon } from '../../assets/icons/google-icon.svg';

const SignupModal = ({ open, title, banner, error, onClose, openLogin, handleSignUp, onSuccess, setAuthError }) => {
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
                        className="flex items-center justify-center w-full mt-6 py-2 px-3 rounded-full border border-gray-500 dark:border-gray-400 cursor-pointer">
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
                            <p className='font-bold text-sm text-red-500'>{error.message}</p>
                        </div> :
                        null
                    }
                    <div className='flex gap-2'>
                        <button onClick={onSubmitClick} className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-blue-700 hover:bg-blue-600 text-neutral-800 dark:text-gray-300 rounded-xl items-center">Sign Up</button>
                        <button onClick={onReset} className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-neutral-400 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-800 rounded-xl items-center">Reset</button>
                    </div>
                    <p className='tracking-wide font-semibold text-neutral-700 dark:text-gray-400 text-sm'>By clicking Sign Up, I confirm that I have read and agree to the artportal <button type='button' className='text-sm font-bold text-blue-700'>Terms of Service</button> and <button type='button' className='text-sm font-bold text-blue-700'>Privacy Policy</button>.</p>
                </div>
            </div>
        </div>
    )
}

export default SignupModal;