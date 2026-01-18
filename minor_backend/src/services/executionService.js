import axios from 'axios';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import { checkAndAwardAchievements } from './achievementService.js';

// Execute code using Piston API
export async function executeCode(code, language, input = '') {
    try {
        const pistonUrl = process.env.PISTON_API || 'https://emkc.org/api/v2/piston/execute';

        // Map languages to Piston runtimes/versions
        const languageMap = {
            'javascript': { language: 'javascript', version: '18.15.0' },
            'python': { language: 'python', version: '3.10.0' },
            'java': { language: 'java', version: '15.0.2' },
            'cpp': { language: 'c++', version: '10.2.0' },
            'c': { language: 'c', version: '10.2.0' }
        };

        const runtime = languageMap[language.toLowerCase()];

        if (!runtime) {
            // Fallback for languages not in map or if exact version not strict (e.g. using aliases)
            // But for stability, we prefer the map.
            // If not found, try to assume user passed valid Piston language name and use * (though risky)
            // Better to error or default.
            if (!['c++', 'c', 'python', 'java', 'javascript'].includes(language)) {
                throw new Error(`Unsupported language: ${language}`);
            }
        }

        const payload = {
            language: runtime ? runtime.language : language,
            version: runtime ? runtime.version : '*',
            files: [{ content: code }]
        };

        if (input) {
            payload.stdin = input;
        }

        const response = await axios.post(pistonUrl, payload, {
            timeout: 30000,
            headers: { 'Content-Type': 'application/json' }
        });

        const run = response.data?.run;

        // Piston returns output, stderr, stdout.
        // If stderr exists, we might treat it as error or just part of output depending on logic.
        // Usually, we return concatenated output for display, but distinguish error for judging.

        const output = run?.output || '';
        const stderr = run?.stderr || '';

        // If specific Piston error (like compilation failure), output usually contains it.

        return {
            success: true, // API call succeeded
            output: output,
            error: run?.code !== 0 ? stderr : null // If exit code is not 0, there was likely an error
        };
    } catch (error) {
        console.error('Piston execution error:', error.message);
        return {
            success: false,
            output: '',
            error: error.response?.data?.message || error.message || 'Execution failed'
        };
    }
}

// Run code against problem test cases
export async function runTestCases(problemId, code, language, userId) {
    const problem = await Problem.findById(problemId);
    if (!problem) {
        throw new Error('Problem not found');
    }

    const results = [];
    let passed = 0;

    for (const testCase of problem.testCases) {
        // CP-style: Execute user code directly against the input
        const result = await executeCode(code, language, testCase.input);

        const testPassed = result.output.trim() === testCase.output.trim();
        if (testPassed) passed++;

        results.push({
            input: testCase.hidden ? 'Hidden' : testCase.input,
            expectedOutput: testCase.hidden ? 'Hidden' : testCase.output,
            actualOutput: testCase.hidden && !testPassed ? 'Hidden' : result.output,
            passed: testPassed,
            error: result.error
        });
    }

    const allPassed = passed === problem.testCases.length;
    const status = allPassed ? 'accepted' : 'wrong_answer';

    // Create submission
    const submission = await Submission.create({
        userId,
        problemId,
        code,
        language,
        status,
        output: results.map(r => r.actualOutput).join('\n'),
        testsPassed: passed,
        testsTotal: problem.testCases.length
    });

    // Update problem stats
    problem.totalSubmissions += 1;
    if (allPassed) {
        problem.acceptedSubmissions += 1;
    }
    await problem.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
        user.stats.totalSubmissions += 1;
        if (allPassed) {
            // Check if this is first time solving this problem
            const previousAccepted = await Submission.findOne({
                userId,
                problemId,
                status: 'accepted',
                _id: { $ne: submission._id }
            });

            if (!previousAccepted) {
                user.stats.problemsSolved += 1;
            }
        }

        // Update streak
        user.updateStreak();
        await user.save();

        // Check for achievements
        await checkAndAwardAchievements(userId);
    }

    return {
        submission,
        results,
        passed,
        total: problem.testCases.length,
        status
    };
}

export default {
    executeCode,
    runTestCases
};
