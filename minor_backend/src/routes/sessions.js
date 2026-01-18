import express from 'express';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { USER_ROLES } from '../config/constants.js';
import * as sessionService from '../services/sessionService.js';

const router = express.Router();

// Create session
router.post('/', authenticate, async (req, res) => {
    try {
        const session = await sessionService.createSession(req.body);

        res.status(201).json({ message: 'Session created', session });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get user sessions
router.get('/my-sessions', authenticate, async (req, res) => {
    try {
        const role = req.user.role === 'mentor' ? 'mentor' : 'student';
        const sessions = await sessionService.getUserSessions(req.user._id, role);

        res.json({ sessions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get session by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('mentorId', 'username avatar mentorProfile')
            .populate('studentId', 'username avatar')
            .populate('roomId');

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Check if user is part of the session
        const isParticipant =
            session.mentorId._id.toString() === req.user._id.toString() ||
            session.studentId._id.toString() === req.user._id.toString();

        if (!isParticipant && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete session
router.post('/:id/complete', authenticate, async (req, res) => {
    try {
        const session = await sessionService.completeSession(req.params.id, req.body);

        res.json({ message: 'Session completed', session });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Cancel session
router.post('/:id/cancel', authenticate, async (req, res) => {
    try {
        const session = await sessionService.cancelSession(req.params.id);

        res.json({ message: 'Session cancelled', session });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update session status (Approve/Reject)
router.post('/:id/status', authenticate, async (req, res) => {
    try {
        const { status } = req.body; // 'scheduled' (approve) or 'cancelled' (reject)
        const session = await sessionService.updateSessionStatus(req.params.id, status, req.user._id);

        res.json({ message: `Session ${status}`, session });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get available mentors
router.get('/mentors/available', authenticate, async (req, res) => {
    try {
        const mentors = await User.find({ role: USER_ROLES.MENTOR })
            .select('username avatar bio mentorProfile')
            .sort({ 'mentorProfile.rating': -1 });

        res.json({ mentors });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
