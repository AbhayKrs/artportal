import passport from 'passport';
import googlestrategy from 'passport-google-oauth2';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const GoogleStrategy = googlestrategy.Strategy;

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/users/googleAuth/callback",
        passReqToCallback: true,
        proxy: true
    }, (request, accessToken, refreshToken, profile, done) => {
        console.log('enter')
        //Check user table for anyone with the Google ID
        User.findOne({ email: profile.email }, (err, user) => {
            if (!user) {
                console.log('test no existing user', user)
                const newUser = new User({
                    id: profile.id,
                    google_authenticated: true,
                    name: profile.displayName,
                    email: profile.email,
                    username: profile.email.substring(0, profile.email.indexOf("@")),
                    password: 'test12',
                    avatar: {
                        icon: '92845b9c51df0d6bf3cf693393cc0905.png',
                        category: 'None'
                    }
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(res => {
                            return done(null, profile);
                        });
                    })
                })
            } else {
                console.log('test existing user')
                if (user.google_authenticated === false) {
                    user.id = profile.id;
                    user.google_authenticated = true;
                    user.save().then(res => {
                        return done(null, profile)
                    });
                } else
                    return done(err, profile)
            }
        })
    })
)