import React from 'react';

const RoomHeader = ({
    room,
    connected,
    running,
    copied,
    hasAccess,
    user,
    pendingRequests,
    setPendingRequests,
    runCode,
    copyRoomCode,
    setShowLeaveConfirm,
    emit,
    addToast,
    roomService,
    navigate
}) => {


    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setShowLeaveConfirm(true)}
                    className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                    ← Leave Room
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{room?.name}</h1>
                <span className={`text-sm ${connected ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {connected ? '● Connected' : '● Disconnected'}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={runCode}
                    disabled={running}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all hover:shadow-md"
                >
                    {running ? 'Running...' : '▶ Run Code'}
                </button>
                <button
                    onClick={copyRoomCode}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all hover:shadow-md"
                >
                    {copied ? '✓ Copied!' : 'Share Code'}
                </button>

                {/* Permission Controls */}
                {!hasAccess && (
                    <button
                        onClick={() => {
                            const myId = user.id || user._id;
                            emit('request-access', { roomId: room.roomId, userId: myId, username: user.username });
                            addToast('Request sent to mentor', 'info');
                        }}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold text-sm shadow-sm transition-all animate-pulse"
                    >
                        ✋ Request Access
                    </button>
                )}

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 w-64">
                        <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-white">Access Requests</h3>
                        {pendingRequests.map((req, i) => (
                            <div key={i} className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{req.username}</span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => {
                                            emit('grant-access', { roomId: room.roomId, userId: req.userId });
                                            setPendingRequests(prev => prev.filter(p => p.userId !== req.userId));
                                        }}
                                        className="p-1 px-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
                                    >✓</button>
                                    <button
                                        onClick={() => setPendingRequests(prev => prev.filter(p => p.userId !== req.userId))}
                                        className="p-1 px-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                                    >✗</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Close Room Button */}
                {(room?.createdBy?._id === (user.id || user._id) || user.role === 'mentor') && (
                    <button
                        onClick={async () => {
                            if (confirm('Are you sure you want to close this room? This will disconnect all users.')) {
                                try {
                                    await roomService.closeRoom(room.roomId);
                                    navigate('/rooms');
                                } catch (err) {
                                    console.error(err);
                                    alert('Failed to close room');
                                }
                            }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all hover:shadow-md"
                    >
                        Close Room
                    </button>
                )}
            </div>
        </div>
    );
};

export default RoomHeader;
