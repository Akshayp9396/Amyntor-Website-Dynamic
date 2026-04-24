import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Import Amyntor Logo
import amyntorLogo from '../../../assets/images/amyntor-logo.png';

/**
 * Developer Narrative: AdminLogin.jsx (Security Refinement)
 * 
 * Purpose: Replaces standard Signup with a highly-secure "Private Key" based authentication & reset hub.
 * Data Flow (Login):
 *   - User submits `username` and `password`.
 *   - The component calls `login(user, pass)` from `AuthContext`. If it returns true, we navigate to the dashboard.
 * Data Flow (Reset Workflow):
 *   - The user toggles `isResetting` to view the Reset Form.
 *   - The user inputs the `MASTER_PRIVATE_KEY` into `masterKey`.
 *   - Before revealing the new password fields, `handleKeyVerification()` fires, validating against `verifyMasterKey()` from Context.
 *   - If valid, `isKeyVerified` becomes true, and the UI conditionally renders the actual "New Password" inputs.
 *   - Real-time matching logic validates inputs before finally triggering `resetAdminPassword()` and returning to Login.
 */

const AdminLogin = () => {
    // UI State
    const [isResetting, setIsResetting] = useState(false);
    const [error, setError] = useState('');

    // Login State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Reset State
    const [resetUsername, setResetUsername] = useState('');
    const [masterKey, setMasterKey] = useState('');
    const [isKeyVerified, setIsKeyVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Context Hooks
    const { login, verifyMasterKey, resetAdminPassword } = useAuth();
    const navigate = useNavigate();

    // Handlers
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // 🛡️ USERNAME VALIDATION: No special characters allowed
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            setError('Security Policy: Username can only contain letters, numbers, and underscores.');
            return;
        }

        const success = await login(username, password);
        if (success) {
            navigate('/admin/home');
        } else {
            setError('Login Failed: Invalid username or password.');
        }
    };

    const handleKeyVerification = async (e) => {
        e.preventDefault();
        setError('');

        if (!resetUsername) {
            setError('Please enter your admin username.');
            return;
        }

        // 🛡️ USERNAME VALIDATION: No special characters allowed
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(resetUsername)) {
            setError('Security Policy: Username can only contain letters, numbers, and underscores.');
            return;
        }

        const result = await verifyMasterKey(resetUsername, masterKey);
        if (result.success) {
            setIsKeyVerified(true);
        } else {
            setError(result.message);
            setMasterKey('');
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Security Policy: Password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Validation Error: Passwords do not match.');
            return;
        }

        const success = await resetAdminPassword(resetUsername, masterKey, newPassword);
        
        if (success) {
            alert('Admin password has been securely updated. Please login.');
            // Reset local state and return to login view
            setNewPassword('');
            setConfirmPassword('');
            setMasterKey('');
            setResetUsername('');
            setIsKeyVerified(false);
            setIsResetting(false);
        } else {
            setError('Reset Failed: Unauthorized attempt or account issue.');
        }
    };

    // Component Rendering
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">

            {/* ====== ADVANCED ANIMATED BACKGROUND ====== */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

                {/* Modern Dot Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: 'radial-gradient(#02a1fd 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Floating Gradient Orbs */}
                <motion.div
                    className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#02a1fd]/20 to-[#2563eb]/20 rounded-full blur-[80px]"
                    animate={{
                        y: [0, 40, 0],
                        x: [0, -30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-bl from-[#2563eb]/15 to-[#02a1fd]/15 rounded-full blur-[100px]"
                    animate={{
                        y: [0, -50, 0],
                        x: [0, 40, 0],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

            </div>
            {/* ========================================= */}

            {/* Main Container - Clean white solid card styled by screenshot */}
            <motion.div
                layout
                className="w-full max-w-[420px] bg-white border-[1.5px] border-slate-200 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    {/* Amyntor Logo Instead of Shield */}
                    <div className="flex justify-center mb-5">
                        <img
                            src={amyntorLogo}
                            alt="Amyntor Tech Logo"
                            className="h-14 w-auto object-contain"
                        />
                    </div>

                    <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#1a202c] tracking-tight mb-2">
                        {isResetting ? 'Security Reset' : 'Admin Portal'}
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed text-center font-medium max-w-[300px]">
                        {isResetting ? 'Enter the Master Private Key to override the system.' : 'Welcome back. Use your administrator credentials to access the Dashboard.'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-50 border-l-4 border-rose-500 p-3 mb-6 flex items-center gap-3 rounded-r-xl"
                        >
                            <AlertCircle className="text-rose-500 shrink-0" size={18} />
                            <p className="text-xs text-rose-700 font-bold tracking-tight">{error}</p>
                        </motion.div>
                    )}

                    {!isResetting ? (
                        /* ================= LOGIN VIEW ================= */
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleLogin}
                            className="space-y-5"
                        >
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={18} strokeWidth={2} className="text-slate-400 group-focus-within:text-[#0066FF] transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Admin Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-white border-[1.5px] border-slate-200 hover:border-slate-300 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all text-sm font-semibold"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} strokeWidth={2} className="text-slate-400 group-focus-within:text-[#0066FF] transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Secure Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white border-[1.5px] border-slate-200 hover:border-slate-300 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all text-sm font-semibold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold py-3.5 px-4 rounded-2xl transition-all text-[15px] tracking-wide shadow-lg shadow-[#0066FF]/30 flex items-center justify-center gap-2 group"
                                >
                                    LOGIN <ArrowRight size={18} strokeWidth={2.5} className="transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="mt-5 text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsResetting(true);
                                        setError('');
                                    }}
                                    className="text-slate-500 hover:text-[#0066FF] text-[15px] font-bold transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        /* ================= RESET VIEW ================= */
                        <motion.div
                            key="reset"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {!isKeyVerified ? (
                                // Step 1: Master Key Verification
                                <form onSubmit={handleKeyVerification} className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} strokeWidth={2} className="text-slate-400 group-focus-within:text-[#0066FF] transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Admin Username"
                                                value={resetUsername}
                                                onChange={(e) => setResetUsername(e.target.value)}
                                                className="w-full bg-white border-[1.5px] border-slate-200 hover:border-slate-300 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all text-sm font-semibold"
                                                required
                                            />
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <KeyRound size={18} strokeWidth={2} className="text-slate-400 group-focus-within:text-[#0066FF] transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Enter Master Key"
                                                value={masterKey}
                                                onChange={(e) => setMasterKey(e.target.value)}
                                                className="w-full bg-white border-[1.5px] border-slate-200 hover:border-slate-300 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all text-sm font-semibold font-mono"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsResetting(false)}
                                            className="w-1/2 bg-white border-[1.5px] border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold py-3.5 px-4 rounded-2xl transition-all text-[15px]"
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-1/2 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold py-3.5 px-4 rounded-2xl transition-all text-[15px] tracking-wide shadow-lg shadow-[#0066FF]/30 flex items-center justify-center"
                                        >
                                            VERIFY
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // Step 2: New Password Fields (Rendered only on true)
                                <form onSubmit={handlePasswordReset} className="space-y-5">
                                    <div className="bg-emerald-50/80 border-[1.5px] border-emerald-200 rounded-xl p-3 flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                                        <span className="text-xs text-emerald-700 font-bold tracking-wide">MASTER KEY ACCEPTED</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                                <Lock size={18} strokeWidth={2} className="text-slate-400 group-focus-within:text-[#0066FF] transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="New Admin Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-white border-[1.5px] border-slate-200 hover:border-slate-300 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all text-sm font-semibold"
                                                required
                                            />
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                                                <Lock size={18} strokeWidth={2} className="text-slate-400 group-focus-within:text-[#0066FF] transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`w-full bg-white border-[1.5px] hover:border-slate-300 rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all text-sm font-semibold ${confirmPassword && newPassword !== confirmPassword
                                                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                                                    : 'border-slate-200 focus:border-[#0066FF] focus:ring-[#0066FF]/10'
                                                    }`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-4">
                                        <button
                                            type="submit"
                                            disabled={newPassword !== confirmPassword || !newPassword}
                                            className="w-full bg-[#0066FF] hover:bg-[#0052cc] disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-2xl transition-all text-[15px] tracking-wide shadow-lg shadow-[#0066FF]/30"
                                        >
                                            CHANGE PASSWORD
                                        </button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsResetting(false);
                                                    setIsKeyVerified(false);
                                                    setMasterKey('');
                                                    setNewPassword('');
                                                    setConfirmPassword('');
                                                    setResetUsername('');
                                                }}
                                                className="text-slate-500 hover:text-[#0066FF] text-[15px] font-bold transition-colors"
                                            >
                                                Back to Login
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
