import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Authentication token missing' });
    }
    // const authHeader = req.headers.authorization;

    // if (!authHeader) {
    //     return res.status(403).json({ message: 'Authorization header is missing. Token is required.' });
    // }

    // const token = authHeader.split(' ')[1];
    // if (!token) {
    //     console.error('Bearer token is missing');
    //     return res.status(403).json({ message: 'Bearer token is missing in Authorization header.' });
    // }

    try {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured.');
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded user to request
        console.log("Authenticated User:", req.user);
        next();
    } catch (error) {
        console.error("Authentication Error:",error.message);
        res.status(403).json({ message: "Invalid or Expired Token", error: error.message });
    }
};
