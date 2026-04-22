import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Code Walkthrough: GlobalNotification.jsx
 * 
 * Purpose: A world-class, centered notification system for the Admin Dashboard.
 * Features:
 * - Centered Elite UI: Fixed precisely in the Topbar (balanced between Logo and Logout).
 * - Multi-Tier Styling: Support for 'success' (Emerald), 'error' (Rose), and 'info' (Blue).
 * - Fixed & Glassmorphic: Backdrop-blur and shadow-depth for high-end professionalism.
 * - Framer Motion: Staggered entrance and fade-out (3 seconds).
 */

const GlobalNotification = () => {
    const { notification, hideNotification } = useNotification();

    // Mapping for prestigious status-icons
    const iconConfig = {
        success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        error: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
        info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' }
    };

    const StatusIcon = iconConfig[notification.type]?.icon || Info;
    const colors = iconConfig[notification.type] || iconConfig.info;

    return (
        <AnimatePresence>
            {notification.isVisible && (
                <div className="fixed top-0 left-0 right-0 z-[1000] flex justify-center h-20 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 18, scale: 1 }} // Centers it vertically in the 80px topbar
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="pointer-events-auto flex items-center gap-4 bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 px-6 py-2.5 rounded-[1.5rem] min-w-[320px] max-w-md h-fit absolute top-0"
                    >
                        {/* 🛡️ STATUS ICON BADGE */}
                        <div className={`w-10 h-10 rounded-2xl ${colors.bg} ${colors.color} flex items-center justify-center shrink-0 shadow-inner`}>
                            <StatusIcon size={20} strokeWidth={2.5} />
                        </div>

                        {/* 📝 MESSAGE FEEDBACK */}
                        <div className="flex-1">
                            <h4 className={`text-[11px] font-black uppercase tracking-widest ${colors.color}`}>{notification.type} Protocol</h4>
                            <p className="text-[13px] font-bold text-slate-800 leading-tight">
                                {notification.message}
                            </p>
                        </div>

                        {/* ❌ MANUAL DISMISS */}
                        <button 
                            onClick={hideNotification}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GlobalNotification;
