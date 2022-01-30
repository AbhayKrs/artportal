import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    exploreImage: {
        objectFit: 'cover',
        width: '100%',
        height: '100%'
    }
}));

const Layout = props => {
    const columnWrapper = {};
    const gap = 0;
    const result = [];

    const [columns, setColumns] = useState(5);

    useEffect(() => {
        if (window.innerWidth < 376) {
            setColumns(1);
        } else if (window.innerWidth <= 925) {
            setColumns(3);
        }
        const handleResize = () => {
            console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
            if (window.innerWidth <= 925) {
                setColumns(3);
            } else if (window.innerWidth < 376) {
                setColumns(1);
            } else {
                setColumns(5);
            }
        }
        window.addEventListener("resize", handleResize);
    })

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

const Masonry = props => {
    const classes = useStyles();
    return (
        <Layout>
            {props.imageList.map((image, index) => (
                <img
                    id={index}
                    onClick={() => { props.history.push({ pathname: `/explore/${image._id}`, state: { artwork_id: image._id } }); window.scroll(0, 0) }}
                    className={classes.exploreImage}
                    id={image._id}
                    src={`http://localhost:5000/api/artworks/image/${image.filename}`}
                />
            ))}
        </Layout>
    )
}

Layout.propTypes = {
    columns: PropTypes.number.isRequired,
    gap: PropTypes.number.isRequired,
    children: PropTypes.arrayOf(PropTypes.element),
};

export default Masonry;
