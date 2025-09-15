import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAuth } from 'firebase/auth';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, category, status, searchQuery]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      if (response.data.success) {
        setEvents(response.data.events);
        setFilteredEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(event => event.category === category);
    }

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(event => event.status === status);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const onSubmitEvent = async (data) => {
    if (!user) {
      toast.error('Please sign in to create events');
      return;
    }

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.post('/api/events', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Event created successfully!');
        setShowCreateForm(false);
        reset();
        fetchEvents();
      }
    } catch (error) {
      console.error('Create event error:', error);
      toast.error('Failed to create event');
    }
  };

  const deleteEvent = async (eventId) => {
    if (!user) return;

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.delete(`/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Event deleted successfully!');
        fetchEvents();
      }
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Failed to delete event');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      workshop: 'bg-blue-100 text-blue-800',
      cleanup: 'bg-green-100 text-green-800',
      seminar: 'bg-purple-100 text-purple-800',
      protest: 'bg-red-100 text-red-800',
      conference: 'bg-yellow-100 text-yellow-800',
      volunteer: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.upcoming;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 coming-soon-container">
        <div className="blur-content">
          {/* Header */}
          <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Environmental Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and participate in environmental community events in Singapore. 
            Join climate action initiatives and make a difference.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="workshop">Workshop</option>
                <option value="cleanup">Cleanup</option>
                <option value="seminar">Seminar</option>
                <option value="protest">Protest</option>
                <option value="conference">Conference</option>
                <option value="volunteer">Volunteer</option>
                <option value="other">Other</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="all">All Status</option>
              </select>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Event</span>
              </button>
            )}
          </div>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <div className="card mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitEvent)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Event Title</label>
                  <input
                    type="text"
                    {...register('title', { required: true })}
                    className="input-field"
                    placeholder="Enter event title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">Title is required</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Organizer</label>
                  <input
                    type="text"
                    {...register('organizer', { required: true })}
                    className="input-field"
                    placeholder="Enter organizer name"
                  />
                  {errors.organizer && (
                    <p className="text-red-500 text-sm mt-1">Organizer is required</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    {...register('startDate', { required: true })}
                    className="input-field"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">Start date is required</p>
                  )}
                </div>
                <div>
                  <label className="form-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    {...register('endDate', { required: true })}
                    className="input-field"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">End date is required</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select {...register('category', { required: true })} className="input-field">
                    <option value="workshop">Workshop</option>
                    <option value="cleanup">Cleanup</option>
                    <option value="seminar">Seminar</option>
                    <option value="protest">Protest</option>
                    <option value="conference">Conference</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    {...register('location.address')}
                    className="input-field"
                    placeholder="Enter location address"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  {...register('description', { required: true })}
                  rows="4"
                  className="input-field"
                  placeholder="Enter event description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">Description is required</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Registration URL (optional)</label>
                  <input
                    type="url"
                    {...register('registrationUrl')}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="form-label">Max Participants (optional)</label>
                  <input
                    type="number"
                    {...register('maxParticipants')}
                    className="input-field"
                    placeholder="Enter max participants"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('isOnline')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Online Event</span>
                </label>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="card">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {event.description.length > 100 
                      ? event.description.substring(0, 100) + '...' 
                      : event.description
                    }
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location?.address || 'Location TBA'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{event.currentParticipants || 0}/{event.maxParticipants} participants</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      by {event.createdBy?.displayName || 'Unknown'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {user && event.createdBy?._id === user.id && (
                        <>
                          <button
                            onClick={() => deleteEvent(event._id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedEvent.category)}`}>
                      {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600">{selectedEvent.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Event Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Start: {formatDate(selectedEvent.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>End: {formatDate(selectedEvent.endDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedEvent.location?.address || 'Location TBA'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Organizer: {selectedEvent.organizer}</span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedEvent.registrationUrl && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Registration</h4>
                        <a
                          href={selectedEvent.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                        >
                          <span>Register Now</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Coming Soon Overlay */}
        <div className="coming-soon-overlay">
          <div className="coming-soon-content">
            <div className="coming-soon-icon">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h2 className="coming-soon-title">Coming Soon</h2>
            <p className="coming-soon-subtitle">
              The Events Calendar feature is currently under development. 
              We're working hard to bring you an amazing experience for discovering 
              and participating in environmental events across Singapore.
            </p>
            <div className="coming-soon-badge">
              🚀 In Development
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events; 