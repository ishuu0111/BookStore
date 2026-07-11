import express from 'express'
const router = express.Router();
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('Missing required environment variable: JWT_SECRET');
    }

    return process.env.JWT_SECRET;
};

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username, email and password are required' });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: username.trim() }
            ]
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            username: username.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });
        res.status(201).json({ message: 'User registered successfully', username: user.username });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required' });
        }
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            getJwtSecret(),
            {
                expiresIn: '2h'
            }
        );
        res.status(200).json({
            message: 'Login successful',
            token,
            username: user.username
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
export default router;
