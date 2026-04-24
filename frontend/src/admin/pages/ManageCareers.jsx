/**
 * Code Walkthrough: ManageCareers.jsx (V2 - FULLY DYNAMIC)
 * 
 * Purpose: A comprehensive management suite for the Careers page.
 * This version is 100% wired to the MySQL backend via ContentService.
 * 
 * KEY CHANGE FROM V1:
 * - Previously used local mock data from ContentContext (data lost on refresh).
 * - NOW: All reads go to GET /api/careers/full (MySQL database).
 * - All writes go to PUT /api/careers/content (Hero/Intro) or POST /api/careers/role (Jobs).
 * - On mount, it fetches the live data. On save, it persists to MySQL.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    Image as ImageIcon,
    Plus,
    Trash2,
    X,
    Edit3,
    Eye,
    Search,
    Briefcase,
    ListChecks,
    Users,
    Clock,
    CheckCircle2,
    BriefcaseIcon,
    Mail,
    Archive,
    RefreshCcw,
    Loader2
} from 'lucide-react';
import { AdminCard, FormInput, FormTextarea, FormSelect } from '../components/AdminUI';
import { useNotification } from '../context/NotificationContext';
import ContentService from '../../services/contentService';

// ─── Default shapes to prevent null-access errors ────────────────────────────
const DEFAULT_HERO = { tag: '', title: '', tagline: '', backgroundImage: null };
const DEFAULT_INTRO = { tag: '', heading: '', description: '', image: null };

const ManageCareers = () => {
    const { showNotification } = useNotification();

    const location = useLocation();
    // ── UI State ─────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'hero');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Auto-open 'Add Opening' if coming from dashboard
    useEffect(() => {
        if (!isLoading && location.state?.addOpening) {
            handleOpenAddRole();
            // Clear state to prevent re-opening on manual tab change
            window.history.replaceState({}, document.title);
        }
    }, [isLoading, location.state]);

    // ── Data State (from MySQL) ───────────────────────────────────────────────
    const [hero, setHero] = useState(DEFAULT_HERO);
    const [intro, setIntro] = useState(DEFAULT_INTRO);
    const [openRoles, setOpenRoles] = useState([]);

    // ── Modal State ───────────────────────────────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null); // null = adding new
    const [isViewOnly, setIsViewOnly] = useState(false);
    const [isReposting, setIsReposting] = useState(false);
    const [roleFormData, setRoleFormData] = useState({
        title: '', category: '', experience: '', openings: 1,
        jobType: 'Full Time',
        roleOverview: '',
        responsibilities: [''], qualifications: [''],
        howToApply: '', is_active: true
    });

    // ── MISSION: Fetch live data from MySQL on component mount ────────────────
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await ContentService.getCareersFull();
                if (data) {
                    setHero(data.hero || DEFAULT_HERO);
                    setIntro(data.intro || DEFAULT_INTRO);
                    setOpenRoles(data.openRoles || []);
                }
            } catch (err) {
                console.error('❌ Careers Hydration Failure:', err);
                showNotification('Failed to load careers data from server.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // ── MISSION: Save Hero & Intro content to MySQL ───────────────────────────
    const handleSaveContent = async () => {
        setIsSaving(true);
        try {
            const result = await ContentService.updateCareersContent({ hero, intro });
            if (result.success) {
                showNotification('Changes saved successfully!', 'success');
            } else {
                showNotification('ERROR: Failed to save changes. Please try again.', 'error');
            }
        } catch (err) {
            console.error('❌ Save Error:', err);
            showNotification('ERROR: Failed to save changes. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // ── MISSION: Image Upload (Base64 encoded with 5MB Limit) ──────────────────
    const handleImageUpload = (e, field, setter) => {
        const file = e.target.files[0];
        if (file) {
            // Error Protocol: Reject if > 5MB
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showNotification('ERROR: FILE TOO LARGE. Max limit is 5MB.', 'error');
                e.target.value = ''; // Reset input
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => setter(prev => ({ ...prev, [field]: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    // ── MISSION: Open modal for new role ─────────────────────────────────────
    const handleOpenAddRole = () => {
        setEditingRole(null);
        setIsViewOnly(false);
        setIsReposting(false);
        setRoleFormData({
            title: '', category: '', experience: '', openings: 1,
            jobType: 'Full Time',
            roleOverview: '',
            responsibilities: [''], qualifications: [''],
            howToApply: '', is_active: true
        });
        setIsModalOpen(true);
    };

    // ── MISSION: Open modal for editing an existing role ─────────────────────
    const handleOpenEditRole = (role, viewOnly = false) => {
        setEditingRole(role);
        setIsViewOnly(viewOnly);
        setIsReposting(false);
        setRoleFormData({
            ...role,
            responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities : [''],
            qualifications: Array.isArray(role.qualifications) ? role.qualifications : ['']
        });
        setIsModalOpen(true);
    };

    // ── MISSION: Save a role to MySQL (upsert) ───────────────────────────────
    const handleSaveRole = async () => {
        if (!roleFormData.title || !roleFormData.category) {
            showNotification('Please fill in the required fields: Title & Category.', 'error');
            return;
        }

        setIsSaving(true);
        try {
            // Auto-generate jobId and slug if new
            let payload = { ...roleFormData };
            if (!editingRole) {
                // New role — generate sequential ID from existing roles
                const allIds = openRoles.map(r => parseInt(r.jobId) || 0);
                const nextId = Math.max(0, ...allIds) + 1;
                const formattedId = nextId.toString().padStart(4, '0');
                payload.jobId = formattedId;
                payload.jobCode = `AMY-${formattedId}`;
                payload.slug = payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            } else {
                payload.id = editingRole.id;
            }

            const result = await ContentService.upsertRole(payload);
            if (result.success) {
                showNotification(editingRole ? 'Role updated successfully!' : 'New role added successfully!', 'success');
                // Refresh the roles list from the server
                const freshData = await ContentService.getCareersFull();
                if (freshData) setOpenRoles(freshData.openRoles || []);
                setIsModalOpen(false);
            } else {
                showNotification('ERROR: Failed to save role. Please try again.', 'error');
            }
        } catch (err) {
            console.error('❌ Role Save Error:', err);
            showNotification('ERROR: Failed to save role. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // ── MISSION: Close a role (mark is_active = false) ───────────────────────
    const handleCloseRole = async (role) => {
        if (!window.confirm('Close this position? It will move to the Closed Jobs section.')) return;
        try {
            const result = await ContentService.upsertRole({ ...role, is_active: false });
            if (result.success) {
                showNotification('Role closed successfully.', 'success');
                const freshData = await ContentService.getCareersFull();
                if (freshData) setOpenRoles(freshData.openRoles || []);
            }
        } catch (err) {
            showNotification('ERROR: Could not close role.', 'error');
        }
    };

    // ── MISSION: Pre-fill modal for reposting a closed role ──────────────────
    const handleRepost = (role) => {
        const allIds = openRoles.map(r => parseInt(r.jobId) || 0);
        const nextId = Math.max(0, ...allIds) + 1;
        const formattedId = nextId.toString().padStart(4, '0');
        
        setEditingRole(null); 
        setIsViewOnly(false);
        setIsReposting(true);
        setRoleFormData({
            ...role,
            id: null, 
            jobId: formattedId,
            jobCode: `AMY-${formattedId}`,
            slug: '', 
            is_active: true,
            postedDate: new Date().toISOString()
        });
        setIsModalOpen(true);
    };

    // ── MISSION: Permanently delete a role ───────────────────────────────────
    const handleDeleteRole = async (role) => {
        if (!window.confirm('PERMANENTLY DELETE this role? This cannot be undone.')) return;
        try {
            const result = await ContentService.deleteRole(role.id);
            if (result.success) {
                showNotification('Role permanently deleted.', 'success');
                setOpenRoles(prev => prev.filter(r => r.id !== role.id));
            }
        } catch (err) {
            showNotification('ERROR: Could not delete role.', 'error');
        }
    };

    // ── Derived lists ─────────────────────────────────────────────────────────
    const filteredRoles = openRoles.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.category.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeTab === 'list') return r.is_active !== false && matchesSearch;
        if (activeTab === 'history') return r.is_active === false && matchesSearch;
        return matchesSearch;
    });

    const tabs = [
        { id: 'hero', label: 'Hero & Intro' },
        { id: 'list', label: 'Add Openings' },
        { id: 'history', label: 'Closed Jobs' }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="text-brand-primary animate-spin" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Careers Data...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full space-y-6 pb-20"
        >
            {/* Header Row */}
            <div className="flex justify-between items-center px-1 py-2">
                <div className="flex space-x-1 bg-slate-100/50 p-1.5 rounded-[1.5rem] w-fit border border-slate-200/60">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-[1.1rem] font-bold text-[13px] transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white text-slate-900 shadow-lg shadow-slate-200/50 scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Save button available for all tabs */}
                <button
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="group bg-white/70 backdrop-blur-xl border border-white/20 hover:shadow-2xl hover:shadow-emerald-200/20 text-emerald-600 font-black py-3 px-6 rounded-2xl transition-all flex items-center gap-3 active:scale-95 shadow-sm overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isSaving
                        ? <Loader2 size={18} className="animate-spin text-emerald-600" />
                        : <Save size={18} strokeWidth={3} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                    }
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700 text-sm">
                        {isSaving ? 'Saving...' : 'Save & Push Live'}
                    </span>
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                <AnimatePresence mode="wait">

                    {/* ── HERO & INTRO TAB ─────────────────────────────────── */}
                    {activeTab === 'hero' && (
                        <motion.div
                            key="hero"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >
                            <div className="lg:col-span-2 space-y-6">
                                <AdminCard title="Hero Section">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <FormInput label="Tag" value={hero.tag || ''} onChange={(e) => setHero({ ...hero, tag: e.target.value })} />
                                        <FormInput label="Main Heading" value={hero.title || ''} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea label="Hero Tagline" rows={2} value={hero.tagline || ''} onChange={(e) => setHero({ ...hero, tagline: e.target.value })} />
                                    </div>
                                </AdminCard>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Hero Visuals</h3>
                                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">Recommended: 1920 x 1080 PX</span>
                                    </div>
                                    <div className="relative group overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-200 aspect-video flex items-center justify-center shadow-inner">
                                        {hero.backgroundImage
                                            ? <img src={hero.backgroundImage} className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110" alt="Hero preview" />
                                            : <ImageIcon size={40} className="text-slate-600" />
                                        }
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'backgroundImage', setHero)} />
                                    </div>
                                </div>
                            </div>

                            {/* Intro Section */}
                            <div className="lg:col-span-2">
                                <AdminCard title="Introduction">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <FormInput label="Tag" value={intro.tag || ''} onChange={(e) => setIntro({ ...intro, tag: e.target.value })} />
                                        <FormInput label="Main Heading" value={intro.heading || ''} onChange={(e) => setIntro({ ...intro, heading: e.target.value })} />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea label="Description" rows={5} value={intro.description || ''} onChange={(e) => setIntro({ ...intro, description: e.target.value })} />
                                    </div>
                                </AdminCard>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Intro Media</h3>
                                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">Recommended: 1920 x 1080 PX</span>
                                    </div>
                                    <div className="relative group overflow-hidden rounded-[2rem] bg-slate-100 border border-slate-200 aspect-video flex items-center justify-center shadow-inner">
                                        {intro.image
                                            ? <img src={intro.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Intro preview" />
                                            : <ImageIcon size={48} className="text-slate-300" />
                                        }
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'image', setIntro)} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── JOB BOARD TABS ───────────────────────────────────── */}
                    {(activeTab === 'list' || activeTab === 'history') && (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <AdminCard
                                title={activeTab === 'list' ? 'Careers Explorer' : 'Closed Records History'}
                                actions={
                                    activeTab === 'list' && (
                                        <button
                                            onClick={handleOpenAddRole}
                                            className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                        >
                                            <Plus size={16} strokeWidth={3} className="text-[#009669] group-hover:scale-110 transition-transform" />
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#009669] to-[#006D5B]">Add New Role</span>
                                        </button>
                                    )
                                }
                            >
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto overflow-y-hidden mt-4 shadow-sm no-scrollbar">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50/80 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Job ID</th>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Job Title</th>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Slots / Experience</th>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Posted Date</th>
                                                <th className="px-6 py-4 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredRoles.length > 0 ? filteredRoles.map((role) => (
                                                <tr key={role.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                                                            {role.jobCode || `AMY-${(role.jobId || '0000').padStart(4, '0')}`}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-bold text-slate-800 transition-colors truncate max-w-[300px] md:max-w-[400px]">{role.title}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{role.category}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-bold">
                                                                <Users size={12} className="text-slate-400" />
                                                                <span>{role.openings} Open Slots</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                                                                <Clock size={12} className="text-slate-300" />
                                                                <span>{role.experience} Experience</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                                                            {new Date(role.postedDate).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {activeTab === 'list' ? (
                                                                <>
                                                                    <button onClick={() => handleOpenEditRole(role)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors" title="Edit Job">
                                                                        <Edit3 size={16} />
                                                                    </button>
                                                                    <button onClick={() => handleCloseRole(role)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-colors" title="Close Opening">
                                                                        <Archive size={16} />
                                                                    </button>
                                                                    <button onClick={() => handleDeleteRole(role)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Permanent Delete">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button onClick={() => handleOpenEditRole(role, true)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors" title="Review Content">
                                                                        <Eye size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRepost(role)}
                                                                        className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-black text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all uppercase tracking-widest border border-emerald-100"
                                                                    >
                                                                        <RefreshCcw size={14} />
                                                                        <span>Repost</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={5}>
                                                        <div className="py-20 text-center text-slate-400">
                                                            <Search size={48} className="mx-auto mb-4 opacity-20" />
                                                            <p className="font-bold text-sm tracking-tight">No positions found.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── ROLE EDITOR MODAL ──────────────────────────────────────────── */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                    {isViewOnly ? 'Review Role Details' : isReposting ? 'Repost & Refresh Role' : editingRole ? 'Edit Job Details' : 'Add New Job'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm transition-all">
                                    <X size={22} strokeWidth={3} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                                {/* Base Info */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center font-black text-[10px]">01</div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Base Information</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormInput label="Job Title" disabled={isViewOnly} value={roleFormData.title} onChange={(e) => setRoleFormData({ ...roleFormData, title: e.target.value })} placeholder="e.g. Senior Security Engineer" />
                                        <FormInput label="Category" disabled={isViewOnly} value={roleFormData.category} onChange={(e) => setRoleFormData({ ...roleFormData, category: e.target.value })} placeholder="e.g. Engineering" />
                                        <FormInput label="Required Experience" disabled={isViewOnly} value={roleFormData.experience} onChange={(e) => setRoleFormData({ ...roleFormData, experience: e.target.value })} placeholder="e.g. 5+ Years" />
                                        <FormInput label="Open Slots" disabled={isViewOnly} type="number" value={roleFormData.openings} onChange={(e) => setRoleFormData({ ...roleFormData, openings: parseInt(e.target.value) })} />
                                        <FormSelect 
                                            label="Job Type" 
                                            disabled={isViewOnly}
                                            value={roleFormData.jobType} 
                                            onChange={(e) => setRoleFormData({ ...roleFormData, jobType: e.target.value })}
                                            options={[
                                                { label: 'Full Time', value: 'Full Time' },
                                                { label: 'Part Time', value: 'Part Time' },
                                                { label: 'Internship', value: 'Internship' },
                                                { label: 'Contract', value: 'Contract' },
                                                { label: 'Work From Home', value: 'Work From Home' }
                                            ]}
                                        />
                                    </div>
                                </section>

                                {/* Role Details */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center font-black text-[10px]">02</div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Role Details</h4>
                                    </div>
                                    <FormTextarea label="About the Role" rows={4} value={roleFormData.roleOverview} onChange={(e) => setRoleFormData({ ...roleFormData, roleOverview: e.target.value })} placeholder="Provide a high-level summary..." />

                                    {/* Responsibilities */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <ListChecks size={14} className="text-slate-400" />
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Responsibilities</label>
                                            </div>
                                            <button onClick={() => setRoleFormData({ ...roleFormData, responsibilities: [...roleFormData.responsibilities, ''] })}
                                                disabled={isViewOnly}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-brand-primary hover:shadow-md transition-all disabled:opacity-50">
                                                <Plus size={12} /> Add Point
                                            </button>
                                        </div>
                                        {roleFormData.responsibilities.map((r, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 bg-slate-50/30 border border-slate-100 rounded-2xl">
                                                <input
                                                    className="flex-1 bg-transparent p-3 text-xs font-bold outline-none placeholder:text-slate-300"
                                                    value={r}
                                                    onChange={(e) => {
                                                        const news = [...roleFormData.responsibilities];
                                                        news[i] = e.target.value;
                                                        setRoleFormData({ ...roleFormData, responsibilities: news });
                                                    }}
                                                    placeholder="Describe a responsibility..."
                                                />
                                                {!isViewOnly && (
                                                    <button onClick={() => setRoleFormData({ ...roleFormData, responsibilities: roleFormData.responsibilities.filter((_, idx) => idx !== i) })}
                                                        className="p-2 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-rose-500 hover:border-rose-100 shadow-sm transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Qualifications */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={14} className="text-slate-400" />
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualifications</label>
                                            </div>
                                            <button onClick={() => setRoleFormData({ ...roleFormData, qualifications: [...roleFormData.qualifications, ''] })}
                                                disabled={isViewOnly}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-brand-primary hover:shadow-md transition-all disabled:opacity-50">
                                                <Plus size={12} /> Add Requirement
                                            </button>
                                        </div>
                                        {roleFormData.qualifications.map((q, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 bg-slate-50/30 border border-slate-100 rounded-2xl">
                                                <input
                                                    className="flex-1 bg-transparent p-3 text-xs font-bold outline-none placeholder:text-slate-300"
                                                    value={q}
                                                    onChange={(e) => {
                                                        const news = [...roleFormData.qualifications];
                                                        news[i] = e.target.value;
                                                        setRoleFormData({ ...roleFormData, qualifications: news });
                                                    }}
                                                    placeholder="Describe a requirement..."
                                                />
                                                {!isViewOnly && (
                                                    <button onClick={() => setRoleFormData({ ...roleFormData, qualifications: roleFormData.qualifications.filter((_, idx) => idx !== i) })}
                                                        disabled={isViewOnly}
                                                        className="p-2 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-rose-500 hover:border-rose-100 shadow-sm transition-all disabled:opacity-50">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* How to Apply */}
                                    <FormTextarea label="How to Apply" disabled={isViewOnly} rows={3} value={roleFormData.howToApply} onChange={(e) => setRoleFormData({ ...roleFormData, howToApply: e.target.value })} placeholder="Provide application instructions..." />
                                </section>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                                <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">
                                    {isViewOnly ? 'Back to History' : 'Discard'}
                                </button>
                                {!isViewOnly && (
                                    <button onClick={handleSaveRole} disabled={isSaving}
                                        className={`px-12 py-4 rounded-2xl text-xs font-black transition-all shadow-xl active:scale-95 uppercase tracking-widest flex items-center gap-2 ${isReposting ? 'bg-gradient-to-r from-[#009669] to-[#006D5B] text-white shadow-emerald-500/25' : 'bg-gradient-to-r from-[#009669] to-[#006D5B] text-white shadow-emerald-500/25'}`}>
                                        {isSaving && <Loader2 size={14} className="animate-spin" />}
                                        {isReposting ? (
                                            <>
                                                {!isSaving && <RefreshCcw size={14} />}
                                                {isSaving ? 'Posting...' : 'Confirm Repost'}
                                            </>
                                        ) : (
                                            <>
                                                {!isSaving && <Save size={14} />}
                                                {isSaving ? 'Saving...' : editingRole ? 'Update Profile' : 'Add Job'}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageCareers;
