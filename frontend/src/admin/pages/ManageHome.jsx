import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Image, Type, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const AVAILABLE_ICONS = [
    'Users', 'Briefcase', 'Award', 'Shield', 'Server', 'Cloud',
    'Lock', 'Globe', 'Zap', 'Activity', 'TrendingUp', 'CheckCircle2'
];

/**
 * Developer Narrative: ManageHome.jsx & Partner Logo Deletion
 * 
 * Purpose: This tabbed interface manages the high-density sections of the Home Page.
 * It directly reads and mutates the central `ContentContext`.
 * 
 * State Synchronization (e.g., Partners Deletion):
 * When an admin clicks the "Delete" trash icon on a Partner logo row:
 * 1. The `handleDeletePartner(id)` function fires.
 * 2. It filters out the partner with that ID from the local `partners` array inside `ContentContext`.
 * 3. The React lifecycle immediately triggers a re-render across the entire React Developer Tree.
 * 4. The `PartnersSection.jsx` on the public frontend, which is subscribed to `ContentContext` via the `useContent()` hook, receives the new underlying array missing the deleted logo.
 * 5. Framer Motion running the infinite logo loop automatically visually repaints the animation track without the deleted item, causing it to disappear from the public slider seamlessly and instantly.
 * 
 * Safety: The UI strictly follows the White Glass motif and modifies NO public rendering components, solely acting as the data provider.
 */

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

    // Modal State
    const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false);
    const [newSlideData, setNewSlideData] = useState({
        tag: "NEW SLIDE",
        title: "New Headline",
        subtitle: "New Subheadline text.",
        image: "",
        buttonText: "Learn More"
    });

    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [testimonialFormData, setTestimonialFormData] = useState({
        name: "", designation: "", quote: "", feedback: "", avatar: ""
    });

    const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
    const [newPartnerData, setNewPartnerData] = useState({
        name: "",
        logo: ""
    });

    // Mock Save Action
    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Changes saved and synced to the live site successfully.");
        }, 800);
    };

    const handleAboutImageUpload = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAboutData({ ...aboutData, [key]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // === Handlers for nested array updates ===
    const updateHeroSlide = (index, field, value) => {
        const newSlides = [...heroSlides];
        newSlides[index][field] = value;
        setHeroSlides(newSlides);
    };

    const handleAddHeroSlideClick = () => {
        setNewSlideData({
            tag: "NEW SLIDE",
            title: "New Headline",
            subtitle: "New Subheadline text.",
            image: "",
            buttonText: "Learn More"
        });
        setIsAddSlideModalOpen(true);
    };

    const handleConfirmAddSlide = () => {
        const newId = heroSlides.length > 0 ? Math.max(...heroSlides.map(s => s.id)) + 1 : 1;
        setHeroSlides([
            ...heroSlides,
            { ...newSlideData, id: newId }
        ]);
        setIsAddSlideModalOpen(false);
    };

    const handleCancelAddSlide = () => {
        setIsAddSlideModalOpen(false);
    };

    const handleDeleteHeroSlide = (id) => {
        if (window.confirm('Are you sure you want to delete this slide?')) {
            setHeroSlides(heroSlides.filter(s => s.id !== id));
        }
    };

    const updateStatRow = (index, field, value) => {
        const newStats = [...statsData];
        newStats[index][field] = value;
        setStatsData(newStats);
    };

    const handleDeleteTestimonial = (id) => {
        if (window.confirm('Delete this testimonial?')) {
            setTestimonials(testimonials.filter(t => t.id !== id));
        }
    };

    const handleOpenAddTestimonial = () => {
        setEditingTestimonial(null);
        setTestimonialFormData({ name: "", designation: "", quote: "", feedback: "", avatar: "" });
        setIsTestimonialModalOpen(true);
    };

    const handleOpenEditTestimonial = (testimonial) => {
        setEditingTestimonial(testimonial.id);
        setTestimonialFormData({ ...testimonial });
        setIsTestimonialModalOpen(true);
    };

    const handleSaveTestimonial = () => {
        if (editingTestimonial) {
            setTestimonials(testimonials.map(t => t.id === editingTestimonial ? { ...testimonialFormData, id: t.id } : t));
        } else {
            const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
            setTestimonials([...testimonials, { ...testimonialFormData, id: newId }]);
        }
        setIsTestimonialModalOpen(false);
    };

    const handleTestimonialImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTestimonialFormData({ ...testimonialFormData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeletePartner = (id) => {
        if (window.confirm('Delete this partner logo and immediately remove it from the public slider?')) {
            setPartners(partners.filter(p => p.id !== id));
        }
    };

    const handleOpenAddPartner = () => {
        setNewPartnerData({ name: "", logo: "" });
        setIsAddPartnerModalOpen(true);
    };

    const handleConfirmAddPartner = () => {
        if (!newPartnerData.name || !newPartnerData.logo) {
            alert("Please provide both a name and a logo image.");
            return;
        }
        const newId = partners.length > 0 ? Math.max(...partners.map(p => p.id)) + 1 : 1;
        setPartners([...partners, { ...newPartnerData, id: newId }]);
        setIsAddPartnerModalOpen(false);
    };

    const handlePartnerLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPartnerData({ ...newPartnerData, logo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'hero', label: 'Hero Slider' },
        { id: 'about', label: 'About Section' },
        { id: 'stats', label: 'Stats Row' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'partners', label: 'Partners' },
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
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Home Page </h1>
                    {/* <p className="text-sm font-medium text-slate-500 mt-1">Manage Home page.</p> */}
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

            {/* Content Area - White Glass Shell */}
            <div className="bg-white border border-slate-200/60 rounded-b-[2rem] rounded-tr-[2rem] shadow-sm p-8 min-h-[500px]">
                <AnimatePresence mode="wait">

                    {/* TAB: HERO SLIDER */}
                    {activeTab === 'hero' && (
                        <motion.div key="hero" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Image size={18} className="text-brand-primary" /> Slides</h3>
                                <button onClick={handleAddHeroSlideClick} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors"><Plus size={14} /> Add Slide</button>
                            </div>
                            <div className="space-y-8">
                                {heroSlides.map((slide, index) => (
                                    <div key={slide.id} className="relative p-6 bg-slate-50 border border-slate-200 rounded-2xl group">
                                        <button
                                            onClick={() => handleDeleteHeroSlide(slide.id)}
                                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Slide"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <h4 className="font-bold text-slate-700 mb-4 whitespace-nowrap overflow-hidden text-ellipsis mr-10">Slide {index + 1}: {slide.title}</h4>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Top Tag</label>
                                                <input type="text" value={slide.tag} onChange={(e) => updateHeroSlide(index, 'tag', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Button Text</label>
                                                <input type="text" value={slide.buttonText} onChange={(e) => updateHeroSlide(index, 'buttonText', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary" />
                                            </div>
                                            <div className="lg:col-span-2">
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Slide Background Image</label>
                                                <div className="flex items-center gap-4">
                                                    {slide.image && (
                                                        <img src={slide.image} alt="Preview" className="h-10 w-16 object-cover rounded border border-slate-200 bg-slate-100 shrink-0" />
                                                    )}
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg, image/png, image/jpg"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const file = e.target.files[0];
                                                                    const imageUrl = URL.createObjectURL(file);
                                                                    updateHeroSlide(index, 'image', imageUrl);
                                                                }
                                                            }}
                                                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-brand-primary file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 transition-colors cursor-pointer text-slate-500"
                                                        />
                                                        <p className="text-[10px] text-slate-500 mt-1">Recommended: Use high-quality JPG/PNG images.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-2">
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Headline</label>
                                                <input type="text" value={slide.title} onChange={(e) => updateHeroSlide(index, 'title', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary font-bold" />
                                            </div>
                                            <div className="lg:col-span-2">
                                                <label className="text-xs font-bold text-slate-600 block mb-1">Subheadline</label>
                                                <textarea rows="2" value={slide.subtitle} onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary resize-none" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: ABOUT SECTION */}
                    {activeTab === 'about' && (
                        <motion.div key="about" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Type size={18} className="text-brand-primary" /> About Us section</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4 lg:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Top Tag</label>
                                            <input type="text" value={aboutData.tag || ''} onChange={(e) => setAboutData({ ...aboutData, tag: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-primary font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Main Heading</label>
                                            <input type="text" value={aboutData.title} onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-primary font-bold" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Body Paragraph</label>
                                        <textarea rows="6" value={aboutData.description} onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-primary leading-relaxed" />
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                                    <h5 className="font-bold text-sm text-slate-700">Stat cards</h5>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Stat Card Number</label>
                                            <input type="text" value={aboutData.leftCardValue} onChange={(e) => setAboutData({ ...aboutData, leftCardValue: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary font-mono" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Stat Card Label</label>
                                            <input type="text" value={aboutData.leftCardText} onChange={(e) => setAboutData({ ...aboutData, leftCardText: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Small Description Text</label>
                                        <input type="text" value={aboutData.leftCardDescription || ''} onChange={(e) => setAboutData({ ...aboutData, leftCardDescription: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary" placeholder="e.g. We serve businesses of all sizes around the world" />
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                                    <h5 className="font-bold text-sm text-slate-700">Call To Action</h5>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Button Text</label>
                                        <input type="text" value={aboutData.ctaText} onChange={(e) => setAboutData({ ...aboutData, ctaText: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Route Path</label>
                                        <input type="text" value={aboutData.ctaLink} onChange={(e) => setAboutData({ ...aboutData, ctaLink: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary font-mono text-slate-500" />
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4 lg:col-span-2">
                                    <h5 className="font-bold text-sm text-slate-700">Images Setup</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Top Image Upload (Horizontal)</label>
                                            {aboutData.topImage && (
                                                <img src={aboutData.topImage} alt="Top Preview" className="h-20 w-auto object-cover rounded border border-slate-200 mb-2 shadow-sm" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleAboutImageUpload(e, 'topImage')}
                                                className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-brand-primary text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-600 block mb-1">Main Image Upload (Vertical)</label>
                                            {aboutData.mainImage && (
                                                <img src={aboutData.mainImage} alt="Main Preview" className="h-20 w-auto object-cover rounded border border-slate-200 mb-2 shadow-sm" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleAboutImageUpload(e, 'mainImage')}
                                                className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-brand-primary text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: STATS ROW */}
                    {activeTab === 'stats' && (
                        <motion.div key="stats" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Manage Statistics Matrix</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {statsData.map((stat, index) => (
                                    <div key={stat.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Upload Icon Image</label>
                                            <div className="flex flex-col gap-2">
                                                {stat.icon && (stat.icon.startsWith('data:image') || stat.icon.startsWith('http') || stat.icon.startsWith('/')) ? (
                                                    <img src={stat.icon} alt="Icon Preview" className="h-10 w-10 object-contain rounded bg-slate-100 p-1 border border-slate-200" />
                                                ) : stat.icon ? (
                                                    <div className="h-10 w-10 flex items-center justify-center rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                                        {React.createElement(LucideIcons[stat.icon] || LucideIcons.HelpCircle, { size: 20 })}
                                                    </div>
                                                ) : null}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                updateStatRow(index, 'icon', reader.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-1 text-[10px] text-slate-500 focus:ring-2 focus:ring-brand-primary file:mr-2 file:py-1 file:px-2 file:rounded border-none file:border-0 file:text-[10px] file:font-bold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-1/2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Top Label</label>
                                                <input type="text" value={stat.title} onChange={(e) => updateStatRow(index, 'title', e.target.value)} className="w-full border border-slate-300 rounded p-1 text-sm font-bold" />
                                            </div>
                                            <div className="w-1/2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Bottom Label</label>
                                                <input type="text" value={stat.subtitle} onChange={(e) => updateStatRow(index, 'subtitle', e.target.value)} className="w-full border border-slate-300 rounded p-1 text-sm text-slate-600 font-medium" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Metric Value</label>
                                            <input type="text" value={stat.value} onChange={(e) => updateStatRow(index, 'value', e.target.value)} className="w-full bg-brand-primary/5 text-brand-dark border border-brand-primary/20 rounded p-2 text-2xl font-black text-center" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: TESTIMONIALS */}
                    {activeTab === 'testimonials' && (
                        <motion.div key="testimonials" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Client Feedback cards</h3>
                                <button onClick={handleOpenAddTestimonial} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors"><Plus size={14} /> Add New</button>
                            </div>

                            <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-4 mb-8">
                                <h4 className="font-bold text-sm text-slate-700">Section Header</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Top Tag</label>
                                        <input type="text" value={testimonialHeader.tag} onChange={(e) => setTestimonialHeader({ ...testimonialHeader, tag: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Main Heading (use \n for line breaks)</label>
                                        <input type="text" value={testimonialHeader.title} onChange={(e) => setTestimonialHeader({ ...testimonialHeader, title: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {testimonials.map(t => (
                                    <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <img src={t.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" />
                                            <div>
                                                <h4 className="font-bold text-slate-800">{t.name} <span className="text-xs font-medium text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded ml-2">{t.designation}</span></h4>
                                                <p className="text-sm text-slate-600 italic mt-1 line-clamp-1 max-w-xl">"{t.quote}"</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleOpenEditTestimonial(t)} className="text-sm font-semibold text-brand-primary hover:underline">Edit</button>
                                            <button onClick={() => handleDeleteTestimonial(t.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* TAB: PARTNERS */}
                    {activeTab === 'partners' && (
                        <motion.div key="partners" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Strategic Partners Infinite Loop</h3>
                                    <p className="text-xs text-slate-500 mt-1">Deleting an item here instantly repaints the public Framer Motion carousel.</p>
                                </div>
                                <button onClick={handleOpenAddPartner} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors"><Plus size={14} /> Add Logo</button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {partners.map((p) => (
                                    <div key={p.id} className="relative group bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center hover:shadow-lg transition-all h-[120px]">
                                        <button
                                            onClick={() => handleDeletePartner(p.id)}
                                            className="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <img src={p.logo} alt={p.name} className="max-h-12 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" style={{ maxWidth: '80%' }} />
                                        <span className="absolute bottom-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Add Slide Modal */}
            <AnimatePresence>
                {isAddSlideModalOpen && (
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
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Image size={18} className="text-brand-primary" /> Add New Slide</h3>
                                <button onClick={handleCancelAddSlide} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Top Tag</label>
                                        <input type="text" value={newSlideData.tag} onChange={(e) => setNewSlideData({ ...newSlideData, tag: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Button Text</label>
                                        <input type="text" value={newSlideData.buttonText} onChange={(e) => setNewSlideData({ ...newSlideData, buttonText: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Slide Background Image</label>
                                        <div className="flex items-center gap-4">
                                            {newSlideData.image && (
                                                <img src={newSlideData.image} alt="Preview" className="h-10 w-16 object-cover rounded border border-slate-200 bg-slate-100 shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/jpeg, image/png, image/jpg"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            const imageUrl = URL.createObjectURL(file);
                                                            setNewSlideData({ ...newSlideData, image: imageUrl });
                                                        }
                                                    }}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-brand-primary file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 transition-colors cursor-pointer text-slate-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Headline</label>
                                        <input type="text" value={newSlideData.title} onChange={(e) => setNewSlideData({ ...newSlideData, title: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary font-bold" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Subheadline</label>
                                        <textarea rows="3" value={newSlideData.subtitle} onChange={(e) => setNewSlideData({ ...newSlideData, subtitle: e.target.value })} className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary resize-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                                <button onClick={handleCancelAddSlide} className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800 transition-colors text-sm">Cancel</button>
                                <button onClick={handleConfirmAddSlide} className="px-5 py-2 bg-brand-primary hover:bg-brand-dark text-white rounded-xl font-bold transition-all shadow-md text-sm flex items-center gap-2">
                                    <Plus size={16} /> Add to Slider
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Testimonial CRUD Modal */}
            <AnimatePresence>
                {isTestimonialModalOpen && (
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
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Type size={18} className="text-brand-primary" /> {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</h3>
                                <button onClick={() => setIsTestimonialModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Client Name</label>
                                        <input type="text" value={testimonialFormData.name} onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Designation</label>
                                        <input type="text" value={testimonialFormData.designation} onChange={(e) => setTestimonialFormData({ ...testimonialFormData, designation: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Avatar Image Upload</label>
                                        <div className="flex items-center gap-4">
                                            {testimonialFormData.avatar && (
                                                <img src={testimonialFormData.avatar} alt="Avatar Preview" className="h-12 w-12 object-cover rounded-full border border-slate-200 bg-slate-100 shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleTestimonialImageUpload}
                                                    className="w-full bg-white border border-slate-300 rounded-lg p-1 text-[10px] focus:ring-2 focus:ring-brand-primary file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 cursor-pointer text-slate-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Review Title</label>
                                        <input type="text" value={testimonialFormData.quote} onChange={(e) => setTestimonialFormData({ ...testimonialFormData, quote: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary font-bold" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-600 block mb-1">Full Feedback</label>
                                        <textarea rows="4" value={testimonialFormData.feedback} onChange={(e) => setTestimonialFormData({ ...testimonialFormData, feedback: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-primary leading-relaxed resize-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                                <button onClick={() => setIsTestimonialModalOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800 transition-colors text-sm">Cancel</button>
                                <button onClick={handleSaveTestimonial} className="px-5 py-2 bg-brand-primary hover:bg-brand-dark text-white rounded-xl font-bold transition-all shadow-md text-sm flex items-center gap-2">
                                    <Save size={16} /> {editingTestimonial ? "Save Changes" : "Create Testimonial"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Partner Modal */}
            <AnimatePresence>
                {isAddPartnerModalOpen && (
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
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Image size={18} className="text-brand-primary" /> Add New Partner</h3>
                                <button onClick={() => setIsAddPartnerModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">Partner Name</label>
                                    <input
                                        type="text"
                                        value={newPartnerData.name}
                                        onChange={(e) => setNewPartnerData({ ...newPartnerData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary"
                                        placeholder="e.g. Cisco"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">Logo Image Upload</label>
                                    <div className="flex flex-col gap-4">
                                        {newPartnerData.logo && (
                                            <div className="h-20 w-full flex items-center justify-center border border-dashed border-slate-300 rounded-xl bg-slate-50 p-4">
                                                <img src={newPartnerData.logo} alt="Preview" className="max-h-full object-contain" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePartnerLogoUpload}
                                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-brand-primary file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 cursor-pointer text-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                                <button onClick={() => setIsAddPartnerModalOpen(false)} className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800 transition-colors text-sm">Cancel</button>
                                <button onClick={handleConfirmAddPartner} className="px-5 py-2 bg-brand-primary hover:bg-brand-dark text-white rounded-xl font-bold transition-all shadow-md text-sm flex items-center gap-2">
                                    <Plus size={16} /> Add Partner
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default ManageHome;
