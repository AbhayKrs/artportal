import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { api_storeImages } from '../utils/api_routes';
import { r_setLoader } from '../store/reducers/common.reducers';
import { a_fetchCategorizedStoreList, a_fetchStoreList } from '../store/actions/store.actions';

import Dropdown from '../components/Dropdown';
import CartModal from '../components/Modals/CartModal';

import { MdShoppingCart, MdOutlineAddShoppingCart } from 'react-icons/md';
import { a_fetchUserCart, a_handleCartAdd, a_handleRemoveFromCart } from '../store/actions/user.actions';

const StoreAll = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const common = useSelector(state => state.common);
    const store = useSelector(state => state.store);
    const user = useSelector(state => state.user);

    let cartTotal = 0;
    const [cartOpen, setCartOpen] = useState(false);
    const [storeCategory, setStoreCategory] = useState('');
    const [activeCategoryLabel, setActiveCategoryLabel] = useState('Pick a category');

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0);
    }, [])

    const categoryOptions = [
        { id: 1, label: 'Prints', value: 'prints' },
        { id: 2, label: 'Clothing', value: 'clothes' },
        { id: 3, label: 'Frames', value: 'frames' }
    ]

    useEffect(() => {
        if (storeCategory.length === 0) {
            dispatch(a_fetchStoreList());
            navigate(`/store/all`);
        } else {
            dispatch(a_fetchCategorizedStoreList(storeCategory));
            navigate(`/store/all?category=${storeCategory}`);
        }
    }, [storeCategory])

    const handleCategoryChange = (category) => {
        if (!category) {
            setStoreCategory('');
            setActiveCategoryLabel('Pick a category')
        } else {
            setStoreCategory(category.value);
            setActiveCategoryLabel(category.label)
        }
    }

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
                //     dispatch(a_fetchUserCart());
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
                    dispatch(a_fetchUserCart());
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
                    dispatch(a_fetchUserCart());
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
                    dispatch(a_fetchUserCart());
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
        let cart = user.cart
        if (cart && cart.length > 0) {
            cart.map(item => {
                cartTotal = item.subtotal + cartTotal
            })
        }
        return cartTotal;
    }

    return (
        <div className='bg-gray-200 dark:bg-darkBg'>
            <div className='p-4 items-center'>
                <div className='flex sm:flex-row flex-col mb-3 justify-between'>
                    <div className='text-3xl  font-bold tracking-wider text-blue-700 dark:text-blue-700'>artportal Store</div>
                    <div className='flex items-center gap-2'>
                        {user.cart && user.cart.length > 0 && <button onClick={() => handleCartOpen()} className='relative h-fit tracking-wider overflow-visible bg-blue-700 font-bold p-2 rounded-lg'>
                            <MdShoppingCart className='w-6 h-6 text-gray-200 hover:cursor-pointer' />
                            <div className={`${!cartOpen && 'animate-pulse'} absolute -top-1 -right-1 px-1 bg-red-600 text-gray-200 rounded-full text-xs`}>{user.cart.length}</div>
                        </button>}
                        <button onClick={() => navigate('/store/new')} className='ml-auto h-fit tracking-wider border-2 border-blue-700 text-blue-700  font-bold py-1.5 px-3 rounded-lg'>Create Listing</button>
                        <Dropdown right name='category' selectedPeriod={activeCategoryLabel} options={categoryOptions} onSelect={handleCategoryChange} />
                        {storeCategory.length > 0 ? <a className='text-sm font-medium text-rose-400 underline' onClick={() => handleCategoryChange(null)}>Clear</a> : ''}
                    </div>
                </div>
                {/* Highlights of the Day section */}
                <div className='gap-2'>
                    <div className='grid gap-4 sm:grid-cols-3 grid-cols-1'>
                        {store.storeList.map(item => (
                            <div className="drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                                <img loading='lazy' className="sm:h-full max-h-60 w-full object-cover object-center transition-all duration-400 scale-100" src={api_storeImages(item.files[0])} />
                                <div className="py-6 px-4">
                                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize text-gray-700'>{item.category}</span></h2>
                                    <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">{item.title}</h1>
                                    <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">{item.description}</p>
                                    <div className="flex items-center flex-wrap justify-between">
                                        <div className='tracking-wide text-md font-medium text-gray-500 '>${item.price}</div>
                                        <div className='flex gap-2'>
                                            <MdOutlineAddShoppingCart className='w-8 h-8 text-rose-500 hover:cursor-pointer' onClick={() => addToCart(item)} />
                                            <button onClick={() => navigate(`/store/${item._id}`)} className="bg-gradient-to-r  font-semibold from-blue-700 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {cartOpen && <CartModal open={cartOpen} onClose={handleCartClose} cartList={user.cart} cartTotal={findCartTotal()} api_storeImages={api_storeImages} addToCart={addToCart} handleCartRemove={removeFromCart} />}
        </div>
    )
}

export default StoreAll