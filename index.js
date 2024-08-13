import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import { notFound, errorHandler } from './server/middleware/errorMw.js';

import connectDB from './server/config/db_config.js';

import './server/strategies/JwtStrategy.js';
import './server/strategies/GoogleStrategy.js';
import './server/utils/authenticate.js';

//Importing routes
import auth from './server/routes/auth.js';
import users from './server/routes/users.js';
import artworks from './server/routes/artworks.js';
// import search from './routes/search.js';
import store from './server/routes/store.js';
import admin from './server/routes/admin.js';
import common from './server/routes/common.js';
import search from './server/routes/search.js';

dotenv.config();
//Database Connection Established
connectDB();

import { taggergfs } from './server/config/gridfsconfig.js';

const app = express();
app.use(cors());

app.use(express.json({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
} else {
    app.get(`/api/${process.env.API_VERSION}`, (req, res) => {
        res.send("API is running..");
    });
}

// Define Routes
app.use(`/api/${process.env.API_VERSION}/artworks`, artworks);
app.use(`/api/${process.env.API_VERSION}/auth`, auth);
app.use(`/api/${process.env.API_VERSION}/users`, users);
app.use(`/api/${process.env.API_VERSION}/store`, store);
app.use(`/api/${process.env.API_VERSION}/common`, common);
app.use(`/api/${process.env.API_VERSION}/search`, search);

app.get(`/api/${process.env.API_VERSION}/tagger/:filename`, (req, res) => {
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

/* ################# ADMIN ROUTES ################# */
/* ################################################ */
app.use(`/admin/${process.env.API_VERSION}`, admin);

app.use('/app/download', (req, res) => {
    res.download('./server/public/app-release.apk');
})

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running`));