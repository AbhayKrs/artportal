import React, { useEffect } from 'react';
import LoaderDarkGif from '../assets/images/loader_dark.gif';
import LoaderLightGif from '../assets/images/loader_light.gif';

const Loader = (props) => {

    useEffect(() => {
        if (props.open) {
            document.querySelector("body").style.overflow = 'hidden';
            setTimeout(() => {
                props.setLoader(false);
            }, 1500)
        } else {
            document.querySelector("body").style.overflow = 'auto';
        }
    }, [props.open])

    return (
        <div className={`${props.open ? 'flex' : 'hidden'} absolute inset-0 z-[100] h-full w-full bg-slate-200 dark:bg-darkNavBg pointer-events-none`}>
            {props.colorTheme === 'dark' ?
                <img loading='lazy' className='m-auto h-48' src={LoaderDarkGif} />
                :
                <img loading='lazy' className='m-auto h-48' src={LoaderLightGif} />
            }
        </div>
    )
}

export default Loader