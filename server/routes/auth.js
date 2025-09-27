import express from 'express';
import bcrypt from 'bcryptjs';
import passport from "../strategies/index.js";
import User from '../models/user.js';
import { generateAccessToken, generateRefreshToken, validateLoginInput, validateOAuthUser, validateRegisterInput, verifyRefreshToken } from '../utils/authenticate.js';

const router = express.Router();

// @route   POST api/v1.01/auth/login --- Login user and fetch authentication token --- PUBLIC
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const users = await User.find({});
        const user = await User.findOne({ username }).populate("bookmarks");
        if (!user) return res.status(401).json('User not found!');

        const { errors: loginErrors, isValid: isLoginValid } = validateLoginInput(users, req.body);
        if (!isLoginValid) { return res.status(401).json(loginErrors) }

        const { errors: oauthErrors, isValid: isOAuthValid } = validateOAuthUser(user);
        if (!isOAuthValid) { return res.status(401).json(oauthErrors) }

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) return res.status(401).json({ error: "Incorrect Password. Please try again!" });

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
            bookmarks: user.bookmarks,
            created_on: user.createdAt,
            premium_validity: user.premium_validity
        };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refresh_token = refreshToken;
        await user.save();

        res.cookie("token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            success: true,
            token: accessToken
        });
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/auth/signup --- Signup user and fetch authentication token --- PUBLIC
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, name } = req.body;

        // Verify that first name is not empty
        const { errors, isValid } = validateRegisterInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            username,
            password: hashedPassword,
            avatar: {
                icon: '6cbaa37fa59b0caee31dc4b8cdd67d72.png',
                category: 'None'
            },
            tokens: 5000
        });

        newUser.save()
            .then(async user => {
                const jwtPayload = {
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
                    bookmarks: user.bookmarks,
                    created_on: user.createdAt,
                    premium_validity: user.premium_validity
                };

                const accessToken = generateAccessToken(jwtPayload);
                const refreshToken = generateRefreshToken(jwtPayload);

                user.refresh_token = refreshToken;
                await user.save();

                res.cookie("token", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                res.json({
                    success: true,
                    token: accessToken
                });
            })
            .catch(err => {
                res.status(500).json({ error: err.message });
            });
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/auth/refresh  --- Checks refresh token is valid and still stored in DB --- PUBLIC
router.post("/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies.token;
        if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

        // Verify token
        const decoded = await verifyRefreshToken(refreshToken);

        // Find user and match token in DB
        const user = await User.findOne({ _id: decoded.id }).populate('bookmarks');
        console.log("test", refreshToken);
        console.log("test", user.refresh_token);

        if (!user || !user.refresh_token || user.refresh_token !== refreshToken) {
            return res.status(403).json({ msg: "Invalid token" });
        }
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
            bookmarks: user.bookmarks,
            created_on: user.createdAt,
            premium_validity: user.premium_validity
        };
        // Rotate refresh token
        const accessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        user.refresh_token = newRefreshToken;
        await user.save();

        // Send new refresh token as cookie
        res.cookie("token", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            success: true,
            token: accessToken
        });
    } catch (err) {
        console.log("err: ", err);
        return res.status(403).json({ msg: err.name });
    }
});

// @route   GET api/v1.01/auth/google --- Authenticate user via Google --- PUBLIC
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// @route   GET api/v1.01/auth/google/callback --- Google Authenticatation callback --- PUBLIC
router.get('/google/callback', passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
}), async (req, res) => {
    const user = await User.findOne({ _id: req.user.id }).populate('bookmarks');
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
        bookmarks: user.bookmarks,
        created_on: user.createdAt,
        premium_validity: user.premium_validity
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refresh_token = refreshToken;
    await user.save();

    res.cookie("token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // Redirect to frontend with access token
    res.redirect(`${process.env.FRONTEND_ORIGIN}`);
})

// @route   POST api/v1.01/auth/logout --- Logout the user --- PUBLIC
router.post("/logout", async (req, res) => {
    try {
        const refreshToken = req.cookies.token;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refresh_token = '';
                await user.save();
            }
        }

        res.clearCookie("token");
        res.clearCookie("hasSession");
        res.json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;