import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import * as roomService from '../services/roomService';

const Room = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const { socket, connected, emit, on, off } = useSocket();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [code, setCode] = useState('');
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchRoom();
    }, [roomId]);

    useEffect(() => {
        if (room && socket && connected) {
            // Join room
            emit('join-room', {
                roomId: room.roomId,
                userId: user.id,
                username: user.username
            });

            // Listen for events
            on('user-joined', handleUserJoined);
            on('user-left', handleUserLeft);
            on('code-change', handleCodeChange);
            on('chat-message', handleChatMessage);

            return () => {
                off('user-joined', handleUserJoined);
                off('user-left', handleUserLeft);
                off('code-change', handleCodeChange);
                off('chat-message', handleChatMessage);

                emit('leave-room', { roomId: room.roomId });
            };
        }
    }, [room, socket, connected]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchRoom = async () => {
        try {
            const data = await roomService.getRoom(roomId);
            setRoom(data);
            setParticipants(data.participants || []);
            if (data.files && data.files.length > 0) {
                setCode(data.files[0].content);
            }
        } catch (error) {
            console.error('Failed to fetch room:', error);
            alert('Room not found');
            navigate('/rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleUserJoined = (data) => {
        setParticipants(prev => [...prev, data]);
        setMessages(prev => [...prev, {
            type: 'system',
            text: `${data.username} joined the room`
        }]);
    };

    const handleUserLeft = (data) => {
        setParticipants(prev => prev.filter(p => p.userId !== data.userId));
        setMessages(prev => [...prev, {
            type: 'system',
            text: `${data.username} left the room`
        }]);
    };

    const handleCodeChange = (data) => {
        setCode(data.code);
    };

    const handleChatMessage = (data) => {
        setMessages(prev => [...prev, {
            type: 'chat',
            username: data.username,
            text: data.message
        }]);
    };

    const onCodeChange = (value) => {
        setCode(value || '');
        if (socket && connected) {
            emit('code-change', {
                roomId: room.roomId,
                code: value || ''
            });
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (socket && connected) {
            emit('chat-message', {
                roomId: room.roomId,
                message: message.trim()
            });

            setMessages(prev => [...prev, {
                type: 'chat',
                username: user.username,
                text: message.trim(),
                isMe: true
            }]);

            setMessage('');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading room...</div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link to="/rooms" className="text-blue-500 hover:text-blue-400">
                        ← Leave Room
                    </Link>
                    <h1 className="text-xl font-bold text-white">{room?.name}</h1>
                    <span className="text-gray-400 text-sm">
                        {connected ? '🟢 Connected' : '🔴 Disconnected'}
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-sm">
                        {participants.length} participant{participants.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Code Editor */}
                <div className="flex-1 flex flex-col">
                    <Editor
                        height="100%"
                        language={room?.language || 'javascript'}
                        value={code}
                        onChange={onCodeChange}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true
                        }}
                    />
                </div>

                {/* Sidebar */}
                <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                    {/* Participants */}
                    <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-medium mb-3">Participants</h3>
                        <div className="space-y-2">
                            {participants.map((participant, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-300 text-sm">{participant.username}</span>
                                    {participant.role === 'owner' && (
                                        <span className="text-xs text-blue-500">(Owner)</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="flex-1 flex flex-col">
                        <div className="p-4 border-b border-gray-700">
                            <h3 className="text-white font-medium">Chat</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {messages.map((msg, idx) => (
                                <div key={idx}>
                                    {msg.type === 'system' ? (
                                        <div className="text-gray-500 text-sm text-center italic">
                                            {msg.text}
                                        </div>
                                    ) : (
                                        <div className={`${msg.isMe ? 'text-right' : ''}`}>
                                            <div className={`inline-block max-w-[80%] ${msg.isMe ? 'bg-blue-600' : 'bg-gray-700'
                                                } rounded-lg px-3 py-2`}>
                                                {!msg.isMe && (
                                                    <div className="text-xs text-gray-400 mb-1">{msg.username}</div>
                                                )}
                                                <div className="text-white text-sm">{msg.text}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;
