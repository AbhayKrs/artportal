import React, { useState, useEffect } from 'react';
import { Dialog, Grid, DialogContent, FormControlLabel, Checkbox, ListItemText, Typography, List, ListItem, Button, Link, InputBase, IconButton, Paper, Card, CardContent, CardMedia, CardActions } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import LoginMedia from '../../assets/images/LoginMedia.jpg';
import { grey, blueGrey, deepPurple } from '@material-ui/core/colors';

import { handleHeaderDialogOpen, handleHeaderDialogClose, handleSignin } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    loginRoot: {
        width: '100%',
        background: 'rgba(255,255,255,0.3)'
    },
    dialogPaper: {
        width: '100%',
        maxWidth: '900px',
        background: 'rgb(39,39,43)',
        flexDirection: 'inherit'
    },
    dialogTitle: {
        display: 'inline',
        position: 'fixed',
        padding: '0'
    },
    closeIcon: {
        color: grey[200],
        zIndex: 1,
        position: 'absolute',
        right: 0
    },
    dialogContent: {
        height: '100%',
        display: 'flex',
        padding: '0',
        // marginBottom: '10px',
        '&::-webkit-scrollbar': {
            width: '0.8em',
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.6)',
            borderRadius: '25px'
        },
        [theme.breakpoints.down('md')]: {
            overflow: 'auto',
            height: '100%'
        }
    },
    cardRoot: {
        display: 'flex',
        width: '100%',
        height: '550px',
        background: 'rgb(39,39,43)'
    },
    cardMedia: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    cardDetails: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        // padding: '30px'
    },
    cardContent: {
        flex: '1 0 auto'
    },
    loginTitle: {
        fontWeight: 'bold',
        color: deepPurple[400]
    },
    loginSubtitle: {
        color: grey[500]
    },
    loginFields: {
        width: '100%',
        display: 'flex',
        margin: '5px 0'
    },
    loginIcons: {
        background: 'rgba(0, 0, 0, 0.15)',
        '&:disabled': {
            minWidth: 'min-content',
            color: deepPurple[400]
        }
    },
    inputUser: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    inputPass: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    remainLoggedIn: {
        width: '100%'
    },
    checkboxRoot: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    checkboxText: {
        color: grey[500]
    },
    checkboxChecked: {
        color: deepPurple[400]
    },
    loginTOS: {
        color: grey[600]
    }
}))

const LoginModal = (props) => {
    const { open, title, onClose } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setLoggedIn] = useState(true);

    const stayLoggedin = (event) => {
        setLoggedIn(event.target.checked);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const onSubmitClick = () => {
        setUsername('');
        setPassword('');
        const signinInput = {
            username: username,
            password: password,
        }
        props.handleSignin(stayLoggedIn, signinInput);
    }

    const classes = useStyles();
    return (
        <Dialog className={classes.loginRoot} aria-labelledby="simple-dialog-title" open={open} maxWidth={false} PaperProps={{ className: classes.dialogPaper }} >
            <Grid container>
                <Grid item xs={12} sm={6}>
                    <img
                        className={classes.cardMedia}
                        src={`http://localhost:4000/api/users/image/${props.common.loginImage}`}
                    />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.cardDetails}>
                    <IconButton className={classes.closeIcon} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                    <CardContent className={classes.cardContent}>
                        <List>
                            <ListItem>
                                <ListItemText
                                    edge="start"
                                    primary={<Typography variant="h4" className={classes.loginTitle}>{title}</Typography>}
                                    secondary={<Typography variant="subtitle2" className={classes.loginSubtitle}>Become a Artyst Member. <Button size="small" style={{ color: deepPurple[400], minWidth: 'fit-content' }} onClick={() => { props.handleHeaderDialogClose(); props.handleHeaderDialogOpen('openRegisterDialog') }}>Join</Button></Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <Paper elevation={3} className={classes.loginFields}>
                                    <Button disabled className={classes.loginIcons}>
                                        <PersonIcon />
                                    </Button>
                                    <InputBase
                                        value={username}
                                        onChange={handleUsernameChange}
                                        className={classes.inputUser}
                                        placeholder="Username"
                                        inputProps={{ 'aria-label': 'Username' }}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                onSubmitClick()
                                            }
                                        }}
                                    />
                                </Paper>
                            </ListItem>
                            <ListItem>
                                <Paper elevation={3} className={classes.loginFields}>
                                    <Button disabled className={classes.loginIcons}>
                                        <LockIcon />
                                    </Button>
                                    <InputBase
                                        type='password'
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={classes.inputPass}
                                        placeholder="Password"
                                        inputProps={{ 'aria-label': 'Password' }}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                onSubmitClick()
                                            }
                                        }}
                                    />
                                </Paper>
                            </ListItem>
                            <ListItem>
                                <FormControlLabel
                                    className={classes.remainLoggedIn}
                                    control={<Checkbox
                                        color="default"
                                        checked={stayLoggedIn}
                                        onChange={stayLoggedin}
                                        classes={{ root: classes.checkboxRoot, checked: classes.checkboxChecked }}
                                    />}
                                    label={<Typography variant="subtitle2" className={classes.checkboxText}>Keep me logged in</Typography>}
                                />
                            </ListItem>
                            <ListItem>
                                <Button variant="contained" size='large' className={classes.loginButton} onClick={onSubmitClick}>sign in</Button>
                            </ListItem>
                            <ListItem>
                                <Typography variant='body2' className={classes.loginTOS}>
                                    By clicking Log In, I confirm that I have read and agree to the Artyst <Link onClick={() => props.history.push('/policy/services')} >Terms of Service</Link> and <Link onClick={() => props.history.push('/policy/privacy')}>Privacy Policy</Link>.
                                </Typography>
                            </ListItem>
                        </List>
                    </CardContent>
                </Grid>
            </Grid>
            {/* <div className={classes.cardDetails}>

            </div> */}
            {/* </Card> */}
            {/* </DialogContent> */}
        </Dialog >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    handleHeaderDialogOpen,
    handleHeaderDialogClose,
    handleSignin
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginModal))
