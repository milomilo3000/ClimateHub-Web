import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Leaf, Users, TrendingUp, ArrowRight } from 'lucide-react';
import FadeIn from '../components/animations/FadeIn';
import StaggerWrapper from '../components/animations/StaggerWrapper';

const CarbonCalculatorHub = () => {
  return (
    <StaggerWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full">
          
          {/* Header / Hero Section */}
          <FadeIn duration={2}>
          <div className="">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-full px-4 sm:px-6 py-12 sm:py-16 md:px-12 md:py-20 lg:px-28 lg:py-28 shadow-lg overflow-hidden">
              <div className="max-w-7xl mx-auto w-full box-border">
                <div className="grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-center">
                {/* Hero copy */}
                <div className="min-w-0">
                  <p className="inline-flex items-center px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-white/15 text-green-50 border border-white/20">
                    Track · Reduce · Repeat
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 leading-tight break-words">
                    Carbon Footprint Calculator
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-green-50/90 max-w-xl mb-4 sm:mb-6 leading-relaxed break-words">
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
                      <span>Youth-focused weekly quiz covering diet, transport, home, devices, and shopping.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                      <span>AI-powered recommendations that turn numbers into practical next steps.</span>
                    </li>
                  </ul>

                  <div className="flex flex-wrap gap-4 items-center">
                    <Link
                      to="/carbon-tracker/youth"
                      className="inline-flex items-center space-x-2 bg-white text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-full text-sm md:text-base transition-colors duration-200 shadow-md"
                    >
                      <Calculator className="w-5 h-5" />
                      <span>Start Youth Calculator</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-xs md:text-sm text-green-50/80">
                      Takes about 5–7 minutes · Works best on Chrome
                    </span>
                  </div>
                </div>

                {/* Animated calculator card */}
                <div className="relative w-full max-w-sm mx-auto md:ml-auto md:mr-0 min-w-0">
                  <div className="relative bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 w-full max-w-sm border border-slate-800 flex flex-col gap-3 sm:gap-4 text-white">
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
                          <span className="text-gray-500">Diet</span>
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
                          <span className="text-gray-500">Home &amp; shopping</span>
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

                    <Link
                      to="/carbon-tracker/youth"
                      className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-500"
                    >
                      <Calculator className="h-4 w-4" />
                      Open youth calculator
                      <ArrowRight className="h-4 w-4" />
                    </Link>

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
        <div className="w-full bg-white/70 py-10 sm:py-16 overflow-hidden">
          <FadeIn delay={0.2} duration={2}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full box-border">
              <div id="section-what" className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10 border border-green-50 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6 gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mr-0 sm:mr-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">What is a Carbon Footprint?</h2>
            </div>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 break-words">
              Your carbon footprint is the total amount of greenhouse gases (including carbon dioxide and methane) 
              generated by your actions. Understanding your carbon footprint is the first step toward reducing 
              your environmental impact and contributing to Singapore's net-zero 2050 goal.
            </p>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">
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
                  to="/carbon-tracker/youth"
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

