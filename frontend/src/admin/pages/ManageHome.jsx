/**
 * Code Walkthrough: ManageHome.jsx (Clean & Simple Redesign)
 * 
 * Purpose: A premium, uncluttered dashboard for the Amyntor Tech Home Page.
 * It uses a modular, tabbed interface to manage:
 * 1. Hero Slides (Compact list + Modal editing)
 * 2. About Section (2-column layout for text and media)
 * 3. Stats Matrix (Grid of 3 cards for key metrics)
 * 4. Testimonials (Compact list + modal-driven feedback management)
 * 5. Partners (Logo grid with quick-action removals)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, Plus, Trash2, Image as ImageIcon, Type, X,
    Edit3, LayoutDashboard, Briefcase, Mail, Globe,
    ChevronRight, ArrowRight, Star, ExternalLink,
    Search, Filter, Sliders, CheckCircle2, HelpCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { AdminCard, FormInput, FormTextarea } from '../components/AdminUI';

const ManageHome = () => {
    const {
        heroSlides, setHeroSlides,
        aboutData, setAboutData,
        statsData, setStatsData,
        testimonials, setTestimonials,
        testimonialHeader, setTestimonialHeader,
        partners, setPartners
    } = useContent();

    const [activeTab, setActiveTab] = useState('hero');
    const [isSaving, setIsSaving] = useState(false);

    // Modal & Editor States
    const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [slideFormData, setSlideFormData] = useState({
        tag: "", title: "", subtitle: "", image: "", buttonText: "Learn More"
    });

    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [testimonialFormData, setTestimonialFormData] = useState({
        name: "", designation: "", quote: "", feedback: "", avatar: ""
    });

    const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
    const [newPartnerData, setNewPartnerData] = useState({ name: "", logo: "" });

    // --- Action Handlers ---
    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    const handleAboutImageUpload = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAboutData({ ...aboutData, [key]: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleOpenEditSlide = (slide) => {
        setEditingSlide(slide.id);
        setSlideFormData({ ...slide });
        setIsAddSlideModalOpen(true);
    };

    const handleSaveSlide = () => {
        if (editingSlide) {
            setHeroSlides(heroSlides.map(s => s.id === editingSlide ? { ...slideFormData } : s));
        } else {
            const newId = heroSlides.length > 0 ? Math.max(...heroSlides.map(s => s.id)) + 1 : 1;
            setHeroSlides([...heroSlides, { ...slideFormData, id: newId }]);
        }
        setIsAddSlideModalOpen(false);
    };

    const updateStatRow = (index, field, value) => {
        const newStats = [...statsData];
        newStats[index][field] = value;
        setStatsData(newStats);
    };

    const tabs = [
        { id: 'hero', label: 'Hero Slides' },
        { id: 'about', label: 'About Us' },
        { id: 'stats', label: 'Stats Row' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'partners', label: 'Partners' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full space-y-6 pb-20">
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
                    {/* TAB: HERO SLIDER */}
                    {activeTab === 'hero' && (
                        <motion.div key="hero" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <AdminCard
                                title="Hero Banner"

                                actions={
                                    <button
                                        onClick={() => {
                                            setEditingSlide(null);
                                            setSlideFormData({ tag: "NEW SLIDE", title: "", subtitle: "", image: "", buttonText: "Learn More" });
                                            setIsAddSlideModalOpen(true);
                                        }}
                                        className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                            Add New Slide
                                        </span>
                                    </button>
                                }
                            >
                                <div className="space-y-3">
                                    {heroSlides.map((slide) => (
                                        <div key={slide.id} className="group flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                                                    {slide.image ? <img src={slide.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={18} /></div>}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{slide.tag || 'Slide'}</span>
                                                    <h4 className="text-[15px] font-black text-slate-800 leading-tight line-clamp-1">{slide.title || 'Untitled'}</h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleOpenEditSlide(slide)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-brand-primary hover:border-brand-primary/20 shadow-sm transition-all"><Edit3 size={16} /></button>
                                                <button onClick={() => setHeroSlides(heroSlides.filter(s => s.id !== slide.id))} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 shadow-sm transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}

                    {/* TAB: ABOUT SECTION */}
                    {activeTab === 'about' && (
                        <motion.div key="about" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <AdminCard title="About Us Section" >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    <div className="lg:col-span-12 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput label=" Tag" value={aboutData.tag} onChange={(e) => setAboutData({ ...aboutData, tag: e.target.value })} />
                                            <FormInput label="Main Heading" value={aboutData.title} onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })} />
                                        </div>
                                        <FormTextarea label="Company Description" rows={6} value={aboutData.description} onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })} />
                                    </div>
                                    <div className="lg:col-span-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] space-y-6">
                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Experience Badge</h5>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput label="Years/Value" value={aboutData.leftCardValue} onChange={(e) => setAboutData({ ...aboutData, leftCardValue: e.target.value })} />
                                            <FormInput label="Subtitle" value={aboutData.leftCardText} onChange={(e) => setAboutData({ ...aboutData, leftCardText: e.target.value })} />
                                        </div>
                                        <FormInput label="Badge Description" value={aboutData.leftCardDescription} onChange={(e) => setAboutData({ ...aboutData, leftCardDescription: e.target.value })} />
                                    </div>
                                    <div className="lg:col-span-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] space-y-6">
                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Engagement Action</h5>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput label="Button Label" value={aboutData.ctaText} onChange={(e) => setAboutData({ ...aboutData, ctaText: e.target.value })} />
                                            <FormInput label="Button Link" value={aboutData.ctaLink} onChange={(e) => setAboutData({ ...aboutData, ctaLink: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 text-slate-800">
                                        <div className="space-y-4">
                                            <div className="flex flex-col ml-1">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">About Image 1 (Landscape)</label>
                                                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">Recommended: 1280 x 720 PX</span>
                                            </div>
                                            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50/50 group hover:border-brand-primary/40 hover:bg-white transition-all duration-500 flex items-center justify-center shadow-inner">
                                                {aboutData.topImage ? (
                                                    <div className="relative w-full h-full group">
                                                        <img
                                                            src={aboutData.topImage}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white text-center p-4">
                                                            <ImageIcon size={28} className="mb-2" />
                                                            <p className="text-[10px] font-black uppercase tracking-widest">Change Media</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                                        <div className="mx-auto w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 mb-3 group-hover:text-brand-primary transition-colors"><ImageIcon size={28} /></div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Landscape Media</p>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={(e) => handleAboutImageUpload(e, 'topImage')} className="absolute inset-0 opacity-0 cursor-pointer" title="Update Image 1" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex flex-col ml-1">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">About Image 2 (Portrait)</label>
                                                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">Recommended: 1080 x 1350 PX</span>
                                            </div>
                                            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50/50 group hover:border-brand-primary/40 hover:bg-white transition-all duration-500 flex items-center justify-center shadow-inner">
                                                {aboutData.mainImage ? (
                                                    <div className="relative w-full h-full group">
                                                        <img
                                                            src={aboutData.mainImage}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white text-center p-4">
                                                            <ImageIcon size={28} className="mb-2" />
                                                            <p className="text-[10px] font-black uppercase tracking-widest">Change Media</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                                        <div className="mx-auto w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 mb-3 group-hover:text-brand-primary transition-colors"><ImageIcon size={28} /></div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Portrait Media</p>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={(e) => handleAboutImageUpload(e, 'mainImage')} className="absolute inset-0 opacity-0 cursor-pointer" title="Update Image 2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}

                    {/* TAB: STATS ROW */}
                    {activeTab === 'stats' && (
                        <motion.div key="stats" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <AdminCard title="Performance Statistics Matrix" >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {statsData.map((stat, index) => (
                                        <div key={stat.id} className="relative p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] space-y-4 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                                            <div className="flex justify-between items-start">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-brand-primary overflow-hidden">
                                                    {stat.icon && (stat.icon.startsWith('data:image') || stat.icon.startsWith('http') || stat.icon.startsWith('/')) ? (
                                                        <img src={stat.icon} className="w-full h-full object-cover p-2" />
                                                    ) : (
                                                        <div className="p-2">{React.createElement(LucideIcons[stat.icon] || HelpCircle, { size: 22 })}</div>
                                                    )}
                                                </div>
                                                <div className="relative shrink-0">
                                                    <div className="p-2 text-slate-300 hover:text-brand-primary transition-colors cursor-pointer"><ImageIcon size={16} /></div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => updateStatRow(index, 'icon', reader.result);
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <FormInput label="Label" value={stat.title} onChange={(e) => updateStatRow(index, 'title', e.target.value)} />
                                                <FormInput label="Metric Value" value={stat.value} onChange={(e) => updateStatRow(index, 'value', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}

                    {/* TAB: TESTIMONIALS */}
                    {activeTab === 'testimonials' && (
                        <motion.div key="testimonials" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <AdminCard
                                title="Client Feedback Section"

                                actions={
                                    <button
                                        onClick={() => {
                                            setEditingTestimonial(null);
                                            setTestimonialFormData({ name: "", designation: "", quote: "", feedback: "", avatar: "" });
                                            setIsTestimonialModalOpen(true);
                                        }}
                                        className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                            Add Feedback
                                        </span>
                                    </button>
                                }
                            >
                                <div className="mb-8 p-6 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput label=" Tag" value={testimonialHeader.tag} onChange={(e) => setTestimonialHeader({ ...testimonialHeader, tag: e.target.value })} />
                                    <FormInput label="Main Header" value={testimonialHeader.title} onChange={(e) => setTestimonialHeader({ ...testimonialHeader, title: e.target.value })} />
                                </div>
                                <div className="space-y-3 mb-8">
                                    {testimonials.map(t => (
                                        <div key={t.id} className="group flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-200 shrink-0">
                                                    {t.avatar ? <img src={t.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={16} /></div>}
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-black text-slate-800">{t.name}</h4>
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.designation}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => {
                                                    setEditingTestimonial(t.id);
                                                    setTestimonialFormData({ ...t });
                                                    setIsTestimonialModalOpen(true);
                                                }} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-brand-primary hover:border-brand-primary/20 shadow-sm transition-all"><Edit3 size={16} /></button>
                                                <button onClick={() => setTestimonials(testimonials.filter(item => item.id !== t.id))} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 shadow-sm transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2.5rem]">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Status Background Card</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                        <div className="space-y-6">
                                            <FormInput label="Stat Value" value={testimonialHeader.statValue || ''} onChange={(e) => setTestimonialHeader({ ...testimonialHeader, statValue: e.target.value })} placeholder="e.g. 97% Customers" />
                                            <FormInput label="Stat Label" value={testimonialHeader.statText || ''} onChange={(e) => setTestimonialHeader({ ...testimonialHeader, statText: e.target.value })} placeholder="e.g. Satisfaction Rate" />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Card Background Image</label>
                                            <div className="relative aspect-[3/4] max-w-[200px] rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 bg-white group hover:border-brand-primary/40 transition-all duration-500 flex items-center justify-center shadow-inner">
                                                {testimonialHeader.sideImage ? (
                                                    <div className="relative w-full h-full group">
                                                        <img
                                                            src={testimonialHeader.sideImage}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white text-center p-4">
                                                            <ImageIcon size={28} className="mb-2" />
                                                            <p className="text-[10px] font-black uppercase tracking-widest">Change Media</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                                        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-center text-slate-300 mb-2 group-hover:text-brand-primary transition-colors"><ImageIcon size={24} /></div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Image</p>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setTestimonialHeader({ ...testimonialHeader, sideImage: reader.result });
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} className="absolute inset-0 opacity-0 cursor-pointer" title="Update Image" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}

                    {/* TAB: PARTNERS */}
                    {activeTab === 'partners' && (
                        <motion.div key="partners" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <AdminCard
                                title=" Partners section"

                                actions={
                                    <button
                                        onClick={() => setIsAddPartnerModalOpen(true)}
                                        className="group relative flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-[13px] font-black transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 overflow-hidden"
                                    >
                                        <Plus size={16} strokeWidth={3} className="text-brand-primary group-hover:scale-110 transition-transform" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                                            Add Partner
                                        </span>
                                    </button>
                                }
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {partners.map((p) => (
                                        <div key={p.id} className="relative group aspect-video bg-slate-50 border border-slate-100 rounded-3xl p-6 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all">
                                            <button
                                                onClick={() => setPartners(partners.filter(item => item.id !== p.id))}
                                                className="absolute -top-2 -right-2 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
                                            >
                                                <Trash2 size={14} strokeWidth={3} />
                                            </button>
                                            <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </AdminCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {/* Hero Slide Modal */}
                {isAddSlideModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddSlideModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden text-slate-800">
                            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-black tracking-tight">{editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}</h3>
                                <button onClick={() => setIsAddSlideModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all active:scale-95"><X size={20} strokeWidth={3} /></button>
                            </div>
                            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-6">
                                    <FormInput label="Tag" value={slideFormData.tag} onChange={(e) => setSlideFormData({ ...slideFormData, tag: e.target.value })} placeholder="e.g. CYBERSECURITY" />
                                    <FormInput label="Button Label" value={slideFormData.buttonText} onChange={(e) => setSlideFormData({ ...slideFormData, buttonText: e.target.value })} />
                                </div>
                                <FormInput label="Main Heading" value={slideFormData.title} onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })} />
                                <FormTextarea label=" Description" value={slideFormData.subtitle} onChange={(e) => setSlideFormData({ ...slideFormData, subtitle: e.target.value })} />
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[14px] font-bold text-slate-500">Hero Background Media</label>
                                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-tighter">Recommended: 1920 x 1080 PX</span>
                                    </div>
                                    <div className="relative aspect-video rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 group hover:border-brand-primary/30 transition-all flex items-center justify-center">
                                        {slideFormData.image ? (
                                            <>
                                                <img src={slideFormData.image} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white pointer-events-none">
                                                    <ImageIcon size={28} className="mb-2" />
                                                    <p className="text-[11px] font-black uppercase tracking-widest">Change Media</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <div className="mx-auto w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 mb-2"><ImageIcon size={24} /></div>
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Click to Upload Media</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setSlideFormData({ ...slideFormData, image: reader.result });
                                                reader.readAsDataURL(file);
                                            }
                                        }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
                                <button onClick={() => setIsAddSlideModalOpen(false)} className="px-8 py-3.5 text-slate-500 font-black text-sm hover:text-slate-800 transition-all">Discard </button>
                                <button onClick={handleSaveSlide} className="px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200/40 hover:scale-105 active:scale-95 transition-all">
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Testimonial Modal */}
                {isTestimonialModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTestimonialModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden text-slate-800">
                            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-black tracking-tight">{editingTestimonial ? 'Edit Testimonial' : 'New Client Feedback'}</h3>
                                <button onClick={() => setIsTestimonialModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all active:scale-95"><X size={20} strokeWidth={3} /></button>
                            </div>
                            <div className="p-10 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-28 h-28 rounded-full border-4 border-slate-50 shadow-xl overflow-hidden bg-slate-100 group mb-3">
                                            {testimonialFormData.avatar ? (
                                                <img
                                                    src={testimonialFormData.avatar}
                                                    className="w-full h-full object-cover transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                                                <ImageIcon size={24} className="mb-2" />
                                                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Change Media</p>
                                                <input type="file" accept="image/*" onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setTestimonialFormData({ ...testimonialFormData, avatar: reader.result });
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-tighter">Recommended: 400 x 400 PX</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <FormInput label="Full Name" value={testimonialFormData.name} onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })} />
                                    <FormInput label="Designation" value={testimonialFormData.designation} onChange={(e) => setTestimonialFormData({ ...testimonialFormData, designation: e.target.value })} />
                                </div>
                                <FormInput label="Headline / Quote" value={testimonialFormData.quote} onChange={(e) => setTestimonialFormData({ ...testimonialFormData, quote: e.target.value })} />
                                <FormTextarea label="Detailed Feedback" rows={4} value={testimonialFormData.feedback} onChange={(e) => setTestimonialFormData({ ...testimonialFormData, feedback: e.target.value })} />
                            </div>
                            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
                                <button onClick={() => setIsTestimonialModalOpen(false)} className="px-8 py-3.5 text-slate-500 font-black text-sm hover:text-slate-800 transition-all">Cancel</button>
                                <button onClick={() => {
                                    if (editingTestimonial) {
                                        setTestimonials(testimonials.map(t => t.id === editingTestimonial ? { ...testimonialFormData, id: t.id } : t));
                                    } else {
                                        const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
                                        setTestimonials([...testimonials, { ...testimonialFormData, id: newId }]);
                                    }
                                    setIsTestimonialModalOpen(false);
                                }} className="px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200/40 hover:scale-105 active:scale-95 transition-all">
                                    Save Feedback
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Add Partner Modal */}
                {isAddPartnerModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddPartnerModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden">
                            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">New Strategic Partner</h3>
                                <button onClick={() => setIsAddPartnerModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm hover:shadow-md transition-all active:scale-95"><X size={20} strokeWidth={3} /></button>
                            </div>
                            <div className="p-10 space-y-8">
                                <FormInput label="Company Name" value={newPartnerData.name} onChange={(e) => setNewPartnerData({ ...newPartnerData, name: e.target.value })} />
                                <div className="space-y-3">
                                    <label className="text-[14px] font-bold text-slate-500 ml-1">Company Logo</label>
                                    <div className="relative aspect-video rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group shadow-inner">
                                        {newPartnerData.logo ? (
                                            <>
                                                <img src={newPartnerData.logo} className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white pointer-events-none">
                                                    <ImageIcon size={28} className="mb-2" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">Change Media</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <ImageIcon size={32} className="text-slate-300 mb-2" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Logo</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => setNewPartnerData({ ...newPartnerData, logo: reader.result });
                                                reader.readAsDataURL(file);
                                            }
                                        }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">SVG or Transparent PNG preferred</p>
                                </div>
                            </div>
                            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-3">
                                <button onClick={() => {
                                    if (!newPartnerData.name || !newPartnerData.logo) return;
                                    const newId = partners.length > 0 ? Math.max(...partners.map(p => p.id)) + 1 : 1;
                                    setPartners([...partners, { ...newPartnerData, id: newId }]);
                                    setIsAddPartnerModalOpen(false);
                                }} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200/40 hover:scale-105 active:scale-95 transition-all">
                                    Confirm
                                </button>
                                <button onClick={() => setIsAddPartnerModalOpen(false)} className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageHome;
