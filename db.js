import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const globalCache = globalThis.__bookstoreDbCache ?? {
    connection: null,
    promise: null
};

globalThis.__bookstoreDbCache = globalCache;

const getMongoUri = () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('Missing required environment variable: MONGO_URI');
    }

    return mongoUri;
};

export const connectToDatabase = async () => {
    const mongoUri = getMongoUri();

    if (globalCache.connection) {
        return globalCache.connection;
    }

    if (!globalCache.promise) {
        globalCache.promise = mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
    }

    globalCache.connection = await globalCache.promise;
    return globalCache.connection;
};

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err.message);
});
