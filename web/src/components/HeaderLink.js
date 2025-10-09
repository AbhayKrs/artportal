import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const HeaderLink = ({ type, name, path, hidePane, icon, text, activeRoute, func }) => {
    const activePath = path.split("?")[0];
    const cart = useSelector(state => state.user.cart);

    const showHeaderBadge = () => {
        switch (name) {
            case 'cart': if (cart.length > 0) return true;
            case 'notifications': if (true) return true;
            case 'default': return false;
        }
    }

    return (
        <>
            {type === "link" &&
                <Link to={path} className={`relative flex gap-1 items-end ${hidePane ? 'p-2' : 'p-3 text-lg font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                    <div className={`${activeRoute.includes(activePath) ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                    {icon}
                    {!hidePane && text}
                    {showHeaderBadge() && <div className={`${hidePane ? 'absolute top-1 right-1 z-10' : ''} self-center h-2 w-2 bg-red-500 rounded-full`} />}
                </Link>
            }
            {type === "button" &&
                <Link onClick={func} className={`flex gap-1 items-end ${hidePane ? 'p-2' : 'p-3 text-lg font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                    <div className={`${activeRoute.includes(activePath) ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                    {icon}
                    {!hidePane && text}
                </Link>
            }
        </>
    )
};

export default HeaderLink;