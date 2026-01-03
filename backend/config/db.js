import mongoose from "mongoose";

// Cache the connection to reuse in serverless environments
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    // If already connected, return the cached connection
    if (cached.conn) {
        return cached.conn;
    }

    // If connection is in progress, wait for it
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            console.log(`MongoDB Connected: ${mongoose.connection.host}`);
            return mongoose;
        }).catch((error) => {
            console.error(`Error connecting to MongoDB: ${error.message}`);
            cached.promise = null; // Reset on error so we can retry
            throw error; // Don't exit process in serverless
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;