import api from './api';

// Submit solution to problem
export const submitSolution = async (problemId, code, language) => {
    const response = await api.post('/submissions/submit', {
        problemId,
        code,
        language
    });
    return response.data;
};

// Execute code without submitting
export const executeCode = async (code, language, input = '') => {
    const response = await api.post('/submissions/execute', {
        code,
        language,
        input
    });
    return response.data;
};

// Get user submissions
export const getUserSubmissions = async (userId) => {
    const response = await api.get(`/submissions/user/${userId}`);
    return response.data.submissions;
};

// Get submissions for a problem
export const getProblemSubmissions = async (problemId) => {
    const response = await api.get(`/submissions/problem/${problemId}`);
    return response.data.submissions;
};

// Get single submission
export const getSubmission = async (submissionId) => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data.submission;
};

export default {
    submitSolution,
    executeCode,
    getUserSubmissions,
    getProblemSubmissions,
    getSubmission
};
