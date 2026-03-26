import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough
 * This component renders the Case Studies in a responsive CSS Grid.
 * It has been restored to its original stable design featuring:
 * - Background Image with Zoom (scale 1.1)
 * - Bottom Tag & Title content that fades on hover
 * - 'View Case Study' glassmorphism overlay on hover
 */
const CaseStudyGrid = () => {
    const { caseStudyPageData } = useContent();
    const caseStudies = caseStudyPageData?.caseStudies || [];

    return (
        <section className="py-20 bg-[#F8FAFC]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                {/* CSS Grid for the Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {caseStudies.map((study) => (
                        <div key={study.id} className="w-full">
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

export default CaseStudyGrid;
