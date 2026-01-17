import api from './api';

// Get user achievements
export const getUserAchievements = async (userId) => {
    const response = await api.get(`/achievements/user/${userId}`);
    return response.data.achievements;
};

// Check and award new achievements
export const checkAchievements = async () => {
    const response = await api.post('/achievements/check');
    return response.data;
};

export default {
    getUserAchievements,
    checkAchievements
};
