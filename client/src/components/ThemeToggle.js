import React, { useState } from 'react';

const ThemeToggle = (props) => {
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
        <div className='relative ml-4 pl-4 border-l border-slate-900/10 dark:border-slate-50/[0.06]'>
            <button className='box-content block z-2 relative w-5 h-5 m-0 p-0 outline-none bg-none border-2 border-solid border-neutral-700 dark:border-slate-200 rounded-full transition-all cursor-pointer' onClick={toggleFn}>
                <svg width="0" height="0" stroke="none">
                    <defs>
                        <clipPath id="myLightCurve" clipPathUnits="objectBoundingBox">
                            <path d="m 0 1 V 0.5 Q 0.5 0.25 1 0.5 V 1 z" />
                        </clipPath>
                        <clipPath id="myDarkCurve" clipPathUnits="objectBoundingBox">
                            <path d="m 0 1 V 0.5 Q 0.5 0.25 1 0.5 V 1 z" />
                        </clipPath>
                    </defs>
                </svg>
                <div style={{ clipPath: "url(#myDarkCurve)" }} className='absolute top-0 left-0 w-4 h-4 m-0.5 bg-neutral-700 dark:bg-slate-200 rounded-full transition-all' />
            </button>
        </div>
    )
};

export default ThemeToggle;