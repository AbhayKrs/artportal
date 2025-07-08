import LightMode from '../assets/icons/LightMode.svg';
import DarkMode from '../assets/icons/DarkMode.svg';

const ThemeToggle = ({ value, toggle }) => {
    return (
        <button className='relative flex gap-2 items-end py-2 px-1.5 group hover:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-md text-xl font-medium tracking-wide' onClick={toggle}>
            <div className='relative self-center hover:cursor-pointer w-5 h-5'>
                <img className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${value === "light" ? 'opacity-100' : 'opacity-0'}`} loading='lazy' src={LightMode} />
                <img className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${value === "dark" ? 'opacity-100' : 'opacity-0'}`} loading='lazy' src={DarkMode} />
            </div>
            Theme
        </button>
    )
};

export default ThemeToggle;