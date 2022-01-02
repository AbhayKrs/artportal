import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Typography, Card, CardContent, List, ListItem, ListItemText, ListItemAvatar, Button, Grid, Box, Tabs, Tab, Avatar, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { grey, deepPurple, teal, pink } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    profileRoot: {
        margin: '65px 0 0',
        backgroundImage: 'url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d14808a6-d6ac-49ac-bf38-62fa7ecd9808/ddsbe5i-e635f976-9a0f-4b45-88f7-2aaf4ab5ba22.jpg/v1/fill/w_1280,h_640,q_75,strp/alien_jungle_banner_deviantart_by_ahaas_ddsbe5i-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvZDE0ODA4YTYtZDZhYy00OWFjLWJmMzgtNjJmYTdlY2Q5ODA4XC9kZHNiZTVpLWU2MzVmOTc2LTlhMGYtNGI0NS04OGY3LTJhYWY0YWI1YmEyMi5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.S6SDvWTfBop0Rep4LqE5qNmLlJowodQCM0TptvJN_gs)',
        backgroundSize: 'contain',
        width: '100%',
        //     position: 'fixed',
    },
    profileBody: {
        width: '100%',
        position: 'relative'
    },
    profileBodyRoot: {
        marginBottom: 0,
        position: 'relative',
    },
    profileBodyBackdrop: {
        backgroundImage: 'linear-gradient(180deg, rgba(6,7,13,0) 0, black 70%, black)',
        position: 'relative',
        inset: '400px 0 0',
        width: '100%',
        height: 200,
        transform: 'translateY(-100%)'
    },
    profileTabRoot: {
        flexGrow: 1,
        position: 'relative',
        background: 'black',
        padding: '0 15px 15px'
    },
    profileTabHeader: {
        display: 'flex',
        background: 'transparent',
        padding: '20px 20px 0',
    },
    profileNamePrimary: {
        color: grey[300]
    },
    profileNameSecondary: {
        color: grey[500]
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    sellerThumbnail: {
        borderRadius: '50%',
        float: 'left',
        width: '200px',
        height: '200px',
        marginTop: '-175px'
    },
    exploreImage: {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
    },
    storeImage: {
        objectFit: 'cover',
        width: '275px',
        height: '100%',
    },
    sellerAvatar: {
        backgroundColor: '#fff',
        WebkitBorderRadius: '50%',
        borderRadius: '50%',
        top: '50%'
    },
    actionText: {
        color: deepPurple[400]
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const MasonryLayout = props => {
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

MasonryLayout.propTypes = {
    columns: PropTypes.number.isRequired,
    gap: PropTypes.number.isRequired,
    children: PropTypes.arrayOf(PropTypes.element),
};


const Profile = (props) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.profileRoot}>
            <div className={classes.profileBody}>
                <div className={classes.profileBodyRoot}>
                    <div className={classes.profileBodyBackdrop}></div>
                    <div className={classes.profileTabHeader}>
                        <ListItemText
                            style={{ zIndex: 1 }}
                            primary={<Typography variant='h2' className={classes.profileNamePrimary}>{props.user.name}</Typography>}
                            secondary={<div style={{ display: 'flex', margin: '10px 0' }}>
                                <Typography variant='h6' className={classes.profileNameSecondary}># {props.user.username}</Typography>
                                <Button variant='contained' size='small' style={{ height: 'fit-content', background: deepPurple[500], color: grey[200], margin: '0 5px 0 10px' }}>Follow</Button>
                                <Button variant='contained' size='small' style={{ height: 'fit-content', background: grey[200], color: deepPurple[500], margin: '0 5px 0 10px' }}>Message</Button>
                            </div>
                            }
                        />
                        <div style={{ zIndex: 1, textAlign: 'center' }}>
                            <Avatar className={classes.sellerThumbnail}>
                                <img src="https://randomuser.me/api/portraits/women/47.jpg" alt="" width="200" height="200" className={classes.sellerAvatar} />
                            </Avatar>
                            <Typography variant='subtitle1' style={{ zIndex: 1, color: 'white' }}>6969 Followers</Typography>
                            <Typography variant='subtitle1' style={{ zIndex: 1, color: 'white' }}>69 Following</Typography>
                            <Typography variant='subtitle1' style={{ zIndex: 1, color: 'white' }}>432 Likes</Typography>
                        </div>
                    </div>
                    <div className={classes.profileTabRoot}>
                        <Tabs
                            orientation="horizontal"
                            // variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            className={classes.tabs}
                            style={{ position: 'relative', borderRadius: '15px 15px 0 0', color: grey[400], background: '#2a2a2a' }}
                        >
                            <Tab label="Showcase" {...a11yProps(0)} />
                            <Tab label="Store" {...a11yProps(1)} />
                            <Tab label="Prizes Recieved" {...a11yProps(2)} />
                            <Tab label="Prizes Given" {...a11yProps(3)} />
                            {/* <Tab label="Item Six" {...a11yProps(5)} />
                            <Tab label="Item Seven" {...a11yProps(6)} /> */}
                        </Tabs>
                        <TabPanel style={{ width: '100%', background: '#2a2a2a' }} value={value} index={0}>
                            <div className={classes.exploreGrid}>
                                {props.user.artwork_count > 0 ?
                                    <MasonryLayout className={classes.layout}>
                                        {props.user.artworks.map((artwork, index) => (
                                            <img
                                                onClick={() => { props.history.push({ pathname: `/explore/${artwork._id}`, state: { artwork_id: artwork._id } }); window.scroll(0, 0) }}
                                                className={classes.exploreImage}
                                                id={artwork._id}
                                                src={`http://localhost:4000/api/artworks/image/${artwork.filename}`}
                                            />
                                        ))}
                                    </MasonryLayout>
                                    :
                                    ''
                                }
                            </div>
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: '#2a2a2a', borderRadius: '0 0 15px 15px' }} value={value} index={1}>
                            {props.user.store_count > 0 ?
                                <Table className={classes.table} aria-label="simple table">
                                    <TableBody>
                                        {props.user.store.map((storeItem, index) => (
                                            <TableRow key={storeItem._id} style={{ height: '200px' }}>
                                                <TableCell style={(props.user.store.length - 1) === index ? { borderBottom: 'none' } : {}} component="th" scope="row">
                                                    <img
                                                        className={classes.storeImage}
                                                        id={storeItem._id}
                                                        src={`http://localhost:4000/api/store/image/${storeItem.item}`}
                                                    />
                                                </TableCell>
                                                <TableCell style={(props.user.store.length - 1) === index ? { borderBottom: 'none' } : {}}>
                                                    <List style={{ color: grey[300] }}>
                                                        <ListItem disableGutters>
                                                            <Typography variant='h4' style={{ wordBreak: 'break-all' }}>{storeItem.title}</Typography>
                                                        </ListItem>
                                                        <ListItem disableGutters>
                                                            <Typography variant='subtitle2'>{storeItem.description}</Typography>
                                                        </ListItem>
                                                        <ListItem disableGutters>
                                                            <Typography variant='body'>Average User Rating: {Number.parseFloat(storeItem.rating).toFixed(2)}</Typography>
                                                        </ListItem>
                                                        <ListItem disableGutters>
                                                            <Typography variant='h6' className={classes.actionText}>&#8377;{Number.parseFloat(storeItem.price).toFixed(2)}</Typography>
                                                        </ListItem>
                                                        <ListItem disableGutters>
                                                            <Button variant='contained' style={{ margin: '0 5px' }}>Navigate to Listing</Button>
                                                            <Button variant='contained' color='secondary' style={{ margin: '0 5px' }}>Remove Listing</Button>
                                                        </ListItem>
                                                    </List>
                                                </TableCell>
                                                {/* <TableCell>{storeItem.title}</TableCell>
                                                <TableCell>{storeItem.description}</TableCell>
                                                <TableCell>{storeItem.seller.username}</TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                : ''}
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: '#2a2a2a', borderRadius: '0 0 15px 15px' }} value={value} index={2}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Typography variant='button' style={{ margin: 'auto' }}>test</Typography>
                            </div>
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: '#2a2a2a', borderRadius: '0 0 15px 15px' }} value={value} index={3}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Typography variant='button' style={{ margin: 'auto' }}>test</Typography>
                            </div>
                        </TabPanel>
                        {/* <TabPanel style={{ width: '100%', background: '#2a2a2a', borderRadius: '0 0 15px 15px' }} value={value} index={4}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Typography variant='button' style={{ margin: 'auto' }}>test</Typography>
                            </div>
                        </TabPanel> */}
                        {/* <TabPanel style={{ width: '100%', background: '#2a2a2a' }} value={value} index={5}>
                            Item Six
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: '#2a2a2a' }} value={value} index={6}>
                            Item Seven
                        </TabPanel> */}
                    </div>
                </div>
            </div>

        </div >
    )
}

const mapStateToProps = (state, props) => ({
    user: state.common.user,
    common: state.common,
    store: state.store
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));
