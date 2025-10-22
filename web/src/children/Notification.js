import React, { useState } from 'react'

import Divider from '../components/Divider';

export const Notifications = (props) => {
    const [accSettings, setAccSettings] = useState({
        mentions: { val: true, label: "Mentions and replies" },
        reposts: { val: true, label: "Reposts" },
        messages: { val: true, label: "Direct Messages" },
        follow: { val: true, label: "New follower" },
        like: { val: true, label: "Likes" },
        comments: { val: true, label: "Comments on artworks/posts" },
        pins: { val: true, label: "Pinned artworks" },
        featured: { val: false, label: "Featured artist" }
    });

    const [pushSettings, setPushSettings] = useState({
        announcements: { val: true, label: "Import Announcements" },
    });

    const handleToggleMsg = (itm) => {

    }

    return (
        <div className='flex flex-col gap-3 col-span-3 p-2 text-neutral-700 dark:text-gray-300'>
            <div className='flex flex-col gap-1'>
                <h1 className="text-2xl font-medium tracking-wide">Notification Settings</h1>
            </div>
            <div className='flex flex-col gap-3 py-2'>
                <p className="text-lg tracking-wide">Account related notifications</p>
                {Object.keys(accSettings).map(itm => (
                    <div className='flex flex-row gap-2 items-center'>
                        <input
                            type="checkbox"
                            checked={accSettings[itm].val}
                            onChange={() => handleToggleMsg(itm)}
                            style={{ WebkitAppearance: 'none' }}
                            className="h-4 w-4 appearance-none align-middle rounded-md outline-none bg-slate-300 dark:bg-neutral-700 checked:bg-blue-700 dark:checked:bg-blue-700 cursor-pointer"
                        />
                        <p className="text-lg tracking-wide">{accSettings[itm].label}</p>
                    </div>
                ))}
            </div>
            <Divider noPadding />
            <div className='flex flex-col gap-3 py-2'>
                <p className="text-lg tracking-wide">Push Notifications</p>
                {Object.keys(pushSettings).map(itm => (
                    <div className='flex flex-row gap-2 items-center'>
                        <input
                            type="checkbox"
                            checked={pushSettings[itm].val}
                            onChange={() => handleToggleMsg(itm)}
                            style={{ WebkitAppearance: 'none' }}
                            className="h-4 w-4 appearance-none align-middle rounded-md outline-none bg-slate-300 dark:bg-neutral-700 checked:bg-blue-700 dark:checked:bg-blue-700 cursor-pointer"
                        />
                        <p className="text-lg tracking-wide">{pushSettings[itm].label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Notifications