import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import { notFound, errorHandler } from './middleware/errorMw.js';

import connectDB from './config/db.js';

import './strategies/JwtStrategy.js';
import './strategies/GoogleStrategy.js';
import './utils/authenticate.js';

//Importing routes
import auth from './routes/auth.js';
import users from './routes/users.js';
import artworks from './routes/artworks.js';
// import search from './routes/search.js';
import store from './routes/store.js';
import admin from './routes/admin.js';
import common from './routes/common.js';

dotenv.config();
//Database Connection Established
connectDB();

import { taggergfs } from './config/gridfsconfig.js';

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

const currentVersion = 'v1.01';
const adminVersion = 'v1.01';

// Define Routes
app.use(`/api/${currentVersion}/artworks`, artworks);
app.use(`/api/${currentVersion}/auth`, auth);
app.use(`/api/${currentVersion}/users`, users);
app.use(`/api/${currentVersion}/store`, store);
app.use(`/api/${currentVersion}/common`, common);

app.get(`/api/${currentVersion}/tagger/:filename`, (req, res) => {
    try {
        // /image/:filename?
        taggergfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if json or bin file
            if (file.contentType === 'application/json' || file.contentType === 'application/octet-stream') {
                // Read output to browser
                const readstream = taggergfs.createReadStream({
                    filename: req.params.filename,
                });
                readstream.pipe(res);
            } else {
                res.status(404).json({ err: 'Not a tagger file' });
            }
        });
    } catch (err) {
        return res.status(404).json({ msg: err.name });
    }
});

// app.use('/api/tagger/:filename', async (req, res) => {
//     try {
//         const __dirname = path.resolve();
//         res.sendFile(__dirname + '/tagger/' + req.params.filename);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Unable to fetch explore');
//     }
// })

/* ################# ADMIN ROUTES ################# */
app.use(`/admin/${currentVersion}`, admin);

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