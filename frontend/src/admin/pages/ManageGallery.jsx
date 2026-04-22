/* 
 * Code Walkthrough: ManageGallery.jsx
 * 
 * Purpose: A comprehensive management suite for the "Gallery" page.
 * Features:
 * 1. Unified Header and "Save & Sync" action with "Premium Pill" design.
 * 2. Visual Tabbed interface (Hero Section, Folders Archive).
 * 3. Hero Section:
 *    - Full Hero control (Tag, Title, Tagline, Background Image).
 * 4. Image Grid Management (Folders):
 *    - Folders view & Nested specific photos view.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    Image as ImageIcon,
    Plus,
    Trash2,
    X,
    Upload,
    ChevronLeft,
    Edit3
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useNotification } from '../context/NotificationContext';
import { AdminCard, FormInput } from '../components/AdminUI';
import ContentService, { API_BASE_URL } from '../../services/contentService';

const ManageGallery = () => {
    // 🕵️ HELPER: Resolve real computer photo paths from the backend (Port 5050)
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('/uploads/')) {
            return `http://localhost:5050${path}`;
        }
        return path;
    };

    const { 
        galleryPageData, setGalleryPageData, 
        galleryPageHero, setGalleryPageHero,
        refreshContent 
    } = useContent();
    const { showNotification } = useNotification();
    const token = localStorage.getItem('adminToken');

    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);

    // Folder / Event State
    const [activeAlbum, setActiveAlbum] = useState(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [albumFormData, setAlbumFormData] = useState({ id: null, title: "", date: "", previewImage: "" });

    if (!galleryPageData || !galleryPageData.events) return <div className="p-8 font-bold text-slate-400">Loading Gallery Data...</div>;
    const events = galleryPageData.events;
    // Sort chronologically (newest top)
    const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

    // 🕵️ SECURITY GATEKEEPER: Standard Amyntor Size Policy
    const validateFile = (file) => {
        if (!file) return false;
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            showNotification("Upload failed: File size must be under 5MB.", 'error');
            return false;
        }
        return true;
    };

    // 🕵️ CONCEPT: handleFileUpload (The Professional Image Courier)
    const handleFileUpload = async (file, onUploadSuccess) => {
        if (!validateFile(file)) return;
        try {
            setIsSaving(true);
            const axios = (await import('axios')).default;
            const formData = new FormData();
            formData.append('image', file);
            const response = await axios.post(`${API_BASE_URL.replace('/api/public', '')}/api/public/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                onUploadSuccess(response.data.url);
            }
        } catch (err) {
            console.error("❌ Asset Sync Failure:", err);
            showNotification("Failed to upload visual asset.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // === GLOBAL HANDLERS ===
    const handleSave = async () => {
        try {
            setIsSaving(true);
            const res = await ContentService.updateGalleryPageHero(galleryPageHero);
            if (res.success) {
                await refreshContent();
                showNotification("Changes saved successfully!", "success");
            }
        } catch (err) {
            console.error("❌ Visual Sync Failure:", err);
            showNotification("ERROR: Failed to save changes. Please try again.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleHeroImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        handleFileUpload(file, (url) => {
            setGalleryPageHero({ ...galleryPageHero, backgroundImage: url });
        });
    };

    // --- ALBUM DASHBOARD CRUD ---
    const handleOpenAddAlbum = () => {
        setAlbumFormData({ id: null, title: "", date: "", previewImage: "" });
        setIsAlbumModalOpen(true);
    };

    const handleOpenEditAlbum = (album) => {
        setAlbumFormData({ id: album.id, title: album.title, date: album.date, previewImage: album.previewImage });
        setIsAlbumModalOpen(true);
    };

    const handleSaveAlbum = async () => {
        if (!albumFormData.title || !albumFormData.date) {
            showNotification("Title and Date are required.", 'error');
            return;
        }
        try {
            setIsSaving(true);
            const res = await ContentService.upsertAlbum(albumFormData, token);
            if (res.success) {
                await refreshContent();
                setIsAlbumModalOpen(false);
                showNotification("Changes saved successfully!", 'success');
            }
        } catch (err) {
            console.error("❌ Persistence Failure:", err);
            showNotification("ERROR: Failed to save changes. Please try again.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAlbum = async (id) => {
        if (window.confirm("Delete this entire folder and all its images?")) {
            try {
                setIsSaving(true);
                const res = await ContentService.deleteAlbum(id, token);
                if (res.success) {
                    await refreshContent();
                    if (activeAlbum && activeAlbum.id === id) setActiveAlbum(null);
                    showNotification("Changes saved successfully!", 'success');
                }
            } catch (err) {
                console.error("❌ Folder Deletion Failure:", err);
                showNotification("ERROR: Failed to save changes. Please try again.", 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleAlbumCoverUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        handleFileUpload(file, (url) => {
            setAlbumFormData({ ...albumFormData, previewImage: url });
        });
    };

    // --- IMAGE CRUD ---
    const handleUploadImageToAlbum = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        showNotification(`Processing ${files.length} image(s)...`, 'success');
        let successCount = 0;
        let failCount = 0;

        for (const file of files) {
            if (!validateFile(file)) {
               failCount++;
               continue;
            }
            
            // Need a tiny internal uploader for the loop
            try {
                const axios = (await import('axios')).default;
                const formData = new FormData();
                formData.append('image', file);
                const uploadRes = await axios.post(`${API_BASE_URL.replace('/api/public', '')}/api/public/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (uploadRes.data.success) {
                    const payload = { album_id: activeAlbum.id, title: "", image_url: uploadRes.data.url };
                    const res = await ContentService.addImageToAlbum(payload, token);
                    if (res.success) {
                        successCount++;
                    } else {
                        failCount++;
                    }
                } else {
                    failCount++;
                }
            } catch (err) {
                failCount++;
            }
        }
        
        if (successCount > 0) {
            await refreshContent();
            const updatedData = await ContentService.getGalleryFull();
            if(updatedData && updatedData.events){
               const newActive = updatedData.events.find(a => a.id === activeAlbum.id);
               if(newActive) setActiveAlbum(newActive);
            }
            showNotification(`Successfully uploaded ${successCount} photo(s).`, 'success');
        }
        if (failCount > 0) {
            showNotification(`Skipped ${failCount} asset(s) (Over 5MB or error).`, 'error');
        }
        e.target.value = null; // Reset Input
    };

    const handleDeleteImage = async (id) => {
        if (window.confirm("Remove this image?")) {
            try {
                const res = await ContentService.deleteImage(id, token);
                if (res.success) {
                    await refreshContent();
                    showNotification("Changes saved successfully!", 'success');
                    
                    // Update active album local view
                    const updatedData = await ContentService.getGalleryFull();
                    if(updatedData && updatedData.events){
                       const newActive = updatedData.events.find(a => a.id === activeAlbum.id);
                       if(newActive) setActiveAlbum(newActive);
                    }
                }
            } catch (err) {
                showNotification("ERROR: Failed to save changes. Please try again.", 'error');
            }
        }
    };

    const tabs = [
        { id: 'hero', label: 'Gallery Hero' },
        { id: 'grid', label: 'Event Folders' },
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
                                                value={galleryPageHero.tag}
                                                onChange={(e) => setGalleryPageHero({ ...galleryPageHero, tag: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-bold text-slate-500 ml-1">Main Heading</label>
                                            <input
                                                type="text"
                                                value={galleryPageHero.title}
                                                onChange={(e) => setGalleryPageHero({ ...galleryPageHero, title: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-bold text-slate-500 ml-1">Hero Tagline</label>
                                            <textarea
                                                rows={3}
                                                value={galleryPageHero.tagline}
                                                onChange={(e) => setGalleryPageHero({ ...galleryPageHero, tagline: e.target.value })}
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
                                            src={getImageUrl(galleryPageHero.backgroundImage)}
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
                            {!activeAlbum ? (
                                <AdminCard title="Gallery Section" actions={
                                    <button onClick={handleOpenAddAlbum} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black hover:shadow-xl active:scale-95 text-brand-primary">
                                        <Plus size={16} /><span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">New Folder</span>
                                    </button>
                                }>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                                        {sortedEvents.map((album) => (
                                            <div key={album.id} className="group flex flex-col relative bg-slate-50 border border-slate-200 rounded-[20px] p-3 hover:shadow-xl transition-all overflow-hidden">
                                                <div className="absolute top-5 right-5 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => { e.stopPropagation(); handleOpenEditAlbum(album); }} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:text-brand-primary shadow-sm"><Edit3 size={14} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album.id); }} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:text-rose-500 shadow-sm"><Trash2 size={14} /></button>
                                                </div>
                                                <div
                                                    onClick={() => setActiveAlbum(album)}
                                                    className="cursor-pointer"
                                                >
                                                    <div className="aspect-[16/9] rounded-[16px] bg-white overflow-hidden mb-4 border border-slate-200 relative">
                                                        {album.previewImage ? (
                                                            <img src={album.previewImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100"><ImageIcon size={32} /></div>
                                                        )}
                                                    </div>
                                                    <div className="px-2 mb-3">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {album.date && !isNaN(new Date(album.date)) ? new Date(album.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : album.date}
                                                        </p>
                                                        <h3 className="text-sm font-black text-slate-800 line-clamp-1">{album.title}</h3>
                                                        <p className="text-xs text-slate-500 font-medium mt-1">{album.images?.length || 0} Photos Linked</p>
                                                    </div>
                                                </div>
                                                <div className="mt-auto pt-2 px-1">
                                                    <button onClick={(e) => { e.stopPropagation(); setActiveAlbum(album); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-primary/5 hover:bg-brand-primary/15 text-brand-primary rounded-xl transition-colors text-[13px] font-bold active:scale-95">
                                                        <Upload size={14} /> Add / Manage Photos
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AdminCard>
                            ) : (
                                <AdminCard
                                    title={
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setActiveAlbum(null)} className="p-2 -ml-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-brand-primary transition-all">
                                                <ChevronLeft size={20} strokeWidth={3} />
                                            </button>
                                            <span>{activeAlbum.title}</span>
                                        </div>
                                    }
                                    actions={
                                        <div className="flex items-center gap-3">
                                            <label className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black hover:shadow-xl active:scale-95 text-brand-primary">
                                                <Upload size={16} /><span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">Upload Photo</span>
                                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleUploadImageToAlbum} />
                                            </label>
                                        </div>
                                    }
                                >
                                    <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 mt-4">
                                        {activeAlbum.images.map((img) => (
                                            <div key={img.id} className="break-inside-avoid relative group rounded-[1.5rem] overflow-hidden border border-slate-200">
                                                {img.url ? (
                                                    <img src={img.url} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                                ) : (
                                                    <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Empty Dummy Upload</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => handleDeleteImage(img.id)} className="p-3 bg-white text-rose-500 rounded-xl font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AdminCard>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ALBUM MODAL */}
            <AnimatePresence>
                {isAlbumModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-slate-800">{albumFormData.id ? "Edit Folder" : "Design New Folder"}</h3>
                                <button onClick={() => setIsAlbumModalOpen(false)} className="text-slate-400 hover:text-rose-500"><X size={24} /></button>
                            </div>
                            <div className="space-y-6">
                                <FormInput label="Event/Folder Title" value={albumFormData.title} onChange={(e) => setAlbumFormData({ ...albumFormData, title: e.target.value })} placeholder="e.g. Annual Summit 2026" />
                                <FormInput label="Date Display" type="date" value={albumFormData.date} onChange={(e) => setAlbumFormData({ ...albumFormData, date: e.target.value })} />

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Folder Preview Cover</label>
                                    <div className="relative group aspect-video bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">
                                        {albumFormData.previewImage ? (
                                            <img src={albumFormData.previewImage} className="w-full h-full object-cover group-hover:scale-105" alt="" />
                                        ) : (
                                            <div className="text-slate-300 flex flex-col items-center"><ImageIcon size={32} className="mb-2" /><span className="text-[10px] font-black uppercase">Attach Cover</span></div>
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Cover</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" onChange={(e) => handleImageUpload(e, (res) => setAlbumFormData({ ...albumFormData, previewImage: res }))} />
                                    </div>
                                </div>
                                <button onClick={handleSaveAlbum} disabled={isSaving} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 transition-all text-[15px] uppercase tracking-widest">{isSaving ? "Saving..." : "Confirm"}</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageGallery;
