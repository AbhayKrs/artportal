import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchArtworkList } from '../store/actions/explore.actions';
import Masonry from './Masonry';

const Explore = (props) => {
    useEffect(async () => {
        props.fetchArtworkList();
    }, []);

    return (
        <div className='bg-slate-100'>
            <Masonry {...props} imageList={props.explore.artworkList} />
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    explore: state.explore,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchArtworkList
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
