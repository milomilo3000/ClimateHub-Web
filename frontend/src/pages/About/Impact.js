import React, { useEffect } from "react";
import FadeIn from "../../components/animations/FadeIn";
import StaggerWrapper from "../../components/animations/StaggerWrapper";

const milestones = [
  {
    title: "ClimateHub Conceptualised",
    date: "Jan 2025",
    desc: "Initial idea and platform direction formed during NS.",
  },
  {
    title: "SG Eco Fund Support Secured",
    date: "Jul 2025",
    desc: "ClimateHub awarded funding under MSE’s SG Eco Fund (Sprout).",
  },
  {
    title: "ClimateHub Went Live",
    date: "17 Sep 2025",
    desc: "First beta launch with core features deployed.",
  },
  {
    title: "First NS Camp Info Session",
    date: "25 Sep 2025",
    desc: "Full briefing for Selarang NSFs, onboarding users.",
  },
  {
    title: "WWF WeGotThis Silver Award",
    date: "End Sep 2025",
    desc: "Recognised at the WWF Sustainability Summit 2025.",
  },
  {
    title: "Selarang Camp Trial Completed",
    date: "Nov 2025",
    desc: "ClimateHub’s first full NS camp trial concluded with results collected and analysed for rollout.",
  },
];

const trialStats = [
  "21.4% reduction in average carbon footprints",
  "140+ NSFs participated",
  "40+ Active Users Onboarded",
  "Behavioural improvements in food, AC use, and transport",
];

