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

import Article from '../models/articles.js';
import User from '../models/user.js';

//Connect gfs to database
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('articles');
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
                    bucketName: 'articles'
                };
                resolve(fileInfo);
            });
        });
    },
});
const article = multer({ storage });

// @route       GET api/articles
// @desc        Get all articles
// @access      Public
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find({});
        if (!explore) {
            return res.status(400).send({ msg: 'Articles not found' });
        }
        res.json(articles);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch articles');
    }
});

// @route       Get api/articles/:id
// @desc        Fetch article by ID
// @access      Public
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(400).send({ msg: 'Explore not found' });
        }
        res.json(article);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch article');
    }
});

router.get('/post', article.any(), async (req, res) => {
    const user = await User.findById(req.body.userID);
    console.log('form data', req.files, req.body);
    const newExplore = new Explore({
        files: req.files.map(file => { return file.filename }),
        title: req.body.title,
        author: {
            id: user.id,
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
}
);

export default router;