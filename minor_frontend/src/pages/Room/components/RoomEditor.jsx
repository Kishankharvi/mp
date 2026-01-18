import React from 'react';
import Editor from '@monaco-editor/react';

const RoomEditor = ({
    room,
    code,
    onCodeChange,
    theme,
    hasAccess,
    user,
    socket,
    connected,
    emit,
    output,
    setOutput,
    outputEndRef
}) => {
    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1">
                <Editor
                    height="100%"
                    language={room?.language || 'javascript'}
                    value={code}
                    onChange={onCodeChange}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                        readOnly: !hasAccess,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16 },
                        fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
                    }}
                    onMount={(editor) => {
                        editor.onDidChangeCursorPosition((e) => {
                            if (socket && connected) {
                                const myId = user.id || user._id; // Normalized ID
                                emit('cursor-change', {
                                    roomId: room.roomId,
                                    userId: myId,
                                    username: user.username,
                                    position: e.position
                                });
                            }
                        });
                    }}
                />
            </div>

            {/* Terminal */}
            <div className="h-48 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="px-4 py-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Terminal</span>
                    <button
                        onClick={() => setOutput('')}
                        className="text-xs font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Clear
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900">
                    <pre className="whitespace-pre-wrap">{output || 'Click "Run Code" to see output here...'}</pre>
                    <div ref={outputEndRef} />
                </div>
            </div>
        </div>
    );
};

export default RoomEditor;
