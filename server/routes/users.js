import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

//Middleware
import { protect, admin } from '../middleware/authMw.js';
import { checkObjectId } from '../middleware/checkObjectId.js';

import User from '../models/user.js';
import Artworks from '../models/artwork.js';
import Cart from '../models/cart.js';
const { Artwork, Comment } = Artworks;

import jwt from 'jsonwebtoken';

// @route   GET api/v1.01/users --- Fetch all artworks --- Public
router.get('/', async (req, res) => {
    try {
        let response = [];
        let searchResponse = [];

        const type = req.query.type; // list, search, verified
        const value = req.query.filter; // searchVal 
        const userList = await User.find({});

        switch (type) {
            case 'list': {
                response = userList;
                break;
            }
            case 'search': {
                searchResponse = userList.filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) != -1 || item.username.toLowerCase().indexOf(value.toLowerCase()) != -1);
                response = searchResponse;

            }
            case 'verified': {
                response = userList.filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) != -1 || item.username.toLowerCase().indexOf(value.toLowerCase()) != -1);
            }
            default: { response = userList }
        }
        res.json(response);
    } catch (err) {
        res.status(500).send('Unable to fetch artworks data');
    }
});

// @route   GET api/v1.01/users/:id ---  Get user by ID --- PUBLIC
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        const payload = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            tokens: user.tokens,
            google_authenticated: user.google_authenticated,
            is_verified: user.is_verified,
            is_premium: user.is_premium,
            followers: user.followers,
            followering: user.following,
            bookmarks: user.bookmarks,
            created_on: user.createdAt,
            premium_validity: user.premium_validity
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 }, (err, token) => {
            res.json({
                success: true,
                token: token
            });
        })
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   PUT api/v1.01/users/:id ---  Update user with ID --- PRIVATE
router.put('/:id', protect, async (req, res) => {
    try {
        User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            username: req.body.username,
            bio: req.body.bio
        }, function (err, data) {
            if (err) {
                console.log('error:', err);
            } else {
                return res.json(data)
            }
        });

    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/users/:id/artworks --- Get all cart items --- PUBLIC
router.get('/:id/artworks', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        if (!user) {
            return res.status(400).send({ msg: 'User not found' });
        }

        const artworks = await Artwork.find({ "artist": req.params.id }).populate('artist', 'name username avatar');
        const artworksData = {
            artworks: artworks,
            artworks_count: artworks.length
        }
        res.json(artworksData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch artworks list');
    }
});

// @route   POST api/v1.01/users/:id/bookmark --- Add artwork to bookmarks --- PUBLIC
router.post('/:id/bookmark', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        if (!user) {
            return res.status(400).send({ msg: 'User not found' });
        }
        user.bookmarks.push(req.body.artworkID);
        user.save();
        res.json("Success!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Bookmark failed!');
    }
})

// @route   DELETE api/v1.01/users/:id/bookmark --- Delete artwork from bookmarks --- PUBLIC
router.delete('/:id/bookmark/:bookmark_id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        const bookmark_toDelete = await user.bookmarks.find(bookmark => bookmark._id === req.params.bookmark_id);
        if (!bookmark_toDelete) {
            return res.status(400).send({ msg: 'Bookmark does not exist!' });
        }
        user.bookmarks = user.bookmarks.filter(bookmark => bookmark._id !== bookmark_toDelete._id);
        await user.save();
        res.json(user.bookmarks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Bookmark failed!');
    }
})

// @route   GET api/v1.01/users/:id/store --- Fetch store listings of user --- PUBLIC
router.get('/:id/products', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        if (!user.products) {
            return res.status(400).send({ msg: 'Products not found' });
        }
        const productData = {
            products: user.products,
            products_count: user.products_count
        }
        res.json(productData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch products');
    }
});

// ******************** CART CALLS *****************************
// *************************************************************

// @route   GET api/v1.01/users/:id/cart --- Fetch cart of user --- PUBLIC
router.get('/:id/cart', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        console.log("user", user)
        if (!user.cart) {
            return res.status(400).send({ msg: 'Cartlist not found' });
        }
        const cartData = {
            cart: user.cart,
            cart_count: user.cart_count
        }
        res.json(cartData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch cart items');
    }
});

// @route   POST api/v1.01/users/:id/cart/add --- Add the listing to cart --- PUBLIC
router.post('/:id/cart/add', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        if (!user) {
            return res.status(401).json({ msg: 'User not authorized!' })
        }
        const newCartItem = new Cart({
            title: req.body.title,
            file: req.body.file,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            subtotal: req.body.subtotal,
            seller: {
                id: user.id,
                username: user.username
            }
        });
        Cart.create(newCartItem, (err, cartItem) => {
            if (err) {
                console.log(err);
            } else {
                cartItem.save();
                user.cart.push(cartItem);
                user.cart_count = user.cart.length;
                user.save();
                res.json(cartItem);
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Adding to cart failed');
    }
});

// @route   PUT api/v1.01/users/:id/cart/:cart_id --- Update the listing in cart --- PUBLIC
router.put('/:id/cart/:cart_id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        const editCartItem = user.cart.find(cartItem => cartItem._id === req.params.cart_id);
        if (!editCartItem) {
            return res.status(401).json({ msg: 'Cart item does not exist!' })
        }
        // // Check user
        // if (library.author.id !== editComment.author.id) {
        //     return res.status(401).json({ msg: 'User not authorized!' });
        // }
        const newData = { quantity: req.body.quantity, subtotal: req.body.subtotal }
        await Cart.findByIdAndUpdate(
            req.params.cart_id,
            { quantity: newData.quantity, subtotal: newData.subtotal },
            { new: true },
            async (err, cartItem) => {
                if (err) {
                    console.log(err)
                } else {
                    const index = user.cart.findIndex(cartItem => cartItem === editCartItem);
                    user.cart[index] = cartItem;
                    await user.save();
                }
            }
        );
        return res.json(user.cart);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
})

// @route   DELETE api/v1.01/users/:id/cart/:cart_id --- Delete the listing in cart --- PUBLIC
router.delete('/:id/cart/:cart_id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        const cartItem = await Cart.findById(req.params.cart_id);
        const a_handleRemoveFromCart = user.cart.find(cartItem => cartItem._id === req.params.cart_id);
        if (!a_handleRemoveFromCart) {
            return res.status(404).json({ msg: 'Cart item does not exist!' });
        }
        user.cart = user.cart.filter(cartItem => cartItem._id !== a_handleRemoveFromCart._id);
        cartItem.deleteOne(a_handleRemoveFromCart);
        user.cart_count = user.cart.length;
        await user.save();
        return res.json(user.cart);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Deleting a cart item failed');
    }
});

// @route   PUT api/v1.01/users/:id/cart/:cart_id --- Update user avatar --- PUBLIC
router.put('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('bookmarks');
        const artwork = await Artwork.find({ "author.id": req.params.id });

        artwork.map(item => {
            item.author.avatar = { ...req.body };
            item.save();
        });
        Artwork.updateMany(
            { 'comments.author.id': req.params.id },
            { $set: { "comments.$[comment].author.avatar": req.body } },
            { arrayFilters: [{ 'comment.author.id': { $in: req.params.id } }] }
        ).then(item => {
            console.log('Success!', item);
        }).catch(err => {
            console.log('Error - ' + err);
        });
        user.avatar = { ...req.body };
        user.save();
        res.json(artwork);
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

export default router;
