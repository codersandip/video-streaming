const express = require('express');
const router = express.Router();
const { uploadVideo, getVideos, getVideo, updateVideo, deleteVideo, updateProgress, getGenres } = require('../controllers/videoController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadVideo: multerUpload } = require('../middleware/upload');

router.get('/', getVideos);
router.get('/genres/list', getGenres);
router.get('/:id', getVideo);
router.post('/upload', protect, adminOnly, multerUpload.single('video'), uploadVideo);
router.put('/:id', protect, adminOnly, updateVideo);
router.delete('/:id', protect, adminOnly, deleteVideo);
router.post('/:id/progress', protect, updateProgress);

module.exports = router;
