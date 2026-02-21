const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const User = require('../models/User');
const { convertToHLS, getVideoMetadata, generateThumbnail, deleteHLSFiles } = require('../services/ffmpeg');

// @route   POST /api/videos/upload
// @access  Admin only
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file provided' });
    }

    const { title, description, genre, tags, isPublic, requiresSubscription } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Get video metadata
    let metadata = { duration: 0, fileSize: 0, width: 0, height: 0 };
    try {
      metadata = await getVideoMetadata(req.file.path);
    } catch (err) {
      console.warn('Could not get metadata:', err.message);
    }

    // Create video document
    const video = await Video.create({
      title,
      description: description || '',
      genre: genre || 'Uncategorized',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      isPublic: isPublic === 'true',
      requiresSubscription: requiresSubscription !== 'false',
      originalFile: req.file.filename,
      duration: metadata.duration,
      fileSize: metadata.fileSize || req.file.size,
      resolution: { width: metadata.width, height: metadata.height },
      processingStatus: 'processing',
      createdBy: req.user._id
    });

    // Generate thumbnail
    try {
      const thumbPath = await generateThumbnail(req.file.path, video._id, '00:00:03');
      if (thumbPath) {
        video.thumbnail = thumbPath;
        await video.save();
      }
    } catch (err) {
      console.warn('Thumbnail generation failed:', err.message);
    }

    // Start HLS conversion in background
    convertToHLS(req.file.path, video._id, (progress) => {
      // Progress tracking (could emit via WebSockets)
      console.log(`Video ${video._id}: ${progress}% converted`);
    }).then(async (outputDir) => {
      video.hlsPath = `/hls/${video._id}/index.m3u8`;
      video.hlsReady = true;
      video.processingStatus = 'completed';
      await video.save();
      console.log(`✅ Video ${video._id} is ready for streaming`);
    }).catch(async (err) => {
      video.processingStatus = 'failed';
      video.processingError = err.message;
      await video.save();
      console.error(`❌ Video ${video._id} processing failed:`, err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded and processing started',
      video: {
        id: video._id,
        title: video.title,
        processingStatus: video.processingStatus,
        thumbnail: video.thumbnail
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/videos
// @access  Public (limited info) / Private (full)
const getVideos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      genre,
      search,
      sort = '-createdAt'
    } = req.query;

    const query = { processingStatus: 'completed' };

    if (genre && genre !== 'all') {
      query.genre = genre;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [videos, total] = await Promise.all([
      Video.find(query)
        .select('title description thumbnail duration genre views createdAt hlsReady requiresSubscription')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name'),
      Video.countDocuments(query)
    ]);

    res.json({
      success: true,
      videos,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/videos/:id
// @access  Public
const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('createdBy', 'name');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Increment view count
    video.views += 1;
    await video.save({ validateBeforeSave: false });

    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/videos/:id
// @access  Admin only
const updateVideo = async (req, res) => {
  try {
    const { title, description, genre, tags, isPublic, requiresSubscription } = req.body;

    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (genre) video.genre = genre;
    if (tags) video.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (isPublic !== undefined) video.isPublic = isPublic === 'true';
    if (requiresSubscription !== undefined) video.requiresSubscription = requiresSubscription !== 'false';

    await video.save();
    res.json({ success: true, message: 'Video updated', video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/videos/:id
// @access  Admin only
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Delete original file
    const originalPath = path.join(__dirname, '../../../uploads', video.originalFile);
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }

    // Delete HLS files
    deleteHLSFiles(video._id);

    // Delete thumbnail
    if (video.thumbnail) {
      const thumbPath = path.join(__dirname, '../../../', video.thumbnail);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    await video.deleteOne();

    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/videos/:id/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const videoId = req.params.id;

    const user = await User.findById(req.user._id);
    const historyIndex = user.watchHistory.findIndex(
      h => h.video && h.video.toString() === videoId
    );

    if (historyIndex >= 0) {
      user.watchHistory[historyIndex].progress = progress;
      user.watchHistory[historyIndex].lastWatched = new Date();
    } else {
      user.watchHistory.push({
        video: videoId,
        progress,
        lastWatched: new Date()
      });
    }

    // Keep only last 100 history items
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory.slice(-100);
    }

    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Progress saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/videos/genres/list
// @access  Public
const getGenres = async (req, res) => {
  try {
    const genres = await Video.distinct('genre', { processingStatus: 'completed' });
    res.json({ success: true, genres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadVideo, getVideos, getVideo, updateVideo, deleteVideo, updateProgress, getGenres };
