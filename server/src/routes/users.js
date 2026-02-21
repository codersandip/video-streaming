const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/watch-history
// @access  Private
router.get('/watch-history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'watchHistory.video',
        select: 'title thumbnail duration genre processingStatus'
      });

    const history = user.watchHistory
      .filter(h => h.video) // filter deleted videos
      .sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched));

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/users/watch-history
// @access  Private
router.delete('/watch-history', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { watchHistory: [] } });
    res.json({ success: true, message: 'Watch history cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
