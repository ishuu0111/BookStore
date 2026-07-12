import app from './app.js';
import { connectToDatabase } from './db.js';
const PORT = Number(process.env.PORT) || 5000;
const startServer = async () => {
    await connectToDatabase();
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
startServer().catch(err => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
});