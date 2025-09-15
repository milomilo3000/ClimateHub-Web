const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify token (simplified for demo)
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    req.user = { uid: token };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all events with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      status = 'upcoming',
      featured,
      limit = 20,
      page = 1
    } = req.query;

    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    // Filter by date for upcoming/ongoing events
    if (status === 'upcoming') {
      filter.startDate = { $gte: new Date() };
    } else if (status === 'ongoing') {
      const now = new Date();
      filter.startDate = { $lte: now };
      filter.endDate = { $gte: now };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const events = await Event.find(filter)
      .populate('createdBy', 'displayName email')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      events,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'displayName email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event (requires authentication)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      title,
      description,
      organizer,
      location,
      startDate,
      endDate,
      category,
      tags,
      imageUrl,
      registrationUrl,
      maxParticipants,
      isOnline,
      onlineMeetingUrl
    } = req.body;

    if (!title || !description || !organizer || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const event = new Event({
      title,
      description,
      organizer,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      category: category || 'other',
      tags: tags || [],
      imageUrl,
      registrationUrl,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
      isOnline: isOnline || false,
      onlineMeetingUrl,
      createdBy: user._id
    });

    await event.save();

    res.json({
      success: true,
      event,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (requires authentication and ownership)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is the creator or admin
    if (event.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this event' });
    }

    const updateData = req.body;
    
    // Convert date strings to Date objects
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('createdBy', 'displayName email');

    res.json({
      success: true,
      event: updatedEvent,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (requires authentication and ownership)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is the creator or admin
    if (event.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get events by user
router.get('/user/created', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const events = await Event.find({ createdBy: user._id })
      .sort({ startDate: 1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ error: 'Failed to fetch user events' });
  }
});

// Get event categories
router.get('/categories/list', (req, res) => {
  const categories = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'cleanup', label: 'Cleanup' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'protest', label: 'Protest' },
    { value: 'conference', label: 'Conference' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'other', label: 'Other' }
  ];

  res.json({
    success: true,
    categories
  });
});

// Search events
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const events = await Event.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { organizer: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .populate('createdBy', 'displayName email')
    .sort({ startDate: 1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      events,
      query: q
    });
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({ error: 'Failed to search events' });
  }
});

module.exports = router; 