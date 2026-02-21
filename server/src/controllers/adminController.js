const User = require('../models/User');
const Video = require('../models/Video');
const Subscription = require('../models/Subscription');

// @route   GET /api/admin/stats
// @access  Admin only
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalVideos,
      activeSubscriptions,
      processingVideos,
      totalViews
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Video.countDocuments(),
      User.countDocuments({ 'subscription.isActive': true, 'subscription.expiresAt': { $gt: new Date() } }),
      Video.countDocuments({ processingStatus: 'processing' }),
      Video.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }])
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalVideos,
        activeSubscriptions,
        processingVideos,
        totalViews: totalViews[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/admin/users
// @access  Admin only
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'user' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .populate('subscription.plan', 'name price'),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/admin/users/:id/toggle
// @access  Admin only
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot disable admin accounts' });
    }
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/admin/users/:id/subscription
// @access  Admin only
const setUserSubscription = async (req, res) => {
  try {
    const { planId, days } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const plan = await Subscription.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (days || plan.duration));

    user.subscription = {
      plan: plan._id,
      planName: plan.name,
      startedAt: new Date(),
      expiresAt,
      isActive: true
    };

    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Subscription assigned', subscription: user.subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/admin/analytics
// @access  Admin only
const getAnalytics = async (req, res) => {
  try {
    const topVideos = await Video.find({ processingStatus: 'completed' })
      .sort('-views')
      .limit(10)
      .select('title views duration genre thumbnail');

    const recentSignups = await User.find({ role: 'user' })
      .sort('-createdAt')
      .limit(10)
      .select('name email createdAt subscription.planName');

    const genreBreakdown = await Video.aggregate([
      { $match: { processingStatus: 'completed' } },
      { $group: { _id: '$genre', count: { $sum: 1 }, views: { $sum: '$views' } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      analytics: { topVideos, recentSignups, genreBreakdown }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, getUsers, toggleUserStatus, setUserSubscription, getAnalytics };
