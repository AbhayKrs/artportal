import React, { useState, useEffect } from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'

const Dropdown = (props) => {
    const [dropMenu, setDropMenu] = useState(false);

    useEffect(() => {
        let menuDiv = document.getElementById(props.name);
        menuDiv.addEventListener('focusout', (ev) => {
            setDropMenu(false)
        })
    }, [dropMenu])

    const selectItem = (item) => {
        props.onSelect(item);
    }

    const toggleMenu = () => {
        setDropMenu(!dropMenu);
    }

    return (
        <div className="relative w-fit inline-block text-left z-10">
            <div className="rounded-md shadow-sm space-y-0.5">
                <button id={props.name} onClick={() => toggleMenu()} className="inline-flex min-w-[10em] justify-between w-full px-3 py-1.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-400 transition duration-150 ease-in-out bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-900 rounded-md focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
                    <span>{props.selectedPeriod}</span>
                    {dropMenu ?
                        <MdKeyboardArrowUp className="w-5 h-5 ml-4 -mr-1" /> : <MdKeyboardArrowDown className="w-5 h-5 ml-4 -mr-1" />
                    }
                </button>
            </div>
            <div style={dropMenu ? { opacity: 1, transform: 'translate(0) scale(1)', visibility: 'visible' } : {}} className="opacity-0 invisible transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
                <div className={`absolute w-56 mt-2 ${props.right && `right-0`} ${props.left && `left-0`} origin-top-right bg-white dark:bg-neutral-900 divide-y divide-gray-100 rounded-md shadow-lg outline-none`} aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
                    <div className="p-1 space-y-0.5">
                        {props.options.map((option, index) => (
                            <div key={index} onClick={() => selectItem(option)} tabIndex={index} className={`text-gray-700 dark:text-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left ${props.selectedPeriod === option.label && `bg-gray-200 dark:bg-neutral-800`} hover:bg-gray-100 dark:hover:bg-neutral-800/25 rounded`} role="option">{option.label}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dropdown;