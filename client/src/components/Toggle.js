import React, { useState } from 'react';

export const ThemeToggle = (props) => {
    const { value, toggle } = props;

    const toggleFn = () => {
        const toggleBtn = document.querySelector('#toggle');

        toggle();
        if (value === "dark") {
            toggleBtn.classList.remove('bg-black');
            toggleBtn.classList.add('bg-white');
        } else {
            toggleBtn.classList.remove('bg-white');
            toggleBtn.classList.add('bg-black');
        }
    }

    return (
        <div className='flex flex-row justify-between items-center rounded-md py-1 pl-4'>
            <p className='text-lg font-caviar font-semibold text-gray-900 dark:text-gray-200'>Theme</p>
            <div id="toggle" className="bg-black inset-20 h-6 w-6 rounded-full cursor-pointer" onClick={toggleFn}></div>
        </div >
    )
}

{/* <button className="flex relative bg-slate-400 dark:bg-neutral-800 " id="theme-toggle" title="Toggles light & dark" aria-label="auto" aria-live="polite" onClick={() => toggleFn()}>
                <img className='h-20' src={toggleBg} />
                <div id="toggle" className="bg-white h-5 w-5 rounded-full absolute right-2 top-1.5 transition ease-in-out delay-500"></div>
            </button> */}