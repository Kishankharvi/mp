import rateLimit from 'express-rate-limit';


// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for authentication routes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later',
    skipSuccessfulRequests: true,
});

// Code execution limiter
export const executionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 executions per minute
    message: 'Too many code executions, please slow down',
    keyGenerator: (req) => {
        // Use user ID if authenticated, otherwise IP
        return req.user?._id?.toString() || req.ip;
    },
});

// Submission limiter
export const submissionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 submissions per minute
    message: 'Too many submissions, please wait before submitting again',
    keyGenerator: (req) => {
        return req.user?._id?.toString() || req.ip;
    },
});

// Create room limiter
export const createRoomLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 rooms per hour
    message: 'Too many rooms created, please try again later',
    keyGenerator: (req) => {
        return req.user?._id?.toString() || req.ip;
    },
});

// File upload limiter
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Too many file uploads, please try again later',
    keyGenerator: (req) => {
        return req.user?._id?.toString() || req.ip;
    },
});

export default {
    apiLimiter,
    authLimiter,
    executionLimiter,
    submissionLimiter,
    createRoomLimiter,
    uploadLimiter
};
