import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, Leaf, Users, TrendingUp, ArrowRight } from 'lucide-react';
import FadeIn from '../components/animations/FadeIn';
import StaggerWrapper from '../components/animations/StaggerWrapper';

const CarbonCalculatorHub = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <StaggerWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full">
          
          {/* Header / Hero Section */}
          <FadeIn duration={2}>
          <div className="">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-full px-6 py-20 md:px-28 md:py-28 shadow-lg">
              <div className="max-w-7xl mx-auto">
                <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-center">
                {/* Hero copy */}
                <div>
                  <p className="inline-flex items-center px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-white/15 text-green-50 border border-white/20">
                    Track · Reduce · Repeat
                  </p>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Carbon Footprint Calculator
                  </h1>
                  <p className="text-base md:text-lg text-green-50/90 max-w-xl mb-6 leading-relaxed">
                    Calculate your weekly carbon emissions, understand where they come from,
                    and unlock personalised actions to shrink your footprint—designed for
                    Singapore&apos;s context.
                  </p>

                  <ul className="space-y-2 text-sm md:text-base text-green-50/90 mb-8">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                      <span>Built on Singapore-based emission factors and real lifestyle data.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                      <span>Separate trackers for NSFs and youth, tailored to daily routines.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                      <span>AI-powered recommendations that turn numbers into practical next steps.</span>
                    </li>
                  </ul>

                  <div className="flex flex-wrap gap-4 items-center">
                    <Link
                      to="/carbon-tracker/nsf"
                      className="inline-flex items-center space-x-2 bg-white text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-full text-sm md:text-base transition-colors duration-200 shadow-md"
                    >
                      <Calculator className="w-5 h-5" />
                      <span>Start NSFs Tracker</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-xs md:text-sm text-green-50/80">
                      Takes about 5–7 minutes · Works best on Chrome
                    </span>
                  </div>
                </div>

                {/* Animated calculator card */}
                <div className="relative">
                  <div className="relative bg-slate-900 rounded-3xl shadow-2xl p-5 md:p-6 max-w-sm ml-auto border border-slate-800 flex flex-col gap-4 text-white">
                    {/* Calculator screen */}
                    <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 text-gray-900">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md animate-bounce">
                            <Calculator className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                              Weekly footprint
                            </p>
                            <p className="text-lg font-semibold text-gray-900 leading-tight">
                              23.4 kg CO₂e
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-[10px] font-semibold text-green-700">
                          -18% vs. last week
                        </span>
                      </div>

                      <div className="space-y-2 mb-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">Camp / School</span>
                          <span className="font-semibold text-gray-800">8.1 kg</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full w-2/3 rounded-full bg-green-500" />
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">Transport</span>
                          <span className="font-semibold text-gray-800">5.6 kg</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full w-1/2 rounded-full bg-emerald-500" />
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">Food &amp; lifestyle</span>
                          <span className="font-semibold text-gray-800">9.7 kg</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full w-3/4 rounded-full bg-lime-500" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span>Based on last 7 days of activity</span>
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span>Low impact</span>
                        </span>
                      </div>
                    </div>

                    {/* Calculator keypad */}
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => scrollToSection('section-what')}
                        className="py-2.5 rounded-lg bg-white text-[11px] font-semibold text-slate-900 flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                      >
                        NSF
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('section-what')}
                        className="py-2.5 rounded-lg bg-white text-[11px] font-semibold text-slate-900 flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                      >
                        Youth
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('section-what')}
                        className="py-2.5 rounded-lg bg-white text-[11px] font-semibold text-slate-900 flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                      >
                        Method
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('section-what')}
                        className="py-2.5 rounded-lg bg-white text-[11px] font-semibold text-slate-900 flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                      >
                        Basics
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('section-what')}
                        className="py-2.5 rounded-lg bg-white text-[11px] font-semibold text-slate-900 flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                      >
                        Trackers
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('section-what')}
                        className="py-2.5 rounded-lg bg-white text-[11px] font-semibold text-slate-900 flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                      >
                        Action
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('section-what')}
                        className="py-2.5 rounded-lg bg-white text-[11px] font-semibold text-slate-900 flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                      >
                        Camp
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('section-what')}
                        className="py-2.5 rounded-lg bg-white text-[11px] font-semibold text-slate-900 flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                      >
                        Transport
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToSection('section-calculators')}
                        className="py-2.5 rounded-lg bg-orange-500 text-[11px] font-semibold text-white flex items-center justify-center shadow-sm border border-orange-600 hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                      >
                        Calculate
                      </button>
                    </div>

                    {/* subtle floating glow */}
                    <div className="absolute -z-10 inset-x-8 -bottom-6 h-10 bg-green-500/20 blur-xl rounded-full" />
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* What is it Section */}
        <div className="w-full bg-white/70 py-16">
          <FadeIn delay={0.2} duration={2}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div id="section-what" className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-10 border border-green-50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">What is a Carbon Footprint?</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Your carbon footprint is the total amount of greenhouse gases (including carbon dioxide and methane) 
              generated by your actions. Understanding your carbon footprint is the first step toward reducing 
              your environmental impact and contributing to Singapore's net-zero 2050 goal.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our calculators help you measure your weekly carbon emissions based on your lifestyle choices, 
              from daily activities to consumption patterns. You'll receive personalized insights and 
              recommendations to help you live more sustainably.
            </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Methodology Section */}
        <div className="w-full bg-green-50/60 py-16">
          <FadeIn delay={0.3} duration={2}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div id="section-methodology" className="bg-green-50 rounded-2xl shadow-lg p-8 border border-green-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Methodology</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Our carbon footprint calculators use scientifically validated emission factors 
              and are designed to provide accurate estimates based on Singapore's context.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="relative border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden">
                <div className="absolute inset-0 rounded-xl bg-green-100 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Gather Singapore-based emission factors
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We use emission factors specific to Singapore's energy grid, 
                  transport systems, and local consumption patterns to ensure accuracy.
                </p>
              </div>

              {/* Card 2 */}
              <div className="relative border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden">
                <div className="absolute inset-0 rounded-xl bg-green-100 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Curated questions based on certain populations
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our calculators feature tailored questions designed for specific 
                  demographics to capture the most relevant lifestyle factors.
                </p>
              </div>

              {/* Card 3 */}
              <div className="relative border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden">
                <div className="absolute inset-0 rounded-xl bg-green-100 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Uses custom-based AI model for recommender function
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI-powered system provides personalized recommendations 
                  based on your unique carbon footprint profile.
                </p>
              </div>
            </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Calculator Options */}
        <div className="w-full bg-gray-50 py-16">
          <FadeIn delay={0.4} duration={2}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div id="section-calculators">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Choose Your Calculator
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* NSFs Carbon Footprint Tracker - ACTIVE */}
              <Link 
                to="/carbon-tracker/nsf"
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-green-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center">
                    <Calculator className="w-7 h-7 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  NSFs Carbon Footprint Tracker
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Designed specifically for National Service Full-time servicemen. 
                  Calculate your carbon footprint based on camp life, transport, and daily activities.
                </p>
                <div className="inline-flex items-center text-green-600 font-semibold">
                  <span>Start Calculating</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </Link>

              {/* Youth Carbon Footprint Tracker - COMING SOON */}
              <div id="youth-calculator" className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-8 blur-sm opacity-60">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Youth Carbon Footprint Tracker
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Tailored for young Singaporeans. Track your environmental impact 
                    from school, social activities, and lifestyle choices.
                  </p>
                  <div className="inline-flex items-center text-blue-600 font-semibold">
                    <span>Start Calculating</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
                
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm border-2 border-blue-500">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                    <p className="text-gray-600 mb-4">
                      The Youth Carbon Footprint Tracker is currently under development. 
                      We're working hard to bring you this feature soon!
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                      🚀 In Development
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Call to Action */}
        <div className="w-full bg-green-700 py-20">
          <FadeIn delay={0.5} duration={2}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div id="section-cta" className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Start tracking your carbon footprint today and join thousands of Singaporeans 
              working towards a sustainable future.
            </p>
                <Link
                  to="/carbon-tracker/nsf"
                  className="inline-flex items-center space-x-2 bg-white text-green-600 hover:bg-gray-100 
                           font-semibold py-4 px-8 rounded-full text-lg transition-colors duration-200 shadow-lg"
                >
                  <Calculator className="w-6 h-6" />
                  <span>Calculate Your Footprint</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
        </div>
      </div>
    </StaggerWrapper>
  );
};

export default CarbonCalculatorHub;

