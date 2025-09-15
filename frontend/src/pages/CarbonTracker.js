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

const CarbonTracker = () => {
  const { user, refreshUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  // Watch all slider values for display
  const watchedValues = watch();

  // Updated steps configuration - reduced from 9 to 6 steps
  const steps = [
    { id: 1, title: 'Diet & Food Habits', description: 'Your daily food consumption and eating patterns' },
    { id: 2, title: 'Transport', description: 'How you get around Singapore daily' },
    { id: 3, title: 'Home & Utilities', description: 'Your home energy and water usage' },
    { id: 4, title: 'Spending & Lifestyle', description: 'Your entertainment and dining habits' },
    { id: 5, title: 'Electronics Usage', description: 'Your digital device usage patterns' },
    { id: 6, title: 'Waste Generation', description: 'Your waste management habits' }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/carbon/calculate', data);
      if (response.data.success) {
        setResults(response.data.footprint);
        setFormData(data);
        setSaved(false);
        toast.success('Carbon footprint calculated successfully!');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Failed to calculate carbon footprint');
    } finally {
      setLoading(false);
    }
  };

  const saveResults = async () => {
    if (!user) {
      toast.error('Please sign in to save your results');
      return;
    }

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      
      if (!token) {
        toast.error('Authentication token not available. Please sign in again.');
        return;
      }

      const response = await axios.post('/api/carbon/save', {
        footprint: results,
        breakdown: results.breakdown,
        inputData: formData,
        notes: 'Carbon footprint calculation'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSaved(true);
        toast.success('Results saved successfully!');
        
        // Refresh user profile to update totalCarbonFootprint
        await refreshUserProfile();
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save results');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 1: // Diet & Food Habits - Modified questions
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">On a typical day, how many of your meals contain meat (chicken, beef, pork, seafood)?</label>
              <select {...register('diet.mealsWithMeat', { required: true })} className="input-field">
                <option value="">Select meals per day</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">How often do you eat at hawker centres or food courts in a week?</label>
              <input
                type="range"
                min="0" max="14"
                {...register('diet.hawkerVisits', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.diet?.hawkerVisits || 0} times/week
                </span>
                <span>14</span>
              </div>
            </div>

            <div>
              <label className="form-label">
                How often do you choose plant-based or meatless meals?
              </label>
              <select {...register('diet.plantBasedFrequency', { required: true })} className="input-field">
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="once_week">Once a week</option>
                <option value="2_3_times">2–3 times a week</option>
                <option value="almost_daily">Almost daily</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                How many cups of bubble tea or sweetened beverages do you drink per week?
              </label>
              <input
                type="range"
                min="0" max="14"
                {...register('diet.bubbleTeaCups', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.diet?.bubbleTeaCups || 0} cups/week
                </span>
                <span>14</span>
              </div>
            </div>

            <div>
              <label className="form-label">
                How often do you order-in food delivery?
              </label>
              <input
                type="range"
                min="0" max="14"
                {...register('diet.foodDelivery', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.diet?.foodDelivery || 0} times/week
                </span>
                <span>14</span>
              </div>
            </div>

            <div>
              <label className="form-label">How often do you buy packaged drinks/snacks in camp?</label>
              <select {...register('diet.packagedSnacks', { required: true })} className="input-field">
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="few_times_week">Few times a week</option>
                <option value="weekly">Weekly</option>
                <option value="rarely">Rarely</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div>
              <label className="form-label">When you eat, do you usually finish all your food or drinks without leaving waste behind?</label>
              <select {...register('diet.foodWaste', { required: true })} className="input-field">
                <option value="">Select option</option>
                <option value="always_finish">Always finish</option>
                <option value="usually_finish">Usually finish</option>
                <option value="sometimes_finish">Sometimes finish</option>
                <option value="rarely_finish">Rarely finish</option>
              </select>
            </div>
          </div>
        );

      case 2: // Transport - Modified questions
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How many days a week do you use public transport (MRT, LRT, buses)?</label>
              <input
                type="range"
                min="0" max="7"
                {...register('transport.publicTransportDays', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.transport?.publicTransportDays || 0} days/week
                </span>
                <span>7</span>
              </div>
            </div>

            <div>
              <label className="form-label">How many days a week do you walk or cycle as your main form of transport?</label>
              <input
                type="range"
                min="0" max="7"
                {...register('transport.walkCycleDays', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.transport?.walkCycleDays || 0} days/week
                </span>
                <span>7</span>
              </div>
            </div>

            <div>
              <label className="form-label">How often do you use a private vehicle as your main form of transport to camp?</label>
              <select {...register('transport.grabTaxiFrequency', { required: true })} className="input-field">
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="1_2_times">1–2 times</option>
                <option value="3_5_times">3–5 times</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div>
              <label className="form-label">If you use a car, is it petrol, hybrid, or electric?</label>
              <select {...register('transport.carType', { required: true })} className="input-field">
                <option value="">Select car type</option>
                <option value="petrol">Petrol</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
                <option value="not_applicable">Not applicable</option>
              </select>
            </div>

            <div>
              <label className="form-label">How long is your average trip by any of these forms of transport? (minutes)</label>
              <input
                type="number"
                {...register('transport.averageTripLength', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 30"
              />
            </div>

            <div>
              <label className="form-label">How many hours per week do you ride a personal e-scooter or motorbike?</label>
              <input
                type="range"
                min="0" max="20"
                {...register('transport.escooterHours', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.transport?.escooterHours || 0} hours/week
                </span>
                <span>20</span>
              </div>
            </div>

            <div>
              <label className="form-label">On average, how many times a week do you share a ride or carpool with others (friends/family)?</label>
              <input
                type="range"
                min="0" max="14"
                {...register('transport.carpoolFrequency', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.transport?.carpoolFrequency || 0} times/week
                </span>
                <span>14</span>
              </div>
            </div>
          </div>
        );

      case 3: // Home & Utilities - Modified (removed water saving and recycling questions)
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">What type of home do you live in?</label>
              <select {...register('home.homeType', { required: true })} className="input-field">
                <option value="">Select home type</option>
                <option value="hdb_1_3">HDB 1–3 room</option>
                <option value="hdb_4_5">HDB 4–5 room</option>
                <option value="condo">Condo</option>
                <option value="landed">Landed</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many hours per day do you use aircon in your room?</label>
              <input
                type="range"
                min="0" max="12"
                {...register('home.airconHours', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.home?.airconHours || 0} hours/day
                </span>
                <span>12</span>
              </div>
            </div>

            <div>
              <label className="form-label">When cooling your room, which applies most often?</label>
              <select {...register('home.coolingMethod', { required: true })} className="input-field">
                <option value="">Select cooling method</option>
                <option value="only_fan">Only fan</option>
                <option value="only_aircon">Only aircon</option>
                <option value="both">Both fan and aircon together</option>
                <option value="neither">Neither</option>
              </select>
            </div>

            <div>
              <label className="form-label">How many showers do you take per day on average?</label>
              <select {...register('home.showersPerDay', { required: true })} className="input-field">
                <option value="">Select number</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3_plus">3+</option>
              </select>
            </div>

            <div>
              <label className="form-label">Do you turn off lights, fans, and electronics when not in use?</label>
              <select {...register('home.energySaving', { required: true })} className="input-field">
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        );

      case 4: // Spending & Lifestyle - Modified (removed cinema, theme parks, leisure activities)
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How often do you go cafe-hopping or to restaurants?</label>
              <select {...register('lifestyle.diningFrequency', { required: true })} className="input-field">
                <option value="">Select frequency</option>
                <option value="rarely">Rarely</option>
                <option value="once_week">Once a week</option>
                <option value="2_4_times_week">2–4 times a week</option>
                <option value="almost_daily">Almost daily</option>
              </select>
            </div>

            <div>
              <label className="form-label">How often do you go out for nightlife activities such as concerts, nightclubs, live music bars, or late-night events?</label>
              <select {...register('lifestyle.nightlifeFrequency', { required: true })} className="input-field">
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="few_months">Once every few months</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        );

      case 5: // Electronics Usage - Modified (removed phone upgrade, repair/reuse, multiple devices; added OSN & INET)
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How many hours a day do you spend on social media?</label>
              <input
                type="range"
                min="0" max="12"
                {...register('electronics.socialMediaHours', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.electronics?.socialMediaHours || 0} hours/day
                </span>
                <span>12</span>
              </div>
            </div>

            <div>
              <label className="form-label">How many hours a day do you spend gaming (console, PC, mobile)?</label>
              <input
                type="range"
                min="0" max="12"
                {...register('electronics.gamingHours', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.electronics?.gamingHours || 0} hours/day
                </span>
                <span>12</span>
              </div>
            </div>

            <div>
              <label className="form-label">How many hours a day do you spend streaming videos or music?</label>
              <input
                type="range"
                min="0" max="12"
                {...register('electronics.streamingHours', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.electronics?.streamingHours || 0} hours/day
                </span>
                <span>12</span>
              </div>
            </div>

            <div>
              <label className="form-label">How many hours a day/week do you spend on your OSN & INET?</label>
              <input
                type="range"
                min="0" max="12"
                {...register('electronics.osnInetHours', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.electronics?.osnInetHours || 0} hours/day
                </span>
                <span>12</span>
              </div>
            </div>
          </div>
        );

      case 6: // Waste Generation - Modified (removed first 3 and last 2 questions)
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">When shopping (groceries, clothes, or other items), how often do you bring a reusable bag instead of taking a plastic bag?</label>
              <select {...register('waste.reusableBags', { required: true })} className="input-field">
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="sometimes">Sometimes</option>
                <option value="often">Often</option>
                <option value="always">Always</option>
              </select>
            </div>

            <div>
              <label className="form-label">How often do you shop online (Shopee, Lazada, Qoo10) in a month?</label>
              <input
                type="range"
                min="0" max="20"
                {...register('waste.onlineShopping', { required: true })}
                className="w-full"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded font-medium">
                  Current: {watchedValues?.waste?.onlineShopping || 0} times/month
                </span>
                <span>20</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!results) return null;

    const chartData = Object.entries(results.breakdown).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Math.round(value * 100) / 100
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    return (
      <div className="space-y-8">
        <div className="text-center bg-gradient-to-r from-primary-50 to-green-50 rounded-xl p-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Calculator className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your Carbon Footprint
          </h2>
          <div className="text-6xl font-bold text-primary-600 mb-2">
            {results.totalFootprint.toFixed(2)}
          </div>
          <div className="text-xl text-gray-600">tonnes CO₂ per year</div>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {results.comparison?.singaporeAverage?.toFixed(2) || '8.56'}
            </div>
            <div className="text-sm text-gray-600">Singapore Average</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="flex justify-center mb-3">
              <Globe className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {results.comparison?.globalAverage?.toFixed(2) || '4.80'}
            </div>
            <div className="text-sm text-gray-600">Global Average</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {results.comparison?.percentile || '50'}th
            </div>
            <div className="text-sm text-gray-600">Percentile</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Footprint Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            {results.recommendations?.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{rec}</p>
              </div>
            )) || (
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Consider reducing your carbon footprint by making small changes to your daily habits.</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {user && !saved && (
          <div className="text-center">
            <button
              onClick={saveResults}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Save className="w-5 h-5" />
              <span>Save Results</span>
            </button>
          </div>
        )}

        {saved && (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Results saved successfully!</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setResults(null);
    setFormData({});
    setSaved(false);
  };

  // Animated background components
  const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Moving leaves - horizontal movement */}
      <div className="absolute top-20 animate-move-right">
        <Leaf className="w-8 h-8 text-green-500 opacity-70" />
      </div>
      <div className="absolute top-40 animate-move-left" style={{ animationDelay: '2s' }}>
        <Leaf className="w-6 h-6 text-green-600 opacity-60" />
      </div>
      <div className="absolute top-60 animate-move-right" style={{ animationDelay: '4s' }}>
        <Leaf className="w-7 h-7 text-green-400 opacity-50" />
      </div>
      <div className="absolute top-80 animate-move-left" style={{ animationDelay: '6s' }}>
        <Leaf className="w-5 h-5 text-green-700 opacity-40" />
      </div>
      <div className="absolute top-32 animate-move-right" style={{ animationDelay: '8s' }}>
        <Leaf className="w-4 h-4 text-green-300 opacity-35" />
      </div>
      
      {/* Flying birds - diagonal movement */}
      <div className="absolute top-24 animate-diagonal">
        <Bird className="w-10 h-10 text-blue-400 opacity-50" />
      </div>
      <div className="absolute top-16 animate-diagonal" style={{ animationDelay: '3s' }}>
        <Bird className="w-8 h-8 text-blue-500 opacity-40" />
      </div>
      <div className="absolute top-48 animate-diagonal" style={{ animationDelay: '6s' }}>
        <Bird className="w-9 h-9 text-blue-300 opacity-35" />
      </div>
      <div className="absolute top-72 animate-diagonal" style={{ animationDelay: '9s' }}>
        <Bird className="w-7 h-7 text-blue-600 opacity-30" />
      </div>
      
      {/* Wind elements - vertical movement */}
      <div className="absolute left-16 animate-move-up">
        <Wind className="w-6 h-6 text-cyan-400 opacity-50" />
      </div>
      <div className="absolute right-24 animate-move-down" style={{ animationDelay: '2s' }}>
        <Wind className="w-5 h-5 text-cyan-500 opacity-40" />
      </div>
      <div className="absolute left-1/2 animate-move-up" style={{ animationDelay: '5s' }}>
        <Wind className="w-7 h-7 text-cyan-300 opacity-35" />
      </div>
      <div className="absolute right-1/3 animate-move-down" style={{ animationDelay: '7s' }}>
        <Wind className="w-4 h-4 text-cyan-600 opacity-30" />
      </div>
      
      {/* Additional floating elements */}
      <div className="absolute top-28 left-1/4 animate-move-right" style={{ animationDelay: '1s' }}>
        <Leaf className="w-5 h-5 text-green-200 opacity-40" />
      </div>
      <div className="absolute top-64 right-1/4 animate-move-left" style={{ animationDelay: '4s' }}>
        <Bird className="w-6 h-6 text-blue-200 opacity-25" />
      </div>
      <div className="absolute top-44 left-1/3 animate-move-right" style={{ animationDelay: '7s' }}>
        <Leaf className="w-3 h-3 text-green-800 opacity-30" />
      </div>
      
      {/* Small wind-blown leaves for continuous movement */}
      <div className="absolute top-12 animate-move-right" style={{ animationDelay: '0.5s' }}>
        <Leaf className="w-2 h-2 text-green-300 opacity-60" />
      </div>
      <div className="absolute top-36 animate-move-left" style={{ animationDelay: '1.5s' }}>
        <Leaf className="w-2 h-2 text-green-400 opacity-50" />
      </div>
      <div className="absolute top-52 animate-move-right" style={{ animationDelay: '2.5s' }}>
        <Leaf className="w-2 h-2 text-green-500 opacity-40" />
      </div>
      <div className="absolute top-68 animate-move-left" style={{ animationDelay: '3.5s' }}>
        <Leaf className="w-2 h-2 text-green-600 opacity-35" />
      </div>
      <div className="absolute top-84 animate-move-right" style={{ animationDelay: '4.5s' }}>
        <Leaf className="w-2 h-2 text-green-700 opacity-30" />
      </div>
      
      {/* More birds for continuous movement */}
      <div className="absolute top-8 animate-diagonal" style={{ animationDelay: '1s' }}>
        <Bird className="w-4 h-4 text-blue-300 opacity-40" />
      </div>
      <div className="absolute top-56 animate-diagonal" style={{ animationDelay: '4s' }}>
        <Bird className="w-5 h-5 text-blue-400 opacity-35" />
      </div>
      <div className="absolute top-88 animate-diagonal" style={{ animationDelay: '7s' }}>
        <Bird className="w-3 h-3 text-blue-500 opacity-30" />
      </div>
    </div>
  );

  if (results) {
    return (
      <div 
        className="min-h-screen py-8 relative"
        style={{
          backgroundImage: `url('/images/singapore-green-landscape.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white bg-opacity-85"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8">
            <button
              onClick={resetCalculator}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2 bg-white bg-opacity-80 px-4 py-2 rounded-lg backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Calculate Again</span>
            </button>
          </div>
          {renderResults()}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 relative"
      style={{
        backgroundImage: `url('/images/singapore-green-landscape.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated Background Elements */}
      <AnimatedBackground />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-green-50/80 to-blue-50/70"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Carbon Footprint Calculator
          </h1>
          <p className="text-xl text-gray-700 font-medium">Calculate your environmental impact and discover ways to reduce it</p>
        </div>

        {/* Enhanced Progress Bar with Leaf Animation */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-800 flex items-center">
              <Leaf className="w-4 h-4 mr-2 text-green-600" />
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            >
              {/* Animated leaf on progress bar */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
                <Leaf className="w-4 h-4 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-2 ${
                  step.id === currentStep ? 'text-primary-600' : 
                  step.id < currentStep ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id === currentStep ? 'bg-primary-600 text-white' :
                    step.id < currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-black">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-green-50/95 to-blue-50/95 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-green-200/50 relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-green-400 rounded-full"></div>
            <div className="absolute top-8 right-8 w-6 h-6 border-2 border-blue-400 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-4 h-4 border-2 border-green-300 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-black mb-3 bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent">
                {steps[currentStep - 1]?.title}
              </h2>
              <p className="text-lg text-gray-700 font-medium mb-2">
                {steps[currentStep - 1]?.description}
              </p>
            </div>

            {getStepContent(currentStep)}

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-between items-center mt-10">
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
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex flex-col items-center space-y-2">
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    // Save current progress
                    localStorage.setItem('carbonTrackerProgress', JSON.stringify({
                      currentStep,
                      formData: watchedValues
                    }));
                    toast.success('Progress saved! You can continue later.');
                  }}
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-1"
                >
                  <Clock className="w-3 h-3" />
                  <span>Save & Continue Later</span>
                </button>
              )}
            </div>

            {currentStep === steps.length ? (
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:transform-none"
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
                    <Leaf className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
                <Leaf className="w-4 h-4" />
              </button>
            )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarbonTracker;