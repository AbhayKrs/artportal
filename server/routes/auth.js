import express from 'express';
const router = express.Router();
import User from '../models/user.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
    validateLoginInput,
    validateRegisterInput
} from '../utils/authenticate.js';

// //@desc         Auth user and get token
// //@route        POST /api/users/login
// //@access       Public
router.post("/login", async (req, res) => {
    try {
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
                    const payload = {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        avatar: user.avatar,
                        bio: user.bio,
                        tokens: user.tokens,
                        google_authenticated: user.google_authenticated,
                        isPremium: user.isPremium,
                        followers: user.followers,
                        followering: user.following,
                        bookmarks: user.bookmarks,
                        created_on: user.createdAt
                    };
                    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 43200000 },
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
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

//@desc         Register a new user 
//@route        POST /api/users/register
//@access       Public
router.post("/signup", (req, res) => {
    try {
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
                                    isPremium: user.isPremium,
                                    followers: user.followers,
                                    followering: user.following,
                                    bookmarks: user.bookmarks,
                                    created_on: user.createdAt,
                                };
                                jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 43200000 },
                                    (err, token) => {
                                        res.json({
                                            success: true,
                                            token: "Bearer " + token
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
    const authenticatedUser = await User.findOne({ google_id: req.user.id });
    const payload = {
        id: authenticatedUser._id,
        name: authenticatedUser.name,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        bio: authenticatedUser.bio,
        avatar: authenticatedUser.avatar,
        created_on: authenticatedUser.createdAt,
        tokens: authenticatedUser.tokens,
        google_authenticated: authenticatedUser.google_authenticated,
        followers: authenticatedUser.followers,
        bookmarks: authenticatedUser.bookmarks
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
    const payload = {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        bio: authenticatedUser.bio,
        avatar: authenticatedUser.avatar,
        created_on: authenticatedUser.createdAt,
        tokens: authenticatedUser.tokens,
        followers: authenticatedUser.followers,
        bookmarks: authenticatedUser.bookmarks
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 },
        (err, token) => {
            let googleToken = "Bearer " + token
            res.redirect('http://localhost:3000/google_success?auth=' + googleToken)
        }
    );
})

export default router;