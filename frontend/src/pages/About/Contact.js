import React from "react";
import FadeIn from "../../components/animations/FadeIn";
import StaggerWrapper from "../../components/animations/StaggerWrapper";

const Contact = () => {
  return (
    <div className="w-full flex flex-col items-center px-6 md:px-24 py-20">
      <StaggerWrapper>
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Contact Us
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-lg leading-relaxed max-w-3xl text-gray-700 text-center mb-12">
            Whether you’re a student, youth group, school, organisation, or 
            partner keen to collaborate, we’d love to hear from you. 
            ClimateHub is built for the community—and we’re always excited 
            to connect with those who want to drive climate action.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl w-full">
            <p className="text-gray-800 text-lg mb-4">
              📩 <strong>Email:</strong> climatehub.sg@gmail.com
            </p>
            <p className="text-gray-800 text-lg">
              🤝 <strong>Partnerships & Collaborations:</strong> Reach out to us 
              for school talks, NS briefings, sustainability events, or 
              collaboration opportunities.
            </p>
          </div>
        </FadeIn>
      </StaggerWrapper>
    </div>
  );
};

export default Contact;
