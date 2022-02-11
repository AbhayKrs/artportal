import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import passportLocal from 'passport-local';
// import flash from 'connect-flash';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import path from 'path';

import connectDB from './config/db.js';
import './strategies/JwtStrategy.js';
// import './strategies/LocalStrategy.js';
import './utils/authenticate.js';

//Importing routes
import users from './routes/users.js';
import artworks from './routes/artworks.js';
import store from './routes/store.js';

dotenv.config();
//Database Connection Established
connectDB();

const app = express();
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Init Middleware
app.use(express.json({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//User Authentication
app.use(passport.initialize());

// Define Routes
app.use('/api/artworks', artworks);
app.use('/api/users', users);
app.use('/api/store', store);

// const __dirname = path.resolve();
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '/client/build')));

//     app.get('*', (req, res) =>
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     );
// } else {
app.get('/', (req, res) => {
    res.send('API is running...');
});
// }

app.use(notFound);
app.use(errorHandler);

// //Serve static assets if in production
// if (process.env.NODE_ENV === 'prod') {
//     //set static folder
//     app.use(express.static('client/build'));
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     })
// }

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running`));