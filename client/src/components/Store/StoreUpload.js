import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Paper, Avatar, List, ListItem, ListItemText, FormControl, Collapse, InputLabel, Input, InputAdornment, Typography, Chip, Card, OutlinedInput, TextField, Button } from '@material-ui/core';
import { pink, grey, deepPurple, common } from '@material-ui/core/colors';
import PublishIcon from '@material-ui/icons/Publish';

import { setError } from '../../store/actions/common.actions';
import { handleStoreUpload } from '../../store/actions/store.actions';

const useStyles = makeStyles((theme) => ({
    uploadRoot: {
        margin: '100px 25px',
        padding: '20px',
        background: '#2a2a2a'
    },
    uploadContent: {
        width: '100%',
        padding: '0 20px 0 0'
    },
    uploadGrid: {
        display: 'block',
        margin: 'auto'
    },
    cardRoot: {
        backgroundColor: grey[50],
        padding: '5px 5px 0 5px',
        margin: '20px 0'
    },
    upldBtn: {
        padding: '5px',
        width: '95px',
        float: 'right',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    cardContent: {
        padding: '5px 5px 0 5px',
    },
    imageGrid: {
        width: '40%'
    },
    imageLabel: {
        display: 'flex',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    userChip: {
        margin: '2px 0 20px 0',
    },
    uploadIcon: {
        color: deepPurple[500]
    },
    uploadIconText: {
        margin: 'auto 0',
        fontSize: '1rem',
        color: deepPurple[500]
    },
    imgPreview: {
        width: '100%',
        objectFit: 'cover',
        height: '100%',
    },
    uploadBtn: {
        padding: '10px',
        float: 'right'
    },
    imageInput: {
        display: 'none'
    },
    addImageFile: {
        background: '#fff',
        color: deepPurple[500]
    },
    titleInput: {
        width: '100%',
        color: deepPurple[500],
        '& .MuiFormLabel-root': {
            color: deepPurple[400],
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: deepPurple[400],
            }
        }
    },
    titleInputProp: {
        color: grey[400]
    },
    descInput: {
        width: '100%',
        margin: '10px 0',
        '& .MuiFormLabel-root': {
            color: deepPurple[400],
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: deepPurple[400],
            }
        }
    },
    tagsInput: {
        margin: '10px 0'
    },
    tagList: {
        overflow: 'auto',
        maxHeight: '225px',
    },
    tagText: {
        color: deepPurple[500]
    },
    progressRoot: {
        width: '100%'
    },
    chosenTags: {
        background: deepPurple[500],
        color: 'white'
    },
    tagsInputRoot: {
        color: grey[400],
        '& .MuiInput-underline:after': {
            borderBottomColor: '#fff',
        }
    },
    startAdorn: {
        color: grey[400]
    }
}));

const StoreUpload = (props) => {
    const [file, setFile] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [uploadData, setUploadData] = useState({});
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log('test', !file)
    })

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    }
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setUploadData({
            ...uploadData,
            title: event.target.value
        })
    }
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        setUploadData({
            ...uploadData,
            description: event.target.value
        })
    }
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
        setUploadData({
            ...uploadData,
            price: event.target.value
        })
    }

    const handleUpload = () => {
        if (file.length === 0 || title.length === 0 || description.length === 0) {
            const errorData = {
                open: true,
                message: 'Please fill all the required fields!',
                severity: 'error',
            }
            props.setError(errorData)
            return;
        }

        const userId = props.common.user.id;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('rating', 5);
        formData.append('userId', userId);

        console.log('formData', formData);

        props.handleStoreUpload(formData)
            .then(() => {
                props.history.push('/store');
                const errorData = {
                    open: true,
                    message: 'Successfully Uploaded!',
                    severity: 'success',
                }
                props.setError(errorData);
            }).catch(err => {
                console.log('err', err);
            });
    }
    const classes = useStyles();

    return (
        <Paper elevation={3} className={classes.uploadRoot}>
            <Grid container className={classes.uploadGrid}>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <Grid item style={!file ? { width: '100%' } : { width: '60%' }} className={classes.uploadContent}>
                        <Typography variant='h5' style={{ color: grey[300], marginBottom: '10px' }}>Upload a file</Typography>
                        <Card className={classes.upldBtn}>
                            <label className={classes.imageLabel}>
                                <input
                                    type="file"
                                    className={classes.imageInput}
                                    onChange={onFileChange}
                                    name="myImage"
                                />
                                <PublishIcon className={classes.uploadIcon} />
                                <Typography className={classes.uploadIconText}>UPLOAD</Typography>
                            </label>
                        </Card>
                        <Chip
                            className={classes.userChip}
                            avatar={<img src={`http://localhost:5000/api/users/image/${props.user.avatar.icon}`} />}
                            label={<Typography variant='body'>{props.common.user.username}</Typography>}
                        />
                        <TextField
                            required
                            id="filled-required"
                            label="Title"
                            variant="outlined"
                            className={classes.titleInput}
                            value={title}
                            onChange={handleTitleChange}
                            InputProps={{
                                className: classes.titleInputProp
                            }}
                        />
                        <TextField
                            required
                            id="filled-multiline-flexible"
                            label="Description"
                            multiline
                            rows={4}
                            variant="outlined"
                            className={classes.descInput}
                            value={description}
                            onChange={handleDescriptionChange}
                            InputProps={{
                                className: classes.titleInputProp
                            }}
                        />
                        <FormControl fullWidth className={classes.titleInput} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={price}
                                onChange={handlePriceChange}
                                startAdornment={<InputAdornment position="start" style={{ color: deepPurple[500] }}>$</InputAdornment>}
                                labelWidth={60}
                                classes={{
                                    adornedStart: classes.startAdorn,
                                    inputAdornedStart: classes.inputAdornment
                                }}
                                InputProps={{
                                    className: classes.titleInputProp
                                }}
                            />
                        </FormControl>
                    </Grid>
                    {file &&
                        <Grid item className={classes.imageGrid}>
                            <Card className={classes.cardRoot}>
                                <div>
                                    <img className={classes.imgPreview} id="preview" src={URL.createObjectURL(file)} alt="" />
                                    <div onClick={() => setFile('')}>Cancel</div>
                                </div>
                            </Card>
                        </Grid>
                    }
                </div>
                <Button variant="contained" onClick={handleUpload}>
                    Upload
                </Button>
                <Button variant='contained' color='secondary' style={{ margin: '0 10px' }} onClick={() => props.history.goBack()}>
                    Back
                </Button>
            </Grid>
        </Paper >
    )
}

const mapStateToProps = (state, props) => ({
    uploadData: state.uploadData,
    common: state.common,
    user: state.common.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setError,
    handleStoreUpload
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StoreUpload));
