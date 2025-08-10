import React from 'react';

const Divider = ({ noPadding = false }) => {
    return (
        <hr className={`w-full border border-gray-300 dark:border-neutral-800 rounded-xl ${noPadding ? '' : 'my-2'}`} />
    )
};

export default Divider;