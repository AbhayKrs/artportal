import React, { Fragment, useState, useEffect } from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { grey, red, blue, green, amber } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';

import { setError } from '../../store/actions/common.actions';

const useStyles = makeStyles(theme => ({
}))

const ErrorPopup = (props) => {
    const classes = useStyles();
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        const error = {
            open: false,
            message: '',
            severity: ''
        }
        props.setError(error);
    };

    const renderColorTheme = (param) => {
        switch (param) {
            case 'success':
                return green[500];
            case 'warning':
                return amber[500];
            case 'error':
                return red[500];
            case 'info':
                return blue[500];
            default:
                return grey[50];
        }
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            open={props.error.open}
            autoHideDuration={3000}
            onClose={handleClose}
            message={props.error.message}
            action={
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
            ContentProps={{
                style: {
                    background: renderColorTheme(props.error.severity)
                }
            }}
        />
    )
}

const mapStateToProps = (state, props) => ({
    error: state.common.error
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setError
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ErrorPopup));