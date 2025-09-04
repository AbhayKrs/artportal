import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { api_storeImages } from '../utils/api_routes';

import { HiPlus, HiMinus, HiOutlineMail } from 'react-icons/hi';
import Stepper from '../components/Stepper';
import { a_fetchUserCart, a_handleCartAdd, a_handleRemoveFromCart } from '../store/actions/user.actions';

const Cart = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

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
    const [expDate, setExpDate] = useState({
        date: '1',
        year: '2022'
    });
    const [cvv, setCvv] = useState('');
    const [cartTotal, setCartTotal] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let cart = user.cart
        let total = 0;
        if (cart && cart.length > 0) {
            cart.map(item => {
                total = item.subtotal + cartTotal
            })
        }

        setCartTotal(total);
        setFinal(cartTotal - taxValue - couponValue)
    }, [couponValue, taxValue])

    const checkAddressValues = () => {
        if (name.fname.length === 0 || name.lname.length === 0 || address.line1.length === 0 || address.line2.length === 0 || address.zipCode.length === 0) {
            return true;
        } else return false;
    }
    const checkPaymentValues = () => {
        if (cardHolder.length === 0 || cardNumber.length === 0 || cvv.length === 0) {
            return true;
        } else return false;
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
                dispatch(a_handleCartAdd({ userID, cartID, cartData })).then(res => {
                    dispatch(a_fetchUserCart());
                });
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

    const switchCartView = () => {
        switch (currentIndex) {
            case 0: return <div>
                <div className='sm:scrollbar px-2 flex flex-col bg-slate-200 dark:bg-neutral-900 max-h-48 overflow-y-auto w-full divide-y-2 divide-neutral-800 text-gray-800 dark:text-gray-300 font-semibold dark:font-medium'>
                    {user.cart && user.cart.map(cartItem => (
                        <div className='flex sm:flex-row flex-col gap-5 py-2  text-md'>
                            <div className='flex gap-4'>
                                <img loading='lazy' src={api_storeImages(cartItem.file)} className="w-20 h-20 object-cover rounded shadow-lg" alt="Thumbnail" />
                                <div className='flex flex-col'>
                                    <span>Title: {cartItem.title}</span>
                                    <span>Category: {cartItem.title}</span>
                                    <span>Price: &#8377;{Number.parseFloat(cartItem.price).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className='flex flex-col items-end ml-auto gap-2'>
                                <div className="flex flex-row h-10 rounded-lg relative bg-transparent mt-1">
                                    <button onClick={addToCart} className="bg-slate-300 dark:bg-neutral-700 h-full w-10 rounded-l cursor-pointer flex items-center justify-center">
                                        <HiPlus className='text-gray-600 dark:text-gray-300' />
                                    </button>
                                    <span className='bg-slate-300 dark:bg-neutral-700 font-semibold text-lg flex items-center text-gray-700 dark:text-gray-300 px-2'>{cartItem.quantity}</span>
                                    <button onClick={removeFromCart} className="bg-slate-300 dark:bg-neutral-700 h-full w-10 rounded-r cursor-pointer flex items-center justify-center">
                                        <HiMinus className='text-gray-600 dark:text-gray-300' />
                                    </button>
                                </div>
                                <span className='text-md'>SubTotal: &#8377;{Number.parseFloat(cartItem.subtotal).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex sm:flex-row flex-col mt-4 sm:mx-2 mx-0 gap-4">
                    <div className="sm:w-1/2 w-full gap-4">
                        <div>
                            <h1 className="font-bold uppercase text-gray-700 dark:text-gray-300">Coupon Code</h1>
                            <p className="mb-2 text-sm italic text-gray-500">If you have a coupon code, please enter it in the box below</p>
                            <div className="flex w-full justify-center">
                                <div className="flex items-center w-full mx-auto bg-white dark:bg-neutral-700 rounded-lg">
                                    <div className="w-full">
                                        <input type="search" value={couponCode} onChange={(ev) => setCouponCode(ev.target.value)} className="w-full px-4 py-1 text-gray-800 dark:text-gray-400 rounded-full focus:outline-none bg-transparent" placeholder="Type a coupon code..." x-model="search" />
                                    </div>
                                    <div>
                                        <button type="submit" className="flex items-center bg-blue-700 justify-center w-12 h-12 text-white rounded-r-lg">
                                            <svg aria-hidden="true" data-prefix="fas" data-icon="gift" className="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="font-bold uppercase text-gray-700 dark:text-gray-300">Instructions for seller</h1>
                            <p className="mb-2 text-sm italic text-gray-500">If you have some information for the seller you can leave them in the box below</p>
                            <textarea rows='4' value={sellerInstruction} onChange={(ev) => setSellerInstruction(ev.target.value)} className="scrollbar w-full p-2 bg-gray-100 dark:bg-neutral-700 rounded resize-none text-gray-800 dark:text-gray-400 focus:outline-none"></textarea>
                        </div>
                    </div>
                    <div className="sm:w-1/2 w-full">
                        <h1 className="font-bold uppercase text-gray-700 dark:text-gray-300">Order Details</h1>
                        <p className="mb-6 italic text-gray-500">Shipping and additionnal costs are calculated based on values you have entered</p>
                        <div className="flex justify-between">
                            <div className="text-lg font-bold text-center text-gray-900 dark:text-gray-400">Total</div>
                            <div className="font-bold text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(cartTotal).toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex text-lg font-bold text-gray-900 dark:text-gray-400">Coupon Discount</div>
                            <div className="font-bold text-center text-green-500 dark:text-green-700">&#8377;{Number.parseFloat(couponValue).toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex text-lg font-bold text-center text-gray-900 dark:text-gray-400">Tax</div>
                            <div className="font-bold text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(taxValue).toFixed(2)}</div>
                        </div>
                        <hr className='my-2 border-1 border-gray-800 dark:border-gray-300' />
                        <div className="flex justify-between">
                            <div className="text-lg font-bold text-center text-gray-900 dark:text-gray-400">Final</div>
                            <div className="font-bold text-center text-gray-900 dark:text-gray-200">&#8377;{Number.parseFloat(final).toFixed(2)}</div>
                        </div>
                        <button onClick={() => setCurrentIndex(1)} className="flex float-right justify-center w-fit p-3 mt-6 sm:mb-0 mb-6 font-medium text-white uppercase bg-blue-700 rounded-xl shadow item-center hover:bg-blue-700 focus:shadow-outline focus:outline-none">Select the delivery location</button>
                    </div>
                </div>
            </div>

            case 1: return <div className='flex sm:flex-row flex-col h-full gap-4'>
                <div className="flex flex-col w-full">
                    <div className="gap-4">
                        <div className="flex flex-col w-full gap-2">
                            <h1 className="font-bold text-gray-700 dark:text-gray-300">Full Name <span className=' text-rose-400 text-md'>*</span></h1>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={name.fname} onChange={(ev) => setName({ ...name, fname: ev.target.value })} placeholder="First Name" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={name.lname} onChange={(ev) => setName({ ...name, lname: ev.target.value })} placeholder="Last Name" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <h1 className="font-bold text-gray-700 dark:text-gray-300">Delivery address <span className=' text-rose-400 text-md'>*</span></h1>
                            <select value={countryCode} onChange={(ev) => setCountryCode(ev.target.value)} className="h-10 mt-2 form-select w-full rounded dark:bg-neutral-700 dark:text-gray-300">
                                <option value="India">IN</option>
                                <option value="US">USA</option>
                                <option value="UK">UK</option>
                            </select>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={address.line1} onChange={(ev) => setAddress({ ...address, line1: ev.target.value })} placeholder="Address Line 1" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded ">
                                <input value={address.line2} onChange={(ev) => setAddress({ ...address, line2: ev.target.value })} placeholder="Address Line 2" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                            <div className="w-full bg-white dark:bg-neutral-700 flex rounded">
                                <input value={address.zipCode} onChange={(ev) => setAddress({ ...address, zipCode: ev.target.value })} placeholder="Zip Code" className="p-1 px-2 bg-transparent outline-none w-full text-gray-800 dark:text-gray-300 rounded" />
                            </div>
                        </div>
                    </div>
                    <div className='flex ml-auto mt-auto gap-2'>
                        <button onClick={() => setCurrentIndex(0)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-rose-400 rounded-xl shadow item-center hover:bg-rose-500 focus:shadow-outline focus:outline-none">Back</button>
                        <button disabled={checkAddressValues()} onClick={() => setCurrentIndex(2)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-blue-700 rounded-xl shadow item-center hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-gray-500 disabled:dark:bg-neutral-700 disabled:dark:text-gray-500 focus:shadow-outline focus:outline-none">Proceed to Payment</button>
                    </div>
                </div>
            </div>

            case 2: return <div className="flex flex-col h-full">
                <div className='p-4 gap-3'>
                    <div className="flex">
                        <label for="type1" className="flex items-center cursor-pointer">
                            <img loading='lazy' src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png" className="h-8" />
                        </label>
                    </div>
                    <div>
                        <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Name on Card</label>
                        <div>
                            <input value={cardHolder} onChange={(ev) => setCardHolder(ev.target.value)} className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors" placeholder="John Smith" type="text" />
                        </div>
                    </div>
                    <div>
                        <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Card Number</label>
                        <div>
                            <input value={cardNumber} onChange={(ev) => setCardNumber(ev.target.value)} className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors" placeholder="0000 0000 0000 0000" type="text" />
                        </div>
                    </div>
                    <div className='flex items-end'>
                        <div className='flex gap-2 w-1/2'>
                            <div className='flex flex-col'>
                                <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Expiration Date</label>
                                <select value={expDate.date} onChange={(ev) => setExpDate({ ...expDate, date: ev.target.value })} className="form-select w-fit py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors cursor-pointer">
                                    <option value="1">01 - January</option>
                                    <option value="2">02 - February</option>
                                    <option value="3">03 - March</option>
                                    <option value="4">04 - April</option>
                                    <option value="5">05 - May</option>
                                    <option value="6">06 - June</option>
                                    <option value="7">07 - July</option>
                                    <option value="8">08 - August</option>
                                    <option value="9">09 - September</option>
                                    <option value="10">10 - October</option>
                                    <option value="11">11 - November</option>
                                    <option value="12">12 - December</option>
                                </select>
                            </div>
                            <select value={expDate.year} onChange={(ev) => setExpDate({ ...expDate, year: ev.target.value })} className="form-select w-fit py-2 mb-1 mt-auto border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors cursor-pointer">
                                <option value="2020">2020</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                            </select>
                        </div>
                        <div className='w-1/2'>
                            <label className="font-bold uppercase text-md mb-2 ml-1 text-gray-700 dark:text-gray-300">Security code</label>
                            <div>
                                <input value={cvv} onChange={(ev) => setCvv(ev.target.value)} className="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-700 transition-colors" placeholder="000" type="text" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex ml-auto mt-auto gap-2'>
                    <button onClick={() => setCurrentIndex(1)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-rose-400 rounded-xl shadow item-center hover:bg-rose-500 focus:shadow-outline focus:outline-none">Back</button>
                    <button disabled={checkPaymentValues()} onClick={() => setCurrentIndex(3)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-blue-700 rounded-xl shadow item-center hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-gray-500 disabled:dark:bg-neutral-700 disabled:dark:text-gray-500 focus:shadow-outline focus:outline-none">Proceed to Confirmation</button>
                </div>
            </div>

            case 3: return <div className='flex flex-col h-full'>
                <div className='gap-6'>
                    <h1 className="font-bold uppercase text-gray-300">Summary</h1>
                    <div className='flex sm:flex-row flex-col gap-8'>
                        <div className='w-full'>
                            <div className="text-lg font-bold text-gray-800 dark:text-blue-700">Price Details</div>
                            <div className="flex justify-between">
                                <div className="text-lg font-bold text-center text-gray-800 dark:text-gray-400">Total</div>
                                <div className="font-bold text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(cartTotal).toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex text-lg font-bold text-gray-800 dark:text-gray-400">Coupon Discount</div>
                                <div className="font-bold text-center text-green-700">&#8377;{Number.parseFloat(couponValue).toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex text-lg font-bold text-center text-gray-800 dark:text-gray-400">Tax</div>
                                <div className="font-bold text-center text-gray-900 dark:text-gray-300">&#8377;{Number.parseFloat(taxValue).toFixed(2)}</div>
                            </div>
                            <hr className='my-2 border-1 border-gray-700 dark:boder-gray-300' />
                            <div className="flex justify-between">
                                <div className="text-lg font-bold text-center text-gray-800 dark:text-gray-400">Final</div>
                                <div className="font-bold text-center text-gray-900 dark:text-gray-200">&#8377;{Number.parseFloat(final).toFixed(2)}</div>
                            </div>
                        </div>
                        <div className='w-full'>
                            <div className="text-lg font-bold text-gray-800 dark:text-blue-700">Shipping Address</div>
                            <div className='text-md dark:text-gray-300 uppercase'>{name.fname + ' ' + name.lname}</div>
                            <div className='flex items-center text-md dark:text-gray-300'><HiOutlineMail className='mr-2' /> david89@gmail.com</div>
                            <div className='text-md dark:text-gray-300'>
                                {address.line1 + ', ' + address.line2 + ', ' + address.zipCode}
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className="text-lg font-bold text-gray-800 dark:text-blue-700">Payment Details</div>
                        <div className='text-md dark:text-gray-300'>Mode of Payment: Card</div>
                        <div className='flex items-center text-md dark:text-gray-300'>Card Number: 	XXXXXXXX88881881</div>
                    </div>
                </div>
                <div className='flex ml-auto mt-auto gap-2'>
                    <button onClick={() => setCurrentIndex(2)} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-rose-400 rounded-xl shadow item-center hover:bg-rose-500 focus:shadow-outline focus:outline-none">Back</button>
                    <button onClick={() => console.log('cart done')} className="flex float-right justify-center w-fit p-3 mt-6 font-medium text-white uppercase bg-blue-700 rounded-xl shadow item-center hover:bg-blue-700 disabled:bg-neutral-300 disabled:text-gray-500 disabled:dark:bg-neutral-700 disabled:dark:text-gray-500 focus:shadow-outline focus:outline-none">Checkout</button>
                </div>
            </div >
        }
    }

    return (
        <div className=' bg-gray-200 dark:bg-darkBg flex w-full justify-center'>
            <div className="scrollbar w-full m-5 bg-slate-100 dark:bg-neutral-800 rounded-xl">
                <div className='p-4 h-full flex flex-col'>
                    <h1 className='text-blue-700 dark:text-blue-700 text-5xl font-semibold tracking-widest '>Cart</h1>
                    <Stepper activeIndex={currentIndex} />
                    {switchCartView()}
                </div>
            </div>
        </div >
    )
}

export default Cart;