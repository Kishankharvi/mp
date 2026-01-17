import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is logged in on mount
        const checkAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const storedUser = authService.getStoredUser();
                    setUser(storedUser);
                    setIsAuthenticated(true);

                    // Fetch fresh user data
                    const freshUser = await authService.getCurrentUser();
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                authService.logout();
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            setUser(data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (username, email, password, role) => {
        try {
            const data = await authService.register(username, email, password, role);
            setUser(data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (avatar, bio) => {
        try {
            const data = await authService.updateProfile(avatar, bio);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    };

    const updateMentorProfile = async (specializations, hourlyRate) => {
        try {
            const data = await authService.updateMentorProfile(specializations, hourlyRate);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        updateMentorProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
