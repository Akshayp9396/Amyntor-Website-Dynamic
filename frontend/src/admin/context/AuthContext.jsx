import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Developer Narrative: AuthContext (Security Refinement)
 * 
 * Purpose: Provides a global authentication state and manages the Private Key Workflow.
 * Data Flow: 
 *   - `adminPassword` holds the current valid password (mocked database). Defaults to 'admin'.
 *   - The `verifyMasterKey(input)` function acts as a high-security gate. If the input matches `MASTER_PRIVATE_KEY`, it returns true.
 *     This boolean triggers the UI to reveal the actual "New Password" fields.
 *   - `resetAdminPassword(new)` takes the newly chosen password and updates the internal `adminPassword` state.
 *   - The main `login(username, pass)` function now checks against this dynamic `adminPassword` internally 
 *     before issuing the `user` object to global state.
 */

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// Extremely Secure "Cold Storage" Key
const MASTER_PRIVATE_KEY = "AMYNTOR-MASTER-KEY-2026";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Simulating database storage of the admin password
    const [adminPassword, setAdminPassword] = useState('admin');

    useEffect(() => {
        // Hydrate state from localStorage on initial load
        const storedUser = localStorage.getItem('amyntor_admin_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Hydrate the dynamic password if it was changed
        const storedPassword = localStorage.getItem('amyntor_admin_pwd');
        if (storedPassword) {
            setAdminPassword(storedPassword);
        }

        setIsLoading(false);
    }, []);

    // 1. Core Authentication Check
    const login = (usernameInput, passwordInput) => {
        if (usernameInput === 'admin' && passwordInput === adminPassword) {
            const userParams = {
                name: 'Akshay',
                role: 'Super Admin'
            };
            setUser(userParams);
            localStorage.setItem('amyntor_admin_user', JSON.stringify(userParams));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('amyntor_admin_user');
    };

    // 2. Private Key Verification Gate
    const verifyMasterKey = (inputKey) => {
        return inputKey === MASTER_PRIVATE_KEY;
    };

    // 3. Password Reset Execution
    const resetAdminPassword = (newPassword) => {
        setAdminPassword(newPassword);
        localStorage.setItem('amyntor_admin_pwd', newPassword);
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
