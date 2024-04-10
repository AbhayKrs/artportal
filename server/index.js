import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import connectDB from './config/db.js';
import './strategies/JwtStrategy.js';
import './strategies/GoogleStrategy.js';
import './utils/authenticate.js';

//Importing routes
import tagger from './routes/tagger.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import artworks from './routes/artworks.js';
// import search from './routes/search.js';
import store from './routes/store.js';

dotenv.config();
//Database Connection Established
connectDB();


const app = express();
app.use(cors());
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

//Init Middleware
app.use(express.json({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//User Authentication
app.use(passport.initialize());

const currentVersion = 'v1';

// Define Routes
// app.use('/api/tagger/:filename', async (req, res) => {
//     try {
//         const __dirname = path.resolve();
//         res.sendFile(__dirname + '/tagger/' + req.params.filename);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Unable to fetch explore');
//     }
// })

app.use(`/api/${currentVersion}/tagger`, tagger);
app.use(`/api/${currentVersion}/artworks`, artworks);
app.use(`/api/${currentVersion}/auth`, auth);
app.use(`/api/${currentVersion}/users`, users);
app.use(`/api/${currentVersion}/store`, store);
// app.use(`/api/${currentVersion}/search`, search);

app.use('/app/download', (req, res) => {
    res.download('./server/public/app-release.apk');
})


if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
} else {
    app.get(`/api/${currentVersion}`, (req, res) => {
        res.send("API is running..");
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running`));