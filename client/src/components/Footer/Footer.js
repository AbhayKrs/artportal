import React from 'react'
import { NavLink, Link } from 'react-router-dom'

import {
    AppBar,
    Container,
    Toolbar,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey, deepPurple } from '@material-ui/core/colors';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'rgb(29, 29, 31)',
        borderTop: "1px solid #333",
        textAlign: "center",
        padding: 0,
        position: "static",
        left: "0",
        bottom: "0",
        width: "100%",
        [theme.breakpoints.down('md')]: {
            height: 'auto',
        }
    },
    footerToolbar: {
        padding: '20px',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    footerTitle: {
        color: deepPurple[400],
        flexGrow: 0.05,
        fontFamily: "'calypsokaregular', serif",
        fontSize: '3.5rem',
        fontWeight: 100,
    },
    footerBody: {
        color: grey[400],
        textAlign: 'left'
    },
    arrowRight: {
        minWidth: '0px',
        color: '#000'
    },
    footerItemHead: {
        color: deepPurple[400],
        flexGrow: 0.03,
        margin: '10px 25px',
        display: 'block',
        fontFamily: "'Teko', sans-serif",
        fontSize: '2rem',
        letterSpacing: '0.10em',
    },
    footerItems: {
        color: grey[400],
        margin: '0px',
        '&:hover': {
            color: deepPurple[400],
        }
    },
    copyright: {
        justifyContent: 'center'
    },
    copyrightText: {
        color: grey[400],
        fontFamily: "'Teko', sans-serif",
        fontSize: '1.45rem',
        margin: '0px 5px'
    },
    footerDivider: {
        backgroundColor: '#000',
        height: 24,
        margin: 2,
        width: '2px'
    },
    footerSplit: {
        backgroundColor: deepPurple[400],
        margin: '15px 0px',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    footerLink: {
        textDecoration: 'none'
    },
    footerLinks: {
        color: deepPurple[400],
        textDecoration: 'none',
        margin: '3px 5px'
    },
    copyRightButtons: {
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    }
})
)

const Footer = () => {
    const classes = useStyles();
    return (
        <AppBar position="static" className={classes.root}>
            <Container maxWidth="lg">
                <Toolbar className={classes.footerToolbar}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Typography className={classes.footerTitle} variant='h6'>
                                Artyst Pvt. Ltd.
                            </Typography>
                            <Typography className={classes.footerBody} variant='body'>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant='h6' className={classes.footerItemHead}>
                                Gallery
                            </Typography>
                            <List>
                                <NavLink className={classes.footerLink} exact to='/community'>
                                    <ListItem button>
                                        <ListItemIcon className={classes.arrowRight}>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Community' className={classes.footerItems} />
                                    </ListItem>
                                </NavLink>
                                <NavLink className={classes.footerLink} exact to='/trending'>
                                    <ListItem button>
                                        <ListItemIcon className={classes.arrowRight}>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Trending' className={classes.footerItems} />
                                    </ListItem>
                                </NavLink>
                            </List>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant='h6' className={classes.footerItemHead}>
                                Quick Links
                            </Typography>
                            <List>
                                <NavLink className={classes.footerLink} exact to='/about'>
                                    <ListItem button>
                                        <ListItemIcon className={classes.arrowRight}>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='About' className={classes.footerItems} />
                                    </ListItem>
                                </NavLink>
                                <NavLink className={classes.footerLink} exact to='/contact'>
                                    <ListItem button>
                                        <ListItemIcon className={classes.arrowRight}>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Contact Us' className={classes.footerItems} />
                                    </ListItem>
                                </NavLink>
                                <NavLink className={classes.footerLink} exact to='/portfolio'>
                                    <ListItem button>
                                        <ListItemIcon className={classes.arrowRight}>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='My Portfolio' className={classes.footerItems} />
                                    </ListItem>
                                </NavLink>
                                <NavLink className={classes.footerLink} exact to='/testimonials'>
                                    <ListItem button>
                                        <ListItemIcon className={classes.arrowRight}>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Testimonials' className={classes.footerItems} />
                                    </ListItem>
                                </NavLink>
                            </List>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant='h6' className={classes.footerItemHead}>
                                Market
                            </Typography>
                            <List>
                                <NavLink className={classes.footerLink} exact to='/trending'>
                                    <ListItem button>
                                        <ListItemIcon className={classes.arrowRight}>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Trending' className={classes.footerItems} />
                                    </ListItem>
                                </NavLink>
                                <NavLink className={classes.footerLink} exact to='/latest'>
                                    <ListItem button>
                                        <ListItemIcon className={classes.arrowRight}>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Latest' className={classes.footerItems} />
                                    </ListItem>
                                </NavLink>
                                <NavLink className={classes.footerLink} exact to='/bestseller'>
                                    <ListItem button>
                                        <ListItemIcon className={classes.arrowRight}>
                                            <KeyboardArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Best Sellers' className={classes.footerItems} />
                                    </ListItem>
                                </NavLink>
                            </List>
                        </Grid>
                    </Grid>
                </Toolbar>
                <Divider className={classes.footerSplit} />
                <Grid container className={classes.copyright}>
                    <Typography variant='body1' className={classes.copyrightText}>
                        Abhay Kumar &#169; 2021, Abbz Digital Inc.
                    </Typography>
                    <div className={classes.copyRightButtons}>
                        <Link to='/support' className={classes.footerLinks}>Support</Link>
                        <Divider className={classes.footerDivider} orientation="vertical" />
                        <Link to='/tos' className={classes.footerLinks}>Terms of Service</Link>
                        <Divider className={classes.footerDivider} orientation="vertical" />
                        <Link to='/privacy' className={classes.footerLinks}>Privacy Policy</Link>
                    </div>
                </Grid>
            </Container>
        </AppBar >
    )
}

export default Footer
