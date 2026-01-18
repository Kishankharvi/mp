import React from 'react';

const RoomChat = ({
    messages,
    showWhiteboard,
    setShowWhiteboard,
    messagesEndRef,
    message,
    setMessage,
    sendMessage
}) => {
    return (
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Chat</h3>
                <button
                    onClick={() => setShowWhiteboard(prev => !prev)}
                    className={`p-1.5 rounded-lg transition-colors ${showWhiteboard ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    title="Toggle Whiteboard"
                >
                    ✏️
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        {msg.type === 'system' ? (
                            <div className="text-gray-400 dark:text-gray-500 text-xs text-center italic my-2">
                                {msg.text}
                            </div>
                        ) : (
                            <div className={`${msg.isMe ? 'text-right' : ''}`}>
                                <div className={`inline-block max-w-[85%] ${msg.isMe ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                                    } rounded-2xl px-4 py-2 shadow-sm text-left`}>
                                    {!msg.isMe && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-bold">{msg.username}</div>
                                    )}
                                    <div className="text-sm">{msg.text}</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoomChat;
