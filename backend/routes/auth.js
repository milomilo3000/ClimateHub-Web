const express = require('express');
const admin = require('firebase-admin');
const User = require('../models/User');
const router = express.Router();

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE || "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
  }
}

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register/Login user
router.post('/login', async (req, res) => {
  try {
    const { firebaseUid, email, displayName, photoURL } = req.body;

    if (!firebaseUid || !email || !displayName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create new user
      user = new User({
        firebaseUid,
        email,
        displayName,
        photoURL: photoURL || ''
      });
      await user.save();
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        badges: user.badges,
        totalCarbonFootprint: user.totalCarbonFootprint
      }
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      error: 'Login failed',
      details: error.message
    });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        badges: user.badges,
        totalCarbonFootprint: user.totalCarbonFootprint,
        carbonHistory: user.carbonHistory,
        preferences: user.preferences,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { displayName, photoURL, preferences } = req.body;
    
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (displayName) user.displayName = displayName;
    if (photoURL) user.photoURL = photoURL;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add badge to user
router.post('/badges', verifyToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if badge already exists
    const existingBadge = user.badges.find(badge => badge.name === name);
    if (existingBadge) {
      return res.status(400).json({ error: 'Badge already earned' });
    }

    user.badges.push({
      name,
      description,
      earnedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      badges: user.badges
    });
  } catch (error) {
    console.error('Add badge error:', error);
    res.status(500).json({ error: 'Failed to add badge' });
  }
});

module.exports = router; 