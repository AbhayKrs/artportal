import { ReactComponent as LightMode } from '../assets/icons/LightMode.svg';
import { ReactComponent as DarkMode } from '../assets/icons/DarkMode.svg';

const ThemeToggle = ({ value, toggle }) => {
    return (
        <button className='relative px-2 sm:p-1.5 text-neutral-800 dark:text-gray-300 rounded-xl' onClick={toggle}>
            <div className='relative self-center hover:cursor-pointer h-5 w-5'>
                <LightMode className={`absolute h-5 w-5 inset-0 transition-all duration-700 ${value === "light" ? 'opacity-100' : 'opacity-0'}`} loading="lazy" />
                <DarkMode className={`absolute h-5 w-5 inset-0 transition-all duration-700 ${value === "dark" ? 'opacity-100' : 'opacity-0'}`} loading="lazy" />
            </div>
        </button>
    )
};

export default ThemeToggle;