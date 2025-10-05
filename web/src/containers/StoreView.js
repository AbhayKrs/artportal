import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { filterOptions, periodOptions } from '../utils/constants';

import { a_fetchProduct, a_fetchProducts } from '../store/actions/store.actions';
import { r_setLoader, r_setSnackMessage, r_headerDialogOpen } from '../store/reducers/common.reducers';
import { api_userImages, api_artworkImages, api_productImages } from '../utils/api_routes';

import Ratings from '../components/Ratings';
import Divider from '../components/Divider';

import { ReactComponent as VerifiedIcon } from '../assets/icons/verified.svg';
import { ReactComponent as Artportal_logo } from '../assets/icons/artportal_logo.svg';

import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { ImStarFull } from 'react-icons/im';
import { TiInfoLarge } from 'react-icons/ti';
import CommentList from '../components/CommentList';
import Dropdown from '../components/Dropdown';

const StoreView = (props) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const hidePane = useOutletContext();

    const product = useSelector(state => state.store.product_item);

    const [activeImg, setActiveImg] = useState('');
    const [activeRatingLabel, setActiveRatingLabel] = useState('Ratings');
    const [activeDateLabel, setActiveDateLabel] = useState('Date');


    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
        dispatch(a_fetchProducts());
        dispatch(a_fetchProduct(id));
    }, [])

    useEffect(() => {
        setActiveImg(product.images[0])
    }, [product])

    const comments = [
        {
            "_id": "676a97844b74b764c2977319",
            "author": {
                "avatar": {
                    "icon": "6cbaa37fa59b0caee31dc4b8cdd67d72.png",
                    "category": "None"
                },
                "_id": "6761a96926d5543eacbf3353",
                "name": "Akunta",
                "username": "akn787"
            },
            "text": "test comm 1",
            "is_parent": true,
            "parent_ref": null,
            "likes": [
                "6761a96926d5543eacbf3353"
            ],
            "dislikes": [],
            "createdAt": "2024-12-24T11:14:12.597Z",
            "updatedAt": "2024-12-25T09:27:24.047Z",
            "__v": 0,
            "replies": []
        },
        {
            "_id": "676aa28cb8891b5e03505196",
            "author": {
                "avatar": {
                    "icon": "6cbaa37fa59b0caee31dc4b8cdd67d72.png",
                    "category": "None"
                },
                "_id": "6761a96926d5543eacbf3353",
                "name": "Akunta",
                "username": "akn787"
            },
            "text": "test comm 2",
            "is_parent": true,
            "parent_ref": null,
            "likes": [],
            "dislikes": [],
            "createdAt": "2024-12-24T12:01:16.087Z",
            "updatedAt": "2024-12-24T12:01:16.087Z",
            "__v": 0,
            "replies": [
                {
                    "_id": "676ac67cdb61939c768ca050",
                    "author": {
                        "avatar": {
                            "icon": "6cbaa37fa59b0caee31dc4b8cdd67d72.png",
                            "category": "None"
                        },
                        "_id": "6761a96926d5543eacbf3353",
                        "name": "Akunta",
                        "username": "akn787"
                    },
                    "text": "test reply 1",
                    "is_parent": false,
                    "parent_ref": "676aa28cb8891b5e03505196",
                    "likes": [],
                    "dislikes": [],
                    "createdAt": "2024-12-24T14:34:36.367Z",
                    "updatedAt": "2024-12-24T14:34:36.367Z",
                    "__v": 0,
                    "replies": [
                        {
                            "_id": "676acd0e6e92402b6f01d7c9",
                            "author": {
                                "avatar": {
                                    "icon": "6cbaa37fa59b0caee31dc4b8cdd67d72.png",
                                    "category": "None"
                                },
                                "_id": "6761a96926d5543eacbf3353",
                                "name": "Akunta",
                                "username": "akn787"
                            },
                            "text": "test reply 1.1",
                            "is_parent": false,
                            "parent_ref": "676ac67cdb61939c768ca050",
                            "likes": [],
                            "dislikes": [],
                            "createdAt": "2024-12-24T15:02:38.043Z",
                            "updatedAt": "2024-12-24T15:02:38.043Z",
                            "__v": 0,
                            "replies": []
                        }
                    ]
                }
            ]
        }
    ];

    const handleRatingFilter = (val) => {
        // setCategory(category.value);
        setActiveRatingLabel(val.label)
    }

    const handleDateFilter = (val) => {
        // setCategory(category.value);
        setActiveDateLabel(val.label)
    }


    return (
        <div className='md:relative flex flex-col md:flex-row bg-gray-200 dark:bg-darkBg max-100vh'>
            <div className={`flex flex-col justify-between w-full lg:w-[28.5%] order-2 lg:order-1 p-4 pr-2 min-h-show max-h-show`}>
                <div className="flex flex-col gap-1">
                    <h1 className="text-gray-900 dark:text-gray-200 text-2xl font-semibold">{product.title}</h1>
                    <p className="text-gray-800 dark:text-gray-300 text-base">{product.description}</p>
                    <h2 className="tracking-widest text-base font-semibold text-gray-400">Category: <span className='capitalize'>{product.category}</span></h2>
                    <div onClick={() => navigate(`/users/${product.seller._id}`)} className="flex flex-row gap-1 items-center cursor-pointer">
                        <div className="w-6 h-6 overflow-hidden">
                            {product.seller.avatar.icon.length > 0 && <img loading='lazy' src={api_userImages(product.seller.avatar.icon)} alt="user_avatar" className="object-cover w-full h-full" />}
                        </div>
                        <div className='flex flex-row items-center gap-1'>
                            <p className='text-neutral-800 dark:text-gray-200 text-base font-medium tracking-wide'>{product.seller.username}</p>
                            <VerifiedIcon className="stroke-current stroke-1 text-neutral-800 dark:text-gray-300 h-4 w-4" />
                            <Artportal_logo fill="#059669" className='h-3 w-auto' />
                        </div>
                    </div>
                    <p className="text-neutral-900 dark:text-gray-400 tracking-wide whitespace-nowrap text-sm">Listed on {moment(product.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="flex flex-col text-2xl text-neutral-700 dark:text-gray-300">
                        ${Number.parseFloat(product.price).toFixed(2)}
                        <span className='text-xs text-rose-400'>including shipping & taxes</span>
                    </span>
                    <div className='flex gap-3'>
                        <button onClick={() => { }} className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-blue-700 dark:bg-blue-700 disabled:bg-neutral-700 disabled:dark:bg-neutral-700 hover:bg-neutral-600 text-neutral-800 dark:text-gray-300 disabled:text-neutral-800 disabled:dark:text-neutral-500 rounded-xl items-center">
                            Add to Cart
                        </button>
                        <button onClick={() => { }} className="flex w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-orange-700 dark:bg-orange-700 disabled:bg-neutral-700 disabled:dark:bg-neutral-700 hover:bg-neutral-600 text-neutral-800 dark:text-gray-300 disabled:text-neutral-800 disabled:dark:text-neutral-500 rounded-xl items-center">
                            Checkout
                        </button>
                    </div>
                    {/* <div className='pt-5 pr-3 gap-2'>
                            <hr className='rounded border-1 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' />
                            <p className="text-black dark:text-gray-200 text-lg  font-medium mb-1">
                                More from {product.seller.username}
                            </p>
                        </div>
                        <div className='grid grid-cols-2 gap-2 mr-3'>
                            {[0, 1, 2, 3].map(item => <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden h-fit">
                                <img loading='lazy' className="h-40 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={api_productImages(activeImg)} />
                                <div className="py-4 px-2">
                                    <h2 className="tracking-widest text-xs  font-medium text-gray-400">CATEGORY: <span className='capitalize text-gray-700'>category</span></h2>
                                    <h1 className=" text-lg font-medium text-neutral-800 dark:text-neutral-300">title</h1>
                                    <div className="flex items-center flex-wrap justify-between">
                                        <div className='tracking-wide text-md font-medium text-gray-500 '>$price</div>
                                        <button className="bg-gradient-to-r  font-semibold from-blue-700 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-2 py-1 rounded-lg">Learn more</button>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div> */}
                </div>
            </div>
            <div className={`flex flex-col gap-2 w-full lg:w-[45%] order-1 lg:order-2 p-4 pr-2 min-h-show max-h-show`}>
                <img loading='lazy' className="w-full h-full object-cover object-center rounded-lg" src={api_productImages(activeImg)} />
                <div className='grid grid-cols-5 gap-2'>
                    {product.images.map((img, index) =>
                        <img key={index} onClick={() => setActiveImg(img)} loading='lazy' className={`w-full object-cover object-center cursor-pointer rounded-lg ${activeImg === img ? 'border-3 border-blue-700 dark:border-blue-700' : ''}`} src={api_productImages(img)} />
                    )}
                </div>
            </div>
            <div className={`flex flex-col gap-4 w-full lg:w-[26%] order-3 lg:order-3 p-4 pr-2 min-h-show max-h-show`}>
                <div className='flex flex-col justify-between'>
                    <p className="text-black dark:text-white text-2xl  font-medium mb-1">Ratings & Reviews</p>
                    <Ratings size='lg' withValues rating={product.average_rating} color='text-blue-700' />
                </div>
                <div className={`flex flex-col h-full py-3 rounded-lg backdrop-sepia-0 bg-white/30 dark:bg-black/30`}>
                    <div className='flex flex-col px-3'>
                        <div className='flex justify-between items-center text-black dark:text-gray-300'>
                            <p className='text-md'>Sort by:</p>
                            <div className='flex'>
                                <Dropdown
                                    size="sm"
                                    right
                                    name='ratings'
                                    selected={activeRatingLabel}
                                    options={filterOptions}
                                    onSelect={handleRatingFilter}
                                />
                                <Dropdown
                                    size="sm"
                                    right
                                    name='date'
                                    selected={activeDateLabel}
                                    options={periodOptions}
                                    onSelect={handleDateFilter}
                                />
                            </div>
                        </div>
                        <Divider />
                        <p className="text-black dark:text-gray-200 text-lg  font-medium mb-1">
                            {product.reviews.length} Reviews
                        </p>
                    </div>
                    <div className='flex flex-col max-h-reviewShow overflow-y-auto p-3'>
                        {/* <CommentList
                            comments={comments}
                            handleInvalidUser={() => { }}
                        /> <CommentList
                            comments={comments}
                            handleInvalidUser={() => { }}
                        /> */}
                    </div>
                    {product.reviews.map((review, index) => (
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
                                    <Ratings size='sm' withSingleValue rating={review.rating} color='text-blue-700' />
                                    <p className='text-sm'>{'- ' + moment(review.createdAt).fromNow()}</p>
                                </div>
                            </div>
                            <p className='text-md font-bold'>{review.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StoreView;