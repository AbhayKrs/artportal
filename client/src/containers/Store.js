import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from 'redux';

import { fetchExploreImages } from '../api';

const Store = (props) => {
    return (
        <div className='bg-gray-200 dark:bg-darkNavBg'>
            store
        </div>
    )
}

const mapStateToProps = (state, props) => ({
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Store)