import React from 'react';

const RoomSidebar = ({
    room,
    participants,
    user,
    emit
}) => {
    return (
        <div className="w-56 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* File Explorer */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Explorer</h3>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2 py-1.5 px-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                        </svg>
                        <span>main.{room?.language === 'python' ? 'py' : room?.language === 'java' ? 'java' : 'js'}</span>
                    </div>
                </div>
            </div>

            {/* Participants */}
            <div className="flex-1 p-3 overflow-y-auto">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">
                    Participants ({participants.length})
                </h3>
                <div className="space-y-1">
                    {participants.map((participant, idx) => {
                        const myId = user.id || user._id;
                        const isMe = String(participant.userId) === String(myId);
                        const isMentor = participant.role === 'mentor' || String(room.createdBy?._id || room.createdBy) === String(participant.userId);
                        const iAmMentor = (user.role === 'mentor') || (String(room.createdBy?._id || room.createdBy) === String(myId));

                        return (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 py-1.5 px-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
                                <div className={`w-2 h-2 rounded-full ${isMentor ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                <span className="font-medium truncate max-w-[100px]" title={participant.username}>{participant.username}</span>
                                {isMentor && (
                                    <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-1.5 py-0.5 rounded-full font-bold uppercase">Mentor</span>
                                )}
                                {isMe && (
                                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold ml-auto">(You)</span>
                                )}
                                {/* Mentor Controls */}
                                {iAmMentor && !isMe && !isMentor && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (participant.hasAccess) {
                                                emit('revoke-access', { roomId: room.roomId, userId: participant.userId });
                                            } else {
                                                emit('grant-access', { roomId: room.roomId, userId: participant.userId });
                                            }
                                        }}
                                        className={`ml-auto p-1 rounded transition-colors ${participant.hasAccess
                                            ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                                            : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        title={participant.hasAccess ? "Revoke Write Access" : "Grant Write Access"}
                                    >
                                        {participant.hasAccess ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoomSidebar;
