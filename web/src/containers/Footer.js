import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = ({ hidePane }) => {
    const navigate = useNavigate();

    return (
        <footer className={`w-full mt-auto bg-slate-200 dark:bg-darkBg border-t-[3px] border-gray-400 dark:border-neutral-800 ${hidePane ? "pl-16" : "pl-60"} `}>
            <div className='flex flex-row py-1 px-2 justify-between'>
                <span className='text-xs items-center text-gray-400 dark:text-gray-300'>
                    &#169; 2025 artportal Inc.
                </span>
                <div className="flex flex-row gap-4">
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
