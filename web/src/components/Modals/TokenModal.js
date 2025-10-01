import React, { useEffect, useState } from 'react';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';
import PurchaseModal from './PurchaseModal';

const TokenModal = ({ open, onClose, title, user }) => {
    const [purchaseDialog, setPurchaseDialog] = useState({
        open: false,
        value: '',
        price: 0
    });

    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-5/12 sm:w-11/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-4xl font-semibold tracking-widest '>{title}</h1>
                        <div className='text-black dark:text-white text-md '>Tokens are used to purchase awards, badges and profile avatars. You can gift your tokens to artists you admire as well!</div>
                        <h1 className='text-3xl  m-2 text-rose-400 dark:text-rose-600'>*Feature to be added soon.</h1>
                    </div>
                </div>
            </div>
            <PurchaseModal
                open={purchaseDialog.open}
                value={purchaseDialog.value}
                price={purchaseDialog.price}
                user={user}
                onClose={() => setPurchaseDialog({ open: false, value: '', price: 0 })}
                onClick={() => setPurchaseDialog({ open: false, value: '', price: 0 })}
            />
        </div>
    )
};

export default TokenModal;