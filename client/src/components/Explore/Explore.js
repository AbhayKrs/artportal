import React, { Fragment, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, List, ListItem, Paper, Tooltip, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { deepPurple } from '@material-ui/core/colors';

import { fetchArtworkList, handleDialogOpen, handleDialogClose } from '../../store/actions/explore.actions';
import { setLoader, handleHeaderDialogOpen, handleHeaderDialogClose } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '50px',
        padding: '20px',
    },
    exploreGrid: {
        margin: '65px 0 0',
        backgroundColor: 'rgb(29, 29, 31)'
    },
    exploreGridItem: {
        height: 'auto',
        display: 'table',
        position: 'relative',
        lineHeight: '0',
        listStyle: 'none',
        padding: '4px 0',
        pageBreakInside: 'avoid',
        breakInside: 'avoid-column'
    },
    exploreImage: {
        // borderRadius: '2px',
        objectFit: 'cover',
        width: '100%',
        height: '100%',
    },
    fab: {
        backgroundColor: deepPurple[500],
        color: '#fff',
        margin: theme.spacing.unit,
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        left: theme.spacing.unit * 3,
        '&:hover': {
            color: deepPurple[700],
        }
    }
}))

const MasonryLayout = props => {
    const columnWrapper = {};
    const gap = 0;
    const result = [];

    const [columns, setColumns] = useState(5);

    useEffect(() => {
        if (window.innerWidth < 376) {
            setColumns(1);
        } else if (window.innerWidth <= 768) {
            setColumns(3);
        }
        const handleResize = () => {
            console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
            if (window.innerWidth < 768) {
                setColumns(3);
            } else if (window.innerWidth < 376) {
                setColumns(1);
            } else {
                setColumns(5);
            }
        }
        window.addEventListener("resize", handleResize);
        console.log('hi')
    }, [])

    // create columns
    for (let i = 0; i < columns; i++) {
        columnWrapper[`column${i}`] = [];
    }
    // divide children into columns
    for (let i = 0; i < props.children.length; i++) {
        const columnIndex = i % columns;
        columnWrapper[`column${columnIndex}`].push(
            <div style={{ marginBottom: `${gap}px`, fontSize: '0', lineHeight: '0' }}>
                {props.children[i]}
            </div>
        );
    }

    // wrap children in each column with a div
    for (let i = 0; i < columns; i++) {
        result.push(
            <div style={{ marginLeft: `${i > 0 ? gap : 0}px`, flex: 1 }}>
                {columnWrapper[`column${i}`]}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
            {result}
        </div>
    )
}

MasonryLayout.propTypes = {
    columns: PropTypes.number.isRequired,
    gap: PropTypes.number.isRequired,
    children: PropTypes.arrayOf(PropTypes.element),
};


const Explore = (props) => {
    useEffect(() => {
        props.setLoader(true);
        setTimeout(() => { props.setLoader(false); console.log('loader close') }, 5000);
        props.fetchArtworkList();
        console.log(props.exploreData)
    }, []);
    const classes = useStyles();
    return (
        <div className={classes.exploreGrid}>
            <MasonryLayout className={classes.layout}>
                {props.explore.artworkList.map((artwork, index) => (
                    <img
                        onClick={() => { props.history.push({ pathname: `/explore/${artwork._id}`, state: { artwork_id: artwork._id } }); window.scroll(0, 0) }}
                        className={classes.exploreImage}
                        id={artwork._id}
                        src={`http://localhost:4000/api/artworks/image/${artwork.filename}`}
                    />
                ))}
            </MasonryLayout>
            {
                props.common.isAuthenticated === true ? <Tooltip title="Upload" aria-label="add" onClick={() => props.history.push('/upload')}>
                    <Fab className={classes.fab} >
                        <AddIcon />
                    </Fab>
                </Tooltip> : ''
            }
        </div >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    explore: state.explore,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setLoader,
    fetchArtworkList,
    handleDialogOpen,
    handleDialogClose,
    handleHeaderDialogOpen,
    handleHeaderDialogClose
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Explore));