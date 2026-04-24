/**
 * Code Walkthrough: ManageCaseStudies.jsx
 * 
 * Purpose: A comprehensive management suite for the "Case Studies" section.
 * Features:
 * 1. Unified Header and "Save & Push Live" action with "Premium Pill" tab design.
 * 2. Visual Tabbed interface (Hero & Sidebar, Case Studies List).
 * 3. High-density CRUD for Case Studies:
 *    - Main details (Title, Tags, Cover Image).
 *    - Deep content management (Introduction, Scope, Actions, Results, Conclusion).
 * 4. Advanced UX: Glassmorphism layout, modular card inputs, and real-time previews.
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
    Upload,
    ChevronRight,
    LayoutGrid,
    Briefcase,
    Settings,
    Link2,
    Phone,
    Mail,
    ListChecks,
    Search,
    Type,
    ClipboardList,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { AdminCard, FormInput, FormTextarea } from '../components/AdminUI';
import ContentService from '../../services/contentService';
import { useNotification } from '../context/NotificationContext'; // 🛡️ MISSION: Absolute UI Parity

const ManageCaseStudies = () => {
    const { caseStudyPageData, setCaseStudyPageData, refreshContent } = useContent();
    const { showNotification } = useNotification(); // 🕵️ MISSION: Notification Authority
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States for Case Study CRUD
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudyId, setEditingStudyId] = useState(null);
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

    // 🛡️ MISSION: Tag Input Stability
    const [tagInput, setTagInput] = useState("");

    if (!caseStudyPageData) return <div className="p-8 text-slate-400 font-bold tracking-widest uppercase text-[10px]">Registry Hydrating...</div>;

    // === Global Handlers ===

    const handleSave = async () => {
        try {
            setIsSaving(true);
            // 🛡️ MISSION: Persist Hero content
            const res = await ContentService.updateCaseStudyHero({
                tag: caseStudyPageData.hero.tag,
                title: caseStudyPageData.hero.title,
                tagline: caseStudyPageData.hero.tagline,
                backgroundImage: caseStudyPageData.hero.backgroundImage
            });

            if (res.success) {
                await refreshContent();
                showNotification("Changes saved successfully!", 'success');
            }
        } catch (err) {
            console.error("❌ Persistence Failure:", err);
            showNotification("ERROR: Failed to save changes. Please try again.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e, path) => {
        const file = e.target.files[0];
        if (file) {
            // 🛡️ MISSION: Security Protocol (5MB Capacity)
            if (file.size > 5 * 1024 * 1024) {
                showNotification("Upload failed: File size must be under 5MB.", 'error');
                return;
            }
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
        setEditingStudyId(null);
        setTagInput(""); // Reset tag buffer
        setStudyFormData({
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

    const handleOpenEditStudy = (study) => {
        setEditingStudyId(study.id);
        setTagInput(study.tags?.join(', ') || ""); // Load tag buffer
        const safeStudy = {
            ...study,
            scopeOfWork: study.scopeOfWork || { intro: "", points: [""] },
            siteActions: study.siteActions || [{ title: "", description: "" }],
            resultsAndBenefits: study.resultsAndBenefits || { intro: "", points: [{ title: "", description: "" }] }
        };
        setStudyFormData(safeStudy);
        setIsModalOpen(true);
    };

    const handleSaveStudy = async () => {
        if (!studyFormData.title) {
            showNotification("Please fill in all fields before updating.", 'error');
            return;
        }

        try {
            setIsSaving(true);
            
            // 🛡️ MISSION: Process the Tag Buffer
            const processedTags = tagInput
                .split(',')
                .map(t => t.trim())
                .filter(t => t !== "");

            // Prepare payload for JSON persistence
            const submissionData = {
                ...studyFormData,
                tags: processedTags, // Final clean array
                scope_of_work: studyFormData.scopeOfWork,
                site_actions_intro: studyFormData.siteActionsIntro,
                site_actions: studyFormData.siteActions,
                results_and_benefits: studyFormData.resultsAndBenefits,
                id: editingStudyId
            };

            const res = await ContentService.upsertCaseStudy(submissionData);

            if (res.success) {
                await refreshContent();
                setIsModalOpen(false);
                showNotification("Success story mission established successfully!", 'success');
            }
        } catch (err) {
            console.error("❌ Save Failure:", err);
            showNotification("ERROR: Failed to save success story. Check foundations.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteStudy = async (id) => {
        if (window.confirm("Delete this case study? This action cannot be undone.")) {
            try {
                setIsSaving(true);
                const res = await ContentService.deleteCaseStudy(id);
                if (res.success) {
                    await refreshContent();
                    showNotification("Case study de-commissioned successfully.", 'success');
                }
            } catch (err) {
                console.error("❌ Deletion Failure:", err);
                showNotification("ERROR: Decommission mission failed.", 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleStudyImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 🛡️ MISSION: Asset Capacity Check (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification("Upload failed: File size must be under 5MB.", 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setStudyFormData({ ...studyFormData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'hero', label: 'Hero Section' },
        { id: 'list', label: 'Case Studies' },
    ];

    const filteredStudies = (caseStudyPageData?.caseStudies || []).filter(s =>
        s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full space-y-6 pb-20"
        >
            {/* Header / Navigation & Global Action */}
            <div className="flex justify-between items-center px-1 py-2">
                {/* Premium Tab Navigation */}
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

                {/* Global Action Button */}
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
                            {/* Hero Content */}
                            <div className="lg:col-span-2 space-y-6">
                                <AdminCard title="Hero Section">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <FormInput
                                            label="Tag"
                                            value={caseStudyPageData.hero.tag}
                                            onChange={(e) => setCaseStudyPageData({
                                                ...caseStudyPageData,
                                                hero: { ...caseStudyPageData.hero, tag: e.target.value }
                                            })}
                                        />
                                        <FormInput
                                            label="Main Heading"
                                            value={caseStudyPageData.hero.title}
                                            onChange={(e) => setCaseStudyPageData({
                                                ...caseStudyPageData,
                                                hero: { ...caseStudyPageData.hero, title: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea
                                            label="Hero Tagline"
                                            rows={2}
                                            value={caseStudyPageData.hero.tagline}
                                            onChange={(e) => setCaseStudyPageData({
                                                ...caseStudyPageData,
                                                hero: { ...caseStudyPageData.hero, tagline: e.target.value }
                                            })}
                                        />
                                    </div>
                                </AdminCard>
                            </div>

                            {/* Sidebar Visuals */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Hero Visuals</h3>
                                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">Recommended: 1920 x 1080 PX</span>
                                    </div>
                                    <div className="relative group overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-200 aspect-video flex items-center justify-center shadow-inner">
                                        {caseStudyPageData.hero.backgroundImage && (
                                            <img
                                                src={caseStudyPageData.hero.backgroundImage}
                                                className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                                                alt="Hero"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero.backgroundImage')} />
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
                                title="Case Studies"
                                actions={
                                    <button
                                        onClick={handleOpenAddStudy}
                                        className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                            New Study
                                        </span>
                                    </button>
                                }
                            >
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-4">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50/80 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Project & Meta</th>
                                                <th className="px-6 py-4 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredStudies.map((study) => (
                                                <tr key={study.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 overflow-hidden shadow-sm">
                                                                {study.image && <img src={study.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 truncate max-w-[300px] md:max-w-[500px]">{study.title}</p>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {study.tags?.slice(0, 3).map((tag, tIdx) => (
                                                                        <span key={tIdx} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleOpenEditStudy(study)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors"><Edit3 size={16} /></button>
                                                            <button onClick={() => handleDeleteStudy(study.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </AdminCard>
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                                        {editingStudyId !== null ? "Modify Success Story" : "Design New Case Study"}
                                    </h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all active:scale-95"><X size={20} strokeWidth={3} /></button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar bg-slate-50/20">
                                {/* Section 1: Visual & Core Info */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cover Media</label>
                                            <span className="text-[9px] font-bold text-brand-primary uppercase">Recommended: 800 x 800 PX</span>
                                        </div>
                                        <div className="relative group aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 flex items-center justify-center shadow-sm">
                                            {studyFormData.image ? (
                                                <img src={studyFormData.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 text-slate-300">
                                                    <Upload size={48} strokeWidth={1} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Asset</span>
                                                </div>
                                            )}
                                            <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                                <ImageIcon size={32} className="mb-2" />
                                                <span className="text-[11px] font-black uppercase tracking-widest">Change Media</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleStudyImageUpload} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 space-y-6">
                                        <FormInput
                                            label="Project Title"
                                            value={studyFormData.title}
                                            onChange={(e) => setStudyFormData({ ...studyFormData, title: e.target.value })}
                                            placeholder="Enter project name..."
                                        />
                                        <FormInput
                                            label=" Tags"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            placeholder="Example: Networking, Security..."
                                        />
                                        <FormTextarea
                                            label="Introduction"
                                            rows={4}
                                            value={studyFormData.introduction}
                                            onChange={(e) => setStudyFormData({ ...studyFormData, introduction: e.target.value })}
                                            placeholder="A brief overview of the case study context..."
                                        />
                                    </div>
                                </div>

                                <div className="h-[1px] bg-slate-200/60 w-full" />

                                {/* Section 2: Technical Breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Scope of Work */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <ClipboardList size={18} />
                                            </div>
                                            <h4 className="font-black text-slate-800 text-[13px] uppercase tracking-tight">Scope of Work</h4>
                                        </div>
                                        <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-200">
                                            <FormInput
                                                label="Sub-heading"
                                                value={studyFormData.scopeOfWork?.intro}
                                                onChange={(e) => setStudyFormData({ ...studyFormData, scopeOfWork: { ...studyFormData.scopeOfWork, intro: e.target.value } })}
                                                placeholder="Example: Core Deliverables"
                                            />
                                            <div className="space-y-3 pt-4">
                                                {studyFormData.scopeOfWork?.points.map((point, pIdx) => (
                                                    <div key={pIdx} className="flex gap-2 group">
                                                        <div className="flex-1 relative">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                            <input
                                                                type="text"
                                                                value={point}
                                                                onChange={(e) => {
                                                                    const newPoints = [...studyFormData.scopeOfWork.points];
                                                                    newPoints[pIdx] = e.target.value;
                                                                    setStudyFormData({ ...studyFormData, scopeOfWork: { ...studyFormData.scopeOfWork, points: newPoints } });
                                                                }}
                                                                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-slate-400 transition-all shadow-sm focus:shadow-md"
                                                                placeholder="Enter scope point..."
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newPoints = studyFormData.scopeOfWork.points.filter((_, i) => i !== pIdx);
                                                                setStudyFormData({ ...studyFormData, scopeOfWork: { ...studyFormData.scopeOfWork, points: newPoints } });
                                                            }}
                                                            className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                                                        ><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setStudyFormData({
                                                        ...studyFormData,
                                                        scopeOfWork: { ...studyFormData.scopeOfWork, points: [...studyFormData.scopeOfWork.points, ""] }
                                                    })}
                                                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 hover:border-brand-primary hover:text-brand-primary transition-all uppercase tracking-widest"
                                                >
                                                    + Add Scope Point
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Operations */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                <Settings size={18} />
                                            </div>
                                            <h4 className="font-black text-slate-800 text-[13px] uppercase tracking-tight">Site Actions Taken</h4>
                                        </div>
                                        <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-200">
                                            <FormInput
                                                label="Sub-heading"
                                                value={studyFormData.siteActionsIntro}
                                                onChange={(e) => setStudyFormData({ ...studyFormData, siteActionsIntro: e.target.value })}
                                                placeholder="Phase overview..."
                                            />
                                            <div className="space-y-4 pt-4">
                                                {studyFormData.siteActions?.map((action, aIdx) => (
                                                    <div key={aIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative group">
                                                        <button
                                                            onClick={() => {
                                                                const newActions = studyFormData.siteActions.filter((_, i) => i !== aIdx);
                                                                setStudyFormData({ ...studyFormData, siteActions: newActions });
                                                            }}
                                                            className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                                                        ><Trash2 size={14} /></button>
                                                        <div className="space-y-2 pr-6">
                                                            <input
                                                                type="text"
                                                                value={action.title}
                                                                onChange={(e) => {
                                                                    const newActions = [...studyFormData.siteActions];
                                                                    newActions[aIdx] = { ...action, title: e.target.value };
                                                                    setStudyFormData({ ...studyFormData, siteActions: newActions });
                                                                }}
                                                                className="w-full bg-transparent border-b border-slate-200 py-1 text-xs font-black text-slate-900 outline-none focus:border-brand-primary transition-colors"
                                                                placeholder="Title"
                                                            />
                                                            <textarea
                                                                rows={2}
                                                                value={action.description}
                                                                onChange={(e) => {
                                                                    const newActions = [...studyFormData.siteActions];
                                                                    newActions[aIdx] = { ...action, description: e.target.value };
                                                                    setStudyFormData({ ...studyFormData, siteActions: newActions });
                                                                }}
                                                                className="w-full bg-transparent text-[11px] font-medium text-slate-500 outline-none leading-relaxed"
                                                                placeholder="Description of action taken..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setStudyFormData({
                                                        ...studyFormData,
                                                        siteActions: [...studyFormData.siteActions, { title: "", description: "" }]
                                                    })}
                                                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all uppercase tracking-widest"
                                                >
                                                    + Add Action Step
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Results & Synthesis */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Results */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                                <TrendingUp size={18} />
                                            </div>
                                            <h4 className="font-black text-slate-800 text-[13px] uppercase tracking-tight">Results and Benefits</h4>
                                        </div>
                                        <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-200">
                                            <FormInput
                                                label="Result Summary"
                                                value={studyFormData.resultsAndBenefits?.intro}
                                                onChange={(e) => setStudyFormData({ ...studyFormData, resultsAndBenefits: { ...studyFormData.resultsAndBenefits, intro: e.target.value } })}
                                                placeholder="Key outcomes..."
                                            />
                                            <div className="space-y-4 pt-4">
                                                {studyFormData.resultsAndBenefits?.points.map((point, rIdx) => (
                                                    <div key={rIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative group">
                                                        <button
                                                            onClick={() => {
                                                                const newPoints = studyFormData.resultsAndBenefits.points.filter((_, i) => i !== rIdx);
                                                                setStudyFormData({ ...studyFormData, resultsAndBenefits: { ...studyFormData.resultsAndBenefits, points: newPoints } });
                                                            }}
                                                            className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                                                        ><Trash2 size={14} /></button>
                                                        <div className="space-y-2 pr-6">
                                                            <input
                                                                type="text"
                                                                value={point.title}
                                                                onChange={(e) => {
                                                                    const newPoints = [...studyFormData.resultsAndBenefits.points];
                                                                    newPoints[rIdx] = { ...point, title: e.target.value };
                                                                    setStudyFormData({ ...studyFormData, resultsAndBenefits: { ...studyFormData.resultsAndBenefits, points: newPoints } });
                                                                }}
                                                                className="w-full bg-transparent border-b border-slate-200 py-1 text-xs font-black text-slate-900 outline-none focus:border-orange-500 transition-colors"
                                                                placeholder="Result Title"
                                                            />
                                                            <textarea
                                                                rows={2}
                                                                value={point.description}
                                                                onChange={(e) => {
                                                                    const newPoints = [...studyFormData.resultsAndBenefits.points];
                                                                    newPoints[rIdx] = { ...point, description: e.target.value };
                                                                    setStudyFormData({ ...studyFormData, resultsAndBenefits: { ...studyFormData.resultsAndBenefits, points: newPoints } });
                                                                }}
                                                                className="w-full bg-transparent text-[11px] font-medium text-slate-500 outline-none leading-relaxed"
                                                                placeholder="Result breakdown..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setStudyFormData({
                                                        ...studyFormData,
                                                        resultsAndBenefits: { ...studyFormData.resultsAndBenefits, points: [...studyFormData.resultsAndBenefits.points, { title: "", description: "" }] }
                                                    })}
                                                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all uppercase tracking-widest"
                                                >
                                                    + Add Result Point
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Thoughts */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <h4 className="font-black text-slate-800 text-[13px] uppercase tracking-tight"> Conclusion</h4>
                                        </div>
                                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 h-full flex flex-col">
                                            <FormTextarea
                                                label="Conclusion"
                                                rows={10}
                                                value={studyFormData.conclusion}
                                                onChange={(e) => setStudyFormData({ ...studyFormData, conclusion: e.target.value })}
                                                placeholder="Final thoughts and project verdict..."
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-[2.5rem]">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard</button>
                                <button
                                    onClick={handleSaveStudy}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-12 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-emerald-500/25"
                                >
                                    {editingStudyId !== null ? "Update " : "Confirm"}
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
