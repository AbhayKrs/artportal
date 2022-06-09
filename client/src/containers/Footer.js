import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Artyst_logo from '../assets/images/artyst_header.svg';
import Artyst_icon from '../assets/images/artyst_logo.svg';
import Artyst_title from '../assets/images/artyst_title.svg';

const Footer = () => {
    let navigate = useNavigate();

    return (
        <footer className="bg-slate-100 dark:bg-darkNavHeader w-full shadow-[0_-4px_3px_rgba(175,175,175,0.55),_0_-2px_2px_rgba(175,175,175,0.5)] dark:shadow-[0_-4px_3px_rgba(45,45,45,0.55),_0_-2px_2px_rgba(45,45,45,0.5)]">
            {/* <div className="font-antipasto mx-2 px-6 pt-8 flex-col sm:hidden md:flex">
                <div className='flex mx-auto w-9/12'>
                    <div className="w-80 flex-shrink-0 mr-auto">
                        <Link to='/'>
                            <img className='block h-10 w-auto hover:cursor-pointer' src={Artyst_logo} alt='Artyst' />
                        </Link>
                        <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-200">Focal point of everything art</p>
                    </div>
                    <div className="flex flex-col grow">
                        <div className="flex space-x-3">
                            <h1 className="title-font font-bold text-gray-900 dark:text-gray-200 tracking-widest text-lg mb-3">CATEGORIES</h1>
                            <span className='text-violet-700'>&#9679;</span>
                            <div className='flex h-fit'>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center border-r-2 border-gray-400">First Link</Link>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center border-r-2 border-gray-400">Second Link</Link>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center border-r-2 border-gray-400">Third Link</Link>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center">Fourth Link</Link>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <h1 className="title-font font-bold text-gray-900 dark:text-gray-200 tracking-widest text-lg mb-3">CATEGORIES</h1>
                            <span className='text-violet-700'>&#9679;</span>
                            <div className='flex h-fit'>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center border-r-2 border-gray-400">First Link</Link>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center border-r-2 border-gray-400">Second Link</Link>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center border-r-2 border-gray-400">Third Link</Link>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center">Fourth Link</Link>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <h1 className="title-font font-bold text-gray-900 dark:text-gray-200 tracking-widest text-lg mb-3">CATEGORIES</h1>
                            <span className='text-violet-700'>&#9679;</span>
                            <div className='flex h-fit'>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center border-r-2 border-gray-400">First Link</Link>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center border-r-2 border-gray-400">Second Link</Link>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center border-r-2 border-gray-400">Third Link</Link>
                                <Link to="/" className="font-caviar px-2 text-gray-900 dark:text-gray-200 hover:text-violet-500 dark:hover:text-violet-500 text-center">Fourth Link</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='w-3/4 mx-auto my-3' />
                <div className='flex w-full items-center justify-center pb-3 gap-4'>
                    <span className='flex items-center'>
                        <p className='text-2xl text-violet-700 pt-1'>&#169;</p>
                        <img className='h-8 w-auto' src={Artyst_title} />
                    </span>
                    <span className='text-violet-700'>&#9679;</span>
                    <div className='flex'>
                        <Link to='/' className="ml-3 text-violet-700">
                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                        </Link>
                        <Link to='/' className="ml-3 text-violet-700">
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                            </svg>
                        </Link>
                        <Link to='/' className="ml-3 text-violet-700">
                            <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                <circle cx="4" cy="4" r="2" stroke="none"></circle>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div> */}
            <div className="block">
                <div className="items-center mx-2 p-1 flex flex-wrap flex-col sm:flex-row">
                    <div className='flex'>
                        <img onClick={() => navigate('/')} className='h-10 w-auto hover:cursor-pointer' src={Artyst_icon} alt='Artyst' />
                    </div>
                    <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                        <Link to='/' className="text-violet-500">
                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                            </svg>
                        </Link>
                        <Link to='/' className="ml-3 text-violet-500">
                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                        </Link>
                        <Link to='/' className="ml-3 text-violet-500">
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                            </svg>
                        </Link>
                        <Link to='/' className="ml-3 text-violet-500">
                            <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                <circle cx="4" cy="4" r="2" stroke="none"></circle>
                            </svg>
                        </Link>
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
