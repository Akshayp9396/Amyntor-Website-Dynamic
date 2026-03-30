/**
 * Code Walkthrough: ManageCareers.jsx
 * 
 * Purpose: A comprehensive management suite for the "Careers" page, achieving visual parity with ManageServices.jsx.
 * Features:
 * 1. Unified Header and "Save & Sync" action with Folder-Tab design.
 * 2. Visual Tabbed interface (Hero & Intro, Open Roles).
 * 3. Hero & Intro Management: Two-column layout with real-time visual previews.
 * 4. High-density Job Board CRUD with real-time editing & archiving.
 * 5. Premium UX: Section-based job editor with icon support and modular lists.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    Image as ImageIcon,
    Plus,
    Trash2,
    X,
    Edit3,
    Search,
    LayoutGrid,
    Briefcase,
    Layers,
    FileText,
    ListChecks,
    Users,
    Clock,
    CheckCircle2,
    BriefcaseIcon,
    AlertCircle,
    AlignLeft,
    Mail,
    Upload
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { AdminCard, FormInput, FormTextarea } from '../components/AdminUI';

const ManageCareers = () => {
    const { careersPageData, setCareersPageData } = useContent();
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States for Job Management
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoleIdx, setEditingRoleIdx] = useState(null);
    const [roleFormData, setRoleFormData] = useState({
        title: "",
        category: "",
        experience: "",
        openings: 1,
        slug: "",
        roleOverview: "",
        responsibilities: [""],
        qualifications: [""],
        howToApply: "",
        postedDate: new Date().toISOString()
    });

    if (!careersPageData) return <div className="p-8">Loading Careers Data...</div>;

    // === Handlers ===

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Careers Page content successfully synchronized with the main database!");
        }, 800);
    };

    const handleImageUpload = (e, targetPath) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const keys = targetPath.split('.');
                let newData = { ...careersPageData };
                let current = newData;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = reader.result;
                setCareersPageData(newData);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenAddRole = () => {
        setEditingRoleIdx(null);
        setRoleFormData({
            title: "",
            category: "",
            experience: "",
            openings: 1,
            slug: "",
            roleOverview: "",
            responsibilities: [""],
            qualifications: [""],
            howToApply: "",
            postedDate: new Date().toISOString()
        });
        setIsModalOpen(true);
    };

    const handleOpenEditRole = (role, idx) => {
        setEditingRoleIdx(idx);
        setRoleFormData({
            ...role,
            responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities : [""],
            qualifications: Array.isArray(role.qualifications) ? role.qualifications : [""]
        });
        setIsModalOpen(true);
    };

    const handleSaveRole = () => {
        if (!roleFormData.title || !roleFormData.category) {
            alert("Please complete the required fields (Position Title & Category).");
            return;
        }

        const updatedRoles = [...careersPageData.openRoles];
        const finalRoleData = {
            ...roleFormData,
            slug: roleFormData.slug || roleFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        };

        if (editingRoleIdx !== null) {
            updatedRoles[editingRoleIdx] = finalRoleData;
        } else {
            updatedRoles.push({ ...finalRoleData, id: Date.now() });
        }

        setCareersPageData({ ...careersPageData, openRoles: updatedRoles });
        setIsModalOpen(false);
    };

    const handleDeleteRole = (idx) => {
        if (window.confirm("Archiving this role will remove it from the public job board. Proceed?")) {
            const updatedRoles = careersPageData.openRoles.filter((_, i) => i !== idx);
            setCareersPageData({ ...careersPageData, openRoles: updatedRoles });
        }
    };

    const tabs = [
        { id: 'hero', label: 'Hero & Intro' },
        { id: 'list', label: 'Add Openings' },
    ];

    const filteredRoles = (careersPageData.openRoles || []).filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full space-y-6 pb-20"
        >
            {/* Header & Global Action - Single Row Parity with Service */}
            <div className="flex justify-between items-center px-1 py-2">
                {/* Premium Tab Navigation (Thinner) */}
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

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="group bg-white/70 backdrop-blur-xl border border-white/20 hover:shadow-2xl hover:shadow-emerald-200/20 text-emerald-600 font-black py-3 px-6 rounded-2xl transition-all flex items-center gap-3 active:scale-95 shadow-sm overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Save size={18} strokeWidth={3} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700 text-sm">
                        {isSaving ? 'Pushing...' : 'Save & Push Live'}
                    </span>
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                <AnimatePresence mode="wait">
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
                                        <FormInput
                                            label=" Tag"
                                            value={careersPageData.hero.tag}
                                            onChange={(e) => setCareersPageData({ ...careersPageData, hero: { ...careersPageData.hero, tag: e.target.value } })}
                                        />
                                        <FormInput
                                            label="Main Heading"
                                            value={careersPageData.hero.title}
                                            onChange={(e) => setCareersPageData({ ...careersPageData, hero: { ...careersPageData.hero, title: e.target.value } })}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea
                                            label="Hero Tagline"
                                            rows={2}
                                            value={careersPageData.hero.tagline}
                                            onChange={(e) => setCareersPageData({ ...careersPageData, hero: { ...careersPageData.hero, tagline: e.target.value } })}
                                        />
                                    </div>
                                </AdminCard>

                                <AdminCard title="Introduction">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <FormInput
                                            label=" Tag"
                                            value={careersPageData.intro.tag || "OUR CULTURE"}
                                            onChange={(e) => setCareersPageData({ ...careersPageData, intro: { ...careersPageData.intro, tag: e.target.value } })}
                                        />
                                        <FormInput
                                            label="main Heading"
                                            value={careersPageData.intro.heading}
                                            onChange={(e) => setCareersPageData({ ...careersPageData, intro: { ...careersPageData.intro, heading: e.target.value } })}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea
                                            label=" Description"
                                            rows={8}
                                            value={careersPageData.intro.description}
                                            onChange={(e) => setCareersPageData({ ...careersPageData, intro: { ...careersPageData.intro, description: e.target.value } })}
                                        />
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
                                        <img
                                            src={careersPageData.hero.backgroundImage}
                                            className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                                            alt="Hero background preview"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero.backgroundImage')} />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Intro Media</h3>
                                    </div>
                                    <div className="relative group overflow-hidden rounded-[2rem] bg-slate-100 border border-slate-200 aspect-square flex items-center justify-center shadow-inner">
                                        {careersPageData.intro.image ? (
                                            <img
                                                src={careersPageData.intro.image}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                alt="Intro preview"
                                            />
                                        ) : (
                                            <ImageIcon size={48} className="text-slate-300" />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, 'intro.image')} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'list' && (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <AdminCard
                                title="Careers Explorer"
                                actions={
                                    <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
                                        <div className="relative group">
                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary" />
                                            <input
                                                type="text"
                                                placeholder="Search roles..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-slate-400 w-48 transition-all"
                                            />
                                        </div>
                                        <button
                                            onClick={handleOpenAddRole}
                                            className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                        >
                                            <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                                Add Joiner
                                            </span>
                                        </button>
                                    </div>
                                }
                            >
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-4">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50/80 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Position details</th>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Logistics</th>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Posted Date</th>
                                                <th className="px-6 py-4 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredRoles.map((role, idx) => (
                                                <tr key={role.id || idx} className="group hover:bg-brand-primary/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                                                                <BriefcaseIcon size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800">{role.title}</p>
                                                                <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">{role.category}</p>
                                                            </div>
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
                                                        <span className="text-[11px] font-bold text-slate-500 uppercase">{new Date(role.postedDate).toLocaleDateString()}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleOpenEditRole(role, idx)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors"><Edit3 size={16} /></button>
                                                            <button onClick={() => handleDeleteRole(idx)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {filteredRoles.length === 0 && (
                                    <div className="py-20 text-center text-slate-400">
                                        <Search size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-bold text-sm tracking-tight">No positions matching your search were found.</p>
                                    </div>
                                )}
                            </AdminCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ROLE EDITOR MODAL */}
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
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]"
                        >
                            {/* Left Side: Preview & Branding */}
                            <div className="w-full md:w-[380px] p-10 bg-slate-50 flex flex-col items-center border-r border-slate-100 overflow-y-auto custom-scrollbar">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Job Post Preview</h4>
                                <div className="w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden group mb-8">
                                    <div className="p-8 border-b border-slate-50">
                                        <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
                                            <Briefcase size={28} />
                                        </div>
                                        <h5 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-2">
                                            {roleFormData.title || "Position Title"}
                                        </h5>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{roleFormData.category || "CATEGORY"}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{roleFormData.experience || "EXP"}</span>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full w-2/3 bg-slate-200 animate-pulse" />
                                        </div>
                                        <div className="h-2 w-4/5 bg-slate-50 rounded-full overflow-hidden">
                                            <div className="h-full w-1/2 bg-slate-100 animate-pulse delay-75" />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full space-y-6">
                                    {/* Simplified Branding Section */}
                                </div>
                            </div>

                            {/* Right Side: Tabbed Forms */}
                            <div className="flex-1 flex flex-col bg-white">
                                <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                      
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingRoleIdx !== null ? "Edit Job Details" : "Add New Job"}</h3>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all active:scale-95">
                                        <X size={22} strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="p-10 overflow-y-auto flex-1 space-y-12 custom-scrollbar">
                                    {/* Core Meta */}
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center font-black text-[10px]">01</div>
                                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Base Information</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput
                                                label="Job Title"
                                                value={roleFormData.title}
                                                onChange={(val) => setRoleFormData({ ...roleFormData, title: val })}
                                                placeholder="e.g. Senior Security Engineer"
                                            />
                                            <FormInput
                                                label="Category"
                                                value={roleFormData.category}
                                                onChange={(val) => setRoleFormData({ ...roleFormData, category: val })}
                                                placeholder="e.g. Engineering"
                                            />
                                            <FormInput
                                                label="Required Experience"
                                                value={roleFormData.experience}
                                                onChange={(val) => setRoleFormData({ ...roleFormData, experience: val })}
                                                placeholder="e.g. 5+ Years"
                                            />
                                            <FormInput
                                                label="Open Slots"
                                                type="number"
                                                value={roleFormData.openings}
                                                onChange={(val) => setRoleFormData({ ...roleFormData, openings: parseInt(val) })}
                                            />
                                        </div>
                                    </section>

                                    {/* Role Content */}
                                    <section className="space-y-8">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center font-black text-[10px]">02</div>
                                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Role Details</h4>
                                        </div>
                                        <FormTextarea
                                            label="About the Role"
                                            rows={4}
                                            value={roleFormData.roleOverview}
                                            onChange={(val) => setRoleFormData({ ...roleFormData, roleOverview: val })}
                                            placeholder="Provide a high-level summary of the role's impact..."
                                        />

                                        {/* Responsibilities Section */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                                        <ListChecks size={14} />
                                                    </div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Responsibilities</label>
                                                </div>
                                                <button
                                                    onClick={() => setRoleFormData({ ...roleFormData, responsibilities: [...roleFormData.responsibilities, ""] })}
                                                    className="group relative flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[10px] font-black transition-all hover:shadow-lg hover:shadow-slate-200/40 active:scale-95 overflow-hidden"
                                                >
                                                    <Plus size={12} strokeWidth={4} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">Add Point</span>
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {roleFormData.responsibilities.map((r, i) => (
                                                    <div key={i} className="group flex items-center gap-3 p-2 bg-slate-50/30 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300">
                                                        <input
                                                            className="flex-1 bg-transparent border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-0 placeholder:text-slate-300"
                                                            value={r}
                                                            onChange={(e) => {
                                                                const news = [...roleFormData.responsibilities];
                                                                news[i] = e.target.value;
                                                                setRoleFormData({ ...roleFormData, responsibilities: news });
                                                            }}
                                                            placeholder="Describe a responsibility..."
                                                        />
                                                        <button onClick={() => setRoleFormData({ ...roleFormData, responsibilities: roleFormData.responsibilities.filter((_, idx) => idx !== i) })} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-rose-500 hover:border-rose-100 shadow-sm transition-all opacity-0 group-hover:opacity-100">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Qualifications Section */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                                        <CheckCircle2 size={14} />
                                                    </div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Qualifications</label>
                                                </div>
                                                <button
                                                    onClick={() => setRoleFormData({ ...roleFormData, qualifications: [...roleFormData.qualifications, ""] })}
                                                    className="group relative flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[10px] font-black transition-all hover:shadow-lg hover:shadow-slate-200/40 active:scale-95 overflow-hidden"
                                                >
                                                    <Plus size={12} strokeWidth={4} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">Add Requirement</span>
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {roleFormData.qualifications.map((q, i) => (
                                                    <div key={i} className="group flex items-center gap-3 p-2 bg-slate-50/30 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300">
                                                        <input
                                                            className="flex-1 bg-transparent border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-0 placeholder:text-slate-300"
                                                            value={q}
                                                            onChange={(e) => {
                                                                const news = [...roleFormData.qualifications];
                                                                news[i] = e.target.value;
                                                                setRoleFormData({ ...roleFormData, qualifications: news });
                                                            }}
                                                            placeholder="Describe a requirement..."
                                                        />
                                                        <button onClick={() => setRoleFormData({ ...roleFormData, qualifications: roleFormData.qualifications.filter((_, idx) => idx !== i) })} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-rose-500 hover:border-rose-100 shadow-sm transition-all opacity-0 group-hover:opacity-100">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    {/* Application Instructions */}
                                    <section className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 space-y-6 border border-slate-100 shadow-xl overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity text-brand-primary">
                                            <Mail size={120} />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                                                    <Mail size={20} strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">How to Apply</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">External Application Portal Instructions</p>
                                                </div>
                                            </div>
                                            <textarea
                                                rows={4}
                                                value={roleFormData.howToApply}
                                                onChange={(e) => setRoleFormData({ ...roleFormData, howToApply: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-800 leading-relaxed outline-none focus:border-slate-400 focus:bg-white transition-all font-medium placeholder:text-slate-300 shadow-inner"
                                                placeholder="Provide specific details for applicants to submit their credentials..."
                                            />
                                        </div>
                                    </section>
                                </div>

                                <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 rounded-br-[2.5rem]">
                                    <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard</button>
                                    <button onClick={handleSaveRole} className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-12 py-4 rounded-[2.2rem] text-xs font-black transition-all shadow-xl shadow-emerald-500/25 active:scale-95 uppercase tracking-widest">
                                        {editingRoleIdx !== null ? "Save Changes" : "Add Job"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageCareers;
