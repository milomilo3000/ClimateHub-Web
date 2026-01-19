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
  const [aiRecs, setAiRecs] = useState(null);
  const [aiRecsLoading, setAiRecsLoading] = useState(false);
  const [aiRecsError, setAiRecsError] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  // Watch all slider values for display
  const watchedValues = watch();

  // Updated steps configuration for new calculator
  const steps = [
    { id: 1, title: 'Electronics Usage', description: 'Your digital device and technology usage patterns' },
    { id: 2, title: 'Diet & Food Habits', description: 'Your weekly food consumption and eating patterns' },
    { id: 3, title: 'Transport', description: 'Your weekly travel and commuting habits' },
    { id: 4, title: 'Home & Utilities', description: 'Your home energy and water usage patterns' },
    { id: 5, title: 'Shopping', description: 'Your shopping and consumption habits' }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/carbon/calculate', data);
      if (response.data.success) {
        setResults(response.data.footprint);
        setFormData(data);
        setSaved(false);
        setAiRecs(null);
        setAiRecsError(null);
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
  const generateAiRecommendations = async (footprint, inputData) => {
    setAiRecsLoading(true);
    setAiRecsError(null);

    try {
      // Send only what the model needs (keeps token cost predictable)
      const payload = {
        totalFootprint: footprint?.totalFootprint,
        breakdown: footprint?.breakdown,
        comparison: footprint?.comparison,
        // include a minimal subset of answers for personalization
        inputs: inputData || formData || {}
      };

      const response = await axios.post('/api/carbon/recommendations', payload);

      if (response.data?.success) {
        setAiRecs(response.data.recommendations);
        toast.success('AI recommendations generated!');
      } else {
        throw new Error(response.data?.error || 'Unknown recommendations error');
      }
    } catch (err) {
      console.error('AI recommendations error:', err);
      setAiRecsError(err?.message || 'Failed to generate AI recommendations');
      toast.error('Failed to generate AI recommendations');
    } finally {
      setAiRecsLoading(false);
    }
  };
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


      case 4: // Electronics Usage - Modified (removed phone upgrade, repair/reuse, multiple devices; added OSN & INET)
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

      case 5: // Waste Generation - Modified (removed first 3 and last 2 questions)
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

        {/* AI Recommendations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
              <p className="text-sm text-gray-600">
                Personalised tips based on your footprint breakdown (actionable, Singapore-friendly).
              </p>
            </div>

            <button
              type="button"
              onClick={() => generateAiRecommendations(results, formData)}
              disabled={aiRecsLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
            >
              {aiRecsLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">Generate with AI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Error state */}
          {aiRecsError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-semibold">Couldn’t generate recommendations.</p>
                  <p className="text-red-700/90">{aiRecsError}</p>
                  <p className="text-red-700/90 mt-1">
                    Tip: check your backend route <span className="font-mono">/api/carbon/recommendations</span> and your OpenAI key.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* If backend already returned basic recs, show them as “quick tips” */}
          {results.recommendations?.length > 0 && !aiRecs && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">Quick tips</p>
              <div className="space-y-2">
                {results.recommendations.slice(0, 6).map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-900/90">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI output */}
          {!aiRecsLoading && aiRecs?.items?.length > 0 && (
            <div className="space-y-4">
              {aiRecs.items.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {item.category || 'Tip'}
                    </span>
                    {item.difficulty && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.difficulty}
                      </span>
                    )}
                    {typeof item.estimatedSavingsKgCo2ePerWeek === 'number' && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                        ~{item.estimatedSavingsKgCo2ePerWeek.toFixed(1)} kg CO₂e/week
                      </span>
                    )}
                  </div>

                  <p className="text-gray-900 font-semibold mb-1">{item.title}</p>
                  <p className="text-sm text-gray-700 mb-3">{item.whyThisMatters}</p>

                  {item.steps?.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {item.steps.slice(0, 4).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}

                  {item.localContextNote && (
                    <p className="text-xs text-gray-500 mt-3">{item.localContextNote}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!aiRecsLoading && !aiRecs?.items?.length && !aiRecsError && (
            <div className="text-sm text-gray-600">
              Click <span className="font-semibold">Generate with AI</span> to get personalised recommendations based on your biggest emission drivers.
            </div>
          )}
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
    setAiRecs(null);
    setAiRecsError(null);
    setAiRecsLoading(false);
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