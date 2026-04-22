import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../../context/ContentContext';
import { ChevronLeft, Calendar, ArrowRight } from 'lucide-react';

/**
 * Code Walkthrough: GalleryGrid.jsx (Event-Powered Folder Edition)
 * 
 * Purpose: A world-class Dual-View gallery that organizes milestones into folders.
 * Features:
 * - selectedEvent State: Governs the switch between "Global Folders" and "Event Detail."
 * - Folder Cards: Professional 16:9 fixed-ratio previews with date/title metadata.
 * - Event Detail: High-readability masonry layout of milestone-specific images.
 * - Back Button: Sophisticated navigation architecture for a zero-friction UX.
 */
const GalleryGrid = () => {
    const { galleryPageData } = useContent();
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Filtered data for the specific event masonry view
    const sortedEvents = useMemo(() => {
        if (!galleryPageData?.events) return [];
        return [...galleryPageData.events].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [galleryPageData?.events]);

    // VIEW A: 🧭 GLOBAL EVENT FOLDERS
    if (!selectedEvent) {
        return (
            <section className="py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {sortedEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group cursor-pointer p-3 bg-white border border-slate-200 rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-500"
                                onClick={() => {
                                    setSelectedEvent(event);
                                }}
                            >
                                {/* 📸 PREVIEW FRAME: 16:9 FIXED RATIO */}
                                <div className="relative aspect-[16/9] rounded-[20px] overflow-hidden mb-4">
                                {event.previewImage ? (
                                    <img
                                        src={event.previewImage}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No Cover Attached</span>
                                    </div>
                                )}
                                    {/* Subdued Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute bottom-6 right-6 p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>

                                {/* 📝 FOLDER METADATA: CLEAN EDITORIAL */}
                                <div className="px-2">
                                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-3">
                                        <Calendar size={14} />
                                        {event.date && !isNaN(new Date(event.date)) ? new Date(event.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}).toUpperCase() : event.date}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                        {event.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // VIEW B: 📊 EVENT DETAIL MASONRY
    return (
        <section className="py-24 bg-white min-h-[60vh]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* 🏷️ NAVIGATION HUB: Elite Back Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 pb-8 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="p-3 rounded-full bg-slate-50 border border-slate-200 text-slate-900 hover:text-brand-primary hover:border-brand-primary transition-all group"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedEvent.title}</h2>
                        </div>
                    </div>
                </div>

                {/* 🛡️ MASONRY GRID: EVENT-SPECIFIC VISUALS */}
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    <AnimatePresence>
                        {selectedEvent.images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer bg-slate-100 border border-slate-200"
                            >
                                {image.url ? (
                                    <img
                                        src={image.url}
                                        alt={image.title}
                                        className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No Image Uploaded</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default GalleryGrid;
