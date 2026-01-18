import express from 'express';
import Problem from '../models/Problem.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Get all problems
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { difficulty, search } = req.query;

        const query = {};
        if (difficulty) query.difficulty = difficulty;
        if (search) query.title = { $regex: search, $options: 'i' };

        const problems = await Problem.find(query)
            .select('-testCases') // Don't send test cases
            .sort({ createdAt: -1 });

        res.json({ problems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single problem
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id)
            .select('-testCases.output'); // Hide expected outputs

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        res.json({ problem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create problem (admin/mentor only)
router.post('/', authenticate, requireRole(USER_ROLES.ADMIN, USER_ROLES.MENTOR), async (req, res) => {
    try {
        const { title, description, difficulty, testCases, starterCode } = req.body;

        if (!title || !description || !difficulty || !testCases || testCases.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const problem = await Problem.create({
            title,
            description,
            difficulty,
            testCases,
            starterCode: starterCode || ''
        });

        res.status(201).json({ message: 'Problem created', problem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update problem (admin/mentor only)
router.put('/:id', authenticate, requireRole(USER_ROLES.ADMIN, USER_ROLES.MENTOR), async (req, res) => {
    try {
        const problem = await Problem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        res.json({ message: 'Problem updated', problem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete problem (admin only)
router.delete('/:id', authenticate, requireRole(USER_ROLES.ADMIN), async (req, res) => {
    try {
        const problem = await Problem.findByIdAndDelete(req.params.id);

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        res.json({ message: 'Problem deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
