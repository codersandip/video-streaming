const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Video = require('../src/models/Video');

const list = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        const videos = await Video.find({}).limit(5);
        console.log('--- Videos in DB ---');
        videos.forEach(v => console.log(v._id, v.title));
        process.exit(0);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
list();
