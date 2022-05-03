import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BiSearch } from 'react-icons/bi';

const SearchBar = (props) => {
    return (
        <div className="p-2">
            <div className="col-12 align-middle items-center justify-content-center flex space-x-2">
                <div className="relative text-gray-300 dark:text-gray-600 w-full">
                    <input className="border-2 placeholder-gray-600 w-full border-slate-300 dark:border-neutral-800 text-black dark:text-white bg-slate-300 dark:bg-neutral-700 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none" type="search" name="search" placeholder="Search" />
                    <button type="submit" className="absolute text-black dark:text-white right-0 top-0 mt-3 mr-2">
                        <BiSearch />
                    </button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);