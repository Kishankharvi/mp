import Achievement from '../models/Achievement.js';
import User from '../models/User.js';
import { ACHIEVEMENT_TYPES, ACHIEVEMENT_DEFINITIONS } from '../config/constants.js';

// Check and award achievements based on user stats
export async function checkAndAwardAchievements(userId) {
    const user = await User.findById(userId).populate('achievements');
    if (!user) return [];

    const newAchievements = [];
    const existingTypes = user.achievements.map(a => a.type);

    // Check first problem
    if (user.stats.problemsSolved >= 1 && !existingTypes.includes(ACHIEVEMENT_TYPES.FIRST_PROBLEM)) {
        const achievement = await createAchievement(userId, ACHIEVEMENT_TYPES.FIRST_PROBLEM);
        newAchievements.push(achievement);
    }

    // Check 10 problems
    if (user.stats.problemsSolved >= 10 && !existingTypes.includes(ACHIEVEMENT_TYPES.PROBLEMS_10)) {
        const achievement = await createAchievement(userId, ACHIEVEMENT_TYPES.PROBLEMS_10);
        newAchievements.push(achievement);
    }

    // Check 50 problems
    if (user.stats.problemsSolved >= 50 && !existingTypes.includes(ACHIEVEMENT_TYPES.PROBLEMS_50)) {
        const achievement = await createAchievement(userId, ACHIEVEMENT_TYPES.PROBLEMS_50);
        newAchievements.push(achievement);
    }

    // Check 7 day streak
    if (user.stats.currentStreak >= 7 && !existingTypes.includes(ACHIEVEMENT_TYPES.STREAK_7)) {
        const achievement = await createAchievement(userId, ACHIEVEMENT_TYPES.STREAK_7);
        newAchievements.push(achievement);
    }

    // Check 30 day streak
    if (user.stats.currentStreak >= 30 && !existingTypes.includes(ACHIEVEMENT_TYPES.STREAK_30)) {
        const achievement = await createAchievement(userId, ACHIEVEMENT_TYPES.STREAK_30);
        newAchievements.push(achievement);
    }

    // Check mentor achievements
    if (user.role === 'mentor' && user.mentorProfile) {
        if (user.mentorProfile.totalSessions >= 1 && !existingTypes.includes(ACHIEVEMENT_TYPES.FIRST_SESSION)) {
            const achievement = await createAchievement(userId, ACHIEVEMENT_TYPES.FIRST_SESSION);
            newAchievements.push(achievement);
        }

        if (user.mentorProfile.totalSessions >= 5 && !existingTypes.includes(ACHIEVEMENT_TYPES.MENTOR_5)) {
            const achievement = await createAchievement(userId, ACHIEVEMENT_TYPES.MENTOR_5);
            newAchievements.push(achievement);
        }
    }

    // Add new achievements to user
    if (newAchievements.length > 0) {
        user.achievements.push(...newAchievements.map(a => a._id));
        await user.save();
    }

    return newAchievements;
}

// Create an achievement
async function createAchievement(userId, type) {
    const definition = ACHIEVEMENT_DEFINITIONS[type];

    const achievement = await Achievement.create({
        userId,
        type,
        title: definition.title,
        description: definition.description,
        icon: definition.icon
    });

    return achievement;
}

// Get user achievements
export async function getUserAchievements(userId) {
    return await Achievement.find({ userId }).sort({ unlockedAt: -1 });
}

export default {
    checkAndAwardAchievements,
    getUserAchievements
};
