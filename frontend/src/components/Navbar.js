import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, LogIn, ChevronDown, Calculator, BookOpen, CalendarDays } from 'lucide-react';

const Navbar = () => {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isFeaturesAnimating, setIsFeaturesAnimating] = useState(false);
  const [isMobileFeaturesOpen, setIsMobileFeaturesOpen] = useState(false);
  const location = useLocation();
  const featuresRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setIsFeaturesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Animate Features dropdown open/close
  useEffect(() => {
    if (isFeaturesOpen) {
      requestAnimationFrame(() => setIsFeaturesAnimating(true));
    } else {
      setIsFeaturesAnimating(false);
    }
  }, [isFeaturesOpen]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
  ];

  const featuresDropdown = [
    {
      name: 'Carbon Calculator',
      href: '/carbon-tracker',
      description: 'Track your daily footprint in minutes with Singapore-friendly factors and tips.',
      Icon: Calculator,
    },
    {
      name: 'Education Hub',
      href: '/education',
      description: 'Learn fast: bite-sized explainers, news, and practical climate concepts.',
      Icon: BookOpen,
    },
    {
      name: 'Eco-Events Calendar',
      href: '/events',
      description: 'Discover and host eco-events across Singapore — RSVP and stay updated.',
      Icon: CalendarDays,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const openFeatures = () => setIsFeaturesOpen(true);
  const closeFeatures = () => setIsFeaturesOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
              onClick={() => {
                // Force scroll to top when clicking logo
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
              }}
            >
              <img
                src="/images/apple-touch-icon.png"
                alt="ClimateHub Logo"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-gray-900">ClimateHub</span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    // Force scroll to top when clicking Home
                    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                    
                  }}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Features dropdown */}
              <div
                className="relative"
                ref={featuresRef}
                onMouseEnter={openFeatures}
                onMouseLeave={closeFeatures}
              >
                <button
                  onClick={() => setIsFeaturesOpen((v) => !v)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    featuresDropdown.some(item => isActive(item.href))
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Features
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFeaturesOpen && (
                  <>
                    {/* Apple-like blurred backdrop (desktop only) */}
                    <div
                      className={`hidden md:block fixed inset-x-0 top-16 bottom-0 z-40 pointer-events-none transition-all duration-1000 ${
                        isFeaturesAnimating ? 'bg-black/10 backdrop-blur-md' : 'bg-black/0 backdrop-blur-0'
                      }`}
                      aria-hidden="true"
                    />

                    {/* Hover bridge to prevent accidental close when moving from trigger to panel */}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 z-50 h-3 w-[720px] max-w-[calc(100vw-2rem)]"
                      aria-hidden="true"
                    />
                    {/* LottieFiles-like mega menu panel */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 w-[720px] max-w-[calc(100vw-2rem)] transform transition-all duration-1000 ${
                        isFeaturesAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-[0.98]'
                      }`}
                    >
                      <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <div className="px-6 pt-6 pb-4">
                          <div className="flex items-baseline justify-between">
                            <h3 className="text-sm font-semibold tracking-wide text-gray-500">FEATURES</h3>
                            <span className="text-xs text-gray-400">Explore ClimateHub tools</span>
                          </div>
                          <h2 className="mt-2 text-2xl font-bold text-gray-900">Build habits. Track impact.</h2>
                          <p className="mt-1 text-sm text-gray-600">Everything you need to make sustainable choices easier — in one place.</p>
                        </div>

                        <div className="px-6 pb-6">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {featuresDropdown.map((item, idx) => {
                              const Icon = item.Icon;
                              return (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  onClick={() => setIsFeaturesOpen(false)}
                                  style={{ transitionDelay: `${idx * 250}ms` }}
                                  className={`group rounded-xl border border-gray-200 bg-white/70 hover:bg-white p-4 hover:shadow-md transition-all duration-1000 ${
                                    isFeaturesAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                  } ${isActive(item.href) ? 'ring-2 ring-primary-200' : ''}`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors duration-200">
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-900">{item.name}</h4>
                                      </div>
                                      <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.description}</p>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50/70 border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-600">Tip: Hover to browse, click any card to open the feature.</p>
                            <button
                              type="button"
                              onClick={() => setIsFeaturesOpen(false)}
                              className="text-xs font-medium text-gray-700 hover:text-gray-900"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium">
                    {user.displayName}
                  </span>
                </Link>
                <button
                  onClick={signOutUser}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block text-sm">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center space-x-2 btn-primary"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setIsMenuOpen(false);
                  // Force scroll to top when clicking Home
                  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                }}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Features section */}
            <div className="space-y-1">
              <button
                onClick={() => setIsMobileFeaturesOpen(!isMobileFeaturesOpen)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                Features
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMobileFeaturesOpen && (
                <div className="pl-4 space-y-1">
                  {featuresDropdown.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileFeaturesOpen(false);
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {user && (
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;