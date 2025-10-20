import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

//Middleware
import { protect, admin } from '../middleware/authMw.js';
import { checkObjectId } from '../middleware/checkObjectId.js';

import User from '../models/user.js';
import Products from '../models/product.js';
import Artwork from '../models/artwork.js';
import Comment from '../models/comment.js';
import Cart from '../models/cart.js';
const { Product } = Products;

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
router.get('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: "artwork_bookmarks",
            model: "Artwork",
            select: "title description files categories artist tags likes"
        });
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
            following: user.following,
            bookmarks: user.artwork_bookmarks,
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

// @route   GET api/v1.01/users/:id/view ---  Get user by ID --- PUBLIC
router.get('/:id/view', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: "artwork_bookmarks",
            model: "Artwork",
            select: "title description files categories artist tags likes"
        });
        const artworks = await Artwork.find({ "artist": req.params.id }).populate('artist', 'name username avatar');

        const response = {
            id: user._id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            is_verified: user.is_verified,
            is_premium: user.is_premium,
            artworks,
            followers: user.followers.length,
            following: user.following.length,
            artwork_bookmarks: user.artwork_bookmarks,
        };
        res.json(response);
    } catch (err) {
        console.log("err", err)
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

// @route   GET api/v1.01/users/:id/store --- Fetch store listings of user --- PUBLIC
router.get('/:id/products', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: "artwork_bookmarks",
            model: "Artwork",
            select: "title description files categories artist tags likes"
        });
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
        const user = await User.findById(req.params.id);
        const cart = await Cart.findOne({ customer_id: user._id }).populate({
            path: "items.product",
            model: "Product",
            select: "title description images category seller price discount_price" // choose fields you want
        });
        if (!cart) {
            return res.status(400).send({ msg: 'Cartlist not found' });
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch cart items');
    }
});

// @route   POST api/v1.01/users/:id/cart/add --- Add the listing to cart --- PUBLIC
router.post('/:id/cart/add', async (req, res) => {
    try {
        const { productID, quantity } = req.body;

        const user = await User.findById(req.params.id);
        const product = await Product.findById(productID);
        if (!user) {
            return res.status(401).json({ msg: 'Not a valid user!' })
        }

        let cart = await Cart.findOne({ customer_id: user._id });
        if (!cart) {
            cart = new Cart({
                customer_id: user._id,
                items: [],
                subtotal: 0
            });
        }

        const item_exists = cart.items.find(item => item.id.toString() == productID);

        if (item_exists) {
            item_exists.quantity += quantity;
        } else {
            cart.items.push({
                id: new mongoose.Types.ObjectId(productID),
                product: productID,
                quantity
            });
        }
        cart.subtotal += product.price * quantity;
        await cart.save();

        res.status(200).json({ message: "Item added to cart successfully" });
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).send('Internal Server Error');
    }
});

// @route   POST api/v1.01/users/:id/cart/remove --- Remove the listing from cart --- PUBLIC
router.post('/:id/cart/remove', async (req, res) => {
    try {
        const { productID, quantity } = req.body;

        const user = await User.findById(req.params.id);
        const product = await Product.findById(productID);
        if (!user) {
            return res.status(401).json({ msg: 'Not a valid user!' })
        }

        let cart = await Cart.findOne({ customer_id: user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item_index = cart.items.findIndex(item => item.id.toString() == productID);

        if (item_index === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        const item = cart.items[item_index];
        item.quantity -= quantity;
        cart.subtotal -= product.price * quantity;

        if (item.quantity <= 0) {
            cart.items.splice(item_index, 1);
            cart.subtotal = 0;
        }

        await cart.save();

        res.status(200).json({ message: "Item added to cart successfully" });
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).send('Internal Server Error');
    }
});

// @route   PUT api/v1.01/users/:id/cart/:cart_id --- Update user avatar --- PUBLIC
router.put('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: "artwork_bookmarks",
            model: "Artwork",
            select: "title description files categories artist tags likes"
        });
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
