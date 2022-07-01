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

// @route       GET api/explore
// @desc        Get all explore
// @access      Public
router.get('/', async (req, res) => {
    try {
        let explore = [];
        const filter = req.query.filter;
        const period = req.query.period;
        if (!filter && !period) {
            explore = await Explore.find({});
        } else {
            const exploreData = await Explore.find({});
            const getPeriod = (label) => {
                let value = 0;
                switch (label) {
                    case 'hour': { value = 3600000; break; }
                    case 'day': { value = 86400000; break; }
                    case 'week': { value = 604800000; break; }
                    case 'month': { value = 2592000000; break; }
                    case 'year': { value = 31556952000; break; }
                    default: break;
                }
                return value;
            }

            switch (filter) {
                case 'trending': { explore = exploreData; break; }
                case 'popular': {
                    let filteredByPeriod = [];
                    if (period === 'all time') {
                        filteredByPeriod = exploreData;
                    } else {
                        filteredByPeriod = exploreData.filter(item => (Date.now() - item.createdAt) <= getPeriod(period));
                    }
                    explore = filteredByPeriod.sort((item1, item2) => item2.likes.length - item1.likes.length)
                    break;
                }
                case 'new': {
                    explore = exploreData.sort((item1, item2) => item2.createdAt - item1.createdAt)
                    break;
                }
                case 'rising': {
                    const explore30d = exploreData.filter(item => (Date.now() - item.createdAt) <= 2592000000);
                    explore = explore30d.sort((item1, item2) => item2.likes.length - item1.likes.length)
                    break;
                }
                case 'most discussed': {
                    let filteredByPeriod = [];
                    if (period === 'all time') {
                        filteredByPeriod = exploreData;
                    } else {
                        filteredByPeriod = exploreData.filter(item => (Date.now() - item.createdAt) <= getPeriod(period));
                    }
                    explore = filteredByPeriod.sort((item1, item2) => item2.comments.length - item1.comments.length)
                    break;
                }
                default: break;
            }
        }
        res.json(explore);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch explore');
    }
});

// @route       GET api/explore/search
// @desc        Filter explore based on search query
// @access      Public
router.get('/search', async (req, res) => {
    try {
        let exploreSearch = [];
        const query = req.query.query;
        const filter = req.query.filter;
        const period = req.query.period;
        if (!filter && !period) {
            exploreData = await Explore.find({});
            exploreSearch = exploreData.filter(item => (item.title.indexOf(query) != -1) || (item.tags.find(a => a.includes(query))))
        } else {
            const exploreData = await Explore.find({});
            exploreSearch = exploreData.filter(item => (item.title.indexOf(query) != -1) || (item.tags.find(a => a.includes(query))))
            const getPeriod = (label) => {
                let value = 0;
                switch (label) {
                    case 'hour': { value = 3600000; break; }
                    case 'day': { value = 86400000; break; }
                    case 'week': { value = 604800000; break; }
                    case 'month': { value = 2592000000; break; }
                    case 'year': { value = 31556952000; break; }
                    default: break;
                }
                return value;
            }

            switch (filter) {
                case 'trending': { exploreSearch = exploreSearch; break; }
                case 'popular': {
                    let filteredByPeriod = [];
                    if (period === 'all time') {
                        filteredByPeriod = exploreSearch;
                    } else {
                        filteredByPeriod = exploreSearch.filter(item => (Date.now() - item.createdAt) <= getPeriod(period));
                    }
                    exploreSearch = filteredByPeriod.sort((item1, item2) => item2.likes.length - item1.likes.length)
                    break;
                }
                case 'new': {
                    exploreSearch = exploreSearch.sort((item1, item2) => item2.createdAt - item1.createdAt)
                    break;
                }
                case 'rising': {
                    const explore30d = exploreSearch.filter(item => (Date.now() - item.createdAt) <= 2592000000);
                    exploreSearch = explore30d.sort((item1, item2) => item2.likes.length - item1.likes.length)
                    break;
                }
                case 'most discussed': {
                    let filteredByPeriod = [];
                    if (period === 'all time') {
                        filteredByPeriod = exploreSearch;
                    } else {
                        filteredByPeriod = exploreSearch.filter(item => (Date.now() - item.createdAt) <= getPeriod(period));
                    }
                    exploreSearch = filteredByPeriod.sort((item1, item2) => item2.comments.length - item1.comments.length)
                    break;
                }
                default: break;
            }
        }
        res.json(exploreSearch);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch explore');
    }
});

