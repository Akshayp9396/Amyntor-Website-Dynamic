/* 
 * Code Walkthrough: ManageAbout.jsx
 * 
 * Purpose: A comprehensive management suite for the "About Us" page.
 * Features:
 * 1. Unified Header and "Save & Sync" action with Folder-Tab design.
 * 2. Visual Tabbed interface (Hero & Company, Team Management).
 * 3. Hero & Company:
 *    - Full Hero control (Tag, Title, Tagline, Background Image).
 *    - Company overview text and dynamic "Company Cards" (Mission, Vision, etc.).
 * 4. Team Management:
 *    - High-density CRUD for team members with image uploads and role assignment.
 *    - Reorderable list (implied via order in array).
 * 5. Advanced UX: Actions are always visible; real-time card previews in modals.
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
    Users,
    Goal,
    Lightbulb,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useNotification } from '../context/NotificationContext';
import { API_BASE_URL } from '../../services/contentService';
import { AdminCard, FormInput, FormTextarea } from '../components/AdminUI';

const iconMap = {
    Target: Goal,
    Eye: Lightbulb,
    Diamond: ShieldCheck
};

const ManageAbout = () => {
    const {
        aboutPageData, setAboutPageData,
        loading, refreshContent
    } = useContent();
    const { showNotification } = useNotification();


    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);

    // 🕵️ SECURITY GATEKEEPER: Unified Rule for all local image picks
    const validateFile = (file) => {
        if (!file) return false;
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            showNotification("Upload failed: File size must be under 5MB.", 'error');
            return false;
        }
        return true;
    };

    // Modal States for Company Cards
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [editingCardIdx, setEditingCardIdx] = useState(null);
    const [cardFormData, setCardFormData] = useState({ title: "", description: "", icon: "Target" });

    // Modal States for Team Management
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [editingMemberIdx, setEditingMemberIdx] = useState(null);
    const [memberFormData, setMemberFormData] = useState({ name: "", role: "", image: "" });

    // 🛡️ ARCHITECTURAL GUARD: Ensure live data is established before empowering the editor
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-sm font-black tracking-widest uppercase">Establishing Total Digital Sync...</p>
            </div>
        );
    }

    // 🕵️ HELPER: Resolve real computer photo paths from the backend (Port 5050)
    const getImageUrl = (path) => {
        if (!path) return '';
        // If it's already a full URL or a data blob, leave it alone
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        // If it's a local upload path, point it to the backend server
        if (path.startsWith('/uploads/')) {
            return `http://localhost:5050${path}`;
        }
        return path;
    };

    // === Global Handlers ===

    // 🕵️ CONCEPT: handleFileUpload (The Delivery Agent)
    // This sends raw computer photos to the backend's "/uploads" folder.
    const handleFileUpload = async (file, onUploadSuccess) => {
        if (!validateFile(file)) return;
        try {
            setIsSaving(true);
            const axios = (await import('axios')).default;
            const formData = new FormData();
            formData.append('image', file);

            // 🚥 Knocks on the specialized upload door
            const response = await axios.post(`${API_BASE_URL.replace('/api/public', '')}/api/public/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                onUploadSuccess(response.data.url);
                // 🕵️ UI REFINEMENT: Removed alert for a smoother background sync experience.
            }
        } catch (err) {
            console.error("❌ Upload error:", err);
            showNotification("❌ Failed to upload image.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // 🕵️ CONCEPT: handleSave (The Master Sync)
    // This sends all your changes back to the MySQL "Storage Rooms."
    const handleSave = async () => {
        try {
            setIsSaving(true);
            const axios = (await import('axios')).default;

            // 🛡️ 1. Save Hero & Company General Info
            // We use .put() because we are "Updating" existing records.
            await axios.put(`${API_BASE_URL}/about/content`, {
                hero: aboutPageData.hero,
                aboutCompany: aboutPageData.aboutCompany
            });

            // 🛡️ 2. Save Team Header & Members (Bulk)
            await axios.put(`${API_BASE_URL}/about/team`, {
                tag: aboutPageData.teamSection.tag,
                heading: aboutPageData.teamSection.heading,
                members: aboutPageData.teamSection.members
            });

            // 🛡️ 3. Save About Cards (Mission/Vision)
            await axios.put(`${API_BASE_URL}/about/cards`, {
                cards: aboutPageData.aboutCompany.cards
            });

            showNotification("Changes saved successfully!", 'success');
            await refreshContent();
        } catch (err) {
            console.error("Error saving to database", err);
            showNotification("ERROR: Failed to save changes. Please try again.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e, section, key) => {
        const file = e.target.files[0];
        if (!validateFile(file)) {
            e.target.value = '';
            return;
        }
        // 🚥 We call the specialized file uploader
        handleFileUpload(file, (url) => {
            setAboutPageData({
                ...aboutPageData,
                [section]: { ...aboutPageData[section], [key]: url }
            });
        });
    };

    const handleOpenAddCard = () => {
        setEditingCardIdx(null);
        setCardFormData({ title: "", description: "", icon: "Target" });
        setIsCardModalOpen(true);
    };

    const handleOpenEditCard = (card, idx) => {
        setEditingCardIdx(idx);
        setCardFormData({ ...card });
        setIsCardModalOpen(true);
    };

    const handleSaveCard = () => {
        if (!cardFormData.title) {
            showNotification("Card title is required.", 'error');
            return;
        }

        const newCards = [...aboutPageData.aboutCompany.cards];
        if (editingCardIdx !== null) {
            newCards[editingCardIdx] = cardFormData;
        } else {
            newCards.push({ ...cardFormData, id: Date.now() });
        }

        setAboutPageData({
            ...aboutPageData,
            aboutCompany: { ...aboutPageData.aboutCompany, cards: newCards }
        });
        setIsCardModalOpen(false);
    };

    const handleDeleteCard = (idx) => {
        if (window.confirm("Remove this card?")) {
            const newCards = aboutPageData.aboutCompany.cards.filter((_, i) => i !== idx);
            setAboutPageData({
                ...aboutPageData,
                aboutCompany: { ...aboutPageData.aboutCompany, cards: newCards }
            });
        }
    };

    const handleCardIconUpload = (e) => {
        const file = e.target.files[0];
        if (!validateFile(file)) {
            e.target.value = '';
            return;
        }
        handleFileUpload(file, (url) => {
            setCardFormData({ ...cardFormData, icon: url });
        });
    };

    // --- Team CRUD ---
    const handleOpenAddMember = () => {
        setEditingMemberIdx(null);
        setMemberFormData({ name: "", role: "", image: "" });
        setIsTeamModalOpen(true);
    };

    const handleOpenEditMember = (member, idx) => {
        setEditingMemberIdx(idx);
        setMemberFormData({ ...member });
        setIsTeamModalOpen(true);
    };

    const handleSaveMember = () => {
        if (!memberFormData.name || !memberFormData.role) {
            showNotification("Please fill in all fields before updating.", 'error');
            return;
        }

        const newMembers = [...aboutPageData.teamSection.members];
        if (editingMemberIdx !== null) {
            newMembers[editingMemberIdx] = memberFormData;
        } else {
            newMembers.push({ ...memberFormData, id: Date.now() });
        }

        setAboutPageData({
            ...aboutPageData,
            teamSection: { ...aboutPageData.teamSection, members: newMembers }
        });
        setIsTeamModalOpen(false);
    };

    const handleDeleteMember = (idx) => {
        if (window.confirm("Remove this team member?")) {
            const newMembers = aboutPageData.teamSection.members.filter((_, i) => i !== idx);
            setAboutPageData({
                ...aboutPageData,
                teamSection: { ...aboutPageData.teamSection, members: newMembers }
            });
        }
    };

    const handleMemberImageUpload = (e) => {
        const file = e.target.files[0];
        if (!validateFile(file)) {
            e.target.value = '';
            return;
        }
        handleFileUpload(file, (url) => {
            setMemberFormData({ ...memberFormData, image: url });
        });
    };

    const tabs = [
        { id: 'hero', label: 'Hero & Company' },
        { id: 'principles', label: 'Core Principles' },
        { id: 'team', label: 'Team Management' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full space-y-6 pb-20"
        >
            {/* Header & Global Action - Single Row */}
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
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Hero Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    <AdminCard title="Hero Section">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                            <FormInput label="Tag" value={aboutPageData.hero.tag} onChange={(e) => setAboutPageData({ ...aboutPageData, hero: { ...aboutPageData.hero, tag: e.target.value } })} />
                                            <FormInput label="Main Heading" value={aboutPageData.hero.title} onChange={(e) => setAboutPageData({ ...aboutPageData, hero: { ...aboutPageData.hero, title: e.target.value } })} />
                                        </div>
                                        <div className="mt-6">
                                            <FormTextarea label="Hero Tagline" rows={3} value={aboutPageData.hero.tagline} onChange={(e) => setAboutPageData({ ...aboutPageData, hero: { ...aboutPageData.hero, tagline: e.target.value } })} />
                                        </div>
                                    </AdminCard>

                                    <AdminCard title="Company Overview">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                            <FormInput label="Tag" value={aboutPageData.aboutCompany.tag} onChange={(e) => setAboutPageData({ ...aboutPageData, aboutCompany: { ...aboutPageData.aboutCompany, tag: e.target.value } })} />
                                            <FormInput label="Main Heading" value={aboutPageData.aboutCompany.heading} onChange={(e) => setAboutPageData({ ...aboutPageData, aboutCompany: { ...aboutPageData.aboutCompany, heading: e.target.value } })} />
                                        </div>
                                        <div className="mt-6">
                                            <FormTextarea label=" Description" rows={8} value={aboutPageData.aboutCompany.description1} onChange={(e) => setAboutPageData({ ...aboutPageData, aboutCompany: { ...aboutPageData.aboutCompany, description1: e.target.value } })} />
                                        </div>
                                    </AdminCard>
                                </div>

                                {/* Hero Preview */}
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Hero Visuals</h3>
                                            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">Recommended: 1920 x 1080 PX</span>
                                        </div>
                                        <div className="relative group overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-200 aspect-video flex items-center justify-center shadow-inner">
                                            <img
                                                src={getImageUrl(aboutPageData.hero.backgroundImage)}
                                                className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                                                alt="Hero preview"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                                <ImageIcon size={28} className="mb-2" />
                                                <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                            </div>
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero', 'backgroundImage')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'principles' && (
                        <motion.div
                            key="principles"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-8"
                        >
                            <AdminCard title="Our Core Principles">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {aboutPageData.aboutCompany.cards.map((card, idx) => (
                                        <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-[1.5rem] p-6 flex flex-col gap-4 group hover:shadow-xl hover:bg-white transition-all duration-300 relative overflow-hidden">
                                            <div className="flex justify-between items-start">
                                                <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary border border-brand-primary/10 p-3 shadow-sm group-hover:scale-105 transition-transform">
                                                    {card.icon?.startsWith('data:image') || card.icon?.includes('/uploads/') || card.icon?.startsWith('http')
                                                        ? <img src={getImageUrl(card.icon)} alt="" className="w-full h-full object-contain" />
                                                        : (() => {
                                                            const IconComp = iconMap[card.icon] || Goal;
                                                            return <IconComp size={24} strokeWidth={2} />;
                                                        })()
                                                    }
                                                </div>
                                                <button onClick={() => handleOpenEditCard(card, idx)} className="bg-white/80 backdrop-blur-md p-2 rounded-xl text-slate-400 hover:text-brand-primary hover:border-brand-primary/20 transition-all border border-slate-200/60 shadow-sm opacity-0 group-hover:opacity-100"><Edit3 size={16} /></button>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-black text-slate-800 text-[15px] tracking-tight">{card.title}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed font-medium whitespace-pre-line">{card.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}

                    {activeTab === 'team' && (
                        <motion.div
                            key="team"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <AdminCard
                                title="Expert Team"
                                actions={
                                    <button
                                        onClick={handleOpenAddMember}
                                        className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                            Onboard Member
                                        </span>
                                    </button>
                                }
                            >
                                <div className="mb-8 p-6 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label="Section Tag"
                                        value={aboutPageData.teamSection.tag}
                                        onChange={(e) => setAboutPageData({
                                            ...aboutPageData,
                                            teamSection: { ...aboutPageData.teamSection, tag: e.target.value }
                                        })}
                                        placeholder="e.g. OUR TEAM"
                                    />
                                    <FormInput
                                        label="Main Heading"
                                        value={aboutPageData.teamSection.heading}
                                        onChange={(e) => setAboutPageData({
                                            ...aboutPageData,
                                            teamSection: { ...aboutPageData.teamSection, heading: e.target.value }
                                        })}
                                        placeholder="e.g. Meet the Visionaries"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 font-medium mb-6 px-1">Manage the leadership and team member profiles below.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {aboutPageData.teamSection.members.map((member, idx) => (
                                        <div key={idx} className="group relative bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300">
                                            <div className="aspect-[4/5] overflow-hidden relative">
                                                <img
                                                    src={getImageUrl(member.image)}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    alt={member.name}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => handleOpenEditMember(member, idx)} className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-brand-primary transition-all border border-white/20"><Edit3 size={16} /></button>
                                                        <button onClick={() => handleDeleteMember(idx)} className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white hover:bg-rose-600 transition-all border border-white/20"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 text-center">
                                                <h4 className="font-bold text-slate-800 text-sm truncate">{member.name}</h4>
                                                <p className="text-[11px] font-bold text-brand-primary uppercase tracking-[0.2em] mt-1">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* COMPANY CARD MODAL */}
            <AnimatePresence>
                {isCardModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest">{editingCardIdx !== null ? "Edit Card" : "New Card"}</h4>
                                <button onClick={() => setIsCardModalOpen(false)} className="bg-white p-2 rounded-xl text-slate-400 hover:text-rose-500 shadow-sm transition-all border border-slate-200"><X size={18} /></button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-black">Icon</label>
                                    <div className="flex items-center gap-5 p-4 bg-slate-50/80 border border-slate-100 rounded-2xl group/icon">
                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-slate-200 overflow-hidden p-3 shadow-sm group-hover/icon:border-brand-primary/30 transition-all">
                                            {cardFormData.icon?.startsWith('data:image') || cardFormData.icon?.includes('/uploads/') || cardFormData.icon?.startsWith('http')
                                                ? <img src={getImageUrl(cardFormData.icon)} className="w-full h-full object-contain" alt="" />
                                                : (() => {
                                                    const PreviewIconComp = iconMap[cardFormData.icon] || Goal;
                                                    return <PreviewIconComp size={32} className="text-brand-primary" />;
                                                })()
                                            }
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Update visual representaton</p>
                                            <div className="relative overflow-hidden inline-block group/btn w-full">
                                                <button className="w-full bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-[11px] font-black text-slate-600 hover:text-brand-primary hover:border-brand-primary/30 transition-all shadow-sm flex items-center justify-center gap-2">
                                                    <ImageIcon size={14} strokeWidth={3} />
                                                    Change Media
                                                </button>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCardIconUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={cardFormData.title}
                                        onChange={(e) => setCardFormData({ ...cardFormData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold outline-none focus:border-slate-400 focus:bg-white transition-all"
                                        placeholder="e.g. Our Mission"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                                    <textarea
                                        rows="4"
                                        value={cardFormData.description}
                                        onChange={(e) => setCardFormData({ ...cardFormData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:border-slate-400 focus:bg-white transition-all leading-relaxed"
                                        placeholder="Enter the core strategy or value description..."
                                    />
                                </div>
                            </div>
                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-[2rem]">
                                <button onClick={() => setIsCardModalOpen(false)} className="px-6 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                                <button onClick={handleSaveCard} className="px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200/40 hover:scale-105 active:scale-95 transition-all">
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TEAM MEMBER MODAL */}
            <AnimatePresence>
                {isTeamModalOpen && (
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
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row"
                        >
                            {/* Left: Card Preview */}
                            <div className="w-full md:w-[320px] bg-slate-50 p-8 flex flex-col items-center justify-center border-r border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Profile Preview</h4>
                                <div className="w-full aspect-[4/5] bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                                    <div className="flex-1 overflow-hidden relative group">
                                        {memberFormData.image ? (
                                            <>
                                                <img
                                                    src={getImageUrl(memberFormData.image)}
                                                    className="w-full h-full object-cover"
                                                    alt={memberFormData.name}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                                <div className="absolute bottom-4 left-0 right-0 px-4 pointer-events-none">
                                                    <p className="text-white text-[9px] font-bold uppercase tracking-[0.2em] opacity-80">{memberFormData.role || "Job Role"}</p>
                                                    <h5 className="text-white font-bold text-sm tracking-tight">{memberFormData.name || "Member Name"}</h5>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                                                <Upload size={40} strokeWidth={1} />
                                                <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-8 w-full">
                                    <div className="flex flex-col items-center gap-1 mb-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Change Media</label>
                                        <span className="text-[9px] font-bold text-brand-primary uppercase tracking-tighter">Recommended: 600 x 750 PX</span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleMemberImageUpload} className="w-full text-[10px] file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-primary/10 file:text-brand-primary font-bold cursor-pointer" />
                                </div>
                            </div>

                            {/* Right: Form */}
                            <div className="flex-1 p-10 flex flex-col">
                                <div className="mb-10 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingMemberIdx !== null ? "Modify Member Profile" : "Onboard New Leader"}</h3>
                                        <p className="text-slate-400 text-xs font-medium mt-1">Manage the details and professional role of the expert.</p>
                                    </div>
                                    <button onClick={() => setIsTeamModalOpen(false)} className="bg-slate-100 p-2.5 rounded-xl text-slate-400 hover:text-rose-500 border border-slate-200 shadow-sm transition-all"><X /></button>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={memberFormData.name}
                                                onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:border-slate-400 focus:bg-white transition-all outline-none"
                                                placeholder="e.g. Abhilash R"
                                            />
                                        </div>
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Designation / Role</label>
                                            <input
                                                type="text"
                                                value={memberFormData.role}
                                                onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:border-slate-400 focus:bg-white transition-all outline-none text-brand-primary"
                                                placeholder="e.g. Chief Executive Officer"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex gap-3 items-start">
                                        <ShieldCheck className="text-brand-primary shrink-0 mt-0.5" size={18} />
                                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                            Team profiles are displayed in the "Our Team" section of the About page.
                                            Ensure high-quality, professional portraits are used for visual excellence.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end gap-3">
                                    <button onClick={() => setIsTeamModalOpen(false)} className="px-6 py-3 text-xs font-bold text-slate-500 hover:text-brand-primary transition-colors">Discard</button>
                                    <button
                                        onClick={handleSaveMember}
                                        className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-200/40 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        {editingMemberIdx !== null ? "Update " : "Confirm "}
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

export default ManageAbout;
