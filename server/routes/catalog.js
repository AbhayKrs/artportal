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
import Catalog from '../models/catalog.js';
import Comment from '../models/comment.js';
import User from '../models/user.js';

//Connect gfs to database
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('catalog_uploads');
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
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'catalog_uploads'
                };
                resolve(fileInfo);
            });
        });
    },
});
const upload = multer({ storage });


// router.get('/images', (req, res) => {
//     try {
//         gfs.files.find().toArray((err, files) => {
//             if (!files || files.length === 0) {
//                 return res.status(200).json({
//                     success: false,
//                     message: 'No files found'
//                 });
//             }
//             files.map(file => {
//                 if (file.contentType === 'image/jpg' || file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/webp') {
//                     file.isImage = true;
//                 } else {
//                     file.isImage = false;
//                 }
//             });
//             res.status(200).json({
//                 success: true,
//                 files
//             })
//         })
//     } catch (err) {
//         return res.status(404).json(err);
//     }
// })

// @route   Image Route
// @desc    Image from gridFS storage
// @access  Private
router.get('/image/:filename', (req, res) => {
    try {
        // /image/:filename?
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
                return res.status(404).json({ err: 'No file exists' });
            }
            // Check if image
            if (file.contentType === 'image/jpg' || file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/webp') {
                // Read output to browser
                const readstream = gfs.createReadStream({
                    filename: req.params.filename,
                });
                readstream.pipe(res);
            } else {
                res.status(404).json({ err: 'Not an image' });
            }
        });
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route       GET api/catalog
// @desc        Get all catalog
// @access      Public
router.get('/', async (req, res) => {
    try {
        let catalog = [];
        const filter = req.query.filter;
        const period = req.query.period;
        if (!filter && !period) {
            catalog = await Catalog.find({});
        } else {
            const catalogData = await Catalog.find({});
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
                case 'trending': { catalog = catalogData; break; }
                case 'popular': {
                    let filteredByPeriod = [];
                    if (period === 'all time') {
                        filteredByPeriod = catalogData;
                    } else {
                        filteredByPeriod = catalogData.filter(item => (Date.now() - item.createdAt) <= getPeriod(period));
                    }
                    catalog = filteredByPeriod.sort((item1, item2) => item2.likes.length - item1.likes.length)
                    break;
                }
                case 'new': {
                    catalog = catalogData.sort((item1, item2) => item2.createdAt - item1.createdAt)
                    break;
                }
                case 'rising': {
                    const catalog30d = catalogData.filter(item => (Date.now() - item.createdAt) <= 2592000000);
                    catalog = catalog30d.sort((item1, item2) => item2.likes.length - item1.likes.length)
                    break;
                }
                case 'most discussed': {
                    let filteredByPeriod = [];
                    if (period === 'all time') {
                        filteredByPeriod = catalogData;
                    } else {
                        filteredByPeriod = catalogData.filter(item => (Date.now() - item.createdAt) <= getPeriod(period));
                    }
                    catalog = filteredByPeriod.sort((item1, item2) => item2.comments.length - item1.comments.length)
                    break;
                }
                default: break;
            }
        }
        res.json(catalog);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch catalog data');
    }
});

