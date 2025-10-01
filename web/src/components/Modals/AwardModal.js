import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';

const AwardModal = ({ open, onClose, title }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto xs:m-5 bg-slate-100 dark:bg-neutral-800 max-w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 pt-2 flex flex-col gap-3'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-4xl font-semibold tracking-widest '>{title}</h1>
                        {/* <AwardTabPanel awards={awardList} user={user} artworkID={artworkID} handleAwardArtwork={handleAwardArtwork} awardClose={onClose} /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AwardModal;