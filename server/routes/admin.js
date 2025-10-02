import express from 'express';
const router = express.Router();

//Import Schemas
import User from '../models/user.js';
import Artworks from '../models/artwork.js';
import Store from '../models/product.js';
const { Artwork, Comment } = Artworks;

import { adminKey } from '../middleware/adminMw.js';

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

export default router;
