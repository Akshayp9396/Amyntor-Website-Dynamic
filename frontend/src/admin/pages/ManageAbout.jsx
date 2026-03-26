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

const iconMap = {
    Target: Goal,
    Eye: Lightbulb,
    Diamond: ShieldCheck
};

const ManageAbout = () => {
    const { aboutPageData, setAboutPageData } = useContent();
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);

    // Modal States for Company Cards
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [editingCardIdx, setEditingCardIdx] = useState(null);
    const [cardFormData, setCardFormData] = useState({ title: "", description: "", icon: "Target" });

    // Modal States for Team Management
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [editingMemberIdx, setEditingMemberIdx] = useState(null);
    const [memberFormData, setMemberFormData] = useState({ name: "", role: "", image: "" });

    if (!aboutPageData) return <div className="p-8">Loading About Page Data...</div>;

    // === Global Handlers ===

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("About Us Page content updated successfully!");
        }, 800);
    };

    const handleImageUpload = (e, section, key) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAboutPageData({
                    ...aboutPageData,
                    [section]: { ...aboutPageData[section], [key]: reader.result }
                });
            };
            reader.readAsDataURL(file);
        }
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
            alert("Card title is required.");
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
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCardFormData({ ...cardFormData, icon: reader.result });
            };
            reader.readAsDataURL(file);
        }
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
            alert("Name and Role are required.");
            return;
        }

        const newMembers = [...aboutPageData.aboutTeam.members];
        if (editingMemberIdx !== null) {
            newMembers[editingMemberIdx] = memberFormData;
        } else {
            newMembers.push({ ...memberFormData, id: Date.now() });
        }

        setAboutPageData({
            ...aboutPageData,
            aboutTeam: { ...aboutPageData.aboutTeam, members: newMembers }
        });
        setIsTeamModalOpen(false);
    };

    const handleDeleteMember = (idx) => {
        if (window.confirm("Remove this team member?")) {
            const newMembers = aboutPageData.aboutTeam.members.filter((_, i) => i !== idx);
            setAboutPageData({
                ...aboutPageData,
                aboutTeam: { ...aboutPageData.aboutTeam, members: newMembers }
            });
        }
    };

    const handleMemberImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMemberFormData({ ...memberFormData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
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
            {/* Header & Global Action */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">About Us</h1>
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

            {/* Custom Tab Navigation */}
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

            {/* Content Area */}
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
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Hero Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                        <h3 className="text-lg font-bold text-slate-800">Hero Section</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Top Tag</label>
                                                <input
                                                    type="text"
                                                    value={aboutPageData.hero.tag}
                                                    onChange={(e) => setAboutPageData({ ...aboutPageData, hero: { ...aboutPageData.hero, tag: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Main Heading</label>
                                                <input
                                                    type="text"
                                                    value={aboutPageData.hero.title}
                                                    onChange={(e) => setAboutPageData({ ...aboutPageData, hero: { ...aboutPageData.hero, title: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-black"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Hero Tagline</label>
                                            <textarea
                                                rows="3"
                                                value={aboutPageData.hero.tagline}
                                                onChange={(e) => setAboutPageData({ ...aboutPageData, hero: { ...aboutPageData.hero, tagline: e.target.value } })}
                                                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                        <h3 className="text-lg font-bold text-slate-800">Company Overview</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Tagline</label>
                                                <input
                                                    type="text"
                                                    value={aboutPageData.aboutCompany.tag}
                                                    onChange={(e) => setAboutPageData({ ...aboutPageData, aboutCompany: { ...aboutPageData.aboutCompany, tag: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Main Heading</label>
                                                <input
                                                    type="text"
                                                    value={aboutPageData.aboutCompany.heading}
                                                    onChange={(e) => setAboutPageData({ ...aboutPageData, aboutCompany: { ...aboutPageData.aboutCompany, heading: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-black"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Detailed Description</label>
                                            <textarea
                                                rows="8"
                                                value={aboutPageData.aboutCompany.description1}
                                                onChange={(e) => setAboutPageData({ ...aboutPageData, aboutCompany: { ...aboutPageData.aboutCompany, description1: e.target.value } })}
                                                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Preview */}
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Hero Visuals</h3>
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">Background Preview</span>
                                        </div>
                                        <div className="relative group overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 aspect-[4/3] flex items-center justify-center shadow-inner">
                                            <img
                                                src={aboutPageData.hero.backgroundImage}
                                                className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                                                alt="Hero preview"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                                <label className="cursor-pointer bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                                                    <ImageIcon size={14} /> Replace Background
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero', 'backgroundImage')} />
                                                </label>
                                            </div>
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
                            {/* Mission / Vision / Values Manager */}
                            <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-sm">
                                            <Goal size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Our Core Principles</h3>
                                            <p className="text-xs text-slate-500 font-medium">Manage the fixed sections that define our company's ethos.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {aboutPageData.aboutCompany.cards.map((card, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col gap-5 group hover:shadow-2xl transition-all duration-300 border-l-4 border-l-brand-primary">
                                            <div className="flex justify-between items-start">
                                                <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary border border-brand-primary/10 p-3 shadow-inner">
                                                    {card.icon?.startsWith('data:image') || card.icon?.startsWith('/') || card.icon?.startsWith('http') 
                                                        ? <img src={card.icon} alt="" className="w-full h-full object-contain" />
                                                        : (() => {
                                                            const IconComp = iconMap[card.icon] || Goal;
                                                            return <IconComp size={28} />;
                                                        })()
                                                    }
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleOpenEditCard(card, idx)} className="bg-slate-50 p-2.5 rounded-xl text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all border border-slate-200 shadow-sm"><Edit3 size={18} /></button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-black text-slate-800 text-base tracking-tight">{card.title}</h4>
                                                <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed font-medium">{card.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">Expert Team</h3>
                                    <p className="text-xs text-slate-500 font-medium">Manage the leadership and team member profiles.</p>
                                </div>
                                <button
                                    onClick={handleOpenAddMember}
                                    className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
                                >
                                    <Plus size={16} /> Onboard Member
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {aboutPageData.aboutTeam.members.map((member, idx) => (
                                    <div key={idx} className="group relative bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300">
                                        <div className="aspect-[4/5] overflow-hidden relative">
                                            <img
                                                src={member.image}
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
                                <button onClick={() => setIsCardModalOpen(false)} className="bg-white p-2 rounded-xl text-slate-400 hover:text-slate-800 shadow-sm transition-colors border border-slate-200"><X size={18} /></button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Icon (PNG or Name)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 overflow-hidden p-3 shadow-inner">
                                            {cardFormData.icon?.startsWith('data:image') || cardFormData.icon?.startsWith('/') || cardFormData.icon?.startsWith('http') 
                                                ? <img src={cardFormData.icon} className="w-full h-full object-contain" /> 
                                                : (() => {
                                                    const PreviewIconComp = iconMap[cardFormData.icon] || Goal;
                                                    return <PreviewIconComp size={24} className="text-brand-primary" />;
                                                })()
                                            }
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input type="file" accept="image/png" onChange={handleCardIconUpload} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-600 font-bold cursor-pointer transition-all hover:file:bg-slate-200" />
                                            <p className="text-[9px] text-slate-400 font-medium">Or type icon name: Target, Eye, Diamond</p>
                                            <input 
                                                type="text" 
                                                value={cardFormData.icon?.startsWith('data:image') ? "" : cardFormData.icon}
                                                onChange={(e) => setCardFormData({...cardFormData, icon: e.target.value})}
                                                placeholder="Lucide Icon Name"
                                                className="w-full bg-slate-100 border-none rounded-lg p-2 text-[10px] font-bold outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={cardFormData.title}
                                        onChange={(e) => setCardFormData({ ...cardFormData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary"
                                        placeholder="e.g. Our Mission"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                                    <textarea
                                        rows="4"
                                        value={cardFormData.description}
                                        onChange={(e) => setCardFormData({ ...cardFormData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary leading-relaxed"
                                        placeholder="Enter the core strategy or value description..."
                                    />
                                </div>
                            </div>
                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-[2rem]">
                                <button onClick={() => setIsCardModalOpen(false)} className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                                <button onClick={handleSaveCard} className="bg-brand-primary text-white px-8 py-3 rounded-xl text-xs font-black shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">Confirm Item</button>
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
                                            <img src={memberFormData.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                                                <Upload size={40} strokeWidth={1} />
                                                <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-0 right-0 px-4">
                                            <p className="text-white text-[9px] font-bold uppercase tracking-[0.2em] opacity-80">{memberFormData.role || "Job Role"}</p>
                                            <h5 className="text-white font-bold text-sm tracking-tight">{memberFormData.name || "Member Name"}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 w-full">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 text-center">Update Photo</label>
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
                                    <button onClick={() => setIsTeamModalOpen(false)} className="bg-slate-100 p-2.5 rounded-xl text-slate-400 hover:text-slate-800 border border-slate-200 shadow-sm"><X /></button>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={memberFormData.name}
                                                onChange={(e) => setMemberFormData({...memberFormData, name: e.target.value})}
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all outline-none"
                                                placeholder="e.g. Abhilash R"
                                            />
                                        </div>
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Designation / Role</label>
                                            <input
                                                type="text"
                                                value={memberFormData.role}
                                                onChange={(e) => setMemberFormData({...memberFormData, role: e.target.value})}
                                                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary transition-all outline-none text-brand-primary"
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
                                    <button onClick={handleSaveMember} className="bg-brand-primary hover:bg-brand-dark text-white px-10 py-4 rounded-2xl text-xs font-black shadow-xl shadow-brand-primary/30 transition-all transform hover:-translate-y-0.5">
                                        {editingMemberIdx !== null ? "Update Identity" : "Confirm Onboarding"}
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
