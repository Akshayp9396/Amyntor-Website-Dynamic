import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../../context/ContentContext';

const GalleryGrid = () => {
    const { galleryPageData } = useContent();
    
    // 1. Sort the items dynamically so the newest date is always first
    const sortedImages = useMemo(() => {
        if (!galleryPageData?.images) return [];
        return [...galleryPageData.images].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [galleryPageData?.images]);

    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* CSS Masonry Engine */}
                {/* 
                    Using CSS multi-column layout allows items of varying native heights 
                    to stack tightly without vertical gaps, unlike CSS Grid.
                */}
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {sortedImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer bg-slate-100"
                        >
                            {/* Native Image, unrestricted height */}
                            <img
                                src={image.url}
                                alt={image.title}
                                className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                            />

                            {/* Remove Overlay per User Request, keeping only the image Zoom scale physics */}
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default GalleryGrid;
