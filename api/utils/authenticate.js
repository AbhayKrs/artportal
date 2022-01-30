import Validator from 'validator';
import isEmpty from 'is-empty';

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

    return { errors, isValid: isEmpty(errors) };
}

const validateRegisterInput = (userData) => {
    let errors = '';

    if (Validator.isEmpty(userData.name) || !Validator.isAlpha(userData.name, 'en-US', { ignore: " " })) {
        errors = 'Please enter a valid Name for your account!'
    } else if (Validator.isEmpty(userData.username) || !Validator.isAlphanumeric(userData.username, 'en-US', { ignore: '-[]{}.()*_:' })) {
        errors = 'Please enter a valid Username for your account!'
    } else if (Validator.isEmpty(userData.name) || !Validator.isEmail(userData.email)) {
        errors = 'Please enter a valid Email for your account!'
    } else if (Validator.isEmpty(userData.password) || !Validator.isStrongPassword(userData.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false })) {
        errors = 'Please enter a valid password for your account!'
    } else if (!Validator.equals(userData.password, userData.password2)) {
        errors = 'Confirm Password does not match entered Password!'
    }

    return { errors, isValid: isEmpty(errors) };
}


export { validateLoginInput, validateRegisterInput }