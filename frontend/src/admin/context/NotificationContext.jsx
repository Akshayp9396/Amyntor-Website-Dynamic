import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

/**
 * Code Walkthrough: NotificationContext.jsx
 * 
 * Purpose: The high-end "Broadcast Engine" for Admin notifications.
 * Features:
 * - showNotification(): Global gateway for Success/Failure feedback.
 * - Auto-Cleanup: Intelligent timer-based fade-out (3 seconds).
 * - Multi-Tier Support: Handles 'success', 'error', and 'info' statuses.
 */

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        message: '',
        type: 'success', // 'success' | 'error' | 'info'
        isVisible: false
    });

    const timerRef = useRef(null);

    // THE NOTIFICATION ENGINE: Centrally managed broadcast logic
    const showNotification = useCallback((message, type = 'success') => {
        // Clear any existing timer to avoid collision
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setNotification({
            message,
            type,
            isVisible: true
        });

        // Professional 3-second visibility window
        timerRef.current = setTimeout(() => {
            setNotification(prev => ({ ...prev, isVisible: false }));
        }, 3000);
    }, []);

    const hideNotification = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setNotification(prev => ({ ...prev, isVisible: false }));
    }, []);

    const value = {
        notification,
        showNotification,
        hideNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
