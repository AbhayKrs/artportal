import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BiSearch } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';

const SearchBar = (props) => {
    const handleSearch = (val) => props.setSearchValue(val);

    return (
        <div className="col-12 align-middle items-center justify-content-center flex space-x-2">
            <div className="relative flex text-gray-300 dark:text-gray-600 w-full">
                <input type="text" name="search" value={props.searchValue} placeholder="Search" className="placeholder-gray-600 dark:placeholder-gray-300 w-full text-black dark:text-white bg-slate-300 dark:bg-neutral-700 h-10 px-3 pr-16 rounded-lg text-sm focus:outline-none" onChange={(ev) => handleSearch(ev.target.value)} />
                {props.searchValue.length === 0 ?
                    '' :
                    <button type="submit" className="absolute text-black dark:text-white right-6 top-0 mt-3 mr-6" onClick={() => props.setSearchValue('')}>
                        <MdClose />
                    </button>
                }
                <button disabled={props.searchValue.length === 0} type="submit" onClick={() => props.handleSubmit()} className="absolute bg-violet-500 text-white dark:text-black dark:text-white right-0 top-0 h-full px-3 rounded-r-lg">
                    <BiSearch />
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);