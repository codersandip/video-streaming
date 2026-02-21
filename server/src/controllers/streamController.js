const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

// @route   GET /api/stream/:videoId/index.m3u8
// @access  Private (subscription check done in route)
const streamPlaylist = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (!video.hlsReady) {
      return res.status(425).json({ success: false, message: 'Video is still being processed', status: video.processingStatus });
    }

    const hlsDir = path.join(__dirname, '../../../hls', videoId);
    const playlistPath = path.join(hlsDir, 'index.m3u8');

    if (!fs.existsSync(playlistPath)) {
      return res.status(404).json({ success: false, message: 'HLS playlist not found' });
    }

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(playlistPath);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/stream/:videoId/:segment
// @access  Private (subscription check done in route)
const streamSegment = async (req, res) => {
  try {
    const { videoId, segment } = req.params;

    // Validate segment name (security: prevent path traversal)
    if (!segment.match(/^segment\d{3}\.ts$/)) {
      return res.status(400).json({ success: false, message: 'Invalid segment name' });
    }

    const segmentPath = path.join(__dirname, '../../../hls', videoId, segment);

    if (!fs.existsSync(segmentPath)) {
      return res.status(404).json({ success: false, message: 'Segment not found' });
    }

    const stat = fs.statSync(segmentPath);
    res.setHeader('Content-Type', 'video/mp2t');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const readStream = fs.createReadStream(segmentPath);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/stream/thumbnail/:filename
// @access  Public
const serveThumbnail = async (req, res) => {
  try {
    const { filename } = req.params;

    // Security: prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ success: false, message: 'Invalid filename' });
    }

    const thumbPath = path.join(__dirname, '../../../thumbnails', filename);

    if (!fs.existsSync(thumbPath)) {
      return res.status(404).json({ success: false, message: 'Thumbnail not found' });
    }

    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(thumbPath);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { streamPlaylist, streamSegment, serveThumbnail };
