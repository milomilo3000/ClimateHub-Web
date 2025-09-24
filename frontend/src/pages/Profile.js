import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import { 
  User, 
  Award, 
  TrendingUp, 
  Settings, 
  Calendar,
  Edit,
  Save,
  X,
  Leaf,
  Trophy,
  Star,
  Heart
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [carbonHistory, setCarbonHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || ''
    }
  });

  useEffect(() => {
    if (user) {
      fetchCarbonHistory();
    }
  }, [user]);

  const fetchCarbonHistory = async () => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.get('/api/carbon/history', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setCarbonHistory(response.data.footprints);
      }
    } catch (error) {
      console.error('Error fetching carbon history:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitProfile = async (data) => {
    try {
      await updateProfile(data);
      setShowEditForm(false);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBadgeIcon = (badgeName) => {
    const icons = {
      'First Steps': Leaf,
      'Carbon Warrior': TrendingUp,
      'Eco Champion': Trophy,
      'Green Master': Star,
      'Climate Hero': Heart
    };
    return icons[badgeName] || Award;
  };

  const getBadgeColor = (badgeName) => {
    const colors = {
      'First Steps': 'bg-green-100 text-green-800',
      'Carbon Warrior': 'bg-blue-100 text-blue-800',
      'Eco Champion': 'bg-purple-100 text-purple-800',
      'Green Master': 'bg-yellow-100 text-yellow-800',
      'Climate Hero': 'bg-red-100 text-red-800'
    };
    return colors[badgeName] || 'bg-gray-100 text-gray-800';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h1>
            <p className="text-gray-600">You need to sign in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Profile
          </h1>
          <p className="text-lg text-gray-600">
            Track your climate action journey and manage your account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-primary-600" />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{user.displayName}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">
                    {formatDate(user.createdAt || new Date())}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total carbon footprint</span>
                  <span className="font-medium text-primary-600">
                    {user.totalCarbonFootprint ? `${user.totalCarbonFootprint.toFixed(2)} tonnes` : 'Not calculated'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Badges earned</span>
                  <span className="font-medium">{user.badges?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges</h3>
              {user.badges && user.badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {user.badges.map((badge, index) => {
                    const BadgeIcon = getBadgeIcon(badge.name);
                    return (
                      <div
                        key={index}
                        className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => setSelectedBadge(badge)}
                      >
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${getBadgeColor(badge.name)}`}>
                          <BadgeIcon className="w-6 h-6" />
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm">{badge.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(badge.earnedAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No badges earned yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Complete climate actions to earn badges!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Carbon History */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Carbon Footprint History</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading history...</p>
                </div>
              ) : carbonHistory.length > 0 ? (
                <div className="space-y-6">
                  {/* Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={carbonHistory
                        .slice()
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map(item => ({
                          date: formatDate(item.date),
                          footprint: Math.round(item.totalFootprint * 100) / 100
                        }))
                      }>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="footprint" 
                          stroke="#22c55e" 
                          strokeWidth={2}
                          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* History List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Calculations</h3>
                    <div className="space-y-3">
                      {carbonHistory.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.totalFootprint.toFixed(2)} tonnes CO₂
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(item.date)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {item.comparison?.percentile?.toFixed(1)}% better than average
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No carbon footprint history</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Calculate your carbon footprint to see your history here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                  <div>
                    <label className="form-label">Display Name</label>
                    <input
                      type="text"
                      {...register('displayName', { required: true })}
                      className="input-field"
                      placeholder="Enter display name"
                    />
                    {errors.displayName && (
                      <p className="text-red-500 text-sm mt-1">Display name is required</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Profile Picture URL</label>
                    <input
                      type="url"
                      {...register('photoURL')}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getBadgeColor(selectedBadge.name)}`}>
                  {React.createElement(getBadgeIcon(selectedBadge.name), { className: "w-10 h-10" })}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedBadge.name}</h2>
                <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
                <p className="text-sm text-gray-500">
                  Earned on {formatDate(selectedBadge.earnedAt)}
                </p>
                
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="btn-primary mt-6"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 