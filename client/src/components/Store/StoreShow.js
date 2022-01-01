import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs, Chip, LinearProgress, Typography, Grid, Box, Paper, Divider, Avatar, List, ListItem, ListItemText, Button, Tooltip, Fab, Badge } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import UserIcon from '../../assets/images/panda.png';
import { grey, deepPurple, teal } from '@material-ui/core/colors';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import Cart from './Cart';
import moment from 'moment';

import { fetchStoreList, fetchStoreItem, handleStoreExit } from '../../store/actions/store.actions';
import { setLoader, handleCartOpen, fetchCartList, handleCartClose, handleAddToCart } from '../../store/actions/common.actions';

import Rating from 'react-rating';

const useStyles = makeStyles((theme) => ({
    gridRoot: {
        margin: '62px 0 0 0',
        width: '100%'
    },
    gridContent: {
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down('md')]: {
            margin: '0 5px'
        },
        height: '100vh',
        '&::-webkit-scrollbar': {
            width: '15px',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#e4e4e4',
            borderRadius: '100px'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#8070d4',
            borderRadius: '100px',
            backgroundClip: 'content-box'
        },
    },
    paperRoot: {
        marginTop: '10px',
        padding: '10px',
        background: '#2a2a2a',
        [theme.breakpoints.up('lg')]: {
            margin: '10px 50px'
        }
    },
    showMedia: {
        padding: '5px',
        maxWidth: '815px',
        [theme.breakpoints.down('md')]: {
            maxHeight: '100%'
        },
        textAlign: 'center'
    },
    imgGrid: {
        alignSelf: 'center',
    },
    showImage: {
        width: '100%',
        marginTop: '5px',
        objectFit: 'contain',
        borderRadius: '10px',
        maxHeight: '100vh',
        [theme.breakpoints.down('md')]: {
            width: '100%',
            height: '600px'
        },
    },
    showContent: {
        height: '100%',
    },
    showHeader: {
        padding: '10px',
        position: '-webkit-sticky',
        position: 'sticky',
        top: '0',
    },
    showTitle: {
        padding: '0 10px'
    },
    showDesc: {
        padding: '0 10px',
        width: '100%',
        color: grey[700]
    },
    statsButton: {
        color: deepPurple[400],
        padding: '5px',
        "&:hover": {
            background: 'none'
        },
    },
    disabledStatsButton: {
        color: deepPurple[400],
        padding: '5px',
        "&:disabled": {
            color: deepPurple[400]
        },
    },
    statsButtonText: {
        padding: '0 5px'
    },
    reviewForm: {
        margin: '5px',
        listStylePosition: 'inside'
    },
    editReviewForm: {
        listStylePosition: 'inside'
    },
    editButton: {
        padding: 0,
        color: deepPurple[500],
        '&:hover': {
            background: 'none'
        }
    },
    reviewList: {
        height: 'auto',
        position: 'relative',
        backgroundColor: 'rgb(29, 29, 31)',
        '&::-webkit-scrollbar': {
            width: '20px',
        },
        '&::-webkit-scrollbar-track': {
            // boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            // webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            backgroundColor: '#e4e4e4',
            borderRadius: '100px'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#8070d4',
            borderRadius: '100px',
            border: '5px solid transparent',
            backgroundClip: 'content-box'
        },
    },
    reviewListHeader: {
        top: '-4px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)'
    },
    reviewListItem: {
        background: 'rgba(241, 231, 254, 1)',
        margin: '5px 0',
        borderRadius: '10px',
        [theme.breakpoints.only('xs')]: {
            display: 'block',
            padding: '8px 0'
        }
    },
    reviewListItemText: {
        margin: '0 20px'
    },
    reviewListText: {
        margin: '0 20px'
    },
    replyListItem: {
        background: 'rgba(241, 231, 254, 1)',
        margin: '5px 0',
        width: 'auto',
        borderRadius: '10px',
        [theme.breakpoints.only('xs')]: {
            display: 'block',
            padding: '8px 0'
        }
    },
    replyListItemText: {
        margin: '0 20px'
    },
    replyListText: {
        margin: '0 20px'
    },
    reviewUser: {
        display: 'flex',
        justifyContent: 'center'
    },
    reviewField: {
        display: 'flex'
    },
    editReviewField: {
        display: 'flex',
    },
    reviewInput: {
        width: '100%',
        color: deepPurple[400],
        '& .MuiFormLabel-root.Mui-focused': {
            color: deepPurple[400]
        },
        '& .MuiInput-underline:hover:before': {
            borderBottom: '2px solid',
            borderBottomColor: deepPurple[400]
        },
        '& .MuiInput-underline:before': {
            borderBottom: '2px solid',
            borderBottomColor: deepPurple[400]
        },
        '& .MuiInput-underline:after': {
            borderBottom: '2px solid',
            borderBottomColor: deepPurple[400]
        }
    },
    showcaseImages: {
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
            display: 'flex'
        }
    },
    primaryShowcase: {
        width: '100%',
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
            width: '75%',
        }
    },
    secondaryShowcase: {
        [theme.breakpoints.down('md')]: {
            marginLeft: '5px',
            display: 'block'
        }
    },
    userAvatar: {
        margin: 'auto 5px',
        width: theme.spacing(4),
        height: theme.spacing(4),
        [theme.breakpoints.only('xs')]: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        }
    },
    editFormRoot: {
        margin: '0 10px'
    },
    tagsChip: {
        margin: '5px',
        backgroundColor: deepPurple[400],
        color: 'white'
    },
    swipeIcon: {
        fontSize: '4rem',
        margin: 'auto'
    },
    homeCarouselRoot: {
        backgroundColor: 'rgb(0, 0, 0)',
        position: 'relative',
        overflow: 'inherit'
    },
    imageList: {
        margin: '0 !important',
    },
    navButton: {
        background: 'none',
    },
    statListItem: {
        justifyContent: 'right',
        padding: '0'
    },
    usernameHeader: {
        padding: '0 10px'
    },
    priceRoot: {
        display: 'flex'
    },
    pricePrimary: {
        color: teal[400]
    },
    priceSecondary: {
        margin: 'auto 5px 5.5px',
        fontSize: '0.75rem',
        color: grey[400]
    },
    ratingProgressRoot: {
        height: 12,
        borderRadius: 10,
        margin: '5px 0'
    },
    ratingProgressColor: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    ratingProgressBar: {
        borderRadius: 5,
        backgroundColor: '#7258E9'
    },
    rootRatingText: {
        fontSize: '1.08rem',
        color: '#7258E9'
    },
    ratingText: {
        fontSize: '0.75rem',
        color: '#7258E9'
    },
    avatarGroup: {
        height: '30px',
        width: '30px',
        fontSize: '0.75rem',
        border: '0px solid #fafafa'
    },
    userChip: {
        background: 'transparent'
    },
    userChipLabel: {
        padding: '0 0 0 12px',
        color: grey[500]
    },
    fab: {
        zIndex: 1100,
        backgroundColor: grey[300],
        color: '#fff',
        margin: theme.spacing.unit,
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
        '&:hover': {
            background: grey[100],
        }
    },
    badgeRoot: {
        height: '15px',
        width: '15px',
        minWidth: '15px'
    },
    authorRoot: {
        textAlign: 'end'
    },
    authorPrimary: {
        color: grey[400]
    },
    authorSecondary: {
        color: grey[300]
    }
}))

