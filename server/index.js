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
import users from './routes/users.js';
import explore from './routes/explore.js';
import store from './routes/store.js';
import articles from './routes/articles.js';

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

// Define Routes
app.use('/api/explore', explore);
app.use('/api/users', users);
app.use('/api/store', store);
app.use('/api/articles', articles);

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running`));