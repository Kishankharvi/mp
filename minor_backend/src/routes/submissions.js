import express from 'express';
import Submission from '../models/Submission.js';
import { authenticate } from '../middleware/auth.js';
import { submissionLimiter, executionLimiter } from '../middleware/rateLimit.js';
import { executeCode, runTestCases } from '../services/executionService.js';

const router = express.Router();

// Submit solution to problem
router.post('/submit', authenticate, submissionLimiter, async (req, res) => {
    try {
        const { problemId, code, language } = req.body;

        if (!problemId || !code || !language) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await runTestCases(problemId, code, language, req.user._id);

        res.json({
            message: result.status === 'accepted' ? 'All tests passed!' : 'Some tests failed',
            submission: result.submission,
            results: result.results,
            passed: result.passed,
            total: result.total,
            status: result.status
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Execute code (without submitting)
router.post('/execute', authenticate, executionLimiter, async (req, res) => {
    try {
        const { code, language, input, problemId } = req.body;

        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }

        // CP-style: Execute user code directly against the input
        // No driver code injection needed
        const result = await executeCode(code, language, input);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user submissions
router.get('/user/:userId', authenticate, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.params.userId })
            .populate('problemId', 'title difficulty')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ submissions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get submissions for a problem
router.get('/problem/:problemId', authenticate, async (req, res) => {
    try {
        const submissions = await Submission.find({
            problemId: req.params.problemId,
            userId: req.user._id
        })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({ submissions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single submission
router.get('/:id', authenticate, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('userId', 'username avatar')
            .populate('problemId', 'title difficulty');

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        // Only allow viewing own submissions or admin
        if (submission.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ submission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
