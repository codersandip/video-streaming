const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const watchHistorySchema = new mongoose.Schema({
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  progress: { type: Number, default: 0 }, // seconds watched
  lastWatched: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: null
  },
  subscription: {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null },
    planName: { type: String, default: 'free' },
    startedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: false }
  },
  watchHistory: [watchHistorySchema],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check subscription validity
userSchema.methods.hasActiveSubscription = function () {
  if (this.role === 'admin') return true;
  if (!this.subscription.isActive) return false;
  if (!this.subscription.expiresAt) return false;
  return new Date() < new Date(this.subscription.expiresAt);
};

module.exports = mongoose.model('User', userSchema);
