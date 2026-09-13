import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Camera, 
  MapPin, 
  Trophy, 
  Brain, 
  Truck,
  TrendingUp,
  Target,
  Award,
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    points: user?.points || 0,
    level: user?.level || 1
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [reportsResponse] = await Promise.all([
        axios.get('/api/reports')
      ]);

      const reports = reportsResponse.data.reports;
      setRecentReports(reports.slice(0, 5));
      setStats(prev => ({
        ...prev,
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Report Waste',
      description: 'Upload photo and report waste',
      icon: Camera,
      link: '/report-waste',
      color: 'bg-blue-500'
    },
    {
      title: 'Find Bins',
      description: 'Locate nearby waste bins',
      icon: MapPin,
      link: '/nearby-bins',
      color: 'bg-green-500'
    },
    {
      title: 'Track Vans',
      description: 'Monitor garbage collection',
      icon: Truck,
      link: '/van-tracking',
      color: 'bg-orange-500'
    },
    {
      title: 'Take Quiz',
      description: 'Learn and earn points',
      icon: Brain,
      link: '/quizzes',
      color: 'bg-purple-500'
    }
  ];

  const getLevelProgress = () => {
    const currentLevel = stats.level;
    const pointsInLevel = stats.points % 100; // Assuming 100 points per level
    return (pointsInLevel / 100) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600">
            Ready to make a difference today? Let's keep our environment clean together.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points</p>
                <p className="text-2xl font-bold text-gray-900">{stats.points}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Level</p>
                <p className="text-2xl font-bold text-gray-900">{stats.level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Level Progress</h3>
            <span className="text-sm text-gray-600">Level {stats.level}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {stats.points % 100} / 100 points to next level
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="card hover:shadow-lg transition-shadow group"
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="text-gray-400 group-hover:text-primary-600 transition-colors" size={20} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Reports */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
              <Link to="/reports" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentReports.length > 0 ? (
                recentReports.map((report, index) => (
                  <div key={index} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {report.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-8">
                  <Camera className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-4">No reports yet</p>
                  <Link to="/report-waste" className="btn-primary">
                    <Plus size={16} className="mr-2" />
                    Report Waste
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
            <Link to="/leaderboard" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View full leaderboard
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-center py-8">
              <Trophy className="text-yellow-500 mr-4" size={32} />
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">Compete with others!</p>
                <p className="text-gray-600">See how you rank against other eco-warriors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
