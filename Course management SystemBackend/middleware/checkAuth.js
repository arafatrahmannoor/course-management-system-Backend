const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

const checkAuth = async (req, res, next) => {
    //.check Bearer token
    const Bearer = req.headers['authorization']?.split(' ')[0];
    if (Bearer !== 'Bearer') {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers['authorization']?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: " Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //generate new token
        if(decoded.exp * 100 < Date.now()) {
            const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.setHeader('Authorization', `Bearer ${newToken}`);
        }

        req.user = await User.findById(decoded.id);
        next();
    }catch (error){
        if(error.name === "TokenExpiredError") {
            const decoded = jwt.decode(token);
            if(!decoded){
                return res.status(401).json({ message: "Invalid token" });
            }

            const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1m' });

            req.user = await User.findById(decoded.id);
            res.setHeader('Authorization', `Bearer ${newToken}`);
            next();
            return;
        }

        return res.status(401).json ({ message: "Unauthorized" });
    }
};


const checkAdmin = async (req, res, next) => {
    const Bearer = req.headers['authorization']?.split(' ')[0];
    if (Bearer !== 'Bearer') {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers['authorization']?.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: " Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user =  await User.findById(decoded.id);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden" });
        }
        
        next();
    }catch (error){

        if(error.name === "TokenExpiredError") {
            const decoded = jwt.decode(token);
            if(!decoded){
                return res.status(401).json({ message: "Invalid token" });
            }

            const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1m' });
            res.setHeader('Authorization', `Bearer ${newToken}`);
            req.user = await User.findById(decoded.id);
            
            res.setHeader('Authorization', `Bearer ${newToken}`);
            next();
            return;
        }
        return res.status(401).json ({ message: "Unauthorized" });
    }
};


module.exports = { checkAuth, checkAdmin };
