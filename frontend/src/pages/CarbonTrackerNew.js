import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { 
  Calculator, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  TrendingUp, 
  Globe, 
  Users,
  CheckCircle,
  AlertCircle,
  Leaf,
  Clock,
  Wind,
  Bird
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CarbonTrackerNew = () => {
  const { user, refreshUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAirconQuestions, setShowAirconQuestions] = useState(true);

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    defaultValues: {
      electronics: {
        socialMedia: "",
        gaming: "",
        streaming: "",
        laptop: "",
        phoneCharging: ""
      },
      diet: {
        beefPork: "",
        otherMeats: "",
        bubbleTea: "",
        takeaway: "",
        packagedSnacks: "",
        foodWaste: ""
      },
      transport: {
        publicTransport: "",
        carTaxi: "",
        motorbike: "",
        distance: ""
      },
      home: {
        homeType: "",
        bedrooms: "",
        coolingMethod: "",
        coolingHours: "",
        airconTemp: "",
        showers: "",
        appliancesOff: ""
      },
      shopping: {
        inPerson: "",
        reusableBag: "",
        online: ""
      }
    }
  });
  
  // Watch all values for conditional logic
  const watchedValues = watch();

  // Updated steps configuration for new calculator
  const steps = [
    { id: 1, title: 'Electronics Usage', description: 'Your digital device and technology usage patterns' },
    { id: 2, title: 'Diet & Food Habits', description: 'Your weekly food consumption and eating patterns' },
    { id: 3, title: 'Transport', description: 'Your weekly travel and commuting habits' },
    { id: 4, title: 'Home & Utilities', description: 'Your home energy and water usage patterns' },
    { id: 5, title: 'Shopping', description: 'Your shopping and consumption habits' }
  ];

  // Watch for cooling method changes to show/hide aircon questions
  useEffect(() => {
    const coolingMethod = watchedValues?.home?.coolingMethod;
    setShowAirconQuestions(coolingMethod === 'only_aircon' || coolingMethod === 'both');
  }, [watchedValues?.home?.coolingMethod]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Calculate emissions based on new logic
      const weeklyFootprint = calculateWeeklyFootprint(data);
      setResults(weeklyFootprint);
      setFormData(data);
      setSaved(false);
      toast.success('Carbon footprint calculated successfully!');
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Failed to calculate carbon footprint');
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyFootprint = (data) => {
    let totalFootprint = 0;
    const breakdown = {};

    // 1. Electronics Usage
    let electronicsEmissions = 0;
    
    // Social Media: EF = 0.123 kgCO2/hour
    const socialMediaHours = getMedianValue(data.electronics?.socialMedia) * 7;
    electronicsEmissions += socialMediaHours * 0.123;
    
    // Gaming: EF = 0.0044 kgCO2/hour
    const gamingHours = getMedianValue(data.electronics?.gaming) * 7;
    electronicsEmissions += gamingHours * 0.0044;
    
    // Streaming: EF = 0.055 kgCO2/hour
    const streamingHours = getMedianValue(data.electronics?.streaming) * 7;
    electronicsEmissions += streamingHours * 0.055;
    
    // Laptop: EF = 0.025 kgCO2/hour
    const laptopHours = getMedianValue(data.electronics?.laptop) * 7;
    electronicsEmissions += laptopHours * 0.025;
    
    // Phone charging: EF = 0.3 kgCO2/full charge
    const phoneCharging = getPhoneChargingValue(data.electronics?.phoneCharging) * 7;
    electronicsEmissions += phoneCharging * 0.007;
    
    breakdown.electronics = electronicsEmissions;
    totalFootprint += electronicsEmissions;

    // 2. Diet & Food Habits
    let dietEmissions = 0;
    
    // Beef/Pork: EF = 18.2 kgCO2/meal (average)
    const beefPorkMeals = getMedianValue(data.diet?.beefPork);
    dietEmissions += beefPorkMeals * 2.73;
    
    // Other meats: EF = 4.67 kgCO2/meal
    const otherMeatMeals = getMedianValue(data.diet?.otherMeats);
    dietEmissions += otherMeatMeals * 0.56;
    
    // Bubble tea: EF = 0.4 kgCO2/cup
    const bubbleTeaCups = getMedianValue(data.diet?.bubbleTea);
    dietEmissions += bubbleTeaCups * 0.4;
    
    // Takeaway: EF = 0.28 kgCO2/meal
    const takeawayMeals = getMedianValue(data.diet?.takeaway);
    dietEmissions += takeawayMeals * 0.28;
    
    // Packaged snacks: EF = 0.5 kgCO2/item
    const packagedSnacks = getMedianValue(data.diet?.packagedSnacks);
    dietEmissions += packagedSnacks * 0.5;
    
    // Food waste: EF = 0.134 kgCO2/meal wasted
    const foodWasteMultiplier = getFoodWasteMultiplier(data.diet?.foodWaste);
    const wastedMeals = foodWasteMultiplier * 21; // 21 meals per week
    dietEmissions += wastedMeals * 0.134;
    
    breakdown.diet = dietEmissions;
    totalFootprint += dietEmissions;

    // 3. Transport
    let transportEmissions = 0;
    const distance = getDistanceMedian(data.transport?.distance);
    
    // Public transport: EF = 0.05 kgCO2/km
    const publicTransportTrips = getMedianValue(data.transport?.publicTransport);
    transportEmissions += distance * publicTransportTrips * 0.05;
    
    // Car/Taxi: EF = 0.192 kgCO2/km
    const carTaxiTrips = getMedianValue(data.transport?.carTaxi);
    transportEmissions += distance * carTaxiTrips * 0.192;
    
    // Motorbike/E-scooter: EF = 0.12 kgCO2/km
    const motorbikeTrips = getMedianValue(data.transport?.motorbike);
    transportEmissions += distance * motorbikeTrips * 0.12;
    
    breakdown.transport = transportEmissions;
    totalFootprint += transportEmissions;

    // 4. Home & Utilities
    let homeEmissions = 0;
    
    // Base multipliers
    const homeTypeMultiplier = getHomeTypeMultiplier(data.home?.homeType);
    const bedroomMultiplier = getBedroomMultiplier(data.home?.bedrooms);
    
    // Cooling usage
    if (showAirconQuestions) {
      const coolingHours = getMedianValue(data.home?.coolingHours) * 7;
      const airconEmissions = coolingHours * 0.33; // Aircon EF
      const tempMultiplier = getTempMultiplier(data.home?.airconTemp);
      homeEmissions += airconEmissions * tempMultiplier;
    } else {
      // Fan only
      const fanHours = getMedianValue(data.home?.coolingHours) * 7;
      homeEmissions += fanHours * 0.06; // Fan EF
    }
    
    // Showers: EF = 0.8 kgCO2/shower
    const showersPerDay = getShowerValue(data.home?.showers);
    homeEmissions += showersPerDay * 7 * 0.8;
    
    // Apply multipliers
    homeEmissions *= homeTypeMultiplier * bedroomMultiplier;
    
    // Appliance usage multiplier
    const applianceMultiplier = getApplianceMultiplier(data.home?.appliancesOff);
    homeEmissions *= applianceMultiplier;
    
    breakdown.home = homeEmissions;
    totalFootprint += homeEmissions;

    // 5. Shopping
    let shoppingEmissions = 0;
    
    // In-person shopping: EF = 0.2 kgCO2/trip
    const inPersonShopping = getMedianValue(data.shopping?.inPerson);
    const baseShoppingEmissions = inPersonShopping * 0.2;
    
    // Apply reusable bag multiplier
    const bagMultiplier = getBagMultiplier(data.shopping?.reusableBag);
    shoppingEmissions += baseShoppingEmissions * bagMultiplier;
    
    // Online shopping: EF = 2.0 kgCO2/order
    const onlineShopping = getMedianValue(data.shopping?.online);
    shoppingEmissions += onlineShopping * 2.0;
    
    breakdown.shopping = shoppingEmissions;
    totalFootprint += shoppingEmissions;

    return {
      totalFootprint: totalFootprint,
      breakdown: breakdown,
      comparison: {
        singaporeAverage: 8.56,
        globalAverage: 4.8,
        percentile: Math.max(0, Math.min(100, ((8.56 - totalFootprint) / 8.56) * 100))
      }
    };
  };

  // Helper functions for median values
  const getMedianValue = (option) => {
    const medians = {
      '0': 0, '0-2': 1, '0-3': 1.5,
      '1-3': 2, '2-4': 3, '3-7': 5, '4-6': 5,
      '6+': 7, '7+': 7
    };
    return medians[option] || 0;
  };

  const getPhoneChargingValue = (option) => {
    const values = { '1': 1, '2': 2, '3': 3, '4+': 4 };
    return values[option] || 1;
  };

  const getDistanceMedian = (option) => {
    const distances = { '0-5': 3, '6-10': 8, '11-15': 13, '15+': 20 };
    return distances[option] || 3;
  };

  const getFoodWasteMultiplier = (option) => {
    const multipliers = { 'never': 0, 'rarely': 0.25, 'often': 0.5, 'always': 1 };
    return multipliers[option] || 0;
  };

  const getHomeTypeMultiplier = (option) => {
    const multipliers = { 'hdb': 1.0, 'condo': 1.4, 'landed': 2.2 };
    return multipliers[option] || 1.0;
  };

  const getBedroomMultiplier = (option) => {
    const multipliers = { '1': 0.7, '2': 1.0, '3': 1.2, '4+': 1.4 };
    return multipliers[option] || 1.0;
  };

  const getTempMultiplier = (option) => {
    const multipliers = { '<20': 1.15, '20-23': 1.0, '24-26': 0.9, '26+': 0.8 };
    return multipliers[option] || 1.0;
  };

  const getShowerValue = (option) => {
    const values = { '1': 1, '2': 2, '3+': 3 };
    return values[option] || 1;
  };

  const getApplianceMultiplier = (option) => {
    const multipliers = { 'never': 1.3, 'rarely': 1.15, 'often': 1.07, 'always': 1.0 };
    return multipliers[option] || 1.0;
  };

  const getBagMultiplier = (option) => {
    const multipliers = { 'never': 1.0, 'rarely': 0.75, 'often': 0.5, 'always': 0.25 };
    return multipliers[option] || 1.0;
  };

  const saveResults = async () => {
    if (!user) {
      toast.error('Please sign in to save your results');
      return;
    }

    try {
      const token = await getAuth().currentUser?.getIdToken();
      const response = await axios.post('/api/carbon/save', {
        footprint: results,
        breakdown: results.breakdown,
        inputData: formData,
        notes: 'Weekly footprint calculation'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSaved(true);
        toast.success('Results saved successfully!');
        await refreshUserProfile();
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save results');
    }
  };

  // New nextStep with validation
  const nextStep = async () => {
    // Map each step to the fields that should be validated for that step
    const stepFields = [
      // Step 1: Electronics Usage
      [
        'electronics.socialMedia',
        'electronics.gaming',
        'electronics.streaming',
        'electronics.laptop',
        'electronics.phoneCharging'
      ],
      // Step 2: Diet & Food Habits
      [
        'diet.beefPork',
        'diet.otherMeats',
        'diet.bubbleTea',
        'diet.takeaway',
        'diet.packagedSnacks',
        'diet.foodWaste'
      ],
      // Step 3: Transport
      [
        'transport.publicTransport',
        'transport.carTaxi',
        'transport.motorbike',
        'transport.distance'
      ],
       // Step 4: Home & Utilities
       [
         'home.homeType',
         'home.bedrooms',
         'home.coolingMethod',
         'home.coolingHours',
         // Conditionally include airconTemp only if aircon is used
         ...(watchedValues?.home?.coolingMethod === 'only_aircon' || watchedValues?.home?.coolingMethod === 'both' ? ['home.airconTemp'] : []),
         'home.showers',
         'home.appliancesOff'
       ],
      // Step 5: Shopping
      [
        'shopping.inPerson',
        'shopping.reusableBag',
        'shopping.online'
      ]
    ];

     // Validate all fields for this step before proceeding
     const fieldsToValidate = stepFields[currentStep - 1];
     console.log('=== STEP VALIDATION DEBUG ===');
     console.log('Current step:', currentStep);
     console.log('Total steps:', steps.length);
     console.log('Fields to validate:', fieldsToValidate);
     console.log('Current form values:', watchedValues);
     
     const valid = await trigger(fieldsToValidate);
     console.log('Validation result:', valid);
     
     if (valid) {
       if (currentStep < steps.length) {
         const nextStepNumber = currentStep + 1;
         console.log('Moving from step', currentStep, 'to step', nextStepNumber);
         
         // Safety check: ensure we never skip the shopping step (step 5)
         if (currentStep === 4 && nextStepNumber !== 5) {
           console.error('ERROR: Trying to skip shopping step! Forcing to step 5');
           setCurrentStep(5);
         } else {
           if (currentStep === 4 && nextStepNumber === 5) {
             console.log("Moving to Shopping step (5). currentStep before:", currentStep);
           }
           setCurrentStep(nextStepNumber);
         }
         
         window.scrollTo({ top: 0, behavior: 'smooth' });
       } else {
         console.log('Already at last step, cannot proceed further');
       }
     } else {
       console.log('Validation failed for step', currentStep);
       toast.error('Please answer all questions before proceeding');
     }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getStepContent = (step) => {
    console.log('=== RENDERING STEP ===');
    console.log('Rendering step:', step);
    console.log('Step title:', steps[step - 1]?.title);
    console.log('Total steps available:', steps.length);
    switch (step) {
      case 1: // Electronics Usage
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How many hours a day have you spent on social media in the past week? (e.g., Instagram, TikTok, WhatsApp)</label>
              <select {...register('electronics.socialMedia', { required: true })} className="input-field">
                <option value="">Select hours per day</option>
                <option value="0-2">0–2 hours</option>
                <option value="2-4">2–4 hours</option>
                <option value="4-6">4–6 hours</option>
                <option value="6+">6+ hours</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">How many hours a day have you spent gaming in the past week? (console, PC, mobile)</label>
              <select {...register('electronics.gaming', { required: true })} className="input-field">
                <option value="">Select hours per day</option>
                <option value="0-2">0–2 hours</option>
                <option value="2-4">2–4 hours</option>
                <option value="4-6">4–6 hours</option>
                <option value="6+">6+ hours</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many hours a day have you spent streaming videos or music (Netflix, Youtube, Spotify) in the past week?</label>
              <select {...register('electronics.streaming', { required: true })} className="input-field">
                <option value="">Select hours per day</option>
                <option value="0-2">0–2 hours</option>
                <option value="2-4">2–4 hours</option>
                <option value="4-6">4–6 hours</option>
                <option value="6+">6+ hours</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many hours a day have you spent on your OSN, INET or personal laptop in the past week?</label>
              <select {...register('electronics.laptop', { required: true })} className="input-field">
                <option value="">Select hours per day</option>
                <option value="0-2">0–2 hours</option>
                <option value="2-4">2–4 hours</option>
                <option value="4-6">4–6 hours</option>
                <option value="6+">6+ hours</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many times a day have you fully charged your phone in the past week?</label>
              <select {...register('electronics.phoneCharging', { required: true })} className="input-field">
                <option value="">Select times per day</option>
                <option value="1">1 time</option>
                <option value="2">2 times</option>
                <option value="3">3 times</option>
                <option value="4+">4+ times</option>
              </select>
            </div>
          </div>
        );

      case 2: // Diet & Food Habits
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How many times have you consumed beef or pork in the past week?</label>
              <select {...register('diet.beefPork', { required: true })} className="input-field">
                <option value="">Select times per week</option>
                <option value="0">0 times</option>
                <option value="1-3">1–3 times</option>
                <option value="3-7">3–7 times</option>
                <option value="7+">7+ times</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">How many times have you consumed any other meats (Chicken, fish, duck, etc.) in the past week?</label>
              <select {...register('diet.otherMeats', { required: true })} className="input-field">
                <option value="">Select times per week</option>
                <option value="0">0 times</option>
                <option value="1-3">1–3 times</option>
                <option value="3-7">3–7 times</option>
                <option value="7+">7+ times</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many cups of bubble tea did you drink in the past week?</label>
              <select {...register('diet.bubbleTea', { required: true })} className="input-field">
                <option value="">Select cups per week</option>
                <option value="0">0 cups</option>
                <option value="1-3">1–3 cups</option>
                <option value="3-7">3–7 cups</option>
                <option value="7+">7+ cups</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many times did you order-in or takeaway in the past week (includes canteen, lim kopi, etc)?</label>
              <select {...register('diet.takeaway', { required: true })} className="input-field">
                <option value="">Select times per week</option>
                <option value="0">0 times</option>
                <option value="1-3">1–3 times</option>
                <option value="3-7">3–7 times</option>
                <option value="7+">7+ times</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many times in the past week have you bought packaged drinks/snacks/instant noodles from Cheers?</label>
              <select {...register('diet.packagedSnacks', { required: true })} className="input-field">
                <option value="">Select times per week</option>
                <option value="0">0 times</option>
                <option value="1-3">1–3 times</option>
                <option value="3-7">3–7 times</option>
                <option value="7+">7+ times</option>
              </select>
            </div>

            <div>
              <label className="form-label">Thinking about the past week, how often did you throw away a majority of your meals?</label>
              <select {...register('diet.foodWaste', { required: true })} className="input-field">
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="rarely">Rarely</option>
                <option value="often">Often</option>
                <option value="always">Always</option>
              </select>
            </div>
          </div>
        );

      case 3: // Transport
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How many trips did you make via public transport in the past week (MRT, LRT, Buses)?</label>
              <select {...register('transport.publicTransport', { required: true })} className="input-field">
                <option value="">Select trips per week</option>
                <option value="0-3">0–3 trips</option>
                <option value="3-7">3–7 trips</option>
                <option value="7+">7+ trips</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">How many trips by car/taxi have you made in the past week?</label>
              <select {...register('transport.carTaxi', { required: true })} className="input-field">
                <option value="">Select trips per week</option>
                <option value="0-3">0–3 trips</option>
                <option value="3-7">3–7 trips</option>
                <option value="7+">7+ trips</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many trips by motorbikes or e-scooter have you made in the past week?</label>
              <select {...register('transport.motorbike', { required: true })} className="input-field">
                <option value="">Select trips per week</option>
                <option value="0-3">0–3 trips</option>
                <option value="3-7">3–7 trips</option>
                <option value="7+">7+ trips</option>
              </select>
            </div>

            <div>
              <label className="form-label">How far is your trip from home to camp?</label>
              <select {...register('transport.distance', { required: true })} className="input-field">
                <option value="">Select distance</option>
                <option value="0-5">0–5km</option>
                <option value="6-10">6–10km</option>
                <option value="11-15">11–15km</option>
                <option value="15+">15km+</option>
              </select>
            </div>
          </div>
        );

      case 4: // Home & Utilities
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">What type of home do you live in?</label>
              <select {...register('home.homeType', { required: true })} className="input-field">
                <option value="">Select home type</option>
                <option value="hdb">HDB</option>
                <option value="condo">Condominium</option>
                <option value="landed">Landed Property</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">How many bedrooms does your house have (including living room)?</label>
              <select {...register('home.bedrooms', { required: true })} className="input-field">
                <option value="">Select number of bedrooms</option>
                <option value="1">1 bedroom</option>
                <option value="2">2 bedrooms</option>
                <option value="3">3 bedrooms</option>
                <option value="4+">4+ bedrooms</option>
              </select>
            </div>

            <div>
              <label className="form-label">When cooling your room, which applies most often?</label>
              <select {...register('home.coolingMethod', { required: true })} className="input-field">
                <option value="">Select cooling method</option>
                <option value="only_aircon">Only aircon</option>
                <option value="only_fan">Only fan</option>
                <option value="both">Both aircon and fan</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many hours per day do you use the {showAirconQuestions ? 'aircon' : 'fan'} in your home?</label>
              <select {...register('home.coolingHours', { required: true })} className="input-field">
                <option value="">Select hours per day</option>
                <option value="0">0 hours</option>
                <option value="1-5">1–5 hours</option>
                <option value="6-10">6–10 hours</option>
                <option value="11-14">11–14 hours</option>
              </select>
            </div>

            {/* Only show aircon temperature question if aircon is used */}
            {(watchedValues?.home?.coolingMethod === 'only_aircon' || watchedValues?.home?.coolingMethod === 'both') && (
              <div>
                <label className="form-label">What was the average temperature of your Aircon this past week?</label>
                <select {...register('home.airconTemp', { required: true })} className="input-field">
                  <option value="">Select temperature range</option>
                  <option value="<20">Less than 20°C</option>
                  <option value="20-23">20–23°C</option>
                  <option value="24-26">24–26°C</option>
                  <option value="26+">26°C+</option>
                </select>
              </div>
            )}

            <div>
              <label className="form-label">How many showers did you take per day this past week?</label>
              <select {...register('home.showers', { required: true })} className="input-field">
                <option value="">Select showers per day</option>
                <option value="1">1 shower</option>
                <option value="2">2 showers</option>
                <option value="3+">3+ showers</option>
              </select>
            </div>

            <div>
              <label className="form-label">Did you turn off lights, fans, and electronics when not in use this past week?</label>
              <select {...register('home.appliancesOff', { required: true })} className="input-field">
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="rarely">Rarely</option>
                <option value="often">Often</option>
                <option value="always">All the time</option>
              </select>
            </div>
          </div>
        );

      case 5: // Shopping
        console.log("=== Shopping Step Render Debug ===");
        console.log("watchedValues.shopping:", watchedValues?.shopping);
        console.log("Registering shopping fields",
          register("shopping.inPerson"),
          register("shopping.reusableBag"),
          register("shopping.online")
        );
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How many times did you go shopping in-person this past week (including Supermarkets, Shops, Stores)?</label>
              <select {...register('shopping.inPerson', { required: true })} className="input-field">
                <option value="">Select trips per week</option>
                <option value="0-3">0–3 times</option>
                <option value="3-7">3–7 times</option>
                <option value="7+">7+ times</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">When in-person shopping, how often did you bring a reusable bag instead of taking a plastic bag this past week?</label>
              <select {...register('shopping.reusableBag', { required: true })} className="input-field">
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="rarely">Rarely</option>
                <option value="often">Often</option>
                <option value="always">All the time</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many times did you shop online (Shopee, Lazada, Qoo10) in the past week?</label>
              <select {...register('shopping.online', { required: true })} className="input-field">
                <option value="">Select orders per week</option>
                <option value="0-3">0–3 orders</option>
                <option value="3-7">3–7 orders</option>
                <option value="7+">7+ orders</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Colors for charts
  const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'];

  // New results rendering function: clean layout, only key blocks, no decorative/annual/breakdown blocks.
  function renderResults() {
    console.log("Results rendering triggered — did we skip shopping?");
    // Prepare data for charts
    const breakdownData = Object.entries(results.breakdown).map(([category, value]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: value,
    }));
    // Recommendations (example, can be expanded)
    const recommendations = [
      {
        title: "Reduce Electronics Usage",
        desc: "Limit daily screen time and unplug devices when not in use.",
      },
      {
        title: "Eat Less Red Meat",
        desc: "Try plant-based meals or reduce beef/pork consumption.",
      },
      {
        title: "Take Public Transport",
        desc: "Opt for buses and trains instead of private vehicles.",
      },
      {
        title: "Save Energy at Home",
        desc: "Turn off appliances, use fans, and set aircon to 25°C+.",
      },
      {
        title: "Use Reusable Bags",
        desc: "Bring your own bag and reduce single-use plastics.",
      },
    ];
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Green summary block */}
          <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center p-10 mb-12 shadow">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Calculator className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Your Carbon Footprint</h2>
            <div className="text-6xl font-extrabold mb-2">{results.totalFootprint.toFixed(2)}</div>
            <div className="text-xl opacity-90">kg CO₂ per week</div>
          </div>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-green-100 rounded-xl p-10 text-center shadow-sm">
              <div className="mb-2 flex justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm uppercase font-medium text-green-700 mb-1">Singapore Average</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {results.comparison.singaporeAverage.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">kg CO₂ / week</div>
            </div>
            <div className="bg-white border border-blue-100 rounded-xl p-10 text-center shadow-sm">
              <div className="mb-2 flex justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-sm uppercase font-medium text-blue-700 mb-1">Global Average</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {results.comparison.globalAverage.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">kg CO₂ / week</div>
            </div>
            <div className="bg-white border border-purple-100 rounded-xl p-10 text-center shadow-sm">
              <div className="mb-2 flex justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-sm uppercase font-medium text-purple-700 mb-1">Percentile</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {results.comparison.percentile.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500">Better than average</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Pie Chart: Footprint Breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Footprint Breakdown</h3>
              <div className="flex-1 min-h-[240px]">
                <ResponsiveContainer width="100%" height={350} minWidth={500}>
                  <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <Pie
                      data={breakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Bar Chart: Category Comparison */}
            <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Comparison</h3>
              <div className="flex-1 min-h-[240px]">
                <ResponsiveContainer width="100%" height={350} minWidth={500}>
                  <BarChart data={breakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8 px-6 sm:px-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="bg-gray-50 rounded-lg px-4 py-3 flex items-start border border-gray-100">
                  <Leaf className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-800">{rec.title}</div>
                    <div className="text-gray-600 text-sm">{rec.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Save button and confirmation */}
          <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
            <button
              onClick={saveResults}
              disabled={saved}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                saved
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <Save className="w-5 h-5" />
              <span>{saved ? 'Results Saved!' : 'Save Results'}</span>
            </button>
            {saved && (
              <div className="flex items-center text-green-700 text-sm font-medium mt-1">
                <CheckCircle className="w-5 h-5 mr-1" />
                Results saved to your profile!
              </div>
            )}
            <button
              onClick={() => {
                setResults(null);
                setCurrentStep(1);
                setFormData({});
                setSaved(false);
              }}
              className="flex items-center space-x-2 px-6 py-3 rounded-full font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 mt-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return renderResults();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Weekly Carbon Footprint Calculator</h1>
                <p className="text-green-100 mt-1">Calculate your environmental impact from the past week</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[currentStep - 1]?.title}
              </h2>
              <p className="text-gray-600">
                {steps[currentStep - 1]?.description}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Debug: Step {currentStep} of {steps.length}
              </p>
            </div>

            {getStepContent(currentStep)}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-200'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              {/* Debug: currentStep={currentStep}, steps.length={steps.length}, isLastStep={currentStep === steps.length} */}
              {(currentStep === steps.length) ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      <span>Calculate Footprint</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarbonTrackerNew;
