import mongoose, { Mongoose } from 'mongoose';
import { authDb } from '../constants/index';

function buildURI(): string {
    const { user, pwd, url, db } = authDb;
    if (!user || !pwd || !url || !db) {
        throw new Error('Mongo env vars are missing');
    }

    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(
        pwd,
    )}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;
}

interface GlobalMongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

const globalWithMongoose = global as unknown as {
    _mongoose: GlobalMongooseCache | undefined;
};

if (!globalWithMongoose._mongoose) {
    globalWithMongoose._mongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose._mongoose;

export async function initMongoDB(): Promise<Mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const uri = buildURI();
        cached.promise = mongoose.connect(uri, {
            maxPoolSize: 5,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
