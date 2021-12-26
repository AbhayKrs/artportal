import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Card, CardContent, CardActions, Button, Grid, Box, Tabs, Tab, } from '@material-ui/core';

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
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
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

const Profile = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={classes.profileRoot}>
            <div className={classes.profileHeader}></div>
            <div style={{
                width: '100%',
                position: 'relative'
            }}>
                <div style={{
                    minHeight: 700,
                    marginBottom: 0,
                    position: 'relative'
                }}>
                    <div style={{
                        backgroundImage: 'linear-gradient(180deg, rgba(6,7,13,0) 0, black 70%, black)',
                        position: 'relative',
                        inset: '626px 0 0',
                        width: '100%',
                        height: 500,
                        transform: 'translateY(-100%)',
                    }}></div>
                    <div style={{ display: 'flex', flexGrow: 1, position: 'relative', background: 'black', padding: '20px' }}>
                        {/* <Grid container style={{ transform: 'translateY(-25%)' }}>
                            <Grid item xs={2}>hello</Grid>
                            <Grid item xs={10}>
                                {[0, 1, 2, 3, 4].map(item => (
                                    <Card style={{ position: 'relative', margin: '10px auto', width: '80%' }}>
                                        <CardContent>
                                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                Word of the Day
                                            </Typography>
                                            <Typography variant="h5" component="h2">
                                                benevolent
                                            </Typography>
                                            <Typography className={classes.pos} color="textSecondary">
                                                adjective
                                            </Typography>
                                            <Typography variant="body2" component="p">
                                                well meaning and kindly.
                                                <br />
                                                {'"a benevolent smile"'}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small">Learn More</Button>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Grid>
                        </Grid> */}
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            className={classes.tabs}
                            style={{ position: 'relative', background: 'white' }}
                        >
                            <Tab label="Item One" {...a11yProps(0)} />
                            <Tab label="Item Two" {...a11yProps(1)} />
                            <Tab label="Item Three" {...a11yProps(2)} />
                            <Tab label="Item Four" {...a11yProps(3)} />
                            <Tab label="Item Five" {...a11yProps(4)} />
                            <Tab label="Item Six" {...a11yProps(5)} />
                            <Tab label="Item Seven" {...a11yProps(6)} />
                        </Tabs>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={0}>
                            Item One
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={1}>
                            Item Two
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={2}>
                            Item Three
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={3}>
                            Item Four
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={4}>
                            Item Five
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={5}>
                            Item Six
                        </TabPanel>
                        <TabPanel style={{ width: '100%', background: 'white' }} value={value} index={6}>
                            Item Seven
                        </TabPanel>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Profile
