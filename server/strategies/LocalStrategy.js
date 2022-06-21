import passport from 'passport';
import localstrategy from 'passport-local';
import User from '../models/user.js';

const LocalStrategy = localstrategy.Strategy;

//Called during login/sign up.
passport.use(new LocalStrategy(User.authenticate()));

//called while after logging in / signing up to set user details in req.user
passport.serializeUser(User.serializeUser());