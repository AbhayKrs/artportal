import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

//Importing gfs database
import multer from 'multer';
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';

//Import Schemas
import User from '../models/user.js';
import Artworks from '../models/artwork.js';
import Store from '../models/store.js';
const { Artwork, Comment } = Artworks;

import { adminKey } from '../middleware/adminMw.js';

//Connect gfs to database
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('tagger');
});

//GridFs Storage DB - Artwork Categorisation model files
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

// @route   GET admin/v1.01/ --- Admin API active --- ADMIN
router.get('/', adminKey, async (req, res) => {
    try {
        res.send("Admin API access approved...");
    } catch (err) {
        res.status(500).send('Admin API access rejected...');
    }
})

// @route   GET admin/v1.01/users --- Fetch all users --- ADMIN
router.get('/users', adminKey, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET admin/v1.01/users --- Delete a user --- ADMIN
router.delete('/users/:id', adminKey, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.remove();
            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET admin/v1.01/artworks --- Fetch all artworks --- ADMIN
router.get('/artworks', adminKey, async (req, res) => {
    try {
        const artworks = await Artwork.find({});
        res.json(artworks);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET admin/v1.01/store --- Fetch all store items --- ADMIN
router.get('/store', adminKey, async (req, res) => {
    try {
        const items = await Store.find({});
        res.json(items);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET admin/v1.01/model_categories --- Fetch categorisation model files --- ADMIN
router.get('/model_categories', adminKey, (req, res) => {
    try {
        gfs.files.find().toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'No files found'
                });
            }
            res.status(200).json({
                success: true,
                files
            })
        })
    } catch (err) {
        return res.status(404).json(err);
    }
});

// @route   GET admin/v1.01/model_categories/:filename --- Fetch categorisation model image --- ADMIN
router.get('/model_categories/:filename', adminKey, (req, res) => {
    try {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
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
        return res.status(404).json({ msg: err });
    }
});

// @route   GET admin/v1.01/model_categories/new --- Add categorisation model image --- ADMIN
router.post('/model_categories/new', adminKey, tagger.any(), async (req, res) => {
    try {
        console.log('categorisation model image uploaded successfully...');
        res.send('success');
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

export default router;
