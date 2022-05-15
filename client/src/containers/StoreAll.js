import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';

import { fetchStoreImages } from '../api';

import { fetchStoreList, fetchCategorizedStoreList } from '../store/actions/store.actions';
import { fetchCartList, handleCartAdd, handleRemoveFromCart } from '../store/actions/common.actions';

import Dropdown from '../components/Dropdown';
import { CartModal } from '../components/Modal';

import { MdOutlineAddShoppingCart } from 'react-icons/md';


const StoreAll = (props) => {
    let navigate = useNavigate();
    const [cartOpen, setCartOpen] = useState(true);
    const [storeCategory, setStoreCategory] = useState('');
    const [activeCategoryLabel, setActiveCategoryLabel] = useState('Pick a category');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const categoryOptions = [
        { id: 1, label: 'Prints', value: 'prints' },
        { id: 2, label: 'Clothing', value: 'clothes' },
        { id: 3, label: 'Frames', value: 'frames' }
    ]

    useEffect(() => {
        if (storeCategory.length === 0) {
            props.fetchStoreList();
            navigate(`/store/all`);
        } else {
            props.fetchCategorizedStoreList(storeCategory);
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

    const cartAdd = (item) => {
        setCartOpen(true)
        props.handleCartAdd(item);
    }
    const handleCartClose = () => {
        setCartOpen(false)
    }

    return (
        <div className='bg-gray-200 dark:bg-darkNavBg'>
            <div className='p-4 items-center'>
                <div className='flex mb-3 justify-between'>
                    <div className='text-3xl font-antipasto font-bold tracking-wider text-violet-500 dark:text-violet-600'>Artyst Store</div>
                    <div className='space-x-2'>
                        <button onClick={() => navigate('/store/new')} className='ml-auto h-fit tracking-wider border-2 border-violet-500 text-violet-500 font-antipasto font-bold py-1.5 px-3 rounded-lg'>Create Listing</button>
                        <Dropdown right selectedPeriod={activeCategoryLabel} options={categoryOptions} onSelect={handleCategoryChange} />
                        {storeCategory.length > 0 ? <a className='text-sm font-medium text-rose-400 underline' onClick={() => handleCategoryChange(null)}>Clear</a> : ''}
                    </div>
                </div>
                {/* Highlights of the Day section */}
                <div className='space-y-2'>
                    <div className='grid gap-4 grid-cols-5'>
                        {props.store.storeList.map(item => (
                            <div className="h-full drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                                <img className="h-full max-h-60 w-full object-cover object-center scale-110 transition-all duration-400 scale-100" src={fetchStoreImages(item.files[0])} />
                                <div className="py-6 px-4">
                                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY: <span className='capitalize text-gray-700'>{item.category}</span></h2>
                                    <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">{item.title}</h1>
                                    <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">{item.description}</p>
                                    <div className="flex items-center flex-wrap justify-between">
                                        <div className='tracking-wide text-md font-medium text-gray-500 font-josefinregular'>${item.price}</div>
                                        <div className='flex space-x-2'>
                                            <MdOutlineAddShoppingCart className='w-8 h-8 text-rose-500 hover:cursor-pointer' onClick={() => cartAdd(item)} />
                                            <button onClick={() => navigate(`/store/${item._id}`)} className="bg-gradient-to-r font-caviar font-semibold from-violet-400 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    store: state.store
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchStoreList,
    fetchCategorizedStoreList,
    fetchCartList,
    handleCartAdd,
    handleRemoveFromCart
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StoreAll)