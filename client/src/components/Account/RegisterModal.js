import React, { useState, useEffect } from 'react';
import { Dialog, Grid, DialogContent, FormControlLabel, Checkbox, ListItemText, Typography, List, ListItem, Button, Link, InputBase, IconButton, Paper, Card, CardContent, CardMedia, CardActions } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import LoginMedia from '../../assets/images/LoginMedia.jpg';
import { grey, blueGrey, deepPurple } from '@material-ui/core/colors';

import { handleHeaderDialogOpen, handleHeaderDialogClose, handleSignUp } from '../../store/actions/common.actions';

const useStyles = makeStyles((theme) => ({
    loginRoot: {
        width: '100%',
        background: 'rgba(255,255,255,0.3)'
    },
    dialogPaper: {
        width: '100%',
        boxShadow: 'none',
        maxWidth: '900px',
        background: 'rgb(39,39,43)',
        flexDirection: 'inherit'
    },
    dialogTitle: {
        display: 'inline',
        padding: '0'
    },
    listItem: {
        paddingTop: '0'
    },
    closeIcon: {
        color: grey[200],
        zIndex: 1,
        position: 'absolute',
        right: 0
    },
    dialogContent: {
        height: '100%',
        marginBottom: '10px',
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
        flex: '1 0 auto',
        padding: '0 16px 23px 16px',
        display: 'flex',
        alignItems: 'center'
    },
    loginTitle: {
        fontFamily: 'AntipastoProRegular',
        fontWeight: 'bold',
        color: deepPurple[400]
    },
    loginSubtitle: {
        color: grey[500]
    },
    loginFields: {
        width: '100%',
        display: 'flex',
        padding: '5px 0',
        margin: '5px 0',
        borderLeft: '8px solid',
        borderColor: deepPurple[400]
    },
    loginIcons: {
        background: 'rgba(0, 0, 0, 0.15)',
        '&:disabled': {
            color: deepPurple[400]
        }
    },
    inputFields: {
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
    checkboxChecked: {
        color: deepPurple[400]
    },
    loginTOS: {
        color: grey[600]
    }
}))

const RegisterModal = (props) => {
    const { open, title, onClose } = props;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value)
    }
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }
    const handleConfirmPasswordChange = (event) => {
        setPassword2(event.target.value)
    }

    const onSubmitClick = () => {
        const signupInput = {
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        }
        props.handleSignUp(signupInput);
    }

    const classes = useStyles();
    return (
        <Dialog open={open} className={classes.loginRoot} aria-labelledby="simple-dialog-title" PaperProps={{ className: classes.dialogPaper }} >
            <Grid container>
                <Grid item xs={12} sm={6} style={{ maxHeight: '100%' }}>
                    <img
                        className={classes.cardMedia}
                        src={`http://localhost:5000/api/users/image/${props.common.signupImage}`}
                    />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.cardDetails}>
                    <IconButton className={classes.closeIcon} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                    <div className={classes.cardContent}>
                        <List>
                            <ListItem className={classes.listItem}>
                                <ListItemText
                                    edge="start"
                                    primary={<Typography variant="h3" className={classes.loginTitle}>{title}</Typography>}
                                    secondary={<Typography variant="subtitle2" className={classes.loginSubtitle}>Become a Artyst Member. <Button size="small" style={{ color: deepPurple[400] }} onClick={() => { props.handleHeaderDialogClose(); props.handleHeaderDialogOpen('openLoginDialog') }}>Sign In</Button></Typography>}
                                />
                            </ListItem>
                            <ListItem className={classes.listItem}>
                                <Paper elevation={3} className={classes.loginFields}>
                                    <InputBase
                                        value={name}
                                        onChange={handleNameChange}
                                        className={classes.inputFields}
                                        placeholder="Name"
                                        inputProps={{ 'aria-label': 'Name' }}
                                    />
                                </Paper>
                            </ListItem>
                            <ListItem className={classes.listItem}>
                                <Paper elevation={3} className={classes.loginFields}>
                                    <InputBase
                                        value={username}
                                        onChange={handleUsernameChange}
                                        className={classes.inputFields}
                                        placeholder="Username"
                                        inputProps={{ 'aria-label': 'Username' }}
                                    />
                                </Paper>
                            </ListItem>
                            <ListItem className={classes.listItem}>
                                <Paper elevation={3} className={classes.loginFields}>
                                    <InputBase
                                        value={email}
                                        onChange={handleEmailChange}
                                        className={classes.inputFields}
                                        placeholder="Email"
                                        inputProps={{ 'aria-label': 'Email' }}
                                    />
                                </Paper>
                            </ListItem>
                            <ListItem className={classes.listItem}>
                                <Paper elevation={3} className={classes.loginFields}>
                                    <InputBase
                                        type='password'
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={classes.inputFields}
                                        placeholder="Password"
                                        inputProps={{ 'aria-label': 'Password' }}
                                    />
                                </Paper>
                            </ListItem>
                            <ListItem className={classes.listItem}>
                                <Paper elevation={3} className={classes.loginFields}>
                                    <InputBase
                                        type='password'
                                        value={password2}
                                        onChange={handleConfirmPasswordChange}
                                        className={classes.inputFields}
                                        placeholder="Confirm Password"
                                        inputProps={{ 'aria-label': 'Password' }}
                                    />
                                </Paper>
                            </ListItem>
                            <ListItem>
                                <Button variant="contained" size='large' className={classes.loginButton} onClick={onSubmitClick}>sign up</Button>
                            </ListItem>
                            <ListItem>
                                <Typography variant='body2' className={classes.loginTOS}>
                                    By clicking Sign Up, I confirm that I have read and agree to the Artyst <Link onClick={() => props.history.push('/policy/services')} >Terms of Service</Link> and <Link onClick={() => props.history.push('/policy/privacy')}>Privacy Policy</Link>.
                                </Typography>
                            </ListItem>
                        </List>
                    </div>
                </Grid>
            </Grid>
        </Dialog >
    )
}

const mapStateToProps = (state, props) => ({
    common: state.common,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    handleHeaderDialogOpen,
    handleHeaderDialogClose,
    handleSignUp
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RegisterModal))
