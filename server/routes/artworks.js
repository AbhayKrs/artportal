import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

//Middleware
import { protect, admin } from '../middleware/authMiddleware.js';
import { checkObjectId } from '../middleware/checkObjectId.js';

//Importing gfs database
import multer from 'multer';
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';

//Import Schemas
import Explore from '../models/explore.js';
import Comment from '../models/comment.js';
import User from '../models/user.js';

//Connect gfs to database
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

//Storage for image uploaded
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename =
                    buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    },
});
const upload = multer({ storage });

// @route       GET api/artworks
// @desc        Get all artworks
// @access      Public
router.get('/', async (req, res) => {
    try {
        const artworks = await Explore.find({});
        if (!artworks) {
            return res.status(400).send({ msg: 'Artworks not found' });
        }
        res.json(artworks);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch artworks');
    }
});

// @route       Get api/artworks/:id
// @desc        Fetch artwork by ID along with next and prev artworks
// @access      Public
router.get('/:id', async (req, res) => {
    try {
        const artwork = await Explore.findById(req.params.id);
        if (!artwork) {
            return res.status(400).send({ msg: 'Artwork not found' });
        }
        res.json(artwork);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch artwork');
    }
});

// @route       POST api/artworks/new
// @desc        Create an artwork
// @access      Private
router.post('/new', upload.single('file'), async (req, res) => {
    console.log('user id', req.body.userId);
    const user = await User.findById(req.body.userId);
    console.log('user', user);
    const newArtwork = new Explore({
        filename: req.file.filename,
        title: req.body.title,
        author: {
            id: user.id,
            username: user.username,
            avatar: user.avatar
        },
        description: req.body.description,
        tags: req.body.tags
    });
    console.log('newArtwork data', newArtwork);
    Explore.create(newArtwork, (err, artwork) => {
        if (err) {
            console.log(err);
        } else {
            user.artworks.push(artwork);
            user.artwork_count = user.artworks.length;
            user.save();
            res.send(artwork);
        }
    });
}
);

// @route       Edit api/artworks/:id
// @desc        Edit an artwork
// @access      Private/Admin
router.put('/:id', function (req, res) {
    const newArtworkDetails = {
        title: req.body.title,
        description: req.body.description,
    };
    console.log(newArtworkDetails);
    Explore.findByIdAndUpdate(
        req.params.id,
        { $set: newData },
        function (err, artworks) {
            if (err) {
                console.log(err);
            } else {
                res.send(artworks);
            }
        }
    );
});

// @route       Delete api/artworks/:id
// @desc        Delete an artwork
// @access      Private/Admin
router.delete('/:id', [protect, admin, checkObjectId('id')], async (req, res) => {
    try {
        const artwork = await Explore.findById(req.params.id);
        if (!artwork) {
            return res.status(404).send('Artwork not found');
        }
        await artwork.remove();
        res.send('Artwork removed successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Artwork removal failed');
    }
}
);

// @route   Image Route
// @desc    Image from gridFS storage
// @access  Private
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }
        // Check if image
        if (
            file.contentType === 'image/jpg' ||
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
        ) {
            // Read output to browser
            const readstream = gfs.createReadStream({
                filename: req.params.filename,
            });
            readstream.pipe(res);
        } else {
            res.status(404).json({ err: 'Not an image' });
        }
    });
});

