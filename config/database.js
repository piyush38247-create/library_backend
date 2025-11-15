import mongoose from 'mongoose'
import { config } from 'dotenv';
config()

 export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName : 'librarytest2'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};


