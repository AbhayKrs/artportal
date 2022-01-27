import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { InputAdornment, Chip, Typography, Grid, Button, Box, IconButton, FormControl, Tooltip, Fab, Paper, Badge, Divider, TextField, ListItemSecondaryAction, Avatar, List, ListItem, ListItemAvatar, ListItemText, Card, CardContent, CardMedia, Menu, MenuItem, ListSubheader, ImageList } from '@material-ui/core';
import { grey, deepPurple, teal, pink } from '@material-ui/core/colors';

import ShareIcon from '@material-ui/icons/Share';
import InfoIcon from '@material-ui/icons/Info';
import StarIcon from '@material-ui/icons/Star';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import storeBackground from '../../assets/images/store_background.jpg'
import Cart from './Cart';

import { fetchStoreList } from '../../store/actions/store.actions';
import { fetchCartList, handleCartOpen, handleCartClose, handleAddToCart, handleRemoveFromCart } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    storeRoot: {
        margin: '65px 0 0'
    },
    storeHeader: {
        display: 'flex',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2)), url(${storeBackground})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '300px',
        backgroundSize: 'cover'
    },
    storeHeaderContent: {
        width: '100%',
        margin: '30px'
    },
    storeGrid: {
        padding: '8px',
        width: '100%',
        margin: 0
    },
    mainTitle: {
        color: 'white',
        fontFamily: 'CaviarDreams',
        fontWeight: 'bold'
    },
    mainSubTitle: {
        color: 'white',
        fontFamily: 'CaviarDreams'
    },
    cardRoot: {
        backgroundColor: 'rgb(50, 50, 50)',
        MozBorderRadius: '4px',
        WebkitBorderRadius: '4px',
        borderRadius: '4px',
        MozBoxShadow: '0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)',
        WebkitBoxShadow: '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)',
        boxShadow: '0px 3px 3px -2px rgb(255 255 255 / 20%), 0px 3px 4px 0px rgb(255 255 255 / 14%), 0px 1px 8px 0px rgb(255 255 255 / 12%)',
        color: 'rgba(0, 0, 0, .87)',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
    },
    cardContent: {
        padding: '0',
        position: 'relative',
        paddingBottom: '150%',
        border: '2px solid rgb(50, 50, 50)'
    },
    ratingRoot: {
        background: deepPurple[500],
        borderRadius: '0 0 0px 5px',
        position: 'absolute',
        zIndex: '1',
        top: '0',
        right: '0'
    },
    infoIcon: {
        padding: '5px',
        color: grey[500]
    },
    ratingBtn: {
        padding: '5px'
    },
    ratingIcon: {
        fontSize: '1rem',
        marginRight: '2.5px',
        color: grey[300]
    },
    ratingPoint: {
        fontSize: '0.75rem',
        color: grey[300]
    },
    textBox: {
        backgroundImage: 'linear-gradient(180deg, transparent, rgb(50, 50, 50))',
        bottom: '0',
        MozBoxSizing: 'border-box',
        WebkitBoxSizing: 'border-box',
        boxSizing: 'border-box',
        padding: '0 5px 5px',
        position: 'absolute',
        width: '100%',
        zIndex: '1'
    },
    cardHeader: {
        fontFamily: 'CaviarDreams',
        fontWeight: '700',
        wordBreak: 'break-all',
        color: '#fff'
    },
    sellerRoot: {
        minHeight: '40px',
        boxSizing: 'border-box',
        padding: '0',
        color: '#fff',
        display: 'flex',
        float: 'left',
        width: '100%',
        zIndex: '100'
    },
    sellerThumbnail: {
        MozBorderRadius: '50%',
        WebkitBorderRadius: '50 % ',
        borderRadius: '50%',
        float: 'left',
        width: '40px'
    },
    sellerAvatar: {
        backgroundColor: '#fff',
        WebkitBorderRadius: '50%',
        borderRadius: '50%',
        top: '50%'
    },
    sellerHeader: {
        backgroundImage: 'none',
        width: 'auto',
        bottom: 'auto',
        display: 'grid',
        padding: '0 5px',
        margin: '0',
        top: '50%'
    },
    sellerPrimary: {
        fontSize: '1rem'
    },
    sellerSecondary: {
        color: 'rgba(255,255,255,.7)'
    },
    sellerPiece: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
    },
    actionRoot: {
        display: 'flex',
        backgroundColor: 'rgb(50, 50, 50)',
        boxSizing: 'border-box',
        padding: '0 8px 8px',
        position: 'relative',
        zIndex: '1'
    },
    actionGroup: {
        display: 'flex',
        verticalAlign: 'middle'
    },
    priceBtn: {
        color: teal[500],
        // backgroundColor: 'transparent',
        WebkitBorderRadius: '2px',
        fontFamily: 'IBM Plex Sans, sans-serif',
        fontWeight: '800',
        letterSpacing: '0.75px',
        lineHeight: '36px',
        padding: '0 4px',
    },
    endIcon: {
        marginLeft: '2px',
    },
    actionIconGroup: {
        marginLeft: 'auto'
    },
    iconBtn: {
        padding: '0'
    },
    actionIcon: {
        padding: '5px',
        color: deepPurple[500]
    },
    actionText: {
        display: 'inline',
        margin: 'auto ',
        fontWeight: '600',
        marginRight: '5px',
        color: grey[300]
    },
    actionLabel: {
        display: 'block'
    },
    uploadBtn: {
        margin: '10px 10px 10px auto',
        height: 'fit-content',
    },
    fab: {
        zIndex: 1100,
        backgroundColor: 'rgb(29, 29, 31)',
        color: '#fff',
        margin: theme.spacing.unit,
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
        '&:hover': {
            backgroundColor: 'rgb(29, 29, 31)',
        }
    }
}))

