import express from 'express';
import bcrypt from 'bcryptjs';
import passport from "../strategies/index.js";
import User from '../models/user.js';
import { generateAccessToken, generateRefreshToken, validateLoginInput, validateOAuthUser, validateRegisterInput, verifyRefreshToken } from '../utils/authenticate.js';

const router = express.Router();

// @route   GET api/v1.01/auth/login --- Login user and fetch authentication token --- PUBLIC
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await User.find({});
        const user = await User.findOne({ username }).populate("bookmarks");
        if (!user) return res.status(404).json('User not found!');

        const { errors: loginErrors, isValid: isLoginValid } = validateLoginInput(users, req.body);
        if (!isLoginValid) { return res.status(400).json(loginErrors) }

        const { errors: oauthErrors, isValid: isOAuthValid } = validateOAuthUser(user);
        if (!isOAuthValid) { return res.status(400).json(oauthErrors) }

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) return res.status(400).json({ error: "Incorrect Password. Please try again!" });

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
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
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
                    followering: user.following,
                    bookmarks: user.bookmarks,
                    created_on: user.createdAt,
                    premium_validity: user.premium_validity
                };

                const accessToken = generateAccessToken(jwtPayload);
                const refreshToken = generateRefreshToken(jwtPayload);

                user.refreshToken = refreshToken;
                await user.save();

                res.cookie("jwt", refreshToken, {
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
router.post("/refresh ", async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;
        if (!refreshToken) return res.sendStatus(401);

        // Verify token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user and match token in DB
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.sendStatus(403);
        }

        // Rotate refresh token
        const newRefreshToken = generateRefreshToken(user);
        user.refreshToken = newRefreshToken;
        await user.save();

        // Send new refresh token as cookie
        res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Issue new access token
        const accessToken = generateAccessToken(user);
        res.json({ success: true, token: accessToken });
    } catch (err) {
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
        bio: user.bio,
        avatar: user.avatar,
        created_on: user.createdAt,
        premium_validity: user.premium_validity,
        tokens: user.tokens,
        google_authenticated: user.google_authenticated,
        followers: user.followers,
        bookmarks: user.bookmarks
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend with access token
    res.redirect(`${process.env.FRONTEND_URL}/google_success?auth=${accessToken}`);
})

// @route   POST api/v1.01/auth/logout --- Logout the user --- PUBLIC
router.post("/logout", async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        res.clearCookie("jwt", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
        res.json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;