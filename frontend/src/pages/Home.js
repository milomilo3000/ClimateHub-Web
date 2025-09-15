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
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Carbon Footprint Tracker',
      description: 'Calculate and track your carbon footprint with our comprehensive multi-step form. Compare your results with Singapore and global averages.',
      href: '/carbon-tracker'
    },
    {
      icon: BookOpen,
      title: 'Education Hub',
      description: 'Learn about Singapore\'s environmental initiatives, government policies, and stay updated with the latest climate news.',
      href: '/education'
    },
    {
      icon: Calendar,
      title: 'Event Calendar',
      description: 'Discover environmental community events in Singapore. Submit and participate in climate action initiatives.',
      href: '/events'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with like-minded individuals, earn badges for eco actions, and track your progress over time.',
      href: '/profile'
    }
  ];

  const stats = [
    { label: 'Carbon Footprints Calculated', value: '10,000+', icon: Calculator },
    { label: 'Environmental Events', value: '500+', icon: Calendar },
    { label: 'Active Users', value: '5,000+', icon: Users },
    { label: 'CO₂ Saved (tonnes)', value: '2,500+', icon: Leaf }
  ];

  const benefits = [
    'Track your personal carbon footprint',
    'Compare with Singapore and global averages',
    'Discover local environmental events',
    'Learn about climate initiatives',
    'Earn badges for eco actions',
    'Stay informed with latest news',
    'Connect with the community',
    'Access educational resources'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Singapore's Climate
              <span className="text-primary-600"> Action Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track your carbon footprint, discover environmental events, and stay informed about 
              climate initiatives in Singapore. Join the movement towards a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/carbon-tracker"
                className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <span>Calculate Your Footprint</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/education"
                className="btn-outline text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <span>Learn More</span>
                <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-600" />
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
              Everything You Need for Climate Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to 
              understand and reduce your environmental impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.href}
                className="card hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
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
                Why Choose ClimateHub?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of Singaporeans who are taking action against climate change. 
                Our platform makes it easy to understand your impact and make positive changes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <Award className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Singapore's Green Future</h3>
                </div>
                <p className="text-lg mb-6">
                  Singapore has committed to net-zero emissions by 2050. Join the movement 
                  and be part of the solution.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">8.56</div>
                    <div className="text-sm opacity-90">Avg CO₂ tonnes/person</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2050</div>
                    <div className="text-sm opacity-90">Net-zero target</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Action?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start your climate action journey today. Calculate your carbon footprint and 
            discover ways to make a positive impact.
          </p>
          <Link
            to="/carbon-tracker"
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 