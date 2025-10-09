import { Helmet } from 'react-helmet';
import Title from '../components/Title';

import { ReactComponent as LikeFilledIcon } from '../assets/icons/likefilled.svg';
import Divider from '../components/Divider';

const Notifications = () => {
    return (
        <div className='flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-darkBg'>
            <Helmet>
                <title>artportal | Notifications</title>
            </Helmet>
            <div className={`flex flex-col gap-2 w-full py-2 px-4`}>
                <Title text="Notifications" />

                <div className='flex flex-col gap-3 p-4 rounded-lg bg-slate-200 dark:bg-neutral-900 w-full'>
                    {[0, 1, 2, 3].map(item => (

                        <>
                            {/* Type 1 - Someone likes yours artwork */}
                            < div className='flex flex-row gap-6' >
                                <div className='flex flex-row items-center gap-4 h-10'>
                                    <div className='relative w-11 h-full'>
                                        <img className='absolute top-0 left-0 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                        <img className='absolute top-2 left-3 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                    </div>
                                    <span className='text-base text-neutral-800 dark:text-gray-300'>akn787, baaaasil and 69 others liked your artwork.</span>
                                    <span className='text-base text-neutral-800 dark:text-gray-400'>24hours ago</span>
                                </div>
                            </div>
                            <Divider noPadding />

                            {/* Type 2 -  Someone likes yours artstory */}
                            <div className='flex flex-row gap-6'>
                                <div className='flex flex-row items-center gap-4  h-10'>
                                    <div className='relative w-11 h-full'>
                                        <img className='absolute top-0 left-0 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                        <img className='absolute top-2 left-3 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                    </div>
                                    <span className='text-base text-neutral-800 dark:text-gray-300'>akn787, baaaasil and 3 others liked your artstory.</span>
                                    <span className='text-base text-neutral-800 dark:text-gray-400'>24hours ago</span>
                                </div>
                            </div>
                            <Divider noPadding />

                            {/* Type 3 -  Someone commented on your artwork */}
                            <div className='flex flex-row gap-6'>
                                <div className='flex flex-row items-center gap-4 h-10'>
                                    <div className='relative content-center items-center w-11 h-full'>
                                        <img className='m-auto h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                    </div>
                                    <span className='text-base text-neutral-800 dark:text-gray-300'>akn787 commented: Feels nostalgic, yet contemporary at the same time, lovely.</span>
                                    <span className='text-base text-neutral-800 dark:text-gray-400'>4weeks ago</span>
                                </div>
                            </div>
                            <Divider noPadding />

                            {/* Type 4 - Someone likes yours comment */}
                            <div className='flex flex-row gap-6'>
                                <div className='flex flex-row items-center gap-4 h-10'>
                                    <div className='relative w-11 h-full'>
                                        <img className='absolute top-0 left-0 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                        <img className='absolute top-2 left-3 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                    </div>
                                    <span className='text-base text-neutral-800 dark:text-gray-300'>akn787, baaaasil and 69 others liked your comment: This is so lovely!!</span>
                                    <span className='text-base text-neutral-800 dark:text-gray-400'>24hours ago</span>
                                </div>
                            </div>
                            <Divider noPadding />

                            {/* Type 5 -  Someone replied to you */}
                            <div className='flex flex-row gap-6'>
                                <div className='flex flex-row items-center gap-4 h-10'>
                                    <div className='relative content-center items-center w-11 h-full'>
                                        <img className='m-auto h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                    </div>
                                    <span className='text-base text-neutral-800 dark:text-gray-300'>akn787 replied to your comment on raphaelavant's post: @raphaelavant thank you! ❤️.</span>
                                    <span className='text-base text-neutral-800 dark:text-gray-400'>4days ago</span>
                                </div>
                            </div>
                            <Divider noPadding />

                            {/* Type 6 - Started following you */}
                            <div className='flex flex-row gap-6'>
                                <div className='flex flex-row items-center gap-4 h-10'>
                                    <div className='relative content-center items-center w-11 h-full'>
                                        <img className='m-auto h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                    </div>
                                    <span className='text-base text-neutral-800 dark:text-gray-300'>akn787 started following you.</span>
                                    <span className='text-base text-neutral-800 dark:text-gray-400'>4days ago</span>
                                </div>
                            </div>
                            <Divider noPadding />

                            {/* Type 7 - Bookmarked your artwork */}
                            <div className='flex flex-row gap-6'>
                                <div className='flex flex-row items-center gap-4 h-10'>
                                    <div className='relative w-11 h-full'>
                                        <img className='absolute top-0 left-0 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                        <img className='absolute top-2 left-3 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                    </div>
                                    <span className='text-base text-neutral-800 dark:text-gray-300'>akn787, baaaasil and 5 others bookmarked your artwork.</span>
                                    <span className='text-base text-neutral-800 dark:text-gray-400'>24hours ago</span>
                                </div>
                            </div>
                            <Divider noPadding />

                            {/* Type 9 - Artist - Featured alert */}
                            <div className='flex flex-row gap-6'>
                                <div className='flex flex-row items-center gap-4 h-10'>
                                    <div className='relative w-11 h-full'>
                                        <img className='absolute top-0 left-0 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                        <img className='absolute top-2 left-3 h-8 w-8 rounded-full shadow-md' src="http://localhost:5000/api/v1.01/common/files/6cbaa37fa59b0caee31dc4b8cdd67d72.png" />
                                    </div>
                                    <span className='text-base text-neutral-800 dark:text-gray-300'>akn787, you have been selected as our "Featured artist of the day". Congratulations! 🎉</span>
                                    <span className='text-base text-neutral-800 dark:text-gray-400'>24hours ago</span>
                                </div>
                            </div>
                            <Divider noPadding />

                            {/* Type 7 - Login alerts — new login detected, suspicious login attempt, etc. */}

                            {/* Type 8 - Password change or security update. */}
                        </>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default Notifications;