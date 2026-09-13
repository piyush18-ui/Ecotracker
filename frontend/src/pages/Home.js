import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Camera, 
  MapPin, 
  Trophy, 
  Brain, 
  Truck, 
  Shield,
  ArrowRight,
  Star,
  Users,
  Target,
  Zap
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Camera,
      title: 'Waste Reporting',
      description: 'Upload photos and report waste with AI-powered detection',
      color: 'text-blue-600'
    },
    {
      icon: MapPin,
      title: 'Nearby Bins',
      description: 'Find the nearest waste disposal facilities',
      color: 'text-green-600'
    },
    {
      icon: Trophy,
      title: 'Leaderboard',
      description: 'Compete with others and earn rewards',
      color: 'text-yellow-600'
    },
    {
      icon: Brain,
      title: 'Educational Quizzes',
      description: 'Learn about environmental conservation',
      color: 'text-purple-600'
    },
    {
      icon: Truck,
      title: 'Van Tracking',
      description: 'Track garbage collection vans in real-time',
      color: 'text-orange-600'
    },
    {
      icon: Shield,
      title: 'Admin Dashboard',
      description: 'Manage reports and monitor system analytics',
      color: 'text-red-600'
    }
  ];

  const stats = [
    { icon: Users, label: 'Active Users', value: '10,000+' },
    { icon: Target, label: 'Reports Submitted', value: '50,000+' },
    { icon: Star, label: 'Points Earned', value: '1M+' },
    { icon: Zap, label: 'Waste Collected', value: '100 Tons' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Make the World
              <span className="block text-green-200">Cleaner Together</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Join thousands of eco-conscious citizens in reporting waste, 
              tracking environmental impact, and building a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Go to Dashboard
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                    Get Started
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                  <Link to="/login" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-primary-600" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Environmental Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines technology, gamification, 
              and community engagement to make environmental action accessible and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 ${feature.color} mb-4`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to make a big impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Report Waste
              </h3>
              <p className="text-gray-600">
                Take a photo of waste and let our AI detect the type automatically
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Earn Points
              </h3>
              <p className="text-gray-600">
                Get rewarded for your environmental actions and climb the leaderboard
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Monitor collection vans and see the impact of your contributions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of environmental champions and start making an impact today.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Start Your Journey
              <ArrowRight className="ml-2" size={20} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
