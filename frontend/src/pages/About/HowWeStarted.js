import React from "react";
import FadeIn from "../../components/animations/FadeIn";
import StaggerWrapper from "../../components/animations/StaggerWrapper";

const HowWeStarted = () => {
  return (
    <StaggerWrapper>
      <div className="min-h-screen bg-gray-50 px-6 md:px-20 py-16">
        
        {/* Header */}
        <FadeIn>
          <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
            How ClimateHub Started
          </h1>
        </FadeIn>

        {/* Intro Section */}
        <FadeIn>
          <div className="max-w-4xl mx-auto text-lg text-gray-800 leading-relaxed mb-14">
            <p className="mb-6">
              ClimateHub began as a simple idea formed during National Service — sparked by shared observations among a few of us that climate change often feels distant to young people, even though our daily actions quietly shape our environmental impact.
            </p>

            <p className="mb-6">
              In our early weeks of BMT and later in our units, we noticed something striking: routines make us efficient, but they also make us unaware. Plastic cups thrown after every drink, food waste piling during lunches, and air conditioning blasting day and night — behaviours no one questioned because they had become “the norm.”
            </p>

            <p>
              These observations led us to a simple but important question: <span className="font-semibold">
              How do we help youth recognise their environmental impact in a way that feels personal, relatable,
              and easy to act upon?</span>
            </p>
          </div>
        </FadeIn>

        {/* Image Section */}
        <FadeIn>
          <div className="max-w-4xl mx-auto mb-16">
            <div className="w-full h-72 rounded-xl shadow-md overflow-hidden">
              <img 
                src="../images/Pangolin.png"
                alt="ClimateHub Early Concept"
                className="w-full h-full object-contain bg-white"
              />
            </div>
          </div>
        </FadeIn>

        {/* Origin Story */}
        <FadeIn>
          <div className="max-w-4xl mx-auto text-lg text-gray-800 leading-relaxed mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Where the Idea Took Shape</h2>
            <p className="mb-6">
              The idea solidified when we realised that while most youths genuinely care about sustainability,
              many don’t know <span className="font-semibold">where to begin.</span> They hear terms like 
              “carbon emissions” or “footprint,” but rarely understand how their daily habits — from transport
              choices to social media usage — add up.
            </p>

            <p className="mb-6">
              We wanted to bridge this awareness gap. Not through heavy lectures or complex science, but through 
              a digital platform that speaks the language of youth — personalised, interactive, and instantly useful.
            </p>

            <p>
              That vision became the foundation of ClimateHub: a centralised space where young users could measure,
              understand, and reduce their carbon footprint using tools built specifically for the Singaporean context.
            </p>
          </div>
        </FadeIn>

        {/* Development Timeline */}
        <FadeIn>
          <div className="max-w-4xl mx-auto text-lg text-gray-800 leading-relaxed mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">ClimateHub's Development Timeline</h2>

            <div className="relative max-w-4xl mx-auto mt-12">

              {/* Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-500 rounded-full"></div>

              <div className="space-y-16">

                {/* 1 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="text-xl font-semibold text-gray-900">Oct 2024</h3>
                    <p className="text-gray-700">Saw the issues with youth lifestyles in Singapore and sought a meaningful way to drive environmental impact.</p>
                  </div>
                  <div className="w-1/2"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                </div>

                {/* 2 */}
                <div className="relative flex items-center">
                  <div className="w-1/2"></div>
                  <div className="w-1/2 pl-8 text-left">
                    <h3 className="text-xl font-semibold text-gray-900">Jan 2025</h3>
                    <p className="text-gray-700">Conceptualised the first prototype of a carbon footprint calculator for Singaporean youth.</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                </div>

                {/* 3 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="text-xl font-semibold text-gray-900">Mar 2025</h3>
                    <p className="text-gray-700">Developed the initial version with NSF feedback and expanded the vision into a full climate‑action platform.</p>
                  </div>
                  <div className="w-1/2"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                </div>

                {/* 4 */}
                <div className="relative flex items-center">
                  <div className="w-1/2"></div>
                  <div className="w-1/2 pl-8 text-left">
                    <h3 className="text-xl font-semibold text-gray-900">May 2025</h3>
                    <p className="text-gray-700">Pitched ClimateHub’s early prototype to MSE.</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                </div>

                {/* 5 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="text-xl font-semibold text-gray-900">Jun 2025</h3>
                    <p className="text-gray-700">Started building the production‑ready carbon calculator and platform core.</p>
                  </div>
                  <div className="w-1/2"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                </div>

                {/* 6 */}
                <div className="relative flex items-center">
                  <div className="w-1/2"></div>
                  <div className="w-1/2 pl-8 text-left">
                    <h3 className="text-xl font-semibold text-gray-900">Jul–Aug 2025</h3>
                    <p className="text-gray-700">Completed major development milestones while being supported under the SG Eco Fund.</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                </div>

                {/* 7 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="text-xl font-semibold text-gray-900">Aug 2025</h3>
                    <p className="text-gray-700">Received approval to pilot ClimateHub inside NS camps.</p>
                  </div>
                  <div className="w-1/2"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                </div>

                {/* 8 */}
                <div className="relative flex items-center">
                  <div className="w-1/2"></div>
                  <div className="w-1/2 pl-8 text-left">
                    <h3 className="text-xl font-semibold text-gray-900">Sep 2025</h3>
                    <p className="text-gray-700">Launched the official ClimateHub Trial in Selarang Camp.</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                </div>

                {/* 9 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="text-xl font-semibold text-gray-900">Nov 2025</h3>
                    <p className="text-gray-700">Analysed results from the first trial and began preparing for multi‑camp expansion.</p>
                  </div>
                  <div className="w-1/2"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </StaggerWrapper>
  );
};

export default HowWeStarted;
