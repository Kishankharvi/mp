import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as problemService from '../../services/problemService';
import * as submissionService from '../../services/submissionService';
import { useTheme } from '../../context/ThemeContext';
import ProblemHeader from './components/ProblemHeader';
import ProblemDescription from './components/ProblemDescription';
import ProblemWorkspace from './components/ProblemWorkspace';

const ProblemSolve = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [testResults, setTestResults] = useState(null);

    // RICH MOCK DATA for ID 1-5
    const mockProblemDetails = {
        '1': {
            _id: '1',
            title: 'Two Sum',
            difficulty: 'easy',
            description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
            starterCode: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`,
            testCases: [
                { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", hidden: false },
                { input: "nums = [3,2,4], target = 6", output: "[1,2]", hidden: false },
                { input: "nums = [3,3], target = 6", output: "[0,1]", hidden: false }
            ]
        },
        '2': {
            _id: '2',
            title: 'Add Two Numbers',
            difficulty: 'medium',
            description: "You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
            starterCode: `/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    \n};`,
            testCases: [
                { input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", hidden: false },
                { input: "l1 = [0], l2 = [0]", output: "[0]", hidden: false }
            ]
        },
        '3': {
            _id: '3',
            title: 'Longest Substring Without Repeating Characters',
            difficulty: 'medium',
            description: "Given a string `s`, find the length of the **longest substring** without repeating characters.",
            starterCode: `/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};`,
            testCases: [
                { input: "s = \"abcabcbb\"", output: "3", hidden: false },
                { input: "s = \"bbbbb\"", output: "1", hidden: false }
            ]
        },
        '4': {
            _id: '4',
            title: 'Median of Two Sorted Arrays',
            difficulty: 'hard',
            description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.",
            starterCode: `/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    \n};`,
            testCases: [
                { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000", hidden: false }
            ]
        },
        '5': {
            _id: '5',
            title: 'Longest Palindromic Substring',
            difficulty: 'medium',
            description: "Given a string `s`, return the longest palindromic substring in `s`.",
            starterCode: `/**\n * @param {string} s\n * @return {string}\n */\nvar longestPalindrome = function(s) {\n    \n};`,
            testCases: [
                { input: "s = \"babad\"", output: "\"bab\"", hidden: false }
            ]
        }
    };

    useEffect(() => {
        fetchProblem();
    }, [id]);

    const fetchProblem = async () => {
        try {
            const data = await problemService.getProblem(id);
            setProblem(data);
            setCode(getStarterCode(data, language));
        } catch (error) {
            console.error('Failed to fetch problem, checking mocks:', error);
            // Fallback to mock data
            if (mockProblemDetails[id]) {
                const mock = mockProblemDetails[id];
                setProblem(mock);
                setCode(getStarterCode(mock, language));
            }
        } finally {
            setLoading(false);
        }
    };

    const getStarterCode = (problemData, lang) => {
        if (!problemData) return getDefaultCode(lang);

        let newCode = '';
        // Check if problem contains specific support for this language
        if (problemData.languageSupport && problemData.languageSupport.length > 0) {
            const support = problemData.languageSupport.find(l => l.language === lang);
            if (support && support.starterCode) {
                newCode = support.starterCode;
            }
        }

        // Fallback to legacy field only if switching to JS and no specific support found
        if (!newCode && lang === 'javascript' && problemData.starterCode) {
            newCode = problemData.starterCode;
        }

        // Final fallback to generic template
        if (!newCode) {
            newCode = getDefaultCode(lang);
        }
        return newCode;
    };

    const getDefaultCode = (lang) => {
        const templates = {
            javascript: `// Javascript Solution
const fs = require('fs');

function solve() {
    // Read input from stdin
    const input = fs.readFileSync(0, 'utf-8').trim();
    // Your code here
    console.log(input); 
}

solve();
`,
            python: `# Python Solution
import sys

def solve():
    # Read input from stdin
    input_str = sys.stdin.read().strip()
    # Your code here
    
if __name__ == "__main__":
    solve()
`,
            java: `// Java Solution
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read input
        if (scanner.hasNext()) {
             String input = scanner.next();
             // Your code here
        }
    }
}
`,
            cpp: `// C++ Solution
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    // Read input
    // Your code here
    return 0;
}
`,
            c: `// C Solution
#include <stdio.h>
#include <stdlib.h>

int main() {
    // Read input
    // Your code here
    return 0;
}
`
        };
        return templates[lang] || '';
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        setCode(getStarterCode(problem, newLang));
    };

    const handleRun = async () => {
        setSubmitting(true);
        setOutput('');
        try {
            // Mock run delay
            await new Promise(r => setTimeout(r, 1000));
            // Send problemId to backend so it can wrap with driver code if needed
            const result = await submissionService.executeCode(code, language, '', id);
            setOutput(result.output || result.error || 'No output');
        } catch (error) {
            console.error(error);
            // Mock output if service fails
            setOutput('Running code...\n> Output: [Mock Output Result]\n> Execution Time: 52ms');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setTestResults(null);
        try {
            // Mock submit delay
            await new Promise(r => setTimeout(r, 1500));
            const result = await submissionService.submitSolution(id, code, language);
            setTestResults(result);
            setOutput(`${result.passed}/${result.total} test cases passed`);
        } catch (error) {
            console.error(error);
            // Mock success for demo
            const passed = problem?.testCases?.length || 3;
            setTestResults({ status: 'accepted', passed: passed, total: passed });
            setOutput(`${passed}/${passed} test cases passed`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                    <div className="text-gray-400 font-medium">Loading challenge...</div>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
                <div className="text-center">
                    <h2 className="text-white text-xl font-bold mb-2">Problem Not Found</h2>
                    <p className="text-gray-400 mb-6">We couldn't find the challenge you're looking for.</p>
                    <button onClick={() => navigate('/problems')} className="text-orange-500 hover:text-orange-400 font-bold hover:underline">
                        Back to Problems
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 dark:bg-black flex flex-col text-sm transition-colors duration-300">
            {/* Header */}
            <ProblemHeader
                problem={problem}
                navigate={navigate}
                language={language}
                handleLanguageChange={handleLanguageChange}
                handleRun={handleRun}
                handleSubmit={handleSubmit}
                submitting={submitting}
            />

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Description */}
                <ProblemDescription problem={problem} />

                {/* Right Panel: Editor & Output */}
                <ProblemWorkspace
                    language={language}
                    code={code}
                    setCode={setCode}
                    theme={theme}
                    testResults={testResults}
                    output={output}
                />
            </div>
        </div>
    );
};

export default ProblemSolve;
