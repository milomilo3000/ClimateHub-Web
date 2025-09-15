const express = require('express');
const User = require('../models/User');
const CarbonFootprint = require('../models/CarbonFootprint');
const { emissionFactors, averages, conversions } = require('../data/emissionFactors');
const router = express.Router();

// Import the proper verifyToken middleware
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

// Calculate carbon footprint with new Singapore-specific logic
router.post('/calculate', async (req, res) => {
  try {
    const {
      diet,
      transport,
      travel,
      fashion,
      home,
      lifestyle,
      electronics,
      waste,
      offsetting
    } = req.body;

    let totalFootprint = 0;
    const breakdown = {};

    // 1. Diet & Food Habits calculation
    if (diet) {
      let dietEmissions = 0;

      // Meals with meat (daily)
      const mealsWithMeat = parseInt(diet.mealsWithMeat) || 0;
      dietEmissions += mealsWithMeat * emissionFactors.food.meatMeal * conversions.daysToYear;

      // Plant-based meals adjustment
      const plantBasedMultiplier = {
        'never': 1.0,
        'once_week': 0.9,
        '2_3_times': 0.8,
        'almost_daily': 0.6
      };
      dietEmissions *= (plantBasedMultiplier[diet.plantBasedFrequency] || 1.0);

      // Hawker centre visits (weekly)
      const hawkerVisits = parseInt(diet.hawkerVisits) || 0;
      dietEmissions += hawkerVisits * emissionFactors.food.hawkerMeal * conversions.weeksToYear;

      // Bubble tea/sweetened beverages (weekly)
      const bubbleTeaCups = parseInt(diet.bubbleTeaCups) || 0;
      dietEmissions += bubbleTeaCups * emissionFactors.food.bubbleTea * conversions.weeksToYear;

      // Food delivery (weekly)
      const foodDelivery = parseInt(diet.foodDelivery) || 0;
      dietEmissions += foodDelivery * emissionFactors.food.foodDelivery * conversions.weeksToYear;

      // Packaged snacks multiplier
      const snacksMultiplier = {
        'daily': 1.3,
        'few_times_week': 1.15,
        'weekly': 1.05,
        'rarely': 0.95,
        'never': 0.9
      };
      dietEmissions *= (snacksMultiplier[diet.packagedSnacks] || 1.0);

      // Food waste penalty
      const wasteMultiplier = {
        'always_finish': 0.9,
        'usually_finish': 1.0,
        'sometimes_finish': 1.1,
        'rarely_finish': 1.2
      };
      dietEmissions *= (wasteMultiplier[diet.foodWaste] || 1.0);

      breakdown.diet = dietEmissions;
      totalFootprint += dietEmissions;
    }

    // 2. Transport calculation
    if (transport) {
      let transportEmissions = 0;
      const avgTripKm = (parseInt(transport.averageTripLength) || 30) / 60 * 25; // Convert minutes to km (avg 25km/h)

      // Public transport days per week
      const publicTransportDays = parseInt(transport.publicTransportDays) || 0;
      transportEmissions += publicTransportDays * avgTripKm * emissionFactors.transport.publicBus * conversions.weeksToYear;

      // Walking/cycling (zero emissions)
      // const walkCycleDays = parseInt(transport.walkCycleDays) || 0;

      // Grab/taxi frequency
      const grabTaxiMultiplier = {
        'never': 0,
        '1_2_times': 1.5,
        '3_5_times': 4,
        'daily': 7
      };
      const grabTaxiWeekly = grabTaxiMultiplier[transport.grabTaxiFrequency] || 0;
      transportEmissions += grabTaxiWeekly * avgTripKm * emissionFactors.transport.grab * conversions.weeksToYear;

      // Car usage
      if (transport.carType && transport.carType !== 'not_applicable') {
        const carEmissionFactor = emissionFactors.transport.car[transport.carType] || emissionFactors.transport.car.petrol;
        // Estimate car usage based on other transport usage
        const estimatedCarKmPerWeek = Math.max(0, 50 - (publicTransportDays * 10));
        transportEmissions += estimatedCarKmPerWeek * carEmissionFactor * conversions.weeksToYear;
      }

      // E-scooter/motorbike hours per week
      const escooterHours = parseInt(transport.escooterHours) || 0;
      transportEmissions += escooterHours * 15 * emissionFactors.transport.escooter * conversions.weeksToYear; // 15km/h avg

      // Carpool reduction
      const carpoolFrequency = parseInt(transport.carpoolFrequency) || 0;
      const carpoolReduction = carpoolFrequency * 0.5 * avgTripKm * emissionFactors.transport.car.petrol * conversions.weeksToYear;
      transportEmissions -= carpoolReduction;

      breakdown.transport = Math.max(0, transportEmissions);
      totalFootprint += breakdown.transport;
    }

    // 3. Travel calculation
    if (travel) {
      let travelEmissions = 0;

      // Southeast Asia flights
      const seAsiaFlightCounts = {
        '0': 0,
        '1_2': 1.5,
        '3_5': 4,
        '6_plus': 8
      };
      const seAsiaFlights = seAsiaFlightCounts[travel.seAsiaFlights] || 0;
      const seAsiaDistance = 1500; // Average SE Asia flight distance in km
      
      // Long-haul flights
      const longHaulFlightCounts = {
        '0': 0,
        '1_2': 1.5,
        '3_5': 4,
        '6_plus': 8
      };
      const longHaulFlights = longHaulFlightCounts[travel.longHaulFlights] || 0;
      const longHaulDistance = 8000; // Average long-haul flight distance in km

      // Flight class multiplier
      const flightClassMultiplier = {
        'economy': 1.0,
        'premium_economy': 1.3,
        'business': 2.5,
        'first': 4.0
      };
      const classMultiplier = flightClassMultiplier[travel.flightClass] || 1.0;

      // Calculate flight emissions
      if (seAsiaFlights > 0) {
        travelEmissions += seAsiaFlights * seAsiaDistance * emissionFactors.travel.shortHaul.economy * classMultiplier;
      }
      if (longHaulFlights > 0) {
        travelEmissions += longHaulFlights * longHaulDistance * emissionFactors.travel.longHaul.economy * classMultiplier;
      }

      // JB trips
      if (travel.jbTravel === 'yes') {
        const jbCounts = {
          '0': 0,
          '1_2': 1.5,
          '3_5': 4,
          '6_plus': 8
        };
        const jbTrips = jbCounts[travel.jbFrequency] || 0;
        travelEmissions += jbTrips * emissionFactors.travel.jbTrips;
      }

      // Cruise
      if (travel.cruise === 'yes') {
        travelEmissions += emissionFactors.travel.cruise;
      }

      // Domestic trips
      const domesticCounts = {
        '0': 0,
        '1_2': 1.5,
        '3_5': 4,
        '6_plus': 8
      };
      const domesticTrips = domesticCounts[travel.domesticTrips] || 0;
      travelEmissions += domesticTrips * emissionFactors.travel.domesticTrips;

      breakdown.travel = travelEmissions;
      totalFootprint += travelEmissions;
    }

    // 4. Fast Fashion calculation
    if (fashion) {
      let fashionEmissions = 0;

      // Buying frequency
      const buyingMultiplier = {
        'weekly': 52,
        'monthly': 12,
        'few_months': 4,
        'rarely': 1
      };
      const annualPurchases = buyingMultiplier[fashion.buyingFrequency] || 4;
      fashionEmissions += annualPurchases * emissionFactors.fastFashion.regularClothing;

      // Online frequency additional emissions
      const onlineMultiplier = {
        'weekly': 1.3,
        'monthly': 1.2,
        'few_times_year': 1.1,
        'never': 1.0
      };
      fashionEmissions *= (onlineMultiplier[fashion.onlineFrequency] || 1.0);

      // Shoes
      const shoeCounts = {
        '0_1': 0.5,
        '2_3': 2.5,
        '4_6': 5,
        '7_plus': 10
      };
      const shoeEmissions = shoeCounts[fashion.shoePairs] || 2.5;
      fashionEmissions += shoeEmissions * emissionFactors.fastFashion.shoes;

      // Sustainable shopping reduction
      if (fashion.sustainableShopping === 'yes') {
        fashionEmissions *= 0.7; // 30% reduction
      }

      // Clothing recycling reduction
      if (fashion.clothingRecycling === 'yes') {
        fashionEmissions *= 0.9; // 10% reduction
      }

      breakdown.fashion = fashionEmissions;
      totalFootprint += fashionEmissions;
    }

    // 5. Home & Utilities calculation
    if (home) {
      let homeEmissions = 0;

      // Home type multiplier
      const homeTypeMultiplier = emissionFactors.electricity.housingMultiplier[home.homeType] || 1.0;

      // Aircon usage (hours per day)
      const airconHours = parseInt(home.airconHours) || 0;
      homeEmissions += airconHours * emissionFactors.electricity.aircon * emissionFactors.electricity.grid * conversions.daysToYear;

      // Cooling method adjustment
      const coolingAdjustment = {
        'only_fan': 0.3,
        'only_aircon': 1.0,
        'both': 1.2,
        'neither': 0.1
      };
      homeEmissions *= (coolingAdjustment[home.coolingMethod] || 1.0);

      // Shower emissions
      const showerCounts = {
        '1': 1,
        '2': 2,
        '3_plus': 3.5
      };
      const showersPerDay = showerCounts[home.showersPerDay] || 1;
      homeEmissions += showersPerDay * 0.5 * emissionFactors.electricity.waterHeating * emissionFactors.electricity.grid * conversions.daysToYear;

      // Energy saving reduction
      if (home.energySaving === 'yes') {
        homeEmissions *= 0.85; // 15% reduction
      }

      // Apply home type multiplier
      homeEmissions *= homeTypeMultiplier;

      breakdown.home = homeEmissions;
      totalFootprint += homeEmissions;
    }

    // 6. Spending & Lifestyle calculation
    if (lifestyle) {
      let lifestyleEmissions = 0;

      // Cinema visits (monthly)
      const cinemaVisits = parseInt(lifestyle.cinemaVisits) || 0;
      lifestyleEmissions += cinemaVisits * emissionFactors.entertainment.cinema * conversions.monthsToYear;

      // Dining frequency
      const diningMultiplier = {
        'rarely': 0.5,
        'once_week': 1,
        '2_4_times_week': 2.5,
        'almost_daily': 6
      };
      const weeklyDining = diningMultiplier[lifestyle.diningFrequency] || 1;
      lifestyleEmissions += weeklyDining * emissionFactors.entertainment.cafe * conversions.weeksToYear;

      // Nightlife frequency
      const nightlifeMultiplier = {
        'never': 0,
        'few_months': 0.25,
        'monthly': 1,
        'weekly': 4
      };
      const monthlyNightlife = nightlifeMultiplier[lifestyle.nightlifeFrequency] || 0;
      lifestyleEmissions += monthlyNightlife * emissionFactors.entertainment.nightlife * conversions.monthsToYear;

      // Theme parks
      const themeParkMultiplier = {
        'never': 0,
        '1_2_year': 1.5,
        '3_5_year': 4,
        'monthly': 12
      };
      const annualThemeParks = themeParkMultiplier[lifestyle.themeParks] || 0;
      lifestyleEmissions += annualThemeParks * emissionFactors.entertainment.themePark;

      // Leisure activities
      const leisureMultiplier = {
        'rarely': 0.25,
        'monthly': 1,
        'weekly': 4
      };
      const monthlyLeisure = leisureMultiplier[lifestyle.leisureActivities] || 0;
      lifestyleEmissions += monthlyLeisure * emissionFactors.entertainment.leisureActivity * conversions.monthsToYear;

      breakdown.lifestyle = lifestyleEmissions;
      totalFootprint += lifestyleEmissions;
    }

    // 7. Electronics Usage calculation
    if (electronics) {
      let electronicsEmissions = 0;

      // Digital usage (hours per day)
      const socialMediaHours = parseInt(electronics.socialMediaHours) || 0;
      const gamingHours = parseInt(electronics.gamingHours) || 0;
      const streamingHours = parseInt(electronics.streamingHours) || 0;

      electronicsEmissions += socialMediaHours * emissionFactors.electronics.socialMedia * conversions.daysToYear;
      electronicsEmissions += gamingHours * emissionFactors.electronics.gaming * conversions.daysToYear;
      electronicsEmissions += streamingHours * emissionFactors.electronics.streaming * conversions.daysToYear;

      // Device upgrade frequency
      const upgradeMultiplier = emissionFactors.electronics.upgradeFrequency[electronics.phoneUpgrade] || 0.4;
      electronicsEmissions += emissionFactors.electronics.smartphone * upgradeMultiplier;

      // Multiple devices
      if (electronics.multipleDevices === 'yes') {
        electronicsEmissions += emissionFactors.electronics.laptop * 0.5; // Additional laptop/tablet
      }

      // Repair/reuse reduction
      if (electronics.repairReuse === 'yes') {
        electronicsEmissions *= 0.8; // 20% reduction
      }

      breakdown.electronics = electronicsEmissions;
      totalFootprint += electronicsEmissions;
    }

    // 8. Waste Generation calculation
    if (waste) {
      let wasteEmissions = 0;

      // Takeaway meals (weekly)
      const takeawayMeals = parseInt(waste.takeawayMeals) || 0;
      wasteEmissions += takeawayMeals * emissionFactors.waste.takeawayMeal * conversions.weeksToYear;

      // Plastic cutlery frequency
      const cutleryMultiplier = {
        'always': 1.0,
        'often': 0.7,
        'sometimes': 0.4,
        'never': 0
      };
      const cutleryEmissions = takeawayMeals * emissionFactors.waste.plasticCutlery * (cutleryMultiplier[waste.plasticCutlery] || 0.7);
      wasteEmissions += cutleryEmissions * conversions.weeksToYear;

      // Online shopping (monthly)
      const onlineShopping = parseInt(waste.onlineShopping) || 0;
      wasteEmissions += onlineShopping * emissionFactors.waste.onlineOrder * conversions.monthsToYear;

      // Reusable containers/bags reduction
      const reusableContainerReduction = {
        'never': 0,
        'sometimes': 0.25,
        'often': 0.5,
        'always': 0.8
      };
      const containerReduction = reusableContainerReduction[waste.reusableContainers] || 0;
      wasteEmissions -= takeawayMeals * containerReduction * emissionFactors.waste.reusableContainer * conversions.weeksToYear;

      const reusableBagReduction = {
        'never': 0,
        'sometimes': 0.25,
        'often': 0.5,
        'always': 0.8
      };
      const bagReduction = reusableBagReduction[waste.reusableBags] || 0;
      wasteEmissions -= onlineShopping * bagReduction * Math.abs(emissionFactors.waste.reusableBag) * conversions.monthsToYear;

      // Recycling reduction
      if (waste.recycling === 'yes') {
        wasteEmissions += emissionFactors.waste.recycling * 50; // 50kg recycled per year
      }

      breakdown.waste = Math.max(0, wasteEmissions);
      totalFootprint += breakdown.waste;
    }

    // 9. Offsetting Activities calculation (negative emissions)
    if (offsetting) {
      let offsetEmissions = 0;

      // Cleanup events
      if (offsetting.cleanupEvents === 'yes') {
        offsetEmissions += emissionFactors.offsetting.beachCleanup * 3; // 3 events per year
      }

      // Volunteering hours (monthly)
      const volunteeringHours = parseInt(offsetting.volunteeringHours) || 0;
      offsetEmissions += volunteeringHours * emissionFactors.offsetting.volunteering * conversions.monthsToYear;

      // Environmental club
      if (offsetting.envClub === 'yes') {
        offsetEmissions += emissionFactors.offsetting.envClub * conversions.monthsToYear;
      }

      // Earth Hour participation
      if (offsetting.earthHour === 'yes') {
        offsetEmissions += emissionFactors.offsetting.earthHour;
      }

      // Composting
      if (offsetting.composting === 'yes') {
        offsetEmissions += emissionFactors.offsetting.composting * conversions.monthsToYear;
      }

      // Donations/offsets
      if (offsetting.donations === 'yes') {
        offsetEmissions += emissionFactors.offsetting.donation * 2; // 2 donations per year
      }

      breakdown.offsetting = offsetEmissions;
      totalFootprint += offsetEmissions; // These are negative, so they reduce total
    }

    // Convert to tonnes and ensure non-negative
    const totalFootprintTonnes = Math.max(0, totalFootprint * conversions.kgToTonnes);

    // Comparison with averages
    const singaporeAverage = averages.singapore.perCapita;
    const globalAverage = averages.global.perCapita;
    const percentile = Math.max(0, Math.min(100, ((singaporeAverage - totalFootprintTonnes) / singaporeAverage) * 100));

    // Convert breakdown to tonnes
    const breakdownTonnes = {};
    for (const [key, value] of Object.entries(breakdown)) {
      breakdownTonnes[key] = Math.max(0, value * conversions.kgToTonnes);
    }

    res.json({
      success: true,
      footprint: {
        totalFootprint: totalFootprintTonnes,
        breakdown: breakdownTonnes,
        comparison: {
          singaporeAverage,
          globalAverage,
          percentile
        }
      }
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
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      footprints: footprints.map(fp => ({
        id: fp._id,
        totalFootprint: fp.totalFootprint,
        breakdown: fp.breakdown,
        date: fp.createdAt,
        comparison: fp.comparison
      }))
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get carbon footprint history' });
  }
});

// Get emission factors
router.get('/factors', async (req, res) => {
  res.json({
    success: true,
    factors: emissionFactors,
    averages,
    conversions
  });
});

module.exports = router;