import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

const ImpactMeasures = ({ userCO2, groupFactor = 40000 }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate impact metrics
  const treeEquivalent = Math.round(userCO2 / 22);
  const groupTreeEquivalent = Math.round(treeEquivalent * groupFactor);
  const seaLevelEquivalent = (userCO2 * 0.000001).toFixed(6); // mm per year
  const scaledSeaLevel = (seaLevelEquivalent * groupFactor * 1000).toFixed(2); // convert to mm
  const energyEquivalent = Math.round(userCO2 * 11.63); // kWh equivalent
  const groupEnergyEquivalent = Math.round(energyEquivalent * groupFactor / 1000000); // GWh

  const impactCards = [
    {
      id: 'trees',
      title: 'Tree Absorption Equivalent',
      number: `${treeEquivalent.toLocaleString()}`,
      unit: 'Trees',
      context: `If all 40,000 NSFs emitted like you, that's ${groupTreeEquivalent.toLocaleString()} trees' worth of CO₂ annually.`,
      icon: '🌳',
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(21, 128, 61, 0.9))',
      image: '/images/Treetops.jpg',
      tooltip: '1 mature tree absorbs approximately 22kg of CO₂ per year'
    },
    {
      id: 'ocean',
      title: 'Sea Level Rise Impact',
      number: `${scaledSeaLevel}`,
      unit: 'mm/year',
      context: `Your weekly emissions contribute ${seaLevelEquivalent}mm to sea level rise. Scaled to all NSFs: ${scaledSeaLevel}mm annually.`,
      icon: '🌊',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(29, 78, 216, 0.9))',
      image: '/images/resevoir.jpg',
      tooltip: 'Based on IPCC estimates of CO₂ contribution to thermal expansion'
    },
    {
      id: 'energy',
      title: 'Energy Equivalent',
      number: `${groupEnergyEquivalent}`,
      unit: 'GWh',
      context: `Your footprint equals ${energyEquivalent.toLocaleString()} kWh. All NSFs combined: ${groupEnergyEquivalent} GWh annually.`,
      icon: '⚡',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(217, 119, 6, 0.9))',
      image: '/images/skyline.jpg',
      tooltip: '1kg CO₂ ≈ 11.63 kWh of energy consumption equivalent'
    }
  ];

  const activeCard = impactCards[currentCard];

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % impactCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + impactCards.length) % impactCards.length);
  };

  const [showTooltip, setShowTooltip] = useState(null);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 md:px-6 text-center mt-16 md:mt-20 mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          Your Impact in Context 🌍
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          Understanding your carbon footprint through relatable comparisons
        </p>
      </div>
      <section className="relative mb-12 left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
      {/* full-bleed background layers */}
      <div className="absolute inset-0" style={{ backgroundImage: `url(${activeCard.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0" style={{ background: activeCard.background }} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative mx-auto max-w-6xl px-6 md:px-8 py-10 md:py-12 lg:py-14 min-h-[42vh] flex flex-col">
        {/* Removed the internal title block here */}

        {/* Unified Carousel */}
        <div className="relative flex-1 flex flex-col">
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentCard * 100}%)` }}
            >
              {impactCards.map((card) => (
                <div
                  key={card.id}
                  className="w-full flex-shrink-0 relative min-h-[26vh] md:min-h-[30vh] lg:min-h-[34vh] rounded-3xl overflow-hidden bg-white/0"
                >
                  <div className="relative h-full flex flex-col justify-center items-center text-center p-6 text-white">
                    {/* Tooltip */}
                    <div className="absolute top-4 right-4">
                      <button
                        className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                        onClick={() => setShowTooltip(showTooltip === card.id ? null : card.id)}
                      >
                        <Info className="w-3 h-3" />
                      </button>
                      {showTooltip === card.id && (
                        <div className="absolute top-8 right-0 bg-black bg-opacity-90 text-white text-xs p-2 rounded-lg w-48 z-10">
                          {card.tooltip}
                        </div>
                      )}
                    </div>

                    {/* Icon */}
                    <div className="text-6xl md:text-7xl mb-6">{card.icon}</div>
                    
                    {/* Number */}
                    <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
                      {card.number}
                    </div>
                    <div className="text-xl md:text-2xl font-semibold mb-6 opacity-95">
                      {card.unit}
                    </div>
                    
                    {/* Title */}
                    <div className="text-xl md:text-2xl font-semibold mb-5 opacity-95">
                      {card.title}
                    </div>
                    
                    {/* Context */}
                    <div className="text-base md:text-lg opacity-85 leading-relaxed px-2 max-w-3xl mx-auto">
                      {card.context}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevCard}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextCard}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-6 space-x-3">
            {impactCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCard(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentCard ? 'bg-green-600 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

export default ImpactMeasures;
