import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('achievements')
            .select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user stats
router.get('/:id/stats', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('stats achievements');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ stats: user.stats, achievementCount: user.achievements.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search users
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query required' });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        })
            .select('username email avatar role')
            .limit(20);

        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
