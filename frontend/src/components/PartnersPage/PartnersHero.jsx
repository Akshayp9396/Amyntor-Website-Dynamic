import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Share2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import fallbackBg from '../../assets/images/resilience.jpg';

/**
 * Code Walkthrough: PartnersHero.jsx (Blog Style Synced)
 * 
 * Purpose: Matches the "Blogs" hero exactly as requested.
 * MISSION: Dynamic from database, with hardcoded fallbacks to prevent "grey box" issues.
 */
const PartnersHero = () => {
    const { partnersPageHero } = useContent();

    // 🛡️ ROBUST MAPPING: Ensure we always have content even if DB is syncing
    const heroData = partnersPageHero || {
        tag: "Strategic Alliances",
        title: "Our Partners",
        tagline: "Driving enterprise resilience through world-class partnerships.",
        backgroundImage: null
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const breadcrumbs = [
        { label: "Home", link: "/" },
        { label: "Resources", link: "#" }, 
        { label: "Partners", link: "/partners" }
    ];

    return (
        <section className="w-full bg-[#FAFCFF] px-4 md:px-8 py-4 md:py-6 font-sans">
            <div className="relative w-full h-[50vh] min-h-[380px] max-h-[500px] rounded-[3rem] flex flex-col items-center justify-center bg-[#0F172A] overflow-hidden shadow-2xl">
                
                {/* 📸 DYNAMIC BACKGROUND (Matches Blog aesthetic) */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={heroData.backgroundImage || fallbackBg} 
                        alt="Partners background" 
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 via-[#0F172A]/40 to-[#0F172A]/90"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center"
                    >
                        {/* 🛡️ BRANDED BADGE (Matches Blog 'Latest Insights' style) */}
                        <motion.div variants={itemVariants} className="mb-8">
                            <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white text-[13px] font-black tracking-widest uppercase shadow-lg shadow-blue-500/20 border border-blue-400/20">
                                <Share2 size={16} strokeWidth={3} className="animate-pulse" />
                                {heroData.tag || 'GLOBAL NETWORK'}
                            </span>
                        </motion.div>

                        {/* 📣 THE HEADLINE (Elite Bold White) */}
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                            {heroData.title || 'Our Partners'}
                        </motion.h1>

                        {/* 🧭 BREADCRUMBS (Centered & Clean) */}
                        <motion.div variants={itemVariants} className="flex items-center justify-center gap-x-4 text-white/70 text-[15px] font-bold mb-8">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <Link to={crumb.link} className="hover:text-white transition-colors duration-300">
                                        {crumb.label}
                                    </Link>
                                    {index < breadcrumbs.length - 1 && (
                                        <ChevronRight size={14} className="text-white/30" />
                                    )}
                                </React.Fragment>
                            ))}
                        </motion.div>

                        {/* 📄 TAGLINE (Lightweight & Refined) */}
                        <motion.p variants={itemVariants} className="text-base md:text-lg text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
                            {heroData.tagline || 'Collaborating with industry leaders to deliver world-class cybersecurity and digital transformation solutions.'}
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PartnersHero;
