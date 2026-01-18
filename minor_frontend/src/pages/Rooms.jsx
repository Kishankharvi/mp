import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import * as roomService from '../services/roomService';

const Rooms = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [roomCode, setRoomCode] = useState('');
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');



    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError('');

        try {
            const room = await roomService.createRoom({
                name: roomName,
                language,
                username: user.username
            });
            navigate(`/room/${room.roomId}`);
        } catch (error) {
            console.error('Failed to create room:', error);
            setError('Failed to create room. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        setJoining(true);
        setError('');

        try {
            navigate(`/room/${roomCode.trim()}`);
        } catch (error) {
            console.error('Failed to join room:', error);
            setError('Invalid room code. Please check and try again.');
        } finally {
            setJoining(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />

            <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <div className="flex justify-center mb-4">
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">Real-time Collaboration</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                        Code Together, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Anywhere.</span>
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                        Create a room to start a pair programming session or join an existing one with a code.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Create Room Card */}
                    <div
                        onClick={() => setShowCreateModal(true)}
                        className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden text-center hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -mr-16 -mt-16"></div>

                        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            ⚡
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">Start a New Room</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                            Create a sandbox environment, choose your language, and invite peers.
                        </p>
                        <button className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-3 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                            Create Room
                        </button>
                    </div>

                    {/* Join Room Card */}
                    <div
                        onClick={() => setShowJoinModal(true)}
                        className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden text-center hover:-translate-y-1"
                    >
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -ml-16 -mb-16"></div>

                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                            🔗
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">Join with Code</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                            Have a room code? Enter it to jump straight into an active session.
                        </p>
                        <button className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                            Join Room
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals - keeping existing logic but styling them */}
            {(showCreateModal || showJoinModal) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {showCreateModal ? 'Create New Room' : 'Join Room'}
                            </h2>
                            <button
                                onClick={() => { setShowCreateModal(false); setShowJoinModal(false); }}
                                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-8">
                            {error && (
                                <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {error}
                                </div>
                            )}

                            {showCreateModal ? (
                                <form onSubmit={handleCreateRoom} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Room Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            placeholder="e.g. Algo Practice"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Language</label>
                                        <div className="relative">
                                            <select
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            >
                                                <option value="javascript">JavaScript</option>
                                                <option value="python">Python</option>
                                                <option value="java">Java</option>
                                                <option value="cpp">C++</option>
                                                <option value="c">C</option>
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
                                        disabled={creating}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {creating ? 'Creating Room...' : 'Create Room'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleJoinRoom} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Room Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={roomCode}
                                            onChange={(e) => setRoomCode(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono text-center text-lg tracking-widest uppercase bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            placeholder="XXXX-XXXX"
                                            autoFocus
                                        />
                                        <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">Ask the room creator for the code</p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={joining || !roomCode.trim()}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {joining ? 'Joining...' : 'Join Room'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
