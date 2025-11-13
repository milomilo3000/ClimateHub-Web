import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Calculator, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Users, 
  Globe, 
  Award,
  ArrowRight,
  CheckCircle,
  Shield,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import Slider from "react-slick";
import FadeIn from '../components/animations/FadeIn';
import StaggerWrapper from '../components/animations/StaggerWrapper';

const Home = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Camp Carbon Tracker',
      description: 'Track your environmental impact during NS. Calculate emissions from camp life, transport, and more. See how you stand compared to your other NSFs.',
      href: '/carbon-tracker'
    },
    {
      icon: BookOpen,
      title: 'Education Hub',
      description: 'Learn about Singapore\'s climate goals and how you can contribute. Get updates on environmental policies and initiatives in Singapore\'s army.',
      href: '/education'
    },
    {
      icon: Calendar,
      title: 'Events Calendar',
      description: 'Join green initiatives in your camp and in Singapore. From beach cleanups to eco-volunteering, turn your NS experience into environmental service.',
      href: '/events'
    },
    {
      icon: Users,
      title: 'Profile',
      description: 'Compete with other NSF units in sustainability challenges. Earn eco-badges and climb the green leaderboard with your campmates.',
      href: '/profile'
    }
  ];

  const stats = [
    { label: 'NSF Carbon Footprints', value: '2,500+', icon: Calculator },
    { label: 'Camp Eco-Events', value: '150+', icon: Calendar },
    { label: 'Active NSF Users', value: '1,200+', icon: Users },
    { label: 'CO₂ Saved (tonnes)', value: '850+', icon: Leaf }
  ];

  const benefits = [
    'Track your camp environmental impact',
    'Compete in unit eco-challenges',
    'Learn about military/local sustainability',
    'Earn eco-badges for eco-friendly actions',
    'Join camp and local environmental initiatives',
    'Connect with eco-conscious NSFs',
    'Access local climate resources',
    'Contribute to Singapore\'s green goals'
  ];

  const partners = [
    {
      name: 'SG Eco Fund',
      logo: '/images/sg-eco-fund-logo.png',
      alt: 'SG Eco Fund Logo'
    },
    {
      name: 'WWF Singapore',
      logo: '/images/wwf-logo.png', 
      alt: 'WWF Singapore Logo'
    },
    {
      name: 'Ministry of Sustainability and the Environment',
      logo: '/images/MSE-logo.png',
      alt: 'Ministry of Sustainability and the Environment Logo'
    },
    {
      name: 'WWF WeGotThis',
      logo: '/images/wegotthis.gif',
      alt: 'Wegotthis Logo'
    },
  ];

  // Array of images to show in the hero carousel
  const heroImages = [
    "/images/skyline.jpg",
    "/images/Treetops.jpg",
    "/images/resevoir.jpg"
  ];

