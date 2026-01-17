import api from './api';

// Get all problems
export const getProblems = async (difficulty = '', search = '') => {
    let url = '/problems?';
    if (difficulty) url += `difficulty=${difficulty}&`;
    if (search) url += `search=${search}`;

    const response = await api.get(url);
    return response.data.problems;
};

// Get single problem
export const getProblem = async (problemId) => {
    const response = await api.get(`/problems/${problemId}`);
    return response.data.problem;
};

// Create problem (admin/mentor only)
export const createProblem = async (problemData) => {
    const response = await api.post('/problems', problemData);
    return response.data;
};

// Update problem (admin/mentor only)
export const updateProblem = async (problemId, problemData) => {
    const response = await api.put(`/problems/${problemId}`, problemData);
    return response.data;
};

// Delete problem (admin only)
export const deleteProblem = async (problemId) => {
    const response = await api.delete(`/problems/${problemId}`);
    return response.data;
};

export default {
    getProblems,
    getProblem,
    createProblem,
    updateProblem,
    deleteProblem
};
