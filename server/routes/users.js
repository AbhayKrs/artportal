import express from 'express';
const router = express.Router();
import User from '../models/user.js';
import Explore from '../models/explore.js';
import Comment from '../models/comment.js';
import Common from '../models/common.js';
import Cart from '../models/cart.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
    validateLoginInput,
    validateRegisterInput
} from '../utils/authenticate.js';
import mongoose from 'mongoose';

//Importing gfs database
import multer from 'multer';
import Grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';

//Connect gfs to database
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('assets');
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
                    bucketName: 'assets',
                };
                resolve(fileInfo);
            });
        });
    },
});
const asset = multer({ storage });

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', async (req, res) => {
    const type = req.query.type;
    const users = await User.find({});
    if (type === 'seller') {
        let sellers = users.filter(user => user.seller);
        res.json(sellers);
    } else {
        res.json(users);
    }
});

// @desc    Get all tags
// @route   GET /api/users/tags
// @access  Public
router.get("/tags", async (req, res) => {
    const common = await Common.find({});
    console.log('common', common[0].tags);
    res.json(common[0].tags);
});

// @desc    Get all tags
// @route   GET /api/users/commonImages
// @access  Public
router.get("/commonImages", async (req, res) => {
    const common = await Common.find({});
    console.log('loginImage', common[0].images);
    res.json(common[0].images);
});

// @desc    Get all tags
// @route   GET /api/users/assets/
// @access  Public
router.get('/avatars', async (req, res) => {
    const common = await Common.findOne();
    res.json(common.avatars);
});

router.get('/awards', async (req, res) => {
    const common = await Common.findOne();
    res.json(common.awards);
});

// @desc    Get all tags
// @route   GET /api/users/assets/new
// @access  Public
router.post('/assets/new', asset.single('file'), async (req, res) => {
    //Add awards
    // const common = await Common.findOne();
    // const asset = {
    //     icon: req.file.filename,
    //     title: ''
    // }
    // common.awards.push(asset);
    // common.save();

    //Add avatars
    // const common = await Common.findOne();
    // const asset = {
    //     icon: req.file.filename,
    //     category: 'Female'
    // }
    // common.avatars.push(asset);
    // common.save();

    //Add login and signup image
    // const common = await Common.findOne();
    // common.images.signup = req.file.filename;
    // common.save();
});

// //@desc         Auth user and get token
// //@route        POST /api/users/login
// //@access       Public
router.post("/login", async (req, res) => {
    let userList = [];
    const username = req.body.username;
    const password = req.body.password;

    await User.find({}).then(users => {
        userList.push(...users)
    });

    const { errors, isValid } = validateLoginInput(userList, req.body);
    if (!isValid) { return res.status(400).json(errors) }

    User.findOne({ username }).then(user => {
        if (!user) {
            return res.status(404).json('User not found!')
        }
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                let comment_count = 0;
                const comment_countList = user.explore.map(item => item.comment_count);
                for (let i = 0; i < comment_countList.length; i++)
                    comment_count += comment_countList[i];
                console.log('user details', comment_countList, comment_count);
                const payload = {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    tokens: user.tokens,
                    followers: user.followers,
                    followers_count: user.followers_count,
                    explore_count: user.explore_count,
                    comment_count
                };
                jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res.status(400).json("Incorrect Password. Please try again!");
            }
        });
    });
});


//@desc         Register a new user 
//@route        POST /api/users/register
//@access       Public
router.post("/signup", (req, res) => {
    // Verify that first name is not empty
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ username: req.body.username }).then(user => {
        if (user) {
            return res.status(400).json('User already exists');
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                avatar: {
                    icon: '92845b9c51df0d6bf3cf693393cc0905.png',
                    category: 'None'
                }
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    })
});

// @desc    Login via Google
// @route   GET /api/users/googleAuth
// @access  Private
router.get('/googleAuth', passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
}));

