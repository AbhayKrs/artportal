import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { show, showTitle, InputAdornment, Chip, Typography, Grid, Box, IconButton, FormControl, Tooltip, Fab, Paper, Badge, Divider, TextField, ListItemSecondaryAction, Avatar, List, ListItem, ListItemAvatar, ListItemText, Card, CardContent, CardMedia, Menu, MenuItem, ListSubheader, ImageList } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { fetchArtwork, handleLikeArtwork, handleDislikeArtwork } from '../../store/actions/explore.actions';

function Notification(props) {
    useEffect(() => {
        props.fetchArtwork('610ab8a7cb9664258c5cb62b');
    }, [])

    const handleLike = async (likes) => {
        if (likes.includes(props.common.user.id)) {
            console.log('false');
            await props.handleDislikeArtwork('610ab8a7cb9664258c5cb62b', false);
        } else {
            console.log('true');
            await props.handleLikeArtwork('610ab8a7cb9664258c5cb62b', true);
        }
        props.fetchArtwork('610ab8a7cb9664258c5cb62b');
    }

    return (
        <div style={{ margin: '100px' }}>
            <IconButton onClick={() => handleLike(props.explore.artworkData.likes)}>
                <VisibilityIcon />
            </IconButton>
        </div>
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    explore: state.explore,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchArtwork,
    handleLikeArtwork,
    handleDislikeArtwork,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Notification));