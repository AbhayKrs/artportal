import Validator from 'validator';
import jwt from 'jsonwebtoken';

const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // short-lived
    );
};

const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } // long-lived
    );
};

const verifyRefreshToken = (token) => {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
};

const validateOAuthUser = (user) => {
    let errors = '';
    if (user.google_authenticated && !user.password) {
        errors = "This account was created via Google. Please login using OAuth or set a new password.";
    }
    return { errors, isValid: Validator.isEmpty(errors) };
}

const validateLoginInput = (users, data) => {
    let errors = '';
    let usernameList = users.map(item => { return item.username });
    if (Validator.isEmpty(data.username) || !Validator.isIn(data.username, usernameList)) {
        // Username checks
        errors = "The entered username or email does not match to an existing user.";
    } else if (Validator.isEmpty(data.password)) {
        // Password checks
        errors = "Password field is required";
    }
    // isStrongPassword(data.password,{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 })
    return { errors, isValid: Validator.isEmpty(errors) };
}

const validateRegisterInput = (userData) => {
    let errors = '';
    if (Validator.isEmpty(userData.name) || !Validator.isAlpha(userData.name, 'en-US', { ignore: " " })) {
        errors = 'Please enter a valid name for your account.'
    } else if (Validator.isEmpty(userData.username) || !Validator.isAlphanumeric(userData.username, 'en-US', { ignore: '-[]{}.()*_:' })) {
        errors = 'Please enter a valid username for your account.'
    } else if (Validator.isEmpty(userData.name) || !Validator.isEmail(userData.email)) {
        errors = 'Please enter a valid email for your account.'
    } else if (Validator.isEmpty(userData.password) || !Validator.isStrongPassword(userData.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false })) {
        errors = 'Please enter a valid password for your account.'
    } else if (!Validator.equals(userData.password, userData.password2)) {
        errors = 'Confirm Password and Password mismatch!'
    }

    return { errors, isValid: Validator.isEmpty(errors) };
}


export { generateAccessToken, generateRefreshToken, verifyRefreshToken, validateOAuthUser, validateLoginInput, validateRegisterInput }