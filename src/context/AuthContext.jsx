import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextCore';
import axios from 'axios';

// context moved to AuthContextCore.js to satisfy fast-refresh constraints

// useAuth hook moved to useAuth.js

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                // Only set user if we have valid data structure
                if (parsedUser && parsedUser.role && parsedUser.email) {
                    setUser(parsedUser);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                } else {
                    // Invalid user data, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role) => {
        try {
            const response = await axios.post(
                `https://hms-backend-production-9545.up.railway.app/auth/login`,
                { email, password, role }
              );
              

            const { token } = response.data;
            const userData = response.data[role] || response.data.admin || response.data.student || response.data.warden || response.data.security;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ ...userData, role }));

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({ ...userData, role });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // Method for handling token-based login (used by OTP login)
    const loginWithToken = (token, userData) => {
        console.log('🔐 loginWithToken called with:', { token: token ? 'Present' : 'Missing', userData });

        if (!token || !userData) {
            console.error('❌ Missing token or userData');
            return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);

        console.log('✅ User state updated, localStorage set');
        console.log('👤 Current user:', userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        login,
        loginWithToken,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
