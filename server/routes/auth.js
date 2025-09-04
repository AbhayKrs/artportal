import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

import User from '../models/user.js';
import { validateLoginInput, validateRegisterInput } from '../utils/authenticate.js';

// @route   GET api/v1.01/auth/login --- Login user and fetch authentication token --- PUBLIC
router.post("/login", async (req, res) => {
    try {
        let userList = [];
        const username = req.body.username;
        const password = req.body.password;

        await User.find({})

            .populate('bookmarks')
            .then(users => {
                userList.push(...users)
            });

        const { errors, isValid } = validateLoginInput(userList, req.body);
        if (!isValid) { return res.status(400).json(errors) }

        User.findOne({ username })

            .populate('bookmarks')
            .then(user => {
                if (!user) {
                    return res.status(404).json('User not found!')
                }
                bcrypt.compare(password, user.password).then((isMatch) => {
                    if (isMatch) {
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
                        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 43200000 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: token
                                });
                            }
                        );
                    } else {
                        return res.status(400).json("Incorrect Password. Please try again!");
                    }
                });
            });
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/auth/signup --- Signup user and fetch authentication token --- PUBLIC
router.post("/signup", (req, res) => {
    try {
        // Verify that first name is not empty
        const { errors, isValid } = validateRegisterInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        User.findOne({ username: req.body.username })

            .populate('bookmarks')
            .then(user => {
                if (user) {
                    return res.status(400).json('User already exists');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password,
                        avatar: {
                            icon: '6cbaa37fa59b0caee31dc4b8cdd67d72.png',
                            category: 'None'
                        },
                        tokens: 5000
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    console.log('user', user);
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
                                    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 43200000 },
                                        (err, token) => {
                                            res.json({
                                                success: true,
                                                token: token
                                            });
                                        }
                                    )
                                })
                                .catch(err => console.log(err));
                        })
                    })
                }
            })
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/auth/google/login --- Authenticate user via Google --- PUBLIC
router.get('/google/login', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// @route   GET api/v1.01/auth/google/callback --- Google Authenticatation callback --- PUBLIC
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
}), async (req, res) => {
    const authenticatedUser = await User.findOne({ _id: req.user.id }).populate('bookmarks');
    const payload = {
        id: authenticatedUser._id,
        name: authenticatedUser.name,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        bio: authenticatedUser.bio,
        avatar: authenticatedUser.avatar,
        created_on: authenticatedUser.createdAt,
        premium_validity: authenticatedUser.premium_validity,
        tokens: authenticatedUser.tokens,
        google_authenticated: authenticatedUser.google_authenticated,
        followers: authenticatedUser.followers,
        bookmarks: authenticatedUser.bookmarks
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 },
        (err, token) => {
            let googleToken = token
            res.redirect('http://localhost:3000/google_success?auth=' + googleToken)
        }
    );
})

// @route   GET api/v1.01/auth/facebook/login --- Authenticate user via Facebook --- PUBLIC
router.get('/facebook/login', passport.authenticate('facebook', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
}));

// @route   GET api/v1.01/auth/facebook/callback --- Facebook Authenticatation callback --- PUBLIC
router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:3000/google_failed',
    session: false
}), async (req, res) => {
    const authenticatedUser = await User.findOne({ id: req.user.id }).populate('bookmarks');
    const payload = {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        bio: authenticatedUser.bio,
        avatar: authenticatedUser.avatar,
        created_on: authenticatedUser.createdAt,
        premium_validity: authenticatedUser.premium_validity,
        tokens: authenticatedUser.tokens,
        followers: authenticatedUser.followers,
        bookmarks: authenticatedUser.bookmarks
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 },
        (err, token) => {
            let googleToken = token
            res.redirect('http://localhost:3000/google_success?auth=' + googleToken)
        }
    );
})

// @route   POST api/v1.01/auth/logout --- Logout the user --- PUBLIC
router.post("/logout", (req, res, next) => {
    try {
        const { signedCookies = {} } = req;
        const { refreshToken } = signedCookies;
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
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

export default router;