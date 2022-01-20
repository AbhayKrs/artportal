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

import { handleHeaderDialogOpen, handleHeaderDialogClose, handleSignin } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    loginRoot: {
        width: '100%',
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

const TabPanelContent = (props) => {
    const { children, value, index, ...other } = props;
    const classes = useStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            className={classes.tabPanel}
            {...other}
        >
            {value === index && (
                <Grid container style={{ padding: '15px', height: '320px' }}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39].map((item, index) => (
                        <Grid item xs={2}>
                            <Avatar alt="Remy Sharp" src={CoinIcon} />
                            <Typography variant="p" style={{ color: grey[200] }}>{(children * 100) + item}</Typography>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    )
}

function tabProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const AwardModal = (props) => {
    const { open, title, onClose } = props;
    const [value, setValue] = useState(0);

    const classes = useStyles();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Dialog className={classes.loginRoot} aria-labelledby="simple-dialog-title" open={open} maxWidth={false} PaperProps={{ className: classes.dialogPaper }} >
            <IconButton className={classes.closeIcon} onClick={onClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent className={classes.dialogContent}>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '25px' }}>
                    <Typography variant="h3" className={classes.tokenTitle}>{title}</Typography>
                    <Paper elevation={5} style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                        <img src={CoinIcon} style={{ width: '100%', height: '22px', marginLeft: '5px' }} />
                        <Typography variant='button' style={{ margin: '0px 3px' }}>1000</Typography>
                        <IconButton size='small' style={{ backgroundColor: '#fff' }}>
                            <AddIcon />
                        </IconButton>
                    </Paper>
                </div>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    aria-label="scrollable force tabs example"
                    classes={{
                        root: classes.tabsRoot,
                        indicator: classes.tabsIndicator
                    }}
                >
                    <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label="Artyst's Own" {...tabProps(0)} />
                    <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label="Community Provided" {...tabProps(1)} />
                    <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label="Premium" {...tabProps(2)} />
                </Tabs>
                {[0, 1, 2].map((item, index) => (
                    <TabPanelContent value={value} index={index}>
                        {item}
                    </TabPanelContent>
                ))}
                <Button variant='contained' onClick={onClose} style={{ marginTop: '10px' }}>Close</Button>
            </DialogContent>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AwardModal))
