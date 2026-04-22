/* 
 * Code Walkthrough: ManagePartners.jsx
 * 
 * Purpose: A world-class management suite for the "Strategic Partners" page.
 * MISSION: To match the exact "Micro-Elite" UI of the Gallery admin (Small text, clean inputs).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    Plus,
    Trash2,
    Image as ImageIcon,
    X,
    Edit3,
    Upload,
    ChevronRight,
    Users,
    ShieldCheck
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useNotification } from '../context/NotificationContext';
import { API_BASE_URL } from '../../services/contentService';
import { AdminCard } from '../components/AdminUI';

const ManagePartners = () => {
    const {
        partners, setPartners,
        partnersPageHero, setPartnersPageHero,
        loading, refreshContent
    } = useContent();
    const { showNotification } = useNotification();

    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);

    // Modal States for Partner Entry
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [editingPartnerIdx, setEditingPartnerIdx] = useState(null);
    const [partnerFormData, setPartnerFormData] = useState({ name: "", description: "", logo: "" });

    // 🛡️ ARCHITECTURAL GUARD: Sync Spinner
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-sm font-black tracking-widest uppercase text-slate-500">Establishing Digital Partner Sync...</p>
            </div>
        );
    }

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        if (path.startsWith('/uploads/')) return `http://localhost:5050${path}`;
        return path;
    };

    const handleFileUpload = async (file, onUploadSuccess) => {
        try {
            setIsSaving(true);
            const axios = (await import('axios')).default;
            const formData = new FormData();
            formData.append('image', file);
            const res = await axios.post(`${API_BASE_URL.replace('/api/public', '')}/api/public/upload`, formData);
            if (res.data.success) onUploadSuccess(res.data.url);
        } catch (err) {
            showNotification("❌ Integration error: File rejected.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const axios = (await import('axios')).default;
            await axios.put(`${API_BASE_URL}/partners/hero`, partnersPageHero);
            await axios.put(`${API_BASE_URL}/partners/bulk`, { partners });
            showNotification("Changes saved successfully!", 'success');
            await refreshContent();
        } catch (err) {
            showNotification("ERROR: Failed to save changes. Please try again.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // --- Partner Roster CRUD ---
    const handleOpenAddPartner = () => {
        setEditingPartnerIdx(null);
        setPartnerFormData({ name: "", description: "", logo: "" });
        setIsPartnerModalOpen(true);
    };

    const handleOpenEditPartner = (p, idx) => {
        setEditingPartnerIdx(idx);
        setPartnerFormData({ ...p });
        setIsPartnerModalOpen(true);
    };

    const handleSavePartner = () => {
        if (!partnerFormData.name || !partnerFormData.logo) {
            showNotification("Identity and Visual are mandatory.", 'error');
            return;
        }
        const newPartnersList = [...partners];
        if (editingPartnerIdx !== null) {
            newPartnersList[editingPartnerIdx] = partnerFormData;
        } else {
            newPartnersList.push({ ...partnerFormData, id: Date.now() });
        }
        setPartners(newPartnersList);
        setIsPartnerModalOpen(false);
    };

    const tabs = [
        { id: 'hero', label: 'Partners Hero' },
        { id: 'roster', label: 'Partners Roster' }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full space-y-6 pb-20 font-sans">

            <div className="flex justify-between items-center px-1 py-2">
                <div className="flex space-x-1 bg-slate-100/50 p-1.5 rounded-[1.5rem] w-fit border border-slate-200/60">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2 rounded-[1.1rem] font-bold text-[13px] transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white text-slate-900 shadow-xl shadow-slate-200/50 scale-[1.02]'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="group bg-white/70 backdrop-blur-xl border border-white/20 hover:shadow-2xl hover:shadow-emerald-200/20 text-emerald-600 font-black py-3 px-8 rounded-2xl transition-all flex items-center gap-3 active:scale-95 shadow-sm overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Save size={18} strokeWidth={3} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-700 text-sm">
                        {isSaving ? 'Pushing...' : 'Save & Push Live'}
                    </span>
                </button>
            </div>

            <div className="min-h-[600px] mt-2">
                <AnimatePresence mode="wait">
                    {activeTab === 'hero' && (
                        <motion.div key="hero" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <AdminCard title="Hero Section">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-bold text-slate-500 ml-1">Tag</label>
                                            <input
                                                type="text"
                                                value={partnersPageHero?.tag || ""}
                                                onChange={(e) => setPartnersPageHero({ ...partnersPageHero, tag: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-bold text-slate-500 ml-1">Main Heading</label>
                                            <input
                                                type="text"
                                                value={partnersPageHero?.title || ""}
                                                onChange={(e) => setPartnersPageHero({ ...partnersPageHero, title: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[14px] font-bold text-slate-500 ml-1">Hero Tagline</label>
                                            <textarea
                                                rows={3}
                                                value={partnersPageHero?.tagline || ""}
                                                onChange={(e) => setPartnersPageHero({ ...partnersPageHero, tagline: e.target.value })}
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
                                        {partnersPageHero?.backgroundImage ? (
                                            <img src={getImageUrl(partnersPageHero.backgroundImage)} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" />
                                        ) : <div className="w-full h-full flex items-center justify-center text-slate-700"><ImageIcon size={32} /></div>}
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setPartnersPageHero({ ...partnersPageHero, backgroundImage: url }))} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'roster' && (
                        <motion.div key="roster" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <AdminCard title="Partners Roster" actions={
                                <button onClick={handleOpenAddPartner} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black hover:shadow-xl active:scale-95 text-brand-primary">
                                    <Plus size={16} /><span>New Partner</span>
                                </button>
                            }>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                                    {partners.map((p, idx) => (
                                        <div key={idx} className="group flex flex-col relative bg-slate-50 border border-slate-200 rounded-[20px] p-4 hover:shadow-xl transition-all">
                                            <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenEditPartner(p, idx)} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:text-brand-primary shadow-sm"><Edit3 size={14} /></button>
                                                <button onClick={() => { if (window.confirm("Delete?")) setPartners(partners.filter((_, i) => i !== idx)) }} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:text-rose-500 shadow-sm"><Trash2 size={14} /></button>
                                            </div>
                                            <div className="aspect-[16/9] rounded-xl bg-white flex items-center justify-center p-6 border border-slate-100 mb-4 group-hover:border-brand-primary/10 transition-all">
                                                <img src={getImageUrl(p.logo)} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            </div>
                                            <div className="px-1">
                                                <h3 className="text-sm font-black text-slate-800 tracking-tight">{p.name}</h3>
                                                <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">{p.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* MODAL: PARTNER PROFILE */}
            <AnimatePresence>
                {isPartnerModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-slate-800">{editingPartnerIdx !== null ? "Edit Partner" : "New Alliance"}</h3>
                                <button onClick={() => setIsPartnerModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24} /></button>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-bold text-slate-500 ml-1">Entity Name</label>
                                    <input type="text" value={partnerFormData.name} onChange={(e) => setPartnerFormData({ ...partnerFormData, name: e.target.value })} className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 transition-all outline-none font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[14px] font-bold text-slate-500 ml-1">Narrative / Description</label>
                                    <textarea rows={3} value={partnerFormData.description} onChange={(e) => setPartnerFormData({ ...partnerFormData, description: e.target.value })} className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 transition-all outline-none font-medium resize-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-black">Partner Brand Logo</label>
                                    <div className="relative group aspect-video bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden p-10">
                                        {partnerFormData.logo ? (
                                            <img src={getImageUrl(partnerFormData.logo)} className="max-h-full max-w-full object-contain" />
                                        ) : <div className="text-slate-300 flex flex-col items-center"><ImageIcon size={32} className="mb-2" /><span className="text-[10px] font-black uppercase">Attach Brand</span></div>}
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Asset</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e.target.files[0], (url) => setPartnerFormData({ ...partnerFormData, logo: url }))} />
                                    </div>
                                </div>
                                <button onClick={handleSavePartner} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-95 transition-all text-[15px] uppercase tracking-widest">Confirm Alliance</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManagePartners;
