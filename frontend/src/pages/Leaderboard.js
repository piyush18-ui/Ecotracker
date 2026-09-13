import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown,
  Star,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // all, week, month

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`/api/leaderboard?filter=${timeFilter}`);
      setLeaderboard(response.data.leaderboard);
      
      // Find user's rank
      const userIndex = response.data.leaderboard.findIndex(
        entry => entry.username === user?.username
      );
      if (userIndex !== -1) {
        setUserRank(response.data.leaderboard[userIndex]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-amber-600" size={24} />;
      default:
        return <span className="text-gray-600 font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700';
      default:
        return 'bg-gray-100';
    }
  };

  const getLevelColor = (level) => {
    if (level >= 10) return 'text-purple-600';
    if (level >= 5) return 'text-blue-600';
    if (level >= 3) return 'text-green-600';
    return 'text-gray-600';
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="text-yellow-500 mr-3" size={48} />
            <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-xl text-gray-600">
            Compete with other eco-warriors and climb the ranks!
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            {[
              { key: 'all', label: 'All Time' },
              { key: 'month', label: 'This Month' },
              { key: 'week', label: 'This Week' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setTimeFilter(filter.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeFilter === filter.key
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* User's Current Rank */}
        {userRank && (
          <div className="card mb-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  #{userRank.rank}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Your Current Rank
                  </h3>
                  <p className="text-gray-600">
                    {userRank.points} points • Level {userRank.level}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-primary-600">
                  <TrendingUp size={20} className="mr-1" />
                  <span className="font-medium">Keep going!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Top Performers</h2>
            <div className="flex justify-center items-end space-x-4">
              {/* 2nd Place */}
              {leaderboard[1] && (
                <div className="text-center">
                  <div className={`w-20 h-20 ${getRankColor(2)} rounded-full flex items-center justify-center mb-2`}>
                    {getRankIcon(2)}
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-lg border min-w-[200px]">
                    <h3 className="font-semibold text-gray-900">{leaderboard[1].fullName}</h3>
                    <p className="text-sm text-gray-600">@{leaderboard[1].username}</p>
                    <div className="flex items-center justify-center mt-2">
                      <Star className="text-yellow-500 mr-1" size={16} />
                      <span className="font-bold text-gray-900">{leaderboard[1].points}</span>
                    </div>
                    <p className={`text-sm font-medium ${getLevelColor(leaderboard[1].level)}`}>
                      Level {leaderboard[1].level}
                    </p>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {leaderboard[0] && (
                <div className="text-center">
                  <div className={`w-24 h-24 ${getRankColor(1)} rounded-full flex items-center justify-center mb-2`}>
                    {getRankIcon(1)}
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 shadow-xl border-2 border-yellow-200 min-w-[200px]">
                    <h3 className="font-bold text-gray-900 text-lg">{leaderboard[0].fullName}</h3>
                    <p className="text-sm text-gray-600">@{leaderboard[0].username}</p>
                    <div className="flex items-center justify-center mt-2">
                      <Star className="text-yellow-500 mr-1" size={18} />
                      <span className="font-bold text-gray-900 text-lg">{leaderboard[0].points}</span>
                    </div>
                    <p className={`text-sm font-bold ${getLevelColor(leaderboard[0].level)}`}>
                      Level {leaderboard[0].level}
                    </p>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {leaderboard[2] && (
                <div className="text-center">
                  <div className={`w-20 h-20 ${getRankColor(3)} rounded-full flex items-center justify-center mb-2`}>
                    {getRankIcon(3)}
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-lg border min-w-[200px]">
                    <h3 className="font-semibold text-gray-900">{leaderboard[2].fullName}</h3>
                    <p className="text-sm text-gray-600">@{leaderboard[2].username}</p>
                    <div className="flex items-center justify-center mt-2">
                      <Star className="text-yellow-500 mr-1" size={16} />
                      <span className="font-bold text-gray-900">{leaderboard[2].points}</span>
                    </div>
                    <p className={`text-sm font-medium ${getLevelColor(leaderboard[2].level)}`}>
                      Level {leaderboard[2].level}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Full Rankings</h2>
            <div className="flex items-center text-gray-600">
              <Users size={20} className="mr-2" />
              <span>{leaderboard.length} participants</span>
            </div>
          </div>

          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.username}
                className={`flex items-center p-4 rounded-lg transition-colors ${
                  entry.username === user?.username
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center w-16">
                  {getRankIcon(entry.rank)}
                </div>

                <div className="flex-1 ml-4">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-900">
                      {entry.fullName}
                    </h3>
                    {entry.username === user?.username && (
                      <span className="ml-2 px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">@{entry.username}</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span className="font-bold text-gray-900">{entry.points}</span>
                  </div>
                  <p className={`text-sm font-medium ${getLevelColor(entry.level)}`}>
                    Level {entry.level}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No rankings available yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start reporting waste to appear on the leaderboard!
              </p>
            </div>
          )}
        </div>

        {/* How to Earn Points */}
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Target className="text-blue-600 mr-3" size={24} />
              <div>
                <p className="font-medium text-gray-900">Report Waste</p>
                <p className="text-sm text-gray-600">+10 points per report</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <Star className="text-green-600 mr-3" size={24} />
              <div>
                <p className="font-medium text-gray-900">Complete Quizzes</p>
                <p className="text-sm text-gray-600">+5 points per quiz</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="text-purple-600 mr-3" size={24} />
              <div>
                <p className="font-medium text-gray-900">Daily Activity</p>
                <p className="text-sm text-gray-600">+2 points per day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