const StoreShow = (props) => {
    const [date, setDate] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [rating, setRating] = useState(0);
    const { id } = useParams();
    const classes = useStyles();

    useEffect(async () => {
        await props.fetchStoreList();
        await props.fetchStoreItem(id);
    }, [])

    useEffect(() => {
        props.setLoader(true);
        setTimeout(() => { props.setLoader(false); console.log('loader close') }, 3000);
    }, []);

    const handleStoreClick = () => {
        props.history.push('/store');
        props.handleStoreExit()
        console.info('You clicked a breadcrumb.');
    }

    const addToCart = async (item) => {
        await props.handleAddToCart(item);
        props.fetchCartList();
    }

    return (
        <div style={{ margin: '80px 20px 20px' }}>
            <Breadcrumbs aria-label="breadcrumb" style={{ color: grey[400] }}>
                <Typography style={{ cursor: 'pointer' }} variant='body2' color="inherit" onClick={handleStoreClick}>Store</Typography>
                <Typography variant='body2' color="inherit" onClick={handleStoreClick}>{props.store.storeItemData.seller.username}</Typography>
                <Typography style={{ color: deepPurple[500] }}>{props.store.storeItemData.title}</Typography>
            </Breadcrumbs>
            <Paper elevation={2} className={classes.paperRoot}>
                <Grid container>
                    <Grid item lg={6} xs={12} className={classes.showcaseImages}>
                        <img className={classes.primaryShowcase} src={`http://localhost:4000/api/artworks/image/${props.store.storeItemData.item}`} />
                        <Grid container spacing={1} className={classes.secondaryShowcase}>
                            <Grid item lg={4} xs={12}>
                                <img src={`http://localhost:4000/api/artworks/image/${props.store.storeItemData.item}`} style={{ width: '100%', borderRadius: '10px' }} />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <img src={`http://localhost:4000/api/artworks/image/${props.store.storeItemData.item}`} style={{ width: '100%', borderRadius: '10px' }} />
                            </Grid>
                            <Grid item lg={4} xs={12}>
                                <img src={`http://localhost:4000/api/artworks/image/${props.store.storeItemData.item}`} style={{ width: '100%', borderRadius: '10px' }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={6} xs={12} style={{ padding: '15px' }}>
                        <Typography variant='h4' style={{ color: grey[300] }}>{props.store.storeItemData.title}</Typography>
                        <ListItemText
                            classes={{ root: classes.priceRoot, secondary: classes.priceSecondary }}
                            primary={<Typography variant='h6' className={classes.pricePrimary}>&#8377; {Number.parseFloat(props.store.storeItemData.price).toFixed(2)}</Typography>}
                            secondary='including shipping + taxes'
                        />
                        <Typography variant='body2' style={{ margin: '10px 0', color: grey[500] }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button variant='contained' style={{ height: 'fit-content', background: deepPurple[500], color: grey[200] }} onClick={() => addToCart(props.store.storeItemData)}>Add to Cart</Button>
                            <ListItemText
                                classes={{ root: classes.authorRoot, primary: classes.authorPrimary, secondary: classes.authorSecondary }}
                                primary={
                                    <Chip
                                        // style={{ background: 'transparent' }}
                                        classes={{ root: classes.userChip, label: classes.userChipLabel }}
                                        avatar={
                                            <Avatar>
                                                <img style={{ width: '100%' }} src={UserIcon} />
                                            </Avatar>
                                        }
                                        label={props.store.storeItemData.seller.username}
                                    />}
                                secondary={'Posted on ' + moment(props.store.storeItemData.createdAt).toDate().toLocaleString()}
                            />
                        </div>
                        <Paper elevation='3' style={{ padding: '10px', background: '#323232' }}>
                            <List>
                                <ListItem style={{ color: grey[300], padding: '0 16px' }}>
                                    <Typography variant='h6'>Customer Reviews</Typography>
                                </ListItem>
                                <ListItem style={{ display: 'block', paddingTop: 0 }}>
                                    <Box display="flex">
                                        <Box mr={1}>
                                            <Rating
                                                emptySymbol={<StarBorderIcon style={{ color: '#7258E9' }} />}
                                                fullSymbol={<StarIcon style={{ color: '#7258E9' }} />}
                                                fractions={2}
                                                initialRating={4.5}
                                                onClick={rate => console.log('test rating', rate)}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" color="textSecondary" className={classes.rootRatingText}>4.5 out of 5</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Box width="100%" mr={1}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={80}
                                                classes={{
                                                    root: classes.ratingProgressRoot,
                                                    colorPrimary: classes.ratingProgressColor,
                                                    bar: classes.ratingProgressBar
                                                }}
                                            />
                                        </Box>
                                        <Box minWidth={45}>
                                            <Typography variant="body2" color="textSecondary" className={classes.ratingText}>5 stars</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Box width="100%" mr={1}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={60}
                                                classes={{
                                                    root: classes.ratingProgressRoot,
                                                    colorPrimary: classes.ratingProgressColor,
                                                    bar: classes.ratingProgressBar
                                                }}
                                            />
                                        </Box>
                                        <Box minWidth={45}>
                                            <Typography variant="body2" color="textSecondary" className={classes.ratingText}>4 stars</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Box width="100%" mr={1}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={40}
                                                classes={{
                                                    root: classes.ratingProgressRoot,
                                                    colorPrimary: classes.ratingProgressColor,
                                                    bar: classes.ratingProgressBar
                                                }}
                                            />
                                        </Box>
                                        <Box minWidth={45}>
                                            <Typography variant="body2" color="textSecondary" className={classes.ratingText}>3 stars</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Box width="100%" mr={1}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={10}
                                                classes={{
                                                    root: classes.ratingProgressRoot,
                                                    colorPrimary: classes.ratingProgressColor,
                                                    bar: classes.ratingProgressBar
                                                }}
                                            />
                                        </Box>
                                        <Box minWidth={45}>
                                            <Typography variant="body2" color="textSecondary" className={classes.ratingText}>2 stars</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Box width="100%" mr={1}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={80}
                                                classes={{
                                                    root: classes.ratingProgressRoot,
                                                    colorPrimary: classes.ratingProgressColor,
                                                    bar: classes.ratingProgressBar
                                                }}
                                            />
                                        </Box>
                                        <Box minWidth={45}>
                                            <Typography variant="body2" color="textSecondary" className={classes.ratingText}>1 star</Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                                <ListItem>
                                    <AvatarGroup max={4} spacing='medium' classes={{ avatar: classes.avatarGroup }}>
                                        <Avatar alt="Remy Sharp" src="https://randomuser.me/api/portraits/women/47.jpg" />
                                        <Avatar alt="Travis Howard" src="https://randomuser.me/api/portraits/women/47.jpg" />
                                        <Avatar alt="Cindy Baker" src="https://randomuser.me/api/portraits/women/47.jpg" />
                                        <Avatar alt="Agnes Walker" src="https://randomuser.me/api/portraits/women/47.jpg" />
                                        <Avatar alt="Trevor Henderson" src="https://randomuser.me/api/portraits/women/47.jpg" />
                                    </AvatarGroup>
                                    <Divider orientation="vertical" flexItem style={{ margin: '0 10px', background: grey[400] }} />
                                    <Typography variant='subtitle2' style={{ color: grey[400] }}>6969 total ratings</Typography>
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid >
                </Grid >
            </Paper >
            {!props.common.cartOpen ?
                <Tooltip Tooltip title="Cart" aria-label="add" onClick={props.handleCartOpen} style={{ borderRadius: '15px' }}>
                    <Fab className={classes.fab} >
                        <Badge badgeContent={props.common.user.cart_count} color="secondary" classes={{ badge: classes.badgeRoot }}>
                            <ShoppingCartIcon style={{ color: deepPurple['A700'] }} />
                        </Badge>
                    </Fab>
                </Tooltip>
                :
                ''
            }
            <Cart
                open={props.common.cartOpen}
                cartList={props.common.user.cart}
                handleClose={props.handleCartClose}
            />
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    store: state.store,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader,
    fetchStoreList,
    fetchCartList,
    fetchStoreItem,
    handleStoreExit,
    handleAddToCart,
    handleCartOpen,
    handleCartClose,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StoreShow));
