import app from '../app.js';
import { connectToDatabase } from '../db.js';

export default async function handler(req, res) {
    const originalUrl = req.url;

    try {
        await connectToDatabase();
        if (req.url.startsWith('/api')) {
            req.url = req.url.slice(4) || '/';
        }
        return app(req, res);
    } catch (err) {
        console.error('Failed to handle request:', err.message);
        return res.status(500).json({
            message: err.message || 'Internal server error'
        });
    } finally {
        req.url = originalUrl;
    }
}
