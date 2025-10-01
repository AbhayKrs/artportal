import React, { useState } from 'react';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';

import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    PinterestIcon,
    PinterestShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";

const ShareModal = ({ open, value, title, onClose }) => {
    const [linkCopy, setLinkCopy] = useState(false);
    const shareURL = window.location.href;

    const copyLink = () => {
        setLinkCopy(true);
        navigator.clipboard.writeText(shareURL)
    }

    return (
        <div className={`${open ? 'block' : 'hidden'} flex  fixed w-full inset-0 z-50 overflow-hidden justify-center items-center animated fadeIn faster`} style={{ background: 'rgba(0, 0, 0, .7)' }}>
            <div className="relative m-auto bg-slate-100 dark:bg-neutral-800 sm:w-8/12 xs:w-11/12 rounded-xl z-50 overflow-y-auto">
                <div className='grid'>
                    <div className='p-4 flex flex-col'>
                        <IoCloseSharp onClick={onClose} className='w-7 h-7 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-400' />
                        <h1 className='text-blue-700 dark:text-indigo-800 text-3xl font-semibold tracking-wide '>{title}</h1>
                        <div className='flex flex-col gap-3 py-2 px-4'>
                            <div>
                                <h4 className='text-gray-500 dark:text-gray-300 text-lg '>Share this with via...</h4>
                                <div className='flex gap-2'>
                                    <FacebookShareButton url={shareURL} >
                                        <FacebookIcon className="h-12 w-12" round={true} />
                                    </FacebookShareButton>
                                    <EmailShareButton url={shareURL}>
                                        <EmailIcon className="h-12 w-12" round={true} />
                                    </EmailShareButton>
                                    <LinkedinShareButton url={shareURL}>
                                        <LinkedinIcon className="h-12 w-12" round={true} />
                                    </LinkedinShareButton>
                                    <PinterestShareButton url={shareURL} media={shareURL}>
                                        <PinterestIcon className="h-12 w-12" round={true} />
                                    </PinterestShareButton>
                                    <RedditShareButton url={shareURL}>
                                        <RedditIcon className="h-12 w-12" round={true} />
                                    </RedditShareButton>
                                    <TelegramShareButton url={shareURL}>
                                        <TelegramIcon className="h-12 w-12" round={true} />
                                    </TelegramShareButton>
                                    <TwitterShareButton url={shareURL}>
                                        <TwitterIcon className="h-12 w-12" round={true} />
                                    </TwitterShareButton>
                                    <WhatsappShareButton url={shareURL}>
                                        <WhatsappIcon className="h-12 w-12" round={true} />
                                    </WhatsappShareButton>
                                </div>
                            </div>
                            <hr />
                            <button disabled={linkCopy} onClick={() => copyLink()} className='w-fit bg-blue-700 text-gray-900 dark:text-gray-200 hover:bg-blue-700 dark:hover:bg-blue-700 px-3 py-1 rounded-md text-lg  font-bold dark:font-normal'>{!linkCopy ? 'Copy the link url' : 'Link Copied!'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShareModal;