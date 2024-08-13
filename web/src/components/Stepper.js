import React from 'react'

const Stepper = ({ activeIndex }) => {
    return (
        <div>
            <div className="flex py-4 items-center space-x-2">
                <div className="flex flex-col items-center text-teal-600 relative space-y-1">
                    <div className={`rounded-full transition duration-500 ease-in-out h-4 w-4 ${activeIndex >= 0 ? 'bg-teal-600' : 'border-2  border-gray-500'}`}></div>
                    <div className={`text-xs font-medium uppercase ${activeIndex >= 0 ? 'text-teal-600' : 'text-gray-500'}`}>Details</div>
                </div>
                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${activeIndex > 0 ? 'border-teal-600' : 'border-gray-300'}`}></div>
                <div className="flex flex-col items-center text-white relative space-y-1">
                    <div className={`rounded-full transition duration-500 ease-in-out h-4 w-4 ${activeIndex >= 1 ? 'bg-teal-600' : 'border-2  border-gray-500'}`}></div>
                    <div className={`text-xs font-medium uppercase ${activeIndex >= 1 ? 'text-teal-600' : 'text-gray-500'}`}>Address</div>
                </div>
                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${activeIndex > 1 ? 'border-teal-600' : 'border-gray-300'}`}></div>
                <div className="flex flex-col items-center text-gray-500 relative space-y-1">
                    <div className={`rounded-full transition duration-500 ease-in-out h-4 w-4 ${activeIndex >= 2 ? 'bg-teal-600' : 'border-2  border-gray-500'}`}></div>
                    <div className={`text-xs font-medium uppercase ${activeIndex >= 2 ? 'text-teal-600' : 'text-gray-500'}`}>Payment</div>
                </div>
                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${activeIndex > 2 ? 'border-teal-600' : 'border-gray-300'}`}></div>
                <div className="flex flex-col items-center text-gray-500 relative space-y-1">
                    <div className={`rounded-full transition duration-500 ease-in-out h-4 w-4 ${activeIndex >= 3 ? 'bg-teal-600' : 'border-2  border-gray-500'}`}></div>
                    <div className={`text-xs font-medium uppercase ${activeIndex >= 3 ? 'text-teal-600' : 'text-gray-500'}`}>Confirmation</div>
                </div>
            </div>
        </div>
    )
}

export default Stepper