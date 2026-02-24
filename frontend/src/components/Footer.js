import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Tiktok,Twitter, Facebook, Instagram } from 'lucide-react';
import { FaTiktok } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 w-full box-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 min-w-0">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/images/apple-touch-icon.png"
                alt="ClimateHub logo"
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              />
              <span className="text-lg sm:text-xl font-bold">ClimateHub</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md text-sm sm:text-base break-words">
              Singapore's one-stop platform for environmental action. Track your carbon footprint, 
              discover eco-events, and stay informed about environmental initiatives.
            </p>
            <div className="flex space-x-4">
              
              <a
                href="https://www.tiktok.com/@climatehubsg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                <FaTiktok className="w-5 h-5" />
                </a>
                <a
                href="https://www.instagram.com/climatehubsg/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                <FaInstagram className="w-5 h-5" />
                </a>


            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                >
                  Home
                </Link>
              </li>
              <li className="break-words">
                <Link 
                  to="/carbon-tracker" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                >
                  Carbon Footprint Calculator
                </Link>
              </li>
              <li>
                <Link 
                  to="/education" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                >
                  Education Hub
                </Link>
              </li>
              <li>
                <Link 
                  to="/events" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                >
                  Eco-Events Calendar
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 min-w-0">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base break-all">climatehub.sg@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">+65 9168 9301</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Singapore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-400 text-xs sm:text-sm order-2 md:order-1">
              © 2025 ClimateHub. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-0 md:mt-0 order-1 md:order-2">
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200 break-words">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 