import passport from "passport";
import jwtStrategy from "./jwtStrategy.js";
import googleStrategy from "./googleStrategy.js";

jwtStrategy(passport);
googleStrategy(passport);

export default passport;