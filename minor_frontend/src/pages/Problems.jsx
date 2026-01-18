import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import * as problemService from '../services/problemService';

const Problems = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [difficulty, setDifficulty] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const canCreateProblems = user && (user.role === 'admin' || user.role === 'mentor');

    // MOCK DATA for demonstration if API returns empty
    const mockProblems = [
        { _id: '1', title: 'Two Sum', difficulty: 'easy', acceptance: 48.5, tags: ['Array', 'Hash Table'] },
        { _id: '2', title: 'Add Two Numbers', difficulty: 'medium', acceptance: 39.2, tags: ['Linked List', 'Math'] },
        { _id: '3', title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', acceptance: 33.8, tags: ['String', 'Sliding Window'] },
        { _id: '4', title: 'Median of Two Sorted Arrays', difficulty: 'hard', acceptance: 35.6, tags: ['Array', 'Binary Search'] },
        { _id: '5', title: 'Longest Palindromic Substring', difficulty: 'medium', acceptance: 32.4, tags: ['String', 'DP'] },
    ];

    useEffect(() => {
        fetchProblems();
    }, [difficulty, search]);

    const fetchProblems = async () => {
        try {
            // Simulate API delay for smoother UX feel
            await new Promise(resolve => setTimeout(resolve, 600));
            const data = await problemService.getProblems(difficulty === 'all' ? '' : difficulty, search);

            // Use mock data if API returns empty to show UI potential
            if (data.length === 0 && !search && difficulty === 'all') {
                setProblems(mockProblems);
            } else {
                setProblems(data);
            }
        } catch (error) {
            console.error('Failed to fetch problems:', error);
            setProblems(mockProblems); // Fallback to mock data on error/empty
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (diff) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-700 border-green-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'hard': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />

            <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
                            <span className="text-orange-600 font-semibold tracking-wide uppercase text-sm">Practice Arena</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Coding Problems
                        </h1>
                        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                            Sharpen your skills with our curated collection of algorithmic challenges.
                        </p>
                    </div>

                    {canCreateProblems && (
                        <Link
                            to="/problems/create"
                            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Problem
                        </Link>
                    )}
                </div>}

                {/* Search & Filter Bar */}
                <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mb-8 flex flex-col md:flex-row gap-2 transition-colors duration-300">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-200 placeholder-gray-400 sm:text-sm font-medium"
                        />
                    </div>

                    <div className="border-l border-gray-100 dark:border-gray-800 hidden md:block"></div>

                    <div className="md:w-64">
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="block w-full py-3 pl-4 pr-10 bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300 font-medium sm:text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors appearance-none"
                            style={{ backgroundImage: 'none' }}
                        >
                            <option className="dark:bg-gray-900" value="all">All Difficulties</option>
                            <option className="dark:bg-gray-900" value="easy">Easy</option>
                            <option className="dark:bg-gray-900" value="medium">Medium</option>
                            <option className="dark:bg-gray-900" value="hard">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden min-h-[400px] transition-colors duration-300">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 md:h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse">Loading challenges...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                        <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Difficulty</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acceptance</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {problems.length > 0 ? (
                                        problems.map((problem, index) => (
                                            <tr
                                                key={problem._id || index}
                                                className="group hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors duration-200 cursor-default"
                                            >
                                                <td className="px-8 py-5 whitespace-nowrap">
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-orange-400 transition-colors"></div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-gray-200 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors text-base">
                                                                {problem.title}
                                                            </div>
                                                            {problem.tags && (
                                                                <div className="flex gap-2 mt-1">
                                                                    {problem.tags.slice(0, 3).map(tag => (
                                                                        <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-medium">
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                                                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                    {problem.acceptance ? `${problem.acceptance}%` : 'N/A'}
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => navigate(`/problems/${problem._id}`)}
                                                        className="text-orange-600 hover:text-white border border-orange-200 hover:bg-orange-600 hover:border-orange-600 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        Solve Problem
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-24 text-center">
                                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">🔍</div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No problems found</h3>
                                                <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                                                    We couldn't find any problems matching your current filters. Try changing the difficulty.
                                                </p>
                                                <button
                                                    onClick={() => { setSearch(''); setDifficulty('all'); }}
                                                    className="mt-6 text-orange-600 font-semibold hover:text-orange-700"
                                                >
                                                    Clear Filters
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Problems;
