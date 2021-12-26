import express from 'express';
import { check } from 'express-validator';
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
import Store from '../models/store.js';
import Comment from '../models/comment.js';
import User from '../models/user.js';
import Cart from '../models/cart.js';

//Connect gfs to database
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

let gfs;

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
                    bucketName: 'uploads',
                };
                resolve(fileInfo);
            });
        });
    },
});
const upload = multer({ storage });

// @route       GET api/store
// @desc        Get all store items
// @access      Public
router.get('/', async (req, res) => {
    try {
        const artworks = await Store.find({});
        console.log('get artworks', artworks);
        if (!artworks) {
            return res.status(400).send({ msg: 'Artworks not found' });
        }
        res.json(artworks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch artworks');
    }
});

// @route       POST api/store/new
// @desc        Publish on store
// @access      Private
router.post('/new', upload.single('file'),
    [
        check('filename', 'File is required').notEmpty(),
        check('title', 'Please include a title').notEmpty(),
        check('description', 'Please include a description').notEmpty(),
    ], async (req, res) => {
        console.log('user id', req.body.userId);
        const user = await User.findById(req.body.userId);
        const newStoreItem = new Store({
            title: req.body.title,
            item: req.file.filename,
            description: req.body.description,
            seller: {
                id: user.id,
                username: user.username,
                // avatar: req.body.user.avatar,
                isSeller: true,
                // seller_rating: req.body.user.rating
            },
            price: req.body.price,
            rating: req.body.rating,
            tags: req.body.tags
        });
        console.log('newStoreItem data', newStoreItem);
        Store.create(newStoreItem, (err, item) => {
            if (err) {
                console.log(err);
            } else {
                res.send(item);
            }
        });
    }
);

// @route       Get api/store/:id
// @desc        Fetch store item by ID
// @access      Public
router.get('/:id', async (req, res) => {
    try {
        const storeItem = await Store.findById(req.params.id);
        if (!storeItem) {
            return res.status(400).send({ msg: 'Store Item not found' });
        }
        res.json(storeItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch store item');
    }
});

// @route       Edit api/store/:id
// @desc        Edit a store item
// @access      Private/Admin
router.put('/:id', function (req, res) {
    const newStoreItemDetails = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    };
    console.log(newStoreItemDetails);
    Store.findByIdAndUpdate(
        req.params.id,
        { $set: newData },
        function (err, storeItem) {
            if (err) {
                console.log(err);
            } else {
                res.send(storeItem);
            }
        }
    );
});

// @route       Delete api/store/:id
// @desc        Delete a store item
// @access      Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const storeItem = await Store.findById(req.params.id);
        if (!storeItem) {
            return res.status(404).send('Store item not found');
        }
        await storeItem.remove();
        res.send('Store item removed successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Store item removal failed');
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

export default router;
