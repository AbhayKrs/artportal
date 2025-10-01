import { api_userImages } from '../../utils/api_routes';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';

const AvatarModal = ({ open, avatarList, title, onClose, a_handleEditUserAvatar }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-3xl font-semibold tracking-wide '>{title}</h1>
                        <div className='grid grid-rows-4 grid-flow-col gap-4'>
                            {avatarList.map(avatar => (
                                <img loading='lazy' onClick={() => a_handleEditUserAvatar(avatar)} id={avatar._id} src={api_userImages(avatar.icon)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AvatarModal;