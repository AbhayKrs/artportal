import { useNavigate } from "react-router-dom";
import moment from 'moment';

import { api_artworkImages, api_userImages } from '../../utils/api_routes';

import { AiFillClockCircle, AiFillHeart } from 'react-icons/ai';
import { BsChatFill, BsInfoCircleFill } from 'react-icons/bs';

const ImageCard = ({ size, artwork, artist }) => {
    let navigate = useNavigate();

    return (
        <div className={`group flex rounded-md relative cursor-pointer ${size === 'l' ? 'h-44 w-auto' : 'h-36 w-auto'}`} onClick={() => navigate(`/artworks/${artwork._id}`)}>
            {artwork.files[0].length > 0 && <img src={api_artworkImages(artwork.files[0])} className='object-cover w-full h-full rounded-md' />}
            <div className="hidden items-end h-full w-full group-hover:absolute group-hover:top-0 group-hover:flex group-hover:flex-row">
                <div className="flex flex-col w-full pb-2 pt-14 px-2 bg-gradient-to-t from-black text-gray-200 group-hover:flex rounded-b-md" >
                    <h3 className={`${size === 'l' ? 'text-base' : 'text-sm'} font-bold leading-5 capitalize`}>{artwork.title.length > 20 ? artwork.title.slice(0, 20) + "..." : artwork.title}</h3>
                    <div className="inline-flex items-center">
                        <div className="w-5 h-5 overflow-hidden mr-1">
                            {artist.avatar.icon.length > 0 && <img loading='lazy' src={api_userImages(artist.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />}
                        </div>
                        <span className="font-base text-xs my-1 mr-1">
                            {artist.username}
                        </span>
                        <svg className="stroke-current stroke-1 text-blue-700 dark:text-blue-700 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                    </div>
                    {size === 'l' ? <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <div className="w-max inline-flex items-center">
                                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-xs ml-1 antialiased">{artwork?.likes?.length}</span>
                            </div>
                            <div className="w-max inline-flex ml-2 items-center">
                                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-xs ml-1 antialiased">{artwork?.comment_count}</span>
                            </div>
                            <div className="w-max inline-flex ml-2 items-center">
                                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs ml-1 antialiased">{moment(artwork.createdAt).fromNow()}</span>
                            </div>
                        </div>
                    </div> : null
                    }
                </div >
            </div >
        </div >
    )
}

export default ImageCard;