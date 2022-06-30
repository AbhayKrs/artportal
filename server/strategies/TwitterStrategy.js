import passport from "passport";
import twitterstrategy from 'passport-twitter';

const TwitterStrategy = twitterstrategy.Strategy;

passport.use(
    new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: "/api/users/twitterAuth/callback"
    },
        function (token, tokenSecret, profile, cb) {
            User.findOrCreate({ twitterId: profile.id }, function (err, user) {
                return cb(err, user);
            });
        }
    ));