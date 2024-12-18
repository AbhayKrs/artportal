import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet';

import { a_handleCartAdd, a_handleRemoveFromCart, a_fetchCartList } from '../store/actions/common.actions';
import { r_setLoader } from '../store/reducers/common.reducers';
import { a_fetchSellerList, a_fetchStoreList } from '../store/actions/store.actions';
import { api_fetchUserImages, api_fetchStoreImages } from '../utils/api';

import { StoreMultiCarousel } from '../components/Carousel';
import { CartModal } from '../components/Modal';

import { MdShoppingCart, MdOutlineAddShoppingCart } from 'react-icons/md';

const Store = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const common = useSelector(state => state.common);
    const store = useSelector(state => state.store);
    const user = useSelector(state => state.common.user);

    let cartTotal = 0;
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0)
        dispatch(a_fetchStoreList());
        dispatch(a_fetchSellerList());
    }, [])

    const addToCart = (data) => {
        let cartData;
        const userID = user.id;
        const userCart = user.cart;
        try {
            if (userCart.filter(item => item.title === data.title).length !== 0) {
                let quantity = userCart.filter(item => item.title === data.title)[0].quantity + 1;
                let subtotal = data.price * quantity;
                cartData = {
                    quantity,
                    subtotal
                }
                const cartID = userCart.filter(item => item.title === data.title)[0]._id;
                // dispatch(updateCartlist({ userID, cartID, cartData })).then(res => {
                //     dispatch(a_fetchCartList());
                // });
            } else {
                cartData = {
                    file: data.files[0],
                    title: data.title,
                    category: data.category,
                    price: data.price,
                    quantity: 1,
                    subtotal: data.price * 1
                }
                dispatch(a_handleCartAdd({ userID, cartData })).then(res => {
                    dispatch(a_fetchCartList());
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    const removeFromCart = (data) => {
        let cartData;
        const userID = user.id;
        const userCart = user.cart;
        const cartID = userCart.filter(item => item.title === data.title)[0]._id;
        try {
            if (userCart.filter(item => item.title === data.title)[0].quantity === 1) {
                dispatch(a_handleRemoveFromCart({ cartID, userID })).then(res => {
                    dispatch(a_fetchCartList());
                });
            } else {
                let quantity = userCart.filter(item => item.title === data.title)[0].quantity - 1;
                let subtotal = data.price * quantity;
                cartData = {
                    quantity,
                    subtotal
                }
                const cartID = userCart.filter(item => item.title === data.title)[0]._id;
                dispatch(a_handleRemoveFromCart({ cartID, userID })).then(res => {
                    dispatch(a_fetchCartList());
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleCartOpen = () => {
        setCartOpen(true)
    }
    const handleCartClose = () => {
        setCartOpen(false)
    }

    const findCartTotal = () => {
        let cart = common.user.cart
        if (cart && cart.length > 0) {
            cart.map(item => {
                cartTotal = item.subtotal + cartTotal
            })
        }
        return cartTotal;
    }

    return (
        <div className=' bg-gray-200 dark:bg-darkBg'>
            <Helmet>
                <title>artportal | Store</title>
            </Helmet>
            <div className='pt-3 px-2'>
                <div className='text-2xl font-montserrat font-bold tracking-wider text-indigo-600 dark:text-indigo-600'>Welcome to the artportal Store</div>
                <div className='text-md font-montserrat text-gray-800 dark:text-neutral-300'>Find the best of the artworld with artistic pieces, merch and products of everything art.</div>
            </div>
            <div className='w-full flex p-3'>
                {/* <button onClick={() => navigate('/store/all')} className="tracking-wider h-fit border-2 border-indigo-600 text-indigo-600 font-montserrat font-bold py-1.5 px-3 mr-2 rounded">Store - All</button> */}
                {/* <button onClick={() => navigate('/store/sellers')} className="tracking-wider h-fit border-2 border-indigo-600 text-indigo-600 font-montserrat font-bold py-1.5 px-3 rounded">artportal Verified Sellers</button> */}
                <div className='flex ml-auto space-x-3'>
                    {common.user.cart && common.user.cart.length > 0 && <button onClick={() => handleCartOpen()} className='relative h-fit tracking-wider overflow-visible bg-indigo-600 font-bold p-2 rounded-lg'>
                        <MdShoppingCart className='w-6 h-6 text-gray-200 hover:cursor-pointer' />
                        <div className='absolute -top-1 -right-1 px-1 bg-red-600 text-gray-200 rounded-full text-xs'>{common.user.cart.length}</div>
                    </button>}
                    <button onClick={() => navigate('/store/new')} className='h-fit tracking-wider border-2 border-indigo-600 text-indigo-600 font-montserrat font-bold py-1.5 px-3 rounded-lg'>Create Listing</button>
                </div>
            </div>
            <div className='grid gap-5 sm:grid-cols-4 grid-cols-1 p-5'>
                {store.storeList.map(item => (
                    <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                        <img loading='lazy' className="h-60 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={api_fetchStoreImages(item.files[0])} />
                        <div className="py-6 px-4">
                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize text-gray-700'>{item.category}</span></h2>
                            <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">{item.title}</h1>
                            <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">{item.description}</p>
                            <div className="flex items-center flex-wrap justify-between">
                                <div className='tracking-wide text-lg font-medium text-gray-500 font-montserrat'>${item.price}</div>
                                <div className='flex space-x-2'>
                                    <MdOutlineAddShoppingCart className='w-8 h-8 text-rose-500 hover:cursor-pointer' onClick={() => addToCart(item)} />
                                    <button onClick={() => navigate(`/store/${item._id}`)} className="bg-gradient-to-r font-montserrat font-semibold from-indigo-600 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Highlights of the Day section */}
            {/* <div className='p-4 space-y-2'>
                <div className='text-3xl font-montserrat font-bold dark:text-neutral-400'>Highlights of the Day</div>
                <div className='grid gap-5 sm:grid-cols-4 grid-cols-1 p-5'>
                    {store.storeList.map(item => (
                        <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                            <img loading='lazy' className="h-60 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={api_fetchStoreImages(item.files[0])} />
                            <div className="py-6 px-4">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize text-gray-700'>{item.category}</span></h2>
                                <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">{item.title}</h1>
                                <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">{item.description}</p>
                                <div className="flex items-center flex-wrap justify-between">
                                    <div className='tracking-wide text-lg font-medium text-gray-500 font-montserrat'>${item.price}</div>
                                    <div className='flex space-x-2'>
                                        <MdOutlineAddShoppingCart className='w-8 h-8 text-rose-500 hover:cursor-pointer' onClick={() => addToCart(item)} />
                                        <button onClick={() => navigate(`/store/${item._id}`)} className="bg-gradient-to-r font-montserrat font-semibold from-indigo-600 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className='mx-4 rounded border-2 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' /> */}
            {/* Featured */}
            {/* <div className='p-4 space-y-2'>
                <div className='text-3xl font-montserrat font-bold dark:text-neutral-400'>Featured</div>
                <div className='grid gap-5 sm:grid-cols-4 grid-cols-1 p-5'>
                    {store.storeList.map(item => (
                        <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                            <img loading='lazy' className="h-60 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={api_fetchStoreImages(item.files[0])} />
                            <div className="py-6 px-4">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize text-gray-700'>{item.category}</span></h2>
                                <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">{item.title}</h1>
                                <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">{item.description}</p>
                                <div className="flex items-center flex-wrap justify-between">
                                    <div className='tracking-wide text-md font-medium text-gray-500 font-montserrat'>${item.price}</div>
                                    <div className='flex space-x-2'>
                                        <MdOutlineAddShoppingCart className='w-8 h-8 text-rose-500 hover:cursor-pointer' onClick={() => addToCart(item)} />
                                        <button onClick={() => navigate(`/store/${item._id}`)} className="bg-gradient-to-r font-montserrat font-semibold from-indigo-600 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className='mx-4 rounded border-2 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' /> */}
            {/* Artists of the Month */}
            {/* <div className='p-4'>
                <div className='text-3xl font-montserrat font-bold dark:text-neutral-400 pb-10'>Trending Sellers</div>
                <div className='grid gap-4 sm:grid-cols-4 grid-cols-1'>
                    {store.sellerList.map(seller => (
                        <div className="py-8 h-3/4 mt-auto cursor-pointer rounded-3xl bg-gray-100 dark:bg-neutral-900 transition duration-300 ease-in-out hover:scale-105">
                            <div className="-mb-14 -translate-y-36 transform">
                                <img loading='lazy' src={api_fetchUserImages(seller.avatar.icon)} alt="Kobe Bryant" title="Kobe Bryant" className="mx-auto max-h-[10em]" />
                            </div>
                            <div className="-translate-y-20">
                                <div className="text-center dark:text-gray-300">
                                    <h3 className="text-center text-2xl font-bold">{seller.name}</h3>
                                    <span className="text-sm">#{seller.username}</span>
                                    <ul className="m-1.5 flex justify-center text-center font-montserrat space-x-4">
                                        <li className="flex flex-col text-sm"><span className="font-bold text-lg">Rating</span>{seller.seller_rating}</li>
                                        <li className="flex flex-col text-sm"><span className="font-bold text-lg">Followers</span>4.7</li>
                                        <li className="flex flex-col text-sm"><span className="font-bold text-lg">YSR*</span>4.5</li>
                                    </ul>
                                    <div className="mb-3">
                                        <button onClick={() => navigate(`/users/${seller._id}`)} className="bg-gradient-to-r font-montserrat font-semibold from-yellow-300 to-amber-500 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg text-black">More Info</button>
                                    </div>
                                    <div className='text-sm font-bold font-montserrat text-rose-400'>* YSR - Year to Sales Rating</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
            {/* Merch */}
            {cartOpen && <CartModal open={cartOpen} onClose={handleCartClose} cartList={common.user.cart} cartTotal={findCartTotal()} api_fetchStoreImages={api_fetchStoreImages} addToCart={addToCart} handleCartRemove={removeFromCart} />}
        </div >
    )
}

export default Store