import React, { useState, useEffect, useRef } from 'react';
import { Grid, Dialog, Avatar, Tabs, Tab, DialogContent, Box, Checkbox, ListItemText, Typography, List, ListItem, Button, Link, Fade, IconButton, Paper, Card, CardContent, CardMedia, CardActions } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import EuroIcon from '@material-ui/icons/Euro';
import AddIcon from '@material-ui/icons/Add';
import CoinIcon from '../../assets/images/coin.png';
import { grey, blueGrey, deepPurple } from '@material-ui/core/colors';

import { fetchAvatars, handleEditUserAvatar } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    loginRoot: {
        width: '100%'
    },
    dialogPaper: {
        width: '100%',
        boxShadow: 'none',
        maxHeight: '550px',
        background: 'rgb(39,39,43)'
    },
    dialogTitle: {
        display: 'inline',
        padding: '0'
    },
    closeIcon: {
        color: 'white',
        position: 'absolute',
        top: 0,
        right: 0
    },
    dialogContent: {
        height: '100%',
        padding: '20px',
        '&::-webkit-scrollbar': {
            width: '0.8em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.6)',
            borderRadius: '25px'
        },
        [theme.breakpoints.down('md')]: {
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100%'
        }
    },
    cardRoot: {
        display: 'flex',
        width: '100%',
        height: '550px'
    },
    cardMedia: {
        width: '550px',
        height: '100%'
    },
    cardDetails: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        // padding: '30px'
    },
    cardContent: {
        flex: '1 0 auto'
    },
    tokenTitle: {
        textTransform: 'uppercase',
        fontFamily: 'Teko',
        fontWeight: 'bold',
        color: deepPurple[600]
    },
    tokenSubTitle: {
        fontWeight: 'bold',
        color: '#d5d5d5',
    },
    tokenHeaders: {
        color: '#d5d5d5',
    },
    loginFields: {
        width: '100%',
        display: 'flex',
        margin: '5px 0'
    },
    loginIcons: {
        background: 'rgba(0, 0, 0, 0.15)',
        '&:disabled': {
            color: deepPurple[400]
        }
    },
    inputUser: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    inputPass: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    remainLoggedIn: {
        width: '100%'
    },
    checkboxRoot: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    checkboxChecked: {
        color: deepPurple[400]
    },
    loginButton: {
        background: blueGrey[800],
        color: 'white',
        '&:hover': {
            background: blueGrey[900],
        }
    },
    loginTOS: {
        color: 'rgba(0, 0, 0, 0.5)'
    },
    tokenList: {
        width: '100%',
    },
    tokenListItem: {
        background: deepPurple[200],
        borderRadius: '10px',
        width: '80px',
        '&:hover': {
            background: deepPurple[300],
        }
    },
    textRoot: {
        color: 'white'
    },
    textSecondaryRoot: {
        color: '#818181'
    },
    upgradeBtn: {
        color: '#ffffff',
        backgroundColor: deepPurple[500]
    },
    awardIcons: {
        flexDirection: 'column'
    },
    tabPanel: {
        width: '100%',
        textAlign: 'center',
    },
    tabRoot: {
        textTransform: 'none',
        color: '#fff',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&$selected': {
            color: deepPurple[500],
            fontWeight: theme.typography.fontWeightMedium,
        }
    },
    selectedTab: {
        color: deepPurple[200],
    },
    tabsRoot: {
        // marginTop: '20px',
    },
    tabsIndicator: {
        // top: '0px',
        backgroundColor: deepPurple[200],
    },
}))

const AwardModal = (props) => {
    const { open, title, onClose } = props;
    const classes = useStyles();

    return (
        <Dialog className={classes.loginRoot} aria-labelledby="simple-dialog-title" open={open} maxWidth={false} PaperProps={{ className: classes.dialogPaper }} >
            <IconButton className={classes.closeIcon} onClick={onClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent className={classes.dialogContent}>
                <Grid container>
                    <Grid container xs={6} style={{ padding: '30px' }}>
                        <Typography variant='h6' style={{ width: '100%', textAlign: 'center', color: 'white', fontFamily: 'AntipastoProRegular' }}>Male</Typography>
                        {props.common.avatarList.filter(item => item.category === 'Male').map(item => (
                            <Grid item xs={3}>
                                <IconButton onClick={() => props.handleEditUserAvatar(item)}>
                                    <img style={{ width: '100%' }} src={`http://localhost:4000/api/users/image/${item.icon}`} />
                                </IconButton>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container xs={6} style={{ padding: '30px' }}>
                        <Typography variant='h6' style={{ width: '100%', textAlign: 'center', color: 'white', fontFamily: 'AntipastoProRegular' }}>Female</Typography>
                        {props.common.avatarList.filter(item => item.category === 'Female').map(item => (
                            <Grid item xs={3}>
                                <IconButton onClick={() => props.handleEditUserAvatar(item)}>
                                    <img style={{ width: '100%' }} src={`http://localhost:4000/api/users/image/${item.icon}`} />
                                </IconButton>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchAvatars,
    handleEditUserAvatar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AwardModal))
