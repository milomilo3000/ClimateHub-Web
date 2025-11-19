import React from "react";
import FadeIn from "../../components/animations/FadeIn";
import StaggerWrapper from "../../components/animations/StaggerWrapper";

const Team = () => {
  return (
    <StaggerWrapper><div className="min-h-screen bg-gray-50 px-6 md:px-20 py-16">
      {/* Page Header */}
      <FadeIn>
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
          The Team Behind ClimateHub
        </h1>
      </FadeIn>

      <FadeIn>
        <section className="w-full bg-green-50 py-20 border-y border-green-100">
          <div className="max-w-5xl mx-auto px-6 md:px-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Meet the Founder
            </h2>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Founder Image Placeholder */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/About-Img1.jpg"
                  alt="Founder Main"
                  className="w-64 h-64 object-cover rounded-lg shadow-md mb-4"
                />
                <img
                  src="/images/About-Img2.jpg"
                  alt="Founder Secondary"
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Founder Description */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Milan Nathani</h3>
                <p className="text-green-600 font-semibold mb-3">
                  Founder & Executive Lead
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Milan Nathani is the founder and executive lead of ClimateHub—
                  responsible for strategy, product direction, and overall project
                  development. He drives platform design, user experience,
                  sustainability frameworks, and technical build decisions.
                  ClimateHub was conceptualised during his National Service after
                  witnessing firsthand how everyday decisions contribute quietly but
                  significantly to emissions. His goal is to make climate action
                  accessible, actionable, and engaging for youth.
                </p>

                <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-md italic text-gray-800">
                  “Your future depends on the actions you take today. I believe
                  every young person has the power to shape a more sustainable
                  tomorrow — ClimateHub is our way to unlock that potential.”
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="w-full bg-blue-50 py-20 border-y border-blue-100">
          <div className="max-w-5xl mx-auto px-6 md:px-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Our Team
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Dylan Card */}
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-600">Image</span>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900">
                  Dylan Seng
                </h3>
                <p className="text-center text-green-600 font-medium mb-3">
                  Outreach, Marketing & Communications
                </p>
                <p className="text-gray-700 leading-relaxed text-center">
                  Leads ClimateHub’s outreach, social media, and publicity
                  campaigns. Represents the project through presentations, community
                  engagement, and youth-facing initiatives. Focuses on growing
                  awareness and making sustainability relatable and engaging for
                  youth.
                </p>
              </div>

              {/* Maahir Card */}
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-600">Image</span>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900">
                  Maahir Bhatia
                </h3>
                <p className="text-center text-green-600 font-medium mb-3">
                  Partnerships & Strategy
                </p>
                <p className="text-gray-700 leading-relaxed text-center">
                  Contributed to pitching ClimateHub to the Ministry of
                  Sustainability and Environment during its founding phase. Advises
                  on partnerships, strategic positioning, and collaboration pathways.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-6 px-8 rounded-xl shadow-md inline-block text-lg font-semibold">
                We’re a youth-led team committed to turning awareness into action
                and making sustainability accessible to everyone.
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </div></StaggerWrapper>
  );
};

export default Team;