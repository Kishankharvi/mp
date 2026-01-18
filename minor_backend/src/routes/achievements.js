import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getUserAchievements, checkAndAwardAchievements } from '../services/achievementService.js';

const router = express.Router();

// Get user achievements
router.get('/user/:userId', async (req, res) => {
    try {
        const achievements = await getUserAchievements(req.params.userId);

        res.json({ achievements });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check and award achievements (can be called after completing actions)
router.post('/check', authenticate, async (req, res) => {
    try {
        const newAchievements = await checkAndAwardAchievements(req.user._id);

        res.json({
            message: newAchievements.length > 0 ? 'New achievements unlocked!' : 'No new achievements',
            achievements: newAchievements
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
