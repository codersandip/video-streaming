const Subscription = require('../models/Subscription');
const User = require('../models/User');

// @route   GET /api/subscriptions
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await Subscription.find({ isActive: true }).sort('order price');
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/subscriptions
// @access  Admin only
const createPlan = async (req, res) => {
  try {
    const { name, description, price, duration, features, maxResolution, order } = req.body;

    if (!name || price === undefined || !duration) {
      return res.status(400).json({ success: false, message: 'Name, price, and duration are required' });
    }

    const plan = await Subscription.create({
      name, description, price, duration,
      features: features || [],
      maxResolution: maxResolution || '1080p',
      order: order || 0
    });

    res.status(201).json({ success: true, plan });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Plan name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/subscriptions/:id
// @access  Admin only
const updatePlan = async (req, res) => {
  try {
    const plan = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/subscriptions/:id
// @access  Admin only
const deletePlan = async (req, res) => {
  try {
    const plan = await Subscription.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/subscriptions/subscribe/:planId
// @access  Private
const subscribe = async (req, res) => {
  try {
    const plan = await Subscription.findById(req.params.planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ success: false, message: 'Plan not found or inactive' });
    }

    const user = await User.findById(req.user._id);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration);

    user.subscription = {
      plan: plan._id,
      planName: plan.name,
      startedAt: new Date(),
      expiresAt,
      isActive: true
    };

    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: `Successfully subscribed to ${plan.name}`,
      subscription: user.subscription,
      expiresAt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPlans, createPlan, updatePlan, deletePlan, subscribe };
