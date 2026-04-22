/* 
 * Code Walkthrough: ManageServices.jsx
 * 
 * Purpose: A comprehensive management suite for the "Services" page.
 * Features:
 * 1. Unified Header and "Save & Sync" action with Folder-Tab design.
 * 2. Visual Tabbed interface (Hero & Intro, Services List).
 * 3. High-density CRUD for Services:
 *    - Main Service details (Title, Slug, PNG Icon, Hero Image).
 *    - Nested Feature Cards Manager: Add/Edit/Delete multiple cards per service.
 *    - Every card support PNG icons for extreme branding flexibility.
 * 4. Advanced UX: Actions are always visible; real-time preview in modals.
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
    Search,
    Server,
    Upload,
    ChevronDown,
    ChevronUp,
    Fingerprint,
    ServerCog,
    CloudCog,
    Headphones,
    Boxes,
    FileKey,
    ShieldCheck
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { AdminCard, FormInput, FormTextarea } from '../components/AdminUI';
import ContentService from '../../services/contentService';
import { useNotification } from '../context/NotificationContext'; // 🛡️ MISSION: Absolute UI Parity

const iconMap = {
    Fingerprint: Fingerprint,
    ServerCog: ServerCog,
    CloudCog: CloudCog,
    Headset: Headphones,
    Boxes: Boxes,
    FileKey: FileKey,
    Server: Server,
    ShieldCheck: ShieldCheck
};

const ManageServices = () => {
    const { servicesPageData, setServicesPageData, refreshContent } = useContent();
    const { showNotification } = useNotification(); // 🕵️ MISSION: Notification Authority
    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States for Service Management
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [serviceFormData, setServiceFormData] = useState({
        title: "", slug: "", description: "", icon: "", image: "", conclusion: "", cards: []
    });

    // Sub-Card Modal States
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [editingCardIdx, setEditingCardIdx] = useState(null);
    const [cardFormData, setCardFormData] = useState({ title: "", description: "", icon: "" });

    if (!servicesPageData) return <div className="p-8">Loading Services Data...</div>;

    // === Handlers ===

    const handleSave = async () => {
        try {
            setIsSaving(true);
            // 🛡️ MISSION: Persist Hero & Intro
            const res = await ContentService.updateServicesContent({
                hero: servicesPageData.hero,
                serviceIntro: servicesPageData.serviceIntro
            });

            if (res.success) {
                await refreshContent();
                showNotification("Changes saved successfully!", 'success');
            }
        } catch (err) {
            console.error("❌ Persistence Error:", err);
            showNotification("ERROR: Failed to save changes. Please try again.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e, section, key) => {
        const file = e.target.files[0];
        if (file) {
            // 🛡️ MISSION: Size Authority (5MB Check)
            if (file.size > 5 * 1024 * 1024) {
                showNotification("Upload failed: File size must be under 5MB.", 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setServicesPageData({
                    ...servicesPageData,
                    [section]: { ...servicesPageData[section], [key]: reader.result }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Main Service CRUD ---
    const handleOpenAddService = () => {
        setEditingServiceId(null);
        setServiceFormData({ title: "", slug: "", description: "", icon: "", image: "", conclusion: "", cards: [] });
        setIsServiceModalOpen(true);
    };

    const handleOpenEditService = (service) => {
        setEditingServiceId(service.id);
        const safeCards = Array.isArray(service.cards) ? service.cards : [];
        setServiceFormData({ ...service, cards: safeCards });
        setIsServiceModalOpen(true);
    };

    const handleSaveService = async () => {
        if (!serviceFormData.title || !serviceFormData.slug) {
            showNotification("Please fill in all fields before updating.", 'error');
            return;
        }

        try {
            setIsSaving(true);

            // 🕵️ MISSION: Absolute Payload Optimization (Single Image Data Courier)
            const submissionData = { ...serviceFormData };
            if (submissionData.image) {
                submissionData.image_url = submissionData.image;
                delete submissionData.image; // 🚦 Remove redundant 5MB+ base64 from payload!
            }
            submissionData.id = editingServiceId;

            const res = await ContentService.upsertService(submissionData);

            if (res.success) {
                await refreshContent();
                setIsServiceModalOpen(false);
                showNotification("Expertise mission established successfully!", 'success');
            }
        } catch (err) {
            console.error("❌ Service Save Error:", err);
            showNotification("ERROR: Failed to save expertise card. Check foundations.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteService = async (id) => {
        if (window.confirm("Are you sure you want to remove this service? This action cannot be undone.")) {
            try {
                setIsSaving(true);
                const res = await ContentService.deleteService(id);
                if (res.success) {
                    await refreshContent();
                    showNotification("Service de-commissioned successfully.", 'success');
                }
            } catch (err) {
                console.error("❌ Deletion Error:", err);
                showNotification("ERROR: Failed to delete service. Please try again.", 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleServiceImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 🛡️ MISSION: 5MB Capacity Sealing
            if (file.size > 5 * 1024 * 1024) {
                showNotification("Security Protocol: Background must be under 5MB.", 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setServiceFormData({ ...serviceFormData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleServiceIconUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 🛡️ MISSION: 5MB Icon Policy
            if (file.size > 5 * 1024 * 1024) {
                showNotification("Security Protocol: PNG Icon must be under 5MB.", 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setServiceFormData({ ...serviceFormData, icon: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Nested Card Logic ---
    const handleOpenAddCard = () => {
        setEditingCardIdx(null);
        setCardFormData({ title: "", description: "", icon: "" });
        setIsCardModalOpen(true);
    };

    const handleOpenEditCard = (card, idx) => {
        setEditingCardIdx(idx);
        setCardFormData({ ...card });
        setIsCardModalOpen(true);
    };

    const handleSaveCard = () => {
        if (!cardFormData.title) {
            showNotification("Validation Mission: Card title is required.", 'error');
            return;
        }

        const newCards = [...serviceFormData.cards];
        if (editingCardIdx !== null) {
            newCards[editingCardIdx] = cardFormData;
        } else {
            newCards.push(cardFormData);
        }

        setServiceFormData({ ...serviceFormData, cards: newCards });
        setIsCardModalOpen(false);
    };

    const handleDeleteCard = (idx) => {
        if (window.confirm("Remove this feature card?")) {
            const newCards = serviceFormData.cards.filter((_, i) => i !== idx);
            setServiceFormData({ ...serviceFormData, cards: newCards });
        }
    };

    const handleCardIconUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 🛡️ MISSION: 5MB Sub-Card Security
            if (file.size > 5 * 1024 * 1024) {
                showNotification("Security Protocol: Card media must be under 5MB.", 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setCardFormData({ ...cardFormData, icon: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredServices = servicesPageData.servicesList.items.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'hero', label: 'Hero & Intro' },
        { id: 'list', label: 'Services List' },
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
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >
                            <div className="lg:col-span-2 space-y-6">
                                <AdminCard title=" Hero Section">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <FormInput label=" Tag" value={servicesPageData.hero.tag} onChange={(e) => setServicesPageData({ ...servicesPageData, hero: { ...servicesPageData.hero, tag: e.target.value } })} />
                                        <FormInput label="Main Heading" value={servicesPageData.hero.title} onChange={(e) => setServicesPageData({ ...servicesPageData, hero: { ...servicesPageData.hero, title: e.target.value } })} />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea label="Hero Tagline" rows={2} value={servicesPageData.hero.tagline} onChange={(e) => setServicesPageData({ ...servicesPageData, hero: { ...servicesPageData.hero, tagline: e.target.value } })} />
                                    </div>
                                </AdminCard>

                                <AdminCard title="Introduction">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                        <FormInput label=" Tag" value={servicesPageData.serviceIntro.tag} onChange={(e) => setServicesPageData({ ...servicesPageData, serviceIntro: { ...servicesPageData.serviceIntro, tag: e.target.value } })} />
                                        <FormInput label="Main Heading" value={servicesPageData.serviceIntro.heading} onChange={(e) => setServicesPageData({ ...servicesPageData, serviceIntro: { ...servicesPageData.serviceIntro, heading: e.target.value } })} />
                                    </div>
                                    <div className="mt-6">
                                        <FormTextarea label="Description" rows={8} value={servicesPageData.serviceIntro.description} onChange={(e) => setServicesPageData({ ...servicesPageData, serviceIntro: { ...servicesPageData.serviceIntro, description: e.target.value } })} />
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
                                        {servicesPageData.hero?.backgroundImage ? (
                                            <img
                                                src={servicesPageData.hero.backgroundImage}
                                                className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                                                alt="Hero background preview"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-slate-500 italic text-[11px] font-bold">
                                                <ImageIcon size={28} className="mb-2 opacity-20" />
                                                No Media Established
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                            <ImageIcon size={28} className="mb-2" />
                                            <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero', 'backgroundImage')} />
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
                                title="Services Explorer"
                                actions={
                                    <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
                                        <button
                                            onClick={handleOpenAddService}
                                            className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                        >
                                            <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                                Create New
                                            </span>
                                        </button>
                                    </div>
                                }
                            >
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-4">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50/80 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Title & Icon</th>
                                                <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Features</th>
                                                <th className="px-6 py-4 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredServices.map((service) => (
                                                <tr key={service.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-primary border border-slate-200/60 overflow-hidden p-1.5">
                                                                {service.icon && (service.icon.startsWith('data:image') || service.icon.startsWith('/') || service.icon.startsWith('http'))
                                                                    ? <img src={service.icon} alt="" className="w-full h-full object-contain" style={{ filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(186deg) brightness(101%) contrast(101%)' }} />
                                                                    : (() => {
                                                                        const IconComp = iconMap[service.icon] || Server;
                                                                        return <IconComp size={20} />;
                                                                    })()
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800">{service.title}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{service.description.substring(0, 30)}...</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex -space-x-2">
                                                            {Array.isArray(service.cards) && service.cards.slice(0, 4).map((c, i) => (
                                                                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center overflow-hidden p-1">
                                                                    {c.icon && (c.icon.startsWith('data:image') || c.icon.startsWith('/') || c.icon.startsWith('http'))
                                                                        ? <img src={c.icon} className="w-full h-full object-cover" style={{ filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(186deg) brightness(101%) contrast(101%)' }} />
                                                                        : (() => {
                                                                            const CardIconComp = iconMap[c.icon] || ShieldCheck;
                                                                            return <CardIconComp size={10} className="text-slate-400" />;
                                                                        })()
                                                                    }
                                                                </div>
                                                            ))}
                                                            {Array.isArray(service.cards) && service.cards.length > 4 && (
                                                                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold">
                                                                    +{service.cards.length - 4}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleOpenEditService(service)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors"><Edit3 size={16} /></button>
                                                            <button onClick={() => handleDeleteService(service.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
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

            {/* MAIN SERVICE MODAL */}
            <AnimatePresence>
                {isServiceModalOpen && (
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
                            className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]"
                        >
                            {/* Left Side: Preview & Meta */}
                            <div className="w-full md:w-[380px] p-8 bg-slate-50 flex flex-col items-center border-r border-slate-100 overflow-y-auto custom-scrollbar">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Live Card Preview</h4>
                                <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-950 group mb-8">
                                    {serviceFormData.image ? (
                                        <img src={serviceFormData.image} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                                            <ImageIcon size={32} className="text-slate-500 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-bold text-white text-xl">{serviceFormData.title || "Service Title"}</h5>
                                            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white overflow-hidden p-2 shadow-lg">
                                                {serviceFormData.icon && (serviceFormData.icon.startsWith('data:image') || serviceFormData.icon.startsWith('/') || serviceFormData.icon.startsWith('http'))
                                                    ? <img src={serviceFormData.icon} className="w-full h-full object-contain" />
                                                    : (() => {
                                                        const PreviewIconComp = iconMap[serviceFormData.icon] || Server;
                                                        return <PreviewIconComp size={20} />;
                                                    })()
                                                }
                                            </div>
                                        </div>
                                        <p className="text-white/70 text-[11px] line-clamp-2 leading-relaxed">{serviceFormData.description || "Description..."}</p>
                                    </div>
                                </div>

                                <div className="w-full space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Identity Icon</label>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Choose One Below</span>
                                        </div>

                                        {/* 🕵️ MISSION: Iconic Authority Hub */}
                                        <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-white border border-slate-200 rounded-2xl">
                                            {Object.entries(iconMap).map(([name, Icon]) => (
                                                <button
                                                    key={name}
                                                    type="button"
                                                    onClick={() => setServiceFormData({ ...serviceFormData, icon: name })}
                                                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${serviceFormData.icon === name
                                                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm scale-105'
                                                        : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200 hover:bg-white'}`}
                                                >
                                                    <Icon size={18} />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative group/upload overflow-hidden">
                                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 border-dashed rounded-2xl hover:border-brand-primary/50 transition-all cursor-pointer">
                                                <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                                                    <Upload size={14} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 group-hover/upload:text-brand-primary">Or upload custom PNG mission</span>
                                                <input type="file" accept="image/png" onChange={handleServiceIconUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Card Background</label>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Recommended: 800x1200</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleServiceImageUpload} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-200 cursor-pointer font-bold" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Tabbed Forms */}
                            <div className="flex-1 flex flex-col bg-white">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{editingServiceId ? "Update Service Portfolio" : "Design New Service"}</h3>
                                    <button onClick={() => setIsServiceModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all active:scale-95"><X size={20} strokeWidth={3} /></button>
                                </div>

                                <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                                    {/* 1. Core Metadata */}
                                    <section className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="col-span-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={serviceFormData.title}
                                                    onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Service Overview</label>
                                            <textarea
                                                rows="3"
                                                value={serviceFormData.description}
                                                onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:border-slate-400 focus:bg-white transition-all outline-none leading-relaxed"
                                            />
                                        </div>
                                    </section>

                                    {/* 2. NESTED CARD MANAGER */}
                                    <section className="bg-slate-50/50 rounded-3xl border border-slate-200 p-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider"> Feature Cards</h4>
                                            <button
                                                onClick={handleOpenAddCard}
                                                className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[12px] font-bold transition-all hover:shadow-xl hover:shadow-slate-200/40 active:scale-95 overflow-hidden"
                                            >
                                                <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                                    Add Feature Card
                                                </span>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {serviceFormData.cards.map((card, idx) => (
                                                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 group hover:shadow-lg transition-all">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 relative group overflow-hidden p-2 shadow-inner border border-slate-200">
                                                        {card.icon && (card.icon.startsWith('data:image') || card.icon.startsWith('/') || card.icon.startsWith('http'))
                                                            ? <img src={card.icon} className="w-full h-full object-contain" style={{ filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(186deg) brightness(101%) contrast(101%)' }} />
                                                            : (() => {
                                                                const CardIconComp = iconMap[card.icon] || ShieldCheck;
                                                                return <CardIconComp size={18} className="text-slate-400" />;
                                                            })()
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-bold text-slate-800 text-xs truncate">{card.title}</h5>
                                                        <p className="text-[9px] text-slate-400 truncate">{card.description}</p>
                                                    </div>
                                                    <div className="flex gap-1.5">
                                                        <button onClick={() => handleOpenEditCard(card, idx)} className="p-1.5 text-slate-300 hover:text-brand-primary transition-colors"><Edit3 size={14} /></button>
                                                        <button onClick={() => handleDeleteCard(idx)} className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                            {serviceFormData.cards.length === 0 && (
                                                <div className="col-span-2 py-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                                                    <p className="text-[11px] font-bold text-slate-400">No feature cards added. Click "Add Feature Card" to start.</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {/* 3. Conclusion */}
                                    <section className="bg-slate-50/50 rounded-3xl border border-slate-200 p-6 space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800">Conclusion</h4>
                                        <textarea
                                            rows="2"
                                            placeholder="What is the final outcome of this service?"
                                            value={serviceFormData.conclusion}
                                            onChange={(e) => setServiceFormData({ ...serviceFormData, conclusion: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white transition-all outline-none text-slate-800 leading-relaxed font-medium"
                                        />
                                    </section>
                                </div>

                                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-br-2xl">
                                    <button onClick={() => setIsServiceModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard</button>
                                    <button onClick={handleSaveService} className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-12 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-emerald-500/25">
                                        {editingServiceId ? "Update " : "Confirm"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* NESTED SUB-CARD MODAL */}
            <AnimatePresence>
                {isCardModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h4 className="font-black text-slate-800 text-sm">{editingCardIdx !== null ? "Edit Feature Card" : "New Feature Attribute"}</h4>
                                <button onClick={() => setIsCardModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all active:scale-95"><X size={20} strokeWidth={3} /></button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 overflow-hidden p-2 group relative">
                                            {cardFormData.icon && (cardFormData.icon.startsWith('data:image') || cardFormData.icon.startsWith('/') || cardFormData.icon.startsWith('http'))
                                                ? (
                                                    <>
                                                        <img src={cardFormData.icon} className="w-full h-full object-contain" style={{ filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(186deg) brightness(101%) contrast(101%)' }} />
                                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                            <ImageIcon size={18} />
                                                        </div>
                                                    </>
                                                )
                                                : (() => {
                                                    const CardFormIconComp = iconMap[cardFormData.icon] || Upload;
                                                    return <CardFormIconComp size={20} className="text-brand-primary" />;
                                                })()
                                            }
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Icon Choice</p>

                                            <div className="grid grid-cols-4 gap-2">
                                                {Object.entries(iconMap).slice(0, 4).map(([name, Icon]) => (
                                                    <button
                                                        key={name}
                                                        type="button"
                                                        onClick={() => setCardFormData({ ...cardFormData, icon: name })}
                                                        className={`p-2 rounded-lg border transition-all ${cardFormData.icon === name
                                                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm'
                                                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                                    >
                                                        <Icon size={14} />
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="relative group/card-upload overflow-hidden">
                                                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 border-dashed rounded-xl hover:border-brand-primary/50 transition-all cursor-pointer">
                                                    <Upload size={12} className="text-slate-400" />
                                                    <span className="text-[9px] font-bold text-slate-500">Custom Media</span>
                                                    <input type="file" accept="image/*" onChange={handleCardIconUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Feature Title</label>
                                    <input
                                        type="text"
                                        value={cardFormData.title}
                                        onChange={(e) => setCardFormData({ ...cardFormData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-slate-400 focus:bg-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={cardFormData.description}
                                        onChange={(e) => setCardFormData({ ...cardFormData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setIsCardModalOpen(false)} className="px-6 py-2 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors">Discard</button>
                                <button onClick={handleSaveCard} className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-6 py-2.5 rounded-xl text-[11px] font-black shadow-lg shadow-emerald-500/25 transition-all">Confirm</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageServices;
