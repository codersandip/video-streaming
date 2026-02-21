require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const forceAdmin = async () => {
  try {
    console.log('--- Force Admin Script Started ---');
    console.log('MONGO_URI:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@example.com';
    const password = 'Admin@123';

    console.log('Checking for existing user with email:', email);
    let user = await User.findOne({ email });

    if (user) {
      console.log('ℹ️ User found. Updating password...');
      user.password = password;
      await user.save();
      console.log('✅ Password updated for existing user.');
    } else {
      console.log('ℹ️ User not found. Creating new admin...');
      user = await User.create({
        name: 'Administrator',
        email,
        password,
        role: 'admin'
      });
      console.log('✅ New admin user created.');
    }

    console.log('--- Done ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

forceAdmin();
