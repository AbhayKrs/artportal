import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Typography, Card, CardContent, ListItemText, Button, Grid, Box, Tabs, Tab, Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    profileRoot: {
        margin: '65px 0 0',
    },
    profileHeader: {
        backgroundImage: 'url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d14808a6-d6ac-49ac-bf38-62fa7ecd9808/ddsbe5i-e635f976-9a0f-4b45-88f7-2aaf4ab5ba22.jpg/v1/fill/w_1280,h_640,q_75,strp/alien_jungle_banner_deviantart_by_ahaas_ddsbe5i-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvZDE0ODA4YTYtZDZhYy00OWFjLWJmMzgtNjJmYTdlY2Q5ODA4XC9kZHNiZTVpLWU2MzVmOTc2LTlhMGYtNGI0NS04OGY3LTJhYWY0YWI1YmEyMi5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.S6SDvWTfBop0Rep4LqE5qNmLlJowodQCM0TptvJN_gs)',
        position: 'fixed',
        top: '54px',
        height: 520,
        width: '100%',
        backgroundPosition: '50%',
        backgroundSize: 'cover'
    },
    profileBody: {
        width: '100%',
        position: 'relative'
    },
    profileBodyRoot: {
        marginBottom: 0,
        position: 'relative'
    },
    profileBodyBackdrop: {
        backgroundImage: 'linear-gradient(180deg, rgba(6,7,13,0) 0, black 70%, black)',
        position: 'relative',
        inset: '350px 0 0',
        width: '100%',
        height: 300,
        transform: 'translateY(-100%)'
    },
    profileTabRoot: {
        flexGrow: 1,
        position: 'relative',
        background: 'black',
        padding: '15px'
    },
    profileTabHeader: {
        display: 'flex',
        background: 'white',
        padding: '20px 20px 0'
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    sellerThumbnail: {
        borderRadius: '50%',
        float: 'left',
        width: '100px',
        height: '100px',
        marginTop: '-50px'
    },
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

const Profile = (props) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={classes.profileRoot}>
            <div className={classes.profileHeader}></div>
            <div className={classes.profileBody}>
                <div className={classes.profileBodyRoot}>
                    <div className={classes.profileBodyBackdrop}></div>
                    <div className={classes.profileTabRoot}>
                        <div className={classes.profileTabHeader}>
                            <ListItemText
                                primary={<Typography variant='h4'>{props.user.name}</Typography>}
                                secondary={<Typography variant='subtitle2'># {props.user.username}</Typography>}
                            />
                            <Avatar className={classes.sellerThumbnail}>
                                <img src="https://randomuser.me/api/portraits/women/47.jpg" alt="" width="100" height="100" className={classes.sellerAvatar} />
                            </Avatar>
                        </div>
                        <Tabs
                            orientation="horizontal"
                            // variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            className={classes.tabs}
                            style={{ position: 'relative', background: 'white' }}
                        >
                            <Tab label="Overview" {...a11yProps(0)} />
                            <Tab label="Uploads" {...a11yProps(1)} />
                            <Tab label="Store" {...a11yProps(2)} />
                            <Tab label="Prizes Recieved" {...a11yProps(3)} />
                            <Tab label="Prizes Given" {...a11yProps(4)} />
                            {/* <Tab label="Item Six" {...a11yProps(5)} />
                            <Tab label="Item Seven" {...a11yProps(6)} /> */}
                        </Tabs>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={0}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Typography variant='button' style={{ margin: 'auto' }}>test</Typography>
                            </div>
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={1}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Typography variant='button' style={{ margin: 'auto' }}>test</Typography>
                            </div>
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={2}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Typography variant='button' style={{ margin: 'auto' }}>test</Typography>
                            </div>
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={3}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Typography variant='button' style={{ margin: 'auto' }}>test</Typography>
                            </div>
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={4}>
                            <div style={{ display: 'flex', minHeight: 500 }}>
                                <Typography variant='button' style={{ margin: 'auto' }}>test</Typography>
                            </div>
                        </TabPanel>
                        {/* <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={5}>
                            Item Six
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={6}>
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
