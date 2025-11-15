import mongoose from 'mongoose';
import path from 'path';
import dotenv  from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

export const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName : 'librarytest2'
    });
    console.log('Connected to MongoDB');

    const User = require('../models/User');
    
    // Find the admin user
    const admin = await User.findOne({ email: 'ram1@library.com' });
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }

    console.log('Admin found:', {
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      hasPassword: !!admin.password
    });

    // Test password comparison
    const testPassword = 'ram@1234567';
    console.log('Testing password:', testPassword);
    
    const isMatch = await admin.comparePassword(testPassword);
    console.log('Password match:', isMatch);

    // Also test with bcrypt directly
    const directMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('Direct bcrypt match:', directMatch);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
