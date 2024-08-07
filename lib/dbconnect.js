// lib/dbConnect.js
import mongoose from 'mongoose';
import '../models/AllTaskModels'; // Import your models here. Adjust the path as necessary.

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (typeof window === 'undefined') {
    // Server-side rendering
    if (cached.conn) {
      console.log('Using cached database connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('Database connected successfully');
        return mongoose;
      }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } else {
    // Client-side rendering
    const mongoose = await import('mongoose');
    const conn = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('Client-side database connection established');
    return conn;
  }
}

export default dbConnect;
