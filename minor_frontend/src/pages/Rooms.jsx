import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as roomService from '../services/roomService';

const Rooms = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [creating, setCreating] = useState(false);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            const room = await roomService.createRoom({
                name: roomName,
                language,
                username: user.username
            });
            navigate(`/room/${room.roomId}`);
        } catch (error) {
            console.error('Failed to create room:', error);
            alert('Failed to create room');
        } finally {
            setCreating(false);
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
                            <Link to="/problems" className="text-gray-300 hover:text-white px-3 py-2">Problems</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Collaborative Rooms</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Create Room
                    </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                    <p className="text-gray-400 mb-4">Create a room to start collaborating with others</p>
                    <p className="text-gray-500 text-sm">Real-time code editing, chat, and execution</p>
                </div>
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Room</h2>

                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Room Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="My Coding Session"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Language
                                </label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                    <option value="c">C</option>
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
                                >
                                    {creating ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
