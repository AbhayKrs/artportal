import { api_userImages } from '../../utils/api_routes';

import TokenIcon from '../../assets/images/money.png';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';

const AwardConfirmModal = ({ open, awardData, user, onClose, awardClose, artworkID, handleAwardArtwork }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-4/12 md:w-6/12 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='p-4 flex flex-col'>
                    <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute right-0 top-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                    <p className='text-indigo-800  text-2xl font-semibold '>Confirm Purchase?</p>
                    <div className='flex items-center gap-3 my-2'>
                        {awardData.icon.length > 0 && <img loading='lazy' className='h-16 w-16' src={api_userImages(awardData.icon)} />}
                        <div className='flex-row'>
                            <div className='flex gap-1 items-center'>
                                <img loading='lazy' src={TokenIcon} className='h-6 w-6' />
                                <span className='flex items-center font-bold text-2xl text-emerald-500 '>{awardData.value}</span>
                            </div>
                            <p className='text-gray-900 font-bold dark:text-gray-200  text-md'>Awarded by {user.username}.</p>
                            <p className='text-gray-400 text-sm italic'>By purchasing the award, you understand the mentioned total will be deducted from your balance.</p>
                        </div>
                    </div>
                    <hr className='h-2 w-full px-2 mt-2' />
                    <div className='flex items-center place-content-between'>
                        <p className='flex text-md text-gray-900 font-bold dark:text-gray-300 '>Current Balance: <img loading='lazy' src={TokenIcon} className='h-6 w-6 ml-1 mr-1' />{user.tokens}</p>
                        <button onClick={() => { handleAwardArtwork(awardData); onClose(); awardClose() }} className='p-1.5 bg-yellow-400 w-fit rounded-md'>Confirm</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AwardConfirmModal;