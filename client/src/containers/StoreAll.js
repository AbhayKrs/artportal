import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';

import { fetchExploreImages } from '../api';
import { StoreMultiCarousel } from '../components/Carousel';

import LazyPanda from '../assets/images/lazyPanda2.png';
import Dropdown from '../components/Dropdown';

const StoreAll = (props) => {
    const categoryList = [
        { id: 1, label: 'test1', value: 'test5' },
        { id: 2, label: 'test2', value: 'test5' },
        { id: 3, label: 'test3', value: 'test5' },
        { id: 4, label: 'test4', value: 'test5' },
        { id: 5, label: 'test5', value: 'test5' }
    ]

    const selectCategory = (category) => {
        console.log('Selected Category', category.value)
    }

    return (
        <div className='bg-gray-200 dark:bg-darkNavBg'>
            <div className='p-4 items-center'>
                <div className='flex mb-3'>
                    <div className='text-3xl font-antipasto font-bold text-violet-500 dark:text-violet-600'>Artyst Store</div>
                    <Dropdown right default='Categories' options={categoryList} onSelect={selectCategory} />
                </div>
                {/* Highlights of the Day section */}
                <div className='space-y-2'>
                    <div className='grid gap-4 grid-cols-3 grid-rows-3 '>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                            <div className="h-full drop-shadow-lg rounded-xl bg-indigo-50 dark:bg-neutral-800 overflow-hidden">
                                <img className="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100" src="https://images.unsplash.com/photo-1618172193622-ae2d025f4032?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80" alt="blog" />
                                <div className="py-6 px-4">
                                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">CATEGORY:</h2>
                                    <h1 className="title-font text-lg font-medium text-neutral-800 dark:text-neutral-300">The Catalyzer</h1>
                                    <p className="text-sm leading-relaxed mb-3 text-gray-800 dark:text-gray-400">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
                                    <div className="flex items-center flex-wrap ">
                                        <button className="bg-gradient-to-r font-caviar font-semibold from-violet-400 to-purple-400 hover:scale-105 drop-shadow-md shadow-cla-blue px-4 py-1 rounded-lg">Learn more</button>
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
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StoreAll)