// @desc    Login via Google
// @route   GET /api/users/googleAuth/success
// @access  Private
router.get('/googleAuth/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/google_failed',
    session: false
}), async (req, res) => {
    const authenticatedUser = await User.findOne({ id: req.user.id });
    console.log('authenticatedUser', authenticatedUser);
    let comment_count = 0;
    const comment_countList = authenticatedUser.explore.length > 0 && authenticatedUser.explore.map(item => item.comment_count);
    for (let i = 0; i < comment_countList.length; i++)
        comment_count += comment_countList[i];
    const payload = {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        avatar: authenticatedUser.avatar,
        tokens: authenticatedUser.tokens,
        followers: authenticatedUser.followers,
        followers_count: authenticatedUser.followers_count,
        explore_count: authenticatedUser.explore_count,
        comment_count
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 },
        (err, token) => {
            let googleToken = "Bearer " + token
            res.redirect('http://localhost:3000/google_success?auth=' + googleToken)
        }
    );
})

// @desc    Login via Facebook
// @route   GET /api/users/facebookAuth
// @access  Private
router.get('/facebookAuth', passport.authenticate('facebook', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
}));

// @desc    Login via Google
// @route   GET /api/users/googleAuth/success
// @access  Private
router.get('/facebookAuth/callback', passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:3000/google_failed',
    session: false
}), async (req, res) => {
    const authenticatedUser = await User.findOne({ id: req.user.id });
    console.log('authenticatedUser', authenticatedUser);
    let comment_count = 0;
    const comment_countList = authenticatedUser.explore.length > 0 && authenticatedUser.explore.map(item => item.comment_count);
    for (let i = 0; i < comment_countList.length; i++)
        comment_count += comment_countList[i];
    const payload = {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        avatar: authenticatedUser.avatar,
        tokens: authenticatedUser.tokens,
        followers: authenticatedUser.followers,
        followers_count: authenticatedUser.followers_count,
        explore_count: authenticatedUser.explore_count,
        comment_count
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 },
        (err, token) => {
            let googleToken = "Bearer " + token
            res.redirect('http://localhost:3000/google_success?auth=' + googleToken)
        }
    );
})

// @desc    Login via Google
// @route   GET /api/users/googleAuth
// @access  Private
router.get('/googleAuth', passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
}));

// @desc    Login via Google
// @route   GET /api/users/googleAuth/success
// @access  Private
router.get('/googleAuth/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/google_failed',
    session: false
}), async (req, res) => {
    const authenticatedUser = await User.findOne({ id: req.user.id });
    console.log('authenticatedUser', authenticatedUser);
    let comment_count = 0;
    const comment_countList = authenticatedUser.explore.length > 0 && authenticatedUser.explore.map(item => item.comment_count);
    for (let i = 0; i < comment_countList.length; i++)
        comment_count += comment_countList[i];
    const payload = {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        avatar: authenticatedUser.avatar,
        tokens: authenticatedUser.tokens,
        followers: authenticatedUser.followers,
        followers_count: authenticatedUser.followers_count,
        explore_count: authenticatedUser.explore_count,
        comment_count
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 },
        (err, token) => {
            let googleToken = "Bearer " + token
            res.redirect('http://localhost:3000/google_success?auth=' + googleToken)
        }
    );
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res) => {
    const user = await User.findById(req.user._id);
    console.log('user details', user);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    console.log('user', user)
    let comment_count = 0;
    const comment_countList = user.explore.map(item => item.comment_count);
    for (let i = 0; i < comment_countList.length; i++)
        comment_count += comment_countList[i];
    const payload = {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        tokens: user.tokens,
        followers: user.followers,
        followers_count: user.followers_count,
        explore: user.explore,
        explore_count: user.explore_count,
        likes: user.likes,
        comment_count
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 }, (err, token) => {
        res.json({
            success: true,
            token: "Bearer " + token
        });
    })
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
    User.updateOne({ _id: req.params.id }, {
        seller_rating: 0,
        ysr: 0,
        store: [],
        store_count: 0
    }, { multi: true }, function (err, raw) {
        if (err) {
            console.log(err);
        } else {
            console.log(raw)
        }
    });
    const user = User.findById(req.params.id);
    res.json(user)

    // if (user) {
    //     user.seller = true;
    //     user.seller_rating = 0;
    //     res.json(user);
    //     // user.name = req.body.name || user.name;
    //     // user.username = req.body.username || user.username;
    //     // user.email = req.body.email || user.email;
    //     // user.avatar = req.body.avatar || user.avatar;
    //     // user.isAdmin = req.body.isAdmin;
    //     // const updatedUser = await user.save();

    //     // res.json({
    //     //     _id: updatedUser._id,
    //     //     name: updatedUser.name,
    //     //     username: updatedUser.username,
    //     //     email: updatedUser.email,
    //     //     avatar: updatedUser.avatar,
    //     //     isAdmin: updatedUser.isAdmin,
    //     // });
    // } else {
    //     res.status(404);
    //     throw new Error('User not found');
    // }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @route       GET api/users/:id/cart
