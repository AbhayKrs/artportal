import React, { useState } from 'react';
import { AppBar, Toolbar, Grid, Container, Card, CardContent, CardActions, IconButton, List, ListItem, ListItemText, Avatar, Typography, Button, Drawer, Divider, Paper, InputBase, Backdrop, CircularProgress, Zoom, Tooltip } from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';

import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import ExploreIcon from '@material-ui/icons/Explore';
import StorefrontIcon from '@material-ui/icons/Storefront';
import InfoIcon from '@material-ui/icons/Info';
import PeopleIcon from '@material-ui/icons/People';
import EmailIcon from '@material-ui/icons/Email';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DarkMode from '../../assets/images/DarkMode.svg';
import LightMode from '../../assets/images/LightMode.svg';
import HelpIcon from '@material-ui/icons/Help';
import GavelIcon from '@material-ui/icons/Gavel';
import PolicyIcon from '@material-ui/icons/Policy';
import AddCircleOutlined from '@material-ui/icons/AddCircleOutlined';
import TokenIcon from '../../assets/images/coin.png';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import RegisterModal from '../Account/RegisterModal';
import LoginModal from '../Account/LoginModal';
import TokenModal from '../Account/TokenModal';
import { handleHeaderDialogOpen, handleHeaderDialogClose, handleSignOut } from '../../store/actions/common.actions';
import { grey, deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '0px 20px',
        backgroundColor: 'rgb(29, 29, 31)',
        borderBottom: '1px solid #333',
        height: '4rem',
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
    },
    navbarTitle: {
        marginRight: 'auto',
        '&:hover': {
            cursor: 'pointer'
        },
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto'
        }
    },
    navbarContent: {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
        [theme.breakpoints.only('md')]: {
            display: 'flex',
        },
        display: 'flex',
    },
    menuButton: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    navItems: {
        color: grey[400],
        flexGrow: 0.03,
        margin: '12px',
        display: 'block',
        fontFamily: "'Oswald', sans-serif",
        fontSize: '1.5rem',
        letterSpacing: '0.10em',
        '&:hover': {
            cursor: 'pointer',
        }
    },
    loggedinIcons: {
        display: 'flex',
        marginLeft: '12px'
    },
    userIcon: {
        margin: 'auto',
        backgroundColor: 'transparent',
        borderRadius: 0
    },
    hoveredUserIcon: {
        width: '40px',
        height: '36px',
        backgroundColor: deepPurple[500],
        boxShadow: '8px 15px 15px 0px rgb(0 0 0 / 80%)',
        margin: 'auto',
        padding: '12px 8px 8px',
        borderRadius: '50% 50% 0 0'
    },
    navBtn: {
        margin: '15px 0px 15px 15px',
        '&:hover': {
            cursor: 'pointer',
        }
    },
    navTitle: {
        color: deepPurple[500],
        flexGrow: 0.05,
        fontFamily: 'Calypsoka',
        fontSize: '3rem',
        fontWeight: 100,
    },
    navDrawerTitle: {
        width: '15%',
        color: grey[300],
        flexGrow: 0.05,
        fontFamily: 'Calypsoka',
        fontSize: '3rem',
        fontWeight: 100,
        cursor: 'pointer'
    },
    navLink: {
        textDecoration: 'none'
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        // backgroundColor: fade(theme.palette.common.white, 0.15),
        // '&:hover': {
        //     backgroundColor: fade(theme.palette.common.white, 0.25),
        // },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawerRoot: {
        [theme.breakpoints.up('lg')]: {
            display: 'none',
            background: 'none'
        }
    },
    drawerPaper: {
        width: '100%',
        backgroundColor: 'rgb(29, 29, 31)',
    },
    drawerContainer: {
        color: grey[200]
    },
    drawerList: {
        width: '100%',
        alignSelf: 'center',
    },
    drawerTitle: {
        width: '100%'
    },
    drawerListHeader: {
        display: 'flex',
        padding: '0 15px'
    },
    drawerListItem: {
        display: 'flex',
        padding: '0 15px',
        '&:hover': {
            background: 'rgba(59, 67, 76, 0.2)'
        }
    },
    drawerButtons: {
        display: 'flex',
        padding: '0 15px',
    },
    closeButton: {
        color: deepPurple[500],
        padding: '10px',
        position: 'absolute',
        left: '93% !important',
        [theme.breakpoints.only('xs')]: {
            left: '90%'
        },
        top: '0',
    },
    closeIcon: {
        marginLeft: 'auto'
    },
    divider: {
        backgroundColor: deepPurple[500],
        height: '2.5px',
        margin: '20px 10px'
    },
    searchDivider: {
        backgroundColor: deepPurple[500],
        height: 40,
        margin: 2,
    },
    searchForm: {
        width: '100%',
        borderRadius: '50px',
        display: 'flex',
        boxShadow: '3px 3px 8px 0px #888888'
    },
    searchInput: {
        // color: deepPurple[500],
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    searchButton: {
        color: deepPurple[500],
        padding: '0 8px'
    },
    menuIcon: {
        color: deepPurple[500],
    },
    drawerIcon: {
        color: deepPurple[500],
    },
    userCard: {
        width: '250px',
        color: grey[400],
        backgroundColor: deepPurple[500],
        borderTop: 'none',
        margin: theme.spacing.unit,
        position: "fixed",
        top: 50,
        right: theme.spacing.unit * 1.5,
        boxShadow: '8px 15px 15px 0px rgb(0 0 0 / 80%)'
    },
    userCardDisabled: {
        display: 'none'
    },
    themeBtn: {
        float: 'right',
        width: theme.spacing(4.5),
        height: theme.spacing(4.5),
    },
    themeIcon: {
        margin: 'auto'
    },
    themeIconFade: {
        position: 'absolute'
    },
    userTitle: {
        color: grey[200],
        display: 'inline-flex'
    },
    userName: {
        color: grey[200],
        fontSize: '0.75rem',
        width: 'fit-content',
        '&:hover': {
            color: '#000',
            cursor: 'pointer'
        }
    },
    userSignout: {
        margin: '0 8px',
        '&:hover': {
            cursor: 'pointer',
        }
    },
    tokenRoot: {
        display: 'flex'
    },
    tokenAvatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        margin: 'auto 10px'
    },
    tokenIcon: {
        width: '100%'
    },
    tokenHead: {
        fontWeight: 'bold',
        color: grey[900]
    },
    tokenContent: {
        alignItems: 'center',
        display: 'flex'
    },
    addIcon: {
        fontSize: '1.25rem',
        margin: '0px 0px 2.5px 5px'
    }
}));

const SigninButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(deepPurple[500],),
        backgroundColor: deepPurple[500],
        '&:hover': {
            backgroundColor: deepPurple[400],
        },
    },
}))(Button);
const SignupButton = withStyles(() => ({
    root: {
        color: deepPurple[500],
        background: 'white',
        borderColor: 'white',
        '&:hover': {
            borderColor: deepPurple[500],
            color: deepPurple[500],
            backgroundColor: grey[100]
        },
    },
}))(Button);
const SignoutButton = withStyles(() => ({
    root: {
        color: deepPurple[500],
        background: 'white',
        borderColor: 'white',
        '&:hover': {
            borderColor: deepPurple[500],
            color: deepPurple[500],
            backgroundColor: grey[100]
        },
    },
}))(Button);

const Header = (props) => {
    const [drawer, setDrawer] = useState(false);
    const [theme, setTheme] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const classes = useStyles();

    const handleDrawerDisplay = (value) => {
        console.log(value);
        setDrawer(value);
    }
    const handleThemeChange = () => {
        setTheme(prev => !prev);
    }
    const toggleUserDropdown = (cond) => {
        setUserDropdown(cond)
    }

    return (
        <AppBar position='fixed' className={classes.root}>
            <Toolbar disableGutters>
                <IconButton
                    edge='start'
                    className={classes.menuButton}
                    color='inherit'
                    aria-label='open drawer'
                    onClick={() => handleDrawerDisplay(true)}
                >
                    <MenuIcon fontSize='large' className={classes.menuIcon} />
                </IconButton>
                <div className={classes.navbarTitle} onClick={() => props.history.push('/')}>
                    <Typography className={classes.navTitle} variant='h6'>
                        Artyst
                    </Typography>
                </div>
                <div className={classes.navbarContent}>
                    <Typography className={classes.navItems} variant='h6' noWrap onClick={() => props.history.push('/explore')}>
                        Explore
                    </Typography>
                    <Typography className={classes.navItems} variant='h6' noWrap onClick={() => props.history.push('/store')}>
                        Store
                    </Typography>
                    {props.common.isAuthenticated ?
                        '' :
                        <SignupButton
                            className={classes.navBtn}
                            variant='contained'
                            color='secondary'
                            size='large'
                            onClick={() => props.handleHeaderDialogOpen('openRegisterDialog')}
                        >
                            Sign up
                        </SignupButton>
                    }
                </div>
                <div className={classes.navbarEnd}>
                    {props.common.isAuthenticated ?
                        <div className={classes.loggedinIcons} onMouseLeave={() => toggleUserDropdown(false)}>
                            {userDropdown ?
                                <Avatar className={classes.hoveredUserIcon} size='small' onMouseOver={() => toggleUserDropdown(true)} >
                                    <img style={{ width: '100%' }} src={`http://localhost:4000/api/users/image/${props.user.avatar.icon}`} />
                                </Avatar>
                                :
                                <Avatar className={classes.userIcon} size='small' onMouseOver={() => toggleUserDropdown(true)} >
                                    <img style={{ width: '100%' }} src={`http://localhost:4000/api/users/image/${props.user.avatar.icon}`} />
                                </Avatar>
                            }
                            <Card elevation={false} className={userDropdown ? classes.userCard : classes.userCardDisabled}>
                                <CardContent style={{ padding: '10px 12px' }}>
                                    <Typography variant='subtitle1' className={classes.userTitle}>
                                        {props.common.user.name}
                                    </Typography>
                                    <Avatar variant='rounded' className={classes.themeBtn} style={{ background: !theme ? grey[900] : grey[200] }} onClick={handleThemeChange}>
                                        <Zoom in={theme} className={classes.themeIconFade} style={{ transitionDelay: !theme ? '0ms' : '150ms' }}>
                                            <img src={LightMode} className={classes.themeIcon} />
                                        </Zoom>
                                        <Zoom in={!theme} style={{ transitionDelay: !theme ? '150ms' : '0ms' }}>
                                            <img src={DarkMode} />
                                        </Zoom>
                                    </Avatar>
                                    <Typography variant='subtitle1' className={classes.userName} onClick={() => props.history.push(`/user/${props.common.user.id}`)}>
                                        # {props.common.user.username}
                                    </Typography>
                                    <Divider />
                                    <div className={classes.tokenRoot}>
                                        <Avatar className={classes.tokenAvatar}>
                                            <img src={TokenIcon} className={classes.tokenIcon} />
                                        </Avatar>
                                        <ListItemText
                                            primary={<Typography className={classes.tokenHead}>Tokens</Typography>}
                                            secondary={
                                                <Typography className={classes.tokenContent} variant='subtitle2' color="inherit">
                                                    0 tokens
                                                    <IconButton color='inherit' style={{ padding: '0px 5px 2px 5px' }} onClick={() => props.handleHeaderDialogOpen('openTokenDialog')}>
                                                        <AddCircleOutlined fontSize='small' style={{ color: 'rgb(29, 29, 31)' }} />
                                                    </IconButton>
                                                </Typography>
                                            }
                                        />
                                    </div>
                                    <Typography variant='body' color="inherit">Account Settings</Typography>
                                </CardContent>
                                <CardActions>
                                    <SignoutButton
                                        className={classes.userSignout}
                                        variant='contained'
                                        color='secondary'
                                        onClick={() => props.handleSignOut()}
                                    >
                                        Sign out
                                    </SignoutButton>
                                </CardActions>
                            </Card>
                        </div>
                        :
                        <SigninButton
                            className={classes.navBtn}
                            variant='contained'
                            color='secondary'
                            size='large'
                            onClick={() => props.handleHeaderDialogOpen('openLoginDialog')}
                        >
                            Sign in
                        </SigninButton>}

                </div>
                <Drawer
                    anchor='left'
                    open={drawer}
                    className={classes.drawerRoot}
                    PaperProps={{ classes: { root: classes.drawerPaper } }}
                >
                    <Container className={classes.drawerContainer} disableGutters>
                        <List className={classes.drawerList}>
                            <ListItem className={classes.drawerListHeader}>
                                <div className={classes.drawerTitle} >
                                    <Typography className={classes.navDrawerTitle} variant='h6' onClick={() => { props.history.push('/'); setDrawer(false) }}>
                                        Artyst
                                    </Typography>
                                    <Paper component='form' className={classes.searchForm}>
                                        <InputBase className={classes.searchInput} placeholder="Search..." inputProps={{ 'aria-label': 'Search...' }} />
                                        <Divider className={classes.searchDivider} orientation="vertical" />
                                        <IconButton type="submit" className={classes.searchButton} aria-label="search">
                                            <SearchIcon style={{ fontSize: 35 }} />
                                        </IconButton>
                                    </Paper>
                                </div>
                                <IconButton onClick={() => handleDrawerDisplay(false)} className={classes.closeButton} disableRipple>
                                    <CloseIcon className={classes.closeIcon} />
                                </IconButton>
                            </ListItem>
                            <Divider className={classes.divider} />
                            <ListItem className={classes.drawerListItem} onClick={() => { props.history.push('/explore'); setDrawer(false) }} disableGutters>
                                <ExploreIcon className={classes.drawerIcon} fontSize='small' />
                                <Typography
                                    className={classes.navItems}
                                    variant='h6'
                                    noWrap
                                >
                                    Explore
                                </Typography>
                            </ListItem>
                            <ListItem className={classes.drawerListItem} onClick={() => { props.history.push('/store'); setDrawer(false) }} disableGutters>
                                <StorefrontIcon className={classes.drawerIcon} fontSize='small' />
                                <Typography
                                    className={classes.navItems}
                                    variant='h6'
                                    noWrap
                                    disableGutters
                                >
                                    Store
                                </Typography>
                            </ListItem>
                            <ListItem className={classes.drawerListItem} onClick={() => { props.history.push('/account'); setDrawer(false) }} disableGutters>
                                <InfoIcon className={classes.drawerIcon} fontSize='small' />
                                <Typography
                                    className={classes.navItems}
                                    variant='h6'
                                    noWrap
                                    disableGutters
                                >
                                    About
                                </Typography>
                            </ListItem>
                            <ListItem className={classes.drawerListItem} onClick={() => { props.history.push('/account'); setDrawer(false) }} disableGutters>
                                <PeopleIcon className={classes.drawerIcon} fontSize='small' />
                                <Typography
                                    className={classes.navItems}
                                    variant='h6'
                                    noWrap
                                    disableGutters
                                >
                                    Community
                                </Typography>
                            </ListItem>
                            <ListItem className={classes.drawerListItem} onClick={() => { props.history.push('/account'); setDrawer(false) }} disableGutters>
                                <EmailIcon className={classes.drawerIcon} fontSize='small' />
                                <Typography
                                    className={classes.navItems}
                                    variant='h6'
                                    noWrap
                                    disableGutters
                                >
                                    Contact Us
                                </Typography>
                            </ListItem>
                            <ListItem className={classes.drawerListItem} onClick={() => { props.history.push('/account'); setDrawer(false) }} disableGutters>
                                <HelpIcon className={classes.drawerIcon} fontSize='small' />
                                <Typography
                                    className={classes.navItems}
                                    variant='h6'
                                    noWrap
                                    disableGutters
                                >
                                    Support
                                </Typography>
                            </ListItem>
                            <ListItem className={classes.drawerListItem} onClick={() => { props.history.push('/account'); setDrawer(false) }} disableGutters>
                                <GavelIcon className={classes.drawerIcon} fontSize='small' />
                                <Typography
                                    className={classes.navItems}
                                    variant='h6'
                                    noWrap
                                    disableGutters
                                >
                                    Terms of Service
                                </Typography>
                            </ListItem>
                            <ListItem className={classes.drawerListItem} onClick={() => { props.history.push('/privacy'); setDrawer(false) }} disableGutters>
                                <PolicyIcon className={classes.drawerIcon} fontSize='small' />
                                <Typography
                                    className={classes.navItems}
                                    variant='h6'
                                    noWrap
                                    disableGutters
                                >
                                    Privacy Policy
                                </Typography>
                            </ListItem>
                            {props.common.isAuthenticated ?
                                '' :
                                <ListItem className={classes.drawerButtons} disableGutters>
                                    <SignupButton
                                        className={classes.navBtn}
                                        variant='contained'
                                        color='secondary'
                                        size='large'
                                        style={{ margin: '5px' }}
                                        onClick={() => { setDrawer(false); props.handleHeaderDialogOpen('openRegisterDialog'); }}
                                    >
                                        <ExitToAppIcon style={{ paddingRight: '5px' }} fontSize='small' />
                                        Sign up
                                    </SignupButton>
                                </ListItem>

                            }
                        </List>
                    </Container>
                </Drawer>
            </Toolbar>
            <LoginModal
                open={props.common.openLoginDialog}
                title={props.common.dialogTitle}
                onClose={props.handleHeaderDialogClose}
                onClick={props.handleHeaderDialogClose}
            />
            <RegisterModal
                open={props.common.openRegisterDialog}
                title={props.common.dialogTitle}
                onClose={props.handleHeaderDialogClose}
                onClick={props.handleHeaderDialogClose}
            />
            <TokenModal
                open={props.common.openTokenDialog}
                title={props.common.dialogTitle}
                onClose={props.handleHeaderDialogClose}
                onClick={props.handleHeaderDialogClose}
            />
            {/* <Backdrop className={classes.backdrop} open={true} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop> */}
        </AppBar >
    );
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    handleHeaderDialogOpen,
    handleHeaderDialogClose,
    handleSignOut
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
