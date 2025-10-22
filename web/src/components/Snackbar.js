import React, { useEffect, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

import TaggerStartGif from '../assets/images/taggerstartgif.gif';
import TaggerStopGif from '../assets/images/taggerdonegif.gif';

const Snackbar = ({ msgdata, setMessage }) => {
    useEffect(() => {
        if (msgdata.type.length > 0 && msgdata.type !== 'tagger_start') {
            setTimeout(() => {
                closeSnack();
            }, 5000)
        }
    })

    const closeSnack = () => {
        const data = {
            open: false,
            message: '',
            type: ''
        }
        setMessage(data);
    }

    const selectedAlert = (type) => {
        switch (type) {
            case 'error': return <div className="alert fixed z-50 bottom-3 right-3 bg-neutral-900 m-2 rounded border-b-2 border-red-500">
                <div className='relative min-w-[250px] w-full p-3 flex flex-row items-center '>
                    <IoCloseSharp onClick={closeSnack} className='w-5 h-5 z-10 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <div className='relative flex flex-row items-center '>
                        <div className="alert-icon flex items-center bg-red-500 border-2 border-red-500 justify-center h-6 w-6 flex-shrink-0 rounded-full">
                            <span className="text-white">
                                <svg fill="currentColor" viewBox="0 0 20 20" className="h-4 w-4">
                                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </span>
                        </div>
                        <div className="alert-content ml-2">
                            <div className="alert-title font-semibold text-base text-red-500">
                                Error
                            </div>
                            <div className="alert-description text-xs text-gray-400">
                                {msgdata.message}
                            </div>
                        </div>
                    </div>
                </div>
            </div>;

            case 'success': return <div className="alert fixed z-50 bottom-3 right-3 bg-neutral-900 m-2 rounded border-b-2 border-green-500">
                <div className='relative min-w-[250px] w-full p-3 flex flex-row items-center '>
                    <IoCloseSharp onClick={closeSnack} className='w-5 h-5 z-10 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <div className="alert-icon flex items-center bg-green-500 border-2 border-green-500 justify-center h-6 w-6 flex-shrink-0 rounded-full">
                        <span className="text-white">
                            <svg fill="currentColor" viewBox="0 0 20 20" className="h-4 w-4">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                            </svg>
                        </span>
                    </div>
                    <div className="alert-content ml-2">
                        <div className="alert-title font-semibold text-base text-green-500">
                            Success
                        </div>
                        <div className="alert-description text-xs text-gray-400">
                            {msgdata.message}
                        </div>
                    </div>
                </div>
            </div>

            case 'warning': return <div className="alert fixed z-50 bottom-3 right-3 bg-neutral-900 m-2 rounded border-b-2 border-yellow-500">
                <div className='relative min-w-[250px] w-full p-3 flex flex-row items-center '>
                    <IoCloseSharp onClick={closeSnack} className='w-5 h-5 z-10 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <div className="alert-icon flex items-center bg-yellow-500 border-2 border-yellow-500 justify-center h-6 w-6 flex-shrink-0 rounded-full">
                        <span className="text-white">
                            <svg fill="currentColor" viewBox="0 0 20 20" className="h-4 w-4">
                                <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" ></path>
                            </svg>
                        </span>
                    </div>
                    <div className="alert-content ml-2">
                        <div className="alert-title font-semibold text-base text-yellow-500">
                            Warning
                        </div>
                        <div className="alert-description text-xs text-gray-400">
                            {msgdata.message}
                        </div>
                    </div>
                </div>
            </div>

            case 'info': return <div className="alert fixed z-50 bottom-3 right-3 bg-neutral-900 m-2 rounded border-b-2 border-blue-500">
                <div className='relative min-w-[250px] w-full p-3 flex flex-row items-center '>
                    <IoCloseSharp onClick={closeSnack} className='w-5 h-5 z-10 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <div className="alert-icon flex items-center bg-blue-400 text-white border-2 border-blue-400 justify-center h-6 w-6 flex-shrink-0 rounded-full">
                        <span className="text-white">
                            <svg fill="currentColor" className="h-3 w-3" viewBox="0 0 20 20">
                                <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                            </svg>
                        </span>
                    </div>
                    <div className="alert-content ml-2">
                        <div className="alert-title font-semibold text-base text-blue-400">
                            Info
                        </div>
                        <div className="alert-description text-xs text-gray-400">
                            {msgdata.message}
                        </div>
                    </div>
                </div>
            </div>

            case 'tagger_start': return <div className="alert fixed md:w-[30em] z-50 bottom-3 right-3 bg-[#90d5de] m-2 rounded">
                <div className='relative min-w-[250px] pr-3 w-full flex flex-row items-center '>
                    <img loading='lazy' src={TaggerStartGif} className='xs:h-16 md:h-20 ml-1 mr-1' />
                    <div className="alert-content xs:p-2 md:p-0 ml-2">
                        <div className="alert-title font-bold text-base text-black">
                            Assigning categories
                        </div>
                        <div className="alert-description font-semibold text-xs text-neutral-800">
                            {msgdata.message}
                        </div>
                    </div>
                </div>
            </div>

            case 'tagger_stop': return <div className="alert fixed md:w-[30em] z-50 bottom-3 right-3 bg-[#90d5de] m-2 rounded">
                <div className='relative min-w-[250px] pr-3 w-full flex flex-row items-center '>
                    <img loading='lazy' src={TaggerStopGif} className='xs:h-16 md:h-20 ml-1 mr-1' />
                    <div className="alert-content xs:p-2 md:p-0 ml-2">
                        <div className="alert-title font-bold text-base text-black">
                            Success
                        </div>
                        <div className="alert-description font-semibold text-xs text-neutral-800">
                            {msgdata.message}
                        </div>
                    </div>
                </div>
            </div>

            default: break;
        }
    }
    return (
        <>
            {msgdata.open ? selectedAlert(msgdata.type) : null}
        </>
    )
}

export default Snackbar