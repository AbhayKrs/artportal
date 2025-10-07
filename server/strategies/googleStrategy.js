import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from '../models/user.js';

export default (passport) => {
    try {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callbackURL: "/api/v1.01/auth/google/callback",
                    passReqToCallback: true,
                    proxy: true
                },
                async function (request, accessToken, refreshToken, profile, done) {
                    try {
                        let user = await User.findOne({ google_id: profile.id });
                        if (!user) {
                            //User does not exist in DB, create a new user entry with google creds
                            user = await User.create({
                                google_id: profile.id,
                                name: profile.displayName,
                                email: profile.emails[0].value,
                                username: profile.emails[0].value.substring(0, profile.emails[0].value.indexOf("@")),
                                avatar: {
                                    icon: '6cbaa37fa59b0caee31dc4b8cdd67d72.png',
                                    category: 'None'
                                },
                                google_authenticated: true,
                                is_verified: true
                            });
                        }
                        return done(null, user)
                    } catch (err) {
                        console.log("Google err: ", err)
                        return done(err, false);
                    }
                })
        )
    } catch (err) {
        console.log("err", err);
        return err;
    }
}