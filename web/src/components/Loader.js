import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';

const Loader = () => {
    return (
        <div className={`m-auto content-center bg-gray-200 dark:bg-darkBg pointer-events-none`}>
            <Artportal_logo fill="#1d4ed8" className='m-auto h-20 w-auto hover:cursor-pointer' />
        </div>
    )
}

export default Loader