import React from 'react';
import { useNavigate } from "react-router-dom";
import { api_fetchArtworkImages, api_fetchUserImages } from '../utils/api_routes';
import moment from 'moment';

const ImageCard = ({ explore, author, }) => {
    let navigate = useNavigate();

    return (
        <div style={{ backgroundImage: `url(${api_fetchArtworkImages(explore.files[0])})` }} className="group bg-gray-100 m-auto w-full h-64 bg-top bg-no-repeat bg-cover group-hover:block">
            <div className="hidden items-end h-full w-full group-hover:flex group-hover:flex-row">
                <div className="flex flex-col w-full pb-2 pt-14 px-2 bg-gradient-to-t from-black text-gray-200 group-hover:flex" >
                    <h3 className="text-base font-bold leading-5 capitalize">{explore.title.length > 20 ? explore.title.slice(0, 20) + "..." : explore.title}</h3>
                    <div className="inline-flex items-center">
                        <div className="w-5 h-5 overflow-hidden mr-1">
                            {author.avatar.icon.length > 0 && <img loading='lazy' src={api_fetchUserImages(author.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />}
                        </div>
                        <span className="font-base text-xs my-1 mr-1">
                            {author.username}
                        </span>
                        <svg className="stroke-current stroke-1 text-blue-600 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <div className="w-max inline-flex items-center">
                                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-xs ml-1 antialiased">{explore.likes.length}</span>
                            </div>
                            <div className="w-max inline-flex ml-2 items-center">
                                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-xs ml-1 antialiased">{explore.comment_count}</span>
                            </div>
                            <div className="w-max inline-flex ml-2 items-center">
                                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs ml-1 antialiased">{moment(explore.createdAt).fromNow()}</span>
                            </div>
                        </div>
                        <button onClick={() => navigate(`/explore/${explore._id}`)} className="w-5 h-5 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 active:shadow-lg shadow transition ease-in duration-200 focus:outline-none">
                            <svg fill="currentColor" className="m-auto h-3 w-3" viewBox="0 0 20 20">
                                <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                            </svg>
                        </button>
                    </div>
                </div >
            </div >
        </div >
    )
}

export default ImageCard;