import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough
 * This component renders the Case Studies Section with a manual Embla Carousel.
 * It has been restored to its original stable design featuring:
 * - Background Image with Zoom (scale 1.1)
 * - Bottom Tag & Title content that fades on hover
 * - 'View Case Study' glassmorphism overlay on hover
 */
const CaseStudySection = () => {
    const { caseStudyPageData } = useContent();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });
    
    const studies = caseStudyPageData?.caseStudies || [];

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="py-20 bg-[#F8FAFC] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-8 flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-6 py-2 rounded-full border border-brand-primary/20 bg-blue-50 shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary"></span>
                    <span className="font-bold text-[15.5px] tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-blue-600">Case Studies</span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={scrollPrev}
                        className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-primary transition-all duration-300 focus:outline-none relative group"
                        style={{
                            backgroundOrigin: "border-box",
                            backgroundClip: "padding-box, border-box"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundImage = "linear-gradient(#f8fafc, #f8fafc), linear-gradient(to right, #2563eb, #02a1fd)";
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
                            e.currentTarget.style.backgroundImage = "linear-gradient(#f8fafc, #f8fafc), linear-gradient(to right, #2563eb, #02a1fd)";
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

            <div
                className="embla overflow-hidden cursor-grab active:cursor-grabbing pb-12"
                ref={emblaRef}
            >
                <div className="embla__container flex touch-pan-y pt-4">
                    {studies.map((study) => (
                        <div key={study.id} className="embla__slide flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_28%] min-w-0 px-4">
                            <Link to={`/case-study/${study.id}`} className="block h-full w-full">
                                <motion.article
                                    whileHover="hover"
                                    className="relative h-[420px] md:h-[450px] lg:h-[480px] rounded-[2.5rem] overflow-hidden group shadow-md border border-slate-200 w-full"
                                >
                                    {/* Static Background Image with Frame Hover */}
                                    <motion.img
                                        variants={{ hover: { scale: 1.1 } }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        src={study.image}
                                        alt={study.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        draggable="false"
                                    />

                                    {/* Dark Gradient Overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1021]/90 via-[#0b1021]/30 to-transparent transition-opacity duration-300 group-hover:opacity-0"></div>

                                    {/* Content Layer positioned at the bottom */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end z-10 transition-opacity duration-300 group-hover:opacity-0">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {study.tags.map((tag, idx) => (
                                                <span key={idx} className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white/90 text-[10px] font-bold border border-white/10 shadow-sm uppercase tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-white font-bold text-lg leading-tight">
                                            {study.title}
                                        </h3>
                                    </div>

                                    {/* Hover Glassmorphism 'View Case Study' Overlay */}
                                    <motion.div
                                        variants={{ hover: { opacity: 1 } }}
                                        initial={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center pointer-events-none border border-white/20"
                                    >
                                        <motion.div
                                            variants={{ hover: { y: 0, opacity: 1 } }}
                                            initial={{ y: 20, opacity: 0 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                            className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-lg border border-white/30 px-7 py-3.5 rounded-full font-bold text-xs shadow-2xl"
                                        >
                                            <span>View Case Study</span>
                                            <ChevronRight size={20} />
                                        </motion.div>
                                    </motion.div>
                                </motion.article>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CaseStudySection;
