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
    gfs.collection('explore_uploads');
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
                    bucketName: 'tagger'
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

// @route       GET api/explore
// @desc        Get all explore
// @access      Public
router.get('/', async (req, res) => {
    try {
        let explore = [];
        const filter = req.query.filter;
        const period = req.query.period;
        explore = await Explore.find({});
        res.json(explore);
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Unable to fetch explore');
    }
});

export default router;
