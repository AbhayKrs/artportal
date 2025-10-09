import React, { useState } from 'react'
import { useEffect } from 'react';

export const Ratings = ({ size, reviews, rating, withBg, withReview, withValues, withSingleValue, color }) => {
    const [ratingSize, setRatingSize] = useState(0);

    useEffect(() => {
        switch (size) {
            case 'xs': { setRatingSize(3); break; }
            case 'sm': { setRatingSize(3.5); break; }
            case 'md': { setRatingSize(5); break; }
            case 'lg': { setRatingSize(6); break; }
            default: { setRatingSize(5); break; }
        }
    }, [])
    return (
        <div className={`flex gap-0.5 items-center ${withBg ? 'p-2 bg-blue-700 rounded-md' : ''}`}>
            <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className={`w-${ratingSize} h-${ratingSize} ${color}`} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className={`w-${ratingSize} h-${ratingSize} ${color}`} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className={`w-${ratingSize} h-${ratingSize} ${color}`} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className={`w-${ratingSize} h-${ratingSize} ${color}`} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className={`w-${ratingSize} h-${ratingSize} ${color}`} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            {withReview && <span className={`text-${size} ${withBg ? 'text-gray-700' : 'text-gray-600 dark:text-gray-400'}`}>{reviews} reviews</span>}
            {withSingleValue && <span className={`text-${size} text-gray-600 dark:text-gray-400`}>{Number.parseFloat(rating).toFixed(1)}</span>}
            {withValues && <span className={`text-${size} ${withBg ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>{Number.parseFloat(rating).toFixed(1)} out of 5.0</span>}
        </div>
    )
}

export default Ratings;