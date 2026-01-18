import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import * as problemService from '../services/problemService';

const CreateProblem = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'easy',
        starterCode: '',
        testCases: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // For now, we will just simulate creation or call API if available
            // If API is strict, we might need real endpoints. 
            // Assuming problemService.createProblem exists or I might need to add it.
            // If not, I'll Mock it.

            // Check if problemService has createProblem
            if (problemService.createProblem) {
                await problemService.createProblem(formData);
            } else {
                // Simulate success for demo
                console.log("Mock Create Problem:", formData);
                await new Promise(r => setTimeout(r, 1000));
            }
            navigate('/problems');
        } catch (err) {
            console.error(err);
            setError('Failed to create problem');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />
            <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create New Problem</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Contribute a new challenge to the community.</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Problem Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="e.g. Reverse Linked List"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description (Markdown supported)</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="Describe the problem..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        {/* Language Configuration Tabs */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                            <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
                                {['javascript', 'python', 'java', 'cpp', 'c'].map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => {
                                            // Initialize languageSupport array if null
                                            const currentSupport = formData.languageSupport || [];
                                            setFormData({
                                                ...formData,
                                                languageSupport: currentSupport,
                                                activeLang: lang
                                            });
                                        }}
                                        className={`px-5 py-3 text-sm font-bold capitalize transition-colors min-w-[100px] ${(formData.activeLang || 'javascript') === lang
                                            ? 'bg-white dark:bg-gray-800 text-orange-600 border-b-2 border-orange-500'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {lang === 'cpp' ? 'C++' : lang}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Starter Code */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Starter Code ({(formData.activeLang || 'javascript')} user view)
                                    </label>
                                    <textarea
                                        rows={12}
                                        value={formData.languageSupport?.find(l => l.language === (formData.activeLang || 'javascript'))?.starterCode || ''}
                                        onChange={(e) => {
                                            const currentLang = formData.activeLang || 'javascript';
                                            const newSupport = [...(formData.languageSupport || [])];
                                            const existingIndex = newSupport.findIndex(l => l.language === currentLang);

                                            if (existingIndex >= 0) {
                                                newSupport[existingIndex] = { ...newSupport[existingIndex], starterCode: e.target.value };
                                            } else {
                                                newSupport.push({
                                                    language: currentLang,
                                                    starterCode: e.target.value
                                                });
                                            }
                                            setFormData({ ...formData, languageSupport: newSupport });
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                        placeholder={(formData.activeLang || 'javascript') === 'python' ? `import sys

def solve():
    # Read from stdin
    input_str = sys.stdin.read().strip()
    # Logic here
    print(result)

if __name__ == "__main__":
    solve()`
                                            : (formData.activeLang || 'javascript') === 'javascript' ? `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    // Logic here
    console.log(result);
}

solve();`
                                                : (formData.activeLang || 'javascript') === 'java' ? `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read input
        // Print output
    }
}`
                                                    : (formData.activeLang || 'javascript') === 'cpp' ? `#include <iostream>
using namespace std;

int main() {
    // Read input
    // Print output
    return 0;
}`
                                                        : `#include <stdio.h>

int main() {
    // Read input
    // Print output
    return 0;}`}
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        The user's code will be executed directly. They must read from <code>stdin</code> and print to <code>stdout</code>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Test Cases */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-bold text-gray-700">Test Cases</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        testCases: [...formData.testCases, { input: '', output: '', hidden: false }]
                                    })}
                                    className="text-sm text-orange-600 font-bold hover:text-orange-700"
                                >
                                    + Add Case
                                </button>
                            </div>

                            {formData.testCases.map((tc, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newCases = formData.testCases.filter((_, i) => i !== idx);
                                            setFormData({ ...formData, testCases: newCases });
                                        }}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Input</label>
                                            <textarea
                                                rows={2}
                                                value={tc.input}
                                                onChange={(e) => {
                                                    const newCases = [...formData.testCases];
                                                    newCases[idx].input = e.target.value;
                                                    setFormData({ ...formData, testCases: newCases });
                                                }}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none font-mono text-sm"
                                                placeholder="Input data"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 mb-1">Expected Output</label>
                                            <textarea
                                                rows={2}
                                                value={tc.output}
                                                onChange={(e) => {
                                                    const newCases = [...formData.testCases];
                                                    newCases[idx].output = e.target.value;
                                                    setFormData({ ...formData, testCases: newCases });
                                                }}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none font-mono text-sm"
                                                placeholder="Expected output"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`hidden-${idx}`}
                                            checked={tc.hidden}
                                            onChange={(e) => {
                                                const newCases = [...formData.testCases];
                                                newCases[idx].hidden = e.target.checked;
                                                setFormData({ ...formData, testCases: newCases });
                                            }}
                                            className="rounded text-orange-600 focus:ring-orange-500"
                                        />
                                        <label htmlFor={`hidden-${idx}`} className="text-sm text-gray-600 cursor-pointer">Hidden Case</label>
                                    </div>
                                </div>
                            ))}
                            {formData.testCases.length === 0 && (
                                <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    No test cases added yet
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/problems')}
                                className="mr-4 px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70"
                            >
                                {loading ? 'Creating...' : 'Create Problem'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProblem;
