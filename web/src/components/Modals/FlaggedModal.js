const FlaggedModal = ({ open, onClose }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-4/12 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col items-center'>
                        <h1 className='text-neutral-800 dark:text-gray-200 text-xl font-semibold tracking-wide'>Inappropriate or Explicit Content</h1>
                        <div className='flex flex-col gap-1 items-center text-center mt-3'>
                            <p className='text-neutral-700 dark:text-gray-300 text-sm tracking-wide'>The upload was flagged as inappropriate or of mature nature and is not allowed per site policies.</p>
                            <p className='text-neutral-700 dark:text-gray-300 text-sm tracking-wide'>Please try again!</p>
                        </div>
                        <div className='flex items-center mt-3'>
                            <button onClick={onClose} className='text-white dark:text-blue-700 bg-gray-600 dark:bg-gray-200 hover:text-blue-700 dark:hover:text-blue-700 px-4 py-2 rounded-md  font-bold dark:font-normal'>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FlaggedModal;