const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['workshop', 'cleanup', 'seminar', 'protest', 'conference', 'volunteer', 'other'],
    default: 'other'
  },
  tags: [String],
  imageUrl: String,
  registrationUrl: String,
  maxParticipants: Number,
  currentParticipants: {
    type: Number,
    default: 0
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  onlineMeetingUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ featured: 1 });

module.exports = mongoose.model('Event', eventSchema); 