// Hero carousel component
  const HeroCarousel = () => {
    const settings = {
      dots: true,             // small dots at bottom
      infinite: true,         // loops forever
      autoplay: true,         // slides change automatically
      autoplaySpeed: 5000,    // every 5s
      speed: 800,             // transition speed
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,          // no arrows, just dots (Tesla style)
      fade: true,             // smooth fade animation
    pauseOnHover: false,
    };

     return (
     <Slider {...settings} className="h-[400px] sm:h-[500px] lg:h-[600px] relative custom-carousel">
         {heroImages.map((src, index) => (
           <div key={index} className="h-[400px] sm:h-[500px] lg:h-[600px] relative">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          {/* Dark overlay so text is readable */}
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>
        ))}
    </Slider>
  );
};

  return (
    <div className="min-h-screen">
       <style>{`
         .custom-carousel .slick-dots {
           position: absolute;
           bottom: 20px;
           left: 0;
           right: 0;
           margin: 0 auto;
           z-index: 5;
         }
         .custom-carousel .slick-dots li {
           margin: 0 4px;
         }
         .custom-carousel .slick-dots li button:before {
           font-size: 10px;
           opacity: 0.5;
           color: white;
         }
         .custom-carousel .slick-dots li.slick-active button:before {
           opacity: 1;
           color: white;
         }
         @media (min-width: 640px) {
           .custom-carousel .slick-dots {
             bottom: 70px;
           }
           .custom-carousel .slick-dots li button:before {
             font-size: 12px;
           }
         }
         @media (min-width: 1024px) {
           .custom-carousel .slick-dots {
             bottom: 30px;
           }
         }
         @media (min-width: 1280px) {
           .custom-carousel .slick-dots {
             bottom: 40px;
           }
         }
       `}</style>
      {/* Hero Section */}
      <FadeIn>
      <section className="relative">
        <HeroCarousel />
        
         <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
     <div className="flex justify-center mb-4 sm:mb-6">
       <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-600 rounded-2xl flex items-center justify-center relative">
         <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
         <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-green-200 absolute -top-1 -right-1" />
       </div>
     </div>
     <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6">
       ClimateHub
     </h1>
     <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold text-green-200 mb-3 sm:mb-4 px-2">
       Equipping NSFs to Serve Both Nation and Nature
     </h2>
     <p className="text-sm sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2">
       Turn your camp routines into eco-missions. Track your footprint, reduce your impact, 
       and help your campmates climb the eco-ranks while serving Singapore.
     </p>
     <div className="flex justify-center w-full px-4 mb-6 sm:mb-8">
     <Link
  to="/carbon-tracker"
  className="bg-green-600 hover:bg-green-700 text-white font-semibold 
             py-2 sm:py-4 px-4 sm:px-8 
             rounded-lg text-sm sm:text-lg 
             transition-colors duration-200 
             inline-flex items-center justify-center space-x-2 
             w-auto max-w-[300px] sm:max-w-sm md:w-auto min-h-[30px]"
>
  <span>Calculate your footprint</span>
  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
</Link>
     </div>
   </div>
      </section>
      </FadeIn>

       {/* Partners Section */}
      <FadeIn delay={0.1}>
      <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 sm:mb-6">
              Supported by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
              {partners.map((partner, index) => (
                <div key={index} className="flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="h-8 sm:h-10 md:h-12 lg:h-16 max-w-24 sm:max-w-28 md:max-w-32 lg:max-w-40 object-contain transition-all duration-300"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden text-gray-600 font-medium text-sm">
                    {partner.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </FadeIn>

       {/* Stats Section */}
       <FadeIn delay={0.2}>
       <section className="py-12 sm:py-16 bg-green-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-8 sm:mb-12">
             <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
               NSFs Making a Difference
             </h2>
             <p className="text-sm sm:text-base text-gray-600">Join fellow servicemen in Singapore's climate mission</p>
           </div>
          <StaggerWrapper>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center py-4 sm:py-0">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-black mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-xs sm:text-sm px-2">{stat.label}</div>
                </div>
              ))}
         </div>
         </StaggerWrapper>
         
         {/* Disclaimer */}
         <div className="flex justify-center mt-8 sm:mt-10">
           <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 max-w-md mx-auto">
             <p className="text-xs sm:text-sm text-yellow-800 text-center font-medium">
               <span className="inline-block mr-1">⚠️</span>
               Please note: The statistics displayed above are sample data for demonstration purposes and do not reflect actual user metrics.
             </p>
           </div>
         </div>
        </div>
      </section>
      </FadeIn>

      {/* Features Section */}
      <FadeIn delay={0.3}>
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Your NS Climate Action Toolkit
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto px-4">
              Everything you need to make your National Service experience environmentally conscious 
              and contribute to Singapore's green future.
            </p>
          </div>
          
          <StaggerWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.href}
                className="bg-white rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group border border-gray-200 hover:border-green-400 hover:bg-green-50 min-h-[160px] sm:min-h-[180px] flex flex-col"
              >
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg mb-3 sm:mb-4 group-hover:bg-green-100 transition-colors duration-200">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600 group-hover:text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
          </StaggerWrapper>
        </div>
      </section>
      </FadeIn>

      {/* Benefits Section */}
      <FadeIn delay={0.4}>
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Why Choose ClimateHub for NS?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                As an NSF, you're already serving Singapore. Now serve the environment too. 
                Our platform helps you make your National Service experience sustainable and meaningful.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 py-1">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
                  <h3 className="text-xl sm:text-2xl font-bold">NSF Green Mission</h3>
                </div>
                <p className="text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                  Every NSF can contribute to Singapore's net-zero 2050 goal. 
                  Make your service count for both nation and nature.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">2050</div>
                    <div className="text-xs sm:text-sm opacity-90">Net-zero target</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">NSF</div>
                    <div className="text-xs sm:text-sm opacity-90">Green warriors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* CTA Section */}
      <FadeIn delay={0.5}>
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Serve Singapore's Green Future?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto px-4">
            Join fellow NSFs in making every day of service count for the environment. 
            Start your eco-mission today and help your unit become the greenest in camp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link
              to="/carbon-tracker"
              className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[48px]"
            >
              <span>Begin Eco-Mission</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              to="/events"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[48px]"
            >
              <span>Join Green Events</span>
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>
      </FadeIn>
    </div>
  );
};

export default Home;