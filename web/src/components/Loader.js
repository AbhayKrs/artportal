import React, { useEffect } from 'react';
import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';

const Loader = ({ open, setLoader }) => {
    useEffect(() => {
        if (open) {
            document.querySelector("body").style.overflow = 'hidden';
            setTimeout(() => {
                setLoader(false);
            }, 1500)
        } else {
            document.querySelector("body").style.overflow = 'auto';
        }
    }, [open])

    return (
        <div className={`absolute ${open ? 'flex' : 'hidden'} inset-0 z-[100] h-screen w-screen content-center bg-gray-200 dark:bg-darkBg pointer-events-none`}>
            <Artportal_logo fill="#4f46e5" className='animate-pulse m-auto h-24 w-24 hover:cursor-pointer' />
        </div>
    )
}

export default Loader