import passport from 'passport';
import dotenv from 'dotenv';
import jwtstrategy from 'passport-jwt';
import User from '../models/user.js';
const JwtStrategy = jwtstrategy.Strategy;
const ExtractJwt = jwtstrategy.ExtractJwt;
dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne(jwt_payload.id)
            .then((user) => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch((err) => console.log(err));
    })
);