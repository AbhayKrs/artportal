import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { api_productImages } from '../utils/api_routes';

import { HiPlus, HiMinus } from 'react-icons/hi';
import { a_addToCart, a_removeFromCart } from '../store/actions/user.actions';
import { Helmet } from 'react-helmet';
import Title from '../components/Title';
import Divider from '../components/Divider';

import { ReactComponent as CouponIcon } from '../assets/icons/coupon.svg';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import Image from '../components/Image';

const Cart = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const cart = useSelector(state => state.user.cart);

    const [selected, setSelected] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [couponValue, setCouponValue] = useState(0);
    const [sellerInstruction, setSellerInstruction] = useState('');
    const [taxValue, setTaxValue] = useState(0);
    const [final, setFinal] = useState(0);
    const [name, setName] = useState({
        fname: '',
        lname: ''
    });
    const [countryCode, setCountryCode] = useState('India');
    const [address, setAddress] = useState({
        line1: '',
        line2: '',
        zipCode: ''
    });
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState({
        date: '1',
        year: '2022'
    });
    const [cvv, setCvv] = useState('');
    const [cartTotal, setCartTotal] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setSelected(user.cart.map(item => item._id));
        setCartTotal(user.cart_total);
    }, [user.cart])

    useEffect(() => {
        setFinal(cartTotal - taxValue - couponValue)
    }, [cartTotal, couponValue, taxValue])

    const addToCart = (id) => {
        dispatch(a_addToCart(id));
    }
    const removeFromCart = (id) => {
        dispatch(a_removeFromCart(id));
    }

    const handleSelect = (id) => {
        setSelected((prevSelected) => {
            if (prevSelected.includes(id)) {
                // If already selected, remove it
                return prevSelected.filter(item => item !== id);
            } else {
                // If not selected, add it
                return [...prevSelected, id];
            }
        });
    }

    return (
        <div className='md:relative flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-darkBg'>
            <Helmet>
                <title>artportal | Cart</title>
            </Helmet>
            {user.cart && user.cart.length === 0 ?
                <div className='flex flex-col min-h-show gap-2 justify-center items-center w-full py-2 px-4'>
                    <CartIcon className='h-8 w-auto text-neutral-800 dark:text-gray-300' />
                    <h1 className="text-xl font-bold text-gray-700 dark:text-gray-300">Your cart is empty</h1>
                </div>
                :
                <div className={`flex flex-col gap-2 min-h-show w-full py-2 px-4`}>
                    <Title text="Cart" />
                    {/* <Stepper activeIndex={currentIndex} /> */}
                    <div className='flex flex-row gap-6'>
                        <div className='flex flex-col gap-2 w-8/12'>
                            <div className='flex flex-col p-4 rounded-lg bg-slate-200 dark:bg-neutral-900 w-full'>
                                <h1 className="font-bold text-gray-700 dark:text-gray-300">Items</h1>
                                {/* <Divider noPadding /> */}
                                <div className='sm:scrollbar p-2 flex flex-col max-h-64 overflow-y-auto w-full divide-y-2 divide-neutral-800 text-gray-800 dark:text-gray-300 font-semibold dark:font-medium'>
                                    {user.cart && user.cart.map(itm => (
                                        <div className='flex sm:flex-row flex-col gap-5 py-2 text-md'>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(itm._id)}
                                                onChange={() => handleSelect(itm._id)}
                                                style={{ WebkitAppearance: 'none' }}
                                                className="h-4 w-4 appearance-none align-middle rounded-md outline-none bg-slate-300 dark:bg-neutral-700 checked:bg-blue-700 dark:checked:bg-blue-700 cursor-pointer"
                                            />
                                            <div className='flex gap-4'>
                                                <Image
                                                    src={`${api_productImages(itm.product.images[0])}`}
                                                    alt="Artwork by Jane Doe"
                                                    pointer={false}
                                                    className="w-20 h-20 object-cover rounded shadow-lg"
                                                />
                                                <div className='flex flex-col'>
                                                    <span>Title: {itm.product.title}</span>
                                                    <span>Category: {itm.product.category}</span>
                                                    <span>Price: &#8377;{Number.parseFloat(itm.product.price).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className='flex flex-col items-end self-center ml-auto gap-2'>
                                                <div className="flex items-center">
                                                    <button onClick={() => removeFromCart(itm.product._id)} className="inline-flex items-center justify-center p-1 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-neutral-800 dark:text-gray-400 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700" type="button">
                                                        <HiMinus className='text-gray-600 dark:text-gray-300' />
                                                    </button>
                                                    <div className="ms-3">
                                                        <input
                                                            required
                                                            type="number"
                                                            id="first_product"
                                                            value={itm.quantity}
                                                            className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-neutral-700 dark:border-neutral-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <button onClick={() => addToCart(itm.product._id)} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-neutral-800 dark:text-gray-400 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700" type="button">
                                                        <HiPlus className='text-gray-600 dark:text-gray-300' />
                                                    </button>
                                                </div>
                                                <span className='text-md'>&#8377;{Number.parseFloat(itm.quantity * itm.product.price).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 p-4 rounded-lg bg-slate-200 dark:bg-neutral-900'>
                                <h1 className="font-bold text-gray-700 dark:text-gray-300">Select a delivery address</h1>
                                <Divider noPadding />
                                <h1 className="font-bold text-gray-700 dark:text-gray-300">Delivery addresses (6)</h1>
                                <div className='flex flex-col gap-2'>
                                    {[0].map(itm => (
                                        <div className='flex flex-row gap-2'>
                                            <input
                                                type="checkbox"
                                                checked={true}
                                                onChange={() => { }}
                                                style={{ WebkitAppearance: 'none' }}
                                                className="h-4 w-4 m-0.5 appearance-none align-middle rounded-md outline-none bg-slate-300 dark:bg-neutral-700 checked:bg-blue-700 dark:checked:bg-blue-700 cursor-pointer"
                                            />
                                            <div className='flex flex-col gap-0.5'>
                                                <h1 className='text-lg font-medium text-neutral-800 dark:text-gray-200'>Abhay Kumar</h1>
                                                <p className='text-sm font-light text-neutral-800 dark:text-gray-200'>D804, Bestech Park View Ananda, Sector 81, GURUGRAM, HARYANA, 122004, India</p>
                                                <p className='text-sm text-neutral-800 dark:text-gray-200'>Phone number: 9319308541</p>
                                                <div className='flex flex-row gap-4'>
                                                    <a href="#" className='text-base font-medium text-blue-600 hover:underline'>Edit address</a>
                                                    <a href="#" className='text-base font-medium text-blue-600 hover:underline'>Add delivery instructions</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 w-4/12'>
                            <div className='flex flex-col gap-2 p-4 rounded-lg bg-slate-200 dark:bg-neutral-900'>
                                <img loading='lazy' src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png" className="h-8 w-fit" />
                                <div className='flex flex-col gap-0.5'>
                                    <label className='text-sm text-neutral-800 dark:text-gray-300'>Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={cardNumber}
                                        className=" bg-slate-50 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-lg text-base py-2 pl-4 w-full focus:outline-none"
                                        placeholder="0000 0000 0000 0000"
                                        onChange={(ev) => setCardNumber(ev.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col gap-0.5'>
                                    <label className='text-sm text-neutral-800 dark:text-gray-300'>Card Holder</label>
                                    <input
                                        type="text"
                                        name="cardHolder"
                                        value={cardHolder}
                                        className=" bg-slate-50 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-lg text-base py-2 pl-4 w-full focus:outline-none"
                                        placeholder="John Smith"
                                        onChange={(ev) => setCardHolder(ev.target.value)}
                                    />
                                </div>
                                <div className='flex items-end'>
                                    <div className='flex gap-2 w-1/2'>
                                        <div className='flex flex-col gap-0.5'>
                                            <label className='text-sm text-neutral-800 dark:text-gray-300'>Expiration Date</label>
                                            <div className='flex flex-row'>
                                                <input
                                                    type="text"
                                                    name="cardHolder"
                                                    value={expiry.date}
                                                    className=" bg-slate-50 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 text-base rounded-l-lg py-2 pl-2 w-8 focus:outline-none"
                                                    placeholder="MM"
                                                    onChange={(ev) => setExpiry({ ...expiry, date: ev.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    name="cardHolder"
                                                    value={expiry.year}
                                                    className=" bg-slate-50 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 text-base rounded-r-lg py-2 pl-2 w-16 focus:outline-none"
                                                    placeholder="YY"
                                                    onChange={(ev) => setExpiry({ ...expiry, year: ev.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-0.5'>
                                        <label className='text-sm text-neutral-800 dark:text-gray-300'>Security code</label>
                                        <input
                                            type="text"
                                            name="cardHolder"
                                            value={cvv}
                                            className=" bg-slate-50 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 dark:placeholder:text-neutral-400 rounded-lg text-base py-2 pl-4 w-20 focus:outline-none"
                                            placeholder="000"
                                            onChange={(ev) => setCvv(ev.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='flex flex-col'>
                                    <h1 className="text-lg font-bold uppercase text-gray-700 dark:text-gray-300">Coupon Code</h1>
                                    <p className="text-sm italic text-gray-500">If you have a coupon code, please enter it in the box below</p>
                                </div>
                                <div className='flex relative items-center gap-2'>
                                    <button type="submit" className="absolute right-1 flex items-center bg-blue-700 justify-center p-1.5 rounded-lg">
                                        <CouponIcon className='h-5 w-5 text-gray-200' />
                                    </button>
                                    <input
                                        type="text"
                                        name="search"
                                        value={couponCode}
                                        onChange={(ev) => setCouponCode(ev.target.value)}
                                        placeholder="Type a coupon code..."
                                        className="placeholder-gray-600 w-full dark:placeholder-gray-300 text-black dark:text-white bg-white disabled:bg-gray-200 dark:bg-neutral-900 dark:disabled:bg-neutral-900 h-10 pl-3 pr-10 rounded-lg text-sm focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <h1 className="text-lg font-bold uppercase text-gray-700 dark:text-gray-300">Order Details</h1>
                                <div className="flex justify-between">
                                    <div className="text-base text-center text-gray-900 dark:text-gray-400">Items</div>
                                    <div className="text-base font-medium text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(cartTotal).toFixed(2)}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-base text-center text-gray-900 dark:text-gray-400">Delivery</div>
                                    <div className="text-base font-medium text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(couponValue).toFixed(2)}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-base text-gray-900 dark:text-gray-400">Coupon Discount</div>
                                    <div className="text-base font-medium text-center text-green-500 dark:text-green-700">&#8377;{Number.parseFloat(couponValue).toFixed(2)}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-base text-center text-gray-900 dark:text-gray-400">Tax</div>
                                    <div className="text-base font-medium text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(taxValue).toFixed(2)}</div>
                                </div>
                                <Divider noPadding />
                                <div className="flex justify-between">
                                    <div className="text-lg font-bold text-center text-gray-900 dark:text-gray-400">Total</div>
                                    <div className="font-bold text-center text-gray-900 dark:text-gray-200">&#8377;{Number.parseFloat(final).toFixed(2)}</div>
                                </div>
                            </div>
                            <button onClick={() => { }} className="flex self-end w-fit py-2.5 px-6 text-base font-semibold tracking-wide bg-orange-700 dark:bg-orange-700 disabled:bg-neutral-700 disabled:dark:bg-neutral-700 hover:bg-neutral-600 text-neutral-800 dark:text-gray-200 disabled:text-neutral-800 disabled:dark:text-neutral-500 rounded-xl items-center">
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Cart;