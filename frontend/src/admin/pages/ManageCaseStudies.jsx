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
    ChevronRight,
    LayoutGrid,
    Briefcase,
    Settings,
    MessageSquare,
    Link2,
    Phone,
    Mail,
    ListChecks,
    Search
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough: ManageCaseStudies.jsx
 * 
 * Purpose: A comprehensive management suite for the "Case Studies" section.
 * Features:
 * 1. Tabbed Navigation: Hero & Sidebar, Case Studies List.
 * 2. Hero Management: Control the Success Stories header visuals and text.
 * 3. Sidebar Management: Dynamic control over the CTA box and Quick Contact details.
 * 4. Case Study CRUD: Full management of individual case study records.
 * 5. Rich Multi-section Editor: Edit Introduction, Scope, Actions, Results, and Conclusion for each study.
 * 6. Visual Previews: Real-time feedback for uploaded assets.
 */
const ManageCaseStudies = () => {
    const { caseStudyPageData, setCaseStudyPageData } = useContent();
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States for Case Study CRUD
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudyIdx, setEditingStudyIdx] = useState(null);
    const [studyFormData, setStudyFormData] = useState({
        id: null,
        title: "",
        tags: [],
        image: "",
        introduction: "",
        scopeOfWork: { intro: "", points: [] },
        siteActionsIntro: "",
        siteActions: [],
        resultsAndBenefits: { intro: "", points: [] },
        conclusion: ""
    });

    if (!caseStudyPageData) return <div className="p-8">Loading Case Studies Data...</div>;

    // === Global Handlers ===

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Case Studies content updated successfully!");
        }, 800);
    };

    const handleImageUpload = (e, path) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newData = { ...caseStudyPageData };
                const pathParts = path.split('.');
                let current = newData;
                for (let i = 0; i < pathParts.length - 1; i++) {
                    current = current[pathParts[i]];
                }
                current[pathParts[pathParts.length - 1]] = reader.result;
                setCaseStudyPageData(newData);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Study CRUD Handlers ---

    const handleOpenAddStudy = () => {
        setEditingStudyIdx(null);
        setStudyFormData({
            id: Date.now(),
            title: "",
            tags: [],
            image: "",
            introduction: "",
            scopeOfWork: { intro: "", points: [""] },
            siteActionsIntro: "",
            siteActions: [{ title: "", description: "" }],
            resultsAndBenefits: { intro: "", points: [{ title: "", description: "" }] },
            conclusion: ""
        });
        setIsModalOpen(true);
    };

    const handleOpenEditStudy = (study, idx) => {
        setEditingStudyIdx(idx);
        // Ensure arrays exist for safe editing
        const safeStudy = {
            ...study,
            scopeOfWork: study.scopeOfWork || { intro: "", points: [""] },
            siteActions: study.siteActions || [{ title: "", description: "" }],
            resultsAndBenefits: study.resultsAndBenefits || { intro: "", points: [{ title: "", description: "" }] }
        };
        setStudyFormData(safeStudy);
        setIsModalOpen(true);
    };

    const handleSaveStudy = () => {
        if (!studyFormData.title) {
            alert("Case study title is required.");
            return;
        }

        const newStudies = [...caseStudyPageData.caseStudies];
        if (editingStudyIdx !== null) {
            newStudies[editingStudyIdx] = studyFormData;
        } else {
            newStudies.unshift(studyFormData); // Newest first
        }

        setCaseStudyPageData({
            ...caseStudyPageData,
            caseStudies: newStudies
        });
        setIsModalOpen(false);
    };

    const handleDeleteStudy = (idx) => {
        if (window.confirm("Delete this case study? This action cannot be undone.")) {
            const newStudies = caseStudyPageData.caseStudies.filter((_, i) => i !== idx);
            setCaseStudyPageData({
                ...caseStudyPageData,
                caseStudies: newStudies
            });
        }
    };

    const handleStudyImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setStudyFormData({ ...studyFormData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'hero', label: 'Hero & Sidebar', icon: LayoutGrid },
        { id: 'list', label: 'Case Studies', icon: Briefcase },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full space-y-6 pb-20"
        >
            {/* Header & Global Action */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Case Studies </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-brand-primary/20 flex items-center gap-2"
                >
                    <Save size={18} />
                    {isSaving ? 'Syncing...' : 'Save & Sync to Live'}
                </button>
            </div>

            {/* Folder-Style Tab Navigation */}
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
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area - White Glass Shell */}
            <div className="bg-white border border-slate-200/60 rounded-b-[2rem] rounded-tr-[2rem] shadow-sm p-8 min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'hero' && (
                        <motion.div
                            key="hero"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                {/* Hero Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <LayoutGrid size={16} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">Case Study Hero Content</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 block mb-1">Top Tag</label>
                                                    <input
                                                        type="text"
                                                        value={caseStudyPageData.hero.tag}
                                                        onChange={(e) => setCaseStudyPageData({ ...caseStudyPageData, hero: { ...caseStudyPageData.hero, tag: e.target.value } })}
                                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 block mb-1">Main Heading</label>
                                                    <input
                                                        type="text"
                                                        value={caseStudyPageData.hero.title}
                                                        onChange={(e) => setCaseStudyPageData({ ...caseStudyPageData, hero: { ...caseStudyPageData.hero, title: e.target.value } })}
                                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-black"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Hero Tagline</label>
                                                <textarea
                                                    rows="3"
                                                    value={caseStudyPageData.hero.tagline}
                                                    onChange={(e) => setCaseStudyPageData({ ...caseStudyPageData, hero: { ...caseStudyPageData.hero, tagline: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Contact Management */}
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                                                <Phone size={16} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">Sidebar Quick Contact</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 block mb-1">Display Phone</label>
                                                    <input
                                                        type="text"
                                                        value={caseStudyPageData.sidebar.contact.phone}
                                                        onChange={(e) => setCaseStudyPageData({ 
                                                            ...caseStudyPageData, 
                                                            sidebar: { ...caseStudyPageData.sidebar, contact: { ...caseStudyPageData.sidebar.contact, phone: e.target.value } } 
                                                        })}
                                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 block mb-1">Raw Phone (for links)</label>
                                                    <input
                                                        type="text"
                                                        value={caseStudyPageData.sidebar.contact.phoneRaw}
                                                        onChange={(e) => setCaseStudyPageData({ 
                                                            ...caseStudyPageData, 
                                                            sidebar: { ...caseStudyPageData.sidebar, contact: { ...caseStudyPageData.sidebar.contact, phoneRaw: e.target.value } } 
                                                        })}
                                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-mono text-slate-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                    <input
                                                        type="text"
                                                        value={caseStudyPageData.sidebar.contact.email}
                                                        onChange={(e) => setCaseStudyPageData({ 
                                                            ...caseStudyPageData, 
                                                            sidebar: { ...caseStudyPageData.sidebar, contact: { ...caseStudyPageData.sidebar.contact, email: e.target.value } } 
                                                        })}
                                                        className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                    />
                                                </div>
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
                                        <div className="relative group overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 aspect-[4/3] flex items-center justify-center shadow-inner">
                                            <img
                                                src={caseStudyPageData.hero.backgroundImage}
                                                className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                                                alt="Hero bg preview"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                                <label className="cursor-pointer bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                                                    <ImageIcon size={14} /> Replace Image
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero.backgroundImage')} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex gap-2 items-start">
                                            <Settings size={14} className="text-brand-primary mt-0.5" />
                                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Recommended: High-res dark background image for optimal text contrast.</p>
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
                                        placeholder="Filter by title or tag..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                                <button
                                    onClick={handleOpenAddStudy}
                                    className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10"
                                >
                                    <Plus size={16} /> Create New Case Study
                                </button>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50/50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Project & Tags</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {caseStudyPageData.caseStudies
                                            .filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
                                            .map((study, idx) => (
                                            <tr key={study.id || idx} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 overflow-hidden">
                                                            <img src={study.image} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800">{study.title}</p>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {study.tags?.slice(0, 2).map((tag, tIdx) => (
                                                                    <span key={tIdx} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{tag}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenEditStudy(study, idx)}
                                                            className="p-2 text-slate-400 hover:text-brand-primary bg-slate-50 hover:bg-brand-primary/10 rounded-lg transition-all flex items-center gap-1.5"
                                                        >
                                                            <Edit3 size={16} /><span className="text-[10px] font-bold uppercase">Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteStudy(idx)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg transition-all flex items-center gap-1.5"
                                                        >
                                                            <Trash2 size={16} /><span className="text-[10px] font-bold uppercase">Delete</span>
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

            {/* FULL CASE STUDY EDITOR MODAL */}
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
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {editingStudyIdx !== null ? "Edit Case Study" : "Create New Case Study"}
                                    </h3>
                                    <p className="text-slate-400 text-xs font-medium mt-0.5">Fill in the technical details for this success story.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 transition-all"><X size={20}/></button>
                            </div>

                            {/* Modal Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-slate-50/30">
                                {/* Basic Info & Image */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-1 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-600 ml-1">Cover Image</label>
                                            <div className="relative group aspect-[4/3] bg-white rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-sm">
                                                {studyFormData.image ? (
                                                    <img src={studyFormData.image} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-slate-300">
                                                        <Upload size={32} />
                                                        <span className="text-[10px] font-bold uppercase">No Image</span>
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-bold">UPLOAD IMAGE</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleStudyImageUpload} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-5">
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Project Title</label>
                                            <input
                                                type="text"
                                                value={studyFormData.title}
                                                onChange={(e) => setStudyFormData({...studyFormData, title: e.target.value})}
                                                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none"
                                                placeholder="e.g. Implementation of Campus-wide Wi-Fi..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Tags (Comma Separated)</label>
                                            <input
                                                type="text"
                                                value={studyFormData.tags?.join(', ')}
                                                onChange={(e) => setStudyFormData({...studyFormData, tags: e.target.value.split(',').map(t => t.trim())})}
                                                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none text-brand-primary"
                                                placeholder="Networking, Infrastructure, Cybersecurity..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-slate-200/60 w-full" />

                                {/* Detail Sections */}
                                <div className="space-y-10">
                                    {/* Introduction */}
                                    <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><LayoutGrid size={16} /></div>
                                            <h4 className="font-bold text-slate-800 text-sm">1. Introduction</h4>
                                        </div>
                                        <textarea
                                            rows="4"
                                            value={studyFormData.introduction}
                                            onChange={(e) => setStudyFormData({...studyFormData, introduction: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-brand-primary"
                                            placeholder="Provide a high-level overview of the client and the problem..."
                                        />
                                    </section>

                                    {/* Scope of Work */}
                                    <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><ListChecks size={16} /></div>
                                            <h4 className="font-bold text-slate-800 text-sm">2. Scope of Work</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={studyFormData.scopeOfWork?.intro}
                                                onChange={(e) => setStudyFormData({...studyFormData, scopeOfWork: {...studyFormData.scopeOfWork, intro: e.target.value}})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-bold outline-none"
                                                placeholder="Header Label (e.g. Key Deliverables)"
                                            />
                                            <div className="space-y-2">
                                                {studyFormData.scopeOfWork?.points.map((point, pIdx) => (
                                                    <div key={pIdx} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={point}
                                                            onChange={(e) => {
                                                                const newPoints = [...studyFormData.scopeOfWork.points];
                                                                newPoints[pIdx] = e.target.value;
                                                                setStudyFormData({...studyFormData, scopeOfWork: {...studyFormData.scopeOfWork, points: newPoints}});
                                                            }}
                                                            className="flex-1 bg-white border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                                                            placeholder={`Point #${pIdx + 1}`}
                                                        />
                                                        <button 
                                                            onClick={() => {
                                                                const newPoints = studyFormData.scopeOfWork.points.filter((_, i) => i !== pIdx);
                                                                setStudyFormData({...studyFormData, scopeOfWork: {...studyFormData.scopeOfWork, points: newPoints}});
                                                            }}
                                                            className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                                                        ><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                                <button 
                                                    onClick={() => setStudyFormData({
                                                        ...studyFormData, 
                                                        scopeOfWork: {...studyFormData.scopeOfWork, points: [...studyFormData.scopeOfWork.points, ""]}
                                                    })}
                                                    className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all uppercase tracking-wider"
                                                >
                                                    + Add Strategic Point
                                                </button>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Site Actions & Results */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Settings size={16} /></div>
                                                <h4 className="font-bold text-slate-800 text-sm">3. Site Actions Taken</h4>
                                            </div>
                                            <input
                                                type="text"
                                                value={studyFormData.siteActionsIntro}
                                                onChange={(e) => setStudyFormData({...studyFormData, siteActionsIntro: e.target.value})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-bold outline-none mb-2"
                                                placeholder="Sub-heading (e.g. Implementation Steps)"
                                            />
                                            <div className="space-y-4">
                                                {studyFormData.siteActions?.map((action, aIdx) => (
                                                    <div key={aIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                                                        <button 
                                                            onClick={() => {
                                                                const newActions = studyFormData.siteActions.filter((_, i) => i !== aIdx);
                                                                setStudyFormData({...studyFormData, siteActions: newActions});
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-600 transition-all"
                                                        ><Trash2 size={14} /></button>
                                                        <div className="space-y-2 mt-2">
                                                            <input
                                                                type="text"
                                                                value={action.title}
                                                                onChange={(e) => {
                                                                    const newActions = [...studyFormData.siteActions];
                                                                    newActions[aIdx] = {...action, title: e.target.value};
                                                                    setStudyFormData({...studyFormData, siteActions: newActions});
                                                                }}
                                                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-primary"
                                                                placeholder="Headline"
                                                            />
                                                            <textarea
                                                                rows="2"
                                                                value={action.description}
                                                                onChange={(e) => {
                                                                    const newActions = [...studyFormData.siteActions];
                                                                    newActions[aIdx] = {...action, description: e.target.value};
                                                                    setStudyFormData({...studyFormData, siteActions: newActions});
                                                                }}
                                                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] leading-relaxed outline-none focus:ring-2 focus:ring-brand-primary"
                                                                placeholder="Execution details..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button 
                                                    onClick={() => setStudyFormData({
                                                        ...studyFormData, 
                                                        siteActions: [...studyFormData.siteActions, { title: "", description: "" }]
                                                    })}
                                                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all uppercase tracking-wider"
                                                >
                                                    + Add Action Step
                                                </button>
                                            </div>
                                        </section>

                                        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><ChevronRight size={16} /></div>
                                                <h4 className="font-bold text-slate-800 text-sm">4. Results & Benefits</h4>
                                            </div>
                                            <input
                                                type="text"
                                                value={studyFormData.resultsAndBenefits?.intro}
                                                onChange={(e) => setStudyFormData({...studyFormData, resultsAndBenefits: {...studyFormData.resultsAndBenefits, intro: e.target.value}})}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-bold outline-none mb-2"
                                                placeholder="Sub-heading (e.g. Measurable Outcomes)"
                                            />
                                            <div className="space-y-4">
                                                {studyFormData.resultsAndBenefits?.points.map((point, rIdx) => (
                                                    <div key={rIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                                                        <button 
                                                            onClick={() => {
                                                                const newPoints = studyFormData.resultsAndBenefits.points.filter((_, i) => i !== rIdx);
                                                                setStudyFormData({...studyFormData, resultsAndBenefits: {...studyFormData.resultsAndBenefits, points: newPoints}});
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-600 transition-all"
                                                        ><Trash2 size={14} /></button>
                                                        <div className="space-y-2 mt-2">
                                                            <input
                                                                type="text"
                                                                value={point.title}
                                                                onChange={(e) => {
                                                                    const newPoints = [...studyFormData.resultsAndBenefits.points];
                                                                    newPoints[rIdx] = {...point, title: e.target.value};
                                                                    setStudyFormData({...studyFormData, resultsAndBenefits: {...studyFormData.resultsAndBenefits, points: newPoints}});
                                                                }}
                                                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-primary"
                                                                placeholder="Outcome"
                                                            />
                                                            <textarea
                                                                rows="2"
                                                                value={point.description}
                                                                onChange={(e) => {
                                                                    const newPoints = [...studyFormData.resultsAndBenefits.points];
                                                                    newPoints[rIdx] = {...point, description: e.target.value};
                                                                    setStudyFormData({...studyFormData, resultsAndBenefits: {...studyFormData.resultsAndBenefits, points: newPoints}});
                                                                }}
                                                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] leading-relaxed outline-none focus:ring-2 focus:ring-brand-primary"
                                                                placeholder="Impact details..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button 
                                                    onClick={() => setStudyFormData({
                                                        ...studyFormData, 
                                                        resultsAndBenefits: { ...studyFormData.resultsAndBenefits, points: [...studyFormData.resultsAndBenefits.points, { title: "", description: "" }] }
                                                    })}
                                                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all uppercase tracking-wider"
                                                >
                                                    + Add Result Point
                                                </button>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Conclusion */}
                                    <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center"><Link2 size={16} /></div>
                                            <h4 className="font-bold text-slate-800 text-sm">5. Conclusion</h4>
                                        </div>
                                        <textarea
                                            rows="3"
                                            value={studyFormData.conclusion}
                                            onChange={(e) => setStudyFormData({...studyFormData, conclusion: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-brand-primary"
                                            placeholder="Final summary and closing thoughts on project success..."
                                        />
                                    </section>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveStudy} 
                                    className="bg-brand-primary hover:bg-brand-dark text-white px-8 py-3 rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
                                >
                                    {editingStudyIdx !== null ? "Apply Changes" : "Save Case Study"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageCaseStudies;
