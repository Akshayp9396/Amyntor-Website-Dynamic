import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Share2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough
 * This component renders the Hero section of the Services page.
 * It is a precise architectural clone of AboutHero.jsx to ensure 100% theme parity and responsiveness.
 * Content is dynamically sourced from mockServicesPageData.
 */
const ServiceHero = () => {
    const { servicesPageData } = useContent();
    const hero = servicesPageData?.hero || {};

    // Framer Motion Variants for Staggered Entrance
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Sequential staggered entrance timing
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    return (
        <section className="w-full bg-[#F8FAFC] px-4 md:px-8 py-4 md:py-6">
            {/* Rounded Frame Wrapper spanning viewport minus padding */}
            <div className="relative w-full h-[50vh] min-h-[380px] max-h-[500px] rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden shadow-2xl">

                {/* Background Image with precise readable Overlays */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={hero.backgroundImage}
                        alt="Background"
                        className="w-full h-full object-cover object-[center_75%] opacity-[0.35]"
                    />
                    {/* Deep gradient overlays matching screenshot vibe */}
                    <div className="absolute inset-0 bg-[#050B14]/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/30 to-[#050B14]/90"></div>
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center"
                    >
                        {/* 1. Solid Blue Rounded Icon Badge */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary text-white text-[13px] sm:text-sm font-semibold tracking-wide shadow-lg shadow-brand-primary/25">
                                <Share2 size={16} strokeWidth={2.5} />
                                {hero.tag}
                            </span>
                        </motion.div>

                        {/* 2. Bold, Large Main Title */}
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
                            {hero.title}
                        </motion.h1>

                        {/* 3. Clean Text Breadcrumbs (No Box) */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/80 text-[15px] font-medium mb-12">
                            {hero.breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <Link to={crumb.link} className="hover:text-white transition-colors drop-shadow-sm">
                                        {crumb.label}
                                    </Link>
                                    {index < hero.breadcrumbs.length - 1 && (
                                        <ChevronRight size={14} className="text-white/60" />
                                    )}
                                </React.Fragment>
                            ))}
                        </motion.div>

                        {/* 4. Small Clean Tagline */}
                        <motion.p variants={itemVariants} className="text-[15px] md:text-base text-white/90 max-w-[85%] sm:max-w-2xl mx-auto leading-relaxed font-light drop-shadow-sm">
                            {hero.tagline}
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ServiceHero;
