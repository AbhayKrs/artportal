import TokenLogo from '../../assets/images/money.png';
import Success from '../../assets/images/successgif.gif';

import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';

const SignupSuccessModal = ({ open, onClose, title, user }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 lg:w-5/12 sm:w-11/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 items-center text-center flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-4xl font-semibold tracking-widest '>{title}</h1>
                        <img src={Success} />
                        <div className='text-black dark:text-white text-2xl font-bold '>Thank you for joining the community! Have fun and enjoy your art journey here.</div>
                        <h1 className='text-md  font-bold mt-2 text-rose-400 dark:text-rose-600'>5000 tokens have been added to your account to celebrate the occation. Enjoy!</h1>
                        <h6 className='flex text-gray-700 dark:text-gray-300 text-md  font-bold items-center'>Token Balance: <img loading='lazy' src={TokenLogo} className='w-5 h-5 mx-1' />{new Intl.NumberFormat().format(user.tokens)}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupSuccessModal;