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

/**
 * Code Walkthrough: ManageContact.jsx
 * 
 * Purpose: A management suite for the "Contact Us" section.
 * Features:
 * 1. Hero Management: Control the Contact header visuals and text.
 * 2. Info Section: Edit the "Get in Touch" header and contact methods (Email, Phone, Whatsapp, Socials).
 * 3. Branches CRUD: Full management of branch cards including location, type, contact details, and images.
 */
const ManageContact = () => {
    const { contactPageData, setContactPageData } = useContent();
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

    if (!contactPageData) return <div className="p-8 text-slate-400">Loading Contact Data...</div>;

    // === Global Handlers ===

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Contact content updated successfully!");
        }, 800);
    };

    const handleImageUpload = (e, path) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newData = { ...contactPageData };
                const pathParts = path.split('.');
                let current = newData;
                for (let i = 0; i < pathParts.length - 1; i++) {
                    current = current[pathParts[i]];
                }
                current[pathParts[pathParts.length - 1]] = reader.result;
                setContactPageData(newData);
            };
            reader.readAsDataURL(file);
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
        { id: 'hero', label: 'Hero Section', icon: LayoutGrid },
        { id: 'info', label: 'Get in Touch', icon: MessageSquare },
        { id: 'branches', label: 'Branches', icon: MapPin },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full space-y-6 pb-20"
        >
            {/* Header */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Contact Management</h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-brand-primary/20 flex items-center gap-2"
                >
                    <Save size={18} />
                    {isSaving ? 'Syncing...' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
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
                        <div className="flex items-center gap-2">
                            <tab.icon size={16} />
                            {tab.label}
                        </div>
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
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><LayoutGrid size={16} /></div>
                                            <h3 className="text-lg font-bold text-slate-800">Hero Section</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 block mb-1">Badge Tag</label>
                                                    <input
                                                        type="text"
                                                        value={contactPageData.hero.tag}
                                                        onChange={(e) => setContactPageData({ ...contactPageData, hero: { ...contactPageData.hero, tag: e.target.value } })}
                                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-600 block mb-1">Heading</label>
                                                    <input
                                                        type="text"
                                                        value={contactPageData.hero.title}
                                                        onChange={(e) => setContactPageData({ ...contactPageData, hero: { ...contactPageData.hero, title: e.target.value } })}
                                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-black"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Tagline</label>
                                                <textarea
                                                    rows="4"
                                                    value={contactPageData.hero.tagline}
                                                    onChange={(e) => setContactPageData({ ...contactPageData, hero: { ...contactPageData.hero, tagline: e.target.value } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Hero Background</h3>
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">Image Preview</span>
                                        </div>
                                        <div className="relative group overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3] flex items-center justify-center border border-slate-200 shadow-inner">
                                            <img
                                                src={contactPageData.hero.backgroundImage}
                                                className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                                                alt="Hero Preview"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                                <label className="cursor-pointer bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                                                    <ImageIcon size={14} /> Replace Background
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero.backgroundImage')} />
                                                </label>
                                            </div>
                                        </div>
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
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Text Content */}
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><MessageSquare size={16} /></div>
                                        <h3 className="text-lg font-bold text-slate-800">Heading & Description</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Badge Tag</label>
                                            <input
                                                type="text"
                                                value={contactPageData.info.tag}
                                                onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, tag: e.target.value } })}
                                                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Section Title</label>
                                            <input
                                                type="text"
                                                value={contactPageData.info.title}
                                                onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, title: e.target.value } })}
                                                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
                                            <textarea
                                                rows="3"
                                                value={contactPageData.info.description}
                                                onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, description: e.target.value } })}
                                                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone & Whatsapp */}
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Phone size={16} /></div>
                                        <h3 className="text-lg font-bold text-slate-800">Call & Support</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={contactPageData.info.phone.number}
                                                    onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, phone: { ...contactPageData.info.phone, number: e.target.value } } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Operating Hours</label>
                                                <textarea
                                                    rows="2"
                                                    value={contactPageData.info.phone.hours}
                                                    onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, phone: { ...contactPageData.info.phone, hours: e.target.value } } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Whatsapp Number</label>
                                                <input
                                                    type="text"
                                                    value={contactPageData.info.whatsapp.number}
                                                    onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, whatsapp: { ...contactPageData.info.whatsapp, number: e.target.value } } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Support Label</label>
                                                <input
                                                    type="text"
                                                    value={contactPageData.info.whatsapp.label}
                                                    onChange={(e) => setContactPageData({ ...contactPageData, info: { ...contactPageData.info, whatsapp: { ...contactPageData.info.whatsapp, label: e.target.value } } })}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Emails */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center"><Mail size={16} /></div>
                                        <h3 className="text-lg font-bold text-slate-800">Email Addresses</h3>
                                    </div>
                                    <button 
                                        onClick={() => setContactPageData({
                                            ...contactPageData,
                                            info: {
                                                ...contactPageData.info,
                                                emails: [...contactPageData.info.emails, { id: Date.now(), label: "New Email", value: "info@amyntortech.com" }]
                                            }
                                        })}
                                        className="text-[10px] font-bold text-brand-primary bg-white border border-brand-primary/20 px-3 py-1.5 rounded-lg hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest"
                                    >
                                        + Add email department
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {contactPageData.info.emails.map((email, idx) => (
                                        <div key={email.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                                            <div className="flex-grow grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={email.label}
                                                    onChange={(e) => {
                                                        const newEmails = [...contactPageData.info.emails];
                                                        newEmails[idx].label = e.target.value;
                                                        setContactPageData({ ...contactPageData, info: { ...contactPageData.info, emails: newEmails } });
                                                    }}
                                                    className="border-none bg-slate-50 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                                                />
                                                <input
                                                    type="text"
                                                    value={email.value}
                                                    onChange={(e) => {
                                                        const newEmails = [...contactPageData.info.emails];
                                                        newEmails[idx].value = e.target.value;
                                                        setContactPageData({ ...contactPageData, info: { ...contactPageData.info, emails: newEmails } });
                                                    }}
                                                    className="border-none bg-slate-50 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 outline-none focus:ring-2 focus:ring-brand-primary transition-all"
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
                                                className="p-1 px-2 text-slate-300 hover:text-rose-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Google Maps URL */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><MapPin size={16} /></div>
                                    <h3 className="text-lg font-bold text-slate-800">Google Maps Location</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-xs font-bold text-slate-600">Maps Embed URL</label>
                                        <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1">
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
                                        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs outline-none focus:ring-2 focus:ring-brand-primary transition-all font-medium text-slate-600"
                                    />
                                    <p className="text-[10px] text-slate-400 italic px-1">
                                        Note: Only paste the URL inside the 'src' attribute of the Google Maps embed code.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'branches' && (
                        <motion.div
                            key="branches"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-8"
                        >
                            {/* Section Header Editor */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><MapPin size={16} /></div>
                                    <h3 className="text-lg font-bold text-slate-800">Branch Section Header</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Badge Tag</label>
                                        <input
                                            type="text"
                                            value={contactPageData.branches.tag}
                                            onChange={(e) => setContactPageData({ ...contactPageData, branches: { ...contactPageData.branches, tag: e.target.value } })}
                                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Section Title</label>
                                        <input
                                            type="text"
                                            value={contactPageData.branches.title}
                                            onChange={(e) => setContactPageData({ ...contactPageData, branches: { ...contactPageData.branches, title: e.target.value } })}
                                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none font-black"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={contactPageData.branches.description}
                                        onChange={(e) => setContactPageData({ ...contactPageData, branches: { ...contactPageData.branches, description: e.target.value } })}
                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none leading-relaxed"
                                    />
                                </div>
                            </div>

                            {/* Branches List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Branch Offices</h3>
                                    <button 
                                        onClick={handleOpenAddBranch}
                                        className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
                                    >
                                        <Plus size={16} /> Add New Branch
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {contactPageData.branches.cards.map((branch, idx) => (
                                        <div key={branch.id || idx} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-primary/10">
                                                    <img src={branch.image} className="w-full h-full object-cover" alt={branch.city} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{branch.city}</h4>
                                                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{branch.type}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-start gap-2">
                                                    <MapPin size={12} className="text-slate-300 mt-1 shrink-0" />
                                                    <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{branch.address}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={12} className="text-slate-300 shrink-0" />
                                                    <p className="text-[11px] text-slate-500">{branch.phone}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail size={12} className="text-slate-300 shrink-0" />
                                                    <p className="text-[11px] text-slate-500">{branch.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50">
                                                <button onClick={() => handleOpenEditBranch(branch, idx)} className="p-2 text-slate-400 hover:text-brand-primary bg-slate-50 rounded-lg transition-all"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDeleteBranch(idx)} className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* BRANCH MODAL */}
            <AnimatePresence>
                {isBranchModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {editingBranchIdx !== null ? "Edit Branch" : "Add New Branch"}
                                    </h3>
                                    <p className="text-slate-400 text-xs font-medium mt-0.5">Define location details and contact information.</p>
                                </div>
                                <button onClick={() => setIsBranchModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 transition-all focus:rotate-90"><X size={20}/></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/20">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-1">
                                        <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">City / Location</label>
                                        <input
                                            type="text"
                                            value={branchFormData.city}
                                            onChange={(e) => setBranchFormData({...branchFormData, city: e.target.value})}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Branch Type</label>
                                        <input
                                            type="text"
                                            value={branchFormData.type}
                                            onChange={(e) => setBranchFormData({...branchFormData, type: e.target.value})}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Address</label>
                                    <textarea
                                        rows="3"
                                        value={branchFormData.address}
                                        onChange={(e) => setBranchFormData({...branchFormData, address: e.target.value})}
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Phone</label>
                                        <input
                                            type="text"
                                            value={branchFormData.phone}
                                            onChange={(e) => setBranchFormData({...branchFormData, phone: e.target.value})}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            value={branchFormData.email}
                                            onChange={(e) => setBranchFormData({...branchFormData, email: e.target.value})}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-brand-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-600 ml-1 block mb-1.5">Location Image</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                                            {branchFormData.image ? (
                                                <img src={branchFormData.image} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={24} /></div>
                                            )}
                                        </div>
                                        <label className="cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-black transition-all">
                                            Upload Image
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*" 
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setBranchFormData({...branchFormData, image: reader.result});
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} 
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setIsBranchModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest">Cancel</button>
                                <button 
                                    onClick={handleSaveBranch} 
                                    className="bg-brand-primary hover:bg-brand-dark text-white px-10 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    {editingBranchIdx !== null ? "Update Branch" : "Add Branch"}
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
