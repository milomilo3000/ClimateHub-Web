import React from "react";
import StaggerWrapper from "../../components/animations/StaggerWrapper";
import FadeIn from "../../components/animations/FadeIn";

const Mission = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <StaggerWrapper>
        {/* Page Title */}
        <FadeIn>
          <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-12">
            Our Mission
          </h1>
        </FadeIn>

        {/* Mission Statement */}
        <FadeIn>
          <div className="max-w-4xl mx-auto text-lg text-gray-800 leading-relaxed mb-16">
            <p className="mb-6">
              ClimateHub was created with a simple belief: that sustainability should be 
              <span className="font-semibold"> understandable, accessible, and actionable</span> for every young person in Singapore.
              What began as a small initiative during National Service has evolved into a 
              platform designed to help youth recognise their climate impact and turn awareness 
              into everyday action.
            </p>

            <p className="mb-6">
              Our mission is to empower individuals—starting with NSFs and expanding to all Singaporean youth—by giving 
              them the tools to understand their carbon footprint, learn about environmental issues in a meaningful way,
              and take small steps that create long‑term change.
            </p>
          </div>
        </FadeIn>

        {/* Vision Section */}
        <FadeIn>
          <div className="max-w-4xl mx-auto text-lg text-gray-800 leading-relaxed mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>

            <p className="mb-6">
              We envision ClimateHub as Singapore’s leading youth‑focused climate action platform —
              a place where young people can learn, reflect, and take meaningful steps toward a 
              low‑carbon lifestyle. Our long‑term goal is to shape a generation that understands 
              its environmental influence and feels empowered to act on it.
            </p>

            <p>
              Whether someone is just beginning their sustainability journey or actively 
              looking for ways to reduce their impact, ClimateHub aims to meet them where they 
              are and guide them forward.
            </p>
          </div>
        </FadeIn>

        {/* Who It Is For */}
        <FadeIn>
          <div className="max-w-4xl mx-auto text-lg text-gray-800 leading-relaxed mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Serve</h2>

            <ul className="list-disc ml-6 space-y-4">
              <li>
                <strong>National Servicemen (NSFs):</strong> The first group to experience ClimateHub through 
                unit‑based trials, carbon footprint challenges, and information sessions.
              </li>
              <li>
                <strong>Singaporean Youth:</strong> Secondary school, polytechnic, ITE, and JC students who want 
                simple, practical ways to understand their environmental impact.
              </li>
              <li>
                <strong>Young Adults:</strong> Individuals beginning to form habits around transport, food,
                consumption, and lifestyle choices.
              </li>
            </ul>
          </div>
        </FadeIn>

        {/* How We Reach Our Goals */}
        <FadeIn>
          <div className="max-w-4xl mx-auto text-lg text-gray-800 leading-relaxed mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How We’re Reaching Our Goals</h2>

            <ul className="list-disc ml-6 space-y-4">

              <li>
                <strong>Personalised Carbon Footprint Tracking:</strong> Using Singapore‑specific emission data 
                to help users understand their real impact with accuracy and relevance.
              </li>

              <li>
                <strong>AI‑Powered Education Tools:</strong> Including our sustainability chatbot and curated 
                newsfeeds that help users learn about climate issues in a digestible, engaging way.
              </li>

              <li>
                <strong>Real‑World Pilots:</strong> Running structured campaigns and monthly tracking cycles in 
                SAF camps, with measurable results such as a <strong>21.4% average reduction</strong> in user footprints 
                during the Selarang trial.
              </li>

              <li>
                <strong>Community Partnerships:</strong> Working toward collaborations with Youth Corps Singapore, 
                sustainability organisations, and local schools to broaden outreach.
              </li>

              <li>
                <strong>Future Gamification:</strong> Introducing XP systems, leaderboards, and eco‑challenges 
                that turn climate action into a rewarding, habit‑forming experience.
              </li>
            </ul>
          </div>
        </FadeIn>

      </StaggerWrapper>
    </div>
  );
};

export default Mission;