// @desc        Get all cart items
// @access      Public
router.get('/:id/explore', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user.explore) {
            return res.status(400).send({ msg: 'Explorelist not found' });
        }
        const exploreData = {
            explore: user.explore,
            explore_count: user.explore_count
        }
        res.json(exploreData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch explore list');
    }
});

// @route       POST api/users/:id/bookmark
// @desc        Bookmark an explore
// @access      Private
router.post('/:id/bookmark', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send({ msg: 'User not found' });
        }
        const bookmarkData = {
            id: req.body.id,
            title: req.body.title,
            author: req.body.author,
            description: req.body.description
        }
        user.bookmarked.push(bookmarkData);
        user.save();
        res.json(bookmarkData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Bookmark failed!');
    }

})

// @route       GET api/users/:id/cart
// @desc        Get all cart items
// @access      Public
router.get('/:id/store', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user.store) {
            return res.status(400).send({ msg: 'Storelist not found' });
        }
        const storeData = {
            store: user.store,
            store_count: user.store_count
        }
        res.json(storeData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch store items');
    }
});

// ******************** CART CALLS *****************************
// *************************************************************

// @route       GET api/users/:id/cart
// @desc        Get all cart items
// @access      Public
router.get('/:id/cart', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
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

// @route       POST api/users/:id/cart/add
// @desc        Add to cart
// @access      Public
router.post('/:id/cart/add', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log('body', req.body);
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

// @route    PUT api/users/:id/cart/:cart_id
// @desc     Edit a cart item
// @access   Private
router.put('/:id/cart/:cart_id', async (req, res) => {
    const user = await User.findById(req.params.id);
    const editCartItem = user.cart.find(cartItem => cartItem._id == req.params.cart_id);
    if (!editCartItem) {
        return res.status(401).json({ msg: 'Cart item does not exist!' })
    }
    // // Check user
    // if (explore.author.id !== editComment.author.id) {
    //     return res.status(401).json({ msg: 'User not authorized!' });
    // }
    console.log('edit cart item', req.body);
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
})

// @route    DELETE api/users/:id/cart/:cart_id
// @desc     Delete a cart item
// @access   Private
router.delete('/:id/cart/:cart_id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const cartItem = await Cart.findById(req.params.cart_id);
        const deleteCartItem = user.cart.find(cartItem => cartItem._id == req.params.cart_id);
        if (!deleteCartItem) {
            return res.status(404).json({ msg: 'Cart item does not exist!' });
        }
        user.cart = user.cart.filter(cartItem => cartItem._id !== deleteCartItem._id);
        cartItem.deleteOne(deleteCartItem);
        user.cart_count = user.cart.length;
        await user.save();
        return res.json(user.cart);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Deleting a cart item failed');
    }
});

// @desc    Logout user
// @route   GET /api/users/logout
// @access  Public
router.get("/logout", (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    console.log('logout refreshToken', req.user);
    User.findById(req.user._id).then(
        (user) => {
            const tokenIndex = user.refreshToken.findIndex(
                (item) => item.refreshToken === refreshToken
            );
            if (tokenIndex !== -1) {
                user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
            }

            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500;
                    res.send(err);
                } else {
                    res.clearCookie("refreshToken", COOKIE_OPTIONS);
                    res.send({ success: true });
                }
            });
        },
        (err) => next(err)
    );
});

// @route   Image Route
// @desc    Image from gridFS storage - /api/users/image/:filename
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

// @route   Edit User Avatar
// @desc    POST /api/users/:id/avatar
// @access  Private
router.post('/:id/avatar', async (req, res) => {
    const user = await User.findById(req.params.id);
    const explore = await Explore.find({ "author.id": req.params.id });

    explore.map(item => {
        item.author.avatar = { ...req.body };
        item.save();
    });
    Explore.updateMany(
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
    res.json(explore);
})

export default router;