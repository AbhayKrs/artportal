import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const adminKey = (req, res, next) => {
    const secretKey = req.header('X-Secret-Key'); // Custom header to pass the secret key
    const expectedSecretKey = process.env.ADMIN_VERSION_SECRET; // Replace with your actual expected secret key

    if (!secretKey) {
        return res.status(401).json({ message: 'Access denied. Secret key missing.' });
    }

    if (secretKey !== expectedSecretKey) {
        return res.status(403).json({ message: 'Access denied. Invalid secret key.' });
    }

    next();
};

export { adminKey };
