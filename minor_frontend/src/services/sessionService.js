import api from './api';

// Create session
export const createSession = async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data.session;
};

// Get my sessions
export const getMySessions = async () => {
    const response = await api.get('/sessions/my-sessions');
    return response.data.sessions;
};

// Get session by ID
export const getSession = async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data.session;
};

// Complete session
export const completeSession = async (sessionId, notes, rating) => {
    const response = await api.post(`/sessions/${sessionId}/complete`, {
        notes,
        rating
    });
    return response.data.session;
};

// Cancel session
export const cancelSession = async (sessionId) => {
    const response = await api.post(`/sessions/${sessionId}/cancel`);
    return response.data.session;
};

// Get available mentors
export const getAvailableMentors = async () => {
    const response = await api.get('/sessions/mentors/available');
    return response.data.mentors;
};

// Update session status (Approve/Reject)
export const updateSessionStatus = async (sessionId, status) => {
    const response = await api.post(`/sessions/${sessionId}/status`, { status });
    return response.data.session;
};

export default {
    createSession,
    getMySessions,
    getSession,
    completeSession,
    cancelSession,
    getAvailableMentors,
    updateSessionStatus
};
