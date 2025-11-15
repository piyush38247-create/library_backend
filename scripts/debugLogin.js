import mongoose  from 'mongoose';
import path  from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

 export const debugLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName : "librarytest2"
    });
    console.log('Connected to MongoDB');

    const User = require('../models/User');
    
    // Test the exact same logic as the login controller
    const email = 'admin@library.com';
    const password = 'admin123';

    console.log('1. Looking for user with email:', email);
    
    // Find user WITHOUT password first
    const userWithoutPassword = await User.findOne({ email });
    console.log('2. User found (without password):', userWithoutPassword ? 'YES' : 'NO');
    if (userWithoutPassword) {
      console.log('   - Email:', userWithoutPassword.email);
      console.log('   - Role:', userWithoutPassword.role);
      console.log('   - isActive:', userWithoutPassword.isActive);
      console.log('   - Has password field:', !!userWithoutPassword.password);
    }

    // Find user WITH password (like in login controller)
    console.log('3. Looking for user with password field...');
    const userWithPassword = await User.findOne({ email }).select('+password');
    console.log('4. User found (with password):', userWithPassword ? 'YES' : 'NO');
    if (userWithPassword) {
      console.log('   - Email:', userWithPassword.email);
      console.log('   - Role:', userWithPassword.role);
      console.log('   - isActive:', userWithPassword.isActive);
      console.log('   - Has password field:', !!userWithPassword.password);
      console.log('   - Password length:', userWithPassword.password ? userWithPassword.password.length : 0);
      
      if (userWithPassword.password) {
        console.log('5. Testing password comparison...');
        const isMatch = await userWithPassword.comparePassword(password);
        console.log('   - Password match:', isMatch);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugLogin();
