import React, { useState, useEffect } from 'react';
import { Grid, Dialog, Divider, DialogTitle, DialogContent, Popover, Checkbox, ListItemText, Typography, List, ListItem, Button, Link, InputBase, IconButton, Paper, Card, CardContent, CardMedia, CardActions, ListItemSecondaryAction } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import LoginMedia from '../../assets/images/LoginMedia.jpg';
import { red, blueGrey, deepPurple, amber } from '@material-ui/core/colors';
import TokenIcon from '../../assets/images/coin.png';

import { handleHeaderDialogOpen, handleHeaderDialogClose, handleSignin } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    loginRoot: {
        width: '100%',
        background: 'rgba(255,255,255,0.4)'
    },
    dialogPaper: {
        width: '100%',
        maxWidth: '450px',
        background: 'rgb(39,39,43)'
    },
    dialogTitle: {
        display: 'inline',
        padding: '0'
    },
    closeIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
        color: 'white'
    },
    dialogContent: {
        height: '100%',
        '&::-webkit-scrollbar': {
            width: '0.8em',
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
            overflow: 'auto',
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
    loginTitle: {
        fontWeight: 'bold',
        color: deepPurple[500],
        marginBottom: '-5px'
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
        width: '100%'
    },
    tokenListItem: {
        borderRadius: '10px',
        width: '80px',
    },
    textRoot: {
        color: 'white',
    },
    textSecondaryRoot: {
        color: '#ffffff',
        marginBottom: '-10px'
    },
    subTextRoot: {
        color: '#c3c5c7',
        fontSize: '0.75rem'
    },
    upgradeBtn: {
        backgroundColor: deepPurple[500]
    },
    tokenIcon: {
        width: '20px',
        height: '20px',
        margin: '0 2px 0 5px'
    }
}))

const PurchaseModal = (props) => {
    const { open, value, data, onClose } = props;
    console.log('data', data)
    const classes = useStyles();
    return (
        <Dialog className={classes.loginRoot} aria-labelledby="simple-dialog-title" open={open} maxWidth={false} PaperProps={{ className: classes.dialogPaper }} >
            <DialogTitle className={classes.dialogTitle} id="simple-dialog-title">
                <IconButton className={classes.closeIcon} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <List style={{ padding: '0' }}>
                    <ListItem disableGutters style={{ display: 'block' }}>
                        <ListItemText
                            edge="start"
                            primary={<Typography variant="h5" className={classes.loginTitle}>Add {new Intl.NumberFormat().format(value)} tokens!</Typography>}
                            secondary={<Typography variant="subtitle1" className={classes.textRoot} style={{ color: red['A200'] }}>Total: &#8377;{Number.parseFloat(data).toFixed(2)}</Typography>}
                            style={{ color: 'white' }}
                        />
                        <ListItemText
                            edge="start"
                            primary={<Typography variant="subtitle2" color="textSecondary" className={classes.textSecondaryRoot}>Purchased tokens will be added to, {props.user.username}</Typography>}
                            secondary={<Typography variant="p" color="textSecondary" className={classes.subTextRoot}>By purchasing Coins and Awards, you agree to the <Link>Artyst User Agreement.</Link></Typography>}
                        />
                    </ListItem>
                    <Divider style={{ marginBottom: '5px', backgroundColor: '#d5d5d5' }} />
                    <ListItem disableGutters>
                        <Typography variant="body2" className={classes.textRoot} style={{ display: 'flex', margin: '5px 0' }}>
                            Current Balance: <img src={TokenIcon} className={classes.tokenIcon} />{new Intl.NumberFormat().format(props.user.tokens)}
                        </Typography>
                        <Button variant='contained' size='small' style={{ backgroundColor: amber[400], marginLeft: 'auto' }}>Add</Button>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    handleHeaderDialogOpen,
    handleHeaderDialogClose,
    handleSignin
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PurchaseModal))
