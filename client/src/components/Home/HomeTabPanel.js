import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Typography, ImageList, InputBase, ListItem, ListItemAvatar, ListItemText, Avatar, ImageListItem, ImageListItemBar, IconButton, Paper, Tabs, Tab, FormControl, Select } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import PropTypes from 'prop-types';
import { grey, deepPurple } from '@material-ui/core/colors';

import { getTags } from '../../store/actions/common.actions';
import { fetchArtworkList, handleTabChange } from '../../store/actions/explore.actions';

const useStyles = makeStyles((theme) => ({
    panelRoot: {
        marginTop: '50px',
        padding: '20px'
    },
    exploreGrid: {
        columnGap: '8px',
        overflowY: 'auto',
        listStyle: 'none',
        columnCount: '4',
        [theme.breakpoints.only('md')]: {
            columnCount: '3'
        },
        [theme.breakpoints.down('sm')]: {
            columnCount: '2'
        }
    },
    imageList: {
        width: '100%',
        backgroundColor: 'rgb(29, 29, 31)',
    },
    imageItem: {
        width: '100%',
        '&:hover div#itemBar': {
            display: 'flex'
        }
    },
    imageSrc: {
        borderRadius: '2px',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        transform: 'none'
    },
    imageBar: {
        display: 'none',
        background: 'rgba(0, 0, 0, 0.5)',
        height: '100%',
        cursor: 'pointer'
    },
    imageBarTitle: {
        fontFamily: 'CaviarDreams',
        color: grey[300],
        position: 'absolute',
        fontWeight: 'bold',
        margin: 0,
        width: '100%',
        bottom: 0,
        padding: '5px',
        backgroundImage: 'linear-gradient(180deg, rgba(6,7,13,0) 0, black 80%, black)',
    },
    imageBarActions: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    explorePaper: {
        padding: '2px'
    },
    exploreImage: {
        objectFit: 'cover',
        width: '100%',
        height: '100%'
    },
    itemRoot: {
        padding: 0
    },
    itemAvatar: {
        minWidth: '30px'
    },
    itemUserAvatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        backgroundColor: 'transparent',
        borderRadius: 0
    },
    itemUsername: {
        color: grey[300],
        fontSize: '0.75rem'
    },
    fab: {
        margin: theme.spacing.unit,
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3
    },
    tabsRoot: {
        backgroundColor: 'rgb(51, 51, 54)',
    },
    tabsIndicator: {
        top: '0px',
        backgroundColor: deepPurple[200],
    },
    tabRoot: {
        textTransform: 'none',
        color: '#fff',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(4),
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
        '&:hover': {
            color: deepPurple[200],
            opacity: 1,
        },
        '&$selected': {
            color: deepPurple[500],
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: deepPurple[500],
        },
    },
    selectedTab: {
        color: deepPurple[200],
    },
    tabSortSelect: {
        color: '#f7f5f5',
        "&:not([multiple]) option": {
            color: deepPurple[500],
            backgroundColor: grey[200],
        }
    },
    tabSortRoot: {
        display: 'flex',
        backgroundColor: 'rgb(51, 51, 54)',
        // padding: '0 40px'
    },
    tabSortForm: {
        margin: 'auto',
        padding: '5px'
    },
    tabSortInput: {
        borderRadius: 4,
        position: 'relative',
        border: '1px solid',
        borderColor: deepPurple[500],
        backgroundColor: deepPurple[500],
        fontSize: 16,
        padding: '5px 20px 5px 6px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            backgroundColor: deepPurple[500],
            borderRadius: 4,
            borderColor: deepPurple[600],
        },
    },
    tabSortOption: {
        background: deepPurple[500],

    },
    infoIcon: {
        padding: '5px',
        color: 'rgba(255, 255, 255, 0.5)'
    },
    socialIcon: {
        fontSize: '1rem',
        marginRight: '2.5px'
    },
    statsButtonText: {
        fontSize: '0.75rem',
        marginTop: '-2px'
    }
}))

