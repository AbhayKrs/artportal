import React, { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, List, ListItem, Paper, Tooltip, Fab, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { deepPurple } from '@material-ui/core/colors';
import Masonry from '../Masonry';

import { fetchArtworkList, handleDialogOpen, handleDialogClose } from '../../store/actions/explore.actions';
import { setLoader, handleHeaderDialogOpen, handleHeaderDialogClose } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '50px',
        padding: '20px',
    },
    exploreGrid: {
        margin: '65px 0 0',
        backgroundColor: 'rgb(29, 29, 31)'
    },
    exploreGridItem: {
        height: 'auto',
        display: 'table',
        position: 'relative',
        lineHeight: '0',
        listStyle: 'none',
        padding: '4px 0',
        pageBreakInside: 'avoid',
        breakInside: 'avoid-column'
    },
    exploreImage: {
        // borderRadius: '2px',
        objectFit: 'cover',
        width: '100%',
        height: '100%',
    },
    fab: {
        backgroundColor: deepPurple[500],
        color: '#fff',
        margin: theme.spacing.unit,
        position: "fixed",
        bottom: 10,
        left: 10,
        '&:hover': {
            color: deepPurple[700],
        },
        zIndex: '1101'
    }
}));

const Explore = (props) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        props.setLoader(true);
        props.fetchArtworkList();
        setTimeout(() => { props.setLoader(false) }, 5000);
    }, []);
    const classes = useStyles();
    return (
        <div className={classes.exploreGrid}>
            <Masonry {...props} imageList={props.explore.artworkList} />
            {
                props.common.isAuthenticated === true ? <Tooltip title="Upload" aria-label="add" onClick={() => props.history.push('/upload')}>
                    <Fab className={classes.fab} >
                        <AddIcon />
                    </Fab>
                </Tooltip> : ''
            }
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    explore: state.explore,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader,
    fetchArtworkList,
    handleDialogOpen,
    handleDialogClose,
    handleHeaderDialogOpen,
    handleHeaderDialogClose
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Explore));