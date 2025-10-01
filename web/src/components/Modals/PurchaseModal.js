import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';
import TokenLogo from '../../assets/images/money.png';

const PurchaseModal = ({ open, value, price, user, onClose }) => {
    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 md:w-4/12 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-3xl font-semibold tracking-wide '>Add {new Intl.NumberFormat().format(value)} tokens</h1>
                        <div className='text-rose-500 text-md '>Total: &#8377;{Number.parseFloat(price).toFixed(2)}</div>
                        <p className='mt-2 text-gray-700 dark:text-gray-300 text-sm'>Purchased tokens will be added to, <span>{user.username}</span></p>
                        <p className='text-gray-500 text-xs'>By purchasing Coins and Awards, you agree to the <button type='button' className='text-xs font-bold text-blue-700'>artportal User Agreement</button>.</p>
                        <hr className='my-3 border-gray-500 dark:border-gray-300' />
                        <div className='flex flex-row justify-between'>
                            <h6 className='flex text-gray-700 dark:text-gray-300 text-md items-center'>Current Balance: <img loading='lazy' src={TokenLogo} className='w-5 h-5 mx-1' />{new Intl.NumberFormat().format(user.tokens)}</h6>
                            <button className='whitespace-nowrap text-center bg-amber-400 text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 py-1 px-4 rounded-md text-sm  font-bold'>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default PurchaseModal;