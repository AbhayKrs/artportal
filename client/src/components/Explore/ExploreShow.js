import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { show, showTitle, InputAdornment, Chip, Typography, Grid, Box, IconButton, FormControl, Tooltip, Fab, Paper, Badge, Divider, TextField, ListItemSecondaryAction, Avatar, List, ListItem, ListItemAvatar, ListItemText, Card, CardContent, CardMedia, Menu, MenuItem, ListSubheader, ImageList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ShareIcon from '@material-ui/icons/Share';
import PersonIcon from '@material-ui/icons/Person';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ReplyIcon from '@material-ui/icons/Reply';
import ReplyRoundedIcon from '@material-ui/icons/ReplyRounded';
import SendIcon from '@material-ui/icons/Send';
import UserIcon from '../../assets/images/panda.png';
import AwardIcon from '../../assets/images/award_2.png';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { grey, deepPurple, teal } from '@material-ui/core/colors';
import Carousel from 'react-material-ui-carousel';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import VisibilityIcon from '@material-ui/icons/Visibility';
import moment from 'moment';

import darkHeart2 from '../../assets/images/darkHeart_transparent3.png';
import { fetchArtworkList, fetchArtwork, handleLikeArtwork, handleDislikeArtwork, handleAddComment, handleEditComment, handleDeleteComment } from '../../store/actions/explore.actions';

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
        margin: 'auto',
        [theme.breakpoints.down('md')]: {
            display: 'block'
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
    // imgGrid: {
    //     alignSelf: 'center',
    // },
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
    likeButton: {
        color: deepPurple[400],
        position: 'absolute',
        zIndex: 1,
        top: 65,
        [theme.breakpoints.up('lg')]: {
            right: 637
        },
        right: 0
    },
    showHeader: {
        padding: '10px 10px 0',
        position: '-webkit-sticky',
        position: 'sticky',
        top: '0',
    },
    showTitle: {
        padding: '0 10px',
        color: grey[200]
    },
    showDesc: {
        padding: '0 10px',
        width: '100%',
        color: grey[600],
        wordBreak: 'break-all'
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
    commentForm: {
        margin: '5px',
        listStylePosition: 'inside'
    },
    editCommentForm: {
        listStylePosition: 'inside'
    },
    editButton: {
        padding: 0,
        color: deepPurple[500],
        '&:hover': {
            background: 'none'
        }
    },
    commentList: {
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
    commentListHeader: {
        paddingBottom: '10px',
        top: '-4px',
        background: '#2a2a2a',
        borderRadius: '10px',
        boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 3px 2px 4px 0px rgb(0 0 0 / 10%), 3px 2px 8px 0px rgb(0 0 0 / 10%)'
    },
    commentListItem: {
        background: '#2a2a2a',
        margin: '5px 0',
        borderRadius: '10px',
        // padding: '8px',
        [theme.breakpoints.only('xs')]: {
            display: 'block',
            padding: '8px 0'
        }
    },
    replyListRoot: {
        width: '95%',
        marginLeft: 'auto',
        borderLeft: '2px solid #eeeeee'
    },
    commentListItemText: {
        margin: '0 20px',
        display: 'flex',
        alignItems: 'center'
    },
    commentListItemTextPrimary: {
        maxWidth: '360px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: grey[200]
    },
    commentListItemTextSecondary: {
        marginLeft: '5px',
        color: '#a19f9f',
        fontSize: '11px'
    },
    commentListText: {
        margin: '0 20px',
        // display: 'flex',
        alignItems: 'center',
    },
    replyListItemText: {
        margin: '0 20px'
    },
    replyListText: {
        margin: '0 20px'
    },
    commentUser: {
        display: 'flex',
        justifyContent: 'center'
    },
    commentField: {
        display: 'flex'
    },
    editCommentField: {
        display: 'flex',
    },
    commentInput: {
        width: '100%',
        color: deepPurple[400],
        margin: '0 12px',
        '& .MuiFormLabel-root': {
            color: grey[50]
        },
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
        color: '#d5d5d5'
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
    userChip: {
        background: 'transparent'
    },
    userChipLabel: {
        padding: '0 0 0 12px',
        color: grey[400]
    },
    iconButton: {
        color: deepPurple[300]
    },
    heartIcon: {
        width: '225px',
        height: '225px',
        position: 'absolute',
        marginTop: '10px',
        // transform: 'translate(-90%, -75%)',
        background: `url(${darkHeart2}) no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: '-55px 0',
        cursor: 'pointer',
        animation: 'fave-heart 1s steps(1)',
    },
    heartIconClicked: {
        width: '225px',
        height: '225px',
        position: 'absolute',
        marginTop: '10px',
        // transform: 'translate(-90%, -75%)',
        background: `url(${darkHeart2}) no-repeat`,
        backgroundSize: 'cover',
        cursor: 'pointer',
        animation: 'fave-heart 1s steps(29)',
        backgroundPosition: '-8795px 0',
        transition: 'background 1s steps(29)',
    }
}));

const CommentList = (props) => {
    const classes = useStyles();
    const [editForm, setEditForm] = useState('');
    const [editIndex, setEditIndex] = useState('');
    const [editComment, setEditComment] = useState('');
    const [replyOpen, setReplyOpen] = useState('');

    const onDeleteComment = async (comment) => {
        await props.handleDeleteComment(props.artworkId, comment._id);
        props.fetchArtwork(props.artworkId);
    }
    const onEditComment = async (comment) => {
        await props.handleEditComment(editComment, props.artworkId, comment._id);
        setEditForm(false);
        props.fetchArtwork(props.artworkId);
        return false;
    }

    return (
        <div>
            {props.comments.map((comment, index) => (
                <div>
                    <ListItem style={{ display: 'block' }} key={index} className={classes.commentListItem} disableGutters>
                        <div style={{ display: 'flex', margin: '0 8px', alignItems: 'center' }}>
                            <ListItemAvatar>
                                <Chip
                                    classes={{ root: classes.userChip, label: classes.userChipLabel }}
                                    avatar={
                                        <Avatar>
                                            <img style={{ width: '100%' }} src={UserIcon} />
                                        </Avatar>
                                    }
                                    label={comment.author.username}
                                />
                            </ListItemAvatar>
                            {editForm && index === editIndex ?
                                <ListItemText
                                    edge="end"
                                    classes={{ root: classes.commentListItemText, primary: classes.commentListItemTextPrimary, secondary: classes.commentListItemTextSecondary }}
                                    primary={
                                        <FormControl className={classes.editCommentForm}>
                                            <Grid container spacing={1} alignItems="flex-end">
                                                <Grid item className={classes.editCommentField} xs={12}>
                                                    <TextField
                                                        id="standard-basic"
                                                        fullWidth
                                                        value={editComment}
                                                        onChange={(event) => setEditComment(event.target.value)}
                                                        className={classes.commentInput}
                                                        onKeyPress={(ev) => {
                                                            if (ev.key === 'Enter') {
                                                                ev.preventDefault();
                                                                onEditComment(comment)
                                                            }
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" onClick={() => onEditComment(comment)}>
                                                                    <SendIcon fontSize='small' style={{ color: deepPurple[300] }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                    {/* <IconButton className={classes.editButton} fontSize='small'>
                                                        <SendIcon />
                                                    </IconButton> */}
                                                </Grid>
                                            </Grid>
                                        </FormControl>
                                    }
                                    secondary={'- ' + moment(comment.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                                />
                                :
                                <ListItemText
                                    edge="end"
                                    classes={{ root: classes.commentListText, primary: classes.commentListItemTextPrimary, secondary: classes.commentListItemTextSecondary }}
                                    primary={comment.content}
                                    secondary={'- ' + moment(comment.createdAt).fromNow()}
                                />
                            }
                            {props.common.isAuthenticated && props.common.user.id === comment.author.id ?
                                <div>
                                    {editForm && index === editIndex ?
                                        <IconButton edge="end" onClick={() => setEditForm(false)}>
                                            <CloseIcon fontSize='small' />
                                        </IconButton>
                                        :
                                        <IconButton edge="end" onClick={() => { setEditComment(comment.content); setEditForm(true); setEditIndex(index) }}>
                                            <EditIcon className={classes.iconButton} fontSize='small' />
                                        </IconButton>
                                    }
                                    <IconButton edge="end" onClick={() => onDeleteComment(comment)}>
                                        <DeleteIcon className={classes.iconButton} fontSize='small' />
                                    </IconButton>
                                </div>
                                :
                                ''
                            }
                        </div>
                    </ListItem>
                </div>
            ))}
        </div>
    )
}

const ExploreShow = (props) => {
    const [prev, setPrev] = useState('');
    const [next, setNext] = useState('');
    const [like, setLike] = useState(props.explore.artworkData.likes.filter(item => item === props.common.user.id).length > 0 ? true : false);
    const [comment, setComment] = useState('');
    const classes = useStyles();

    useEffect(async () => {
        await props.fetchArtworkList();
        props.fetchArtwork(props.history.location.state.artwork_id);
    }, [])

    const submitComment = async (event) => {
        event.preventDefault();
        await props.handleAddComment(comment, props.history.location.state.artwork_id);
        props.fetchArtwork(props.history.location.state.artwork_id);
        setComment('');
    }

    useEffect(() => {
        const len = props.explore.artworkList.length;
        props.fetchArtwork(props.history.location.state.artwork_id);
        props.explore.artworkList.forEach((item, index) => {
            if (item._id === props.explore.artworkData._id) {
                if (index > 0) {
                    setPrev(props.explore.artworkList[index - 1]._id)
                }
                if (index < len - 1) {
                    setNext(props.explore.artworkList[index + 1]._id)
                }
            }
        })
    }, [props.explore.artworkData]);

    const handleLike = async (likes) => {
        if (likes.includes(props.common.user.id)) {
            console.log('false');
            await props.handleDislikeArtwork(props.history.location.state.artwork_id, false);
        } else {
            console.log('true');
            await props.handleLikeArtwork(props.history.location.state.artwork_id, true);
        }
        props.fetchArtwork(props.history.location.state.artwork_id);
    }

    return (
        <Grid container className={classes.gridRoot} spacing={1}>
            <Grid item lg={7} xs={12} className={classes.imgGrid}>
                <IconButton className={classes.likeButton} onClick={() => { setLike(!like); handleLike(props.explore.artworkData.likes) }} fontSize='large'>
                    {like ?
                        <FavoriteIcon fontSize='large' />
                        :
                        <FavoriteBorderIcon fontSize='large' />}
                </IconButton>
                <Carousel
                    autoPlay={false}
                    indicators={false}
                    className={classes.homeCarouselRoot}
                    navButtonsAlwaysVisible={true}
                    navButtonsProps={{ className: classes.navButton }}
                    NextIcon={<ChevronRightIcon style={{ fontSize: '3rem' }} />}
                    PrevIcon={<ChevronLeftIcon style={{ fontSize: '3rem' }} />}
                    next={() => { props.history.push({ pathname: `/explore/${next}`, state: { artwork_id: next } }); props.fetchArtwork(props.history.location.state.artwork_id); }}
                    prev={() => { props.history.push({ pathname: `/explore/${prev}`, state: { artwork_id: prev } }); props.fetchArtwork(props.history.location.state.artwork_id); }}
                >
                    <img className={classes.showImage} id='img' src={`http://localhost:4000/api/artworks/image/${props.explore.artworkData.filename}`} />
                </Carousel>
            </Grid>
            <Grid item lg={5} xs={12} className={classes.gridContent}>
                <div className={classes.paperRoot}>
                    <List className={classes.commentList} disablePadding>
                        <ListSubheader className={classes.commentListHeader} disableGutters>
                            <Grid container className={classes.showHeader}>
                                <Grid item xs={9}>
                                    <Typography className={classes.showTitle} variant="h4">{props.explore.artworkData.title}</Typography>
                                    <Typography className={classes.showDesc} variant="subtitle1">{props.explore.artworkData.description}</Typography>
                                    {props.explore.artworkData.tags.map(tag => (
                                        <Chip className={classes.tagsChip} size="small" label={tag} />
                                    ))}
                                </Grid>
                                <Grid item xs={3} style={{ alignSelf: 'center' }}>
                                    <List>
                                        <ListItem disableGutters className={classes.statListItem}>
                                            {/* <div
                                                className={classes.heartIcon}
                                                onClick={(ev) => {
                                                    ev.target.className === classes.heartIcon ?
                                                        ev.target.className = classes.heartIconClicked
                                                        :
                                                        ev.target.className = classes.heartIcon;
                                                    handleLike(props.explore.artworkData.likes)
                                                }}></div> */}
                                            <IconButton className={classes.statsButton}>
                                                <ShareIcon />
                                            </IconButton>
                                            <IconButton className={classes.statsButton}>
                                                <BookmarkIcon />
                                            </IconButton>
                                            <IconButton className={classes.statsButton}>
                                                <img style={{ width: '32px', height: '32px' }} src={AwardIcon} />
                                            </IconButton>
                                        </ListItem>
                                        <ListItem disableGutters className={classes.statListItem}>
                                            <IconButton disabled style={{ color: teal[400] }} className={classes.statsButton}>
                                                <Typography className={classes.statsButtonText} variant="subtitle2">{new Intl.NumberFormat().format(props.explore.artworkData.likes.length) + ' views'}</Typography>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </ListItem>
                                        <ListItem disableGutters className={classes.statListItem}>
                                            <IconButton disabled style={{ color: deepPurple[400] }} className={classes.statsButton}>
                                                <Typography className={classes.statsButtonText} variant="subtitle2">{new Intl.NumberFormat().format(props.explore.artworkData.likes.length) + ' likes'}</Typography>
                                                <FavoriteIcon />
                                            </IconButton>
                                        </ListItem>
                                        <ListItem disableGutters className={classes.statListItem}>
                                            <IconButton disabled className={classes.disabledStatsButton}>
                                                <Typography className={classes.statsButtonText} variant="subtitle2">{new Intl.NumberFormat().format(props.explore.artworkData.comment_count) + ' comments'}</Typography>
                                                <ChatBubbleIcon />
                                            </IconButton>
                                        </ListItem>
                                        <ListItem disableGutters className={classes.statListItem}>
                                            <Typography variant="p" style={{ color: grey[200] }}>Posted by </Typography>
                                            <Chip
                                                classes={{ root: classes.userChip, label: classes.userChipLabel }}
                                                avatar={
                                                    <Avatar>
                                                        <img style={{ width: '100%' }} src={UserIcon} />
                                                    </Avatar>
                                                }
                                                label={props.explore.artworkData.author.username}
                                            />
                                        </ListItem >
                                    </List>
                                </Grid>
                            </Grid>
                            <Divider style={{ height: '3px', background: grey[400] }} />
                            <Grid style={{ marginTop: '10px' }}>
                                <div className={classes.commentField}>
                                    {/* <EditIcon fontSize='small' /> */}
                                    <TextField
                                        id="standard-basic"
                                        label={"Hey " + props.common.user.username + ", Let the artist know what you think"}
                                        fullWidth
                                        value={comment}
                                        onChange={(event) => setComment(event.target.value)}
                                        className={classes.commentInput}
                                        onKeyPress={(ev) => {
                                            if (ev.key === 'Enter') {
                                                submitComment(ev)
                                            }
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ChatBubbleIcon fontSize='small' style={{ color: deepPurple[300] }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                            </Grid>
                        </ListSubheader>
                        <div style={{ margin: '10px' }}>
                            <CommentList comments={props.explore.artworkData.comments} common={props.common} artworkId={props.history.location.state.artwork_id} fetchArtwork={props.fetchArtwork} handleAddComment={props.handleAddComment} handleEditComment={props.handleEditComment} handleDeleteComment={props.handleDeleteComment} />
                        </div>
                    </List>
                </div>
            </Grid>
        </Grid >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
    explore: state.explore,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchArtworkList,
    fetchArtwork,
    handleLikeArtwork,
    handleDislikeArtwork,
    handleAddComment,
    handleEditComment,
    handleDeleteComment
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ExploreShow));
