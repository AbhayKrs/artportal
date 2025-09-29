import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const HeaderLink = ({ type, path, hidePane, icon, text, activeRoute, func }) => {
    console.log("t", path, activeRoute)
    return (
        <>
            {type === "link" &&
                <Link to={path} className={`flex gap-2 items-end ${hidePane ? 'p-2' : 'p-3 text-lg font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                    <div className={`${path.includes(activeRoute) ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                    {icon}
                    {!hidePane && text}
                </Link>
            }
            {type === "button" &&
                <Link onClick={func} className={`flex gap-1 items-end ${hidePane ? 'p-2' : 'p-3 text-lg font-medium tracking-wide'} hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                    <div className={`${path.includes(activeRoute) ? 'flex' : 'hidden'} h-5 w-1 bottom-[-4px] left-0 rounded text-2xl bg-blue-700 dark:bg-blue-700`}></div>
                    {icon}
                    {!hidePane && text}
                </Link>
            }
        </>
    )
};

export default HeaderLink;