const Impact = () => {
  useEffect(() => {
    const bar = document.querySelector(".progress-fill");
    const leaf = document.querySelector(".leaf-icon");
    
    if (bar && leaf) {
      bar.style.transition = "none";
      leaf.style.transition = "none";

      bar.style.width = "0%";
      leaf.style.left = "0%";

      setTimeout(() => {
        bar.style.transition = "width 2.4s ease-out";
        leaf.style.transition = "left 2.4s ease-out";

        bar.style.width = "68%";
        leaf.style.left = "68%";
      }, 200);
    }
  }, []);

  // CAROUSEL LOGIC (React version)
  useEffect(() => {
    let index = 0;

    const track = document.querySelector(".carousel-track");
    const dots = document.querySelectorAll(".carousel-dot");
    const prev = document.getElementById("arrow-prev");
    const next = document.getElementById("arrow-next");

    if (!track || dots.length === 0) return;

    const updateCarousel = () => {
      const width = track.parentElement.offsetWidth;
      track.style.transform = `translateX(${-(index * width)}px)`;

      dots.forEach((dot, i) => {
        if (i === index) {
          dot.style.background = "#ffffff";
          dot.style.border = "2px solid #166534";
        } else {
          dot.style.background = "rgba(255,255,255,0.5)";
          dot.style.border = "1px solid rgba(255,255,255,0.5)";
        }
      });
    };

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        index = i;
        updateCarousel();
      });
    });

    prev?.addEventListener("click", () => {
      index = (index - 1 + dots.length) % dots.length;
      updateCarousel();
    });

    next?.addEventListener("click", () => {
      index = (index + 1) % dots.length;
      updateCarousel();
    });

    updateCarousel();

    return () => {
      dots.forEach((dot) => dot.replaceWith(dot.cloneNode(true)));
      prev?.replaceWith(prev.cloneNode(true));
      next?.replaceWith(next.cloneNode(true));
    };
  }, []);

  return (
    <>
      {/* Background Lottie Animation - now above canvas & clearly visible */}
      <div className="fixed inset-0 z-0 opacity-100 pointer-events-none">
        <div className="absolute inset-0">
          <lottie-player
            src="https://lottie.host/7de588d6-e547-43e0-9537-acf0b3f3ff56/8vf7y3gJ2t.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          ></lottie-player>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
      <StaggerWrapper>
        <FadeIn>
          <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-900 tracking-tight">
            Our Impact
          </h1>
        </FadeIn>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Progress Timeline</h2>

          {/* Progress Bar Container */}
          <div className="relative w-full mb-12">
            <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden relative">
              <div className="progress-fill bg-green-500 h-full rounded-full" style={{ width: "0%" }}></div>

              {/* Leaf Icon (smaller + aligned to tip) */}
              <svg
                className="leaf-icon absolute top-1/2 -translate-y-1/2 w-5 h-5"
                viewBox="0 0 24 24"
                fill="#166534"
              >
                <path d="M12 2C7 2 3 6 3 11c0 4 3 7 7 7 5 0 9-4 9-9 0-1-.2-2-.5-3-.2-.5-.8-.7-1.2-.4C15 7 13 7.5 11 7.5c-1.5 0-3-.5-4.5-1.5-.4-.3-1-.1-1.2.4C5 7.6 5 8.3 5 9c0 4 3 7 7 7s7-3 7-7c0-5-4-9-7-9z"/>
              </svg>

              {/* Tracker Labels */}
              <div className="absolute -bottom-8 w-full grid grid-cols-3 text-sm text-gray-500">
                <span className="text-left">Start</span>
                <span className="text-center">In Progress</span>
                <span className="text-right">Current</span>
              </div>
            </div>
          </div>

          {/* Milestones in TWO rows — centered — matching your sketch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {milestones.map((m, index) => (
              <div
                key={index}
                className="p-5 rounded-xl shadow-sm border border-gray-200 bg-white"
              >
                <h3 className="text-lg font-bold text-gray-900">{m.title}</h3>
                <p className="text-sm text-green-600 font-semibold mt-1">{m.date}</p>
                <p className="text-gray-700 mt-2 text-md leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CAROUSEL‑STYLE TRIAL RESULTS */}
        <FadeIn>
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">NS Trial Statistics</h2>

            <div
              className="relative py-14 px-10 rounded-2xl shadow-md border border-gray-200 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-center min-h-[220px]"
              style={{ backgroundImage: "url('/images/trial.png')" }}
            >
              <div className="relative w-full h-24 flex items-center justify-center">
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-900 text-3xl font-bold bg-white/80 rounded-full px-4 py-2 shadow-lg hover:bg-white z-20"
                  id="arrow-prev"
                >
                  ‹
                </button>

                <div className="w-full overflow-hidden">
                  <div className="carousel-track flex transition-transform duration-500">
                    {trialStats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="w-full flex-shrink-0 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-black text-green-900 tracking-tight drop-shadow-2xl px-4 sm:px-6 leading-tight"
                      >
                        {stat}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-green-900 text-3xl font-bold bg-white/80 rounded-full px-4 py-2 shadow-lg hover:bg-white z-20"
                  id="arrow-next"
                >
                  ›
                </button>
              </div>

              <div className="flex justify-center mt-6 space-x-3">
                {trialStats.map((_, idx) => (
                  <div
                    key={idx}
                    className="w-3 h-3 rounded-full bg-white opacity-70 border border-green-600 carousel-dot"
                    data-index={idx}
                  ></div>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ORIGINAL IMPACT CONTENT BELOW */}
        <FadeIn>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Real‑World Behaviour Change</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              Participants reported greater awareness of their daily emissions and took meaningful
              actions — choosing lower‑impact meals, reducing electricity usage, and adopting
              greener transport choices.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-3">Scaling Impact</h2>
            <ul className="list-disc pl-6 text-gray-800 text-lg leading-relaxed space-y-2">
              <li>Expand ClimateHub to multiple NS camps across Singapore with structured rollout phases.</li>
              <li>Introduce full gamification system — XP, levels, weekly missions, streaks, and badges.</li>
              <li>Deploy AI‑powered personalised recommendations based on user behaviour and habits.</li>
              <li>Develop new community‑driven eco‑events, camp‑wide challenges, and youth engagement programmes.</li>
              <li>Integrate with partnering organisations for school talks, NS sustainability briefings, and youth workshops.</li>
            </ul>
          </section>
        </FadeIn>
      </StaggerWrapper>

      <style>
        {`
          .leaf-icon {
            transition: left 2.4s ease-out;
          }
        `}
      </style>
      </div>
    </>
  );
};

export default Impact;
