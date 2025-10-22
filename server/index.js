import 'dotenv/config';
import express from 'express';
const app = express();

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';

import passport from './strategies/index.js';
app.use(passport.initialize());

import { notFound, errorHandler } from './middleware/errorMw.js';

// Handle Mongoose DB connection
import connectDB from './config/db_config.js';
connectDB();

// Importing api routes
import auth from './routes/auth.js';
import users from './routes/users.js';
import posts from './routes/posts.js';
import artworks from './routes/artworks.js';
import products from './routes/products.js';
import admin from './routes/admin.js';
import common from './routes/common.js';
import search from './routes/search.js';
import agents from './routes/agents.js';

console.log(process.env.NODE_ENV);

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_ORIGIN : 'http://localhost:3000',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // include Authorization header
}));

app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(express.json({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mongoSanitize());

// Rate limiting - general & auth specific
const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50
});
app.use(generalLimiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many auth attempts from this IP, try again later'
});
app.use(`/api/${process.env.API_VERSION}/auth`, authLimiter);


// Honey-token limiter
const honeyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1, // Only allow 1 request per hour
    message: 'Access denied',  // Bots hitting this will see this
    handler: (req, res, next) => {
        console.warn(`Honey-token accessed! IP: ${req.ip}, UA: ${req.headers['user-agent']}`);
        res.status(403).json({ message: 'Access denied' });
    }
});

// Honey-token endpoint
app.get(`/api/${process.env.API_VERSION}/hidden`, honeyLimiter, (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

const fakeEndpoints = ['/api/fake-1', '/api/fake-2', '/api/fake-3'];

fakeEndpoints.forEach(ep => {
    app.get(ep, honeyLimiter, (req, res) => {
        console.warn(`Honey-token hit at ${ep} by IP: ${req.ip}`);
        res.status(404).json({ message: 'Not Found' });
    });
});

app.use(passport.initialize());

// Define Routes
app.use(`/api/${process.env.API_VERSION}/posts`, posts);
app.use(`/api/${process.env.API_VERSION}/artworks`, artworks);
app.use(`/api/${process.env.API_VERSION}/auth`, auth);
app.use(`/api/${process.env.API_VERSION}/users`, users);
app.use(`/api/${process.env.API_VERSION}/products`, products);
app.use(`/api/${process.env.API_VERSION}/common`, common);
app.use(`/api/${process.env.API_VERSION}/search`, search);
app.use(`/api/${process.env.API_VERSION}/agents`, agents);

/* ################# ADMIN ROUTES ################# */
/* ################################################ */
app.use(`/admin/${process.env.API_VERSION}`, admin);

app.use('/app/download', (req, res) => {
    res.download('./public/app-release.apk');
})

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/web/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'web', 'build', 'index.html'))
    })
} else {
    app.get(`/api/${process.env.API_VERSION}`, (req, res) => {
        res.send("API is running..");
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running`));