import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Calculator, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Users, 
  Globe, 
  Award,
  ArrowRight,
  CheckCircle,
  Shield,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Camp Carbon Tracker',
      description: 'Track your environmental impact during NS. Calculate emissions from camp life, transport, and more. See how you stand compared to your other NSFs.',
      href: '/carbon-tracker'
    },
    {
      icon: BookOpen,
      title: 'Education Hub',
      description: 'Learn about Singapore\'s climate goals and how you can contribute. Get updates on environmental policies and initiatives in Singapore\'s army.',
      href: '/education'
    },
    {
      icon: Calendar,
      title: 'Events Calendar',
      description: 'Join green initiatives in your camp and in Singapore. From beach cleanups to eco-volunteering, turn your NS experience into environmental service.',
      href: '/events'
    },
    {
      icon: Users,
      title: 'Unit Eco-Rankings',
      description: 'Compete with other NSF units in sustainability challenges. Earn eco-badges and climb the green leaderboard with your campmates.',
      href: '/profile'
    }
  ];

  const stats = [
    { label: 'NSF Carbon Footprints', value: '2,500+', icon: Calculator },
    { label: 'Camp Eco-Events', value: '150+', icon: Calendar },
    { label: 'Active NSF Users', value: '1,200+', icon: Users },
    { label: 'CO₂ Saved (tonnes)', value: '850+', icon: Leaf }
  ];

  const benefits = [
    'Track your camp environmental impact',
    'Compete in unit eco-challenges',
    'Learn about military/local sustainability',
    'Earn eco-badges for eco-friendly actions',
    'Join camp and local environmental initiatives',
    'Connect with eco-conscious NSFs',
    'Access local climate resources',
    'Contribute to Singapore\'s green goals'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 py-20 relative overflow-hidden">
        {/* Camouflage pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-800 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-green-700 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-600 rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-green-800 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center relative">
                <Shield className="w-10 h-10 text-white" />
                <Leaf className="w-6 h-6 text-green-200 absolute -top-1 -right-1" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              ClimateHub
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-700 mb-4">
              Equipping NSFs to Serve Both Nation and Nature
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Turn your camp routines into eco-missions. Track your footprint, reduce your impact, 
              and help your campmates climb the eco-ranks while serving Singapore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/carbon-tracker"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2"
              >
                <span>Calculate your footprint</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/education"
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2"
              >
                <span>Learn more</span>
                <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              NSFs Making a Difference
            </h2>
            <p className="text-gray-600">Join fellow servicemen in Singapore's climate mission</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your NS Climate Action Toolkit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to make your National Service experience environmentally conscious 
              and contribute to Singapore's green future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.href}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 group border border-gray-200 hover:border-green-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 group-hover:bg-green-200 transition-colors duration-200">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose ClimateHub for NS?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                As an NSF, you're already serving Singapore. Now serve the environment too. 
                Our platform helps you make your National Service experience sustainable and meaningful.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">NSF Green Mission</h3>
                </div>
                <p className="text-lg mb-6">
                  Every NSF can contribute to Singapore's net-zero 2050 goal. 
                  Make your service count for both nation and nature.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">2050</div>
                    <div className="text-sm opacity-90">Net-zero target</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">NSF</div>
                    <div className="text-sm opacity-90">Green warriors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Serve Singapore's Green Future?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join fellow NSFs in making every day of service count for the environment. 
            Start your eco-mission today and help your unit become the greenest in camp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/carbon-tracker"
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>Begin Eco-Mission</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/events"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>Join Green Events</span>
              <Calendar className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;