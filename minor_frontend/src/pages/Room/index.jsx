import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useTheme } from '../../context/ThemeContext';
import * as roomService from '../../services/roomService';
import * as pistonService from '../../services/pistonService';
import Whiteboard from '../../components/Whiteboard';
import RoomHeader from './components/RoomHeader';
import RoomSidebar from './components/RoomSidebar';
import RoomEditor from './components/RoomEditor';
import RoomChat from './components/RoomChat';

const Room = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const { socket, connected, emit, on, off } = useSocket();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [code, setCode] = useState('// Start coding here...\n');
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [output, setOutput] = useState('');
    const [running, setRunning] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const messagesEndRef = useRef(null);
    const outputEndRef = useRef(null);
    const hasJoinedRef = useRef(false);

    const [hasAccess, setHasAccess] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [showWhiteboard, setShowWhiteboard] = useState(false);


    // Theme integration
    const { theme } = useTheme();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const data = await roomService.getRoom(roomId);
                setRoom(data);
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
        fetchRoom();
    }, [roomId, navigate]);

    useEffect(() => {
        if (room && socket && connected && user && !hasJoinedRef.current) {
            hasJoinedRef.current = true;
            const myId = user.id || user._id;

            // Set initial access
            const isOwner = room.createdBy?._id === myId || user.role === 'mentor';
            setHasAccess(isOwner);

            emit('join-room', {
                roomId: room.roomId,
                userId: myId,
                username: user.username
            });

            // Initialize participants from room data
            if (room.participants) {
                setParticipants(room.participants.map(p => ({
                    userId: (p.userId && p.userId._id) ? p.userId._id : (p.userId || p._id),
                    username: p.username,
                    role: p.role,
                    hasAccess: p.canEdit
                })));
            }

            // Listen for events
            const handleUserJoined = (data) => {
                console.log('User joined:', data);
                const myId = user.id || user._id;

                setParticipants(prev => {
                    const exists = prev.some(p => String(p.userId || p._id) === String(data.userId));
                    if (exists) return prev;
                    return [...prev, {
                        userId: data.userId,
                        username: data.username,
                        role: data.role,
                        hasAccess: data.role === 'mentor' // Defaults
                    }];
                });

                if (String(data.userId) !== String(myId)) {
                    addToast(`${data.username} joined the room`, 'success');
                }
            };

            const handleUserLeft = (data) => {
                console.log('User left:', data);
                const myId = user.id || user._id;
                setParticipants(prev => prev.filter(p => String(p.userId || p._id) !== String(data.userId)));
                if (String(data.userId) !== String(myId)) {
                    addToast(`${data.username} left the room`, 'info');
                }
            };

            const handleCodeChange = (data) => {
                const myId = user.id || user._id;
                if (String(data.userId) !== String(myId)) {
                    setCode(data.code);
                }
            };

            const handleChatMessage = (data) => {
                setMessages(prev => [...prev, {
                    type: 'chat',
                    username: data.username,
                    text: data.message
                }]);
            };

            on('user-joined', handleUserJoined);
            on('user-left', handleUserLeft);
            on('code-change', handleCodeChange);
            on('chat-message', handleChatMessage);

            // Permission Events
            on('request-access', ({ userId, username }) => {
                if (isOwner) {
                    setPendingRequests(prev => {
                        if (prev.find(r => r.userId === userId)) return prev;
                        return [...prev, { userId, username }]
                    });
                    addToast(`${username} requests edit access`, 'warning');
                }
            });

            on('access-granted', ({ userId }) => {
                if (String(userId) === String(myId)) {
                    setHasAccess(true);
                    addToast('You have been granted edit access!', 'success');
                }
                // Update participant list
                setParticipants(prev => prev.map(p => {
                    if (String(p.userId || p._id) === String(userId)) {
                        return { ...p, hasAccess: true };
                    }
                    return p;
                }));
            });

            on('access-revoked', ({ userId }) => {
                if (String(userId) === String(myId)) {
                    setHasAccess(false);
                    addToast('Your edit access has been revoked.', 'error');
                }
                // Update participant list
                setParticipants(prev => prev.map(p => {
                    if (String(p.userId || p._id) === String(userId)) {
                        return { ...p, hasAccess: false };
                    }
                    return p;
                }));
            });



            return () => {
                off('user-joined', handleUserJoined);
                off('user-left', handleUserLeft);
                off('code-change', handleCodeChange);
                off('chat-message', handleChatMessage);
                off('request-access');
                off('access-granted');
                off('access-revoked');


                if (hasJoinedRef.current) {
                    emit('leave-room', { roomId: room.roomId, userId: myId });
                    hasJoinedRef.current = false;
                }
            };
        }
    }, [room, socket, connected, user, addToast]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [output]);



    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((msg, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    }, []);



    const onCodeChange = (value) => {
        setCode(value || '');
        const myId = user.id || user._id;
        if (socket && connected) {
            emit('code-change', {
                roomId: room.roomId,
                userId: myId,
                code: value || ''
            });
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (socket && connected) {
            const myId = user.id || user._id;
            emit('chat-message', {
                roomId: room.roomId,
                userId: myId,
                username: user.username,
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

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomId).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy room code');
        });
    };

    const runCode = async () => {
        setRunning(true);
        setOutput('Running code...\n');

        try {
            const result = await pistonService.executeCode(room.language, code);

            if (result.success) {
                let outputText = '';
                if (result.stdout) outputText += result.stdout;
                if (result.stderr) outputText += '\n' + result.stderr;
                if (!result.stdout && !result.stderr && result.output) outputText += result.output;

                setOutput(outputText || 'Program executed successfully with no output.');
            } else {
                setOutput(`Error: ${result.error}`);
            }
        } catch (error) {
            setOutput(`Execution failed: ${error.message}`);
        } finally {
            setRunning(false);
        }
    };

    const handleLeaveRoom = () => {
        if (socket && connected) {
            const myId = user.id || user._id;
            emit('leave-room', { roomId: room.roomId, userId: myId });
        }
        hasJoinedRef.current = false;
        navigate('/rooms');
    };

    if (loading) {
        return (
            <div className="h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden transition-colors duration-300">
            {/* Header */}
            <RoomHeader
                room={room}
                connected={connected}
                running={running}
                copied={copied}
                hasAccess={hasAccess}
                user={user}
                pendingRequests={pendingRequests}
                setPendingRequests={setPendingRequests}
                runCode={runCode}
                copyRoomCode={copyRoomCode}
                setShowLeaveConfirm={setShowLeaveConfirm}
                emit={emit}
                addToast={addToast}
                roomService={roomService}
                navigate={navigate}
            />

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium text-sm animate-in fade-in slide-in-from-top-5 pointer-events-auto flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' :
                            toast.type === 'success' ? 'bg-green-500' :
                                toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                    >
                        <span>{toast.msg}</span>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <RoomSidebar
                    room={room}
                    participants={participants}
                    user={user}
                    emit={emit}
                />

                {/* Center - Code Editor */}
                <RoomEditor
                    room={room}
                    code={code}
                    onCodeChange={onCodeChange}
                    theme={theme}
                    hasAccess={hasAccess}
                    user={user}
                    socket={socket}
                    connected={connected}
                    emit={emit}
                    output={output}
                    setOutput={setOutput}
                    outputEndRef={outputEndRef}
                />

                {/* Right Sidebar - Chat */}
                <RoomChat
                    messages={messages}
                    showWhiteboard={showWhiteboard}
                    setShowWhiteboard={setShowWhiteboard}
                    messagesEndRef={messagesEndRef}
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />

                {/* Whiteboard */}
                <Whiteboard roomId={roomId} isVisible={showWhiteboard} onClose={() => setShowWhiteboard(false)} />

                {/* Leave Room Confirmation Modal */}
                {
                    showLeaveConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowLeaveConfirm(false)}>
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Leave Room?</h2>
                                    <button onClick={() => setShowLeaveConfirm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">
                                        ×
                                    </button>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
                                        Are you sure you want to leave this room? Your code changes will be saved.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowLeaveConfirm(false)}
                                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleLeaveRoom}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md"
                                        >
                                            Leave Room
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Room;
