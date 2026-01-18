// User Roles
export const USER_ROLES = {
    STUDENT: 'student',
    MENTOR: 'mentor',
    ADMIN: 'admin'
};

// Session Status
export const SESSION_STATUS = {
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// Submission Status
export const SUBMISSION_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    WRONG_ANSWER: 'wrong_answer',
    ERROR: 'error'
};

// Problem Difficulty
export const PROBLEM_DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

// Achievement Types
export const ACHIEVEMENT_TYPES = {
    FIRST_PROBLEM: 'first_problem',
    PROBLEMS_10: 'problems_10',
    PROBLEMS_50: 'problems_50',
    STREAK_7: 'streak_7',
    STREAK_30: 'streak_30',
    FIRST_SESSION: 'first_session',
    MENTOR_5: 'mentor_5',
    PERFECT_SCORE: 'perfect_score'
};

// Achievement Definitions (for creating achievements)
export const ACHIEVEMENT_DEFINITIONS = {
    first_problem: {
        title: 'First Steps',
        description: 'Solved your first problem',
        icon: '🎯'
    },
    problems_10: {
        title: 'Problem Solver',
        description: 'Solved 10 problems',
        icon: '⭐'
    },
    problems_50: {
        title: 'Coding Master',
        description: 'Solved 50 problems',
        icon: '🏆'
    },
    streak_7: {
        title: 'Week Warrior',
        description: 'Maintained a 7-day coding streak',
        icon: '🔥'
    },
    streak_30: {
        title: 'Month Master',
        description: 'Maintained a 30-day coding streak',
        icon: '💪'
    },
    first_session: {
        title: 'Learning Journey',
        description: 'Completed your first mentoring session',
        icon: '📚'
    },
    mentor_5: {
        title: 'Helpful Mentor',
        description: 'Mentored 5 students',
        icon: '👨‍🏫'
    },
    perfect_score: {
        title: 'Perfectionist',
        description: 'Got 100% on a problem',
        icon: '💯'
    }
};

// Supported Languages
export const SUPPORTED_LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', extension: 'js' },
    { id: 'python', name: 'Python', extension: 'py' },
    { id: 'java', name: 'Java', extension: 'java' },
    { id: 'cpp', name: 'C++', extension: 'cpp' },
    { id: 'c', name: 'C', extension: 'c' }
];

export default {
    USER_ROLES,
    SESSION_STATUS,
    SUBMISSION_STATUS,
    PROBLEM_DIFFICULTY,
    ACHIEVEMENT_TYPES,
    ACHIEVEMENT_DEFINITIONS,
    SUPPORTED_LANGUAGES
};
