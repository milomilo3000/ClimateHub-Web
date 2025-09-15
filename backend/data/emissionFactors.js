// Singapore-specific emission factors (kg CO2 per unit)
// Based on Ecosperity food study, Straits Times transport data, and climatiq API

const emissionFactors = {
  // 1. Diet & Food Habits - Source: Ecosperity food study Singapore
  food: {
    // Meats (kg CO2 per kg)
    beef: 24.4,
    chicken: 3.5,
    pork: 12.0,
    mutton: 16.4,
    fish: 6.3,
    seafood: 5.7,
    duck: 4.2,
    
    // Other foods
    eggs: 3.1,
    rice: 2.6,
    vegetables: 0.6,
    fruits: 0.4,
    wheat: 0.4,
    
    // Meal types (estimated per meal)
    meatMeal: 2.5,           // Average meat meal
    vegetarianMeal: 0.8,     // Plant-based meal
    hawkerMeal: 1.8,         // Average hawker centre meal
    
    // Beverages and delivery
    bubbleTea: 0.3,          // Per cup
    sweetenedBeverage: 0.2,  // Per cup
    foodDelivery: 1.5,       // Additional emissions per delivery
    packaging: 0.3,          // Per takeaway container
    foodWaste: 2.3          // Per kg of wasted food
  },

  // 2. Transport - Source: Straits Times
  transport: {
    // Cars (kg CO2 per km)
    car: {
      petrol: 0.155,         // SG Gasoline cars
      hybrid: 0.12,
      electric: 0.075,       // EV mid-sized sedan
      production: {
        petrol: 7400,        // 7.4 tonnes for petrol car production
        electric: 12200      // 12.2 tonnes for EV production
      }
    },
    
    // Public transport (kg CO2 per km per passenger)
    publicBus: 0.07,
    mrt: 0.04,
    lrt: 0.04,
    
    // Private transport
    taxi: 0.155,             // Same as petrol car
    grab: 0.155,
    escooter: 0.02,
    motorbike: 0.08,
    bicycle: 0,
    walking: 0,
    
    // Shared transport bonus
    carpoolReduction: 0.5    // 50% reduction when sharing
  },

  // 3. Travel/Flights
  travel: {
    // Southeast Asia flights (kg CO2 per km)
    shortHaul: {
      economy: 0.079,
      business: 0.119
    },
    
    // Long-haul flights outside Asia (kg CO2 per km) 
    longHaul: {
      economy: 0.077,
      business: 0.225,
      first: 0.310,
      premiumEconomy: 0.12
    },
    
    // Other travel
    domesticTrips: 50,       // Per overnight trip (Sentosa, etc.)
    jbTrips: 35,            // Per JB trip (estimated)
    cruise: 250             // Per cruise (estimated)
  },

  // 4. Fast Fashion - Using climatiq API values
  fastFashion: {
    regularClothing: 15.0,   // Per item from fast fashion brands
    sustainableClothing: 2.5, // Per thrift/sustainable item
    shoes: 12.5,             // Per pair
    accessories: 3.2,        // Per accessory item
    onlineShipping: 2.0      // Additional per online order
  },

  // 5. Home & Utilities - Singapore electricity grid: 0.412 kg CO2/kWh
  electricity: {
    grid: 0.412,             // Singapore electricity grid factor
    
    // Appliances (kW ratings × hours × grid factor)
    aircon: 2.5,             // 2.5 kW average aircon
    fan: 0.075,              // 75W fan
    lights: 0.01,            // 10W LED bulb
    waterHeating: 3.5,       // Electric water heater for shower
    
    // Housing type multipliers
    housingMultiplier: {
      hdb1to3: 0.7,          // Smaller units
      hdb4to5: 1.0,          // Baseline
      condo: 1.4,            // Larger units
      landed: 2.2            // Largest units
    }
  },

  // 6. Spending & Lifestyle
  entertainment: {
    cinema: 1.2,             // Per visit
    restaurant: 2.8,         // Per meal
    cafe: 1.5,               // Per cafe visit
    nightlife: 3.5,          // Per night out
    themePark: 8.0,          // Per theme park visit
    leisureActivity: 2.0     // Bowling, laser tag, escape room
  },

  // 7. Electronics Usage
  electronics: {
    // Digital usage (kg CO2 per hour)
    socialMedia: 0.036,      // Per hour of use
    gaming: 0.12,            // Per hour (console/PC)
    mobileGaming: 0.02,      // Per hour (mobile)
    streaming: 0.036,        // Per hour of streaming
    
    // Device production emissions (annual allocation)
    smartphone: 85,          // Annual footprint for new phone
    laptop: 300,             // Annual footprint for new laptop
    tablet: 120,             // Annual footprint for new tablet
    
    // Device upgrade frequency multipliers
    upgradeFrequency: {
      yearly: 1.0,           // Full annual allocation
      every2to3years: 0.4,   // Reduced allocation
      over3years: 0.2        // Minimal allocation
    }
  },

  // 8. Waste Generation
  waste: {
    takeawayMeal: 0.5,       // Per takeaway meal
    plasticCutlery: 0.05,    // Per set
    plasticBag: 0.006,       // Per plastic bag
    onlineOrder: 0.8,        // Per online shopping order (packaging)
    
    // Waste reduction benefits (negative emissions)
    reusableContainer: -0.1, // Per use of reusable container
    reusableBag: -0.006,     // Per use instead of plastic bag
    recycling: -0.1,         // Per kg recycled
    foodWasteCompost: -2.3   // Per kg composted instead of thrown
  },

  // 9. Offsetting Activities (negative emissions - kg CO2 saved)
  offsetting: {
    beachCleanup: -2.0,      // Per cleanup event
    treePlanting: -5.0,      // Per planting event
    parkCleanup: -1.5,       // Per cleanup event
    volunteering: -0.5,      // Per hour of environmental volunteering
    envClub: -2.0,           // Per month of participation
    earthHour: -0.5,         // Per participation
    composting: -1.0,        // Per month of active composting
    donation: -10.0,         // Per environmental donation
    flightOffset: -15.0      // Per flight offset purchase
  }
};

// Singapore and Global averages for comparison (tonnes CO2 per year)
const averages = {
  singapore: {
    perCapita: 8.56,         // tonnes CO2 per capita per year
    household: 2.5,
    transport: 2.1,
    electricity: 1.8,
    waste: 0.3,
    food: 1.2,
    goods: 0.8
  },
  global: {
    perCapita: 4.8,          // tonnes CO2 per capita per year
    household: 2.0,
    transport: 1.5,
    electricity: 1.2,
    waste: 0.2,
    food: 1.0,
    goods: 0.6
  }
};

// Conversion factors
const conversions = {
  kgToTonnes: 0.001,
  tonnesToKg: 1000,
  daysToYear: 365,
  weeksToYear: 52,
  monthsToYear: 12
};

module.exports = {
  emissionFactors,
  averages,
  conversions
};