import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import * as sessionService from '../services/sessionService';
import * as roomService from '../services/roomService';

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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleStatusUpdate = async (sessionId, status) => {
        try {
            await sessionService.updateSessionStatus(sessionId, status);
            fetchSessions(); // Refresh list
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update session status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />

            <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
                            <span className="text-orange-600 dark:text-orange-400 font-semibold tracking-wide uppercase text-sm">Mentorship</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            My Sessions
                        </h1>
                        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                            Track your upcoming and past mentorship sessions.
                        </p>
                    </div>
                    <Link
                        to="/mentors"
                        className="bg-gray-900 dark:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Book New Session
                    </Link>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-fit transition-colors duration-300">
                    {['all', 'scheduled', 'completed', 'cancelled'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === f
                                ? 'bg-gray-900 dark:bg-gray-700 text-white shadow-md'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading sessions...</p>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                            📅
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No sessions found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            {filter === 'all'
                                ? "You haven't booked any sessions yet. Connect with a mentor to get started!"
                                : `No ${filter} sessions found.`}
                        </p>
                        {filter === 'all' && (
                            <Link to="/mentors" className="text-orange-600 dark:text-orange-400 font-bold hover:text-orange-800 dark:hover:text-orange-300 underline">
                                Find a mentor now
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredSessions.map((session) => (
                            <div key={session._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(session.status)} uppercase tracking-wider`}>
                                                {session.status}
                                            </span>
                                            <span className="text-sm text-gray-400 font-medium">
                                                {session.duration} mins
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                            {session.title || 'Mentorship Session'}
                                        </h3>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-4">
                                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {(user.role === 'mentor' ? session.studentId?.username : session.mentorId?.username)?.[0]?.toUpperCase()}
                                                </div>
                                                <span className="font-semibold">
                                                    {user.role === 'mentor' ? session.studentId?.username : session.mentorId?.username}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(session.scheduledAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {new Date(session.scheduledAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        {session.notes && (
                                            <div className="mt-6 bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30 text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-bold text-gray-900 dark:text-white block mb-1">Notes:</span>
                                                {session.notes}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {session.status === 'pending' && user.role === 'mentor' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(session._id, 'scheduled')}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(session._id, 'cancelled')}
                                                    className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {session.status === 'pending' && user.role !== 'mentor' && (
                                            <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 italic">
                                                Waiting for approval...
                                            </span>
                                        )}
                                        {session.status === 'scheduled' && (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const btn = document.getElementById(`join-btn-${session._id}`);
                                                        if (btn) btn.innerHTML = 'Connecting...';
                                                        const roomId = await roomService.joinSessionRoom(session);
                                                        window.location.href = `/room/${roomId}`;
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert('Failed to join room');
                                                        const btn = document.getElementById(`join-btn-${session._id}`);
                                                        if (btn) btn.innerHTML = 'Join Room';
                                                    }
                                                }}
                                                id={`join-btn-${session._id}`}
                                                className="w-full md:w-auto text-center bg-gray-900 dark:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 dark:hover:bg-orange-600 transition-colors shadow-md"
                                            >
                                                Join Room
                                            </button>
                                        )}
                                        {session.status === 'completed' && session.rating && (
                                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-xl border border-yellow-100 dark:border-yellow-900/30 font-bold">
                                                <span>★</span> {session.rating}/5
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sessions;
