import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Target } from 'lucide-react';

/**
 * Code Walkthrough
 * This component renders the dynamic Hero section for a specific Case Study.
 * It receives the matched 'project' object as a prop to render its specific title, category, and background image.
 */
const CaseStudyDetailsHero = ({ project }) => {

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
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
            <div className="relative w-full h-[50vh] min-h-[380px] max-h-[500px] rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center bg-[#050B14] overflow-hidden shadow-2xl">

                {/* Project Specific Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center opacity-[0.35] grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-[#050B14]/60 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B14]/40 to-[#050B14]/90"></div>
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full pt-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center"
                    >
                        {/* Project Category Tag */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[13px] sm:text-sm font-semibold tracking-wide shadow-lg uppercase">
                                <Target size={16} strokeWidth={2.5} className="text-brand-primary" />
                                {project?.tags?.[0] || 'Uncategorized'}
                            </span>
                        </motion.div>

                        {/* Project Title */}
                        <motion.h1 variants={itemVariants} className="text-xl md:text-3xl lg:text-3xl font-bold text-white mb-8 tracking-tight drop-shadow-md leading-tight max-w-[95%]">
                            {project.title}
                        </motion.h1>

                        {/* Dynamic Breadcrumbs */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/70 text-[14px] font-medium">
                            <Link to="/" className="hover:text-white transition-colors drop-shadow-sm">Home</Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <Link to="/case-study" className="hover:text-white transition-colors drop-shadow-sm">Resources</Link>
                            <ChevronRight size={14} className="text-white/40" />
                            <span className="text-white/90 truncate max-w-[200px] md:max-w-[400px]">Case Study</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CaseStudyDetailsHero;
