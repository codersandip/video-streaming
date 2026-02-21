const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Subscription = require('../src/models/Subscription');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB');

    // Create admin
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await User.create({
        name: 'Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin'
      });
      console.log('✅ Admin user created:', process.env.ADMIN_EMAIL);
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // Create default subscription plans
    const plans = [
      {
        name: 'Basic',
        description: 'Perfect for casual viewers',
        price: 4.99,
        duration: 30,
        features: ['HD Streaming', 'Unlimited Videos', 'Watch History', '1 Device'],
        maxResolution: '720p',
        order: 1
      },
      {
        name: 'Standard',
        description: 'Great for regular users',
        price: 9.99,
        duration: 30,
        features: ['Full HD Streaming', 'Unlimited Videos', 'Watch History', '2 Devices', 'Priority Support'],
        maxResolution: '1080p',
        order: 2
      },
      {
        name: 'Premium',
        description: 'Best experience for enthusiasts',
        price: 14.99,
        duration: 30,
        features: ['4K Streaming', 'Unlimited Videos', 'Watch History', '4 Devices', 'Priority Support', 'Early Access'],
        maxResolution: '4K',
        order: 3
      }
    ];

    for (const plan of plans) {
      const exists = await Subscription.findOne({ name: plan.name });
      if (!exists) {
        await Subscription.create(plan);
        console.log(`✅ Plan created: ${plan.name}`);
      }
    }

    console.log('🎉 Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
