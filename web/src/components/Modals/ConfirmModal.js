const ConfirmModal = ({ open, title, onClose, onConfirm }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-4/12 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col items-center'>
                        <h1 className='text-blue-700 dark:text-indigo-800 text-xl font-semibold tracking-wide '>{title}</h1>
                        <div className='flex gap-4 mt-3'>
                            <button onClick={onClose} className='text-white dark:text-blue-700 bg-gray-600 dark:bg-gray-200 hover:text-blue-700 dark:hover:text-blue-700 px-4 py-2 rounded-md  font-bold dark:font-normal'>Cancel</button>
                            <button onClick={() => { onConfirm(); onClose() }} className='bg-blue-700 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 px-4 py-2 rounded-md  font-bold dark:font-normal'>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal;