import { USER_ROLES } from '../config/constants.js';

// Check if user has required role
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: allowedRoles,
                current: req.user.role
            });
        }

        next();
    };
};

// Check if user is a student
export const requireStudent = requireRole(USER_ROLES.STUDENT, USER_ROLES.MENTOR, USER_ROLES.ADMIN);

// Check if user is a mentor
export const requireMentor = requireRole(USER_ROLES.MENTOR, USER_ROLES.ADMIN);

// Check if user is an admin
export const requireAdmin = requireRole(USER_ROLES.ADMIN);

// Check if user is approved mentor
export const requireApprovedMentor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== USER_ROLES.MENTOR && req.user.role !== USER_ROLES.ADMIN) {
        return res.status(403).json({ error: 'Mentor role required' });
    }

    if (req.user.role === USER_ROLES.MENTOR && !req.user.mentorProfile?.isApproved) {
        return res.status(403).json({ error: 'Mentor account not approved yet' });
    }

    next();
};

// Check if user owns the resource
export const requireOwnership = (resourceUserIdField = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Admin can access everything
        if (req.user.role === USER_ROLES.ADMIN) {
            return next();
        }

        // Get resource user ID from request params, body, or resource object
        const resourceUserId = req.params[resourceUserIdField] ||
            req.body[resourceUserIdField] ||
            req.resource?.[resourceUserIdField];

        if (!resourceUserId) {
            return res.status(400).json({ error: 'Resource owner not specified' });
        }

        if (resourceUserId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You do not own this resource' });
        }

        next();
    };
};

export default {
    requireRole,
    requireStudent,
    requireMentor,
    requireAdmin,
    requireApprovedMentor,
    requireOwnership
};
