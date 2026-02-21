const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Video = require('../src/models/Video');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const video = await Video.findById('6999343536132f9550ec840c');
        if (video) {
            console.log('Video found');
        } else {
            console.log('Video not found in DB');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