// @route       GET api/catalog/search
// @desc        Filter catalog based on search query
// @access      Public
router.get('/search', async (req, res) => {
    try {
        let catalogSearchData = [];
        const type = req.query.type;
        const value = req.query.value;
        const filter = req.query.filter;
        const period = req.query.period;
        console.log("test", type, value, !!filter, !!period);
        const catalogData = await Catalog.find({});

        console.log('---catalogData', catalogData)

        switch (type) {
            case 'artwork': {
                catalogSearchData = catalogData.filter(item => item.title.toLowerCase().indexOf(value.toLowerCase()) != -1)
                break;
            }
            case 'tag': {
                catalogSearchData = catalogData.filter(item => item.tags.find(a => a.includes(value)))
                break;
            }
            case 'artist': {
                catalogSearchData = catalogData.filter(item => item.author.name.toLowerCase().indexOf(value.toLowerCase()) != -1 || item.author.username.toLowerCase().indexOf(value.toLowerCase()) != -1)
                break;
            }
        }

        // catalogSearchData = catalogData.filter(item => (item.title.indexOf(query) != -1) || (item.tags.find(a => a.includes(query))))

        // if (!!filter && !!period) {
        //     const getPeriod = (label) => {
        //         let value = 0;
        //         switch (label) {
        //             case 'hour': { value = 3600000; break; }
        //             case 'day': { value = 86400000; break; }
        //             case 'week': { value = 604800000; break; }
        //             case 'month': { value = 2592000000; break; }
        //             case 'year': { value = 31556952000; break; }
        //             default: break;
        //         }
        //         return value;
        //     }

        //     switch (filter) {
        //         case 'trending': { catalogSearchData = catalogSearchData; break; }
        //         case 'popular': {
        //             let filteredByPeriod = [];
        //             if (period === 'all time') {
        //                 filteredByPeriod = catalogSearchData;
        //             } else {
        //                 filteredByPeriod = catalogSearchData.filter(item => (Date.now() - item.createdAt) <= getPeriod(period));
        //             }
        //             catalogSearchData = filteredByPeriod.sort((item1, item2) => item2.likes.length - item1.likes.length)
        //             break;
        //         }
        //         case 'new': {
        //             catalogSearchData = catalogSearchData.sort((item1, item2) => item2.createdAt - item1.createdAt)
        //             break;
        //         }
        //         case 'rising': {
        //             const catalogData_30d = catalogSearchData.filter(item => (Date.now() - item.createdAt) <= 2592000000);
        //             catalogSearchData = catalogData_30d.sort((item1, item2) => item2.likes.length - item1.likes.length)
        //             break;
        //         }
        //         case 'most discussed': {
        //             let filteredByPeriod = [];
        //             if (period === 'all time') {
        //                 filteredByPeriod = catalogSearchData;
        //             } else {
        //                 filteredByPeriod = catalogSearchData.filter(item => (Date.now() - item.createdAt) <= getPeriod(period));
        //             }
        //             catalogSearchData = filteredByPeriod.sort((item1, item2) => item2.comments.length - item1.comments.length)
        //             break;
        //         }
        //         default: break;
        //     }
        // }
        res.json(catalogSearchData);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch search data');
    }
});

// @route       Get api/catalog/:id
// @desc        Fetch catalog by ID along with next and prev catalog
// @access      Public
router.get('/:id', async (req, res) => {
    try {
        const catalogItem = await Catalog.findById(req.params.id);
        if (!catalogItem) {
            return res.status(400).send({ msg: 'Catalog item not found' });
        }
        res.json(catalogItem);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch catalog item');
    }
});

// @route       POST api/catalog/new
// @desc        Create a catalog entry
// @access      Private
router.post('/new', upload.any(), async (req, res) => {
    try {
        const user = await User.findById(req.body.userID);
        const newCatalogItem = new Catalog({
            artist: { id: user._id, name: user.name, username: user.username, avatar: user.avatar },
            files: req.files.map(file => { return file.filename }),
            title: req.body.title,
            description: req.body.description,
            categories: req.body.categories,
            tags: req.body.tags,
            views: []
        });
        Catalog.create(newCatalogItem, (err, catalogItem) => {
            if (err) {
                console.log(err);
            } else {
                res.send(catalogItem);
            }
        });
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route       POST api/catalog/new
// @desc        Create a catalog entry
// @access      Private
router.post('/upload', upload.any(), async (req, res) => {
    try {
        const user = await User.findById(req.body.userID);

        req.files.map(file => {
            const newCatalogItem = new Catalog({
                artist: { id: user._id, name: user.name, username: user.username, avatar: user.avatar },
                files: file.filename,
                title: "title_" + file.filename,
                description: "description_" + file.filename,
                categories: ["concept_art", "architectural_art"],
                tags: ["art", "myart"],
                views: []
            });
            Catalog.create(newCatalogItem, (err, catalogItem) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(catalogItem);
                }
            });
        })
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});


// @route       Edit api/explore/:id
// @desc        Edit an explore
// @access      Private/Admin
router.put('/:id', function (req, res) {
    try {
        const updatedDetails = {
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags
        };
        console.log(updatedDetails)
        Catalog.findByIdAndUpdate(
            req.params.id,
            { $set: updatedDetails },
            function (err, catalogItem) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(catalogItem);
                }
            }
        );
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route       Delete api/explore/:id
// @desc        Delete an explore
// @access      Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        gfs.remove({ _id: req.params.id, root: 'catalog_uploads' }, async (err, files) => {
            if (err) {
                return res.status(404).json({ err: err })
            } else {
                const users = await User.find({});
                const catalogItem = await Catalog.findById(req.params.id);
                const user = await User.findById(catalogItem.author.id);
                if (!catalogItem) {
                    return res.status(404).send('Explore not found');
                }
                await user.save();
                users.map(user => {
                    if (user.bookmarked.some(item => item._id === req.params.id)) {
                        user.bookmarked = [...user.bookmarked.filter(item => item._id != req.params.id)];
                        console.log('test', user.bookmarked)
                        user.save();
                    }
                })
                await catalogItem.remove();
                res.send('Explore removed successfully');
            }
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Explore removal failed');
    }
}
);

