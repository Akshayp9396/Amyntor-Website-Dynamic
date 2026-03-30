/* 
 * Code Walkthrough: ManageGallery.jsx
 * 
 * Purpose: A comprehensive management suite for the "Gallery" page.
 * Features:
 * 1. Unified Header and "Save & Sync" action with "Premium Pill" design.
 * 2. Visual Tabbed interface (Hero Section, Image Grid).
 * 3. Hero Section:
 *    - Full Hero control (Tag, Title, Tagline, Background Image).
 * 4. Image Grid Management:
 *    - Add and Remove images from the gallery.
 * 5. Advanced UX: Actions are always visible; real-time previews in modals.
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
    Calendar,
    Tag,
    ChevronRight,
    Eye
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { AdminCard, FormInput, FormTextarea } from '../components/AdminUI';

const ManageGallery = () => {
    const { galleryPageData, setGalleryPageData } = useContent();
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);

    // Modal States for Image Entry
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageFormData, setImageFormData] = useState({
        url: "",
        title: "Gallery Image",
        category: "General",
        date: new Date().toISOString().split('T')[0]
    });

    if (!galleryPageData) return <div className="p-8 font-bold text-slate-400">Loading Gallery Data...</div>;

    // === Global Handlers ===

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Gallery content updated successfully!");
        }, 800);
    };

    const handleHeroImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPageData({
                    ...galleryPageData,
                    hero: { ...galleryPageData.hero, backgroundImage: reader.result }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenAddImage = () => {
        setImageFormData({
            url: "",
            title: "Gallery Image",
            category: "General",
            date: new Date().toISOString().split('T')[0]
        });
        setIsImageModalOpen(true);
    };

    const handleSaveImage = () => {
        if (!imageFormData.url) {
            alert("Image file is required.");
            return;
        }

        const newImages = [...galleryPageData.images];
        newImages.unshift({ ...imageFormData, id: Date.now() });

        setGalleryPageData({
            ...galleryPageData,
            images: newImages
        });
        setIsImageModalOpen(false);
    };

    const handleDeleteImage = (idx) => {
        if (window.confirm("Remove this image from the gallery?")) {
            const newImages = galleryPageData.images.filter((_, i) => i !== idx);
            setGalleryPageData({
                ...galleryPageData,
                images: newImages
            });
        }
    };

    const handleGalleryImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFormData({ ...imageFormData, url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'hero', label: 'Gallery Hero' },
        { id: 'grid', label: 'Visual Archive' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full space-y-6 pb-20"
        >
            {/* Unified Branding Header - Single Row */}
            <div className="flex justify-between items-center py-2 px-1">
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

                {/* Global Commit Action */}
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


            {/* Core Workspace */}
            <div className="min-h-[600px] mt-2">
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
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-bold text-slate-500 ml-1">Tag</label>
                                            <input
                                                type="text"
                                                value={galleryPageData.hero.tag}
                                                onChange={(e) => setGalleryPageData({ ...galleryPageData, hero: { ...galleryPageData.hero, tag: e.target.value } })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-bold text-slate-500 ml-1">Main Heading</label>
                                            <input
                                                type="text"
                                                value={galleryPageData.hero.title}
                                                onChange={(e) => setGalleryPageData({ ...galleryPageData, hero: { ...galleryPageData.hero, title: e.target.value } })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-bold text-slate-500 ml-1">Hero Tagline</label>
                                            <textarea
                                                rows={3}
                                                value={galleryPageData.hero.tagline}
                                                onChange={(e) => setGalleryPageData({ ...galleryPageData, hero: { ...galleryPageData.hero, tagline: e.target.value } })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium leading-relaxed resize-none placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </AdminCard>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <h3 className="text-[15px] font-black text-slate-800 tracking-tight">Hero Visuals</h3>
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">RECOMMENDED: 1920 X 1080 PX</span>
                                    </div>
                                    <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-900 group shadow-inner">
                                        <img
                                            src={galleryPageData.hero.backgroundImage}
                                            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                                            alt="Hero"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleHeroImageUpload} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'grid' && (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-8"
                        >
                            <AdminCard
                                title="Visual Archive Grid"
                                actions={
                                    <button
                                        onClick={handleOpenAddImage}
                                        className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">Add Image</span>
                                    </button>
                                }
                            >
                                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                                    {galleryPageData.images.map((image, idx) => (
                                        <div key={idx} className="group relative bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 break-inside-avoid shadow-sm hover:-translate-y-1">
                                            <img
                                                src={image.url}
                                                className="w-full h-auto object-cover"
                                                alt="Gallery Visual"
                                            />
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={() => handleDeleteImage(idx)}
                                                    className="bg-white/80 backdrop-blur-xl hover:bg-rose-500 p-2.5 rounded-xl text-rose-500 hover:text-white transition-all border border-slate-200 shadow-xl active:scale-90"
                                                >
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ASSET SYNTHESIS MODAL */}
            <AnimatePresence>
                {isImageModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsImageModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">Add Gallery Visual</h4>
                                <button onClick={() => setIsImageModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all active:scale-95"><X size={20} strokeWidth={3} /></button>
                            </div>

                            <div className="p-10 flex flex-col items-center justify-center space-y-8">
                                <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-50 aspect-square max-w-[300px] group">
                                    {imageFormData.url ? (
                                        <img src={imageFormData.url} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                            <div className="mb-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                                <Upload size={48} strokeWidth={1.5} className="text-slate-400" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-8 text-center leading-relaxed">Click or drag to upload the gallery visual</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                        <ImageIcon size={32} className="mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Change Media</p>
                                    </div>
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleGalleryImageUpload} />
                                </div>
                            </div>

                            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 rounded-b-[3rem]">
                                <button onClick={() => setIsImageModalOpen(false)} className="px-6 py-3 text-[11px] font-black text-slate-400 hover:text-slate-800 transition-all uppercase tracking-widest">Cancel</button>
                                <button onClick={handleSaveImage} className="px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200/40 hover:scale-105 active:scale-95 transition-all">
                                    Add
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageGallery;