const Store = (props) => {
    const classes = useStyles();

    useEffect(() => {
        props.fetchStoreList();
        window.scrollTo(0, 0);
    }, [])

    const addToCart = async (item) => {
        await props.handleAddToCart(item);
    }

    return (
        <div className={classes.storeRoot}>
            <div className={classes.storeHeader}>
                <div className={classes.storeHeaderContent}>
                    <ListItemText
                        primary={<Typography variant='h4' className={classes.mainTitle}>Welcome to the Artyst Store</Typography>}
                        secondary={<Typography variant='body1' className={classes.mainSubTitle}>Go through the list of artworks on sale exclusively on our Store for the best offers,
                            huge discounts and trusted sellers. The Store features a total of 25,000 works and 500+ trusted and verified sellers!</Typography>}
                    />
                    <Button variant='contained' color='primary' className={classes.uploadBtn} onClick={() => props.history.push('/store/upload')}>Add to Store</Button>
                </div>
            </div>
            <Grid container spacing={1} className={classes.storeGrid}>
                {props.store.storeList.map(item =>
                    <Grid key={item._id} item lg={3} xs={4}>
                        <Card className={classes.cardRoot}>
                            <CardContent className={classes.cardContent}>
                                <div className={classes.ratingRoot} style={{}}>
                                    <IconButton disabled className={classes.ratingBtn}>
                                        <StarIcon className={classes.ratingIcon} />
                                        <Typography className={classes.ratingPoint} variant="subtitle2">{Number.parseFloat(item.rating).toFixed(1)}</Typography>
                                    </IconButton>
                                </div>
                                <div className={classes.textBox}>
                                    <Typography variant='h6' className={classes.cardHeader}>{item.title}</Typography>
                                    <ListItem disableGutters className={classes.sellerRoot}>
                                        <Avatar style={{ backgroundColor: 'transparent', borderRadius: 0 }}>
                                            <img style={{ width: '100%' }} src={`http://localhost:4000/api/users/image/${item.seller.avatar.icon}`} />
                                        </Avatar>
                                        <ListItemText
                                            className={classes.sellerHeader}
                                            primary={<Typography variant='caption' className={classes.sellerPrimary}>{item.seller.username}</Typography>}
                                            secondary={<Typography variant='caption' className={classes.sellerSecondary}>Travel Journalist</Typography>}
                                        />
                                    </ListItem>
                                </div>
                                <img src={`http://localhost:4000/api/store/image/${item.item}`} alt="" width="960" height="640" className={classes.sellerPiece} />
                            </CardContent>
                            <div className={classes.actionRoot}>
                                <div className={classes.actionGroup}>
                                    <Typography variant='body2' classes={{ root: classes.actionText, label: classes.actionLabel }} >&#8377;{Number.parseFloat(item.price).toFixed(2)}</Typography>
                                    <IconButton className={classes.priceBtn} onClick={() => addToCart(item)}>
                                        <AddCircleIcon />
                                    </IconButton >
                                </div>
                                <div className={classes.actionIconGroup}>
                                    <IconButton className={classes.iconBtn}>
                                        <ShareIcon className={classes.actionIcon} />
                                    </IconButton>
                                    <IconButton className={classes.iconBtn} onClick={() => props.history.push({ pathname: `/store/${item._id}` })}>
                                        <InfoIcon className={classes.actionIcon} />
                                    </IconButton>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                )}
            </Grid>
            {!props.common.cartOpen ?
                <Tooltip Tooltip title="Cart" aria-label="add" onClick={props.handleCartOpen} style={{ borderRadius: '15px' }}>
                    <Fab className={classes.fab} >
                        <Badge badgeContent={props.common.user.cart_count} color="primary" classes={{ badge: classes.badgeRoot }}>
                            <ShoppingCartIcon style={{ color: grey[300] }} />
                        </Badge>
                    </Fab>
                </Tooltip>
                :
                ''
            }
            {props.common.cartOpen ?
                <Cart
                    open={true}
                    cartTotal={props.common.cartTotal}
                    cartList={props.common.user.cart}
                    handleClose={props.handleCartClose}
                    fetchCartList={props.fetchCartList}
                    handleAddToCart={props.handleAddToCart}
                    handleRemoveFromCart={props.handleRemoveFromCart}
                />
                :
                ''
            }
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    store: state.store,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchStoreList,
    fetchCartList,
    handleCartOpen,
    handleCartClose,
    handleAddToCart,
    handleRemoveFromCart
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Store));