// @route       Get api/explore/:id
// @desc        Fetch explore by ID along with next and prev explore
// @access      Public
router.get('/:id', async (req, res) => {
    try {
        const explore = await Explore.findById(req.params.id);
        if (!explore) {
            return res.status(400).send({ msg: 'Explore not found' });
        }
        res.json(explore);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch explore');
    }
});

// @route       Get api/explore/:id
// @desc        Fetch explore by ID along with next and prev explore
// @access      Public
router.get('/:id', async (req, res) => {
    try {
        const explore = await Explore.findById(req.params.id);
        if (!explore) {
            return res.status(400).send({ msg: 'Explore not found' });
        }
        res.json(explore);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch explore');
    }
});

// @route       POST api/explore/new
// @desc        Create an explore
// @access      Private
router.post('/new', upload.any(), async (req, res) => {
    const user = await User.findById(req.body.userID);
    const newExplore = new Explore({
        files: req.files.map(file => { return file.filename }),
        title: req.body.title,
        author: {
            id: user._id,
            username: user.username,
            avatar: user.avatar
        },
        description: req.body.description,
        tags: req.body.tags
    });
    console.log('newExplore data', newExplore);
    Explore.create(newExplore, (err, explore) => {
        if (err) {
            console.log(err);
        } else {
            user.explore.push(explore);
            user.explore_count = user.explore.length;
            user.save();
            res.send(explore);
        }
    });
});


// @route       Edit api/explore/:id
// @desc        Edit an explore
// @access      Private/Admin
router.put('/:id', function (req, res) {
    const newExploreDetails = {
        title: req.body.title,
        description: req.body.description,
    };
    console.log(newExploreDetails);
    Explore.findByIdAndUpdate(
        req.params.id,
        { $set: newData },
        function (err, explore) {
            if (err) {
                console.log(err);
            } else {
                res.send(explore);
            }
        }
    );
});

// @route       Delete api/explore/:id
// @desc        Delete an explore
// @access      Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const userID = '61cf54a666ee79691574815e';
        const users = await User.find({});
        const explore = await Explore.findById(req.params.id);
        const user = await User.findById(userID);
        if (!explore) {
            return res.status(404).send('Explore not found');
        }
        await explore.remove();
        users.map(user => {
            user.bookmarked.filter(item => item._id !== req.params.id);
            user.save();
        })
        user.explore.filter(item => item._id !== req.params.id);
        user.save();
        res.send('Explore removed successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Explore removal failed');
    }
}
);

