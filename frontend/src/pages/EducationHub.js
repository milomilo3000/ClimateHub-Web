import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  const [loading, setLoading] = useState(true); // Re-enabled for news loading
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Pagination state for news list
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Re-enabled news loading with proper RSS feeds
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
    setCurrentPage(1);
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

  // Compute pagination details whenever filteredNews or currentPage changes
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    // clamp page number between 1 and totalPages
    const safePage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(safePage);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user', content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      console.log('🚀 Sending chat request:', chatInput);
      console.log('🌐 Request URL:', '/api/chatbot/chat');
      
      const response = await axios.post('/api/chatbot/chat', {
        message: chatInput
      });

      console.log('📨 Full response received:', response);
      console.log('📊 Response data:', response.data);
      console.log('✅ Response success:', response.data.success);
      console.log('💬 Bot response:', response.data.response);

      if (response.data.success) {
        const botMessage = { 
          type: 'bot', 
          content: response.data.response, 
          timestamp: new Date() 
        };
        setChatMessages(prev => [...prev, botMessage]);
      } else {
        console.error('❌ Response not successful:', response.data);
        toast.error('Failed to get response: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('💥 Chat error:', error);
      console.error('💥 Error response:', error.response?.data);
      console.error('💥 Error status:', error.response?.status);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 w-full">
                <div className="w-full sm:w-auto mb-4 sm:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Latest Climate News
                  </h2>

                  {/* Pagination controls */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm font-medium border ${
                          pageNum === currentPage
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>

                {/* Search + Category */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search news..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        // reset to first page after new search
                        setCurrentPage(1);
                      }}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setCurrentPage(1); // reset to first page on category change
                    }}
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
                  {paginatedNews.map((item, index) => (
                    <div key={startIndex + index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
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
              {/* Bottom pager */}
              {!loading && filteredNews.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-gray-200">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm font-medium border ${
                        pageNum === currentPage
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    Page {currentPage} of {totalPages}
                  </span>
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
                          {message.type === 'bot' ? (
                            <div className="text-sm chat-message-content">
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                  ul: ({ children }) => <ul className="list-none pl-0 mb-3 space-y-2">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-3 space-y-2">{children}</ol>,
                                  li: ({ children }) => <li className="mb-2 pl-0">{children}</li>,
                                  h1: ({ children }) => <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0">{children}</h1>,
                                  h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                                  h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                          <p className="text-xs opacity-70 mt-2">
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
    </div>
  );
};

export default EducationHub; 