import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import FadeIn from '../components/animations/FadeIn';
import StaggerWrapper from '../components/animations/StaggerWrapper';
import Slider from "react-slick";
import 'animate.css';


const Home = () => {
  // ---- Counter-up animation (easeOut) for stats ----
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const useInViewOnce = (options = { threshold: 0.35, rootMargin: '0px' }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
      const el = ref.current;
      if (!el || inView) return;

      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        options
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [inView, options]);

    return [ref, inView];
  };

  const AnimatedNumber = ({
    value,
    duration = 3000,
    ease = easeOutCubic,
    start = 0,
    format,
    inView
  }) => {
    const [display, setDisplay] = useState(start);

    useEffect(() => {
      if (!inView) return;

      let rafId;
      const from = Number.isFinite(start) ? start : 0;
      const to = Number.isFinite(value) ? value : 0;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = ease(t);
        const current = from + (to - from) * eased;

        // whole-number feel like arcade counters
        setDisplay(Math.round(current));

        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        }
      };

      // reset on trigger so the animation always starts at 0
      setDisplay(from);
      rafId = requestAnimationFrame(tick);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, [inView, value, duration, ease, start]);

    return <>{format ? format(display) : display}</>;
  };
  const features = [
    {
      icon: Calculator,
      title: 'Carbon Footprint Calculator',
      description: 'Calculate your environmental impact with specialized trackers for NSFs and Singaporean youth (school & university). Track emissions from daily activities, transport, and lifestyle choices.',
      href: '/carbon-tracker'
    },
    {
      icon: BookOpen,
      title: 'Education Hub',
      description: 'Learn about Singapore’s climate goals and how Singaporean youth can contribute. Explore policies, initiatives, and practical guides for greener daily choices.',
      href: '/education'
    },
    {
      icon: Calendar,
      title: 'Events Calendar',
      description: 'Join green initiatives across camps, schools, and communities. From cleanups to eco-volunteering, turn everyday life into environmental action.',
      href: '/events'
    },
    {
      icon: Users,
      title: 'Profile',
      description: 'Track progress, earn eco-badges, and compare sustainability goals with friends, schoolmates, and NSF units through challenges and leaderboards.',
      href: '/profile'
    }
  ];

  // Roulette features array (only 3)
  const rouletteFeatures = [
    {
      icon: Calculator,
      title: 'Carbon Footprint Calculator',
      description: 'Calculate your environmental impact with specialized trackers for NSFs and Singaporean youth (school & university). Track emissions from daily activities, transport, and lifestyle choices.',
      href: '/carbon-tracker'
    },
    {
      icon: Calendar,
      title: 'Events Calendar',
      description: 'Join green initiatives across camps, schools, and communities. From cleanups to eco-volunteering, turn everyday life into environmental action.',
      href: '/events'
    },
    {
      icon: BookOpen,
      title: 'Education Hub',
      description: 'Learn about Singapore’s climate goals and how Singaporean youth can contribute. Explore policies, initiatives, and practical guides for greener daily choices.',
      href: '/education'
    }
  ];
  // RouletteCarousel component
  const RouletteCarousel = () => {
    const sliderRef = React.useRef(null);
    const [currentIndex, setCurrentIndex] = React.useState(1);
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '0px',
      arrows: false,
      initialSlide: 1,
      beforeChange: (_, next) => setCurrentIndex(next),
      focusOnSelect: false,
      accessibility: false,
      pauseOnFocus: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            centerMode: true,
            centerPadding: '60px',
          }
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            centerMode: true,
            centerPadding: '24px',
          }
        }
      ]
    };
    return (
      <Slider ref={sliderRef} {...settings} className="roulette-carousel">
        {rouletteFeatures.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              className="roulette-slide"
              key={idx}
              onClick={() => sliderRef.current?.slickGoTo(idx)}
            >
              <div className="roulette-card bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 min-h-[220px] flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 flex-grow">
                  {feature.description}
                </p>
                <Link
                  to={feature.href}
                  className="flex items-center text-green-700 text-sm font-medium mt-auto hover:text-green-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </Slider>
    );
  };

  const stats = [
    { label: 'Carbon Footprints Tracked', value: 140, suffix: '+', icon: Calculator },
    { label: 'Eco-Events Hosted', value: 3, suffix: '', icon: Calendar },
    { label: 'Active Users', value: 50, suffix: '', icon: Users },
    { label: 'CO₂ Saved (tonnes)', value: 200, suffix: '+', icon: Leaf }
  ];

  // Trigger stats counter animation once when the stats section enters view
  const [statsRef, statsInView] = useInViewOnce({ threshold: 0.35 });

  const benefits = [
    'Track your environmental impact',
    'Learn about local sustainability initiatives',
    'Join local environmental initiatives',
    "Contribute to Singapore's green goals"
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
      <Slider {...settings} className="relative custom-carousel hero-carousel">
        {heroImages.map((src, index) => (
          <div key={index} className="relative hero-carousel-slide">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover hero-carousel-img"
            />
            {/* Dark overlay so text is readable */}
            <div className="absolute inset-0 bg-black bg-opacity-70 hero-carousel-overlay"></div>
          </div>
        ))}
      </Slider>
    );
  };

  return (
    <>
      <style>{`
         /* HERO carousel should fit within viewport minus navbar so dots are visible */
         :root {
           --navbar-height: 72px; /* adjust if you change navbar height */
         }

         .hero-carousel,
         .hero-carousel .slick-list,
         .hero-carousel .slick-track {
           height: calc(100vh - var(--navbar-height));
         }

         .hero-carousel-slide {
           height: calc(100vh - var(--navbar-height));
         }

         .hero-carousel-img {
           height: 100%;
         }

         /* The text overlay container should match the reduced hero height too */
         .hero-overlay-container {
           height: calc(100vh - var(--navbar-height));
         }

         /* On small screens, navbar is usually taller */
         @media (max-width: 640px) {
           :root {
             --navbar-height: 88px;
           }
         }
         /* Roulette carousel */
         .roulette-carousel .slick-dots {
           position: relative;
           bottom: 0;
           margin-top: 16px;
         }
         .roulette-carousel .slick-dots li button:before {
           font-size: 10px;
           opacity: 0.35;
           color: #16a34a; /* green-600 */
         }
         .roulette-carousel .slick-dots li.slick-active button:before {
           opacity: 1;
           color: #16a34a;
         }
         .roulette-slide {
           padding: 10px;
         }
         .roulette-card {
           opacity: 0.4;
           transform: scale(0.92);
           background: #ffffff;
           transition: opacity 250ms ease, transform 250ms ease, box-shadow 250ms ease, background-color 250ms ease;
         }

         /* Hover preview: make hovered card fully visible + pop + light green */
         .roulette-slide:hover .roulette-card {
           opacity: 1;
           transform: scale(1);
           background-color: #bbf7d0; /* tailwind green-200 */
           box-shadow: 0 20px 50px rgba(0,0,0,0.15);
         }

         /* Do NOT keep the centered slide popped — hover should be the only trigger */
         .roulette-carousel .slick-center .roulette-card {
           opacity: 0.4;
           transform: scale(0.92);
           box-shadow: none;
           background: #ffffff;
         }

         /* If the centered slide is hovered, apply the same hover styles */
         .roulette-carousel .slick-center:hover .roulette-card {
           opacity: 1;
           transform: scale(1);
           background-color: #bbf7d0; /* tailwind green-200 */
           box-shadow: 0 20px 50px rgba(0,0,0,0.15);
         }
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
      <div>
        {/* Hero Section */}
        <section className="relative">
          <FadeIn>
            <HeroCarousel />
            <div className="absolute inset-0 hero-overlay-container flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
              <FadeIn delay={0.6}>
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center relative overflow-hidden bg-transparent">
                    <img
                      src="/images/apple-touch-icon.png"
                      alt="ClimateHub leaf logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </FadeIn>
              
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 animate__animated animate__fadeInDown">
                  ClimateHub
                </h1>
              
              <FadeIn delay={1.0}>
                <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold text-green-200 mb-3 sm:mb-4 px-2">
                  Environmental Action, Made Easy
                </h2>
              </FadeIn>
              <FadeIn delay={1.2}>
                <p className="text-sm sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2">
                Understand how everyday choices affect the environment, and what you can do to reduce your impact.
                </p>
              </FadeIn>
              <FadeIn delay={1.4}>
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
              </FadeIn>
            </div>
          </FadeIn>
        </section>

        {/* Roulette Feature Section */}
        <section className="py-12 sm:py-16 bg-white border-t border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Everything you need to start your own action journey
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Built for Singaporean youth — NSFs, school and university students — to track impact, learn fast, and take action.
              </p>
            </div>

            <div className="roulette-carousel">
              <RouletteCarousel />
            </div>
          </div>
        </section>


        {/* Partners & Stats Combined Section */}
        <section className="py-16 bg-green-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — PARTNERS WITH TITLE */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Recognised & Supported By
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                ClimateHub is a proud recipient of the SG Eco Fund and collaborates with leading national and international sustainability organisations.
              </p>

              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                {partners.map((partner, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="h-10 sm:h-12 md:h-14 object-contain transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — STATISTICS GRID */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Making a Difference Together
              </h2>

              <div ref={statsRef} className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center mb-3">
                      <stat.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      <AnimatedNumber
                        value={stat.value}
                        duration={3000}
                        inView={statsInView}
                        format={(n) => `${n}${stat.suffix || ''}`}
                      />
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              
            </div>

          </div>
        </section>

        {/* Features Section */}

        {/* Benefits Section */}
        <section className="py-10 sm:py-12 bg-slate-50 border-t border-slate-100">
          <FadeIn delay={0.4}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Centered title like the roulette section */}
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Why Choose ClimateHub?
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                  Whether you're serving National Service or navigating student life, you can make a difference.
                  ClimateHub helps you understand and reduce your environmental impact in meaningful ways.
                </p>
              </div>

              {/* Two-column: bullets left, pangolin animation right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
                {/* LEFT — POINTERS */}
                <div className="lg:pl-6">
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3 py-1">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT — PANGOLIN IMAGE */}
                <div className="w-full flex items-center justify-center lg:pr-6">
                  <img
                    src="/images/Pangolin-Laptop.png"
                    alt="Pangolin using ClimateHub to track carbon footprint"
                    className="max-w-full h-auto max-h-[260px] sm:max-h-[300px] object-contain"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-slate-100">
          <FadeIn delay={0.5}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Build Singapore's Green Future?
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-green-100 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto px-4">
                  Join fellow Singaporeans in making every day count for the environment. 
                  Start your eco-mission today and be part of the movement towards sustainability.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                  <Link
                    to="/carbon-tracker"
                    className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[48px]"
                  >
                    <span>Calculate Your Footprint</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <Link
                    to="/events"
                    className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[48px]"
                  >
                    <span>Explore Events</span>
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </>
  );
};

export default Home;