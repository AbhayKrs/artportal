import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Artyst_logo from '../assets/images/artyst_header.svg';
import Artyst_icon from '../assets/images/artyst_logo.svg';
import Artyst_title from '../assets/images/artyst_title.svg';

const Footer = () => {
    let navigate = useNavigate();

    return (
        <footer className="flex flex-row w-full mt-auto bg-slate-100 dark:bg-darkNavBg py-3 px-4 justify-between">
            <span className='font-nunito text-xs items-center text-gray-400 dark:text-gray-400/50'>
                Copyright &#169; 2024 Artyst Inc.
            </span>
            <div className="flex flex-row space-x-3">
                <Link to='/about' className='font-nunito text-xs items-center text-gray-400 dark:text-gray-400/50'>
                    about
                </Link>
                <Link to='/tos' className='font-nunito text-xs items-center text-gray-400 dark:text-gray-400/50'>
                    terms of service
                </Link>
                <Link to='/privacy' className='font-nunito text-xs items-center text-gray-400 dark:text-gray-400/50'>
                    privacy policy
                </Link>
            </div>
        </footer >
    )
}

export default Footer;
