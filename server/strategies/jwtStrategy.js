import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from '../models/user.js';

export default (passport) => {
    try {
        passport.use(
            new JwtStrategy({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET
            }, async (payload, done) => {
                try {
                    const user = await User.findById(payload.id);
                    return user ? done(null, user) : done(null, false, { message: 'Invalid User!' });
                } catch (err) {
                    return done(err, false);
                }
            })
        );
    } catch (err) {
        return err;
    }
}