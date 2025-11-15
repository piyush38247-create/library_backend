import mongoose  from 'mongoose';
import path  from 'path';
import dotenv  from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

 export const debugDB = async () => {
  try {
    console.log('Environment variables:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found');
      process.exit(1);
    }

    // Connect to database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName : "librarytest2"
    });
    console.log('Connected successfully!');

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Check users collection
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);

    const users = await User.find({});
    console.log('Users:', users.map(u => ({ email: u.email, role: u.role })));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugDB();
