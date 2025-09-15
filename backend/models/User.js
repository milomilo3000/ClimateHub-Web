const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalCarbonFootprint: {
    type: Number,
    default: 0
  },
  carbonHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    footprint: Number,
    breakdown: {
      fastFashion: Number,
      diet: Number,
      transport: Number,
      travel: Number,
      electricity: Number,
      waste: Number,
      outings: Number,
      electronics: Number
    }
  }],
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ firebaseUid: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema); 