const HomeTabPanelContent = (props) => {
    const { value, index } = props;
    const classes = useStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            style={{ width: '100%' }}
        >
            {value === index && (
                <div>
                    <ImageList cols={props.width === 'sm' ? 4 : props.width === 'xs' ? 2 : 6} className={classes.imageList}>
                        {props.artworkList.filter(item => item.tags.includes(props.tags[index]) === true).map((artwork, index) => (
                            <ImageListItem key={index} className={classes.imageItem} onClick={() => props.history.push({ pathname: `/explore/${artwork._id}`, state: { artwork_id: artwork._id } })}>
                                <img id='itemImg' className={classes.imageSrc} src={`http://localhost:4000/api/artworks/image/${artwork.filename}`} alt={artwork.title} />
                                <ImageListItemBar
                                    id='itemBar'
                                    className={classes.imageBar}
                                    classes={{ root: classes.imageBar, titleWrap: classes.imageBarTitle, actionIcon: classes.imageBarActions }}
                                    title={artwork.title}
                                    subtitle={
                                        <ListItem disableGutters className={classes.itemRoot}>
                                            <ListItemAvatar className={classes.itemAvatar}>
                                                <Avatar className={classes.itemUserAvatar}>
                                                    <img style={{ width: '100%' }} src={`http://localhost:4000/api/users/image/${artwork.author.avatar.icon}`} />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText classes={{ secondary: classes.itemUsername }} secondary={'#' + artwork.author.username} />
                                        </ListItem>
                                    }
                                    actionIcon={
                                        <div style={{ background: grey[300], borderRadius: '0 0 0px 5px' }}>
                                            <IconButton disabled aria-label={`info about ${artwork.title}`} style={{ color: deepPurple[500] }} className={classes.infoIcon}>
                                                <FavoriteIcon className={classes.socialIcon} />
                                                <Typography className={classes.statsButtonText} variant="subtitle2">{new Intl.NumberFormat('en-GB', { notation: 'compact', compactDisplay: 'short' }).format(artwork.likes.length)}</Typography>
                                            </IconButton>
                                            <br />
                                            <IconButton disabled aria-label={`info about ${artwork.title}`} style={{ color: deepPurple[500] }} className={classes.infoIcon}>
                                                <ChatBubbleIcon className={classes.socialIcon} />
                                                <Typography className={classes.statsButtonText} variant="subtitle2">{new Intl.NumberFormat('en-GB', { notation: 'compact', compactDisplay: 'short' }).format(artwork.comment_count)}</Typography>
                                            </IconButton>
                                        </div>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </div>
            )}
        </div >
    )
}

function tabProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const HomeTabPanel = (props) => {
    const [tabValue, setTabValue] = useState(0);
    const [tabSort, setTabSort] = useState(2);
    const classes = useStyles();
    const handleTabsChange = (event, updatedTab) => {
        setTabValue(updatedTab);
    }
    const handleSortSelect = (event) => {
        console.log('SORT SELECTED', event.target.options[event.target.selectedIndex].value, event.target.options[event.target.selectedIndex].text);
        setTabSort(event.target.options[event.target.selectedIndex].value);
        props.handleTabChange(event.target.options[event.target.selectedIndex].text);
    }
    useEffect(() => {
        props.fetchArtworkList();
        props.getTags();
    }, []);
    return (
        <div>
            <Paper >
                <Grid container>
                    <Grid item sm={10} xs={6}>
                        <Tabs
                            classes={{
                                root: classes.tabsRoot,
                                indicator: classes.tabsIndicator
                            }}
                            value={tabValue}
                            onChange={handleTabsChange}
                            variant="scrollable"
                            scrollButtons="on"
                            textColor="inherit"
                            aria-label="scrollable force tabs example"
                        >
                            {props.common.tags.map((tabData, index) => (
                                <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label={tabData} {...tabProps(index)} />
                            ))}
                        </Tabs>
                    </Grid>
                    <Grid item sm={2} xs={6} className={classes.tabSortRoot}>
                        <FormControl size='small' className={classes.tabSortForm} >
                            <Select
                                native
                                id="demo-customized-select-native"
                                value={tabSort}
                                onChange={handleSortSelect}
                                classes={{ select: classes.tabSortSelect }}
                                input={<InputBase classes={{
                                    root: classes.tabSort, input: classes.tabSortInput,
                                }} />}
                            >
                                <option className={classes.tabSortOption} value={1}>Latest</option>
                                <option className={classes.tabSortOption} value={2}>Trending</option>
                                <option className={classes.tabSortOption} value={3}>Rising</option>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {props.common.tags.map((tabData, index) => (
                    <HomeTabPanelContent value={tabValue} index={index} history={props.history} width={props.width} artworkList={props.explore.artworkList} tags={props.common.tags} user={props.user}>
                        {tabData}
                    </HomeTabPanelContent>
                ))}
            </Paper>
        </div >
    )
}

HomeTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const mapStateToProps = (state, props) => ({
    explore: state.explore,
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    getTags,
    fetchArtworkList,
    handleTabChange
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomeTabPanel))
