import React, { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import TokenIcon from '../assets/images/money.png';

import { api_fetchUserImages } from '../utils/api';

export const AwardConfirmModal = ({ open, awardData, onClose, handleAwardExplore }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative w-7/12 m-auto bg-neutral-800 rounded-xl">
                <div className='p-4 flex flex-col'>
                    <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute right-0 top-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <div className='flex items-center space-x-2 my-2'>
                        {awardData ? <img loading='lazy' className='h-12 w-12' src={api_fetchUserImages(awardData.icon)} /> : null}
                        <div className='tracking-widest flex-row'>
                            <p className='text-violet-800 font-montserrat text-2xl font-semibold '>testing award confirm</p>
                            <span className='flex items-center font-bold text-lg text-emerald-500'><img loading='lazy' src={TokenIcon} className='h-5 w-5 mr-1' />500</span>
                        </div>
                    </div>
                    <p className='text-gray-200 font-montserrat text-md'>Purchased by akn787.</p>
                    <p className='text-gray-500 text-sm italic'>By purchasing the award, you understand the mentioned total will be deducted from your balance.</p>
                    <hr className='h-2 w-full px-2 mt-2' />
                    <div className='flex items-center place-content-between'>
                        <p className='flex text-md text-gray-300 font-montserrat'>Current Balance: <img loading='lazy' src={TokenIcon} className='h-6 w-6 ml-1 mr-0.5' />9999</p>
                        <button onClick={() => { handleAwardExplore(awardData); onClose() }} className='p-1.5 bg-yellow-400 w-fit rounded-md'>Confirm</button>
                    </div>
                </div>
            </div>
        </div >
    )
}
