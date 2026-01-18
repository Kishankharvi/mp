import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickStats = [
    { label: 'Problems Solved', value: '0', icon: '⚡' },
    { label: 'Active Sessions', value: '0', icon: '🔌' },
    { label: 'Mentorships', value: '0', icon: '🎓' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12 relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-8 md:p-12 transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 -ml-12 -mb-12 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">{user.username}</span>! 👋
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">
                Ready to push your code to the next level? Here's what's happening today.
              </p>
            </div>

            <div className="flex gap-4">
              {quickStats.map((stat) => (
                <div key={stat.label} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-4 min-w-[120px] text-center shadow-sm">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-bold text-gray-900 dark:text-white text-xl">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Action Grid */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
          Get Started
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/problems')}
            className="group relative bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <span className="text-9xl grayscale dark:invert">💻</span>
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                💻
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Practice Problems</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Curated challenges to sharpen your algorithmic thinking.
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/rooms')}
            className="group relative bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <span className="text-9xl grayscale dark:invert">👥</span>
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                👥
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Collaborative Rooms</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Join a room or create one to code with friends in real-time.
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/mentors')}
            className="group relative bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <span className="text-9xl grayscale dark:invert">🎓</span>
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                🎓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Find Mentors</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Connect with experts for code reviews and career advice.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
