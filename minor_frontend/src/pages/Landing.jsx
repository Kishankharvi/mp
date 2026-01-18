import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';

const Landing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');

    const openAuthModal = (mode = 'login') => {
        setAuthMode(mode);
        setAuthModalOpen(true);
    };

    if (user) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 selection:bg-orange-100 dark:selection:bg-orange-900 selection:text-orange-900 dark:selection:text-orange-100 overflow-x-hidden font-sans transition-colors duration-300">
            <Navbar onOpenAuth={openAuthModal} />

            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-200 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-pink-200 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 dark:opacity-10 dark:invert"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto mb-16 relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-orange-100/50 dark:border-orange-500/20 text-orange-700 dark:text-orange-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 shadow-xs hover:scale-105 transition-transform cursor-default">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            v2.0 is now live
                        </div>

                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">
                            Code Together.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 animate-gradient-x">
                                Build Faster.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                            The collaborative code editor that brings mentors, students, and teams together in a seamless, real-time environment.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => openAuthModal('register')}
                                className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden whitespace-nowrap"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative flex items-center gap-2">
                                    Start Coding Now
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                            <button
                                onClick={() => openAuthModal('login')}
                                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                            >
                                View Demo Room
                            </button>
                        </div>
                    </div>

                    {/* 3D Mockup Container */}
                    <div className="relative mx-auto max-w-5xl transform hover:scale-[1.01] transition-transform duration-700 ease-out z-0 perspective-1000">
                        <div className="relative rounded-2xl bg-gray-900/95 shadow-2xl border border-gray-800 p-2 lg:p-4 rotate-x-12 hover:rotate-0 transition-transform duration-700 backdrop-blur-xl">
                            {/* Window Config */}
                            <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800/50 rounded-t-xl flex items-center px-4 gap-2 border-b border-gray-700/50">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                <div className="ml-4 px-3 py-1 bg-gray-900/50 rounded-md text-xs text-gray-400 font-mono">
                                    problem_solver.js
                                </div>
                            </div>

                            {/* Code Content Mockup */}
                            <div className="mt-8 grid grid-cols-12 gap-0 lg:gap-8 h-[300px] lg:h-[500px] overflow-hidden rounded-b-lg bg-gray-900">
                                {/* Sidebar */}
                                <div className="hidden lg:block col-span-2 border-r border-gray-800 p-4 space-y-4">
                                    <div className="h-2 w-16 bg-gray-800 rounded"></div>
                                    <div className="h-2 w-24 bg-gray-800 rounded"></div>
                                    <div className="h-2 w-20 bg-gray-800 rounded"></div>
                                    <div className="mt-8 space-y-2">
                                        <div className="h-2 w-full bg-gray-800/50 rounded"></div>
                                        <div className="h-2 w-full bg-gray-800/50 rounded"></div>
                                        <div className="h-2 w-3/4 bg-gray-800/50 rounded"></div>
                                    </div>
                                </div>

                                {/* Editor */}
                                <div className="col-span-12 lg:col-span-7 p-6 font-mono text-sm leading-relaxed text-gray-300">
                                    <div className="flex gap-4">
                                        <span className="text-gray-600 select-none">1</span>
                                        <span className="text-purple-400">const</span> <span className="text-blue-400">solveProblem</span> = <span className="text-yellow-300">async</span> ({'{'} user, code {'}'}) <span className="text-blue-400">=&gt;</span> {'{'}
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-gray-600 select-none">2</span>
                                        <span className="ml-4 text-gray-400">// Initialize collaboration session</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-gray-600 select-none">3</span>
                                        <span className="ml-4 text-purple-400">await</span> session.<span className="text-blue-400">connect</span>(user);
                                    </div>
                                    <div className="flex gap-4 bg-gray-800/50 -mx-6 px-6 border-l-2 border-green-500">
                                        <span className="text-gray-600 select-none">4</span>
                                        <span className="ml-4 text-green-400">+  <span className="text-purple-400">const</span> result = <span className="text-yellow-300">await</span> mentor.<span className="text-blue-400">review</span>(code);</span>
                                        <div className="ml-auto flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-gray-900" title="Sarah (Mentor)">S</div>
                                            <span className="text-xs text-gray-500">Sarah is typing...</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-gray-600 select-none">5</span>
                                        <span className="ml-4"><span className="text-purple-400">if</span> (result.success) {'{'}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-gray-600 select-none">6</span>
                                        <span className="ml-8 text-blue-400">console</span>.<span className="text-yellow-300">log</span>(<span className="text-green-300">"Great job! 🚀"</span>);
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-gray-600 select-none">7</span>
                                        <span className="ml-4">{'}'}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-gray-600 select-none">8</span>
                                        <span>{'}'}</span>
                                    </div>
                                </div>

                                {/* Participants/Chat */}
                                <div className="hidden lg:block col-span-3 border-l border-gray-800 bg-gray-900/50 p-4">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Live Users</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold ring-2 ring-gray-900">JD</div>
                                            <div>
                                                <div className="text-xs font-medium text-white">John Doe</div>
                                                <div className="text-[10px] text-gray-500">Coding...</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold ring-2 ring-gray-900">SM</div>
                                            <div>
                                                <div className="text-xs font-medium text-white">Sarah M.</div>
                                                <div className="text-[10px] text-gray-500">Mentoring</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Glow effect under the mock */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-purple-600 opacity-20 blur-2xl -z-10 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Stats Band */}
            <div className="border-y border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: 'Active Developers', value: '10k+' },
                            { label: 'Problems Solved', value: '500k+' },
                            { label: 'Mentorship Hours', value: '25k+' },
                            { label: 'Code Rooms', value: '100+' }
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Everything needed to <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-600">master the craft.</span>
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            A complete ecosystem designed to take you from hello world to senior engineer.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 dark:bg-orange-900/20 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-orange-500/30">
                                    💻
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Daily Challenges</h3>
                                <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
                                    sharpen your algorithmic thinking with our curated daily problems. Track your streak and climb the global leaderboard.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-purple-600/30">
                                    🚀
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Real-time Collab</h3>
                                <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
                                    Pair program instantly with low-latency multiplayer rooms. Share cursors, terminals, and ideas in real-time.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 dark:bg-pink-900/20 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-pink-500 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-pink-500/30">
                                    🎓
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Expert Mentorship</h3>
                                <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
                                    Get stuck? Connect with senior engineers for 1-on-1 code reviews and career guidance sessions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto relative rounded-[3rem] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-orange-900"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="relative z-10 py-24 px-8 text-center">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                            Ready to ship your <br /> dream career?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Join thousands of developers who are already coding the future.
                        </p>
                        <button
                            onClick={() => openAuthModal('register')}
                            className="bg-white text-gray-900 hover:bg-gray-50 px-10 py-4 rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-all duration-300 ring-4 ring-white/20"
                        >
                            Create Free Account
                        </button>
                    </div>
                </div>
            </section>

            <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">C</div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">CodePlatform</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">© 2024 CodePlatform Inc. All rights reserved.</p>
                </div>
            </footer>

            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                initialMode={authMode}
            />
        </div>
    );
};

export default Landing;
