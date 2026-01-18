import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        setError('');

        try {
            await sessionService.createSession({
                mentorId: selectedMentor._id,
                studentId: user.id,
                ...sessionData
            });
            setSuccess('Session booked successfully!');
            setSelectedMentor(null);
            setSessionData({ title: '', scheduledAt: '', duration: 60 });
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Failed to book session:', error);
            setError(error.response?.data?.error || 'Failed to book session');
        } finally {
            setBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />

            <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-12 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            Expert Guidance
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Perfect Mentor</span>
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto md:mx-0">
                        Connect with industry experts for 1-on-1 guidance, code reviews, and career advice.
                    </p>
                </div>

                {success && (
                    <div className="mb-8 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm">
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="font-semibold">{success}</span>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 h-96 animate-pulse">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-8">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                                </div>
                                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-full mt-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : mentors.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm border border-gray-100 dark:border-gray-800 max-w-2xl mx-auto">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No mentors available at the moment.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Check back later for new experts!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mentors.map((mentor) => (
                            <div key={mentor._id} className="group bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/10 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 text-2xl font-bold border border-orange-50 dark:border-orange-900/20 shadow-inner">
                                            {mentor.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{mentor.username}</h3>
                                            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
                                                <span className="text-gray-900 dark:text-white">${mentor.mentorProfile?.hourlyRate}</span>/hr
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs px-2.5 py-1 rounded-lg font-bold border border-yellow-100 dark:border-yellow-900/30 flex items-center gap-1">
                                        <span>⭐</span> {mentor.mentorProfile?.rating?.toFixed(1) || '0.0'}
                                    </div>
                                </div>

                                <div className="flex-1 mb-6 relative z-10">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {mentor.mentorProfile?.specialization?.slice(0, 3).map((spec, index) => (
                                            <span key={index} className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-3 py-1.5 rounded-lg font-semibold border border-gray-100 dark:border-gray-700">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                                        {mentor.mentorProfile?.bio || 'Experienced mentor ready to help you learn and grow through 1-on-1 sessions.'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedMentor(mentor);
                                    }}
                                    className="w-full bg-gray-900 dark:bg-gray-800 hover:bg-orange-600 dark:hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 transform active:scale-95 relative z-10"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Book Session
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">with <span className="text-orange-600 dark:text-orange-400">{selectedMentor.username}</span></p>
                            </div>
                            <button onClick={() => setSelectedMentor(null)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-8">
                            {error && (
                                <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleBookSession} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Session Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={sessionData.title}
                                        onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="e.g., JavaScript Fundamentals"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={sessionData.scheduledAt}
                                        onChange={(e) => setSessionData({ ...sessionData, scheduledAt: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Duration
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={sessionData.duration}
                                            onChange={(e) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        >
                                            <option value={30}>30 minutes</option>
                                            <option value={60}>60 minutes</option>
                                            <option value={90}>90 minutes</option>
                                            <option value={120}>120 minutes</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={booking}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                >
                                    {booking ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Booking...
                                        </span>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentors;
