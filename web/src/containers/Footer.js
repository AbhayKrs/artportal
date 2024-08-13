import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="flex flex-row w-full mt-auto bg-slate-100 dark:bg-darkBg py-3 px-4 justify-between">
            <span className='font-nunito text-xs items-center text-gray-400 dark:text-gray-400/50'>
                Copyright &#169; 2024 artportal Inc.
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
