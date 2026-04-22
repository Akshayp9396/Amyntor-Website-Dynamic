/**
 * Code Walkthrough: ManageContact.jsx
 * 
 * Purpose: A management suite for the "Contact Us" section, upgraded to the White Glass UI.
 * Features:
 * 1. Unified Header and "Save & Push Live" action with "Premium Pill" tab design.
 * 2. Visual Tabbed interface (Hero Section, Get in Touch, Branches).
 * 3. Consistent AdminCard usage.
 * 4. High-fidelity Glassmorphism modals for Branch editing.
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
    MessageSquare,
    Layers,
    MapPin,
    Mail,
    Phone,
    PlusCircle,
    Globe,
    ChevronRight,
    Search,
    ExternalLink
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useNotification } from '../context/NotificationContext';
import ContentService from '../../services/contentService';
import { AdminCard, FormInput, FormTextarea } from '../components/AdminUI';

// 🕵️ HELPER: Resolve real computer photo paths for Admin Preview
const resolveMedia = (path) => {
    if (!path) return null;
    if (path.startsWith('/uploads/')) {
        return `http://localhost:5050${path}`;
    }
    return path;
};

const ManageContact = () => {
    const { contactPageData, setContactPageData, refreshContent } = useContent();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);

    // Modal States for Branch CRUD
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [editingBranchIdx, setEditingBranchIdx] = useState(null);
    const [branchFormData, setBranchFormData] = useState({
        id: null,
        city: "",
        type: "",
        address: "",
        phone: "",
        email: "",
        image: ""
    });

    if (!contactPageData) return <div className="p-8 text-slate-400 font-bold">Loading Contact Data...</div>;

    // === Global Handlers ===

    // 🕵️ SECURITY GATEKEEPER: Unified Rule for all local image picks
    const validateFile = (file) => {
        if (!file) return false;
        const MAX_SIZE = 5 * 1024 * 1024; // Robust 5MB Limit for High-Res Visuals
        if (file.size > MAX_SIZE) {
            showNotification("Upload failed: File size must be less than 5MB.", 'error');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Core Content (Hero & Info)
            await ContentService.updateContactContent({
                hero: contactPageData.hero,
                info: contactPageData.info
            });

            // 2. Emails & Socials
            await ContentService.updateContactEmails(contactPageData.info?.emails);
            // Assuming socials might also be here if we added them to the state
            if (contactPageData.info?.socials) {
                await ContentService.updateContactSocials(contactPageData.info.socials);
            }

            // 3. Branches
            if (contactPageData.branches) {
                await ContentService.updateContactBranches({
                    header: {
                        tag: contactPageData.branches.tag,
                        title: contactPageData.branches.title,
                        description: contactPageData.branches.description
                    },
                    cards: contactPageData.branches.cards
                });
            }

            showNotification("Changes saved successfully!", "success");
            await refreshContent();
        } catch (err) {
            console.error("❌ Save Failed:", err);
            showNotification("ERROR: Failed to save changes. Please try again.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e, path) => {
        const file = e.target.files[0];
        if (!validateFile(file)) {
            e.target.value = "";
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            setIsSaving(true);
            const res = await ContentService.uploadImage(formData);
            if (res.success) {
                const newData = { ...contactPageData };
                const pathParts = path.split('.');
                let current = newData;
                for (let i = 0; i < pathParts.length - 1; i++) {
                    current = current[pathParts[i]];
                }
                current[pathParts[pathParts.length - 1]] = res.url;
                setContactPageData(newData);
            }
        } catch (err) {
            console.error("Asset Upload Protocol Error:", err);
            showNotification("The file could not be uploaded. Please try again.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Branch CRUD Handlers ---

    const handleOpenAddBranch = () => {
        setEditingBranchIdx(null);
        setBranchFormData({
            id: Date.now(),
            city: "",
            type: "BRANCH OFFICE",
            address: "",
            phone: "",
            email: "",
            image: ""
        });
        setIsBranchModalOpen(true);
    };

    const handleOpenEditBranch = (branch, idx) => {
        setEditingBranchIdx(idx);
        setBranchFormData({ ...branch });
        setIsBranchModalOpen(true);
    };

    const handleSaveBranch = () => {
        if (!branchFormData.city) {
            alert("City name is required.");
            return;
        }

        const newCards = [...contactPageData.branches.cards];
        if (editingBranchIdx !== null) {
            newCards[editingBranchIdx] = branchFormData;
        } else {
            newCards.push(branchFormData);
        }

        setContactPageData({
            ...contactPageData,
            branches: {
                ...contactPageData.branches,
                cards: newCards
            }
        });
        setIsBranchModalOpen(false);
    };

    const handleDeleteBranch = (idx) => {
        if (window.confirm("Delete this branch location?")) {
            const newCards = contactPageData.branches.cards.filter((_, i) => i !== idx);
            setContactPageData({
                ...contactPageData,
                branches: {
                    ...contactPageData.branches,
                    cards: newCards
                }
            });
        }
    };

    const tabs = [
        { id: 'hero', label: 'Hero Section' },
        { id: 'info', label: 'Get in Touch' },
        { id: 'branches', label: 'Branches' },
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
                            <div className="lg:col-span-2 space-y-6">
                                <AdminCard title="Hero Section">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <FormInput
                                            label=" Tag"
                                            value={contactPageData.hero.tag}
                                            onChange={(e) => setContactPageData({ ...contactPageData, hero: { ...contactPageData.hero, tag: e.target.value } })}
                                        />
                                        <FormInput
                                            label="Main Heading"
                                            value={contactPageData.hero.title}
                                            onChange={(e) => setContactPageData({ ...contactPageData, hero: { ...contactPageData.hero, title: e.target.value } })}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea
                                            label="Hero Tagline"
                                            rows={2}
                                            value={contactPageData.hero.tagline}
                                            onChange={(e) => setContactPageData({ ...contactPageData, hero: { ...contactPageData.hero, tagline: e.target.value } })}
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
                                            src={resolveMedia(contactPageData.hero.backgroundImage)}
                                            className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                                            alt="Hero background preview"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero.backgroundImage')} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'info' && (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <AdminCard title="Heading & Description">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <FormInput
                                            label=" Tag"
                                            value={contactPageData.info.tag}
                                            onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, tag: e.target.value } })}
                                        />
                                        <FormInput
                                            label="Main Heading"
                                            value={contactPageData.info.title}
                                            onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, title: e.target.value } })}
                                        />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea
                                            label="Description"
                                            rows={3}
                                            value={contactPageData.info.description}
                                            onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, description: e.target.value } })}
                                        />
                                    </div>
                                </AdminCard>

                                <AdminCard title="Call & Support">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <FormInput
                                            label="Phone Number"
                                            value={contactPageData.info.phone.number}
                                            onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, phone: { ...contactPageData.info.phone, number: e.target.value } } })}
                                        />
                                        <FormInput
                                            label="Whatsapp Number"
                                            value={contactPageData.info.whatsapp.number}
                                            onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, whatsapp: { ...contactPageData.info.whatsapp, number: e.target.value } } })}
                                        />
                                        <div className="md:col-span-2">
                                            <FormInput
                                                label="Operating Hours"
                                                value={contactPageData.info.phone.hours}
                                                onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, phone: { ...contactPageData.info.phone, hours: e.target.value } } })}
                                            />
                                        </div>
                                    </div>
                                </AdminCard>
                            </div>

                            <AdminCard
                                title="Email Addresses"
                                actions={
                                    <button
                                        onClick={() => setContactPageData({
                                            ...contactPageData,
                                            info: {
                                                ...contactPageData.info,
                                                emails: [...(contactPageData.info.emails || []), { id: Date.now(), label: "New Email", value: "info@amyntortech.com" }]
                                            }
                                        })}
                                        className="group relative flex items-center gap-2 px-6 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                            Add Email
                                        </span>
                                    </button>
                                }
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                                    {(contactPageData.info.emails || []).map((email, idx) => (
                                        <div key={email.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                                            <div className="flex-grow space-y-3">
                                                <FormInput
                                                    label="Department Label"
                                                    value={email.label}
                                                    onChange={(e) => {
                                                        const newEmails = [...contactPageData.info.emails];
                                                        newEmails[idx].label = e.target.value;
                                                        setContactPageData({ ...contactPageData, info: { ...contactPageData.info, emails: newEmails } });
                                                    }}
                                                />
                                                <FormInput
                                                    label="Email Address"
                                                    value={email.value}
                                                    onChange={(e) => {
                                                        const newEmails = [...contactPageData.info.emails];
                                                        newEmails[idx].value = e.target.value;
                                                        setContactPageData({ ...contactPageData, info: { ...contactPageData.info, emails: newEmails } });
                                                    }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => setContactPageData({
                                                    ...contactPageData,
                                                    info: {
                                                        ...contactPageData.info,
                                                        emails: contactPageData.info.emails.filter(e => e.id !== email.id)
                                                    }
                                                })}
                                                className="p-2 text-slate-300 hover:text-rose-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>

                            <AdminCard
                                title="Social Media Links"
                                actions={
                                    <button
                                        onClick={() => setContactPageData({
                                            ...contactPageData,
                                            info: {
                                                ...contactPageData.info,
                                                socials: [...(contactPageData.info.socials || []), { id: Date.now(), platform: "Platform", link: "https://" }]
                                            }
                                        })}
                                        className="group relative flex items-center gap-2 px-6 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                            Add Link
                                        </span>
                                    </button>
                                }
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                                    {(contactPageData.info.socials || []).map((social, idx) => (
                                        <div key={social.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                                            <div className="flex-grow space-y-3">
                                                <FormInput
                                                    label="Platform (e.g. LinkedIn)"
                                                    value={social.platform}
                                                    onChange={(e) => {
                                                        const newSocials = [...contactPageData.info.socials];
                                                        newSocials[idx].platform = e.target.value;
                                                        setContactPageData({ ...contactPageData, info: { ...contactPageData.info, socials: newSocials } });
                                                    }}
                                                />
                                                <FormInput
                                                    label="URL Link"
                                                    value={social.link}
                                                    onChange={(e) => {
                                                        const newSocials = [...contactPageData.info.socials];
                                                        newSocials[idx].link = e.target.value;
                                                        setContactPageData({ ...contactPageData, info: { ...contactPageData.info, socials: newSocials } });
                                                    }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => setContactPageData({
                                                    ...contactPageData,
                                                    info: {
                                                        ...contactPageData.info,
                                                        socials: contactPageData.info.socials.filter(s => s.id !== social.id)
                                                    }
                                                })}
                                                className="p-2 text-slate-300 hover:text-rose-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>

                            <AdminCard title="Google Maps Integration">
                                <div className="space-y-4 mt-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maps Embed URL</label>
                                        <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                                            Get Link from Google Maps <ExternalLink size={10} />
                                        </a>
                                    </div>
                                    <input
                                        type="text"
                                        value={contactPageData.info.googleMapsUrl}
                                        onChange={(e) => setContactPageData({
                                            ...contactPageData,
                                            info: { ...contactPageData.info, googleMapsUrl: e.target.value }
                                        })}
                                        placeholder="Paste the <iframe> src URL here..."
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[15px] focus:border-slate-400 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400"
                                    />
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}

                    {activeTab === 'branches' && (
                        <motion.div
                            key="branches"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <AdminCard title="Branch Section Header">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                    <FormInput
                                        label=" Tag"
                                        value={contactPageData.branches.tag}
                                        onChange={(e) => setContactPageData({ ...contactPageData, branches: { ...contactPageData.branches, tag: e.target.value } })}
                                    />
                                    <FormInput
                                        label="Main Heading"
                                        value={contactPageData.branches.title}
                                        onChange={(e) => setContactPageData({ ...contactPageData, branches: { ...contactPageData.branches, title: e.target.value } })}
                                    />
                                </div>
                                <div className="mt-6">
                                    <FormTextarea
                                        label="Description"
                                        rows={2}
                                        value={contactPageData.branches.description}
                                        onChange={(e) => setContactPageData({ ...contactPageData, branches: { ...contactPageData.branches, description: e.target.value } })}
                                    />
                                </div>
                            </AdminCard>

                            <AdminCard
                                title="Branch Offices"
                                actions={
                                    <button
                                        onClick={handleOpenAddBranch}
                                        className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                            Add New Branch
                                        </span>
                                    </button>
                                }
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {contactPageData.branches.cards.map((branch, idx) => (
                                        <div key={branch.id || idx} className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-primary/10">
                                                    <img src={resolveMedia(branch.image)} className="w-full h-full object-cover" alt={branch.city} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-800">{branch.city}</h4>
                                                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{branch.type}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-start gap-2">
                                                    <MapPin size={12} className="text-slate-400 mt-1 shrink-0" />
                                                    <p className="text-[11px] text-slate-600 font-medium leading-normal line-clamp-2">{branch.address}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={12} className="text-slate-400 shrink-0" />
                                                    <p className="text-[11px] font-bold text-slate-600">{branch.phone}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={12} className="text-slate-400 shrink-0" />
                                                    <p className="text-[11px] font-bold text-slate-600">{branch.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/60">
                                                <button onClick={() => handleOpenEditBranch(branch, idx)} className="p-2 text-slate-400 hover:text-brand-primary bg-white border border-slate-200 shadow-sm rounded-xl transition-all"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDeleteBranch(idx)} className="p-2 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 shadow-sm rounded-xl transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* BRANCH EDIT MODAL - WHITE GLASS STYLE */}
            <AnimatePresence>
                {isBranchModalOpen && (
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
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                                        {editingBranchIdx !== null ? "Edit Branch" : "Add New Branch"}
                                    </h3>
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Global Presence Management</p>
                                </div>
                                <button onClick={() => setIsBranchModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all active:scale-95"><X size={20} strokeWidth={3} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-slate-50/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label="City / Location"
                                        value={branchFormData.city}
                                        onChange={(e) => setBranchFormData({ ...branchFormData, city: e.target.value })}
                                    />
                                    <FormInput
                                        label="Branch Type"
                                        value={branchFormData.type}
                                        onChange={(e) => setBranchFormData({ ...branchFormData, type: e.target.value })}
                                    />
                                </div>

                                <FormTextarea
                                    label="Address"
                                    rows={3}
                                    value={branchFormData.address}
                                    onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label="Phone Number"
                                        value={branchFormData.phone}
                                        onChange={(e) => setBranchFormData({ ...branchFormData, phone: e.target.value })}
                                    />
                                    <FormInput
                                        label="Email Address"
                                        value={branchFormData.email}
                                        onChange={(e) => setBranchFormData({ ...branchFormData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block mb-2">Location Image</label>
                                    <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 overflow-hidden p-2 group relative">
                                            {branchFormData.image ? (
                                                <>
                                                    <img src={resolveMedia(branchFormData.image)} className="w-full h-full object-cover" alt="" />
                                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                        <ImageIcon size={16} />
                                                    </div>
                                                </>
                                            ) : (
                                                <ImageIcon size={20} className="text-brand-primary" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Upload Branch Visual representation</p>
                                            <div className="relative overflow-hidden inline-block group/btn w-full">
                                                <button className="w-full bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-[11px] font-black text-slate-600 hover:text-brand-primary hover:border-brand-primary/30 transition-all shadow-sm flex items-center justify-center gap-2">
                                                    <ImageIcon size={14} strokeWidth={3} />
                                                    Change Media
                                                </button>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (!validateFile(file)) {
                                                            e.target.value = "";
                                                            return;
                                                        }
                                                        const formData = new FormData();
                                                        formData.append('image', file);
                                                        try {
                                                            setIsSaving(true);
                                                            const res = await ContentService.uploadImage(formData);
                                                            if (res.success) {
                                                                setBranchFormData({ ...branchFormData, image: res.url });
                                                            }
                                                        } catch (err) {
                                                            console.error("Asset Upload Protocol Error:", err);
                                                            showNotification("The file could not be uploaded. Please try again.", "error");
                                                        } finally {
                                                            setIsSaving(false);
                                                        }
                                                    }}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-[2.5rem]">
                                <button onClick={() => setIsBranchModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard</button>
                                <button
                                    onClick={handleSaveBranch}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-10 py-3.5 rounded-2xl text-[13px] font-black transition-all shadow-xl shadow-emerald-500/25 active:scale-95 uppercase tracking-widest"
                                >
                                    {editingBranchIdx !== null ? "Update" : "Confirm"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageContact;
