import express, { json } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import logger from './middleware/logger.js';
config();
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const { MONGO_URI, JWT_SECRET } = process.env;
app.use(json());
app.use(cors());
app.use(logger);
app.get('/', (req, res) => {
    res.send('Welcome to the Bookstore API');
});
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime()
    });
});
app.get('/ready', (req, res) => {
    const isReady = mongoose.connection.readyState === 1;
    res.status(isReady ? 200 : 503).json({
        status: isReady ? 'ready' : 'not_ready',
        databaseState: mongoose.connection.readyState
    });
});
app.use('/books', bookRoutes);
app.use('/auth', authRoutes);
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
});
const validateRequiredEnv = () => {
    const missing = [];
    if (!MONGO_URI) {
        missing.push('MONGO_URI');
    }
    if (!JWT_SECRET) {
        missing.push('JWT_SECRET');
    }
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};
const startServer = async () => {
    validateRequiredEnv();
    await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err.message);
});
startServer().catch(err => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
});