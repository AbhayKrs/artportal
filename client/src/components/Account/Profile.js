import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Typography, Card, Divider, List, ListItem, ListItemText, IconButton, Button, Grid, Box, Tabs, Tab, Avatar, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { grey, deepPurple, teal, pink } from '@material-ui/core/colors';
import { handleUploadAsset, fetchAvatars, fetchAwards, deleteUserStoreItem } from '../../store/actions/common.actions';
import TelegramIcon from '@material-ui/icons/Telegram';
import AvatarModal from './AvatarModal';
import PrizeBackground from '../../assets/images/prizeRecieved.png';
import Masonry from '../Masonry';

const useStyles = makeStyles((theme) => ({
    profileRoot: {
        margin: '65px 0 0',
        backgroundImage: 'url(https://cdnb.artstation.com/p/assets/images/images/007/952/733/small/chris-cold-dimensions2.jpg?1509544484)',
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
        backgroundImage: 'linear-gradient(180deg, rgba(6,7,13,0) 0, black 125%, black)',
        position: 'relative',
        inset: '400px 0 0',
        width: '100%',
        height: '180px',
        transform: 'translateY(-100%)'
    },
    profileTabRoot: {
        flexGrow: 1,
        position: 'relative',
    },
    profileTabHeader: {
        display: 'flex',
        background: 'transparent',
        padding: '20px 20px 0',
    },
    profileNamePrimary: {
        color: grey[300],
        fontSize: '4rem',
        lineHeight: 'inherit',
        fontFamily: 'AntipastoProRegular'
    },
    profileNameSecondary: {
        color: grey[500]
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        borderRadius: '15px 15px 0 0',
        color: grey[400],
        background: 'transparent',
        height: '45px',
        placeItems: 'end',
        padding: '0 5px'
    },
    tabRoot: {
        minWidth: '80px',
        textTransform: 'capitalize',
        borderRadius: '20px',
        minHeight: 'auto'
        // background: 'white'
    },
    selectedTab: {
        borderRadius: '10px 10px 0 0',
        background: grey[800],
        color: grey[200]
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
        maxWidth: '100%',
        maxHeight: '100%',
        paddingTop: '5px'
    },
    sellerAvatar: {
        float: 'left',
        width: '200px',
        height: '200px',
        marginTop: '-175px',
        top: '50%'
    },
    actionText: {
        color: deepPurple[400],
        marginRight: '3px'
    },
    listItem: {
        padding: '4px 0'
    },
    prizeRecieved: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundImage: `url('${PrizeBackground}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
    }
}));

const TabPanel = (props) => {
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

const Profile = (props) => {
    const classes = useStyles();
    const [avatarModal, setAvatarModal] = useState(false);
    const [file, setFile] = useState('');
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        props.fetchAvatars();
        props.fetchAwards();
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDialogClose = () => {
        setAvatarModal(false);
    }

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    }

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);
        props.handleUploadAsset(formData);
        setTimeout(() => {
            props.fetchAwards();
            props.fetchAvatars()
        }, 3000)
    }

    const removeStoreListing = (storeID) => {
        console.log('storeitem', storeID)
        props.deleteUserStoreItem(storeID);
    }

    return (
        <div className={classes.profileRoot}>
            <div className={classes.profileBody}>
                <div className={classes.profileBodyRoot}>
                    <div className={classes.profileBodyBackdrop}></div>
                    <div className={classes.profileTabHeader}>
                        <ListItemText
                            style={{ zIndex: 1, alignSelf: 'end', margin: 0 }}
                            primary={<Typography className={classes.profileNamePrimary}>{props.user.name}</Typography>}
                            secondary={<Typography variant='subtitle1' className={classes.profileNameSecondary}>#{props.user.username}</Typography>}
                        />
                        <div style={{ zIndex: 1, textAlign: 'center' }}>
                            <img src={`http://localhost:5000/api/users/image/${props.user.avatar.icon}`} alt="" width="200" height="200" className={classes.sellerAvatar} />
                            <Typography component='p' style={{ zIndex: 1, color: 'white', fontFamily: 'CaviarDreams' }}>6969 Followers</Typography>
                            <Typography component='p' style={{ zIndex: 1, color: 'white', fontFamily: 'CaviarDreams' }}>69 Following</Typography>
                            <Typography component='p' style={{ zIndex: 1, color: 'white', fontFamily: 'CaviarDreams' }}>432 Likes</Typography>
                            <Button variant='contained' style={{ height: 'fit-content', background: deepPurple[500], color: grey[200], margin: '0 5px 0 10px' }}>Follow</Button>
                            <IconButton size='small' style={{ padding: '8px', color: deepPurple[400], backgroundColor: grey[200] }}>
                                <TelegramIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className={classes.profileTabRoot}>
                        <Tabs
                            orientation="horizontal"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            className={classes.tabs}
                            style={{}}
                        >
                            <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label="Portfolio" {...a11yProps(0)} />
                            <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label="Store" {...a11yProps(1)} />
                            <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label="Prizes Recieved" {...a11yProps(2)} />
                            <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label="Prizes Given" {...a11yProps(3)} />
                            <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label="Edit Profile" {...a11yProps(4)} />
                        </Tabs>
                        <TabPanel style={{ width: '100%', background: '#2a2a2a' }} value={value} index={0}>
                            <div className={classes.exploreGrid}>
                                {props.user.artwork_count > 0 ?
                                    <Masonry {...props} imageList={props.user.artworks} />
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
                                            <TableRow key={storeItem._id} style={{ maxHeight: '200px' }}>
                                                <TableCell style={(props.user.store.length - 1) === index ? { borderBottom: 'none', width: '250px', height: '225px', textAlign: 'center', padding: '0 15px' } : { width: '250px', height: '225px', textAlign: 'center', padding: '0 15px' }} component="th" scope="row">
                                                    <img
                                                        className={classes.storeImage}
                                                        id={storeItem._id}
                                                        src={`http://localhost:5000/api/store/image/${storeItem.item}`}
                                                    />
                                                </TableCell>
                                                <TableCell style={(props.user.store.length - 1) === index ? { borderBottom: 'none', padding: 0 } : { padding: 0 }}>
                                                    <List style={{ color: grey[300] }}>
                                                        <ListItem className={classes.listItem} disableGutters>
                                                            <Typography variant='h6' style={{ wordBreak: 'break-all' }}>{storeItem.title}</Typography>
                                                        </ListItem>
                                                        <ListItem className={classes.listItem} disableGutters>
                                                            <Typography variant='caption'>{storeItem.description}</Typography>
                                                        </ListItem>
                                                        <ListItem className={classes.listItem} disableGutters>
                                                            <Typography variant='body'>Average User Rating: {Number.parseFloat(storeItem.rating).toFixed(2)}</Typography>
                                                        </ListItem>
                                                        <ListItem className={classes.listItem} disableGutters>
                                                        </ListItem>
                                                        <ListItem className={classes.listItem} disableGutters>
                                                            <Typography variant='h6' className={classes.actionText}>&#8377;{Number.parseFloat(storeItem.price).toFixed(2)}</Typography>
                                                            &bull;
                                                            <Button size="small" variant='contained' style={{ margin: '0 5px' }}>Navigate to Listing</Button>
                                                            <Button size="small" variant='contained' color='secondary' style={{ margin: '0 5px' }} onClick={() => removeStoreListing(storeItem._id)}>Remove Listing</Button>
                                                        </ListItem>
                                                    </List>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                : ''}
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: '#2a2a2a', borderRadius: '0 0 15px 15px' }} value={value} index={2} >
                            <div className={classes.prizeRecieved}>
                                <div>
                                    <ListItemText
                                        style={{ margin: '50px' }}
                                        primary={<Typography variant='h3' style={{ textAlign: 'center', color: grey[300] }}>Prized Awarded to YOU</Typography>}
                                        secondary={<Typography variant='subtitle1' style={{ textAlign: 'center', color: grey[300] }}>Look through all the awards you have recieved in recoginition of your art which people.</Typography>}
                                    />
                                    <div style={{ minHeight: 500 }}>
                                        <input
                                            type="file"
                                            className={classes.imageInput}
                                            onChange={onFileChange}
                                            name="myImage"
                                        />
                                        {file && <Grid item>
                                            <Card style={{ background: 'transparent', width: '100px', height: '100px' }}>
                                                <img style={{ width: '100%' }} id="preview" src={URL.createObjectURL(file)} alt="" />
                                                <div onClick={() => setFile('')}>Cancel</div>
                                            </Card>
                                        </Grid>
                                        }
                                        <Button variant='contained' onClick={handleUpload}>Add Award</Button>
                                        <Grid container spacing={4} style={{ padding: '30px' }}>
                                            {props.common.avatarList.map(avatar => (
                                                <Grid item xs={2}>
                                                    <img style={{ width: '100%' }} src={`http://localhost:5000/api/users/image/${avatar.icon}`} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </TabPanel >
                        <TabPanel style={{ width: '100%', background: '#2a2a2a', borderRadius: '0 0 15px 15px' }} value={value} index={3}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Typography variant='button' style={{ margin: 'auto' }}>test</Typography>
                            </div>
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: '#2a2a2a', borderRadius: '0 0 15px 15px' }} value={value} index={4}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Button variant='contained' onClick={() => setAvatarModal(true)}>Edit Avatar</Button>
                                <AvatarModal
                                    open={avatarModal}
                                    title='Awards'
                                    onClose={handleDialogClose}
                                    onClick={handleDialogClose}
                                />
                            </div>
                        </TabPanel>
                        {/* <TabPanel style={{ width: '100%', background: '#2a2a2a' }} value={value} index={5}>
                            Item Six
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: '#2a2a2a' }} value={value} index={6}>
                            Item Seven
                        </TabPanel> */}
                    </div >
                </div >
            </div >

        </div >
    )
}

const mapStateToProps = (state, props) => ({
    user: state.common.user,
    common: state.common,
    store: state.store
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    handleUploadAsset,
    fetchAvatars,
    fetchAwards,
    deleteUserStoreItem
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));
