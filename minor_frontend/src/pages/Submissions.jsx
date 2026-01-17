import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as submissionService from '../services/submissionService';

const Submissions = () => {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, [user]);

    const fetchSubmissions = async () => {
        try {
            const data = await submissionService.getUserSubmissions(user.id);
            setSubmissions(data);
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-500/20 text-green-500';
            case 'wrong_answer': return 'bg-red-500/20 text-red-500';
            case 'error': return 'bg-orange-500/20 text-orange-500';
            default: return 'bg-gray-500/20 text-gray-500';
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
                <h1 className="text-3xl font-bold text-white mb-6">My Submissions</h1>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading submissions...</div>
                ) : submissions.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                        <p className="text-gray-400 mb-4">No submissions yet</p>
                        <Link to="/problems" className="text-blue-500 hover:text-blue-400">
                            Start solving problems →
                        </Link>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Problem</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Language</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tests Passed</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {submissions.map((submission) => (
                                    <tr key={submission._id} className="hover:bg-gray-700/50">
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/problems/${submission.problemId?._id}`}
                                                className="text-blue-500 hover:text-blue-400"
                                            >
                                                {submission.problemId?.title || 'Unknown Problem'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 capitalize">{submission.language}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(submission.status)}`}>
                                                {submission.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {submission.testsPassed}/{submission.testsTotal}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(submission.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Submissions;
