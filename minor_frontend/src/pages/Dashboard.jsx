import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as achievementService from '../services/achievementService';
import * as sessionService from '../services/sessionService';
import * as submissionService from '../services/submissionService';

const Dashboard = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achievementsData, sessionsData, submissionsData] = await Promise.all([
          achievementService.getUserAchievements(user.id),
          sessionService.getMySessions(),
          submissionService.getUserSubmissions(user.id)
        ]);

        setAchievements(achievementsData);
        setSessions(sessionsData.filter(s => s.status === 'scheduled').slice(0, 3));
        setRecentSubmissions(submissionsData.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">CodePlatform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/problems" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Problems
              </Link>
              <Link to="/rooms" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Rooms
              </Link>
              <Link to="/sessions" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Sessions
              </Link>
              <Link to={`/profile/${user.id}`} className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.username}! 👋
          </h2>
          <p className="text-gray-400">Here's what's happening with your coding journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Problems Solved</div>
            <div className="text-3xl font-bold text-white">{user.stats?.problemsSolved || 0}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Current Streak</div>
            <div className="text-3xl font-bold text-orange-500">{user.stats?.currentStreak || 0} 🔥</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Achievements</div>
            <div className="text-3xl font-bold text-yellow-500">{achievements.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Submissions</div>
            <div className="text-3xl font-bold text-blue-500">{user.stats?.totalSubmissions || 0}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/problems"
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <h3 className="text-xl font-bold text-white mb-2">Solve Problems</h3>
            <p className="text-blue-100">Practice coding challenges</p>
          </Link>
          <Link
            to="/rooms"
            className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            <h3 className="text-xl font-bold text-white mb-2">Create Room</h3>
            <p className="text-purple-100">Collaborate with others</p>
          </Link>
          <Link
            to="/mentors"
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 hover:from-green-700 hover:to-green-800 transition-all"
          >
            <h3 className="text-xl font-bold text-white mb-2">Find Mentor</h3>
            <p className="text-green-100">Get expert guidance</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Upcoming Sessions</h3>
            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session._id} className="bg-gray-700 rounded-lg p-4">
                    <div className="font-medium text-white">{session.title}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {new Date(session.scheduledAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No upcoming sessions</p>
            )}
          </div>

          {/* Recent Submissions */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Recent Submissions</h3>
            {recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <div key={submission._id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-white">{submission.problemId?.title || 'Problem'}</div>
                      <div className="text-sm text-gray-400">{submission.language}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${submission.status === 'accepted' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                      {submission.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No submissions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