// @route       PUT api/artworks/:id/like
// @desc        Like an artwork
// @access      Public
router.put('/:id/like', async (req, res) => {
    try {
        Explore.findByIdAndUpdate(req.params.id, {
            $push: {
                likes: req.body.user.id
            }
        }, {
            new: true
        }).exec((err, like) => {
            if (err) {
                res.status(500).send('Failed to like!');
            } else {
                res.send(like);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to get likes count!');
    }
})

// @route       PUT api/artworks/:id/dislike
// @desc        Like an artwork
// @access      Public
router.put('/:id/dislike', async (req, res) => {
    try {

        if (!req.body.user) {
            return res.status(401).json({ msg: 'User not authorized!' })
        }
        Explore.findByIdAndUpdate(req.params.id, {
            $pull: {
                likes: req.body.user.id
            }
        }, {
            new: true
        }).exec((err, dislike) => {
            if (err) {
                res.status(500).send('Failed to like!');
            } else {
                res.json(dislike);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to get likes count!');
    }
})

// @route       POST api/artworks/:id/comments/new
// @desc        Add a new comment
// @access      Private
router.post('/:id/comments/new', async (req, res) => {
    try {
        const artwork = await Explore.findById(req.params.id);
        console.log('body', req.body);
        if (!req.body.user) {
            return res.status(401).json({ msg: 'User not authorized!' })
        }
        const newComment = new Comment({
            content: req.body.content,
            author: {
                id: req.body.user.id,
                username: req.body.user.username,
                avatar: req.body.user.avatar
            }
        });
        Comment.create(newComment, (err, comment) => {
            if (err) {
                console.log(err);
            } else {
                comment.save();
                artwork.comments.push(comment);
                artwork.comment_count = artwork.comments.length;
                artwork.save();
                console.log('artwork', artwork.comments);
                console.log('comment', comment);
                res.json(comment);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Adding a comment failed');
    }
});

// @route       POST api/artworks/:id/comments/:comment_id/reply
// @desc        Add a reply
// @access      Private
router.put('/:id/comments/:comment_id/reply', async (req, res) => {
    try {
        const artwork = await Explore.findById(req.params.id);
        const comment = await Comment.findById(req.params.comment_id);
        const replyComment = artwork.comments.find(comment => comment._id == req.params.comment_id);
        if (!req.body.user) {
            return res.status(401).json({ msg: 'User not authorized!' })
        }
        const newReply =
            Comment.findByIdAndUpdate(
                req.params.comment_id,
                {
                    $push: {
                        "replies": {
                            comment: req.body.reply,
                            author: {
                                id: req.body.user.id,
                                username: req.body.user.username
                            }
                        }
                    }
                },
                // { replies: replies.push(newReply) },
                { new: true },
                async (err, reply) => {
                    if (err) {
                        console.log(err)
                    } else {
                        artwork.comments.filter(comment => comment._id === replyComment._id)[0].replies.push(reply);
                        artwork.save();
                    }
                }
            );

        // const newComment = new Comment({
        //     comment: req.body.reply,
        //     author: {
        //         id: req.body.user.id,
        //         username: req.body.user.username
        //     },
        // });
        // Comment.create(newComment, (err, reply) => {
        //     if (err) {
        //         console.log(err)
        //     } else {
        //         artwork.comments.filter(comment => comment._id === replyComment._id)[0].replies.push(reply);
        //         artwork.save();
        //         console.log('repliedData', reply, artwork.comments[0].replies);
        //     }
        // });
        return res.json(artwork.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Adding a comment failed');
    }
});

// @route    PUT api/artworks/:id/comments/:comment_id
// @desc     Edit a comment
// @access   Private
router.put('/:id/comments/:comment_id', async (req, res) => {
    try {
        const artwork = await Explore.findById(req.params.id);
        const editComment = artwork.comments.find(comment => comment._id == req.params.comment_id);
        if (!editComment) {
            return res.status(401).json({ msg: 'Comment does not exist!' })
        }

        const newData = { content: req.body.content }
        await Comment.findByIdAndUpdate(
            req.params.comment_id,
            { content: newData.content },
            { new: true },
            async (err, comment) => {
                if (err) {
                    console.log(err)
                } else {
                    const index = artwork.comments.findIndex(comment => comment === editComment);
                    artwork.comments[index] = comment;
                    console.log('edited comment', comment, index, artwork.comments);
                    artwork.save();
                }
            }
        );
        return res.json(artwork.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Editing a comment failed');
    }
})

// @route    DELETE api/artworks/:id/comments/:comment_id
// @desc     Delete a comment
// @access   Private
router.delete('/:id/comments/:comment_id', async (req, res) => {
    try {
        const artwork = await Explore.findById(req.params.id);
        const comment = await Comment.findById(req.params.comment_id);
        const deleteComment = artwork.comments.find(comment => comment._id == req.params.comment_id);
        if (!deleteComment) {
            return res.status(404).json({ msg: 'Comment does not exist!' });
        }

        // // Check user
        // if (artwork.author.id !== deleteComment.author.id) {
        //     return res.status(401).json({ msg: 'User not authorized!' });
        // }

        artwork.comments = artwork.comments.filter(comment => comment._id !== deleteComment._id);
        artwork.comment_count = artwork.comments.length;
        comment.deleteOne(deleteComment);
        await artwork.save();
        return res.json(artwork.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Deleting a comment failed');
    }
});

// @route       PUT api/artworks/:id/comments/:comment_id/like
// @desc        Like a comment
// @access      Public
router.put('/:id/comments/:comment_id/like', async (req, res) => {
    const artwork = await Explore.findById(req.params.id);
    try {
        Comment.findByIdAndUpdate(req.params.comment_id, {
            $push: {
                likes: req.body.user.id
            }
        }, {
            new: true
        }).exec((err, likedComment) => {
            if (err) {
                res.status(500).send('Failed to like!');
            } else {
                console.log('ARTWORK COMMENT', artwork.comments.find(comment => { return comment._id.equals(likedComment._id) }))
                artwork.comments.find(comment => { return comment._id.equals(likedComment._id) }).likes.push(req.body.user.id);
                artwork.save();
                res.send(likedComment);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to get likes count!');
    }
})

// @route       PUT api/artworks/:id/comments/:comment_id/dislike
// @desc        Dislike a comment
// @access      Public
router.put('/:id/comments/:comment_id/dislike', async (req, res) => {
    const artwork = await Explore.findById(req.params.id);
    try {
        if (!req.body.user) {
            return res.status(401).json({ msg: 'User not authorized!' })
        }
        Comment.findByIdAndUpdate(req.params.comment_id, {
            $pull: {
                likes: req.body.user.id
            }
        }, {
            new: true
        }).exec((err, dislikedComment) => {
            if (err) {
                res.status(500).send('Failed to like!');
            } else {
                let likes = artwork.comments.find(comment => { return comment._id.equals(dislikedComment._id) }).likes;
                likes.splice(likes.indexOf(req.body.user.id), 1);
                artwork.save();
                res.json(dislikedComment);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to get likes count!');
    }
})

export default router;
