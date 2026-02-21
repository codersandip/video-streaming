const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: ''
  },
  thumbnail: {
    type: String,
    default: null
  },
  originalFile: {
    type: String,
    required: true
  },
  hlsPath: {
    type: String,
    default: null
  },
  hlsReady: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 0 // in seconds
  },
  fileSize: {
    type: Number,
    default: 0 // in bytes
  },
  resolution: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  },
  genre: {
    type: String,
    trim: true,
    default: 'Uncategorized'
  },
  tags: [{ type: String, trim: true }],
  isPublic: {
    type: Boolean,
    default: false
  },
  requiresSubscription: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingError: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Video', videoSchema);
