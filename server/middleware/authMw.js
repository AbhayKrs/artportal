import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Unauthorized. User authentication is invalid.' });
        }
    }
    if (!token) {
        res.status(401);
        return res.status(401).json({ message: 'Unauthorized. User authentication is required.' });
    }
    next();
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

export { protect, admin };
