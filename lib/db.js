import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Global cached Mongoose connection for Vercel Serverless Functions.
 * Serverless environments spin containers up and down; reusing the cached
 * connection avoids hitting connection limits on MongoDB Atlas.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    // If MONGODB_URI is not set, throw a clean informative error
    console.warn('[DB] MONGODB_URI is not defined in environment variables.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('[DB] MongoDB Atlas connected successfully.');
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error('[DB] MongoDB Atlas connection error:', err.message);
      throw err;
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

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

