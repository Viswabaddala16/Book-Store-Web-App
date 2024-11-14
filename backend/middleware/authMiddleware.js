import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export  const authenticate  = (req,res,next) => {
    const token = req.headers['authorization']; 
    if(!token) return res.status(403).json({message : 'Token is required    '});

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();

    } catch(error){
        res.status(401).json({ message : "Invalid Token "});
    }
}