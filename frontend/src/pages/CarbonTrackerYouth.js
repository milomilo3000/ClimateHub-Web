import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Award,
  Trophy,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ImpactMeasures from '../components/ImpactMeasures';
import RecommendationCarousel from '../components/RecommendationCarousel';
import FadeIn from '../components/animations/FadeIn';

const CarbonTrackerYouth = () => {
  const { user, signInWithGoogle } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [youthLeaderboardSaved, setYouthLeaderboardSaved] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState(0);
  const [leaderboards, setLeaderboards] = useState({
    lowestFootprint: [],
    mostImprovedFromLast: [],
    mostImprovedOverall: [],
  });
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [savingYouthResult, setSavingYouthResult] = useState(false);
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

  const fetchYouthLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    try {
      const headers = {};
      const fbUser = getAuth().currentUser;
      if (fbUser) {
        const token = await fbUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await axios.get('/api/carbon/youth/leaderboard', { headers });
      if (res.data?.success && res.data.leaderboards) {
        setLeaderboards(res.data.leaderboards);
      }
    } catch (e) {
      console.error('Leaderboard fetch error:', e);
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  useEffect(() => {
    if (results) {
      fetchYouthLeaderboard();
    }
  }, [results, user?.id, fetchYouthLeaderboard]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Calculate emissions based on new logic
      const weeklyFootprint = calculateWeeklyFootprint(data);
      setResults(weeklyFootprint);
      setFormData(data);
      setYouthLeaderboardSaved(false);

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

  const CATEGORY_LABELS = {
    diet: 'Diet',
    transport: 'Transport',
    home: 'Home',
    electronics: 'Electronics',
    shopping: 'Shopping',
  };

  const formatKg = (value) => `${value.toFixed(2)} kg CO2e`;

  /**
   * Min/max achievable weekly kg CO₂e per category given only the discrete options in this questionnaire.
   * Used to classify Low/Medium/High relative to modeled answer space (not vs share of total footprint).
   */
  const computeYouthCategoryBenchmarkBands = () => {
    const hourOpts = ['0-2', '2-4', '4-6', '6+'];
    const phoneOpts = ['1', '2', '3', '4+'];

    let eMin = Infinity;
    let eMax = -Infinity;
    for (const sm of hourOpts) {
      const smWeek = getMedianValue(sm) * 7;
      for (const gm of hourOpts) {
        const gmWeek = getMedianValue(gm) * 7;
        for (const st of hourOpts) {
          const stWeek = getMedianValue(st) * 7;
          for (const lp of hourOpts) {
            const lpWeek = getMedianValue(lp) * 7;
            for (const pc of phoneOpts) {
              const chargesWeek = getPhoneChargingValue(pc) * 7;
              const v =
                smWeek * 0.01 +
                gmWeek * 0.03 +
                stWeek * 0.03 +
                lpWeek * 0.02 +
                chargesWeek * 0.005;
              eMin = Math.min(eMin, v);
              eMax = Math.max(eMax, v);
            }
          }
        }
      }
    }

    const weeklyDietOpts = ['0', '1-3', '3-7', '7+'];
    const wasteOpts = ['never', 'rarely', 'often', 'always'];
    let dMin = Infinity;
    let dMax = -Infinity;
    for (const beef of weeklyDietOpts) {
      const beefMid = getBeefPorkMidpoint(beef);
      for (const om of weeklyDietOpts) {
        const otherMid = getDietWeeklyMidpoint(om);
        for (const tea of weeklyDietOpts) {
          const teaMid = getDietWeeklyMidpoint(tea);
          for (const take of weeklyDietOpts) {
            const takeMid = getDietWeeklyMidpoint(take);
            for (const pack of weeklyDietOpts) {
              const packMid = getDietWeeklyMidpoint(pack);
              for (const waste of wasteOpts) {
                const wasteCount = getFoodWasteYouthMapped(waste);
                const v =
                  beefMid * 2.5 +
                  otherMid * 1.0 +
                  teaMid * 0.5 +
                  takeMid * 0.2 +
                  packMid * 0.1 +
                  wasteCount * 2.0;
                dMin = Math.min(dMin, v);
                dMax = Math.max(dMax, v);
              }
            }
          }
        }
      }
    }

    const tripOpts = ['0-3', '3-7', '7+'];
    const distOpts = ['0-5', '6-10', '11-15', '15+'];
    let tMin = Infinity;
    let tMax = -Infinity;
    for (const pub of tripOpts) {
      const pubTrips = getTripMidpoint(pub);
      for (const car of tripOpts) {
        const carTrips = getTripMidpoint(car);
        for (const moto of tripOpts) {
          const motoTrips = getTripMidpoint(moto);
          for (const dist of distOpts) {
            const distKm = getYouthDistanceMedian(dist);
            const v = pubTrips * 0.05 + carTrips * distKm * 0.2 + motoTrips * distKm * 0.1;
            tMin = Math.min(tMin, v);
            tMax = Math.max(tMax, v);
          }
        }
      }
    }

    const coolMethods = ['only_aircon', 'only_fan', 'both'];
    const coolingHourOpts = ['0', '1-5', '6-10', '11-14'];
    const tempOpts = ['<20', '20-23', '24-26', '26+'];
    const homeTypeOpts = ['hdb', 'condo', 'landed'];
    const bedOpts = ['1', '2', '3', '4+'];
    const showerOpts = ['1', '2', '3+'];
    const applianceOpts = ['never', 'rarely', 'often', 'always'];

    const computeHomeCategoryEmissions = ({
      coolingMethod,
      coolingHoursOpt,
      airconTempOpt,
      homeType,
      bedrooms,
      showers,
      appliancesOff,
    }) => {
      const homeTypeMult = getYouthHomeTypeMultiplier(homeType);
      const bedroomMult = getBedroomMultiplier(bedrooms);
      const weeklyCoolHours = getMedianValue(coolingHoursOpt) * 7;
      const tempMult = getYouthTempMultiplier(airconTempOpt);

      let coolingEmissions = 0;
      if (coolingMethod === 'only_aircon') {
        coolingEmissions = weeklyCoolHours * 0.24 * tempMult;
      } else if (coolingMethod === 'only_fan') {
        coolingEmissions = weeklyCoolHours * 0.03;
      } else if (coolingMethod === 'both') {
        const fanPart = weeklyCoolHours * 0.5 * 0.03;
        const acPart = weeklyCoolHours * 0.5 * 0.24 * tempMult;
        coolingEmissions = fanPart + acPart;
      }

      const showersPerDay = getShowerValue(showers);
      let homeEmissions = coolingEmissions + showersPerDay * 7 * 0.24;
      homeEmissions *= homeTypeMult * bedroomMult;
      homeEmissions *= getYouthSwitchOffMultiplier(appliancesOff);
      return homeEmissions;
    };

    let hMin = Infinity;
    let hMax = -Infinity;
    for (const cm of coolMethods) {
      for (const ho of coolingHourOpts) {
        for (const temp of tempOpts) {
          for (const ht of homeTypeOpts) {
            for (const bd of bedOpts) {
              for (const sh of showerOpts) {
                for (const ap of applianceOpts) {
                  const v = computeHomeCategoryEmissions({
                    coolingMethod: cm,
                    coolingHoursOpt: ho,
                    airconTempOpt: temp,
                    homeType: ht,
                    bedrooms: bd,
                    showers: sh,
                    appliancesOff: ap,
                  });
                  hMin = Math.min(hMin, v);
                  hMax = Math.max(hMax, v);
                }
              }
            }
          }
        }
      }
    }

    const inPersonOpts = ['0-3', '3-7', '7+'];
    const bagOpts = ['never', 'rarely', 'often', 'always'];
    let sMin = Infinity;
    let sMax = -Infinity;
    for (const ip of inPersonOpts) {
      const shopTrips = getTripMidpoint(ip);
      for (const bag of bagOpts) {
        const bagsPerTrip = getPlasticBagsPerTrip(bag);
        for (const onl of tripOpts) {
          const onlineOrders = getTripMidpoint(onl);
          const v = shopTrips * bagsPerTrip * 0.04 + onlineOrders * 0.3;
          sMin = Math.min(sMin, v);
          sMax = Math.max(sMax, v);
        }
      }
    }

    return {
      electronics: { min: eMin, max: eMax },
      diet: { min: dMin, max: dMax },
      transport: { min: tMin, max: tMax },
      home: { min: hMin, max: hMax },
      shopping: { min: sMin, max: sMax },
    };
  };

  const benchmarkBandsForYouthQuiz = useMemo(() => computeYouthCategoryBenchmarkBands(), []);

  const getImpactLevelFromCategoryRange = (value, band) => {
    const min = band.min;
    const max = band.max;
    if (!(Number.isFinite(value) && Number.isFinite(min) && Number.isFinite(max))) {
      return 'Moderate';
    }
    const span = max - min;
    if (span < 1e-9) {
      return 'Moderate';
    }
    const clamped = Math.min(max, Math.max(min, value));
    const t = (clamped - min) / span;
    if (t < 1 / 3) return 'Low';
    if (t < 2 / 3) return 'Moderate';
    return 'High';
  };

  const getCategoryInterpretation = (name, value, portfolioPercent, impactLevel, band) => {
    const pctText = portfolioPercent.toFixed(1);
    const minText = band.min.toFixed(2);
    const maxText = band.max.toFixed(2);
    let rel = '';
    if (impactLevel === 'Low') {
      rel =
        'Relative to everything this questionnaire can output for this category alone, your value sits in the lower third of that range—not a standout high-impact pocket for this quiz model.';
    } else if (impactLevel === 'Moderate') {
      rel =
        "Relative to this questionnaire's modeled range for this category, your value sits in the middle band—balanced room for improvement without overstating it.";
    } else {
      rel =
        'Relative to this questionnaire\'s modeled range for this category, your value sits in the upper third—this is a meaningful improvement opportunity on the answers you can change here.';
    }

    return `${name} is ${formatKg(value)} per week (${pctText}% of your modeled weekly total). For this calculator, answers in this category alone can land between about ${minText} and ${maxText} kg CO2e per week. ${rel}`;
  };

  const getCategoryActions = (name) => {
    if (name === 'Diet') {
      return [
        'Reduce meat-heavy meals where possible.',
        'Choose lower-carbon proteins more often.',
        'Cut back on food delivery and takeaway when possible.',
      ];
    }
    if (name === 'Transport') {
      return [
        'Replace short car or ride-hailing trips with MRT, bus, walking, or cycling.',
        'Combine errands into fewer trips each week.',
        'Use public transport for routine journeys when possible.',
      ];
    }
    if (name === 'Home') {
      return [
        'Set aircon to 25-26 C where comfortable.',
        'Use fans first before turning on aircon.',
        'Switch off unused lights and appliances consistently.',
      ];
    }
    if (name === 'Electronics') {
      return [
        'Reduce unnecessary charging and standby power.',
        'Keep devices longer before replacing.',
        'Limit non-essential upgrades where possible.',
      ];
    }
    return [
      'Buy less frequently and plan purchases.',
      'Prioritize durable products over short-lived items.',
      'Avoid impulse purchases and fast fashion habits.',
    ];
  };

  const generateSpecificReductionWays = ({ totalWeeklyKg, formData: rawFormData }) => {
    const input = rawFormData || {};
    const opportunities = [];

    const beefOption = input?.diet?.beefPork;
    const beefCurrent = getBeefPorkMidpoint(beefOption);
    if (beefCurrent > 0) {
      const beefTarget = Math.max(0, Math.floor(beefCurrent / 2));
      const beefDelta = beefCurrent - beefTarget;
      const savings = beefDelta * 2.5;
      opportunities.push({
        title: 'Reduce beef meals',
        currentText: `Based on your selected range (${beefOption}), this is about ${beefCurrent} beef/pork meals per week.`,
        proposalText: `If you reduce this to around ${beefTarget} meals per week,`,
        savings,
      });
    }

    const carOption = input?.transport?.carTaxi;
    const carCurrent = getTripMidpoint(carOption);
    const distance = getYouthDistanceMedian(input?.transport?.distance);
    if (carCurrent > 0) {
      const carTarget = Math.max(0, Math.floor(carCurrent * 0.6));
      const carDelta = carCurrent - carTarget;
      const savings = carDelta * distance * 0.2;
      opportunities.push({
        title: 'Reduce ride-hailing or car trips',
        currentText: `Based on your selected range (${carOption}), this is about ${carCurrent} trips per week at around ${distance} km per trip.`,
        proposalText: `If you reduce this to around ${carTarget} trips per week,`,
        savings,
      });
    }

    const coolingMethod = input?.home?.coolingMethod;
    const coolingHours = getMedianValue(input?.home?.coolingHours);
    if ((coolingMethod === 'only_aircon' || coolingMethod === 'both') && coolingHours > 0) {
      const tempMult = getYouthTempMultiplier(input?.home?.airconTemp);
      const homeTypeMult = getYouthHomeTypeMultiplier(input?.home?.homeType);
      const bedroomMult = getBedroomMultiplier(input?.home?.bedrooms);
      const switchMult = getYouthSwitchOffMultiplier(input?.home?.appliancesOff);
      const airconShare = coolingMethod === 'both' ? 0.5 : 1;
      const perHourSavings = 0.24 * tempMult * airconShare * 7 * homeTypeMult * bedroomMult * switchMult;
      const targetHours = Math.max(0, coolingHours - 2);
      const savings = (coolingHours - targetHours) * perHourSavings;
      opportunities.push({
        title: 'Reduce aircon hours',
        currentText: `You selected about ${coolingHours} cooling hours per day with ${coolingMethod === 'both' ? 'mixed fan + aircon usage' : 'aircon usage'}.`,
        proposalText: `If you reduce this to about ${targetHours} hours per day,`,
        savings,
      });
    }

    const onlineOption = input?.shopping?.online;
    const onlineCurrent = getTripMidpoint(onlineOption);
    if (onlineCurrent > 0) {
      const onlineTarget = Math.max(0, onlineCurrent - 2);
      const delta = onlineCurrent - onlineTarget;
      const savings = delta * 0.3;
      opportunities.push({
        title: 'Reduce online shopping orders',
        currentText: `Based on your selected range (${onlineOption}), this is about ${onlineCurrent} online orders per week.`,
        proposalText: `If you reduce this to around ${onlineTarget} orders per week,`,
        savings,
      });
    }

    // --- Begin additional specific reduction opportunities ---

    const otherMeatsOption = input?.diet?.otherMeats;
    const otherMeatsCurrent = getDietWeeklyMidpoint(otherMeatsOption);
    if (otherMeatsCurrent > 0) {
      const otherMeatsTarget = Math.max(0, Math.floor(otherMeatsCurrent / 2));
      const delta = otherMeatsCurrent - otherMeatsTarget;
      const savings = delta * 1.0;
      opportunities.push({
        title: 'Reduce other meat meals',
        currentText: `Based on your selected range (${otherMeatsOption}), this is about ${otherMeatsCurrent} chicken, fish, duck, or other meat meals per week.`,
        proposalText: `If you reduce this to around ${otherMeatsTarget} meals per week,`,
        savings,
      });
    }

    const takeawayOption = input?.diet?.takeaway;
    const takeawayCurrent = getDietWeeklyMidpoint(takeawayOption);
    if (takeawayCurrent > 0) {
      const takeawayTarget = Math.max(0, Math.floor(takeawayCurrent * 0.6));
      const delta = takeawayCurrent - takeawayTarget;
      const savings = delta * 0.2;
      opportunities.push({
        title: 'Reduce takeaway or food delivery',
        currentText: `Based on your selected range (${takeawayOption}), this is about ${takeawayCurrent} takeaway or delivery meals per week.`,
        proposalText: `If you reduce this to around ${takeawayTarget} meals per week,`,
        savings,
      });
    }

    const publicTransportOption = input?.transport?.publicTransport;
    const publicTransportCurrent = getTripMidpoint(publicTransportOption);
    if (publicTransportCurrent > 0) {
      const publicTransportTarget = Math.max(0, Math.floor(publicTransportCurrent * 0.7));
      const delta = publicTransportCurrent - publicTransportTarget;
      const savings = delta * 0.05;
      opportunities.push({
        title: 'Reduce unnecessary transport trips',
        currentText: `Based on your selected range (${publicTransportOption}), this is about ${publicTransportCurrent} public transport trips per week.`,
        proposalText: `If you reduce this to around ${publicTransportTarget} trips per week by combining journeys or avoiding unnecessary trips,`,
        savings,
      });
    }

    const packagedSnacksOption = input?.diet?.packagedSnacks;
    const packagedSnacksCurrent = getDietWeeklyMidpoint(packagedSnacksOption);
    if (packagedSnacksCurrent > 0) {
      const packagedSnacksTarget = Math.max(0, Math.floor(packagedSnacksCurrent / 2));
      const delta = packagedSnacksCurrent - packagedSnacksTarget;
      const savings = delta * 0.1;
      opportunities.push({
        title: 'Cut down packaged snacks and drinks',
        currentText: `Based on your selected range (${packagedSnacksOption}), this is about ${packagedSnacksCurrent} packaged snacks, drinks, or instant meals per week.`,
        proposalText: `If you reduce this to around ${packagedSnacksTarget} times per week,`,
        savings,
      });
    }

    const bubbleTeaOption = input?.diet?.bubbleTea;
    const bubbleTeaCurrent = getDietWeeklyMidpoint(bubbleTeaOption);
    if (bubbleTeaCurrent > 0) {
      const bubbleTeaTarget = Math.max(0, Math.floor(bubbleTeaCurrent / 2));
      const delta = bubbleTeaCurrent - bubbleTeaTarget;
      const savings = delta * 0.5;
      opportunities.push({
        title: 'Reduce bubble tea consumption',
        currentText: `Based on your selected range (${bubbleTeaOption}), this is about ${bubbleTeaCurrent} cups of bubble tea per week.`,
        proposalText: `If you reduce this to around ${bubbleTeaTarget} cups per week,`,
        savings,
      });
    }

    const foodWasteOption = input?.diet?.foodWaste;
    const foodWasteCurrent = getFoodWasteYouthMapped(foodWasteOption);
    if (foodWasteCurrent > 0) {
      const foodWasteTarget = Math.max(0, foodWasteCurrent - 1);
      const delta = foodWasteCurrent - foodWasteTarget;
      const savings = delta * 2.0;
      opportunities.push({
        title: 'Reduce food waste',
        currentText: `Based on your selected response (${foodWasteOption}), your food waste contribution is estimated at about ${foodWasteCurrent} units per week in the calculator.`,
        proposalText: `If you improve this by one level,`,
        savings,
      });
    }

    const motorbikeOption = input?.transport?.motorbike;
    const motorbikeCurrent = getTripMidpoint(motorbikeOption);
    if (motorbikeCurrent > 0) {
      const motorbikeTarget = Math.max(0, Math.floor(motorbikeCurrent * 0.6));
      const delta = motorbikeCurrent - motorbikeTarget;
      const savings = delta * distance * 0.1;
      opportunities.push({
        title: 'Reduce motorbike or e-scooter trips',
        currentText: `Based on your selected range (${motorbikeOption}), this is about ${motorbikeCurrent} motorbike or e-scooter trips per week at around ${distance} km per trip.`,
        proposalText: `If you reduce this to around ${motorbikeTarget} trips per week,`,
        savings,
      });
    }

    const showersOption = input?.home?.showers;
    const showersCurrent = getShowerValue(showersOption);
    if (showersCurrent > 1) {
      const showersTarget = Math.max(1, showersCurrent - 1);
      const delta = showersCurrent - showersTarget;
      const homeTypeMult = getYouthHomeTypeMultiplier(input?.home?.homeType);
      const bedroomMult = getBedroomMultiplier(input?.home?.bedrooms);
      const switchMult = getYouthSwitchOffMultiplier(input?.home?.appliancesOff);
      const savings = delta * 7 * 0.24 * homeTypeMult * bedroomMult * switchMult;
      opportunities.push({
        title: 'Reduce extra showers',
        currentText: `Based on your selected range (${showersOption}), this is about ${showersCurrent} showers per day.`,
        proposalText: `If you reduce this to about ${showersTarget} showers per day,`,
        savings,
      });
    }

    const shoppingTripsOption = input?.shopping?.inPerson;
    const shoppingTripsCurrent = getTripMidpoint(shoppingTripsOption);
    const bagsPerTrip = getPlasticBagsPerTrip(input?.shopping?.reusableBag);
    if (shoppingTripsCurrent > 0 && bagsPerTrip > 0) {
      const improvedBagsPerTrip = Math.max(0, bagsPerTrip - 1);
      const savings = shoppingTripsCurrent * (bagsPerTrip - improvedBagsPerTrip) * 0.04;
      opportunities.push({
        title: 'Use fewer plastic bags while shopping',
        currentText: `Based on your shopping answers, the calculator estimates around ${bagsPerTrip} plastic bags per in-person shopping trip.`,
        proposalText: `If you reduce this by one bag per trip,`,
        savings,
      });
    }
    // --- End additional specific reduction opportunities ---

    return opportunities
      .filter((item) => item.savings > 0)
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 5)
      .map((item, index) => {
        const reductionPercent = totalWeeklyKg > 0 ? (item.savings / totalWeeklyKg) * 100 : 0;
        return {
          id: index + 1,
          title: item.title,
          narrative: `${item.currentText} ${item.proposalText} you could save around ${item.savings.toFixed(2)} kg CO2e per week. That would reduce your total footprint by about ${reductionPercent.toFixed(1)}%.`,
        };
      });
  };

  const generateCarbonInsights = ({
    totalWeeklyKg,
    singaporeAverage,
    globalAverage,
    percentile,
    breakdown,
    formData: rawFormData,
  }) => {
    const sortedCategories = Object.entries(breakdown || {})
      .map(([key, value]) => ({
        key,
        name: CATEGORY_LABELS[key] || key,
        value: Number(value || 0),
      }))
      .sort((a, b) => b.value - a.value);

    const categoryDiagnosis = sortedCategories.map((item) => {
      const percentage = totalWeeklyKg > 0 ? (item.value / totalWeeklyKg) * 100 : 0;
      const band = benchmarkBandsForYouthQuiz[item.key] ?? { min: 0, max: 0 };
      const impactLevel = getImpactLevelFromCategoryRange(item.value, band);
      return {
        categoryKey: item.key,
        category: item.name,
        emissionValue: item.value,
        percentage,
        benchmarkMin: band.min,
        benchmarkMax: band.max,
        impactLevel,
        interpretation: getCategoryInterpretation(item.name, item.value, percentage, impactLevel, band),
      };
    });

    const topCategories = sortedCategories.slice(0, 3);
    const topTwo = sortedCategories.slice(0, 2);
    const topTwoTotal = topTwo.reduce((sum, item) => sum + item.value, 0);
    const topTwoShare = totalWeeklyKg > 0 ? (topTwoTotal / totalWeeklyKg) * 100 : 0;

    const comparatorText =
      totalWeeklyKg <= singaporeAverage
        ? `lower than the Singapore average of ${singaporeAverage.toFixed(2)} kg CO2e/week`
        : `higher than the Singapore average of ${singaporeAverage.toFixed(2)} kg CO2e/week`;
    const globalText =
      totalWeeklyKg <= globalAverage
        ? `lower than the global average of ${globalAverage.toFixed(2)} kg CO2e/week`
        : `higher than the global average of ${globalAverage.toFixed(2)} kg CO2e/week`;
    const percentileText =
      percentile >= 0
        ? `You are currently about ${percentile.toFixed(1)}% better than the Singapore baseline.`
        : `Your current footprint is about ${Math.abs(percentile).toFixed(1)}% above the Singapore baseline, which means there is clear room to improve with targeted changes.`;

    return {
      overallSummary: `Your estimated weekly carbon footprint is ${totalWeeklyKg.toFixed(2)} kg CO2e. This is ${comparatorText} and ${globalText}. ${percentileText}`,
      carbonPortfolio: sortedCategories.map((item) => ({
        category: item.name,
        emissionValue: item.value,
        percentage: totalWeeklyKg > 0 ? (item.value / totalWeeklyKg) * 100 : 0,
      })),
      categoryDiagnosis,
      priorityAreas: topCategories.map((item) => item.name),
      actionPlan: topCategories.map((item) => ({
        category: item.name,
        recommendations: getCategoryActions(item.name),
      })),
      potentialImpact: `Your top two categories (${topTwo.map((item) => item.name).join(' and ')}) currently represent about ${topTwoShare.toFixed(1)}% of your weekly footprint.`,
      specificWays: generateSpecificReductionWays({ totalWeeklyKg, formData: rawFormData }),
      finalTakeaway:
        'Your footprint is concentrated in a few key areas, which is good news. Focused changes in your highest-impact habits can create meaningful progress without needing to change everything at once.',
    };
  };

  const saveYouthResultToLeaderboard = async () => {
    if (!user) {
      toast.error('Please sign in to save your result');
      return;
    }
    if (!results) return;

    setSavingYouthResult(true);
    try {
      const cu = getAuth().currentUser;
      if (!cu) {
        toast.error('Please sign in again to save');
        return;
      }
      const token = await cu.getIdToken();
      const b = results.breakdown || {};
      const response = await axios.post(
        '/api/carbon/youth/result',
        {
          totalWeeklyKg: results.totalFootprint,
          breakdown: {
            diet: b.diet ?? 0,
            transport: b.transport ?? 0,
            home: b.home ?? 0,
            electronics: b.electronics ?? 0,
            shopping: b.shopping ?? 0,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setYouthLeaderboardSaved(true);
        toast.success('Saved to the leaderboard!');
        await fetchYouthLeaderboard();
      }
    } catch (error) {
      console.error('Youth save error:', error);
      toast.error('Failed to save your result');
    } finally {
      setSavingYouthResult(false);
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
    const insights = generateCarbonInsights({
      totalWeeklyKg: results.totalFootprint,
      singaporeAverage: results.comparison.singaporeAverage,
      globalAverage: results.comparison.globalAverage,
      percentile: results.comparison.percentile,
      breakdown: results.breakdown,
      formData,
    });

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

          {/* Youth Carbon Leaderboard */}
          {(() => {
            const tabKeys = ['lowestFootprint', 'mostImprovedFromLast', 'mostImprovedOverall'];
            const tabLabels = [
              'Lowest Footprint',
              'Most Improved From Last Result',
              'Most Improved Overall',
            ];
            const improvementHeaders = ['Overall Δ %', 'Since last %', 'Overall %'];
            const currentRows = leaderboards[tabKeys[leaderboardTab]] || [];
            return (
              <div className="mb-12">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Trophy className="w-6 h-6 text-green-700" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-gray-900">Youth Carbon Leaderboard</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Community rankings from saved Youth calculator runs. Switch views with the tabs or dots below.
                        </p>
                      </div>
                    </div>
                  </div>

                  {!user && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-sm text-blue-900">
                        Log in to save your footprint, track your progress, and join the leaderboard.
                      </p>
                      <button
                        type="button"
                        onClick={() => signInWithGoogle()}
                        className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Sign in with Google
                      </button>
                    </div>
                  )}

                  {user && (
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-600">
                          Save this run to appear on the leaderboard and refresh rankings.
                        </span>
                        {youthLeaderboardSaved && (
                          <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Saved — your latest footprint is on the board.
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={savingYouthResult}
                        onClick={saveYouthResultToLeaderboard}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                      >
                        {savingYouthResult ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving…
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save My Result
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tabLabels.map((label, idx) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setLeaderboardTab(idx)}
                        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                          leaderboardTab === idx
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50/50">
                    {leaderboardLoading ? (
                      <div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                        <span className="text-sm">Loading leaderboard…</span>
                      </div>
                    ) : currentRows.length === 0 ? (
                      <div className="py-12 px-4 text-center text-gray-500 text-sm">
                        No saved youth results yet. Save your footprint to help fill the board.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                          <thead>
                            <tr className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
                              <th className="px-4 py-3 font-semibold">Rank</th>
                              <th className="px-4 py-3 font-semibold">Participant</th>
                              <th className="px-4 py-3 font-semibold whitespace-nowrap">Latest (kg CO₂ / week)</th>
                              <th className="px-4 py-3 font-semibold whitespace-nowrap">{improvementHeaders[leaderboardTab]}</th>
                              <th className="px-4 py-3 font-semibold">Saves</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {currentRows.map((row) => (
                              <tr
                                key={`${leaderboardTab}-${row.rank}-${row.displayName}`}
                                className={row.isYou ? 'bg-green-50/80' : ''}
                              >
                                <td className="px-4 py-3 font-medium text-gray-900">{row.rank}</td>
                                <td className="px-4 py-3 text-gray-800">
                                  {row.displayName}
                                  {row.isYou && (
                                    <span className="ml-2 text-xs font-semibold text-green-700">(You)</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{row.latestWeeklyKg.toFixed(2)}</td>
                                <td className="px-4 py-3 text-gray-800 whitespace-nowrap">
                                  {row.improvementPercent === null || row.improvementPercent === undefined
                                    ? '—'
                                    : `${row.improvementPercent.toFixed(2)}%`}
                                </td>
                                <td className="px-4 py-3 text-gray-800">{row.submissionCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-2 mt-5" role="tablist" aria-label="Leaderboard view">
                    {[0, 1, 2].map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        role="tab"
                        aria-selected={leaderboardTab === idx}
                        onClick={() => setLeaderboardTab(idx)}
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                          leaderboardTab === idx ? 'bg-green-600 scale-110' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Show ${tabLabels[idx]}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* AI Carbon Insights */}
          <FadeIn direction="up" delay={0.1} duration={0.5} className="mb-12">
            <div className="bg-white rounded-xl border border-green-100 shadow-sm p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">AI Carbon Insights</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  Understand your footprint, identify your biggest impact areas, and get practical steps to improve.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                <FadeIn direction="up" delay={1.1} duration={0.5}>
                  <div className="rounded-xl border border-gray-100 bg-white p-5 h-full">
                    <h4 className="text-base font-semibold text-green-700 mb-2">Overall Footprint Summary</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{insights.overallSummary}</p>
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={2.1} duration={0.5}>
                  <div className="rounded-xl border border-gray-100 bg-white p-5 h-full">
                    <h4 className="text-base font-semibold text-green-700 mb-2">Carbon Portfolio Breakdown</h4>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      Your footprint is mainly concentrated in {insights.priorityAreas.slice(0, 2).join(' and ')}. Together, these categories account for most of your weekly emissions.
                    </p>
                    <div className="space-y-2">
                      {insights.carbonPortfolio.map((item) => (
                        <div key={item.category} className="flex items-center justify-between gap-4 text-sm">
                          <span className="text-gray-700 font-medium">{item.category}</span>
                          <span className="text-gray-600 text-right">{item.emissionValue.toFixed(2)} kg CO2e ({item.percentage.toFixed(1)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                <div className="lg:col-span-2">
                  <FadeIn direction="up" delay={3.1} duration={0.5}>
                    <div className="rounded-xl border border-gray-100 bg-white p-5">
                      <h4 className="text-base font-semibold text-green-700 mb-3">Category Diagnosis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {insights.categoryDiagnosis.map((item) => {
                        const impactCardClass =
                          item.impactLevel === 'High'
                            ? 'border-red-200 bg-red-50'
                            : item.impactLevel === 'Moderate'
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-green-200 bg-green-50';
                        const impactPillClass =
                          item.impactLevel === 'High'
                            ? 'bg-red-100 text-red-700'
                            : item.impactLevel === 'Moderate'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700';

                        return (
                          <div key={item.category} className={`rounded-lg border p-4 ${impactCardClass}`}>
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <span className="font-semibold text-gray-900">{item.category}</span>
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${impactPillClass}`}>
                                {item.impactLevel} impact
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.emissionValue.toFixed(2)} kg CO2e/week ({item.percentage.toFixed(2)}%)
                            </p>
                            <p className="text-sm text-gray-700">{item.interpretation}</p>
                          </div>
                        );
                        })}
                      </div>
                    </div>
                  </FadeIn>
                </div>

                <div className="lg:col-span-2">
                  <FadeIn direction="up" delay={4.1} duration={0.5}>
                    <div className="rounded-xl border border-gray-100 bg-white p-5">
                      <h4 className="text-base font-semibold text-green-700 mb-2">Specific Ways You Could Reduce Your Footprint</h4>
                      <p className="text-sm text-gray-700 mb-3">{insights.potentialImpact}</p>
                      {insights.specificWays.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {insights.specificWays.map((way) => (
                            <div key={way.id} className="rounded-lg border border-green-100 bg-green-50/40 p-4">
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                {way.id}. {way.title}
                              </p>
                              <p className="text-sm text-gray-700 leading-relaxed">{way.narrative}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700">
                          Your current answers already indicate low activity in several high-impact behaviors. Small improvements in your top categories can still create measurable gains over time.
                        </p>
                      )}
                    </div>
                  </FadeIn>
                </div>

                <div className="lg:col-span-2">
                  <FadeIn direction="up" delay={5.1} duration={0.5}>
                    <div className="rounded-xl border border-gray-100 bg-white p-5">
                      <h4 className="text-base font-semibold text-green-700 mb-2">Final Takeaway</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{insights.finalTakeaway}</p>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </FadeIn>

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

          <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
            <button
              onClick={() => {
                setResults(null);
                setCurrentStep(1);
                setFormData({});
                setYouthLeaderboardSaved(false);
                setLeaderboardTab(0);
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
