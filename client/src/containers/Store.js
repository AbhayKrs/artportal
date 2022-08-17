import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';

import { fetchStoreImages } from '../api';
import { StoreMultiCarousel } from '../components/Carousel';
import { CartModal } from '../components/Modal';

import { MdShoppingCart, MdOutlineAddShoppingCart } from 'react-icons/md';

import { fetchUserImages } from '../api';
import { fetchSellerList, fetchStoreList } from '../store/actions/store.actions';
import { setLoader, fetchCartList, handleCartAdd, handleRemoveFromCart } from '../store/actions/common.actions';


const Store = (props) => {
    let navigate = useNavigate();
    let cartTotal = 0;
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        props.setLoader(true);
        window.scrollTo(0, 0)
        props.fetchStoreList();
        props.fetchSellerList();
    }, [])

    const carouselData = [{
        id: 1,
        image: 'https://images.unsplash.com/photo-1644416598043-11c2816eec28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80',
        title: 'Minimal Interior'
    }, {
        id: 2,
        image: 'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        title: 'Minimal Interior'
    }, {
        id: 3,
        image: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 4,
        image: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 5,
        image: 'https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 6,
        image: 'https://images.pexels.com/photos/587958/pexels-photo-587958.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 7,
        image: 'https://images.unsplash.com/photo-1644416598043-11c2816eec28?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80',
        title: 'Minimal Interior'
    }, {
        id: 8,
        image: 'https://images.pexels.com/photos/161154/stained-glass-spiral-circle-pattern-161154.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        title: 'Minimal Interior'
    }, {
        id: 9,
        image: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 10,
        image: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 11,
        image: 'https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }, {
        id: 12,
        image: 'https://images.pexels.com/photos/587958/pexels-photo-587958.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        title: 'Minimal Interior'
    }]

    const cartAdd = (item) => {
        props.handleCartAdd(item);
    }
    const handleCartOpen = () => {
        setCartOpen(true)
    }
    const handleCartClose = () => {
        setCartOpen(false)
    }

    const findCartTotal = () => {
        let cart = props.common.user.cart
        if (cart && cart.length > 0) {
            cart.map(item => {
                cartTotal = item.subtotal + cartTotal
            })
        }
        return cartTotal;
    }

    return (
        <div className='main-container bg-gray-200 dark:bg-darkNavBg'>
            <div className='pt-3 px-2'>
                <div className='text-2xl font-antipasto font-bold tracking-wider text-violet-500 dark:text-violet-400'>Welcome to the Artyst Store</div>
                <div className='text-md font-caviar text-gray-800 dark:text-neutral-300'>Find the best of the artworld with artistic pieces, merch and products of everything art.</div>
            </div>
            <div className='w-full flex p-3'>
                <button onClick={() => navigate('/store/all')} className="tracking-wider h-fit border-2 border-violet-500 text-violet-500 font-antipasto font-bold py-1.5 px-3 mr-2 rounded">Store - All</button>
                {/* <button onClick={() => navigate('/store/sellers')} className="tracking-wider h-fit border-2 border-violet-500 text-violet-500 font-antipasto font-bold py-1.5 px-3 rounded">Artyst Verified Sellers</button> */}
                <div className='flex ml-auto space-x-3'>
                    {props.common.user.cart && props.common.user.cart.length > 0 && <button onClick={() => handleCartOpen()} className='relative h-fit tracking-wider overflow-visible bg-violet-500 font-bold p-2 rounded-lg'>
                        <MdShoppingCart className='w-6 h-6 text-gray-200 hover:cursor-pointer' />
                        <div className='absolute -top-1 -right-1 px-1 bg-red-600 text-gray-200 rounded-full text-xs'>{props.common.user.cart.length}</div>
                    </button>}
                    <button onClick={() => navigate('/store/new')} className='h-fit tracking-wider border-2 border-violet-500 text-violet-500 font-antipasto font-bold py-1.5 px-3 rounded-lg'>Create Listing</button>
                </div>
            </div>
            {/* Highlights of the Day section */}
            <div className='p-4 space-y-2'>
                <div className='text-3xl font-antipasto font-bold dark:text-neutral-400'>Highlights of the Day</div>
                <div className='grid gap-5 sm:grid-cols-4 grid-cols-1 p-5'>
                    {props.store.storeList.map(item => (
                        <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                            <img loading='lazy' className="h-60 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={fetchStoreImages(item.files[0])} />
                            <div className="py-6 px-4">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize text-gray-700'>{item.category}</span></h2>
                                <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">{item.title}</h1>
                                <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">{item.description}</p>
                                <div className="flex items-center flex-wrap justify-between">
                                    <div className='tracking-wide text-lg font-medium text-gray-500 font-josefinregular'>${item.price}</div>
                                    <div className='flex space-x-2'>
                                        <MdOutlineAddShoppingCart className='w-8 h-8 text-rose-500 hover:cursor-pointer' onClick={() => cartAdd(item)} />
                                        <button onClick={() => navigate(`/store/${item._id}`)} className="bg-gradient-to-r font-caviar font-semibold from-violet-500 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className='mx-4 rounded border-2 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' />
            {/* Featured */}
            <div className='p-4 space-y-2'>
                <div className='text-3xl font-antipasto font-bold dark:text-neutral-400'>Featured</div>
                <div className='grid gap-5 sm:grid-cols-4 grid-cols-1 p-5'>
                    {props.store.storeList.map(item => (
                        <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                            <img loading='lazy' className="h-60 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={fetchStoreImages(item.files[0])} />
                            <div className="py-6 px-4">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize text-gray-700'>{item.category}</span></h2>
                                <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">{item.title}</h1>
                                <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">{item.description}</p>
                                <div className="flex items-center flex-wrap justify-between">
                                    <div className='tracking-wide text-md font-medium text-gray-500 font-josefinregular'>${item.price}</div>
                                    <div className='flex space-x-2'>
                                        <MdOutlineAddShoppingCart className='w-8 h-8 text-rose-500 hover:cursor-pointer' onClick={() => cartAdd(item)} />
                                        <button onClick={() => navigate(`/store/${item._id}`)} className="bg-gradient-to-r font-caviar font-semibold from-violet-500 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className='mx-4 rounded border-2 bg-neutral-700 dark:bg-neutral-300 border-neutral-700 dark:border-neutral-300 dark:border-neutral-200' />
            {/* Artists of the Month */}
            <div className='p-4'>
                <div className='text-3xl font-antipasto font-bold dark:text-neutral-400 pb-10'>Trending Sellers</div>
                <div className='grid gap-4 sm:grid-cols-4 grid-cols-1'>
                    {props.store.sellerList.map(seller => (
                        <div className="py-8 h-3/4 mt-auto cursor-pointer rounded-3xl bg-gray-100 dark:bg-neutral-900 transition duration-300 ease-in-out hover:scale-105">
                            <div className="-mb-14 -translate-y-36 transform">
                                <img loading='lazy' src={fetchUserImages(seller.avatar.icon)} alt="Kobe Bryant" title="Kobe Bryant" className="mx-auto max-h-[10em]" />
                            </div>
                            <div className="-translate-y-20">
                                <div className="text-center dark:text-gray-300">
                                    <h3 className="text-center text-2xl font-bold">{seller.name}</h3>
                                    <span className="text-sm">#{seller.username}</span>
                                    <ul className="m-1.5 flex justify-center text-center font-josefinlight space-x-4">
                                        <li className="flex flex-col text-sm"><span className="font-bold text-lg">Rating</span>{seller.seller_rating}</li>
                                        <li className="flex flex-col text-sm"><span className="font-bold text-lg">Followers</span>4.7</li>
                                        <li className="flex flex-col text-sm"><span className="font-bold text-lg">YSR*</span>4.5</li>
                                    </ul>
                                    <div className="mb-3">
                                        <button onClick={() => navigate(`/users/${seller._id}`)} className="bg-gradient-to-r font-caviar font-semibold from-yellow-300 to-amber-500 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg text-black">More Info</button>
                                    </div>
                                    <div className='text-sm font-bold font-josefinlight text-rose-400'>* YSR - Year to Sales Rating</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Merch */}
            {cartOpen && <CartModal open={cartOpen} onClose={handleCartClose} cartList={props.common.user.cart} cartTotal={findCartTotal()} fetchStoreImages={fetchStoreImages} cartAdd={cartAdd} handleCartRemove={props.handleRemoveFromCart} />}
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    store: state.store
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader,
    fetchSellerList,
    fetchStoreList,
    fetchCartList,
    handleCartAdd,
    handleRemoveFromCart
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Store)