import React, { useState, useEffect } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

const RecommendationCarousel = ({ recommendations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState([]);
  const [rejectedCards, setRejectedCards] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');

  // Load completed actions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('climatehub-completed-actions');
    if (saved) {
      setCompletedCards(JSON.parse(saved));
    }
  }, []);

  // Save completed actions to localStorage
  useEffect(() => {
    localStorage.setItem('climatehub-completed-actions', JSON.stringify(completedCards));
  }, [completedCards]);

  const defaultRecommendations = [
    {
      id: 'electronics',
      title: 'Reduce Electronics Usage',
      description: 'Unplug devices when not in use and reduce screen time.',
      icon: '💻',
      category: 'electronics'
    },
    {
      id: 'diet',
      title: 'Eat Less Red Meat',
      description: 'Try plant-based meals or reduce beef/pork consumption.',
      icon: '🍔',
      category: 'diet'
    },
    {
      id: 'transport',
      title: 'Take Public Transport',
      description: 'Opt for buses and trains instead of private vehicles.',
      icon: '🚎',
      category: 'transport'
    },
    {
      id: 'home',
      title: 'Save Energy at Home',
      description: 'Turn off appliances, use fans, and set aircon to 25°C+.',
      icon: '🏠',
      category: 'home'
    },
    {
      id: 'shopping',
      title: 'Use Reusable Bags',
      description: 'Bring your own bag and reduce single-use plastics.',
      icon: '🛍️',
      category: 'shopping'
    },
    {
      id: 'water',
      title: 'Conserve Water',
      description: 'Take shorter showers and fix leaky taps promptly.',
      icon: '💧',
      category: 'home'
    },
    {
      id: 'waste',
      title: 'Reduce Food Waste',
      description: 'Plan meals better and compost organic waste.',
      icon: '🗑️',
      category: 'diet'
    },
    {
      id: 'digital',
      title: 'Digital Minimalism',
      description: 'Reduce cloud storage usage and streaming time.',
      icon: '☁️',
      category: 'electronics'
    }
  ];

  const allRecommendations = recommendations?.length > 0 ? recommendations : defaultRecommendations;
  const availableCards = allRecommendations.filter(
    rec => !completedCards.includes(rec.id) && !rejectedCards.includes(rec.id)
  );

  const handleAccept = () => {
    if (isAnimating || currentIndex >= availableCards.length) return;
    
    setIsAnimating(true);
    setSlideDirection('right');
    
    setTimeout(() => {
      const currentCard = availableCards[currentIndex];
      setCompletedCards(prev => [...prev, currentCard.id]);
      setCurrentIndex(prev => prev < availableCards.length - 1 ? prev : 0);
      setIsAnimating(false);
      setSlideDirection('');
    }, 300);
  };

  const handleReject = () => {
    if (isAnimating || currentIndex >= availableCards.length) return;
    
    setIsAnimating(true);
    setSlideDirection('left');
    
    setTimeout(() => {
      const currentCard = availableCards[currentIndex];
      setRejectedCards(prev => [...prev, currentCard.id]);
      setCurrentIndex(prev => prev < availableCards.length - 1 ? prev : 0);
      setIsAnimating(false);
      setSlideDirection('');
    }, 300);
  };

  const resetProgress = () => {
    setCompletedCards([]);
    setRejectedCards([]);
    setCurrentIndex(0);
    localStorage.removeItem('climatehub-completed-actions');
  };

  if (availableCards.length === 0) {
    return (
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            What You Can Do Next 💡
          </h2>
          <p className="text-gray-600">Interactive recommendations for reducing your carbon footprint</p>
        </div>

        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Great job!
            </h3>
            <p className="text-green-700 mb-6">
              You've reviewed all our recommendations. Every small action counts towards a greener future!
            </p>
            <button
              onClick={resetProgress}
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Review Again</span>
            </button>
          </div>
          
          {completedCards.length > 0 && (
            <div className="mt-6 text-sm text-gray-600">
              You've committed to {completedCards.length} action{completedCards.length !== 1 ? 's' : ''}! 🌱
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentCard = availableCards[currentIndex];
  const progress = ((completedCards.length + rejectedCards.length) / allRecommendations.length) * 100;

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          What You Can Do Next 💡
        </h2>
        <p className="text-gray-600">Swipe through personalized recommendations</p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative h-48 mb-8">
          {/* Background Cards */}
          {availableCards.slice(currentIndex + 1, currentIndex + 3).map((card, index) => (
            <div
              key={card.id}
              className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-100"
              style={{
                transform: `translateY(${(index + 1) * 4}px) scale(${1 - (index + 1) * 0.02})`,
                zIndex: 10 - index,
                opacity: 1 - (index + 1) * 0.1
              }}
            />
          ))}

          {/* Current Card */}
          <div
            className={`absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 transition-all duration-300 ${
              isAnimating 
                ? slideDirection === 'right' 
                  ? 'transform translate-x-full rotate-12 opacity-0' 
                  : 'transform -translate-x-full -rotate-12 opacity-0'
                : 'transform translate-x-0 rotate-0 opacity-100'
            }`}
            style={{ zIndex: 20 }}
          >
            <div className="h-full flex flex-col justify-center items-center p-8 text-center">
              {/* Icon */}
              <div className="text-6xl mb-4">{currentCard.icon}</div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {currentCard.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {currentCard.description}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleReject}
            disabled={isAnimating}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-30"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleAccept}
            disabled={isAnimating}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-30"
          >
            <Check className="w-6 h-6" />
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-500 mb-4">
          <p>Tap ✅ to commit to this action, or ❌ to skip</p>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center space-x-2">
          {availableCards.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-green-600 w-4' : 'bg-gray-300'
              }`}
            />
          ))}
          {availableCards.length > 5 && (
            <div className="text-xs text-gray-400 ml-2">
              +{availableCards.length - 5} more
            </div>
          )}
        </div>

        {/* Stats */}
        {(completedCards.length > 0 || rejectedCards.length > 0) && (
          <div className="mt-6 flex justify-center space-x-6 text-sm">
            {completedCards.length > 0 && (
              <div className="flex items-center space-x-1 text-green-600">
                <Check className="w-4 h-4" />
                <span>{completedCards.length} committed</span>
              </div>
            )}
            {rejectedCards.length > 0 && (
              <div className="flex items-center space-x-1 text-gray-500">
                <X className="w-4 h-4" />
                <span>{rejectedCards.length} skipped</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCarousel;
