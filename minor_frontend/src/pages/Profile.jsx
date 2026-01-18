import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import * as achievementService from '../services/achievementService';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const fetchUserData = async () => {
        try {
            const [userData, statsData, achievementsData] = await Promise.all([
                userService.getUserProfile(id),
                userService.getUserStats(id),
                achievementService.getUserAchievements(id)
            ]);

            setUser(userData);
            setStats(statsData.stats);
            setAchievements(achievementsData);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center py-20">
                    <div className="spinner spinner-lg"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container py-20 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUser?.id === id;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-lg">
                            {user.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.username}</h1>
                            <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">{user.email}</p>
                            {user.bio && <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 max-w-2xl">{user.bio}</p>}
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${user.role === 'mentor' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                    user.role === 'admin' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                        {isOwnProfile && (
                            <Link
                                to="/settings"
                                className="px-6 py-2.5 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Edit Profile
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm transition-colors duration-300">
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Problems Solved</div>
                        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats?.problemsSolved || 0}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm transition-colors duration-300">
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Total Submissions</div>
                        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats?.totalSubmissions || 0}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm transition-colors duration-300">
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Current Streak</div>
                        <div className="text-3xl font-extrabold text-orange-600 dark:text-orange-500">{stats?.currentStreak || 0} <span className="text-sm font-medium text-gray-400 ml-1">days</span></div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm transition-colors duration-300">
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Longest Streak</div>
                        <div className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-500">{stats?.longestStreak || 0} <span className="text-sm font-medium text-gray-400 ml-1">days</span></div>
                    </div>
                </div>

                {/* Mentor Stats */}
                {user.role === 'mentor' && user.mentorProfile && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-8 shadow-sm transition-colors duration-300">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Mentor Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Rating</div>
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.mentorProfile.rating?.toFixed(1) || '0.0'}
                                    </div>
                                    <div className="text-yellow-500 dark:text-yellow-400 text-sm font-bold">★</div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Total Sessions</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.mentorProfile.totalSessions || 0}</div>
                            </div>
                            {user.mentorProfile.hourlyRate && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                    <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Hourly Rate</div>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">${user.mentorProfile.hourlyRate}</div>
                                </div>
                            )}
                        </div>
                        {user.mentorProfile.specializations && user.mentorProfile.specializations.length > 0 && (
                            <div>
                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Specializations</div>
                                <div className="flex flex-wrap gap-2">
                                    {user.mentorProfile.specializations.map((spec, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-bold">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Achievements */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm transition-colors duration-300">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Achievements ({achievements.length})
                    </h2>
                    {achievements.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-300 dark:text-gray-700 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No achievements yet. Keep coding!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {achievements.map((achievement) => (
                                <div key={achievement._id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{achievement.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{achievement.description}</p>
                                    <p className="text-gray-500 dark:text-gray-500 text-xs font-semibold">
                                        Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
