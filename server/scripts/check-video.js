const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Video = require('../src/models/Video');

const checkVideo = async () => {
  const videoId = '6999343536132f9550ec840c';
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');
    
    const video = await Video.findById(videoId);
    if (video) {
        console.log('✅ Video found in DB:');
        console.log(JSON.stringify(video, null, 2));
    } else {
        console.log('❌ Video not found in DB with ID:', videoId);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

checkVideo();
