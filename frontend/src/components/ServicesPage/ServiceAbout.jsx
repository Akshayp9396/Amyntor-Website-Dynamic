import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

/**
 * Code Walkthrough
 * The ServiceAbout component provides the introductory section for the Services page.
 * It strictly reuses the successful asymmetric top-grid layout structure from the AboutCompany component.
 */
const ServiceAbout = () => {
    const { servicesPageData } = useContent();
    const serviceIntro = servicesPageData?.serviceIntro || { features: [] };

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
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
                >
                    {/* Left Column: Title Area (4/12 width) */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <motion.div variants={slideUpVariants} className="inline-flex items-center space-x-2 w-max px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#D1E0FF] shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand-dark to-brand-primary"></div>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary font-bold text-xs md:text-sm uppercase tracking-[0.2em]">
                                {serviceIntro.tag}
                            </span>
                        </motion.div>
                        <motion.h2
                            variants={slideUpVariants}
                            className="text-3xl md:text-4xl lg:text-[40px] text-left font-extrabold text-[#0b1021] leading-[1.15] tracking-tight"
                        >
                            {serviceIntro.heading}
                        </motion.h2>
                    </div>

                    {/* Right Column: Paragraph and Features (8/12 width) */}
                    <div className="lg:col-span-8 flex flex-col justify-start gap-6 pt-6 lg:pt-4">
                        <motion.p variants={slideUpVariants} className="whitespace-pre-line text-slate-600 text-[15.5px] md:text-lg leading-relaxed w-full text-justify">
                            {serviceIntro.description}
                        </motion.p>

                        {/* Feature Bullets (Specific to Services) */}
                        <motion.div variants={slideUpVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            {serviceIntro.features?.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                        <CheckCircle2 size={14} className="text-brand-primary" strokeWidth={3} />
                                    </div>
                                    <span className="text-slate-800 font-medium text-[15px]">{feature}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default ServiceAbout;
