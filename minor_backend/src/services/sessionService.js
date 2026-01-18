import Session from '../models/Session.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import { checkAndAwardAchievements } from './achievementService.js';

// Create a new session
export async function createSession(data) {
    const { mentorId, studentId, title, scheduledAt, duration } = data;

    // Verify mentor exists and is a mentor
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
        throw new Error('Invalid mentor');
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student) {
        throw new Error('Student not found');
    }

    const session = await Session.create({
        mentorId,
        studentId,
        title,
        scheduledAt,
        duration: duration || 60
    });

    return session;
}

// Complete a session
export async function completeSession(sessionId, data) {
    const session = await Session.findById(sessionId);
    if (!session) {
        throw new Error('Session not found');
    }

    session.status = 'completed';
    if (data.notes) session.notes = data.notes;
    if (data.rating) session.rating = data.rating;

    await session.save();

    // Update mentor stats
    const mentor = await User.findById(session.mentorId);
    if (mentor && mentor.mentorProfile) {
        mentor.mentorProfile.totalSessions += 1;

        // Update rating
        if (data.rating) {
            const currentTotal = mentor.mentorProfile.rating * (mentor.mentorProfile.totalSessions - 1);
            mentor.mentorProfile.rating = (currentTotal + data.rating) / mentor.mentorProfile.totalSessions;
        }

        await mentor.save();

        // Check for mentor achievements
        await checkAndAwardAchievements(session.mentorId);
    }

    // Check for student achievements (first session)
    await checkAndAwardAchievements(session.studentId);

    return session;
}

// Cancel a session
export async function cancelSession(sessionId) {
    const session = await Session.findById(sessionId);
    if (!session) {
        throw new Error('Session not found');
    }

    session.status = 'cancelled';
    await session.save();

    return session;
}

// Update session status (approve/reject)
export async function updateSessionStatus(sessionId, status, userId) {
    const session = await Session.findById(sessionId);
    if (!session) {
        throw new Error('Session not found');
    }

    // Only mentor can accept/reject
    if (session.mentorId.toString() !== userId.toString()) {
        throw new Error('Only the mentor can update session status');
    }

    if (!['scheduled', 'cancelled'].includes(status)) {
        throw new Error('Invalid status update');
    }

    session.status = status;
    await session.save();
    return session;
}

// Get user sessions
export async function getUserSessions(userId, role = 'student') {
    const query = role === 'mentor' ? { mentorId: userId } : { studentId: userId };

    return await Session.find(query)
        .populate('mentorId', 'username avatar')
        .populate('studentId', 'username avatar')
        .populate('roomId')
        .sort({ scheduledAt: -1 });
}

export default {
    createSession,
    completeSession,
    cancelSession,
    getUserSessions,
    updateSessionStatus
};
