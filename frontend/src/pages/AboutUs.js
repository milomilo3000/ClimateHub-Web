import React from 'react';
import { Users, Target, Globe } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Milan Nathani',
      role: 'Founder & Executive Lead',
      description: 'Founder and driving force behind ClimateHub. Leads strategy, technology, outreach, and overall project direction. Spearheads talks, school information sessions, and partnerships, while building the platform\'s technical backbone.',
      icon: Target
    },
    {
      name: 'Dylan Seng',
      role: 'Outreach, Marketing & Communications',
      description: 'Leads ClimateHub\'s outreach, social media, and publicity campaigns. Represents the project through presentations, community engagement, and youth-facing initiatives. Focuses on growing awareness and making sustainability relatable and engaging for youth.',
      icon: Users
    },
    {
      name: 'Maahir Bhatia',
      role: 'Partnerships & Strategy',
      description: 'Contributed to pitching ClimateHub to the Ministry of Sustainability and Environment during its founding phase. Advised on partnerships and strategic positioning.',
      icon: Globe
    }
  ];

  const founder = teamMembers.find(member => member.name === 'Milan Nathani');
  const otherMembers = teamMembers.filter(member => member.name !== 'Milan Nathani');

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About Us
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Meet the team behind ClimateHub — youth building tools for a sustainable future.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Meet the Founder Section */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-24 my-20">
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <h2 className="text-5xl font-extrabold text-center text-black mb-12">Meet the Founder</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start max-w-4xl mx-auto gap-12 text-black">
            {/* Left column: Founder Images Gallery */}
            <div className="w-full md:w-1/2 grid grid-rows-2 gap-4 h-[600px]">
              <img src="/images/About-Img1.jpg" alt="Founder 1" className="rounded-xl shadow-md object-cover object-top w-full h-full" />
              <img src="/images/About-Img2.jpg" alt="Founder 2" className="rounded-xl shadow-md object-cover object-top w-full h-full" />
            </div>
            {/* Right column: Founder Info */}
            <div className="w-full md:w-1/2 self-start">
              <h3 className="text-4xl font-bold mb-2">{founder.name}</h3>
              <p className="text-2xl font-semibold mb-6 text-black">{founder.role}</p>
              <p className="leading-relaxed mb-8 text-lg">
                Milan Nathani is the founder and executive lead of ClimateHub, a youth-driven climate-tech platform created to make sustainability accessible and actionable. Inspired during his National Service, he saw the potential to turn shared routines into collective climate action. Milan has led ClimateHub from idea to impact — coding the platform, securing SG Eco Fund support, piloting it in SAF camps, and building partnerships through talks and outreach. Under his leadership, ClimateHub has earned national recognition and is growing as a platform that empowers youth to track, reduce, and rethink their carbon footprints.
              </p>
              <blockquote className="border-l-4 border-green-600 italic text-black text-xl px-6 py-4 bg-green-100 rounded-lg shadow-inner">
                "Our future depends on the actions we take today. I believe every young person has the power to make a difference, and ClimateHub is here to help unlock that potential."
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="bg-white text-black py-16">
        <h2 className="text-4xl font-bold text-black text-center mb-12 font-sans">Meet the Team</h2>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherMembers.map((member, index) => {
              const IconComponent = member.icon;
              return (
                <div
                  key={member.name}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white relative">
                    <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                    <p className="text-green-100 text-center font-medium">{member.role}</p>
                    
                    {/* Decorative wave */}
                    <div className="absolute bottom-0 left-0 w-full">
                      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-6">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {member.description}
                    </p>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Closing Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-xl sm:text-2xl font-medium leading-relaxed">
              We're a youth-led team committed to turning awareness into action and making sustainability accessible to everyone.
            </p>
            
            {/* Decorative elements */}
            <div className="flex justify-center mt-8 space-x-4">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
