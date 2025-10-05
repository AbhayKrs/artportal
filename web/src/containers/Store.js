import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet';

import { r_setLoader } from '../store/reducers/common.reducers';
import { api_artworkImages, api_userImages } from '../utils/api_routes';
import { a_fetchUserCart, a_handleCartAdd, a_handleRemoveFromCart } from '../store/actions/user.actions';
import { a_fetchProducts } from '../store/actions/store.actions';

import SimpleGrid from '../components/Grids/Simple';
import Divider from '../components/Divider';
import Title from '../components/Title';
import StoreCard from '../components/Cards/StoreCard';
import StoreTabs from '../components/Tabs/StoreTabs';

import { ReactComponent as EventsIcon } from '../assets/icons/events.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';

const Store = ({ }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    const products = useSelector(state => state.store.products);

    const hidePane = useOutletContext();
    const [filtersPane, setFiltersPane] = useState(true);

    let cartTotal = 0;
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0);
        dispatch(a_fetchProducts());
        // dispatch(a_fetchSelleList());
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

    const sellerList = [
        {
            _id: "66ae867c3245a84120c8e4c2",
            name: "Abhay Kumar",
            username: "akn787",
        },
        {
            _id: "6761a96926d5543eacbf3353",
            name: "Abhay Kumar",
            username: "jayabhay9",
        },
        {
            _id: "68d587aca12c064376132838",
            name: "Jaya Unnikrishnan",
            username: "jaya115",
        },
    ]

    return (
        <div className='md:relative flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-darkBg'>
            <Helmet>
                <title>artportal | Store</title>
            </Helmet>
            <div className={`flex flex-col gap-2 ${hidePane ? filtersPane ? 'md:w-[85.5%]' : 'md:w-full' : filtersPane ? 'md:w-[83.25%]' : 'md:w-full'} order-2 md:order-1 py-2 px-4 min-h-show`}>
                <div className='flex flex-row justify-between'>
                    <Title text="Store" />
                    <button onClick={() => navigate(`/store/new`)} className="flex w-fit py-2 px-4 text-base font-semibold tracking-wide bg-blue-700 dark:bg-blue-700 disabled:bg-neutral-700 disabled:dark:bg-neutral-700 hover:bg-neutral-600 text-neutral-800 dark:text-gray-300 disabled:text-neutral-800 disabled:dark:text-neutral-500 rounded-xl items-center">
                        Add product
                    </button>
                </div>
                <StoreTabs filtersPane={filtersPane} setFiltersPane={setFiltersPane} />
                {products.length > 0 ?
                    <div className='flex flex-row'>
                        <SimpleGrid>
                            {products.map((item, index) => (
                                <StoreCard size="l" key={index} product={item} seller={item.seller} />
                            ))}
                        </SimpleGrid>
                    </div>
                    :
                    <div className='absolute inset-0 h-fit w-fit m-auto text-center text-gray-300'>
                        <h2 className='text-2xl'>It's empty in here!</h2>
                    </div>
                }
            </div>
            {filtersPane &&
                <div className={`relative px-2 py-3 h-full max-h-show min-h-show md:fixed md:right-2 flex flex-col gap-3 w-full md:w-[14%] order-1 md:order-2 backdrop-sepia-0 bg-white/30 dark:bg-black/30 border-l-2 border-gray-400 dark:border-neutral-800`}>
                    <div className='flex flex-row justify-between px-2'>
                        <div className={`flex gap-1 text-lg font-medium tracking-wide text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                            <EventsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                            Filters
                        </div>
                        <button onClick={() => setFiltersPane(!filtersPane)}>
                            <CloseIcon className='h-4 w-auto text-neutral-800 dark:text-gray-300' />
                        </button>
                    </div>
                    <Divider noPadding />
                    <div className='flex flex-col px-1 gap-2 h-11/12 overflow-y-auto'>
                        <div className='flex flex-col gap-1'>
                            <div className={`flex gap-1 text-lg font-medium tracking-wide text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                                Featured sellers
                            </div>
                            <div className='flex flex-col'>
                                {sellerList.map(item => (
                                    <button onClick={() => { }} className={`flex gap-1 items-center py-2 px-3 text-lg font-medium tracking-wide hover:bg-gray-300 hover:dark:bg-neutral-700/50 text-neutral-800 dark:text-gray-300 rounded-xl`}>
                                        <img src={api_userImages("6cbaa37fa59b0caee31dc4b8cdd67d72.png")} className='object-cover h-7 w-7 rounded-md' />
                                        <div className='flex flex-col font-light text-gray-300'>
                                            <h1 className="text-base">{item.name}</h1>
                                            <h2 className="text-xs">{item.username}</h2>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* {artworks.map((artwork, index) => (
                            <EventCard size="m" key={index} artwork={artwork} artist={artwork.artist} />
                        ))} */}
                    </div>
                </div>
            }
        </div >
    )
}

export default Store