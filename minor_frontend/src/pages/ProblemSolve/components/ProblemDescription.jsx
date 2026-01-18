import React from 'react';

const ProblemDescription = ({ problem }) => {
    return (
        <div className="w-5/12 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 flex gap-4">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500 pb-2 -mb-3.5 px-1 font-medium cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Description
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 text-gray-600 dark:text-gray-300 custom-scrollbar">
                <div className="prose dark:prose-invert max-w-none">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{problem.title}</h2>
                    <div className="whitespace-pre-wrap leading-relaxed">{problem.description}</div>

                    {problem.testCases && problem.testCases.length > 0 && (
                        <div className="mt-8 space-y-6">
                            {problem.testCases.filter(tc => !tc.hidden).map((tc, idx) => (
                                <div key={idx} className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                                    <div className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Example {idx + 1}</div>
                                    <div className="flex gap-4 mb-2">
                                        <span className="w-16 text-gray-500 dark:text-gray-400 font-mono text-xs shrink-0 pt-0.5">Input:</span>
                                        <code className="bg-gray-200 dark:bg-gray-950 px-2 py-0.5 rounded text-gray-800 dark:text-gray-200 font-mono text-sm">{tc.input}</code>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="w-16 text-gray-500 dark:text-gray-400 font-mono text-xs shrink-0 pt-0.5">Output:</span>
                                        <code className="bg-gray-200 dark:bg-gray-950 px-2 py-0.5 rounded text-gray-800 dark:text-gray-200 font-mono text-sm">{tc.output}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemDescription;
