import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Paper, Avatar, List, ListItem, ListItemText, FormControl, Collapse, InputLabel, Input, InputAdornment, Typography, Chip, Card, OutlinedInput, TextField, Button } from '@material-ui/core';
import { pink, grey, deepPurple, common } from '@material-ui/core/colors';
import PublishIcon from '@material-ui/icons/Publish';
import UserIcon from '../../assets/images/panda.png';

import { setError, getTags } from '../../store/actions/common.actions';
import { handleStoreUpload } from '../../store/actions/store.actions';

const useStyles = makeStyles((theme) => ({
    uploadRoot: {
        margin: '100px 50px',
        padding: '40px',
    },
    uploadContent: {
        height: '500px',
    },
    uploadGrid: {
        display: 'block',
        maxWidth: '500px',
        margin: 'auto'
    },
    cardRoot: {
        backgroundColor: grey[50],
        padding: '5px 5px 0 5px',
    },
    upldBtn: {
        padding: '5px',
        width: '95px',
        float: 'right'
    },
    cardContent: {
        padding: '5px 5px 0 5px',
    },
    imageGrid: {
        width: '40%'
    },
    imageLabel: {
        display: 'flex'
    },
    userChip: {
        margin: '10px',
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
        height: '100%'
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
            color: pink[900],
        },
    },
    descInput: {
        width: '100%',
        margin: '10px 0',
        '& .MuiFormLabel-root': {
            color: pink[900],
        },
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
    }
}));

const StoreUpload = (props) => {
    const [file, setFile] = useState('');
    const [title, setTitle] = useState('test');
    const [description, setDescription] = useState('test');
    const [price, setPrice] = useState(0);
    const [uploadData, setUploadData] = useState({});
    const [progress, setProgress] = useState(0);
    const [selectedTag, setSelectedTag] = useState('');
    const [tags, setTags] = useState([]);

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
    const selectTags = (event) => {
        setSelectedTag(event.target.value)
    }
    const addTags = (tag) => {
        if (tags.filter(item => item == tag).length === 0) {
            setTags(prevTags => [...prevTags, tag]);
        } else {
            const errorData = {
                open: true,
                message: 'Tag Selected Already!',
                severity: 'warning'
            }
            props.setError(errorData)
        }
    }
    const handleUpload = () => {
        if (file.length === 0 || title.length === 0 || description.length === 0 || tags.length === 0) {
            const errorData = {
                open: true,
                message: 'Please fill all the required fields!',
                severity: 'error'
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
        tags.map(item => formData.append('tags[]', item));

        console.log('formData', formData);

        props.handleStoreUpload(formData)
            .then(() => {
                props.history.push('/store');
                const errorData = {
                    open: true,
                    message: 'Successfully Uploaded!',
                    severity: 'success'
                }
                props.setError(errorData);
            }).catch(err => {
                console.log('err', err);
            });
    }
    const classes = useStyles();

    useEffect(() => {
        props.getTags();
    }, []);

    return (
        <Paper elevation={3} className={classes.uploadRoot}>
            <Grid container spacing={3} className={classes.uploadGrid}>
                <div style={{ display: 'flex' }}>
                    <Grid item style={!file ? { width: '100%' } : { width: '60%' }} className={classes.uploadContent}>
                        <Typography variant='h5'>Upload a file</Typography>
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
                            avatar={<img src={UserIcon} />}
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
                        />
                        <FormControl fullWidth className={classes.tagsInput}>
                            <InputLabel htmlFor="tags">Add tags to your artwork</InputLabel>
                            <Input
                                id="tags"
                                value={selectedTag}
                                onChange={selectTags}
                                startAdornment={<InputAdornment position="start">#</InputAdornment>}
                            />
                            <Collapse in={selectedTag.length === 0 ? false : true}>
                                <Paper elevation='3'>
                                    <List className={classes.tagList}>
                                        {props.common.tags.filter(tag => tag.includes(selectedTag)).map(tag => (
                                            <ListItem button onClick={() => addTags(tag)}>
                                                <ListItemText primary={<Typography variant='subtitle2' className={classes.tagText}># {tag}</Typography>} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Collapse>
                        </FormControl>
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={price}
                                onChange={handlePriceChange}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                labelWidth={60}
                            />
                        </FormControl>
                        {tags.map(chosenTag => (
                            <Chip size='small' label={chosenTag} className={classes.chosenTags} />
                        ))}
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
    common: state.common
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setError,
    getTags,
    handleStoreUpload
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StoreUpload));
