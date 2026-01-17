import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as sessionService from '../services/sessionService';

const Mentors = () => {
    const { user } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [sessionData, setSessionData] = useState({
        title: '',
        scheduledAt: '',
        duration: 60
    });
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const data = await sessionService.getAvailableMentors();
            setMentors(data);
        } catch (error) {
            console.error('Failed to fetch mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSession = async (e) => {
        e.preventDefault();
        setBooking(true);

        try {
            await sessionService.createSession({
                mentorId: selectedMentor._id,
                studentId: user.id,
                ...sessionData
            });
            alert('Session booked successfully!');
            setSelectedMentor(null);
            setSessionData({ title: '', scheduledAt: '', duration: 60 });
        } catch (error) {
            console.error('Failed to book session:', error);
            alert('Failed to book session');
        } finally {
            setBooking(false);
        }
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
                            <Link to="/sessions" className="text-gray-300 hover:text-white px-3 py-2">My Sessions</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-white mb-8">Find a Mentor</h1>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading mentors...</div>
                ) : mentors.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                        <p className="text-gray-400">No mentors available at the moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentors.map((mentor) => (
                            <div key={mentor._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {mentor.username[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white">{mentor.username}</h3>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <span className="text-yellow-500">{'⭐'.repeat(Math.round(mentor.mentorProfile?.rating || 0))}</span>
                                            <span className="text-gray-400 text-sm">
                                                ({mentor.mentorProfile?.rating?.toFixed(1) || '0.0'})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {mentor.bio && (
                                    <p className="text-gray-300 text-sm mb-4">{mentor.bio}</p>
                                )}

                                <div className="space-y-2 mb-4">
                                    {mentor.mentorProfile?.specializations && mentor.mentorProfile.specializations.length > 0 && (
                                        <div>
                                            <div className="text-gray-400 text-xs mb-1">Specializations</div>
                                            <div className="flex flex-wrap gap-1">
                                                {mentor.mentorProfile.specializations.map((spec, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Sessions</span>
                                        <span className="text-white">{mentor.mentorProfile?.totalSessions || 0}</span>
                                    </div>

                                    {mentor.mentorProfile?.hourlyRate && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Rate</span>
                                            <span className="text-green-500">${mentor.mentorProfile.hourlyRate}/hr</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedMentor(mentor)}
                                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Book Session
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {selectedMentor && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Book Session with {selectedMentor.username}
                        </h2>

                        <form onSubmit={handleBookSession} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Session Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={sessionData.title}
                                    onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., JavaScript Fundamentals"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={sessionData.scheduledAt}
                                    onChange={(e) => setSessionData({ ...sessionData, scheduledAt: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Duration (minutes)
                                </label>
                                <select
                                    value={sessionData.duration}
                                    onChange={(e) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>60 minutes</option>
                                    <option value={90}>90 minutes</option>
                                    <option value={120}>120 minutes</option>
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setSelectedMentor(null)}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={booking}
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
                                >
                                    {booking ? 'Booking...' : 'Book Session'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentors;
