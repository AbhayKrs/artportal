import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { a_fetchProduct, a_fetchProducts } from '../store/actions/store.actions';
import { r_setLoader, r_setSnackMessage, r_headerDialogOpen } from '../store/reducers/common.reducers';
import { api_userImages, api_artworkImages, api_productImages } from '../utils/api_routes';

import Ratings from '../components/Ratings';

import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { ImStarFull } from 'react-icons/im';
import { TiInfoLarge } from 'react-icons/ti';

const StoreView = (props) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeImg, setActiveImg] = useState('');

    const storeItem = useSelector(state => state.store.storeItem);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
        dispatch(a_fetchProducts());
        dispatch(a_fetchProduct(id));
    }, [])

    useEffect(() => {
        setActiveImg(storeItem.files[0])
    }, [storeItem])

    return (
        <div className='bg-gray-200 dark:bg-darkBg max-100vh pt-5'>
            <div className="text-black dark:text-white text-4xl title-font font-medium mx-5">{storeItem.title}</div>
            <p className='text-gray-600 dark:text-gray-400 whitespace-nowrap text-sm mx-5'>- Listed on {moment(storeItem.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <p className="text-gray-700 dark:text-gray-400 text-xl leading-relaxed mx-5">{storeItem.description}</p>
            <section className="text-gray-400 body-font overflow-hidden">
                <div className="p-4 mx-auto">
                    <div className="mx-auto flex flex-col lg:flex-row gap-3">
                        <div className="order-2 lg:order-1 lg:w-3/12 w-full mt-4 lg:mt-0 gap-2">
                            <h2 className="tracking-widest text-lg title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize'>{storeItem.category}</span></h2>
                            <div className='flex relative flex-col p-3 text-left justify-start text-neutral-900 dark:text-gray-400 bg-slate-300 dark:bg-neutral-900 rounded-md'>
                                <TiInfoLarge onClick={() => navigate(`/users/${storeItem.seller.id}`)} className='absolute cursor-pointer h-4 w-4 top-0 right-0 m-2' />
                                <div className="flex">
                                    <div className="w-6 h-6 overflow-hidden">
                                        {storeItem.seller ? <img loading='lazy' src={api_userImages(storeItem.seller.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" /> : null}
                                    </div>
                                    <p className=" pt-0.5 font-medium text-lg mx-0.5">
                                        {storeItem.seller.username}
                                    </p>
                                    <svg className="stroke-current stroke-1 text-blue-600 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                    </svg>
                                </div>
                                <div className='flex text-md items-center text-josefinlight'>Seller Rating: <span className='flex ml-2 items-center text-blue-700'>{Number.parseFloat(storeItem.seller.seller_rating).toFixed(1)}<ImStarFull className='ml-1 text-blue-700' /></span></div>
                            </div>
                            <span className="flex flex-col text-2xl text-neutral-700 dark:text-gray-300">
                                ${Number.parseFloat(storeItem.price).toFixed(2)}
                                <span className='text-xs text-rose-400'>including shipping & taxes</span>
                            </span>
                            <div className='flex gap-3'>
                                <button className="flex items-center  font-bold text-blue-700 bg-transparent border-2 border-blue-700 py-2 px-6 focus:outline-none hover:bg-blue-700 hover:text-gray-600 rounded-md">Add to Cart</button>
                                <button className="flex items-center  font-bold text-gray-300 bg-blue-700 py-2 px-6 focus:outline-none hover:bg-blue-700 hover:text-gray-600 rounded-md">Checkout</button>
                            </div>
                            {/*<div className='pt-5 pr-3 gap-2'>
                                <hr className='rounded border-1 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' />
                                <p className="text-black dark:text-gray-200 text-lg title-font font-medium mb-1">
                                    More from {storeItem.seller.username}
                                </p>
                            </div>
                             <div className='grid grid-cols-2 gap-2 mr-3'>
                                {[0, 1, 2, 3].map(item => <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden h-fit">
                                    <img loading='lazy' className="h-40 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={api_productImages(activeImg)} />
                                    <div className="py-4 px-2">
                                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400">CATEGORY: <span className='capitalize text-gray-700'>category</span></h2>
                                        <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">title</h1>
                                        <div className="flex items-center flex-wrap justify-between">
                                            <div className='tracking-wide text-md font-medium text-gray-500 '>$price</div>
                                            <button className="bg-gradient-to-r  font-semibold from-blue-700 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-2 py-1 rounded-lg">Learn more</button>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div> */}
                        </div>
                        <div className='order-1 lg:order-2 flex flex-col gap-2 lg:w-6/12 lg:h-full rounded'>
                            <img loading='lazy' className="w-full h-full object-cover object-center" src={api_productImages(activeImg)} />
                            <div className='grid grid-cols-3 gap-2'>
                                {storeItem.files.map((file, index) =>
                                    <img key={index} onClick={() => setActiveImg(file)} loading='lazy' className={`w-full object-cover object-center rounded ${activeImg === file ? 'border-4 border-blue-700 dark:border-blue-700' : ''}`} src={api_productImages(file)} />
                                )}
                            </div>
                        </div>
                        <div className='order-3 lg:order-3 lg:w-3/12 w-full lg:h-auto object-cover object-center rounded'>
                            <div className='flex flex-col justify-between'>
                                <p className="text-black dark:text-white text-2xl title-font font-medium mb-1">Ratings & Reviews</p>
                                <div className='flex gap-2 items-center text-black dark:text-gray-300'>
                                    <p className='text-md title-font'>Sort by:</p>
                                    <div className='flex items-center gap-1'>
                                        <p>Ratings</p>
                                        <div className='block'>
                                            <AiOutlineUp className='w-2 h-2' />
                                            <AiOutlineDown className='w-2 h-2' />
                                            {/*
                                                    <AiOutlineArrowUp className='w-3 h-3' />
                                                    <AiOutlineArrowDown className='w-3 h-3' />   
                                               */}
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <p>Date</p>
                                        <div className='block'>
                                            <AiOutlineUp className='w-2 h-2' />
                                            <AiOutlineDown className='w-2 h-2' />
                                            {/*
                                                    <AiOutlineArrowUp className='w-3 h-3' />
                                                    <AiOutlineArrowDown className='w-3 h-3' />   
                                               */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-300 dark:bg-neutral-900 p-4 mt-2 rounded-md">
                                <p className="text-black dark:text-gray-200 text-xl title-font font-medium mb-1">Customer Ratings</p>
                                <Ratings size='lg' withBg withValues rating={storeItem.rating} color='text-gray-200' />
                                <div className='flex flex-col mt-2 px-2 gap-2'>
                                    <Ratings withReview reviews={24} rating={5} color='text-indigo-400' />
                                    <Ratings withReview reviews={4} rating={4} color='text-indigo-400' />
                                    <Ratings withReview reviews={14} rating={3} color='text-indigo-400' />
                                    <Ratings withReview reviews={6} rating={2} color='text-indigo-400' />
                                    <Ratings withReview reviews={1} rating={1} color='text-indigo-400' />
                                </div>
                                <hr className='m-3 rounded border-1 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-200' />
                                <p className="text-black dark:text-gray-200 text-lg title-font font-medium mb-1">
                                    {storeItem.reviews.length} Reviews
                                </p>
                                {storeItem.reviews.map((review, index) => (
                                    <div key={index} className='flex flex-col rounded-lg bg-gray-300 dark:bg-neutral-800 text-neutral-700 dark:text-gray-300 py-2 px-4 mb-2 gap-1'>
                                        <div className='flex items-center justify-between'>
                                            <div onClick={() => navigate(`/users/${review.author.id}`)} className='flex cursor-pointer'>
                                                <div className="w-6 h-6 overflow-hidden">
                                                    <img loading='lazy' src={api_userImages(review.author.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />
                                                </div>
                                                <p className=" text-lg mx-0.5">
                                                    {review.author.username}
                                                </p>
                                            </div>
                                            <div className='flex flex-col'>
                                                <Ratings size='sm' withSingleValue rating={review.rating} color='text-indigo-400' />
                                                <p className='text-sm'>{'- ' + moment(review.createdAt).fromNow()}</p>
                                            </div>
                                        </div>
                                        <p className='text-md font-bold'>{review.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default StoreView;