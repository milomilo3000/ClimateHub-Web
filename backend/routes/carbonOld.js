const express = require('express');
const User = require('../models/User');
const CarbonFootprint = require('../models/CarbonFootprint');
const { emissionFactors, averages, conversions } = require('../data/emissionFactors');
const router = express.Router();

// Import the proper verifyToken middleware from auth routes
const admin = require('firebase-admin');

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

// Calculate carbon footprint
router.post('/calculate', async (req, res) => {
  try {
    const {
      fastFashion,
      diet,
      transport,
      travel,
      electricity,
      waste,
      outings,
      electronics
    } = req.body;

    let totalFootprint = 0;
    const breakdown = {};

    // Fast Fashion calculation
    if (fastFashion) {
      const { clothingItems = 0, sustainablePercentage = 0 } = fastFashion;
      const sustainableItems = (clothingItems * sustainablePercentage) / 100;
      const regularItems = clothingItems - sustainableItems;
      
      const sustainableEmissions = sustainableItems * emissionFactors.clothing.sustainableClothing;
      const regularEmissions = regularItems * emissionFactors.clothing.cottonTshirt;
      
      breakdown.fastFashion = sustainableEmissions + regularEmissions;
      totalFootprint += breakdown.fastFashion;
    }

    // Diet calculation
    if (diet) {
      const { meatConsumption = 0, dairyConsumption = 0, localFoodPercentage = 0 } = diet;
      
      const meatEmissions = meatConsumption * emissionFactors.food.beef;
      const dairyEmissions = dairyConsumption * emissionFactors.food.dairy;
      
      // Local food bonus
      const localBonus = (meatEmissions + dairyEmissions) * (localFoodPercentage / 100) * 0.3;
      
      breakdown.diet = meatEmissions + dairyEmissions - localBonus;
      totalFootprint += breakdown.diet;
    }

    // Transport calculation
    if (transport) {
      const { publicTransportHours = 0, privateVehicleHours = 0, vehicleType = 'petrol' } = transport;
      
      // Assuming average speed of 30 km/h for calculations
      const publicKm = publicTransportHours * 30;
      const privateKm = privateVehicleHours * 30;
      
      const publicEmissions = publicKm * emissionFactors.transport.bus;
      const privateEmissions = privateKm * emissionFactors.transport.car[vehicleType];
      
      breakdown.transport = publicEmissions + privateEmissions;
      totalFootprint += breakdown.transport;
    }

    // Travel calculation
    if (travel) {
      const { flightsPerYear = 0, averageFlightHours = 0 } = travel;
      
      // Assuming average speed of 800 km/h for flights
      const totalFlightKm = flightsPerYear * averageFlightHours * 800;
      const flightEmissions = totalFlightKm * emissionFactors.flights.mediumHaul;
      
      breakdown.travel = flightEmissions;
      totalFootprint += breakdown.travel;
    }

    // Electricity calculation
    if (electricity) {
      const { monthlyKwh = 0, renewablePercentage = 0 } = electricity;
      const annualKwh = monthlyKwh * 12;
      
      const gridEmissions = annualKwh * emissionFactors.electricity.grid;
      const renewableEmissions = (annualKwh * renewablePercentage / 100) * emissionFactors.electricity.solar;
      
      breakdown.electricity = gridEmissions - renewableEmissions;
      totalFootprint += breakdown.electricity;
    }

    // Waste calculation
    if (waste) {
      const { weeklyWasteKg = 0, recyclingPercentage = 0 } = waste;
      const annualWaste = weeklyWasteKg * 52;
      
      const recycledWaste = (annualWaste * recyclingPercentage) / 100;
      const generalWaste = annualWaste - recycledWaste;
      
      const recycledEmissions = recycledWaste * emissionFactors.waste.recycled;
      const generalEmissions = generalWaste * emissionFactors.waste.general;
      
      breakdown.waste = recycledEmissions + generalEmissions;
      totalFootprint += breakdown.waste;
    }

    // Outings calculation
    if (outings) {
      const { cinemaVisits = 0, restaurantVisits = 0, entertainmentHours = 0 } = outings;
      
      const cinemaEmissions = cinemaVisits * emissionFactors.entertainment.cinema;
      const restaurantEmissions = restaurantVisits * emissionFactors.entertainment.restaurant;
      const entertainmentEmissions = entertainmentHours * emissionFactors.entertainment.gaming;
      
      breakdown.outings = cinemaEmissions + restaurantEmissions + entertainmentEmissions;
      totalFootprint += breakdown.outings;
    }

    // Electronics calculation
    if (electronics) {
      const { devicesOwned = 0, averageLifespan = 5 } = electronics;
      
      // Calculate annual emissions from device usage
      const annualDeviceEmissions = devicesOwned * emissionFactors.electronics.annualUsage.laptop;
      const manufacturingEmissions = (devicesOwned * emissionFactors.electronics.laptop) / averageLifespan;
      
      breakdown.electronics = annualDeviceEmissions + manufacturingEmissions;
      totalFootprint += breakdown.electronics;
    }

    // Convert to tonnes for comparison
    const totalFootprintTonnes = totalFootprint * conversions.kgToTonnes;

    // Calculate percentile
    const singaporeAverage = averages.singapore.perCapita;
    const globalAverage = averages.global.perCapita;
    const percentile = ((singaporeAverage - totalFootprintTonnes) / singaporeAverage) * 100;

    const result = {
      totalFootprint: totalFootprintTonnes,
      breakdown,
      comparison: {
        singaporeAverage,
        globalAverage,
        percentile: Math.max(0, Math.min(100, percentile))
      }
    };

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Carbon calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate carbon footprint' });
  }
});

// Save carbon footprint to user profile
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { footprint, breakdown, inputData, notes } = req.body;
    
    console.log('Save request received:', {
      userUid: req.user?.uid,
      hasFootprint: !!footprint,
      footprintKeys: footprint ? Object.keys(footprint) : []
    });
    
    const user = await User.findOne({ firebaseUid: req.user.uid });
    console.log('User found:', user ? 'Yes' : 'No', user ? user.email : 'N/A');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create carbon footprint record
    const carbonRecord = new CarbonFootprint({
      userId: user._id,
      totalFootprint: footprint.totalFootprint,
      breakdown: footprint.breakdown,
      inputData,
      comparison: footprint.comparison,
      notes
    });

    await carbonRecord.save();

    // Update user's total footprint
    user.totalCarbonFootprint = footprint.totalFootprint;
    user.carbonHistory.push({
      date: new Date(),
      footprint: footprint.totalFootprint,
      breakdown: footprint.breakdown
    });

    await user.save();

    res.json({
      success: true,
      message: 'Carbon footprint saved successfully',
      footprint: carbonRecord
    });
  } catch (error) {
    console.error('Save footprint error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body,
      user: req.user?.uid
    });
    res.status(500).json({ 
      error: 'Failed to save carbon footprint',
      details: error.message
    });
  }
});

// Get user's carbon footprint history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const footprints = await CarbonFootprint.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(10);

    res.json({
      success: true,
      footprints,
      totalFootprint: user.totalCarbonFootprint
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get carbon footprint history' });
  }
});

// Get emission factors for frontend
router.get('/factors', (req, res) => {
  res.json({
    success: true,
    emissionFactors,
    averages
  });
});

module.exports = router; 