import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
console.log('Testing MongoDB connection...');
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('Test connection: SUCCESS');
        process.exit(0);
    })
    .catch(err => {
        console.error('Test connection: FAILED:', err.message);
        process.exit(1);
    });
