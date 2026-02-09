import React from "react";
import FadeIn from "../../components/animations/FadeIn";
import StaggerWrapper from "../../components/animations/StaggerWrapper";
import { FaLinkedin } from "react-icons/fa";

const Team = () => {
  return (
    <StaggerWrapper>
      <div className="min-h-screen bg-white py-16">
        {/* Page Header */}
        <div className="max-w-6xl mx-auto px-6 md:px-20">
          <FadeIn>
            <h1 className="text-5xl font-extrabold text-center text-black mb-10">
              The Team Behind ClimateHub
            </h1>
          </FadeIn>
        </div>

        {/* Full-width pastel green band with team cards */}
        <FadeIn>
          <section className="w-full py-20 bg-[#2F6B4F]">
            <div className="max-w-6xl mx-auto px-6 md:px-20">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Milan Card */}
                <div className="relative rounded-xl overflow-hidden shadow-md">
                  <img
                    src="/images/About-Img2.jpg"
                    alt="Milan Nathani"
                    className="w-full h-[480px] object-cover bg-gray-100"
                  />
                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      Milan Nathani
                    </h3>
                    <p className="text-white/90 font-medium">Co-Founder &amp; Lead Developer</p>
                    <a
                      href="https://www.linkedin.com/in/milan-nathani-32b235111/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-white hover:text-white/80"
                    >
                      <FaLinkedin size={22} />
                    </a>
                  </div>
                </div>

                {/* Dylan Card */}
                <div className="relative rounded-xl overflow-hidden shadow-md">
                  <img
                    src="/images/Dylan_About-Us.jpg"
                    alt="Dylan Seng"
                    className="w-full h-[480px] object-cover bg-gray-100"
                  />
                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      Dylan Seng
                    </h3>
                    <p className="text-white/90 font-medium">Marketing Lead</p>
                    <a
                      href="https://www.linkedin.com/in/dylan-s-797905303/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-white hover:text-white/80"
                    >
                      <FaLinkedin size={22} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Special Thanks */}
        <FadeIn>
          <section className="w-full py-20 bg-[#F7FAF8]">
            <div className="max-w-6xl mx-auto px-6 md:px-20">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 inline-block relative isolate">
                  <span className="relative inline-block px-6 py-3">
                    {/* Bush texture highlight (image) */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] z-0"
                    >
                      <img
                        src="/images/Bush-Texture.jpeg"
                        alt=""
                        className="w-full h-auto object-contain"
                      />
                    </span>

                    {/* Text above the highlight */}
                    <span className="relative z-10 text-gray-900">Special Thanks To</span>
                  </span>
                </h2>
              </div>

              {/* Simple placeholder rows (swap to real names later) */}
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="h-14 rounded-xl bg-white shadow-sm" />
                <div className="h-14 rounded-xl bg-white shadow-sm" />
                <div className="h-14 rounded-xl bg-white shadow-sm" />
              </div>
            </div>
          </section>
        </FadeIn>
      </div>
    </StaggerWrapper>
  );
};

export default Team;
