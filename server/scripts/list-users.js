const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    const users = await User.find({}).select('+password');
    console.log('--- User List ---');
    users.forEach(u => {
      console.log(`- ${u.email} (${u.role}) [Hashed Pwd: ${u.password.substring(0, 10)}...]`);
    });
    console.log('--- End ---');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

listUsers();
