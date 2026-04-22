import React from 'react';
import { motion } from 'framer-motion';
import { Goal, Lightbulb, ShieldCheck } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

const iconMap = {
    Target: Goal,
    Eye: Lightbulb,
    Diamond: ShieldCheck
};

const AboutCompany = () => {
    const { aboutPageData } = useContent();
    const aboutCompany = aboutPageData?.aboutCompany;

    if (!aboutCompany) return null;

    // Framer Motion staggered entrance
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const slideUpVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeInOut" } }
    };

    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Top Text Cluster (Asymmetrical Grid for wider right column) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 items-start lg:pb-8"
                >
                    {/* Left Column: Title Area (Takes up 4/12 of space) */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <motion.div variants={slideUpVariants} className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#D1E0FF] w-fit">
                            <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary font-semibold text-sm uppercase tracking-[0.2em]">{aboutCompany.tag}</span>
                        </motion.div>
                        <motion.h2
                            variants={slideUpVariants}
                            className="text-2xl md:text-3xl lg:text-4xl text-left font-extrabold text-[#0b1021] leading-[1.15] tracking-tight "
                        >
                            {aboutCompany.heading}
                        </motion.h2>
                    </div>

                    {/* Right Column: Paragraphs (Takes up 8/12 of space) */}
                    <div className="lg:col-span-8 flex flex-col justify-start gap-6 pt-6 lg:pt-4">
                        <motion.p variants={slideUpVariants} className="text-slate-600 text-[15.5px] md:text-lg leading-relaxed w-full text-justify whitespace-pre-line">
                            {aboutCompany.description1}
                        </motion.p>
                        {aboutCompany.description2 && (
                            <motion.p variants={slideUpVariants} className="text-slate-600 text-[15.5px] md:text-lg leading-relaxed w-full whitespace-pre-line">
                                {aboutCompany.description2}
                            </motion.p>
                        )}
                    </div>
                </motion.div>

                {/* Horizontal Rows List Strategy - With Light BG color distinct cards */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    variants={containerVariants}
                    className="flex flex-col w-full"
                >
                    {/* SVG Gradient Definition for Lucide Icons */}
                    <svg width="0" height="0" className="absolute">
                        <linearGradient id="amyntorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop stopColor="#0b1021" offset="0%" />
                            <stop stopColor="#0066ff" offset="100%" />
                        </linearGradient>
                    </svg>

                    {aboutCompany.cards.map((card, index) => {
                        const IconComponent = iconMap[card.icon] || Goal;

                        return (
                            <motion.div
                                key={card.id}
                                variants={slideUpVariants}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 p-8 lg:p-12 mb-6 bg-[#F8FAFC] border border-slate-100 rounded-3xl items-center group"
                            >
                                {/* Left Section: Icon & Title */}
                                <div className="lg:col-span-4 flex items-center gap-6">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                        {card.icon?.startsWith('data:image') || card.icon?.startsWith('/') || card.icon?.startsWith('http') 
                                            ? <img src={card.icon} alt="" className="w-full h-full object-contain" />
                                            : <IconComponent size={36} strokeWidth={1.5} color="url(#amyntorGradient)" />
                                        }
                                    </div>
                                    <h3 className="text-[24px] md:text-[28px] font-bold text-[#0b1021] tracking-tight">
                                        {card.title}
                                    </h3>
                                </div>

                                {/* Right Section: Detailed Content text */}
                                <div className="lg:col-span-8 flex items-center">
                                    <p className="text-slate-600 text-[15.5px] leading-[1.8] font-medium text-justify w-full max-w-5xl whitespace-pre-line">
                                        {card.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
};

export default AboutCompany;
