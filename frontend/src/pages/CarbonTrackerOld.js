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
  MapPin,
  CheckCircle,
  AlertCircle
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

  const steps = [
    { id: 1, title: 'Diet & Food Habits', description: 'Your daily food consumption and eating patterns' },
    { id: 2, title: 'Transport', description: 'How you get around Singapore daily' },
    { id: 3, title: 'Travel', description: 'Flights and trips you take' },
    { id: 4, title: 'Fast Fashion', description: 'Clothing shopping and fashion choices' },
    { id: 5, title: 'Home & Utilities', description: 'Your home energy and water usage' },
    { id: 6, title: 'Spending & Lifestyle', description: 'Entertainment and leisure activities' },
    { id: 7, title: 'Electronics Usage', description: 'Digital habits and device ownership' },
    { id: 8, title: 'Waste Generation', description: 'Waste production and recycling habits' },
    { id: 9, title: 'Offsetting Activities', description: 'Environmental actions that reduce your footprint' }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/carbon/calculate', data);
      if (response.data.success) {
        setResults(response.data.result);
        setFormData(data);
        setCurrentStep(9); // Results step
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
      case 1: // Diet & Food Habits
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How many clothing items do you buy per year?</label>
              <input
                type="number"
                {...register('fastFashion.clothingItems', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 20"
              />
              {errors.fastFashion?.clothingItems && (
                <p className="text-red-500 text-sm mt-1">This field is required</p>
              )}
            </div>
            <div>
              <label className="form-label">What percentage of your clothing is sustainable/ethical?</label>
              <input
                type="number"
                {...register('fastFashion.sustainablePercentage', { required: true, min: 0, max: 100 })}
                className="input-field"
                placeholder="e.g., 30"
              />
              {errors.fastFashion?.sustainablePercentage && (
                <p className="text-red-500 text-sm mt-1">Please enter a percentage between 0-100</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How much meat do you consume per week (kg)?</label>
              <input
                type="number"
                step="0.1"
                {...register('diet.meatConsumption', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 2.5"
              />
            </div>
            <div>
              <label className="form-label">How much dairy do you consume per week (kg)?</label>
              <input
                type="number"
                step="0.1"
                {...register('diet.dairyConsumption', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 1.0"
              />
            </div>
            <div>
              <label className="form-label">What percentage of your food is locally sourced?</label>
              <input
                type="number"
                {...register('diet.localFoodPercentage', { required: true, min: 0, max: 100 })}
                className="input-field"
                placeholder="e.g., 40"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How many hours per week do you use public transport?</label>
              <input
                type="number"
                step="0.5"
                {...register('transport.publicTransportHours', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <label className="form-label">How many hours per week do you use private vehicles?</label>
              <input
                type="number"
                step="0.5"
                {...register('transport.privateVehicleHours', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="form-label">What type of vehicle do you primarily use?</label>
              <select {...register('transport.vehicleType', { required: true })} className="input-field">
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">How many flights do you take per year?</label>
              <input
                type="number"
                {...register('travel.flightsPerYear', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 2"
              />
            </div>
            <div>
              <label className="form-label">Average flight duration (hours)?</label>
              <input
                type="number"
                step="0.5"
                {...register('travel.averageFlightHours', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 6"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">Monthly electricity consumption (kWh)?</label>
              <input
                type="number"
                {...register('electricity.monthlyKwh', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 300"
              />
            </div>
            <div>
              <label className="form-label">Percentage of renewable energy used?</label>
              <input
                type="number"
                {...register('electricity.renewablePercentage', { required: true, min: 0, max: 100 })}
                className="input-field"
                placeholder="e.g., 10"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">Weekly waste generation (kg)?</label>
              <input
                type="number"
                step="0.1"
                {...register('waste.weeklyWasteKg', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 5.0"
              />
            </div>
            <div>
              <label className="form-label">Percentage of waste recycled?</label>
              <input
                type="number"
                {...register('waste.recyclingPercentage', { required: true, min: 0, max: 100 })}
                className="input-field"
                placeholder="e.g., 60"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">Cinema visits per month?</label>
              <input
                type="number"
                {...register('outings.cinemaVisits', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 2"
              />
            </div>
            <div>
              <label className="form-label">Restaurant visits per month?</label>
              <input
                type="number"
                {...register('outings.restaurantVisits', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 8"
              />
            </div>
            <div>
              <label className="form-label">Hours of entertainment per week?</label>
              <input
                type="number"
                step="0.5"
                {...register('outings.entertainmentHours', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 10"
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <label className="form-label">Number of electronic devices owned?</label>
              <input
                type="number"
                {...register('electronics.devicesOwned', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="form-label">Average device lifespan (years)?</label>
              <input
                type="number"
                step="0.5"
                {...register('electronics.averageLifespan', { required: true, min: 0 })}
                className="input-field"
                placeholder="e.g., 3"
              />
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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

    return (
      <div className="space-y-8">
        {/* Summary */}
        <div className="card">
          <div className="text-center mb-6">
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
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{results.comparison.singaporeAverage}</div>
              <div className="text-sm text-gray-600">Singapore Average</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{results.comparison.globalAverage}</div>
              <div className="text-sm text-gray-600">Global Average</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{results.comparison.percentile.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Better than average</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Breakdown by Category</h3>
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

            <div>
              <h3 className="text-lg font-semibold mb-4">Comparison Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'You', value: Math.round(results.totalFootprint * 100) / 100 },
                  { name: 'Singapore', value: Math.round(results.comparison.singaporeAverage * 100) / 100 },
                  { name: 'Global', value: Math.round(results.comparison.globalAverage * 100) / 100 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {user && !saved && (
              <button
                onClick={saveResults}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Results</span>
              </button>
            )}
            <button
              onClick={() => {
                setCurrentStep(1);
                setResults(null);
                setSaved(false);
              }}
              className="btn-outline flex items-center justify-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Carbon Footprint Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your personal carbon footprint and compare it with Singapore and global averages. 
            This comprehensive calculator covers all major lifestyle factors.
          </p>
        </div>

        {/* Progress Steps */}
        {currentStep <= 8 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Step {currentStep} of 8
              </span>
              <span className="text-sm font-medium text-gray-500">
                {Math.round((currentStep / 8) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form or Results */}
        <div className="card">
          {currentStep <= 8 ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Step Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-gray-600">
                  {steps[currentStep - 1].description}
                </p>
              </div>

              {/* Step Content */}
              {getStepContent(currentStep)}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                {currentStep < 8 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Calculating...</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5" />
                        <span>Calculate Footprint</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          ) : (
            renderResults()
          )}
        </div>
      </div>
    </div>
  );
};

export default CarbonTracker; 