// @route   Image Route
// @desc    Image from gridFS storage
// @access  Private
router.get('/image/:filename', (req, res) => {
    // /image/:filename?
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }
        // Check if image
        if (file.contentType === 'image/jpg' || file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
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

// @route       PUT api/explore/:id/like
// @desc        Like an explore
// @access      Public
router.put('/:id/like', async (req, res) => {
    const fetchExplore = await Explore.findById(req.params.id);
    const user = await User.findById(fetchExplore.author.id);
    try {
        Explore.findByIdAndUpdate(req.params.id, {
            $push: {
                likes: req.body.id
            }
        }, {
            new: true
        }).exec((err, like) => {
            if (err) {
                res.status(500).send('Failed to like!');
            } else {
                user.explore.find(item => item._id == req.params.id).likes.push(req.body.id);
                user.save();
                res.send(like);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to get likes count!');
    }
})

// @route       PUT api/explore/:id/dislike
// @desc        Like an explore
// @access      Public
router.put('/:id/dislike', async (req, res) => {
    const fetchExplore = await Explore.findById(req.params.id);
    const user = await User.findById(fetchExplore.author.id);
    try {
        if (!req.body.id) {
            return res.status(401).json({ msg: 'User not authorized!' })
        }
        Explore.findByIdAndUpdate(req.params.id, {
            $pull: {
                likes: req.body.id
            }
        }, {
            new: true
        }).exec((err, dislike) => {
            if (err) {
                res.status(500).send('Failed to like!');
            } else {
                user.explore.find(item => item._id == req.params.id).likes.filter(item => item !== req.body.id);
                user.save();
                res.json(dislike);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to get likes count!');
    }
})

// @route       PUT api/explore/:id/award
// @desc        Like an explore
// @access      Public
router.put('/:id/award', async (req, res) => {
    try {
        console.log('test 1', req.body)
        const user = await User.findById(req.body.userID);
        const explore = await Explore.findById(req.params.id);
        const checkAward = explore.awards.find(award => award.icon == req.body.icon);
        if (checkAward) {
            console.log('test', checkAward)
            explore.awards.find(award => award._id == req.body._id).count = explore.awards.find(award => award._id == req.body._id).count + 1;
            explore.save();
            res.send(explore);
        } else {
            Explore.findByIdAndUpdate(req.params.id, {
                $push: {
                    awards: { ...req.body, count: 1 }
                }
            }, {
                new: true,
            }).exec((err, award) => {
                if (err) {
                    res.status(500).send('Failed to award the explore!');
                } else {
                    user.tokens = user.tokens - req.body.value;
                    user.save();
                    res.send(award);
                }
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Failed to award the explore!');
    }
})

// @route       POST api/explore/:id/comments/new
// @desc        Add a new comment
// @access      Private
router.post('/:id/comments/new', async (req, res) => {
    try {
        const explore = await Explore.findById(req.params.id);
        const user = await User.findById(explore.author.id);
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
                const user_explore = user.explore.find(item => item.id === req.params.id);
                user_explore.comments.push(comment);
                user_explore.comment_count = user_explore.comments.length;
                explore.comments.push(comment);
                explore.comment_count = explore.comments.length;
                user.save();
                explore.save();
                console.log('comment', comment);
                res.json(comment);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Adding a comment failed');
    }
});

// @route       POST api/explore/:id/comments/:comment_id/reply
// @desc        Add a reply
// @access      Private
router.put('/:id/comments/:comment_id/reply', async (req, res) => {
    try {
        const explore = await Explore.findById(req.params.id);
        const comment = await Comment.findById(req.params.comment_id);
        const replyComment = explore.comments.find(comment => comment._id == req.params.comment_id);
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
                        explore.comments.filter(comment => comment._id === replyComment._id)[0].replies.push(reply);
                        explore.save();
                    }
                }
            );
        return res.json(explore.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Adding a comment failed');
    }
});

// @route    PUT api/explore/:id/comments/:comment_id
// @desc     Edit a comment
// @access   Private
router.put('/:id/comments/:comment_id', async (req, res) => {
    try {
        const explore = await Explore.findById(req.params.id);
        const editComment = explore.comments.find(comment => comment._id == req.params.comment_id);
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
                    const index = explore.comments.findIndex(comment => comment === editComment);
                    explore.comments[index] = comment;
                    console.log('edited comment', comment, index, explore.comments);
                    explore.save();
                }
            }
        );
        return res.json(explore.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Editing a comment failed');
    }
})

// @route    DELETE api/explore/:id/comments/:comment_id
// @desc     Delete a comment
// @access   Private
router.delete('/:id/comments/:comment_id', async (req, res) => {
    try {
        const explore = await Explore.findById(req.params.id);
        const comment = await Comment.findById(req.params.comment_id);
        const deleteComment = explore.comments.find(comment => comment._id == req.params.comment_id);
        if (!deleteComment) {
            return res.status(404).json({ msg: 'Comment does not exist!' });
        }

        // // Check user
        // if (explore.author.id !== deleteComment.author.id) {
        //     return res.status(401).json({ msg: 'User not authorized!' });
        // }

        explore.comments = explore.comments.filter(comment => comment._id !== deleteComment._id);
        explore.comment_count = explore.comments.length;
        comment.deleteOne(deleteComment);
        await explore.save();
        return res.json(explore.comments);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Deleting a comment failed');
    }
});

// @route       PUT api/explore/:id/comments/:comment_id/like
// @desc        Like a comment
// @access      Public
router.put('/:id/comments/:comment_id/like', async (req, res) => {
    const explore = await Explore.findById(req.params.id);
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
                console.log('EXPLORE COMMENT', explore.comments.find(comment => { return comment._id.equals(likedComment._id) }))
                explore.comments.find(comment => { return comment._id.equals(likedComment._id) }).likes.push(req.body.user.id);
                explore.save();
                res.send(likedComment);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to get likes count!');
    }
})

// @route       PUT api/explore/:id/comments/:comment_id/dislike
// @desc        Dislike a comment
// @access      Public
router.put('/:id/comments/:comment_id/dislike', async (req, res) => {
    const explore = await Explore.findById(req.params.id);
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
                let likes = explore.comments.find(comment => { return comment._id.equals(dislikedComment._id) }).likes;
                likes.splice(likes.indexOf(req.body.user.id), 1);
                explore.save();
                res.json(dislikedComment);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to get likes count!');
    }
})

export default router;
