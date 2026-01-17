import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, updateProfile, updateMentorProfile, logout } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        avatar: user?.avatar || '',
        bio: user?.bio || ''
    });

    const [mentorData, setMentorData] = useState({
        specializations: user?.mentorProfile?.specializations?.join(', ') || '',
        hourlyRate: user?.mentorProfile?.hourlyRate || ''
    });

    const [saving, setSaving] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateProfile(profileData.avatar, profileData.bio);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleMentorUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const specializations = mentorData.specializations
                .split(',')
                .map(s => s.trim())
                .filter(s => s);

            await updateMentorProfile(specializations, parseFloat(mentorData.hourlyRate));
            alert('Mentor profile updated successfully!');
        } catch (error) {
            console.error('Failed to update mentor profile:', error);
            alert('Failed to update mentor profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
                            <Link to={`/profile/${user?.id}`} className="text-gray-300 hover:text-white px-3 py-2">Profile</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

                {/* Profile Settings */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Profile Settings</h2>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Avatar URL
                            </label>
                            <input
                                type="url"
                                value={profileData.avatar}
                                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Bio
                            </label>
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tell us about yourself..."
                            />
                            <p className="text-gray-500 text-sm mt-1">{profileData.bio.length}/500 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
                        >
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>

                {/* Mentor Settings */}
                {user?.role === 'mentor' && (
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                        <h2 className="text-xl font-bold text-white mb-4">Mentor Settings</h2>

                        <form onSubmit={handleMentorUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Specializations (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={mentorData.specializations}
                                    onChange={(e) => setMentorData({ ...mentorData, specializations: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="JavaScript, Python, React"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Hourly Rate ($)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={mentorData.hourlyRate}
                                    onChange={(e) => setMentorData({ ...mentorData, hourlyRate: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="50.00"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-colors"
                            >
                                {saving ? 'Saving...' : 'Save Mentor Profile'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Account Actions */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Account</h2>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-white font-medium">Email</div>
                                <div className="text-gray-400 text-sm">{user?.email}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-white font-medium">Username</div>
                                <div className="text-gray-400 text-sm">{user?.username}</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-white font-medium">Role</div>
                                <div className="text-gray-400 text-sm capitalize">{user?.role}</div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                            <button
                                onClick={handleLogout}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
