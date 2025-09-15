import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Newspaper, 
  MessageCircle, 
  Send, 
  Search,
  Filter,
  Globe,
  MapPin,
  Calendar,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EducationHub = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (category !== 'all') {
      fetchNewsByCategory();
    } else {
      fetchNews();
    }
  }, [category]);

  useEffect(() => {
    filterNews();
  }, [news, searchQuery]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/news');
      if (response.data.success) {
        setNews(response.data.news);
        setFilteredNews(response.data.news);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsByCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/news/category/${category}`);
      if (response.data.success) {
        setNews(response.data.news);
        setFilteredNews(response.data.news);
      }
    } catch (error) {
      console.error('Error fetching category news:', error);
      toast.error('Failed to fetch category news');
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;

    // Filter by search query only (category filtering is now handled by API calls)
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user', content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await axios.post('/api/chatbot/chat', {
        message: chatInput
      });

      if (response.data.success) {
        const botMessage = { 
          type: 'bot', 
          content: response.data.response, 
          timestamp: new Date() 
        };
        setChatMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response');
    } finally {
      setChatLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || typeof text !== 'string') return 'No description available';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 coming-soon-container">
        <div className="blur-content">
          {/* Header */}
          <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Education Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed about Singapore's environmental initiatives, government policies, 
            and the latest climate news from around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                  Latest Climate News
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search news..."
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
                    <option value="local">Local News</option>
                    <option value="global">Global News</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading news...</p>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-8">
                  <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No news found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredNews.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {item.category === 'local' ? (
                            <MapPin className="w-4 h-4 text-primary-600" />
                          ) : (
                            <Globe className="w-4 h-4 text-secondary-600" />
                          )}
                          <span className="text-sm font-medium text-gray-500">
                            {item.source}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.pubDate)}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {truncateText(item.description)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {item.category === 'local' ? 'Local' : 'Global'}
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          <span>Read More</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chatbot Section */}
          <div className="lg:col-span-1">
            <div className="card h-full">
              <div className="flex items-center space-x-2 mb-6">
                <MessageCircle className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Climate Assistant</h2>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 mb-4 h-96 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Ask me about climate change,</p>
                    <p className="text-gray-600">carbon footprint, recycling,</p>
                    <p className="text-gray-600">or sustainable living in Singapore!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            <span className="text-sm">Typing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask about climate action..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={chatLoading}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-12">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Singapore's Environmental Initiatives</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Green Plan 2030</h3>
                <p className="text-gray-600 mb-4">
                  Singapore's comprehensive plan to achieve net-zero emissions by 2050, 
                  focusing on sustainable development and green economy.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Key Targets:</strong> 30% reduction in waste, 2GWp solar deployment, 
                  electric vehicle adoption
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Carbon Tax</h3>
                <p className="text-gray-600 mb-4">
                  Singapore implemented a carbon tax in 2019, starting at S$5 per tonne of CO₂ 
                  and increasing to S$25 by 2024.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Impact:</strong> Encourages businesses to reduce emissions and 
                  invest in clean technologies
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Waste Masterplan</h3>
                <p className="text-gray-600 mb-4">
                  Aims to reduce waste sent to landfill by 30% by 2030 through the 3Rs: 
                  Reduce, Reuse, Recycle.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Initiatives:</strong> Extended Producer Responsibility, 
                  mandatory waste reporting, recycling infrastructure
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SolarNova</h3>
                <p className="text-gray-600 mb-4">
                  Government initiative to deploy 2 gigawatts-peak of solar energy by 2030, 
                  equivalent to powering 350,000 households.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Progress:</strong> Over 500MWp installed, rooftop solar on HDB blocks
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Electric Vehicle Incentives</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive incentives including rebates, tax exemptions, and charging 
                  infrastructure to accelerate EV adoption.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Target:</strong> All vehicles to run on cleaner energy by 2040
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">30 by 30 Food Security</h3>
                <p className="text-gray-600 mb-4">
                  Goal to produce 30% of Singapore's nutritional needs locally by 2030, 
                  reducing food miles and increasing resilience.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Methods:</strong> Vertical farming, urban agriculture, 
                  sustainable aquaculture
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Coming Soon Overlay */}
        <div className="coming-soon-overlay">
          <div className="coming-soon-content">
            <div className="coming-soon-icon">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h2 className="coming-soon-title">Coming Soon</h2>
            <p className="coming-soon-subtitle">
              The Climate News & Education Hub feature is currently under development. 
              We're working hard to bring you the latest climate news, educational content, 
              and an AI-powered climate assistant to help you learn about environmental issues.
            </p>
            <div className="coming-soon-badge">
              📚 In Development
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationHub; 