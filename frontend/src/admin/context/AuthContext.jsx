import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

/**
 * CODE WALKTHROUGH: AUTH CONTEXT (The Identity Hub)
 * ────────────────────────────────────────────────
 * Purpose: Provides a global authentication state and manages the Private Key Workflow.
 * This version communicates with the real Backend API for industry-standard security.
 */

const AuthContext = createContext();

// 🕵️ Configure Axios for Secure HttpOnly Cookies
const AUTH_API = import.meta.env.VITE_AUTH_URL || 'http://localhost:5050/api/auth';
axios.defaults.withCredentials = true;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 🕵️ SESSION HYDRATION: Check if a user is already logged in
        const storedUser = localStorage.getItem('amyntor_admin_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // 🕵️ MISSION 1: REAL LOGIN (Backend Verified)
    const login = async (username, password) => {
        try {
            const res = await axios.post(`${AUTH_API}/login`, { username, password });
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('amyntor_admin_user', JSON.stringify(res.data.user));
                return true;
            }
            return false;
        } catch (err) {
            console.error('❌ Login Failed:', err.response?.data?.message || err.message);
            return false;
        }
    };

    // 🕵️ MISSION 2: LOGOUT (Terminates Server Session)
    const logout = async () => {
        try {
            await axios.post(`${AUTH_API}/logout`);
            setUser(null);
            localStorage.removeItem('amyntor_admin_user');
        } catch (err) {
            console.error('❌ Logout Failed:', err);
        }
    };

    // 🕵️ MISSION 3. MASTER KEY VERIFICATION
    const verifyMasterKey = async (username, masterKey) => {
        try {
            const res = await axios.post(`${AUTH_API}/verify-key`, { username, masterKey });
            return { success: res.data.success };
        } catch (err) {
            return { 
                success: false, 
                message: err.response?.data?.message || 'Verification Failed' 
            };
        }
    };

    // 🕵️ MISSION 4: SECURE PASSWORD RESET
    const resetAdminPassword = async (username, masterKey, newPassword) => {
        try {
            const res = await axios.post(`${AUTH_API}/reset-password`, {
                username, masterKey, newPassword
            });
            return res.data.success;
        } catch (err) {
            console.error('❌ Reset Failed:', err.response?.data?.message || err.message);
            return false;
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
        verifyMasterKey,
        resetAdminPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
