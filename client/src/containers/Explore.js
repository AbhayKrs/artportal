import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { fetchExploreList } from '../store/actions/explore.actions';
import Masonry from '../components/Masonry';
import SearchBar from '../components/SearchBar';
import { HiFilter } from 'react-icons/hi';
import { MdUpload, MdClose } from 'react-icons/md';
import { fetchExploreImages } from '../api';

const Explore = (props) => {
    let navigate = useNavigate();
    const [filterActive, setFilterActive] = useState(false);
    const [bottomUI, setBottomUI] = useState(false);

    useEffect(async () => {
        props.fetchExploreList();
    }, []);

    window.onscroll = function (ev) {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            setBottomUI(true);
        } else {
            setBottomUI(false)
        }
    };

    return (
        <div className='bg-gray-200 dark:bg-darkNavBg'>
            <SearchBar />
            <Masonry>
                {props.explore.exploreList.map((explore, index) => (
                    <div>
                        <img
                            id={index}
                            onClick={() => navigate(`/explore/${explore._id}`)}
                            // onClick={() => { props.history.push({ pathname: `/explore/${image._id}`, state: { explore_id: image._id } }); window.scroll(0, 0) }}
                            className='object-cover w-full h-full'
                            src={fetchExploreImages(explore.files[0])}
                        />
                    </div>
                ))}
            </Masonry>
            {props.common.isAuthenticated === true ?
                <div style={bottomUI ? { bottom: '3em' } : { bottom: 0 }} className='fixed left-0 m-3'>
                    {filterActive ? <div className='mb-2 p-3 bg-teal-700 text-gray-300 space-y-2 rounded'>
                        <div className="flex flex-row w-full space-x-5 rounded">
                            <div className="flex flex-col">
                                <header className="card-header">
                                    <h6 className="font-caviar font-bold">Category</h6>
                                </header>
                                <div>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 1</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 2</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 3</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 4</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 5</p>
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <header className="card-header">
                                    <h6 className="font-caviar font-bold">Top</h6>
                                </header>
                                <div>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Today</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>This Week</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>This Month</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>This Year</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>All Time</p>
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <header className="card-header">
                                    <h6 className="font-caviar font-bold">Category</h6>
                                </header>
                                <div>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 1</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 2</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 3</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 4</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="form-checkbox h-3.5 w-3.5 rounded bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Option 5</p>
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <header className="card-header">
                                    <h6 className="font-caviar font-bold">Top</h6>
                                </header>
                                <div>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>Today</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>This Week</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>This Month</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>This Year</p>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name='top' className="form-radio h-3.5 w-3.5 bg-slate-300 text-neutral-700 cursor-pointer mr-1" />
                                        <p className='font-caviar text-sm'>All Time</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='flex space-x-2'>
                            <button type='button' className='bg-neutral-700 font-caviar py-1 px-2 rounded'>Apply</button>
                        </div>
                    </div> : ''}
                    <div className='flex space-x-2'>
                        {filterActive ?
                            <button data-tooltip-target="tooltip-top" onClick={() => setFilterActive(false)} data-tooltip-placement="top" type="button" className='btn bg-teal-700 drop-shadow-xl p-2.5 items-center shadow-lg rounded-xl'>
                                <MdClose className='h-7 w-full text-gray-300' />
                            </button>
                            :
                            <button data-tooltip-target="tooltip-top" onClick={() => setFilterActive(true)} data-tooltip-placement="top" type="button" className='btn bg-teal-700 drop-shadow-xl p-2.5 items-center shadow-lg rounded-xl'>
                                <HiFilter className='h-7 w-full text-gray-300' />
                            </button>
                        }
                        <button data-tooltip-target="tooltip-top" data-tooltip-placement="top" type="button" className='btn bg-violet-700 drop-shadow-xl p-2.5 items-center shadow-lg rounded-xl' onClick={() => navigate(`/explore/new`)}>
                            <MdUpload className='h-7 w-full text-gray-300' />
                        </button>
                    </div>
                </div>
                :
                ''
            }
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    explore: state.explore,
    user: state.common.user,
    common: state.common
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchExploreList
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
