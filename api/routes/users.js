import express from 'express';
const router = express.Router();
import User from '../models/user.js';
import Common from '../models/common.js';
import Cart from '../models/cart.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
    validateLoginInput,
    validateRegisterInput
} from '../utils/authenticate.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', async (req, res) => {
    const { signedCookies = {} } = req;
    console.log('signedCookies', signedCookies);
    const users = await User.find({});
    res.json(users);
});

// @desc    Get all tags
// @route   GET /api/users/tags
// @access  Public
router.get("/tags", async (req, res) => {
    const common = await Common.find({});
    console.log('common', common[0].tags);
    res.json(common[0].tags);
});

// // @desc    Get all tags
// // @route   GET /api/users/tags
// // @access  Public
// router.post("/tags", async (req, res) => {
//     const tagData = [
//         { text: 'cartoonlist' },
//         { text: 'illustration' },
//         { text: 'myart' }
//     ]
//     const newCommon = new Common({
//         tags: tagData
//     });
//     console.log('newCommon data', newCommon);
//     Common.create(newCommon, (err, common) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.send(common);
//         }
//     });
//     res.json(common);
// });

// //@desc         Auth user and get token
// //@route        POST /api/users/login
// //@access       Public
router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) { return res.status(400).json(errors) }
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username }).then(user => {
        if (!user) {
            return res.status(404).json({ usernotfound: 'User not found!' })
        }
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // User matched - Create JWT Payload
                console.log('user details', user);
                const payload = {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
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
                return res.status(400).json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

router.post("/refreshToken", (req, res, next) => {
    const { signedCookies } = req;
    const { refreshToken } = signedCookies
    if (refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const userId = payload._id;
            User.findOne({ _id: userId })
                .then(
                    (user) => {
                        if (user) {
                            // Find the refresh token against the user record in database
                            const tokenIndex = user.refreshToken.findIndex(
                                (item) => item.refreshToken === refreshToken
                            );
                            if (tokenIndex === -1) {
                                res.statusCode = 401;
                                res.send("Unauthorized_one");
                            } else {
                                const token = getToken({ _id: userId });
                                // If the refresh token exists, then create new one and replace it.
                                const newRefreshToken = getRefreshToken({ _id: userId });
                                user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
                                user.save((err, user) => {
                                    if (err) {
                                        res.statusCode = 500;
                                        res.send(err);
                                    } else {
                                        res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
                                        res.send({ success: true, token });
                                    }
                                });
                            }
                        } else {
                            res.statusCode = 401;
                            res.send("Unauthorized_two");
                        }
                    },
                    (err) => next(err)
                );
        } catch (err) {
            res.statusCode = 401;
            res.send("Unauthorized_three");
        }
    } else {
        res.statusCode = 401;
        res.send("Unauthorized_four");
    }
});

// //@desc         Register a new user
// //@route        POST /api/users/register
// //@access       Public
router.post("/signup", (req, res) => {
    // Verify that first name is not empty
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ username: req.body.username }).then(user => {
        if (user) {
            return res.status(400).json({ username: 'User already exists' });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
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
            username: updateUser.username,
            email: updatedUser.email,
            avatar: updateUser.avatar,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
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

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', (req, res, next) => {
    res.send(req.user);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;
        user.isAdmin = req.body.isAdmin;
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updateUser.avatar,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @route       GET api/users/:id/cart
// @desc        Get all cart items
// @access      Public
router.get('/:id/artworks', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user.artworks) {
            return res.status(400).send({ msg: 'Artworklist not found' });
        }
        const artworkData = {
            artworks: user.artworks,
            artwork_count: user.artwork_count
        }
        res.json(artworkData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Unable to fetch artwork list');
    }
});

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
            price: req.body.price,
            quantity: req.body.quantity,
            subtotal: req.body.subtotal,
            seller: {
                id: user.id,
                username: user.username
            }
        });
        console.log(newCartItem);
        Cart.create(newCartItem, (err, cartItem) => {
            if (err) {
                console.log(err);
            } else {
                cartItem.save();
                user.cart.push(cartItem);
                user.cart_count = user.cart.length;
                user.save();
                console.log('user', user.cart);
                console.log('cartItem', cartItem);
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
    // if (artwork.author.id !== editComment.author.id) {
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
    console.log('logout refreshToken', refreshToken);
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

export default router;
