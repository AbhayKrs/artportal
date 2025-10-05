import React, { useState, useEffect } from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'

const Dropdown = ({ name, options, right, left, withBg, onSelect, selected }) => {
    const [dropMenu, setDropMenu] = useState(false);

    useEffect(() => {
        let menuDiv = document.getElementById(name);
        menuDiv.addEventListener('focusout', (ev) => {
            setDropMenu(false)
        })
    }, [dropMenu])

    const selectItem = (item) => {
        onSelect(item);
    }

    const toggleMenu = () => {
        setDropMenu(!dropMenu);
    }

    return (
        <div className="relative w-fit inline-block text-left z-10">
            <button id={name} onClick={() => toggleMenu()} className={`flex min-w-[6em] justify-between w-full px-3 py-1.5 text-base font-medium leading-5 text-gray-700 dark:text-gray-300 ${(dropMenu || withBg) && 'dark:bg-neutral-800'} transition duration-150 ease-in-out rounded-md dark:hover:bg-neutral-800`} type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
                <span>{selected}</span>
                {dropMenu ?
                    <MdKeyboardArrowUp className="w-5 h-5 ml-1" /> : <MdKeyboardArrowDown className="w-5 h-5 ml-1" />
                }
            </button>
            <div style={dropMenu ? { opacity: 1, transform: 'translate(0) scale(1)', visibility: 'visible' } : {}} className="opacity-0 invisible transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
                <div className={`absolute scrollbar max-h-[20em] w-56 overflow-auto mt-1 ${right && `right-0`} ${left && `left-0`} origin-top-right bg-slate-300 dark:bg-neutral-800 divide-y divide-gray-100 rounded-md shadow-lg outline-none`} aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
                    <div className="p-1 gap-0.5">
                        {options.map((option, index) => (
                            <button key={index} onClick={() => selectItem(option)} tabIndex={index} className={`text-gray-700 dark:text-gray-300 flex justify-between w-full px-4 py-2 text-base leading-5 text-left ${selected === option.label && `bg-gray-200 dark:bg-neutral-700`} hover:bg-gray-100 dark:hover:bg-neutral-700 rounded`} role="option">{option.label}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dropdown;