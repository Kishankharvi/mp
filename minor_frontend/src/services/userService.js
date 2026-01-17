import api from './api';

// Get user profile
export const getUserProfile = async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data.user;
};

// Get user stats
export const getUserStats = async (userId) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
};

// Search users
export const searchUsers = async (query) => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data.users;
};

export default {
    getUserProfile,
    getUserStats,
    searchUsers
};
