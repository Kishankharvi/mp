import api from './api';

// Register new user
export const register = async (username, email, password, role = 'student') => {
    const response = await api.post('/auth/register', {
        username,
        email,
        password,
        role
    });
    return response.data;
};

// Login user
export const login = async (email, password) => {
    const response = await api.post('/auth/login', {
        email,
        password
    });

    // Save token and user to localStorage
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
};

// Get current user
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
};

// Update profile
export const updateProfile = async (avatar, bio) => {
    const response = await api.put('/auth/profile', {
        avatar,
        bio
    });
    return response.data;
};

// Update mentor profile
export const updateMentorProfile = async (specializations, hourlyRate) => {
    const response = await api.put('/auth/mentor-profile', {
        specializations,
        hourlyRate
    });
    return response.data;
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Get stored user
export const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export default {
    register,
    login,
    getCurrentUser,
    updateProfile,
    updateMentorProfile,
    logout,
    isAuthenticated,
    getStoredUser
};
