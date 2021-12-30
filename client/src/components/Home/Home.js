import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Header from '../Header/Header';
import { makeStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { ImageList, ImageListItem, ImageListItemBar, Zoom, Fab, Toolbar, useScrollTrigger, AppBar, Grid, Tabs, Tab, Paper, Box, ListItemText, Typography, } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PropTypes from 'prop-types';
import { deepPurple } from '@material-ui/core/colors';
import HomeTabPanel from './HomeTabPanel';
import Carousel from 'react-material-ui-carousel';

import { setLoader } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    homeRoot: {
        // backgroundColor: 'rgb(29, 29, 31)',
    },
    homeGrid: {
        backgroundColor: 'rgb(29, 29, 31)'
    },
    homeCarouselRoot: {
        backgroundColor: 'rgb(29, 29, 31)',
        position: 'relative',
    },
    imageList: {
        margin: '0 !important',
    },
    zoomRoot: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    scrollTop: {
        backgroundColor: deepPurple[500],
        '&:hover': {
            backgroundColor: deepPurple[500],
        },
    },
    featuredMagazineGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        padding: '5px'
    },
    featuredMagazineGridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.6)',
            borderRadius: '20px'
        },
    },
    featuredMagazineGridItem: {
        position: 'relative',
    },
    featuredMagazineImage: {
        width: '100%',
    },
    featuredMagazineText: {
        position: 'relative',
        width: '100%',
        bottom: '95px',
        background: 'rgba(0, 0, 0, 0.2)'
    },
    navButton: {
        backgroundColor: 'rgb(51, 51, 54)',
        borderRadius: '5px',
        opacity: '1',
        width: '40px',
        height: '40px',
        color: deepPurple[300],
        margin: '0',
        top: 'calc(50% - 40px) !important',
        '&:hover': {
            '& $button': {
                backgroundColor: "rgb(43, 43, 46)",
                filter: "brightness(120%)",
                opacity: '1 !important'
            }
        }
    },
}));

function ScrollTop(props) {
    const { children, window } = props;
    const classes = useStyles();
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-anchor'
        );
        if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <Zoom in={trigger}>
            <div
                onClick={handleClick}
                role='presentation'
                className={classes.zoomRoot}
            >
                {children}
            </div>
        </Zoom>
    );
}
ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

const tileData = [
    {
        id: '0',
        img: 'https://images.unsplash.com/photo-1589637458063-7b054f0c18ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
        title: 'Lets test some title with a longer length',
        author: 'author',
    },
    {
        id: '1',
        img: 'https://images.unsplash.com/photo-1584804738473-a49b7441c464?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=675&q=80',
        title: 'Image2',
        author: 'author',
    },
    {
        id: '2',
        img: 'https://images.unsplash.com/photo-1569154076682-4c0466623ec2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
        title: 'Image3',
        author: 'author',
    },
    {
        id: '3',
        img: 'https://images.unsplash.com/photo-1615999331294-30d2047148be?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        title: 'Image4',
        author: 'author',
    },
    {
        id: '4',
        img: 'https://images.unsplash.com/photo-1557243962-5a60796cd474?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
        title: 'Image5',
        author: 'author',
    },
    {
        id: '5',
        img: 'https://images.unsplash.com/photo-1505569127510-bde1536937bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        title: 'Image6',
        author: 'author',
    },
    {
        id: '6',
        img: 'https://images.unsplash.com/photo-1590225472433-e20c5d118c60?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=966&q=80',
        title: 'Image4',
        author: 'author',
    },
    {
        id: '7',
        img: 'https://images.unsplash.com/photo-1599252441131-5aafffcf7740?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        title: 'Image5',
        author: 'author',
    },
    {
        id: '8',
        img: 'https://images.unsplash.com/photo-1537884444401-d79ef2b2990d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=675&q=80',
        title: 'Image6',
        author: 'author',
    }
]

const Home = (props) => {
    useEffect(() => {
        props.setLoader(true);
        setTimeout(() => { props.setLoader(false); console.log('loader close') }, 3000);
    }, []);

    const classes = useStyles();
    const sliderItems = tileData.length > 4 ? 4 : tileData.length;
    const sliderContent = [];
    {
        tileData.map((item, i) => {
            if (i % sliderItems === 0) {
                sliderContent.push(
                    <ImageList rowHeight={200} className={classes.imageList} cols={4}>
                        {tileData.slice(i, i + sliderItems).map((tile, index) => {
                            return (
                                <ImageListItem key={tile.img}>
                                    <img style={{ width: '100%' }} src={tile.img} alt={tile.title} />
                                    <ImageListItemBar
                                        title={tile.title}
                                        subtitle={tile.author}
                                        classes={{
                                            root: classes.titleBar,
                                            title: classes.title,
                                        }}
                                    />
                                </ImageListItem>
                            )
                        })
                        }
                    </ImageList >
                )
            }
        })
    }

    return (
        <Grid container className={classes.homeRoot}>
            <Header />
            <Toolbar id='back-to-top-anchor' />
            <Grid item className={classes.homeGrid}>
                <Carousel
                    autoPlay={false}
                    className={classes.homeCarouselRoot}
                    navButtonsProps={{
                        className: classes.navButton
                    }}
                    indicatorContainerProps={{
                        style: {
                            marginTop: 0
                        }
                    }}
                >
                    {sliderContent}
                </Carousel>
            </Grid>
            <Grid item xs={12}>
                <HomeTabPanel width={props.width} />
            </Grid>
            <ScrollTop ScrollTop {...props}>
                <Fab
                    className={classes.scrollTop}
                    color='secondary'
                    size='small'
                    aria-label='scroll back to top'
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop >
        </Grid >
    );
}

const mapStateToProps = (state, props) => ({
    common: state.common,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader
}, dispatch);

export default withWidth()(connect(mapStateToProps, mapDispatchToProps)(withRouter(Home)));
