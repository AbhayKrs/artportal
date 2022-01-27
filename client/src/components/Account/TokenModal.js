import React, { useState, useEffect, useRef } from 'react';
import { Grid, Dialog, Divider, DialogTitle, DialogContent, FormControlLabel, Checkbox, ListItemText, Typography, List, ListItem, Button, Link, Fade, IconButton, Paper, Card, CardContent, CardMedia, CardActions } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import LoginMedia from '../../assets/images/LoginMedia.jpg';
import { grey, blueGrey, deepPurple, red, amber } from '@material-ui/core/colors';
import PurchaseModal from './PurchaseModal';

import { handleHeaderDialogOpen, handleHeaderDialogClose, handleSignin } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    loginRoot: {
        width: '100%',
    },
    dialogPaper: {
        width: '100%',
        boxShadow: 'none',
        maxWidth: '500px',
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
        padding: '15px',
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
    tokenTitle: {
        // textTransform: 'uppercase',
        fontFamily: 'AntipastoProRegular',
        fontWeight: 'bold',
        color: deepPurple[600]
    },
    tokenSubTitle: {
        fontFamily: 'AntipastoProRegular',
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
}))

const TokenModal = (props) => {
    const { open, title, onClose } = props;
    const classes = useStyles();
    const [purchaseDialog, setPurchaseDialog] = useState(false);
    const [purchaseValue, setPurchaseValue] = useState('');
    const [purchaseData, setPurchaseData] = useState('');

    const openPurchaseDialog = (value, data) => {
        console.log('test', value, data)
        setPurchaseValue(value);
        setPurchaseData(data);
        setPurchaseDialog(true);
    }

    const routeToPremium = () => {
        props.onClose();
        props.history.push({ pathname: `/premium` })
    }

    return (
        <Dialog className={classes.loginRoot} aria-labelledby="simple-dialog-title" open={open} maxWidth={false} PaperProps={{ className: classes.dialogPaper }} >
            <DialogTitle className={classes.dialogTitle} id="simple-dialog-title">
                <IconButton className={classes.closeIcon} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <List style={{ padding: '0' }}>
                    <ListItem style={{ paddingTop: '0' }}>
                        <ListItemText
                            edge="start"
                            primary={<Typography variant="h4" className={classes.tokenTitle}>{title}</Typography>}
                            secondary={<Typography variant="subtitle1" className={classes.tokenSubTitle}>Tokens are used to purchase awards, badges and profile avatars. You can gift your tokens to artists you admire as well!</Typography>}
                        />
                    </ListItem>
                    <ListItem>
                        <List className={classes.tokenList}>
                            <ListItem>
                                <ListItemText primary={new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(250) + " tokens"} className={classes.tokenHeaders} />
                                <Button variant="contained" className={classes.tokenListItem} onClick={() => openPurchaseDialog(250, 100)}>&#8377; 100</Button>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(500) + " tokens"} className={classes.tokenHeaders} />
                                <Button variant="contained" className={classes.tokenListItem} onClick={() => openPurchaseDialog(500, 190)}>&#8377; 190</Button>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(1000) + " tokens"} className={classes.tokenHeaders} />
                                <Button variant="contained" className={classes.tokenListItem} onClick={() => openPurchaseDialog(1000, 360)}>&#8377; 360</Button>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(5000) + " tokens"} className={classes.tokenHeaders} />
                                <Button variant="contained" className={classes.tokenListItem} onClick={() => openPurchaseDialog(5000, 1500)}>&#8377; 1500</Button>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(10000) + " tokens"} className={classes.tokenHeaders} />
                                <Button variant="contained" className={classes.tokenListItem} onClick={() => openPurchaseDialog(10000, 2600)}>&#8377; 2600</Button>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(25000) + " tokens"} className={classes.tokenHeaders} />
                                <Button variant="contained" className={classes.tokenListItem} onClick={() => openPurchaseDialog(25000, 5000)}>&#8377; 5000</Button>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(50000) + " tokens"} className={classes.tokenHeaders} />
                                <Button variant="contained" className={classes.tokenListItem} onClick={() => openPurchaseDialog(50000, 7400)}>&#8377; 7400</Button>
                            </ListItem>
                        </List>
                    </ListItem>
                    <Divider style={{ backgroundColor: '#d5d5d5' }} />
                    <ListItem>
                        <ListItemText
                            primary="Premium"
                            secondary="Get 1000 tokens/month. No Ads & more!"
                            style={{ color: 'white' }}
                            classes={{
                                root: classes.textRoot,
                                primary: classes.textPrimaryRoot,
                                secondary: classes.textSecondaryRoot
                            }}
                        />
                        <Button variant="contained" className={classes.upgradeBtn} onClick={routeToPremium}>Go Premium!</Button>
                    </ListItem>
                </List>
            </DialogContent>
            <PurchaseModal
                open={purchaseDialog}
                value={purchaseValue}
                data={purchaseData}
                onClose={() => setPurchaseDialog(false)}
                onClick={() => setPurchaseDialog(false)}
            />
        </Dialog >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    loginCreds: state.common.loginCreds
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    handleHeaderDialogOpen,
    handleHeaderDialogClose,
    handleSignin
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TokenModal))
