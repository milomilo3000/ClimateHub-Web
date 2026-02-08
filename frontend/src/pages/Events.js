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
  ArrowRight,
  Leaf,
  TrendingUp,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import FadeIn from '../components/animations/FadeIn';
import StaggerWrapper from '../components/animations/StaggerWrapper';

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

    if (category !== 'all') {
      filtered = filtered.filter(event => event.category === category);
    }

    if (status !== 'all') {
      filtered = filtered.filter(event => event.status === status);
    }

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

  // Sample partner organizations
  const partners = [
    { name: 'NEA', logo: 'https://via.placeholder.com/120x60?text=NEA' },
    { name: 'WWF', logo: 'https://via.placeholder.com/120x60?text=WWF' },
    { name: 'Climate Action SG', logo: 'https://via.placeholder.com/120x60?text=Climate+Action' },
    { name: 'Green Movement', logo: 'https://via.placeholder.com/120x60?text=Green+Movement' }
  ];

  return (
    <StaggerWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full">
          {/* Header / Hero Section */}
          <FadeIn duration={2}>
            <div className="">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-full shadow-lg">
                <div className="mx-auto max-w-7xl px-6 md:px-28 h-[calc(100vh-80px)] flex items-center">
                  <div className="w-full flex flex-col items-center text-center">
                    <p className="inline-flex items-center px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-white/15 text-green-50 border border-white/20">
                      Discover · Join · Impact
                    </p>

                    <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                      Eco-Events Calendar
                    </h1>

                    <p className="text-base md:text-lg text-green-50/90 max-w-3xl mb-6 leading-relaxed">
                      Join sustainability-based events around Singapore and beyond. Connect with like-minded individuals,
                      and turn small actions into real impact.
                    </p>

                    <ul className="space-y-2 text-sm md:text-base text-green-50/90 mb-10 max-w-3xl">
                      <li className="flex items-start justify-center gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white" />
                        <span>Discover workshops, cleanups, and community events near you.</span>
                      </li>
                      <li className="flex items-start justify-center gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white" />
                        <span>RSVP easily, receive updates, and stay plugged into new drops weekly.</span>
                      </li>
                      <li className="flex items-start justify-center gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white" />
                        <span>Host your own event and build a community for change.</span>
                      </li>
                    </ul>

                    <div className="flex flex-wrap justify-center gap-4 items-center">
                      <button
                        onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex items-center space-x-2 bg-white text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg text-sm md:text-base transition-colors duration-200 shadow-md"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>View upcoming events</span>
                      </button>

                      <button
                        onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-sm md:text-base transition-colors duration-200 shadow-md"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>RSVP a new event</span>
                      </button>

                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-sm md:text-base transition-colors duration-200 shadow-md"
                      >
                        <Users className="w-5 h-5" />
                        <span>Host your event</span>
                      </button>

                      <span className="text-xs md:text-sm text-green-50/80 w-full mt-2">
                        Free to join · Updated weekly
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            {/* What can you do section */}
            <FadeIn delay={0.15} duration={2}>
              <div className="mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                  What can you do on the Eco-Events Calendar?
                </h2>
                <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
                  Think of this as your climate-social layer: discover events, join them in one click, and stay in the loop as new opportunities roll out across Singapore.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-green-700" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Host events</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Create cleanups, workshops, talks, and school/community initiatives. Share the details once—participants can RSVP instantly.
                    </p>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-700" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Join & RSVP</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Filter events by category and status, find what fits your schedule, and RSVP through official registration links.
                    </p>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-purple-700" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Stay connected</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Get rolling updates as new events are posted. Reach organisers via provided links and keep your calendar fresh.
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-7 rounded-full text-sm md:text-base transition-colors duration-200 shadow-md"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Go to events list</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Create Event Form */}
            {showCreateForm && (
              <FadeIn duration={0.3}>
                <div className="card mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
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
              </FadeIn>
            )}

            {/* Upcoming Events Section */}
            <FadeIn delay={0.3} duration={2}>
              <div id="events-section" className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Upcoming Events</h2>
                
                {/* Filters */}
                <div className="card mb-6">
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
                  </div>
                </div>

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
                      <p className="text-gray-600 mb-4">No events found</p>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center space-x-2 btn-primary"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Create First Event</span>
                      </button>
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
                              by {event.organizer}
                            </span>
                            {event.registrationUrl && (
                              <a
                                href={event.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                <span>RSVP</span>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Partners Section */}
            <FadeIn delay={0.4} duration={2}>
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Which events are being shown?</h2>
                <p className="text-gray-600 mb-8">
                  Our partners include leading environmental organizations and sustainability advocates 
                  who are committed to making Singapore greener.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {partners.map((partner, index) => (
                    <div key={index} className="flex items-center justify-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-white">
                      <div className="text-center">
                        <div className="w-24 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-xs font-semibold text-gray-600">{partner.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Want to become a partner organization?
                  </p>
                  <button className="inline-flex items-center space-x-2 btn-primary">
                    <Users className="w-5 h-5" />
                    <span>Partner with Us</span>
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Call to Action */}
            <FadeIn delay={0.5} duration={2}>
              <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Make an Impact?
                </h2>
                <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of Singaporeans taking action for the environment. 
                  Browse events, RSVP, or host your own today.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center space-x-2 bg-white text-green-600 hover:bg-gray-100 
                             font-semibold py-4 px-8 rounded-full text-lg transition-colors duration-200 shadow-lg"
                  >
                    <Calendar className="w-6 h-6" />
                    <span>Browse Events</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  {user && (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center space-x-2 bg-green-700 hover:bg-green-800 text-white 
                               font-semibold py-4 px-8 rounded-full text-lg transition-colors duration-200 shadow-lg border-2 border-white"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Host an Event</span>
                    </button>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </StaggerWrapper>
  );
};

export default Events;
