import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import * as problemService from '../services/problemService';
import * as submissionService from '../services/submissionService';

const ProblemSolve = () => {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [testResults, setTestResults] = useState(null);

    useEffect(() => {
        fetchProblem();
    }, [id]);

    const fetchProblem = async () => {
        try {
            const data = await problemService.getProblem(id);
            setProblem(data);
            setCode(data.starterCode || getDefaultCode(language));
        } catch (error) {
            console.error('Failed to fetch problem:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDefaultCode = (lang) => {
        const templates = {
            javascript: '// Write your solution here\nfunction solve() {\n  \n}\n',
            python: '# Write your solution here\ndef solve():\n    pass\n',
            java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}',
            cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
            c: '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}'
        };
        return templates[lang] || '';
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        setCode(getDefaultCode(newLang));
    };

    const handleRun = async () => {
        setSubmitting(true);
        setOutput('');
        try {
            const result = await submissionService.executeCode(code, language);
            setOutput(result.output || result.error || 'No output');
        } catch (error) {
            setOutput('Error: ' + (error.response?.data?.error || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setTestResults(null);
        try {
            const result = await submissionService.submitSolution(id, code, language);
            setTestResults(result);
            setOutput(`${result.passed}/${result.total} test cases passed`);
        } catch (error) {
            setOutput('Submission failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading problem...</div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Problem not found</div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link to="/problems" className="text-blue-500 hover:text-blue-400">
                        ← Back
                    </Link>
                    <h1 className="text-xl font-bold text-white">{problem.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm ${problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
                            problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-red-500/20 text-red-500'
                        }`}>
                        {problem.difficulty}
                    </span>
                </div>
                <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                </select>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Problem Description */}
                <div className="w-1/2 border-r border-gray-700 overflow-y-auto p-6">
                    <div className="text-white space-y-4">
                        <div>
                            <h2 className="text-lg font-bold mb-2">Description</h2>
                            <p className="text-gray-300 whitespace-pre-wrap">{problem.description}</p>
                        </div>

                        {problem.testCases && problem.testCases.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold mb-2">Examples</h2>
                                {problem.testCases.filter(tc => !tc.hidden).map((tc, idx) => (
                                    <div key={idx} className="bg-gray-800 rounded-lg p-4 mb-3">
                                        <div className="mb-2">
                                            <span className="text-gray-400">Input:</span>
                                            <pre className="text-green-400 mt-1">{tc.input}</pre>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Output:</span>
                                            <pre className="text-blue-400 mt-1">{tc.output}</pre>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Code Editor */}
                <div className="w-1/2 flex flex-col">
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || '')}
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

                    {/* Output Panel */}
                    <div className="h-48 bg-gray-800 border-t border-gray-700 p-4 overflow-y-auto">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-medium">Output</h3>
                            <div className="space-x-2">
                                <button
                                    onClick={handleRun}
                                    disabled={submitting}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg transition-colors"
                                >
                                    {submitting ? 'Running...' : 'Run Code'}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
                                >
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>

                        {testResults && (
                            <div className="mb-3">
                                <div className={`text-lg font-bold ${testResults.status === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
                                    {testResults.status === 'accepted' ? '✓ Accepted' : '✗ Wrong Answer'}
                                </div>
                                <div className="text-gray-400 text-sm">{testResults.passed}/{testResults.total} test cases passed</div>
                            </div>
                        )}

                        <pre className="text-gray-300 text-sm whitespace-pre-wrap">{output}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemSolve;
