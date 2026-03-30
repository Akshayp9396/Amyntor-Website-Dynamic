import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';

/**
 * Code Walkthrough
 * This component renders the Blogs Section as a highly professional manual mouse-drag slider.
 * 
 * Slider Physics (Embla):
 * - We enforce 'dragFree: true' so the user can flick the carousel with natural momentum and friction.
 * - 'loop: true' guarantees the user never hits a "dead end" wall when dragging.
 * - Autoplay is completely disabled for full manual control.
 * 
 * Zoom Hover Logic (Framer Motion):
 * - The parent <motion.article> uses `whileHover="hover"` to detect interaction.
 * - However, we specifically ONLY pass `{ scale: 1.1 }` to the <motion.img> child variants.
 * - This creates the premium "zoom-on-hover" effect exclusively on the image, leaving the text, 
 *   card boundaries, and layouts perfectly static as requested.
 */

const mockBlogs = [
    {
        id: 1,
        title: "Installation Sales Navigator Extension on Chrome",
        date: "February 22, 2026",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
        // category: "Cybersecurity"
    },
    {
        id: 2,
        title: "Business Growing Tips for Sales Globally",
        date: "February 22, 2026",
        image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800",
        // category: "Strategy"
    },
    {
        id: 3,
        title: "How to Install Droip into Local WP Server?",
        date: "February 22, 2026",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
        // category: "Development"
    },
    {
        id: 4,
        title: "Future of Cloud Security and AI Integration",
        date: "March 01, 2026",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        // category: "AI & Data"
    }
];

const BlogSection = () => {
    const [activeCard, setActiveCard] = useState(null);
    // Initialize Embla for a purely manual, physics-driven, infinite loop experience.
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="py-20 bg-[#F5F8FA]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8 flex items-center justify-between">
                    {/* Updated "Latest Blog" style badge layout matching Case Studies */}
                    <div className="inline-flex items-center space-x-2 px-6 py-2 rounded-full border border-brand-primary/20 bg-blue-50 shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
                        <span className="font-bold text-[15.5px] tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">Latest Blogs</span>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={scrollPrev}
                            className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-primary transition-all duration-300 focus:outline-none relative group"
                            style={{
                                backgroundOrigin: "border-box",
                                backgroundClip: "padding-box, border-box"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundImage = "linear-gradient(#f5f8fa, #f5f8fa), linear-gradient(to right, #2563eb, #02a1fd)";
                                e.currentTarget.style.borderColor = "transparent";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundImage = "none";
                                e.currentTarget.style.borderColor = "#e2e8f0"; // slate-200
                            }}
                        >
                            <ChevronLeft size={28} className="relative z-10 transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-primary transition-all duration-300 focus:outline-none relative group"
                            style={{
                                backgroundOrigin: "border-box",
                                backgroundClip: "padding-box, border-box"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundImage = "linear-gradient(#f5f8fa, #f5f8fa), linear-gradient(to right, #2563eb, #02a1fd)";
                                e.currentTarget.style.borderColor = "transparent";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundImage = "none";
                                e.currentTarget.style.borderColor = "#e2e8f0"; // slate-200
                            }}
                        >
                            <ChevronRight size={28} className="relative z-10 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>

                {/* Embla Slider Viewport (The Window) */}
                <div
                    className="embla overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4 pb-12 pt-4"
                    ref={emblaRef}
                >
                    {/* Embla Container (The sliding track) */}
                    <div className="embla__container flex touch-pan-y">
                        {mockBlogs.map((blog) => (
                            <div key={blog.id} className="embla__slide flex-[0_0_90%] sm:flex-[0_0_50%] lg:flex-[0_0_31%] min-w-0 px-4">
                                {/* The physical static card */}
                                <motion.article
                                    whileHover="hover" // Tracks hover state globally for children
                                    animate={activeCard === blog.id ? "hover" : "initial"}
                                    onMouseEnter={() => setActiveCard(blog.id)}
                                    onMouseLeave={() => setActiveCard(null)}
                                    onClick={() => setActiveCard(blog.id)}
                                    className={`bg-white rounded-[2.5rem] p-0 shadow-sm transition-shadow duration-300 group flex flex-col h-full overflow-hidden border border-slate-100 ${activeCard === blog.id ? 'shadow-xl' : 'hover:shadow-xl'}`}
                                >
                                    {/* Image Wrapper — Reduced height on mobile for compact cards */}
                                    <div className="relative h-[220px] md:h-[260px] mb-4 md:mb-8 bg-slate-100 overflow-hidden">

                                        {/* Zoom-Only Hover Image */}
                                        <motion.img
                                            variants={{ hover: { scale: 1.1 } }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                            draggable="false"
                                        />

                                        {/* Dynamic Cutout Date Badge Overlay */}
                                        <div className="absolute bottom-0 left-0 bg-white pr-6 pl-4 pt-4 rounded-tr-[2rem]">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
                                                <span className="text-[14px] font-bold text-[#0b1021]">{blog.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Static Content Body */}
                                    <div className="px-6 md:px-8 flex flex-col flex-grow bg-white">
                                        {/* Bold Heading (No text color change on hover) */}
                                        <h3 className="text-lg md:text-2xl font-bold text-[#0b1021] mb-4 md:mb-8 leading-snug">
                                            {blog.title}
                                        </h3>

                                        <div className="mt-auto pb-6 md:pb-8">
                                            <hr className="border-slate-100 mb-6" />
                                            {/* Explore More link (Gradient hover on text) */}
                                            <div className="flex items-center">
                                                <Link
                                                    to="/blogs"
                                                    onClick={(e) => {
                                                        if (activeCard !== blog.id) {
                                                            e.preventDefault();
                                                            setActiveCard(blog.id);
                                                        }
                                                    }}
                                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 text-[15px] font-bold text-slate-700 transition-colors duration-300 hover:shadow-sm ${activeCard === blog.id ? 'border-brand-primary' : 'group-hover:border-brand-primary'}`}
                                                >
                                                    <span className={`transition-all duration-300 ${activeCard === blog.id ? 'bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark' : 'group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-brand-primary group-hover:to-brand-dark'}`}>Read More</span>
                                                    <ArrowRight size={18} className={`transform transition-all duration-300 ${activeCard === blog.id ? 'translate-x-1 text-brand-primary' : 'group-hover:translate-x-1 group-hover:text-brand-primary'}`} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
