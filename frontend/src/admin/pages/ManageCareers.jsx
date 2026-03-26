import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    Image as ImageIcon,
    Plus,
    Trash2,
    X,
    Edit3,
    Upload,
    LayoutGrid,
    Briefcase,
    FileText,
    ListChecks,
    Search,
    ChevronRight,
    Users,
    Clock,
    Layers,
    Settings,
    Mail
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough: ManageCareers.jsx
 * 
 * Purpose: A management suite for the "Careers" section.
 * Features:
 * 1. Hero Management: Control the Careers header visuals and text.
 * 2. Intro Section: Editable heading, description, and image (User requested 1-on-1 text/image layout).
 * 3. Job Listings CRUD: Full management of job cards as seen in the public job board.
 * 4. Rich Job Editor: Multi-section modal for Role Overview, Responsibilities, Qualifications, and Skills.
 */
const ManageCareers = () => {
    const { careersPageData, setCareersPageData } = useContent();
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States for Job CRUD
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoleIdx, setEditingRoleIdx] = useState(null);
    const [roleFormData, setRoleFormData] = useState({
        id: null,
        title: "",
        experience: "",
        openings: 0,
        postedDate: "",
        category: "",
        slug: "",
        roleOverview: "",
        responsibilities: [],
        qualifications: [],
        howToApply: ""
    });

    if (!careersPageData) return <div className="p-8">Loading Careers Data...</div>;

    // === Global Handlers ===

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Careers content updated successfully!");
        }, 800);
    };

    const handleImageUpload = (e, path) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newData = { ...careersPageData };
                const pathParts = path.split('.');
                let current = newData;
                for (let i = 0; i < pathParts.length - 1; i++) {
                    current = current[pathParts[i]];
                }
                current[pathParts[pathParts.length - 1]] = reader.result;
                setCareersPageData(newData);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Role CRUD Handlers ---

    const handleOpenAddRole = () => {
        setEditingRoleIdx(null);
        setRoleFormData({
            id: Date.now(),
            title: "",
            experience: "",
            openings: 1,
            postedDate: new Date().toISOString().split('T')[0],
            category: "",
            slug: "",
            roleOverview: "",
            responsibilities: [""],
            qualifications: [""],
            howToApply: "To apply for this position, please send your resume to hr@amyntortech.com. Be sure to include the job title in the subject line."
        });
        setIsModalOpen(true);
    };

    const handleOpenEditRole = (role, idx) => {
        setEditingRoleIdx(idx);
        setRoleFormData({
            ...role,
            responsibilities: role.responsibilities || [""],
            qualifications: role.qualifications || [""],
            howToApply: role.howToApply || ""
        });
        setIsModalOpen(true);
    };

    const handleSaveRole = () => {
        if (!roleFormData.title) {
            alert("Job title is required.");
            return;
        }

        const newRoles = [...careersPageData.openRoles];
        // Auto-generate slug if missing
        if (!roleFormData.slug) {
            roleFormData.slug = roleFormData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        if (editingRoleIdx !== null) {
            newRoles[editingRoleIdx] = roleFormData;
        } else {
            newRoles.unshift(roleFormData);
        }

        setCareersPageData({
            ...careersPageData,
            openRoles: newRoles
        });
        setIsModalOpen(false);
    };

    const handleDeleteRole = (idx) => {
        if (window.confirm("Delete this job listing?")) {
            const newRoles = careersPageData.openRoles.filter((_, i) => i !== idx);
            setCareersPageData({
                ...careersPageData,
                openRoles: newRoles
            });
        }
    };

    const tabs = [
        { id: 'hero', label: 'Hero Section', icon: LayoutGrid },
        { id: 'intro', label: 'Intro Section', icon: Layers },
        { id: 'list', label: 'Open Roles', icon: Briefcase },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full space-y-6 pb-20"
        >
            {/* Header */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Careers Management</h1>
                    {/* <p className="text-slate-400 text-sm font-medium mt-1">Manage hero visuals, team culture, and job listings.</p> */}
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-brand-primary/20 flex items-center gap-2"
                >
                    <Save size={18} />
                    {isSaving ? 'Syncing...' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200/60 pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-t-xl font-bold text-sm transition-all ${activeTab === tab.id
                            ? 'bg-white text-brand-primary border-t border-x border-slate-200/60 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] translate-y-[1px]'
                            : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-white/40 border border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <tab.icon size={16} />
                            {tab.label}
                        </div>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white border border-slate-200/60 rounded-b-[2rem] rounded-tr-[2rem] shadow-sm p-8 min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'hero' && (
                        <motion.div
                            key="hero"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><LayoutGrid size={16} /></div>
                                            <h3 className="text-lg font-bold text-slate-800"> Hero section</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 block mb-1">Top Tag</label>
                                                    <input
                                                        type="text"
                                                        value={careersPageData.hero.tag}
                                                        onChange={(e) => setCareersPageData({ ...careersPageData, hero: { ...careersPageData.hero, tag: e.target.value } })}
                                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 block mb-1">Main Heading</label>
                                                    <input
                                                        type="text"
                                                        value={careersPageData.hero.title}
                                                        onChange={(e) => setCareersPageData({ ...careersPageData, hero: { ...careersPageData.hero, title: e.target.value } })}
                                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-black"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Hero Tagline</label>
                                                <textarea
                                                    rows="3"
                                                    value={careersPageData.hero.tagline}
                                                    onChange={(e) => setCareersPageData({ ...careersPageData, hero: { ...careersPageData.hero, tagline: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Hero Visuals</h3>
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">Background Preview</span>
                                        </div>
                                        <div className="relative group overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3] flex items-center justify-center border border-slate-200 shadow-inner">
                                            <img
                                                src={careersPageData.hero.backgroundImage}
                                                className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                                                alt="Hero Preview"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                                <label className="cursor-pointer bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                                                    <ImageIcon size={14} /> Replace Background
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero.backgroundImage')} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Users size={16} /></div>
                                            <h3 className="text-lg font-bold text-slate-800"> Overview</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Intro Heading</label>
                                                <input
                                                    type="text"
                                                    value={careersPageData.intro.heading}
                                                    onChange={(e) => setCareersPageData({ ...careersPageData, intro: { ...careersPageData.intro, heading: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
                                                <textarea
                                                    rows="8"
                                                    value={careersPageData.intro.description}
                                                    onChange={(e) => setCareersPageData({ ...careersPageData, intro: { ...careersPageData.intro, description: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Culture Imagery</h3>
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">Side Image</span>
                                        </div>
                                        <div className="relative group overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3] flex items-center justify-center border border-slate-200 shadow-inner">
                                            {careersPageData.intro.image ? (
                                                <img src={careersPageData.intro.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Intro Preview" />
                                            ) : (
                                                <ImageIcon size={40} className="text-slate-200" />
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                                <label className="cursor-pointer bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                                                    <Upload size={14} /> Upload New Image
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'intro.image')} />
                                                </label>
                                            </div>
                                        </div>
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
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="relative flex-1 max-w-md">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by role or category..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                                <button
                                    onClick={handleOpenAddRole}
                                    className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
                                >
                                    <Plus size={16} /> Post New Job
                                </button>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50/50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Job Title & Category</th>
                                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Openings</th>
                                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Experience</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {careersPageData.openRoles
                                            .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((role, idx) => (
                                            <tr key={role.id || idx} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-slate-800">{role.title}</p>
                                                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">{role.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Users size={14} className="text-slate-400" />
                                                        <span className="font-bold">{role.openings}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Clock size={14} className="text-slate-400" />
                                                        <span className="font-bold">{role.experience}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenEditRole(role, idx)}
                                                            className="p-2 text-slate-400 hover:text-brand-primary bg-slate-50 hover:bg-brand-primary/10 rounded-lg transition-all"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteRole(idx)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* JOB EDITOR MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {editingRoleIdx !== null ? "Edit Job Listing" : "Post New Job"}
                                    </h3>
                                    <p className="text-slate-400 text-xs font-medium mt-0.5">Define role details, responsibilities, and requirements.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 transition-all focus:rotate-90"><X size={20}/></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-slate-50/20">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="lg:col-span-2">
                                        <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Job Title</label>
                                            <input
                                                type="text"
                                                value={roleFormData.title}
                                                onChange={(e) => setRoleFormData({...roleFormData, title: e.target.value})}
                                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none shadow-sm"
                                            />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Category</label>
                                        <input
                                            type="text"
                                            value={roleFormData.category}
                                            onChange={(e) => setRoleFormData({...roleFormData, category: e.target.value})}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Experience</label>
                                        <input
                                            type="text"
                                            value={roleFormData.experience}
                                            onChange={(e) => setRoleFormData({...roleFormData, experience: e.target.value})}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">No. of Openings</label>
                                        <input
                                            type="number"
                                            value={roleFormData.openings}
                                            onChange={(e) => setRoleFormData({...roleFormData, openings: parseInt(e.target.value)})}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none shadow-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Job URL Slug (Auto-generated if blank)</label>
                                        <input
                                            type="text"
                                            value={roleFormData.slug}
                                            onChange={(e) => setRoleFormData({...roleFormData, slug: e.target.value})}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-500 focus:ring-2 focus:ring-brand-primary outline-none shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Detailed Content Editor */}
                                <div className="space-y-8">
                                    <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Layers size={16} /></div>
                                            <h4 className="font-bold text-slate-800 text-sm">Role Overview</h4>
                                        </div>
                                        <textarea
                                            rows="4"
                                            value={roleFormData.roleOverview}
                                            onChange={(e) => setRoleFormData({...roleFormData, roleOverview: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </section>

                                    {/* Points Lists */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Responsibilities */}
                                        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><ListChecks size={16} /></div>
                                                <h4 className="font-bold text-slate-800 text-sm">Key Responsibilities</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {roleFormData.responsibilities.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <textarea
                                                            rows="1"
                                                            value={item}
                                                            onChange={(e) => {
                                                                const newList = [...roleFormData.responsibilities];
                                                                newList[idx] = e.target.value;
                                                                setRoleFormData({...roleFormData, responsibilities: newList});
                                                            }}
                                                            className="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                                                        />
                                                        <button 
                                                            onClick={() => setRoleFormData({...roleFormData, responsibilities: roleFormData.responsibilities.filter((_, i) => i !== idx)})}
                                                            className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                                                        ><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                                <button 
                                                    onClick={() => setRoleFormData({...roleFormData, responsibilities: [...roleFormData.responsibilities, ""]})}
                                                    className="w-full py-2.5 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all uppercase tracking-widest"
                                                >
                                                    + Add Responsibility
                                                </button>
                                            </div>
                                        </section>

                                        {/* Qualifications */}
                                        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><FileText size={16} /></div>
                                                <h4 className="font-bold text-slate-800 text-sm">Qualifications & Experience</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {roleFormData.qualifications.map((item, idx) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <textarea
                                                            rows="1"
                                                            value={item}
                                                            onChange={(e) => {
                                                                const newList = [...roleFormData.qualifications];
                                                                newList[idx] = e.target.value;
                                                                setRoleFormData({...roleFormData, qualifications: newList});
                                                            }}
                                                            className="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                                                        />
                                                        <button 
                                                            onClick={() => setRoleFormData({...roleFormData, qualifications: roleFormData.qualifications.filter((_, i) => i !== idx)})}
                                                            className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                                                        ><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                                <button 
                                                    onClick={() => setRoleFormData({...roleFormData, qualifications: [...roleFormData.qualifications, ""]})}
                                                    className="w-full py-2.5 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all uppercase tracking-widest"
                                                >
                                                    + Add Qualification
                                                </button>
                                            </div>
                                        </section>
                                    </div>

                                    {/* How to Apply Section */}
                                    <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center"><Mail size={16} /></div>
                                            <h4 className="font-bold text-slate-800 text-sm">How to Apply</h4>
                                        </div>
                                        <textarea
                                            rows="4"
                                            value={roleFormData.howToApply}
                                            onChange={(e) => setRoleFormData({...roleFormData, howToApply: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </section>
                                </div>
                            </div>

                            <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest">Cancel</button>
                                <button 
                                    onClick={handleSaveRole} 
                                    className="bg-brand-primary hover:bg-brand-dark text-white px-10 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    {editingRoleIdx !== null ? "Update Job Post" : "Publish Job Post"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageCareers;
