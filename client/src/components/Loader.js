import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress, Typography } from '@material-ui/core';
import { grey, deepPurple, common } from '@material-ui/core/colors';

import panda_loading from '../assets/images/panda_loading.gif';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: '1200',
        background: 'rgb(29, 29, 31)',
        color: deepPurple[500]
    },
    loader: {
        textAlign: 'center'
    },
    loaderText: {
        fontFamily: "Calypsoka",
    }
}))

const Loader = (props) => {
    const classes = useStyles();
    return (
        <Backdrop className={classes.backdrop} open={props.common.loader} >
            <div className={classes.loader}>
                <img src={panda_loading} height='200' width='200' />
                {/* <Typography variant='h4' className={classes.loaderText}>Hang in there!</Typography> */}
            </div>
        </Backdrop>
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
})

export default connect(mapStateToProps)(withRouter(Loader));
