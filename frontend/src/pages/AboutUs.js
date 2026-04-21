import React from 'react';
import FadeIn from "../components/animations/FadeIn";
import StaggerWrapper from "../components/animations/StaggerWrapper";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const majorTimeline = [
    {
      date: "Jan 2025",
      event: "ClimateHub conceptualised",
      metric: "Prototype built",
      description:
        "A Singapore-based carbon footprint calculator prototype created during National Service — designed for youth habits, not generic assumptions.",
    },
    {
      date: "Jul 2025",
      event: "SG Eco Fund support secured",
      metric: "MSE Sprout funded",
      description:
        "Awarded funding under MSE’s SG Eco Fund (Sprout) to build ClimateHub into a full platform with tracking, nudges, and action systems.",
    },
    {
      date: "Sep 2025",
      event: "First NS camp trial launched",
      metric: "140+ NSFs",
      description:
        "Launched the first official trial in Selarang Camp to test whether tracking + behavioural design can shift daily choices.",
    },
    {
      date: "Nov 2025",
      event: "Preparing for public expansion",
      metric: "Partnership rollout",
      description:
        "Built on early trial outcomes and shifted focus toward scaling beyond NS — partnering with local NGOs, schools, and youth organisations to reach the wider public.",
    },
  ];

  const impactTiles = [
    { value: "140+", label: "NSFs participated" },
    { value: "21.4%", label: "Avg footprint reduction" },
    { value: "40+", label: "Active users onboarded" },
    { value: "3", label: "Key habit categories improved" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <StaggerWrapper>
        {/* Header / Hero */}
        <FadeIn>
          <div className="relative overflow bg-gradient-to-b from-emerald-50 via-green-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full box-border">
              <div className="text-center">
                <p className="text-sm font-semibold tracking-widest text-green-700 uppercase mb-3">
                  About ClimateHub
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 break-words">
                  Singapore’s youth climate action platform.
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-1">
                  Built for NSFs and students — track your footprint, build habits, and join real challenges designed for Singapore.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/carbon-tracker"
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
                    className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-green-700 transition-colors"
                  >
                    Try the Calculator
                  </Link>
                  <a
                    href="#impact"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-gray-900 font-semibold border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    See Our Impact
                  </a>
                </div>

              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full opacity-25"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full opacity-20"></div>
            </div>
          </div>
        </FadeIn>

        {/* Our Story Section */}
        <FadeIn delay={0.1}>
          <div className="w-full bg-gradient-to-b from-green-100 to-emerald-50 py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full box-border">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 sm:mb-10 break-words">
                Our Story
              </h2>
              <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
                <p className="text-base sm:text-lg leading-relaxed text-gray-800 mb-4 break-words">
                  ClimateHub began as a simple idea formed during National Service — sparked by shared observations that climate change often feels distant to young people, even though our daily actions quietly shape our environmental impact.
                </p>
                <p className="text-base sm:text-lg leading-relaxed text-gray-800 break-words">
                  What started as an NSF-camp initiative has grown into a national youth-driven movement to help every young person track, understand, and reduce their carbon footprint.
                </p>
              </div>

              {/* Timeline */}
              <div className="mt-8 sm:mt-10 max-w-5xl mx-auto">
                <div className="relative pl-5 sm:pl-6">
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200" />
                  <div className="space-y-6">
                    {majorTimeline.map((item, index) => (
                      <div key={index} className="relative">
                        <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-green-600 ring-4 ring-green-100" />
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-green-700">{item.date}</p>
                              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 break-words">{item.event}</h3>
                            </div>
                            <span className="inline-flex self-start md:self-auto items-center rounded-full bg-gray-50 text-gray-900 border border-gray-200 px-3 py-1 text-sm font-semibold">
                              {item.metric}
                            </span>
                          </div>
                          <p className="mt-3 text-gray-700 leading-relaxed text-sm sm:text-base break-words">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Our Mission Section */}
        <FadeIn delay={0.15}>
          <div className="w-full bg-white py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full box-border">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 sm:mb-10 break-words">
                Our Mission
              </h2>
              <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-stretch">
                {/* Visual */}
                <div className="w-full h-full">
                  <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
                    <img
                      src="/images/Climate_Hub_2.png"
                      alt="ClimateHub pangolin riding a green energy wave"
                      className="w-full h-full object-contain max-h-[280px] sm:max-h-[380px] md:max-h-[520px]"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<div class="text-center p-8"><div class="text-gray-400 text-lg mb-2">🌿</div><p class="text-gray-500">Platform Preview</p></div>';
                      }}
                    />
                  </div>
                </div>

                {/* Mission + pillars */}
                <div className="w-full">
                  <p className="text-base sm:text-lg text-gray-800 leading-relaxed break-words">
                    ClimateHub turns climate awareness into action — by making personal footprint tracking simple, habit change measurable, and participation social.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm min-w-0">
                      <p className="text-xs font-semibold tracking-widest uppercase text-green-700">Measure</p>
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mt-1 break-words">Track what matters in Singapore</h3>
                      <p className="text-gray-700 mt-2 text-sm sm:text-base break-words">Singapore-based assumptions, weekly summaries, and clear drivers — food, transport, and electricity.</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm min-w-0">
                      <p className="text-xs font-semibold tracking-widest uppercase text-green-700">Nudge</p>
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mt-1 break-words">Build habits that stick</h3>
                      <p className="text-gray-700 mt-2 text-sm sm:text-base break-words">Behavioural design, challenges, and simple next steps — so change feels doable, not preachy.</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm min-w-0">
                      <p className="text-xs font-semibold tracking-widest uppercase text-green-700">Mobilise</p>
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mt-1 break-words">Turn action into community</h3>
                      <p className="text-gray-700 mt-2 text-sm sm:text-base break-words">Camp / school missions, events, and team-based nudges to make progress visible and shared.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>


        {/* Meet the Team Section */}
        <FadeIn delay={0.2}>
          <section className="w-full bg-gradient-to-r from-emerald-700 to-green-600 py-10 sm:py-14 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16 w-full box-border">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-white mb-6 sm:mb-8 break-words px-2">
                Meet the Team
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

              <div className="relative rounded-2xl overflow-hidden shadow-md min-w-0">
                  <img
                    src="/images/Edric_Image.jpeg"
                    alt="Edric Voon Ho"
                    className="w-full h-[260px] sm:h-[320px] md:h-[420px] object-cover object-top bg-gray-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight break-words">Edric Voon Ho</h3>
                    <p className="text-white/90 font-semibold">Design Lead</p>
                    <a
                      href="https://www.linkedin.com/in/edric-voon-671b00210/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-3 text-white hover:text-white/80"
                      aria-label="Edric Voon Ho LinkedIn"
                    >
                      <FaLinkedin size={22} />
                    </a>
                  </div>
                </div>
                {/* Milan Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="/images/About-Img2.jpg"
                    alt="Milan Nathani"
                    className="w-full h-[260px] sm:h-[320px] md:h-[420px] object-contain sm:object-cover bg-gray-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight break-words">Milan Nathani</h3>
                    <p className="text-white/90 font-semibold">Founder &amp; Lead Developer</p>
                    <a
                      href="https://www.linkedin.com/in/milan-nathani-32b235111/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-3 text-white hover:text-white/80"
                      aria-label="Milan Nathani LinkedIn"
                    >
                      <FaLinkedin size={22} />
                    </a>
                  </div>
                </div>

                {/* Dylan Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="/images/Dylan_About-Us.jpg"
                    alt="Dylan Seng"
                    className="w-full h-[260px] sm:h-[320px] md:h-[420px] object-cover bg-gray-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight break-words">Dylan Seng</h3>
                    <p className="text-white/90 font-semibold">Marketing Lead</p>
                    <a
                      href="https://www.linkedin.com/in/dylan-s-797905303/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-3 text-white hover:text-white/80"
                      aria-label="Dylan Seng LinkedIn"
                    >
                      <FaLinkedin size={22} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Impact So Far Section */}
        <FadeIn delay={0.25}>
          <div id="impact" className="w-full bg-gradient-to-b from-emerald-50 to-green-100 py-10 sm:py-14 overflow-hidden">
            <div className="max-w-5xl mx-auto px-3 sm:px-6 w-full box-border">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-2 sm:mb-4 break-words">
                Impact So Far
              </h2>
              <p className="text-center text-gray-600 mb-6 sm:mb-12 text-sm sm:text-lg max-w-2xl mx-auto px-2">
                Real results from our first NS camp trial
              </p>

              {/* Stat tiles */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {impactTiles.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm min-h-[118px] sm:min-h-[140px] flex flex-col justify-center"
                  >
                    <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-none">{t.value}</p>
                    <p className="mt-2 text-sm sm:text-base text-gray-700 font-semibold leading-snug">{t.label}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </FadeIn>

        {/* Contact Us Section */}
        <FadeIn delay={0.3}>
          <div className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 py-12 sm:py-20 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center w-full box-border">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 break-words">
                Contact Us!
              </h2>
              <p className="text-base sm:text-xl text-green-50 mb-8 sm:mb-12 leading-relaxed max-w-2xl mx-auto px-2 break-words">
                Whether you're a student, youth group, school, organisation, or partner keen to collaborate, 
                we'd love to hear from you. ClimateHub is built for the community — and we're always excited 
                to connect with those who want to drive climate action.
              </p>

              <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 max-w-2xl mx-auto w-full box-border">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 text-left">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📩</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Email</p>
                      <p className="text-lg font-bold text-gray-900">climatehub.sg@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-left">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Partnerships & Collaborations</p>
                      <p className="text-gray-700 leading-relaxed">
                        Reach out to us for school talks, NS briefings, sustainability events, or collaboration opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    We typically respond within 2-3 business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </StaggerWrapper>
    </div>
  );
};

export default AboutUs;
