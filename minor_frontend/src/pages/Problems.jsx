import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as problemService from '../services/problemService';

const Problems = () => {
    const [problems, setProblems] = useState([]);
    const [difficulty, setDifficulty] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProblems();
    }, [difficulty, search]);

    const fetchProblems = async () => {
        try {
            const data = await problemService.getProblems(difficulty, search);
            setProblems(data);
        } catch (error) {
            console.error('Failed to fetch problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'easy': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'hard': return 'text-red-500';
            default: return 'text-gray-500';
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
                            <Link to="/rooms" className="text-gray-300 hover:text-white px-3 py-2">Rooms</Link>
                            <Link to="/sessions" className="text-gray-300 hover:text-white px-3 py-2">Sessions</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Coding Problems</h1>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading problems...</div>
                ) : (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Difficulty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acceptance</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {problems.map((problem) => (
                                    <tr key={problem._id} className="hover:bg-gray-700/50">
                                        <td className="px-6 py-4 text-white">{problem.title}</td>
                                        <td className={`px-6 py-4 font-medium capitalize ${getDifficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {problem.totalSubmissions > 0
                                                ? `${((problem.acceptedSubmissions / problem.totalSubmissions) * 100).toFixed(1)}%`
                                                : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/problems/${problem._id}`}
                                                className="text-blue-500 hover:text-blue-400 font-medium"
                                            >
                                                Solve
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {problems.length === 0 && (
                            <div className="text-center py-12 text-gray-400">No problems found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Problems;
