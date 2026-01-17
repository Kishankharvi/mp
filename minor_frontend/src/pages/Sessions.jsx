import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as sessionService from '../services/sessionService';

const Sessions = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, scheduled, completed, cancelled

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const data = await sessionService.getMySessions();
            setSessions(data);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = sessions.filter(session => {
        if (filter === 'all') return true;
        return session.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-500/20 text-blue-500';
            case 'completed': return 'bg-green-500/20 text-green-500';
            case 'cancelled': return 'bg-red-500/20 text-red-500';
            default: return 'bg-gray-500/20 text-gray-500';
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
                            <Link to="/mentors" className="text-gray-300 hover:text-white px-3 py-2">Find Mentors</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">My Sessions</h1>
                    <Link
                        to="/mentors"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Book a Session
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-2 mb-6">
                    {['all', 'scheduled', 'completed', 'cancelled'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize transition-colors ${filter === f
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading sessions...</div>
                ) : filteredSessions.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                        <p className="text-gray-400 mb-4">No sessions found</p>
                        <Link to="/mentors" className="text-blue-500 hover:text-blue-400">
                            Find a mentor →
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredSessions.map((session) => (
                            <div key={session._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2">{session.title}</h3>
                                        <div className="space-y-1 text-sm text-gray-400">
                                            <div>
                                                {user.role === 'mentor' ? 'Student' : 'Mentor'}: {' '}
                                                <span className="text-white">
                                                    {user.role === 'mentor'
                                                        ? session.studentId?.username
                                                        : session.mentorId?.username}
                                                </span>
                                            </div>
                                            <div>
                                                Scheduled: {new Date(session.scheduledAt).toLocaleString()}
                                            </div>
                                            <div>Duration: {session.duration} minutes</div>
                                            {session.rating && (
                                                <div>Rating: {'⭐'.repeat(session.rating)}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </span>
                                        {session.status === 'scheduled' && (
                                            <Link
                                                to={`/sessions/${session._id}`}
                                                className="text-blue-500 hover:text-blue-400 text-sm"
                                            >
                                                View Details →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                {session.notes && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-gray-300 text-sm">{session.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sessions;
