import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { mockAboutPageData } from './aboutData';

/**
 * Code Walkthrough
 * This component renders the Team section for the About Us page.
 * It features a 3-column grid of team cards with a complex hover interaction.
 * On hover, the image receives a blue gradient overlay, social icons fade in, 
 * and the outer card container gains a blue solid outline, matching the provided UI screenshots.
 */
const AboutTeam = () => {
    const { aboutTeam } = mockAboutPageData;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } }
    };

    return (
        <section className="pt-24 pb-4 bg-[#F8FAFC]">
            <div className="max-w-[1300px] mx-auto px-4 md:px-8">

                {/* Section Header */}
                <div className="flex flex-col items-center text-center space-y-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand-primary/30 bg-white shadow-sm"
                    >
                        <CheckCircle2 size={16} strokeWidth={2.5} className="text-brand-dark" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary text-sm font-semibold tracking-wide">{aboutTeam.tag}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="whitespace-pre-line text-4xl md:text-5xl lg:text-[32px] font-bold text-[#0b1021] leading-tight max-w-4xl"
                    >
                        {aboutTeam.heading}
                    </motion.h2>
                </div>

                {/* Team Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "0px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
                >
                    {aboutTeam.members.map((member) => (
                        <motion.div
                            key={member.id}
                            variants={cardVariants}
                            className="group relative w-full max-w-[420px]"
                        >
                            {/* Outer Card Background: Smooth border transition on hover */}
                            <div className="relative p-3 pb-[4.5rem] rounded-[2.5rem] bg-white shadow-sm hover:shadow-[0_8px_30px_rgba(0,102,255,0.15)] transition-shadow duration-500 h-full flex flex-col justify-start">

                                {/* Animated SVG Draw Border (Splits top-left to meet bottom-right) */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" fill="none">
                                    <defs>
                                        <linearGradient id="teamBrandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop stopColor="#02a1fd" offset="0%" />
                                            <stop stopColor="#2563eb" offset="100%" />
                                        </linearGradient>
                                    </defs>
                                    {/* Line 1: Top & Right Edges (Draws 0 -> 50) */}
                                    <rect
                                        x="1.5" y="1.5"
                                        width="calc(100% - 3px)"
                                        height="calc(100% - 3px)"
                                        rx="38"
                                        pathLength="100"
                                        stroke="url(#teamBrandGradient)"
                                        strokeWidth="3"
                                        className="[stroke-dasharray:100] [stroke-dashoffset:100] group-hover:[stroke-dashoffset:50] transition-all duration-1000 ease-in-out"
                                    />
                                    {/* Line 2: Bottom & Left Edges (Draws 100 -> 50 backwards) */}
                                    <rect
                                        x="1.5" y="1.5"
                                        width="calc(100% - 3px)"
                                        height="calc(100% - 3px)"
                                        rx="38"
                                        pathLength="100"
                                        stroke="url(#teamBrandGradient)"
                                        strokeWidth="3"
                                        className="[stroke-dasharray:100] [stroke-dashoffset:-100] group-hover:[stroke-dashoffset:-50] transition-all duration-1000 ease-in-out"
                                    />
                                </svg>

                                {/* Image Container (Fully rounded so its bottom corners show besides the pill) */}
                                <div className="relative w-full aspect-[4/4.5] rounded-[2rem] overflow-hidden bg-[#0A1128] z-0">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* Overlapping Floating Nameplate (Pill Shape) */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[84%] bg-white rounded-2xl pt-5 pb-5 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] z-20 transition-transform duration-500 group-hover:-translate-y-2 translate-y-2 group-hover:translate-y-0">
                                    <h3 className="text-[20px] font-bold text-[#0b1021] mb-1">{member.name}</h3>
                                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary text-[14.5px] font-medium">{member.role}</p>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default AboutTeam;
