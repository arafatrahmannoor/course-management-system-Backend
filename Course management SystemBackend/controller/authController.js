const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register user
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (role !== "user" && role !== "admin") {
            return res.status(400).json({ message: "Role must be user or admin" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(400).json({ message: "Email already exists", error });
        }
        res.status(400).json({ message: error.message });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not Found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({ 
            message: "Login successful", 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                purchasedCourses: user.purchasedCourses
            },
            accessToken, 
            refreshToken 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Refresh token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) return res.status(403).json({ message: 'Invalid refresh token' });
        const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

// Logout user
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.refreshToken = null;
        await user.save();
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = { register, login, refreshToken, logout };