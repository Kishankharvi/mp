import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading profile...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">User not found</div>
            </div>
        );
    }

    const isOwnProfile = currentUser?.id === id;

    return (
        <div className="min-h-screen bg-gray-900">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/dashboard" className="text-2xl font-bold text-white">CodePlatform</Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2">Dashboard</Link>
                            {isOwnProfile && (
                                <Link to="/settings" className="text-gray-300 hover:text-white px-3 py-2">Settings</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-6">
                    <div className="flex items-start space-x-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                            {user.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                            <p className="text-gray-400 mb-4">{user.email}</p>
                            {user.bio && <p className="text-gray-300">{user.bio}</p>}
                            <div className="flex items-center space-x-4 mt-4">
                                <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'mentor' ? 'bg-purple-500/20 text-purple-400' :
                                        user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                            'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Problems Solved</div>
                        <div className="text-3xl font-bold text-white">{stats?.problemsSolved || 0}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Current Streak</div>
                        <div className="text-3xl font-bold text-orange-500">{stats?.currentStreak || 0} 🔥</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Longest Streak</div>
                        <div className="text-3xl font-bold text-yellow-500">{stats?.longestStreak || 0}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Total Submissions</div>
                        <div className="text-3xl font-bold text-blue-500">{stats?.totalSubmissions || 0}</div>
                    </div>
                </div>

                {/* Mentor Stats */}
                {user.role === 'mentor' && user.mentorProfile && (
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                        <h2 className="text-xl font-bold text-white mb-4">Mentor Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-gray-400 text-sm mb-1">Rating</div>
                                <div className="text-2xl font-bold text-yellow-500">
                                    {'⭐'.repeat(Math.round(user.mentorProfile.rating || 0))}
                                    <span className="text-white ml-2">
                                        {user.mentorProfile.rating?.toFixed(1) || '0.0'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm mb-1">Total Sessions</div>
                                <div className="text-2xl font-bold text-white">{user.mentorProfile.totalSessions || 0}</div>
                            </div>
                            {user.mentorProfile.hourlyRate && (
                                <div>
                                    <div className="text-gray-400 text-sm mb-1">Hourly Rate</div>
                                    <div className="text-2xl font-bold text-green-500">${user.mentorProfile.hourlyRate}</div>
                                </div>
                            )}
                        </div>
                        {user.mentorProfile.specializations && user.mentorProfile.specializations.length > 0 && (
                            <div className="mt-4">
                                <div className="text-gray-400 text-sm mb-2">Specializations</div>
                                <div className="flex flex-wrap gap-2">
                                    {user.mentorProfile.specializations.map((spec, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Achievements */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">
                        Achievements ({achievements.length})
                    </h2>
                    {achievements.length === 0 ? (
                        <p className="text-gray-400">No achievements yet</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {achievements.map((achievement) => (
                                <div key={achievement._id} className="bg-gray-700 rounded-lg p-4 flex items-start space-x-3">
                                    <div className="text-3xl">{achievement.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">{achievement.title}</h3>
                                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                                        </p>
                                    </div>
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
