import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

//Importing gfs database
import multer from 'multer';
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';

//Connect gfs to database
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('tagger');
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
                // const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: file.originalname,
                    bucketName: 'tagger'
                };
                resolve(fileInfo);
            });
        });
    },
});
const tagger = multer({ storage });


// router.get('/', (req, res) => {
//     try {
//         gfs.files.find().toArray((err, files) => {
//             if (!files || files.length === 0) {
//                 return res.status(200).json({
//                     success: false,
//                     message: 'No files found'
//                 });
//             }
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
router.get('/:filename', async (req, res) => {
    try {
        await gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
                return res.status(404).json({ err: 'No file exists' });
            }
            if (file.contentType === 'application/octet-stream' || file.contentType === 'application/json') {
                // Read output to browser
                const readstream = gfs.createReadStream({
                    filename: req.params.filename,
                });
                console.log(readstream);
                readstream.pipe(res);
            } else {
                res.status(404).json({ err: 'Not an image' });
            }
        });
    } catch (err) {
        alert(err);
        return res.status(404).json({ msg: err });
    }
});

// @route       POST api/tagger/new
// @desc        Create an tagger
// @access      Private
router.post('/new', tagger.any(), async (req, res) => {
    try {
        console.log('tagger successfully uploaded');
        res.send('success');
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

export default router;