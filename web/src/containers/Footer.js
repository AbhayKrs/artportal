import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = ({ hidePane }) => {
    const navigate = useNavigate();

    return (
        <footer className={`w-full mt-auto bg-slate-100 dark:bg-darkBg ${hidePane ? "pl-16" : "pl-60"} `}>
            <div className='flex flex-row py-3 px-4 justify-between'>
                <span className='text-xs items-center text-gray-400 dark:text-gray-300'>
                    Copyright &#169; 2024 artportal Inc.
                </span>
                <div className="flex flex-row gap-3">
                    <Link to='/settings/about' className=' text-xs items-center text-gray-400 dark:text-gray-300'>
                        about
                    </Link>
                    <Link to='/settings/tos' className=' text-xs items-center text-gray-400 dark:text-gray-300'>
                        terms of service
                    </Link>
                    <Link to='/settings/privacy' className=' text-xs items-center text-gray-400 dark:text-gray-300'>
                        privacy policy
                    </Link>
                </div>
            </div>
        </footer >
    )
}

export default Footer;
