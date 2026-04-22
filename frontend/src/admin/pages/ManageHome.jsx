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
    Search, Filter, Sliders, CheckCircle2, HelpCircle,
    Move
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import axios from 'axios';
import { useContent } from '../../context/ContentContext';
import { useNotification } from '../context/NotificationContext';
import { API_BASE_URL } from '../../services/contentService';
import { AdminCard, FormInput, FormTextarea } from '../components/AdminUI';

const ManageHome = () => {
    const {
        heroSlides, setHeroSlides,
        aboutData, setAboutData,
        statsData, setStatsData,
        testimonials, setTestimonials,
        testimonialHeader, setTestimonialHeader,
        partners, setPartners,
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

    // 🕵️ HELPER: Resolve real computer photo paths from the backend (Port 5050)
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('/uploads/')) {
            return `http://localhost:5050${path}`;
        }
        return path;
    };

    // --- Action Handlers (The REAL Save Logic) ---
    const handleSave = async () => {
        try {
            setIsSaving(true);

            // 🛡️ 1. Save Hero Slides
            await axios.put(`${API_BASE_URL}/hero/bulk`, { slides: heroSlides });

            // 🛡️ 2. Save Stats Row
            await axios.put(`${API_BASE_URL}/stats/bulk`, { stats: statsData });

            // 🛡️ 3. Save About Us
            await axios.put(`${API_BASE_URL}/about`, aboutData);

            // 🛡️ 4. Save Testimonial Header & List
            await axios.put(`${API_BASE_URL}/testimonial-header`, testimonialHeader);
            await axios.put(`${API_BASE_URL}/testimonials/bulk`, { testimonials: testimonials });

            // 🛡️ 5. Save Partners
            await axios.put(`${API_BASE_URL}/partners/bulk`, { partners: partners });

            showNotification("Changes saved successfully!", 'success');
            await refreshContent();
        } catch (err) {
            console.error("Error saving to database", err);
            showNotification("ERROR: Failed to save changes. Please try again.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // --- 🕵️ THE COMPUTER UPLOAD GATEWAYS ---
    const handleFileUpload = async (file, onUploadSuccess) => {
        if (!validateFile(file)) return;

        try {
            setIsSaving(true);
            const formData = new FormData();
            formData.append('image', file);
            const response = await axios.post(`${API_BASE_URL.replace('/api/public', '')}/api/public/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                onUploadSuccess(response.data.url);
                // 🕵️ UI REFINEMENT: Removed the 'Success' alert to make the upload flow silent and professional.
            }
        } catch (err) {
            console.error("Asset Upload Protocol Error:", err);
            showNotification("The file could not be uploaded. Please try again.", 'error');
        } finally {
            setIsSaving(false);
        }
    };

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

    // 🕵️ NEW: Adjuster Intelligence States
    const [adjustingImage, setAdjustingImage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // 🛡️ ARCHITECTURAL GUARD: Ensure live data is established before empowering the editor
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-sm font-black tracking-widest uppercase">Establishing Total Digital Sync...</p>
            </div>
        );
    }

    const handleAboutImageUpload = (e, key) => {
        const file = e.target.files[0];
        if (!validateFile(file)) {
            e.target.value = '';
            return;
        }
        handleFileUpload(file, (url) => {
            setAboutData({ ...aboutData, [key]: url });
        });
    };

    const handleHeroImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!validateFile(file)) {
            e.target.value = '';
            return;
        }
        handleFileUpload(file, (url) => {
            setSlideFormData({ ...slideFormData, image: url });
            setHeroSlides(prev => prev.map(s =>
                s.id === slideFormData.id ? { ...s, image: url } : s
            ));
        });
    };


    const handleTestimonialAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!validateFile(file)) {
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setAdjustingImage(reader.result);
            setZoom(1);
            setPosition({ x: 0, y: 0 });
        };
        reader.readAsDataURL(file);
    };

    const handleConfirmAdjustment = async () => {
        if (!adjustingImage) return;

        // 🕵️ EXTRACTION: Canvas-based cropping to capture your adjustments
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = adjustingImage;

        img.onload = async () => {
            const size = 400; // Final resolution (Professional 400x400)
            canvas.width = size;
            canvas.height = size;

            // Calculate the aspect ratio and drawing dimensions
            const scale = Math.max(size / img.width, size / img.height) * zoom;
            const drawWidth = img.width * scale;
            const drawHeight = img.height * scale;

            // Center and apply position offsets
            const x = (size - drawWidth) / 2 + position.x;
            const y = (size - drawHeight) / 2 + position.y;

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, x, y, drawWidth, drawHeight);

            canvas.toBlob(async (blob) => {
                const file = new File([blob], "avatar-crop.jpg", { type: "image/jpeg" });
                await handleFileUpload(file, (url) => {
                    setTestimonialFormData({ ...testimonialFormData, avatar: url });
                    setAdjustingImage(null); // Close the lens
                });
            }, 'image/jpeg', 0.95);
        };
    };

    const handlePartnerLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!validateFile(file)) {
            e.target.value = '';
            return;
        }
        handleFileUpload(file, (url) => {
            setNewPartnerData({ ...newPartnerData, logo: url });
        });
    };

    const handleOpenEditSlide = (slide) => {
        setEditingSlide(slide.id);
        setSlideFormData({ ...slide });
        setIsAddSlideModalOpen(true);
    };

    const handleSaveSlide = () => {
        // 🕵️ INTEGRITY CHECK: All fields are mandatory for visual excellence
        if (!slideFormData.tag || !slideFormData.title || !slideFormData.subtitle || !slideFormData.image) {
            showNotification("Please fill in all fields before updating.", 'error');
            return;
        }

        if (editingSlide) {
            setHeroSlides(heroSlides.map(s => s.id === editingSlide ? { ...slideFormData } : s));
        } else {
            const newId = heroSlides.length > 0 ? Math.max(...heroSlides.map(s => s.id)) + 1 : 1;
            setHeroSlides([...heroSlides, { ...slideFormData, id: newId }]);
        }
        // Reset form for next slide
        setSlideFormData({ tag: "", title: "", subtitle: "", image: "", buttonText: "Learn More" });
        setIsAddSlideModalOpen(false);
    };

    const updateStatRow = (index, field, value) => {
        const newStats = [...statsData];
        newStats[index][field] = value;
        setStatsData(newStats);
    };

    // --- 🛡️ LOADING GUARD (REPOSITIONED TO AVOID HOOK CRASH) ---
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] w-full bg-white/50 backdrop-blur-sm rounded-[3rem]">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-brand-primary rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Syncing with Database...</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 animate-pulse">Fetching dynamic content</p>
            </div>
        );
    }

    const tabs = [
        { id: 'hero', label: 'Hero Slides' },
        { id: 'about', label: 'About Us' },
        { id: 'stats', label: 'Stats Row' },
        { id: 'testimonials', label: 'Testimonials' }
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
                                                    {slide.image ? <img src={getImageUrl(slide.image)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={18} /></div>}
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
                                                            src={getImageUrl(aboutData.topImage)}
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
                                                            src={getImageUrl(aboutData.mainImage)}
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
                                                        <img src={getImageUrl(stat.icon)} className="w-full h-full object-cover p-2" />
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
                                                            handleFileUpload(file, (url) => {
                                                                updateStatRow(index, 'icon', url);
                                                            });
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
                                                    {t.avatar ? <img src={getImageUrl(t.avatar)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={16} /></div>}
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
                                                            src={getImageUrl(testimonialHeader.sideImage)}
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
                                                    handleFileUpload(file, (url) => {
                                                        setTestimonialHeader({ ...testimonialHeader, sideImage: url });
                                                    });
                                                }} className="absolute inset-0 opacity-0 cursor-pointer" title="Update Image" />
                                            </div>
                                        </div>
                                    </div>
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
                                                <img src={getImageUrl(slideFormData.image)} className="w-full h-full object-cover" />
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
                                            handleFileUpload(file, (url) => {
                                                setSlideFormData({ ...slideFormData, image: url });
                                            });
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
                                        {!adjustingImage ? (
                                            <div className="relative w-28 h-28 rounded-full border-4 border-slate-50 shadow-xl overflow-hidden bg-slate-100 group mb-3">
                                                {testimonialFormData.avatar ? (
                                                    <img
                                                        src={getImageUrl(testimonialFormData.avatar)}
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
                                                    <input type="file" accept="image/*" onChange={handleTestimonialAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center w-full max-w-xs space-y-4">
                                                {/* 📸 THE VIEWFINDER (Mask) */}
                                                <div className="relative w-48 h-48 rounded-full border-4 border-slate-100 shadow-2xl overflow-hidden bg-white cursor-move group">
                                                    <div className="absolute inset-0 z-20 pointer-events-none border-4 border-white/20 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]" />

                                                    {/* 🕵️ DRAG HINT */}
                                                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                                        <Move size={32} className="text-white mb-2" />
                                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Drag to Position</span>
                                                    </div>

                                                    <motion.img
                                                        drag
                                                        onDrag={(e, info) => setPosition({ x: position.x + info.delta.x, y: position.y + info.delta.y })}
                                                        src={adjustingImage}
                                                        style={{
                                                            scale: zoom,
                                                            x: position.x,
                                                            y: position.y
                                                        }}
                                                        className="h-full w-full object-cover max-w-none"
                                                    />
                                                </div>

                                                {/* 🔍 THE CONTROLS */}
                                                <div className="w-full px-6 space-y-4">
                                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <span>Magnification</span>
                                                        <span className="text-slate-600">{Math.round((zoom - 1) * 100)}%</span>
                                                    </div>
                                                    <input
                                                        type="range" min="1" max="3" step="0.01" value={zoom}
                                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                                        className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-400"
                                                    />
                                                    <div className="flex gap-4 justify-center pt-2">
                                                        <button onClick={() => setAdjustingImage(null)} className="px-4 py-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all">Discard</button>
                                                        <button onClick={handleConfirmAdjustment} className="px-6 py-2 text-slate-800 font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Apply </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
                                <FormTextarea
                                    label="Detailed Feedback"
                                    placeholder="200 characters allowed including space, special characters"
                                    maxLength={200}
                                    rows={4}
                                    value={testimonialFormData.feedback}
                                    onChange={(e) => setTestimonialFormData({ ...testimonialFormData, feedback: e.target.value })}
                                />
                            </div>
                            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
                                <button onClick={() => setIsTestimonialModalOpen(false)} className="px-8 py-3.5 text-slate-500 font-black text-sm hover:text-slate-800 transition-all">Cancel</button>
                                <button onClick={() => {
                                    // 🕵️ INTEGRITY CHECK: Secure total brand maturity for feedback
                                    if (!testimonialFormData.name || !testimonialFormData.designation || !testimonialFormData.quote || !testimonialFormData.feedback || !testimonialFormData.avatar) {
                                        showNotification("Please fill in all fields before updating.", 'error');
                                        return;
                                    }

                                    if (editingTestimonial) {
                                        setTestimonials(testimonials.map(t => t.id === editingTestimonial ? { ...testimonialFormData, id: t.id } : t));
                                    } else {
                                        const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
                                        setTestimonials([...testimonials, { ...testimonialFormData, id: newId }]);
                                    }
                                    setTestimonialFormData({ name: "", designation: "", quote: "", feedback: "", avatar: "" }); // ✨ RESET FORM
                                    setIsTestimonialModalOpen(false);
                                }} className="px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200/40 hover:scale-105 active:scale-95 transition-all">
                                    Save Feedback
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}


            </AnimatePresence>
        </motion.div>
    );
};

export default ManageHome;
