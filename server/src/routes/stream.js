const express = require('express');
const router = express.Router();
const { streamPlaylist, streamSegment, serveThumbnail } = require('../controllers/streamController');
const { protect, checkSubscription } = require('../middleware/auth');

// Public thumbnail serving
router.get('/thumbnail/:filename', serveThumbnail);

// Protected HLS streaming routes
router.get('/:videoId/index.m3u8', protect, checkSubscription, streamPlaylist);
router.get('/:videoId/:segment', protect, checkSubscription, streamSegment);

module.exports = router;
