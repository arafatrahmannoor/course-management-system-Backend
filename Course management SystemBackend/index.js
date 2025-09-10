const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conn = mongoose.connect(process.env.MONGODB_URI);
if(conn){
    console.log("Connected to MongoDB");
}


const apiRouter = require('./router/api');
app.use('/api',apiRouter);

const userRouter = require('./router/userRouter');
app.use('/user', userRouter);

const authRouter = require('./router/authRouter');
app.use('/auth', authRouter);

const User = require('./model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const courseRouter = require('./router/courseRouter');
app.use('/courses', courseRouter);

const purchaseRouter = require('./router/purchaseRouter');
app.use('/purchase', purchaseRouter);

async function ensureAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) return;
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const refreshToken = jwt.sign({ id: adminEmail }, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret', { expiresIn: '7d' });
        admin = new User({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            refreshToken
        });
        await admin.save();
        console.log('Admin user created.');
    } else if (!admin.refreshToken) {
        const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret', { expiresIn: '7d' });
        admin.refreshToken = refreshToken;
        await admin.save();
        console.log('Admin refresh token generated.');
    }
}

mongoose.connection.once('open', async () => {
    await ensureAdminUser();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});