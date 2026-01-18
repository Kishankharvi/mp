import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as sessionService from '../services/sessionService';
import * as roomService from '../services/roomService';

const SessionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [notes, setNotes] = useState('');
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await sessionService.getSession(id);
                setSession(data);
                setNotes(data.notes || '');
            } catch (error) {
                console.error('Failed to fetch session:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [id]);

    const handleComplete = async () => {
        setCompleting(true);
        try {
            await sessionService.completeSession(id, notes, rating);
            alert('Session completed successfully!');
            navigate('/sessions');
        } catch (error) {
            console.error('Failed to complete session:', error);
            alert('Failed to complete session');
        } finally {
            setCompleting(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this session?')) return;

        try {
            await sessionService.cancelSession(id);
            alert('Session cancelled');
            navigate('/sessions');
        } catch (error) {
            console.error('Failed to cancel session:', error);
            alert('Failed to cancel session');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading session...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Session not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/sessions" className="text-blue-500 hover:text-blue-400">
                                ← Back to Sessions
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                    <h1 className="text-3xl font-bold text-white mb-6">{session.title}</h1>

                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-gray-400 text-sm mb-1">Mentor</div>
                                <div className="text-white">{session.mentorId?.username}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm mb-1">Student</div>
                                <div className="text-white">{session.studentId?.username}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm mb-1">Scheduled</div>
                                <div className="text-white">{new Date(session.scheduledAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm mb-1">Duration</div>
                                <div className="text-white">{session.duration} minutes</div>
                            </div>
                        </div>
                    </div>

                    {session.status === 'scheduled' && (
                        <div className="mb-8">
                            <button
                                onClick={async () => {
                                    try {
                                        const btn = document.getElementById('enter-room-btn');
                                        if (btn) btn.innerHTML = 'Connecting to Room...';
                                        const roomId = await roomService.joinSessionRoom(session);
                                        window.location.href = `/room/${roomId}`;
                                    } catch (err) {
                                        console.error(err);
                                        alert('Failed to connect to live room');
                                        const btn = document.getElementById('enter-room-btn');
                                        if (btn) btn.innerHTML = 'Enter Live Room';
                                    }
                                }}
                                id="enter-room-btn"
                                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8zm2 3h6v-3H7v3z" />
                                </svg>
                                Enter Live Room
                            </button>
                        </div>
                    )}

                    {session.status === 'scheduled' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Session Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add notes about the session..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Rating
                                </label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="text-3xl focus:outline-hidden"
                                        >
                                            {star <= rating ? '⭐' : '☆'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Cancel Session
                                </button>
                                <button
                                    onClick={handleComplete}
                                    disabled={completing}
                                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
                                >
                                    {completing ? 'Completing...' : 'Complete Session'}
                                </button>
                            </div>
                        </div>
                    )}

                    {session.status === 'completed' && (
                        <div className="space-y-4">
                            {session.notes && (
                                <div>
                                    <div className="text-gray-400 text-sm mb-2">Notes</div>
                                    <div className="text-white bg-gray-700 rounded-lg p-4">{session.notes}</div>
                                </div>
                            )}
                            {session.rating && (
                                <div>
                                    <div className="text-gray-400 text-sm mb-2">Rating</div>
                                    <div className="text-2xl">{'⭐'.repeat(session.rating)}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionDetail;