router.put('/:id/viewed', async (req, res) => {
    try {
        const catalogItem = await Catalog.findById(req.params.id);
        const viewer_ip = req.body.viewer_id;
        if (viewer_ip.length > 0) {
            catalogItem.views.indexOf(viewer_ip) === -1 ?
                catalogItem.views.push(viewer_ip)
                :
                null;
            catalogItem.save();
        }
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
})

// @route       PUT api/explore/:id/like
// @desc        Like an explore
// @access      Public
router.put('/:id/like', async (req, res) => {
    try {
        try {
            Catalog.findByIdAndUpdate(req.params.id, {
                $push: {
                    likes: req.body.id
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
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
})

// @route       PUT api/explore/:id/dislike
// @desc        Like an explore
// @access      Public
router.put('/:id/dislike', async (req, res) => {
    try {
        try {
            if (!req.body.id) {
                return res.status(401).json({ msg: 'User not authorized!' })
            }
            Catalog.findByIdAndUpdate(req.params.id, {
                $pull: {
                    likes: req.body.id
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
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
})

// @route       PUT api/explore/:id/award
// @desc        Like an explore
// @access      Public
router.put('/:id/award', async (req, res) => {
    try {
        const catalogItem = await Catalog.findById(req.params.id);
        const isAwardExist = catalogItem.awards.find(award => award.icon === req.body.icon);
        if (isAwardExist) {
            catalogItem.awards.find(award => award._id === req.body._id).count = catalogItem.awards.find(award => award._id === req.body._id).count + 1;
            catalogItem.save();
            res.send(catalogItem);
        } else {
            Catalog.findByIdAndUpdate(req.params.id, {
                $push: {
                    awards: { ...req.body, count: 1 }
                }
            }, {
                new: true,
            }).exec((err, award) => {
                if (err) {
                    res.status(500).send('Failed to award the explore!');
                } else {
                    res.send(award);
                }
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Failed to award the explore!');
    }
});

// @route       POST api/explore/:id/comments/new
// @desc        Add a new comment
// @access      Private
router.post('/:id/comments/new', async (req, res) => {
    try {
        const catalogItem = await Catalog.findById(req.params.id);
        if (!req.body.user) {
            return res.status(401).json({ msg: 'User not authorized!' })
        }
        const newComment = new Comment({
            content: req.body.content,
            author: {
                id: req.body.user.id,
                name: req.body.user.name,
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
        const replyComment = explore.comments.find(comment => comment._id === req.params.comment_id);
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
        const editComment = explore.comments.find(comment => comment._id === req.params.comment_id);
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
        const deleteComment = explore.comments.find(comment => comment._id === req.params.comment_id);
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
    try {
        const explore = await Explore.findById(req.params.id);
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
    try {
        const explore = await Explore.findById(req.params.id);
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
