/**
 * Code Walkthrough: ManageBlogs.jsx
 * 
 * Purpose: A comprehensive management suite for the "Blogs" section.
 * Features:
 * 1. Unified Header and "Save & Push Live" action with "Premium Pill" tab design.
 * 2. Visual Tabbed interface (Hero & Page Content, Blog Articles List).
 * 3. High-density CRUD for Blogs:
 *    - Main details (Title, Date, Category Tag, Cover Image).
 *    - Deep content management (Overview, Flexible Sections, Conclusion).
 * 4. Advanced UX: Glassmorphism layout, modular section inputs, and real-time previews.
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
    LayoutGrid,
    BookOpen,
    Settings,
    Type,
    ClipboardList,
    CheckCircle2,
    Calendar,
    Tag,
    Layers,
    AlignLeft
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { AdminCard, FormInput, FormTextarea } from '../components/AdminUI';
import ContentService from '../../services/contentService';
import { useNotification } from '../context/NotificationContext';

const ManageBlogs = () => {
    const { blogPageData, setBlogPageData, refreshContent } = useContent();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);

    // Modal States for Blog CRUD
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [blogFormData, setBlogFormData] = useState({
        id: null,
        title: "",
        slug: "",
        date: "",
        image: "",
        overview: "",
        sections: [],
        conclusion: ""
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return "No Date Set";
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    if (!blogPageData) return <div className="p-8 text-slate-400 font-bold tracking-widest uppercase text-[10px]">Registry Hydrating...</div>;

    // === Global Handlers ===

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const res = await ContentService.updateBlogHero({
                tag: blogPageData.hero.tag,
                title: blogPageData.hero.title,
                tagline: blogPageData.hero.tagline,
                backgroundImage: blogPageData.hero.backgroundImage
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
            if (file.size > 5 * 1024 * 1024) {
                showNotification("Upload failed: File size must be under 5MB.", 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const newData = { ...blogPageData };
                const pathParts = path.split('.');
                let current = newData;
                for (let i = 0; i < pathParts.length - 1; i++) {
                    current = current[pathParts[i]];
                }
                current[pathParts[pathParts.length - 1]] = reader.result;
                setBlogPageData(newData);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Blog CRUD Handlers ---

    const handleOpenAddBlog = () => {
        setEditingBlogId(null);
        setBlogFormData({
            id: Date.now(),
            title: "",
            slug: "",
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD for date input
            image: "",
            overview: "",
            sections: [{ heading: "", paragraph: "", points: [""] }],
            conclusion: ""
        });
        setIsModalOpen(true);
    };

    const handleOpenEditBlog = (blog) => {
        setEditingBlogId(blog.id);

        // Ensure date is in YYYY-MM-DD format for native date input
        let dateValue = blog.date;
        if (dateValue && !dateValue.includes('-')) {
            try {
                const parsedDate = new Date(dateValue);
                if (!isNaN(parsedDate.getTime())) {
                    dateValue = parsedDate.toISOString().split('T')[0];
                }
            } catch (e) {
                dateValue = new Date().toISOString().split('T')[0];
            }
        }

        const safeBlog = {
            ...blog,
            date: dateValue,
            sections: blog.sections || [{ heading: "", paragraph: "", points: [""] }]
        };
        setBlogFormData(safeBlog);
        setIsModalOpen(true);
    };

    const handleSaveBlog = async () => {
        if (!blogFormData.title) {
            showNotification("Please fill in all fields before updating.", 'error');
            return;
        }

        try {
            setIsSaving(true);
            const slug = blogFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const submissionData = {
                ...blogFormData,
                slug,
                id: editingBlogId
            };

            const res = await ContentService.upsertBlog(submissionData);

            if (res.success) {
                await refreshContent();
                setIsModalOpen(false);
                showNotification("Blog narrative established successfully!", 'success');
            }
        } catch (err) {
            console.error("❌ Save Failure:", err);
            showNotification("ERROR: Failed to save blog. Check foundations.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBlog = async (id) => {
        if (window.confirm("Delete this blog post? This action cannot be undone.")) {
            try {
                setIsSaving(true);
                const res = await ContentService.deleteBlog(id);
                if (res.success) {
                    await refreshContent();
                    showNotification("Blog post de-commissioned successfully.", 'success');
                }
            } catch (err) {
                console.error("❌ Deletion Failure:", err);
                showNotification("ERROR: Decommission mission failed.", 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleBlogImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showNotification("Upload failed: File size must be under 5MB.", 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setBlogFormData({ ...blogFormData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'hero', label: 'Hero & Page Info' },
        { id: 'list', label: 'Blog Articles' },
    ];

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
                                            value={blogPageData.hero.tag}
                                            onChange={(e) => setBlogPageData({
                                                ...blogPageData,
                                                hero: { ...blogPageData.hero, tag: e.target.value }
                                            })}
                                        />
                                        <FormInput
                                            label="Main Heading"
                                            value={blogPageData.hero.title}
                                            onChange={(e) => setBlogPageData({
                                                ...blogPageData,
                                                hero: { ...blogPageData.hero, title: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea
                                            label="Hero Tagline"
                                            rows={2}
                                            value={blogPageData.hero.tagline}
                                            onChange={(e) => setBlogPageData({
                                                ...blogPageData,
                                                hero: { ...blogPageData.hero, tagline: e.target.value }
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
                                        {blogPageData.hero.backgroundImage && (
                                            <img
                                                src={blogPageData.hero.backgroundImage}
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
                                title="Articles List "
                                actions={
                                    <button
                                        onClick={handleOpenAddBlog}
                                        className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                            New Article
                                        </span>
                                    </button>
                                }
                            >
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-4">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50/80 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Article & Date</th>
                                                <th className="px-6 py-4 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {[...blogPageData.blogList.items]
                                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                                .map((blog, idx) => (
                                                <tr key={blog.id || idx} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 overflow-hidden shadow-sm p-1">
                                                                {blog.image && <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg" alt="" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800">{blog.title}</p>
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                                    <Calendar size={10} /> {formatDate(blog.date)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleOpenEditBlog(blog)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors"><Edit3 size={16} /></button>
                                                            <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
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

            {/* FULL BLOG EDITOR MODAL */}
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
                                        {editingBlogId !== null ? "Edit Blog Post" : "Create New Blog Post"}
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
                                            <span className="text-[9px] font-bold text-brand-primary uppercase">Recommended: 800 x 600 PX</span>
                                        </div>
                                        <div className="relative group aspect-video bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 flex items-center justify-center shadow-sm">
                                            {blogFormData.image ? (
                                                <img src={blogFormData.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-3 text-slate-300">
                                                    <Upload size={48} strokeWidth={1} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Media</span>
                                                </div>
                                            )}
                                            <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                                <ImageIcon size={32} className="mb-2" />
                                                <span className="text-[11px] font-black uppercase tracking-widest">Change Media</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleBlogImageUpload} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput
                                                label="Article Title"
                                                value={blogFormData.title}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                                                placeholder="Enter title..."
                                            />
                                            <FormInput
                                                label="Publish Date"
                                                type="date"
                                                value={blogFormData.date}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, date: e.target.value })}
                                            />
                                        </div>
                                        <FormTextarea
                                            label="Brief Description (Overview)"
                                            rows={3}
                                            value={blogFormData.overview}
                                            onChange={(e) => setBlogFormData({ ...blogFormData, overview: e.target.value })}
                                            placeholder="Introduce the core topic..."
                                        />
                                    </div>
                                </div>

                                <div className="h-[1px] bg-slate-200/60 w-full" />

                                {/* Section 2: Detailed Breakdown */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                                                <AlignLeft size={18} />
                                            </div>
                                            <h4 className="font-black text-slate-800 text-[13px] uppercase tracking-tight">Article Sections</h4>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8">
                                        {blogFormData.sections?.map((section, sIdx) => (
                                            <div key={sIdx} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 relative group shadow-sm">

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <FormInput
                                                            label="Main Heading"
                                                            value={section.heading}
                                                            onChange={(e) => {
                                                                const newSections = [...blogFormData.sections];
                                                                newSections[sIdx].heading = e.target.value;
                                                                setBlogFormData({ ...blogFormData, sections: newSections });
                                                            }}
                                                            placeholder="Example: The Threat Landscape"
                                                        />
                                                        <FormTextarea
                                                            label="Sub Content"
                                                            rows={6}
                                                            value={section.paragraph}
                                                            onChange={(e) => {
                                                                const newSections = [...blogFormData.sections];
                                                                newSections[sIdx].paragraph = e.target.value;
                                                                setBlogFormData({ ...blogFormData, sections: newSections });
                                                            }}
                                                            placeholder="Enter detailed paragraph here..."
                                                        />
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bullet Points</label>
                                                            <button
                                                                onClick={() => {
                                                                    const newSections = [...blogFormData.sections];
                                                                    newSections[sIdx].points = [...(newSections[sIdx].points || []), ""];
                                                                    setBlogFormData({ ...blogFormData, sections: newSections });
                                                                }}
                                                                className="text-[10px] font-black text-brand-primary hover:text-brand-dark transition-colors uppercase tracking-widest flex items-center gap-1.5"
                                                            >
                                                                <Plus size={14} strokeWidth={3} />
                                                                Add Point
                                                            </button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {section.points?.map((point, pIdx) => (
                                                                <div key={pIdx} className="flex gap-2">
                                                                    <div className="flex-1 relative">
                                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-primary" />
                                                                        <input
                                                                            type="text"
                                                                            value={point}
                                                                            onChange={(e) => {
                                                                                const newSections = [...blogFormData.sections];
                                                                                newSections[sIdx].points[pIdx] = e.target.value;
                                                                                setBlogFormData({ ...blogFormData, sections: newSections });
                                                                            }}
                                                                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-[13px] font-bold outline-none focus:bg-white focus:border-slate-400 transition-all shadow-sm focus:shadow-md"
                                                                            placeholder="Key deliverable or insight..."
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            const newSections = [...blogFormData.sections];
                                                                            newSections[sIdx].points = newSections[sIdx].points.filter((_, i) => i !== pIdx);
                                                                            setBlogFormData({ ...blogFormData, sections: newSections });
                                                                        }}
                                                                        className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                                                                    ><Trash2 size={14} /></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => setBlogFormData({
                                                ...blogFormData,
                                                sections: [...blogFormData.sections, { heading: "", paragraph: "", points: [] }]
                                            })}
                                            className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-[11px] font-black text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all uppercase tracking-[0.2em] bg-white/50"
                                        >
                                            + Expand Article Structure
                                        </button>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-slate-200/60 w-full" />

                                {/* Section 3: Synthesis */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 px-1">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                                            <Layers size={18} />
                                        </div>
                                        <h4 className="font-black text-slate-800 text-[13px] uppercase tracking-tight">Final Synthesis (Conclusion)</h4>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                        <FormTextarea
                                            label="Conclusion Content"
                                            rows={6}
                                            value={blogFormData.conclusion}
                                            onChange={(e) => setBlogFormData({ ...blogFormData, conclusion: e.target.value })}
                                            placeholder="Parting thoughts and final summary..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-[2.5rem]">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard</button>
                                <button
                                    onClick={handleSaveBlog}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-12 py-3.5 rounded-2xl text-[13px] font-black transition-all shadow-xl shadow-emerald-500/25 uppercase tracking-widest"
                                >
                                    {editingBlogId !== null ? "Update" : "Confirm"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageBlogs;
