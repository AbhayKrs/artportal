import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { r_setLoader } from '../store/reducers/common.reducers';

import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';

const Loader = () => {
    const dispatch = useDispatch();
    const common = useSelector(state => state.common);

    useEffect(() => {
        if (common.loader) {
            console.log("loader", common.loader);
            document.querySelector("body").style.overflow = 'hidden';
            setTimeout(() => {
                dispatch(r_setLoader(false));
            }, 1500)
        } else {
            document.querySelector("body").style.overflow = 'auto';
        }
    }, [common.loader])

    return (
        <div className={`absolute ${common.loader ? 'flex' : 'hidden'} inset-0 z-[100] h-screen w-screen content-center bg-gray-200 dark:bg-darkBg pointer-events-none`}>
            <Artportal_logo fill="#4f46e5" className='animate-pulse m-auto h-24 w-24 hover:cursor-pointer' />
        </div>
    )
}

export default Loader