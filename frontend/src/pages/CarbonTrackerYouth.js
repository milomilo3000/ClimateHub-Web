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
  Bird,
  Share2,
  Award
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ImpactMeasures from '../components/ImpactMeasures';
import RecommendationCarousel from '../components/RecommendationCarousel';

const CarbonTrackerYouth = () => {
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
      
      // Auto-save results if user is logged in
      if (user) {
        await autoSaveResults(weeklyFootprint, data);
      }
      
      toast.success('Carbon footprint calculated successfully!');
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Failed to calculate carbon footprint');
    } finally {
      setLoading(false);
    }
  };

  const autoSaveResults = async (footprintResults, inputData) => {
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const response = await axios.post('/api/carbon/save', {
        footprint: footprintResults,
        breakdown: footprintResults.breakdown,
        inputData: inputData,
        notes: 'Auto-saved youth weekly footprint calculation'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSaved(true);
        await refreshUserProfile();
        toast.success('Results automatically saved to your profile!');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      // Don't show error toast for auto-save failures to avoid interrupting user experience
    }
  };

  const calculateWeeklyFootprint = (data) => {
    let totalFootprint = 0;
    const breakdown = {};

    // 1. Electronics (youth EFs; hours/day → ×7)
    const sm = getMedianValue(data.electronics?.socialMedia) * 7;
    const gm = getMedianValue(data.electronics?.gaming) * 7;
    const st = getMedianValue(data.electronics?.streaming) * 7;
    const lp = getMedianValue(data.electronics?.laptop) * 7;
    const chargesWeek = getPhoneChargingValue(data.electronics?.phoneCharging) * 7;

    const electronicsEmissions =
      sm * 0.01 +
      gm * 0.03 +
      st * 0.03 +
      lp * 0.02 +
      chargesWeek * 0.005;

    breakdown.electronics = electronicsEmissions;
    totalFootprint += electronicsEmissions;

    // 2. Diet & food
    const beefMid = getBeefPorkMidpoint(data.diet?.beefPork);
    const otherMid = getDietWeeklyMidpoint(data.diet?.otherMeats);
    const teaMid = getDietWeeklyMidpoint(data.diet?.bubbleTea);
    const takeMid = getDietWeeklyMidpoint(data.diet?.takeaway);
    const packMid = getDietWeeklyMidpoint(data.diet?.packagedSnacks);
    const wasteCount = getFoodWasteYouthMapped(data.diet?.foodWaste);

    const dietEmissions =
      beefMid * 2.5 +
      otherMid * 1.0 +
      teaMid * 0.5 +
      takeMid * 0.2 +
      packMid * 0.1 +
      wasteCount * 2.0;

    breakdown.diet = dietEmissions;
    totalFootprint += dietEmissions;

    // 3. Transport (public: per trip; private/moto: trips × distance km)
    const distKm = getYouthDistanceMedian(data.transport?.distance);
    const pubTrips = getTripMidpoint(data.transport?.publicTransport);
    const carTrips = getTripMidpoint(data.transport?.carTaxi);
    const motoTrips = getTripMidpoint(data.transport?.motorbike);

    const transportEmissions =
      pubTrips * 0.05 +
      carTrips * distKm * 0.2 +
      motoTrips * distKm * 0.1;

    breakdown.transport = transportEmissions;
    totalFootprint += transportEmissions;

    // 4. Home & utilities
    const homeTypeMult = getYouthHomeTypeMultiplier(data.home?.homeType);
    const bedroomMult = getBedroomMultiplier(data.home?.bedrooms);
    const cm = data.home?.coolingMethod;
    const weeklyCoolHours = getMedianValue(data.home?.coolingHours) * 7;
    const tempMult = getYouthTempMultiplier(data.home?.airconTemp);

    let coolingEmissions = 0;
    if (cm === 'only_aircon') {
      coolingEmissions = weeklyCoolHours * 0.24 * tempMult;
    } else if (cm === 'only_fan') {
      coolingEmissions = weeklyCoolHours * 0.03;
    } else if (cm === 'both') {
      const fanPart = weeklyCoolHours * 0.5 * 0.03;
      const acPart = weeklyCoolHours * 0.5 * 0.24 * tempMult;
      coolingEmissions = fanPart + acPart;
    }

    const showersPerDay = getShowerValue(data.home?.showers);
    let homeEmissions = coolingEmissions + showersPerDay * 7 * 0.24;

    homeEmissions *= homeTypeMult * bedroomMult;
    homeEmissions *= getYouthSwitchOffMultiplier(data.home?.appliancesOff);

    breakdown.home = homeEmissions;
    totalFootprint += homeEmissions;

    // 5. Shopping (plastic bags per trip mapping; online per order)
    const shopTrips = getTripMidpoint(data.shopping?.inPerson);
    const bagsPerTrip = getPlasticBagsPerTrip(data.shopping?.reusableBag);
    const onlineOrders = getTripMidpoint(data.shopping?.online);

    const shoppingEmissions = shopTrips * bagsPerTrip * 0.04 + onlineOrders * 0.3;

    breakdown.shopping = shoppingEmissions;
    totalFootprint += shoppingEmissions;

    const relativePercent = ((57.17 - totalFootprint) / 57.17) * 100;

    return {
      totalFootprint,
      breakdown,
      comparison: {
        singaporeAverage: 57.17,
        globalAverage: 24.2,
        percentile: relativePercent,
      },
    };
  };
  // Helper for percentile block color
  // Returns solid green if better than average, solid red otherwise
  const getPercentileColor = (relativePercent) => {
    if (relativePercent >= 0) {
      return '#22c55e'; // solid green
    } else {
      return '#ef4444'; // solid red
    }
  };

  const getMedianValue = (option) => {
    const medians = {
      '0': 0,
      '0-2': 1,
      '0-3': 1.5,
      '1-3': 2,
      '2-4': 3,
      '3-7': 5,
      '4-6': 5,
      '6+': 7,
      '7+': 7,
      '1-5': 3,
      '6-10': 8,
      '11-14': 12.5,
    };
    return medians[option] ?? 0;
  };

  const getTripMidpoint = (option) => {
    const m = { '0-3': 1.5, '3-7': 5, '7+': 8 };
    return m[option] ?? 0;
  };

  const getBeefPorkMidpoint = (option) => {
    const m = { '0': 0, '1-3': 2, '3-7': 5, '7+': 8 };
    return m[option] ?? 0;
  };

  const getDietWeeklyMidpoint = (option) => {
    const m = { '0': 0, '1-3': 2, '3-7': 5, '7+': 8 };
    return m[option] ?? 0;
  };

  const getFoodWasteYouthMapped = (option) => {
    const m = { never: 0, rarely: 1, often: 3, always: 5 };
    return m[option] ?? 0;
  };

  const getYouthDistanceMedian = (option) => {
    const distances = { '0-5': 3, '6-10': 8, '11-15': 13, '15+': 18 };
    return distances[option] ?? 3;
  };

  const getYouthHomeTypeMultiplier = (option) => {
    const m = { hdb: 1.0, condo: 1.2, landed: 1.5 };
    return m[option] ?? 1.0;
  };

  const getYouthTempMultiplier = (option) => {
    const m = { '<20': 1.2, '20-23': 1.1, '24-26': 1.0, '26+': 0.95 };
    return m[option] ?? 1.0;
  };

  const getYouthSwitchOffMultiplier = (option) => {
    const m = { never: 1.05, rarely: 1.02, often: 0.98, always: 0.95 };
    return m[option] ?? 1.0;
  };

  const getPlasticBagsPerTrip = (option) => {
    const m = { never: 3, rarely: 2, often: 1, always: 0 };
    return m[option] ?? 0;
  };

  const getPhoneChargingValue = (option) => {
    const values = { '1': 1, '2': 2, '3': 3, '4+': 4 };
    return values[option] || 1;
  };

  const getBedroomMultiplier = (option) => {
    const multipliers = { '1': 0.7, '2': 1.0, '3': 1.2, '4+': 1.4 };
    return multipliers[option] || 1.0;
  };

  const getShowerValue = (option) => {
    const values = { '1': 1, '2': 2, '3+': 3 };
    return values[option] || 1;
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
        notes: 'Youth weekly footprint calculation'
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

    const fieldsToValidate = stepFields[currentStep - 1];
    const valid = await trigger(fieldsToValidate);

    if (valid) {
      if (currentStep < steps.length) {
        const nextStepNumber = currentStep + 1;
        if (currentStep === 4 && nextStepNumber !== 5) {
          setCurrentStep(5);
        } else {
          setCurrentStep(nextStepNumber);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
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
              <label className="form-label">How many hours per day did you spend on your laptop or tablet in the past week?</label>
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
              <label className="form-label">How many times did you order food delivery or takeaway in the past week? (e.g., GrabFood, Foodpanda) </label>
              <select {...register('diet.takeaway', { required: true })} className="input-field">
                <option value="">Select times per week</option>
                <option value="0">0 times</option>
                <option value="1-3">1–3 times</option>
                <option value="3-7">3–7 times</option>
                <option value="7+">7+ times</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many times did you buy packaged drinks, snacks, or instant meals in the past week? (e.g. 7-Eleven, Cheers) </label>
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
              <label className="form-label">How far is your trip from home to school or work?</label>
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
    // Prepare data for charts
    const breakdownData = Object.entries(results.breakdown).map(([category, value]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: parseFloat(value.toFixed(2)),
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
    // Percentile logic for color and text
    const relativePercent = ((57.17 - results.totalFootprint) / 57.17) * 100;
    const percentileColor = getPercentileColor(relativePercent);

    return (
      <div className="min-h-screen bg-white py-6 sm:py-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full box-border">
          {/* Your Carbon Footprint block with dynamic background color */}
          <div
            className="rounded-xl text-white text-center p-6 sm:p-10 mb-8 sm:mb-12 shadow min-w-0"
            style={{ backgroundColor: percentileColor }}
          >
            <div className="mb-3 sm:mb-4 flex justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Calculator className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 break-words">Your Carbon Footprint</h2>
            <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-2">{results.totalFootprint.toFixed(2)}</div>
            <div className="text-base sm:text-xl opacity-90">kg CO₂ per week</div>
          </div>

          {/* Comparison cards - mobile: horizontal scrollable flex, desktop: grid */}
          <div className="mb-12">
            {/* Mobile: horizontal scrollable flex - scroll contained so page doesn't overflow */}
            <div className="block sm:hidden overflow-x-auto w-full max-w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="flex gap-4 min-w-[600px]">
                <div className="bg-white border border-green-100 rounded-xl p-6 min-w-[200px] flex-1 text-center shadow-sm">
                  <div className="mb-2 flex justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm uppercase font-medium text-green-700 mb-1">Singapore Average</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {results.comparison.singaporeAverage.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">kg CO₂ / week</div>
                </div>
                <div className="bg-white border border-blue-100 rounded-xl p-6 min-w-[200px] flex-1 text-center shadow-sm">
                  <div className="mb-2 flex justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm uppercase font-medium text-blue-700 mb-1">Global Average</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {results.comparison.globalAverage.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">kg CO₂ / week</div>
                </div>
                <div
                  className="rounded-xl p-10 text-center shadow-sm bg-white border border-purple-100"
                  style={{ minWidth: 200 }}
                >
                  <div className="mb-2 flex justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-sm uppercase font-medium text-purple-700 mb-1">Percentile</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {relativePercent.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {relativePercent >= 0 ? 'Better than average' : 'Worse than average'}
                  </div>
                </div>
              </div>
            </div>
            {/* Desktop: grid */}
            <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div
                className="rounded-xl p-10 text-center shadow-sm bg-white border border-purple-100"
              >
                <div className="mb-2 flex justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-sm uppercase font-medium text-purple-700 mb-1">Percentile</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {relativePercent.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500">
                  {relativePercent >= 0 ? 'Better than average' : 'Worse than average'}
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="mb-12">
            {/* Desktop: grid layout */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-12">
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
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
                        outerRadius={70}
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
            {/* Mobile: stacked, scrollable charts, smaller height */}
            <div className="md:hidden flex flex-col gap-8">
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col shadow-sm overflow-x-auto max-w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Footprint Breakdown</h3>
                <div className="flex-1 min-h-[160px]">
                  <ResponsiveContainer width="100%" height={250} minWidth={300} minHeight={200}>
                    <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <Pie
                        data={breakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // Use SVG <text> for smaller font size label
                        label={({ name, percent, ...rest }) => (
                          <text
                            fontSize="12"
                            fontWeight="bold"
                            fill="#333"
                            x={rest.x}
                            y={rest.y}
                            textAnchor={rest.textAnchor}
                            dominantBaseline={rest.dominantBaseline}
                          >
                            {`${name} ${(percent * 100).toFixed(2)}%`}
                          </text>
                        )}
                        outerRadius={50}
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
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col shadow-sm overflow-x-auto max-w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Comparison</h3>
                <div className="flex-1 min-h-[160px]">
                  <ResponsiveContainer width="100%" height={200} minWidth={300}>
                    <BarChart data={breakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        interval={0}
                        tick={{ fontSize: 10 }}
                        angle={-30}
                        textAnchor="end"
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Badge */}
          {relativePercent >= 0 && (
            <div className="mb-8 flex justify-center">
              <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 flex items-center space-x-3">
                <Award className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">🌿 Great job!</div>
                  <div className="text-sm text-green-700">
                    You're greener than {Math.abs(relativePercent).toFixed(0)}% of users
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Impact Measures */}
          <ImpactMeasures userCO2={results.totalFootprint * 52} groupFactor={40000} />

          {/* Recommendations Carousel */}
          <RecommendationCarousel recommendations={recommendations} />

          {/* Share Button */}
          <div className="mb-8 flex justify-center">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Carbon Footprint - ClimateHub',
                    text: `I calculated my weekly carbon footprint: ${results.totalFootprint.toFixed(2)} kg CO₂. Join me in tracking your environmental impact!`,
                    url: window.location.origin + '/carbon-tracker/youth'
                  });
                } else {
                  navigator.clipboard.writeText(
                    `I calculated my weekly carbon footprint: ${results.totalFootprint.toFixed(2)} kg CO₂ on ClimateHub! ${window.location.origin}/carbon-tracker/youth`
                  );
                  toast.success('Shared to clipboard!');
                }
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share My Footprint</span>
            </button>
          </div>

          {/* Auto-save confirmation and retry button */}
          <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
            {saved && user && (
              <div className="flex items-center text-green-700 text-sm font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 mr-2" />
                Results automatically saved to your profile!
              </div>
            )}
            {!user && (
              <div className="flex items-center text-blue-700 text-sm font-medium bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <Calculator className="w-5 h-5 mr-2" />
                Sign in to automatically save your results to your profile
              </div>
            )}
            <button
              onClick={() => {
                setResults(null);
                setCurrentStep(1);
                setFormData({});
                setSaved(false);
              }}
              className="flex items-center space-x-2 px-6 py-3 rounded-full font-semibold bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-6 sm:py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full box-border">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Youth Weekly Carbon Footprint Calculator</h1>
                <p className="text-green-100 mt-1">For students and young Singaporeans — your impact over the past week</p>
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

export default CarbonTrackerYouth;
