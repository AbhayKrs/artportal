import express from 'express';
const router = express.Router();

import { storegfs, storeUpl } from '../config/gridfsconfig.js'

//Middleware
import { protect, admin } from '../middleware/authMw.js';
import { checkObjectId } from '../middleware/checkObjectId.js';

//Import Schemas
import Store from '../models/store.js';
import User from '../models/user.js';
import { storeBucket } from '../config/gridfs_config.js';

// @route   GET api/v1.01/store --- Fetch all store listings --- PUBLIC
router.get('/', async (req, res) => {
    try {
        let store = [];
        const category = req.query.category;
        if (!category) {
            store = await Store.find({});
        } else {
            const storeData = await Store.find({});
            store = storeData.filter(item => item.category === category);
        }
        res.send(store);
    } catch (err) {
        res.status(500).send('Unable to fetch store');
    }
});

// @route   POST api/v1.01/store/new --- Post new store listing --- PUBLIC
router.post('/new', storeUpl.any(), async (req, res) => {
    const user = await User.findById(req.body.userID);
    const newStoreItem = new Store({
        title: req.body.title,
        files: req.files.map(file => { return file.filename }),
        description: req.body.description,
        seller: {
            id: user.id,
            username: user.username,
            avatar: user.avatar
        },
        price: req.body.price,
        rating: req.body.rating,
        category: req.body.category
    });
    Store.create(newStoreItem, (err, storeItem) => {
        if (err) {
            console.log(err);
        } else {
            user.store.push(storeItem);
            user.store_count = user.store.length;
            user.save();
            res.send(storeItem);
        }
    });
}
);

// @route   GET api/v1.01/store/:id --- Fetch store listing by id --- PUBLIC
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

// @route   PUT api/v1.01/store/:id --- Edit store listing by id --- PUBLIC
router.put('/:id', function (req, res) {
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

// @route   DELETE api/v1.01/store/:id --- Delete store listing by id --- PUBLIC
router.delete('/:id', async (req, res) => {
    try {
        const storeItem = await Store.findById(req.params.id);
        const user = await User.findById(req.body.userID);
        const deleteListing = user.store.find(storeItem => storeItem._id === req.params.id);

        if (!storeItem) {
            return res.status(404).send('Store item not found');
        }
        await storeItem.remove();
        user.store = user.store.filter(storeItem => storeItem._id !== deleteListing._id);
        user.store_count = user.store.length;
        await user.save();
        res.json('Store item removed successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Store item removal failed');
    }
}
);

// @route   GET api/v1.01/store/image/:filename --- Fetch image of store listing --- PUBLIC
router.get('/image/:filename', async (req, res) => {
    const { filename } = req.params;

    try {
        const file = await storeBucket.find({ filename }).toArray();
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file found' });
        }
        storeBucket.openDownloadStreamByName(filename).pipe(res);
    } catch (err) {
        console.log("err", err);
        return res.status(404).json({ msg: err.name });
    }
});

export default router;
