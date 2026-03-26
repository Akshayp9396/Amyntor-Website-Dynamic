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

const iconMap = {
    Fingerprint: Fingerprint,
    ServerCog: ServerCog,
    CloudCog: CloudCog,
    Headset: Headphones,
    Boxes: Boxes,
    FileKey: FileKey,
    Server: Server
};

const ManageServices = () => {
    const { servicesPageData, setServicesPageData } = useContent();
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

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Services Page content updated successfully!");
        }, 800);
    };

    const handleImageUpload = (e, section, key) => {
        const file = e.target.files[0];
        if (file) {
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

    const handleSaveService = () => {
        if (!serviceFormData.title || !serviceFormData.slug) {
            alert("Title and Slug are required.");
            return;
        }

        if (editingServiceId) {
            const updatedItems = servicesPageData.servicesList.items.map(item =>
                item.id === editingServiceId ? { ...serviceFormData, id: item.id } : item
            );
            setServicesPageData({
                ...servicesPageData,
                servicesList: { ...servicesPageData.servicesList, items: updatedItems }
            });
        } else {
            const newId = servicesPageData.servicesList.items.length > 0
                ? Math.max(...servicesPageData.servicesList.items.map(i => i.id)) + 1
                : 1;
            setServicesPageData({
                ...servicesPageData,
                servicesList: {
                    ...servicesPageData.servicesList,
                    items: [...servicesPageData.servicesList.items, { ...serviceFormData, id: newId }]
                }
            });
        }
        setIsServiceModalOpen(false);
    };

    const handleDeleteService = (id) => {
        if (window.confirm("Are you sure you want to remove this service? This action cannot be undone.")) {
            const updatedItems = servicesPageData.servicesList.items.filter(item => item.id !== id);
            setServicesPageData({
                ...servicesPageData,
                servicesList: { ...servicesPageData.servicesList, items: updatedItems }
            });
        }
    };

    const handleServiceImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
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
            alert("Card title is required.");
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
            {/* Header & Global Action */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Services Page</h1>
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

            {/* Custom Tab Navigation - Folder Style */}
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
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                    <h3 className="text-lg font-bold text-slate-800">Page Hero Content</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Top Tag</label>
                                                <input
                                                    type="text"
                                                    value={servicesPageData.hero.tag}
                                                    onChange={(e) => setServicesPageData({ ...servicesPageData, hero: { ...servicesPageData.hero, tag: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Main Heading</label>
                                                <input
                                                    type="text"
                                                    value={servicesPageData.hero.title}
                                                    onChange={(e) => setServicesPageData({ ...servicesPageData, hero: { ...servicesPageData.hero, title: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-black"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Hero Tagline</label>
                                            <textarea
                                                rows="2"
                                                value={servicesPageData.hero.tagline}
                                                onChange={(e) => setServicesPageData({ ...servicesPageData, hero: { ...servicesPageData.hero, tagline: e.target.value } })}
                                                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                    <h3 className="text-lg font-bold text-slate-800">Intro / Solutions Brief</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Small Tag</label>
                                                <input
                                                    type="text"
                                                    value={servicesPageData.serviceIntro.tag}
                                                    onChange={(e) => setServicesPageData({ ...servicesPageData, serviceIntro: { ...servicesPageData.serviceIntro, tag: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Intro Heading</label>
                                                <input
                                                    type="text"
                                                    value={servicesPageData.serviceIntro.heading}
                                                    onChange={(e) => setServicesPageData({ ...servicesPageData, serviceIntro: { ...servicesPageData.serviceIntro, heading: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-black"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Main Description (Brief)</label>
                                            <textarea
                                                rows="8"
                                                value={servicesPageData.serviceIntro.description}
                                                onChange={(e) => setServicesPageData({ ...servicesPageData, serviceIntro: { ...servicesPageData.serviceIntro, description: e.target.value } })}
                                                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                    <h3 className="text-lg font-bold text-slate-800">Hero Overlay Image</h3>
                                    <div className="relative group overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 aspect-[4/3] flex items-center justify-center">
                                        <img
                                            src={servicesPageData.hero.backgroundImage}
                                            className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
                                            alt="Hero background preview"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <label className="cursor-pointer bg-white/90 backdrop-blur px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-white transition-all transform group-hover:scale-105">
                                                <ImageIcon size={14} /> Replace Image
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero', 'backgroundImage')} />
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 text-center font-medium">Recommended: High-res dark background image.</p>
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
                                        placeholder="Filter by service name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                                <button
                                    onClick={handleOpenAddService}
                                    className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10"
                                >
                                    <Plus size={16} /> Create New Service
                                </button>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50/50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Title & Icon</th>
                                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">Features</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredServices.map((service) => (
                                            <tr key={service.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 overflow-hidden p-1.5">
                                                            {service.icon?.startsWith('data:image') || service.icon?.startsWith('/') || service.icon?.startsWith('http') 
                                                                ? <img src={service.icon} alt="" className="w-full h-full object-contain" />
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
                                                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                                                {c.icon?.startsWith('data:image') || c.icon?.startsWith('/') || c.icon?.startsWith('http') 
                                                                    ? <img src={c.icon} className="w-full h-full object-cover" /> 
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
                                                        <button
                                                            onClick={() => handleOpenEditService(service)}
                                                            className="p-2 text-slate-400 hover:text-brand-primary bg-slate-50 hover:bg-brand-primary/10 rounded-lg transition-all flex items-center gap-1.5"
                                                        >
                                                            <Edit3 size={16} /><span className="text-[10px] font-bold uppercase">Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteService(service.id)}
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
                                    {serviceFormData.image && (
                                        <img src={serviceFormData.image} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-bold text-white text-xl">{serviceFormData.title || "Service Title"}</h5>
                                            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white overflow-hidden p-2 shadow-lg">
                                                {serviceFormData.icon && (serviceFormData.icon?.startsWith('data:image') || serviceFormData.icon?.startsWith('/') || serviceFormData.icon?.startsWith('http')) 
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
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Service Icon (PNG)</label>
                                        <input type="file" accept="image/png" onChange={handleServiceIconUpload} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-brand-primary/10 file:text-brand-primary font-bold cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Card Background</label>
                                        <input type="file" accept="image/*" onChange={handleServiceImageUpload} className="w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-200 cursor-pointer font-bold" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Tabbed Forms */}
                            <div className="flex-1 flex flex-col bg-white">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{editingServiceId ? "Update Service Portfolio" : "Design New Service"}</h3>
                                    <button onClick={() => setIsServiceModalOpen(false)} className="bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"><X /></button>
                                </div>

                                <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                                    {/* 1. Core Metadata */}
                                    <section className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    value={serviceFormData.title}
                                                    onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                />
                                            </div>
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Slug (URL)</label>
                                                <input
                                                    type="text"
                                                    value={serviceFormData.slug}
                                                    onChange={(e) => setServiceFormData({ ...serviceFormData, slug: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold text-brand-primary"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Service Overview</label>
                                            <textarea
                                                rows="3"
                                                value={serviceFormData.description}
                                                onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                            />
                                        </div>
                                    </section>

                                    {/* 2. NESTED CARD MANAGER */}
                                    <section className="bg-slate-50/50 rounded-3xl border border-slate-200 p-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider"> Feature Cards</h4>
                                            <button
                                                onClick={handleOpenAddCard}
                                                className="bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-1.5 transition-all shadow-md shadow-brand-primary/20"
                                            >
                                                <Plus size={14} /> Add Feature Card
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {serviceFormData.cards.map((card, idx) => (
                                                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 group hover:shadow-lg transition-all border-l-4 border-l-brand-primary">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden p-1.5">
                                                        {card.icon && (card.icon?.startsWith('data:image') || card.icon?.startsWith('/') || card.icon?.startsWith('http')) 
                                                            ? <img src={card.icon} className="w-full h-full object-contain" /> 
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
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Conclusion</h4>
                                        <textarea
                                            rows="2"
                                            placeholder="What is the final outcome of this service?"
                                            value={serviceFormData.conclusion}
                                            onChange={(e) => setServiceFormData({ ...serviceFormData, conclusion: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-brand-primary outline-none text-slate-800 leading-relaxed font-medium"
                                        />
                                    </section>
                                </div>

                                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-br-2xl">
                                    <button onClick={() => setIsServiceModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Abort Changes</button>
                                    <button onClick={handleSaveService} className="bg-brand-primary hover:bg-brand-dark text-white px-12 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-brand-primary/25">
                                        {editingServiceId ? "Update" : "Initialize Service Portfolio"}
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
                                <button onClick={() => setIsCardModalOpen(false)} className="p-1 text-slate-400 hover:text-black"><X size={20} /></button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Feature Icon (PNG)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 overflow-hidden p-2">
                                            {cardFormData.icon && (cardFormData.icon?.startsWith('data:image') || cardFormData.icon?.startsWith('/') || cardFormData.icon?.startsWith('http')) 
                                                ? <img src={cardFormData.icon} className="w-full h-full object-contain" /> 
                                                : (() => {
                                                    const CardFormIconComp = iconMap[cardFormData.icon] || Upload;
                                                    return <CardFormIconComp size={18} className="text-brand-primary" />;
                                                })()
                                            }
                                        </div>
                                        <input type="file" accept="image/png" onChange={handleCardIconUpload} className="flex-1 text-[10px] cursor-pointer" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Feature Title</label>
                                    <input
                                        type="text"
                                        value={cardFormData.title}
                                        onChange={(e) => setCardFormData({ ...cardFormData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Brief Description</label>
                                    <textarea
                                        rows="3"
                                        value={cardFormData.description}
                                        onChange={(e) => setCardFormData({ ...cardFormData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setIsCardModalOpen(false)} className="text-[11px] font-bold text-slate-500">Cancel</button>
                                <button onClick={handleSaveCard} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[11px] font-black shadow-lg">Confirm Item</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageServices;
