import React from 'react';
import Editor from '@monaco-editor/react';

const ProblemWorkspace = ({
    language,
    code,
    setCode,
    theme,
    testResults,
    output
}) => {
    return (
        <div className="w-7/12 flex flex-col bg-white dark:bg-gray-950">
            <div className="flex-1 border-b border-gray-200 dark:border-gray-800 relative">
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20 },
                    }}
                />
            </div>

            {/* Output Panel */}
            <div className="h-2/6 bg-gray-50 dark:bg-gray-900 flex flex-col">
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 flex justify-between items-center h-10">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Console
                    </span>
                    {/* Clear Button could go here */}
                </div>
                <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                    {testResults ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className={`p-4 rounded-xl mb-4 border ${testResults.status === 'accepted'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {testResults.status === 'accepted' ? (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )}
                                    <span className="text-lg font-bold">
                                        {testResults.status === 'accepted' ? 'Accepted' : 'Wrong Answer'}
                                    </span>
                                </div>
                                <div className="pl-9">
                                    <div className={`text-sm ${testResults.status === 'accepted' ? 'text-green-300' : 'text-red-300'}`}>
                                        {testResults.passed}/{testResults.total} test cases passed
                                    </div>
                                </div>
                            </div>
                            <pre className="text-gray-500 dark:text-gray-400 p-2">{output}</pre>
                        </div>
                    ) : output ? (
                        <pre className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed animate-in fade-in">{output}</pre>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                            <p>Run your code to see output here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemWorkspace;
