const mongoose = require('mongoose');

const carbonFootprintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  totalFootprint: {
    type: Number,
    required: true
  },
  breakdown: {
    diet: {
      type: Number,
      default: 0
    },
    transport: {
      type: Number,
      default: 0
    },
    home: {
      type: Number,
      default: 0
    },
    lifestyle: {
      type: Number,
      default: 0
    },
    electronics: {
      type: Number,
      default: 0
    },
    waste: {
      type: Number,
      default: 0
    }
  },
  inputData: {
    diet: {
      mealsWithMeat: Number,
      hawkerVisits: Number,
      plantBasedFrequency: String,
      bubbleTeaCups: Number,
      foodDelivery: Number,
      packagedSnacks: String,
      foodWaste: String
    },
    transport: {
      publicTransportDays: Number,
      walkCycleDays: Number,
      grabTaxiFrequency: String,
      carType: String,
      averageTripLength: Number,
      escooterHours: Number,
      carpoolFrequency: Number
    },
    home: {
      homeType: String,
      airconHours: Number,
      coolingMethod: String,
      showersPerDay: Number,
      energySaving: String
    },
    lifestyle: {
      diningFrequency: String,
      nightlifeFrequency: String
    },
    electronics: {
      socialMediaHours: Number,
      gamingHours: Number,
      streamingHours: Number,
      osnInetHours: Number
    },
    waste: {
      reusableBags: String,
      onlineShopping: Number
    }
  },
  comparison: {
    singaporeAverage: Number,
    globalAverage: Number,
    percentile: Number
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for efficient querying
carbonFootprintSchema.index({ userId: 1, date: -1 });
carbonFootprintSchema.index({ date: -1 });

module.exports = mongoose.model('CarbonFootprint', carbonFootprintSchema); 