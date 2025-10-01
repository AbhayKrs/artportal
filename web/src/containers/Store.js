import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { r_setLoader } from '../store/reducers/common.reducers';
import { api_artworkImages } from '../utils/api_routes';
import { a_fetchUserCart, a_handleCartAdd, a_handleRemoveFromCart } from '../store/actions/user.actions';

import TabPanel from '../components/TabPanel';
import MasonryGrid from '../components/Grids/Masonry';
import Divider from '../components/Divider';
import ImageCard from '../components/Cards/ImageCard';
import EventCard from '../components/Cards/EventCard';

import { BsHeart, BsChat } from 'react-icons/bs';
import { BiTimeFive } from 'react-icons/bi';
import { ReactComponent as EventsIcon } from '../assets/icons/events.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import SimpleGrid from '../components/Grids/Simple';
import Title from '../components/Title';
import StoreCard from '../components/Cards/StoreCard';

const Store = ({ }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    const artworks = useSelector(state => state.library.artworks);

    const hidePane = useOutletContext();
    const [filtersPane, setFiltersPane] = useState(true);

    let cartTotal = 0;
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        dispatch(r_setLoader(true));
        window.scrollTo(0, 0);
        // dispatch(a_fetchStoreList());
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

    return (
        <div className='md:relative flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-darkBg'>
            <Helmet>
                <title>artportal | Store</title>
            </Helmet>
            <div className={`flex flex-col gap-2 ${hidePane ? filtersPane ? 'md:w-[82.5%]' : 'md:w-full' : filtersPane ? 'md:w-[80.25%]' : 'md:w-full'} order-2 md:order-1 py-2 px-4 min-h-show`}>
                <Title text="Store" />
                {artworks.length > 0 ?
                    <div className='flex flex-row'>
                        <SimpleGrid cols={4}>
                            {artworks.map((artwork, index) => (
                                <StoreCard size="l" key={index} artwork={artwork} artist={artwork.artist} />
                            ))}
                        </SimpleGrid>
                    </div>
                    :
                    <div >
                        <div className='absolute inset-0 h-fit w-fit m-auto text-center text-gray-300'>
                            <h2 className='text-2xl'>It's empty in here!</h2>
                        </div>
                    </div>
                }
            </div>
            {filtersPane &&
                <div className={`relative px-2 py-3 h-full max-h-show min-h-show md:fixed md:right-2 flex flex-col gap-3 w-full md:w-2/12 order-1 md:order-2 backdrop-sepia-0 bg-white/30 dark:bg-black/30 border-l-2 border-gray-400 dark:border-neutral-800`}>
                    <div className='flex flex-row justify-between px-2'>
                        <div className={`flex gap-1 text-lg font-medium tracking-wide text-neutral-800 dark:text-gray-300 rounded-xl items-end`}>
                            <EventsIcon className='h-5 w-auto text-neutral-800 dark:text-gray-300' />
                            Filters
                        </div>
                        <button onClick={() => setFiltersPane(!filtersPane)}>
                            <CloseIcon className='h-4 w-auto text-neutral-800 dark:text-gray-300' />
                        </button>
                    </div>
                    <div className='flex flex-col px-1 gap-2 h-11/12 overflow-y-auto'>
                        {artworks.map((artwork, index) => (
                            <EventCard size="m" key={index} artwork={artwork} artist={artwork.artist} />
                        ))}
                    </div>
                </div>
            }
        </div >
    )
}

export default Store