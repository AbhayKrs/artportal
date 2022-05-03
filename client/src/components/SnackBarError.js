import React, { useEffect, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { MdError } from 'react-icons/md';

const SnackBarError = (props) => {
    const [open, setOpen] = useState(props.open);
    useEffect(() => {
        if (props.error.type.length > 0) {
            setOpen(true)
            setTimeout(() => {
                closeSnackbar();
            }, 10000)
        }
    })

    const closeSnackbar = () => {
        const error = {
            open: false,
            message: '',
            type: ''
        }
        props.setError(error);
        setOpen(false);
    }

    return (
        <>
            {open ?
                <div class="m-2 z-50 fixed bottom-0 inline-flex items-center bg-rose-700 text-gray-200 rounded-lg p-3 shadow text-md space-x-4">
                    <MdError className='h-5 w-5' />
                    <span class="inline-flex font-caviar font-bold">{props.error.message}</span>
                    <IoCloseSharp onClick={closeSnackbar} className='h-5 w-5' />
                </div>
                :
                null
            }
        </>
    )
}

export default SnackBarError